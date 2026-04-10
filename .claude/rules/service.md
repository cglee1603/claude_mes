---
globs: apps/api/src/services/**/*.ts
description: Service 파일 작성/수정 시 자동 참조되는 규칙
---

# Service 레이어 규칙

> 적용 대상: `apps/api/src/services/*.ts`
> 참고: CLAUDE.md §5 Service Boundaries, §8 Error Handling

## 요약
비즈니스 로직을 처리하는 계층. Repository를 통해 데이터에 접근하고 트랜잭션을 관리한다.
모든 메서드는 `Result<T, DomainError>` 패턴을 반환한다 (ADR-001).

## 규칙

### 1. 파일/클래스 네이밍
- 파일: `{domain}.service.ts`
- 클래스: `{Domain}Service`
- `/scaffold-service {name}` 으로 자동생성 권장

### 2. Result<T, DomainError> 패턴 (H-3 위반 시 PR 차단)
```typescript
import type { Result, DomainError } from '@garment-mes/domain'

export class ProductionService {
  constructor(
    private lotRepo: ILotRepository,
    private prisma: PrismaClient  // 트랜잭션용
  ) {}

  async recordLineOutput(p: LineOutputParams): Promise<Result<LineOutput, DomainError>> {
    // 1. 유효성 검증
    const lot = await this.lotRepo.findById(p.lotId)
    if (!lot) return { ok: false, error: { code: 'NOT_FOUND', message: `LOT ${p.lotId} 없음` } }
    if (lot.lotStatus !== 'READY_FOR_SEW')
      return { ok: false, error: { code: 'INVALID_STATUS', message: '봉제 투입 불가 상태' } }

    // 2. 트랜잭션 처리
    const output = await this.prisma.$transaction(async tx => {
      const o = await tx.lineOutput.create({
        data: {
          lotId: p.lotId,
          lineId: p.lineId,
          periodStart: p.periodStart,
          periodEnd: p.periodEnd,
          outputQty: p.outputQty,
          defectQty: p.defectQty,
          workerId: p.workerId ?? null,   // nullable — ADR-013
          recordedBy: p.lineManagerId,    // 라인장 필수
          dataStatus: 'PERMANENT'         // Layer C
        }
      })
      await tx.garmentLot.update({
        where: { id: p.lotId },
        data: { actualQty: { increment: p.outputQty } }
      })
      return o
    })

    return { ok: true, value: output }
  }
}
```

### 3. MFZ Zero Policy — 유일 진입점 (C-7)
```typescript
// FinishingService.recordMFZ() 만이 MFZ_HOLD를 설정할 수 있다
async recordMFZ(p: MfzParams): Promise<Result<MfzRecord, DomainError>> {
  if (p.detectedCount > 0) {
    await this.prisma.$transaction(async tx => {
      // LOT 즉시 MFZ_HOLD (C-7 유일 진입점)
      await tx.garmentLot.update({
        where: { id: p.lotId },
        data: { lotStatus: 'MFZ_HOLD' }
      })
      await tx.mfzRecord.create({
        data: { ...p, dataStatus: 'PERMANENT' }
      })
    })
  }
  return { ok: true, value: record }
}
```

### 4. 출하 차단 (ShipmentService 필수)
```typescript
async confirmShipment(p: ShipmentParams): Promise<Result<Shipment, DomainError>> {
  const lot = await this.lotRepo.findById(p.lotId)
  if (lot?.lotStatus === 'MFZ_HOLD')
    return { ok: false, error: {
      code: 'LOT_MFZ_HOLD',
      message: 'MFZ 재검사 완료 후 출하 가능'
    }}
  // ...
}
```

### 5. 임금 계산 절대 금지 (C-2 — ADR-005)
```typescript
// ❌ 절대 금지
const wage = worker.hourlyRate * hours

// ✅ ERP 전송 데이터만 준비 (임금 계산은 ERP에서)
await this.erpQueue.enqueue({
  entityType: 'LINE_PRODUCTION_RESULT',
  payload: { line_code, work_date, total_output, total_defect }
  // 임금 관련 필드 포함 금지
})
```

### 6. 서비스 의존 방향 (C-5)
- 상위 Service에서 하위만 호출 가능 (단방향)
- `MaterialService → CuttingService → ProductionService → ...`
- 역방향 호출 시 @domain-validator C-5 감지 → PR 차단
