---
globs: apps/api/src/erp/**/*.ts,apps/api/src/jobs/**/*.ts
description: ERP 연동 파일 작성/수정 시 자동 참조되는 규칙
---

# ERP Integration 규칙

> 적용 대상: `apps/api/src/erp/`, `apps/api/src/jobs/`
> 참고: CLAUDE.md §9 ERP Integration, ADR-006, ADR-011

## 요약
ERP와의 5종 양방향 연동을 관리한다. ERP는 유일한 마스터 원천이다 (ADR-011).
모든 ERP 수신 데이터는 Zod로 파싱 후 스테이징 저장, MES 자체 모델 생성 금지.

## 규칙

### 1. ERP→MES 수신 (idempotent upsert)
```typescript
// apps/api/src/erp/order-sync.ts
import { ERPOrderSchema } from '@garment-mes/domain'

export async function receiveOrder(raw: unknown) {
  // C-4: Zod 파싱 필수
  const parsed = ERPOrderSchema.safeParse(raw)
  if (!parsed.success) {
    logger.error('ERP 오더 파싱 실패', parsed.error)
    return { ok: false, error: parsed.error }
  }

  // Layer A 스테이징 저장 (upsert — idempotent)
  await prisma.erpIfOrder.upsert({
    where: { erpOrderNo: parsed.data.ORDER_NO },
    create: {
      erpOrderNo: parsed.data.ORDER_NO,
      buyerCode: parsed.data.BUYER_CODE,
      orderedQty: parsed.data.ORDERED_QTY,
      shipDate: new Date(parsed.data.SHIP_DATE),
      ifStatus: 'RECEIVED',
      dataStatus: 'ACTIVE'
    },
    update: { ifStatus: 'RECEIVED' }
  })
  return { ok: true }
}
```

### 2. 자재 코드 — ERP 드롭다운만 (C-6, ADR-011)
```typescript
// ❌ 절대 금지 — MES Admin에서 자재 코드 생성
await prisma.erpIfMaterial.create({ data: { materialCode: '...', ... } })

// ✅ ERP에서 수신한 목록만 드롭다운에 제공
async function getMaterialDropdown(erpOrderId: string) {
  return prisma.erpIfMaterial.findMany({
    where: { erpOrderId, dataStatus: 'ACTIVE' }
  })
}
```

### 3. MES→ERP 전송 (Layer D 큐 → SQS)
```typescript
// apps/api/src/jobs/erp-send.job.ts — 매일 자정 cron
export async function sendDailyLineResults(date: string) {
  const summaries = await prisma.lineDailySummary.findMany({
    where: { workDate: date }
  })

  for (const s of summaries) {
    await prisma.erpLineResultQueue.create({
      data: {
        entityType: 'LINE_PRODUCTION_RESULT',
        payload: {
          line_code: s.lineCode,
          work_date: date,
          total_output: s.totalOutput,
          total_defect: s.totalDefect
          // 임금 계산 절대 포함 금지 (C-2, ADR-005)
        },
        sentStatus: 'PENDING'
      }
    })
  }
  // SQS 큐 → ERP API POST
}
```

### 4. W3 전 ERP API 미수령 시 — Mock ERP (ADR-006)
```typescript
// apps/api/src/erp/mock-erp.ts (W3 전 사용)
export const mockOrders: ERPOrder[] = [
  { ORDER_NO: 'ORD-2024-001', BUYER_CODE: 'NIKE', ORDERED_QTY: 500, ... },
  // ERP 샘플 10건 기반
]
```
- W3 전 미수령 → `ADR-006-MOCK` 상태로 notes/decisions.md 업데이트
- W13에 실 연동 전환 시 Mock 코드 제거

### 5. 5종 IF 처리 순서
1. `erp/order-sync.ts` — 오더 (W5)
2. `erp/style-sync.ts` — 스타일·BOM (W5)
3. `erp/material-sync.ts` — 자재코드 + 드롭다운 갱신 (W5)
4. `jobs/line-result-send.job.ts` — 라인 실적 전송 (W11)
5. `jobs/shipment-result-send.job.ts` — 출하 실적 전송 (W14)

### 6. 아카이브 cron (Layer A)
```typescript
// jobs/erp-archive.job.ts
// 매일: 오더 완료 + 180일 → ARCHIVED
// 매일: 자재 재고 0 + 90일 → ARCHIVED
// 매일: 전송큐 전송완료 + 90일 → ARCHIVED
```
