# ERP IF 명세 — 5종 양방향 연동

> 기준: CLAUDE.md §9, ADR-006, ADR-011
> 상태: **초안** — W3 전 ERP 담당자로부터 실제 샘플 수령 후 업데이트 필요
> 담당: ERP 담당자 협의 (W1 Day1 오후 착수)

---

## ERP→MES 수신 (3종)

### 1. 오더 (ERP_IF_ORDER)

| 필드명 | 타입 | 설명 | 필수 |
|--------|------|------|------|
| ORDER_NO | string | ERP 오더 번호 (PK) | ✅ |
| BUYER_CODE | string | 바이어 코드 | ✅ |
| STYLE_CODE | string | 스타일 코드 | ✅ |
| ORDERED_QTY | number | 오더 수량 | ✅ |
| SHIP_DATE | string (ISO8601) | 납기일 | ✅ |
| BUYER_QC_CONFIG | object | 바이어별 QC 기준 (DHU, AQL) | ✅ |

```typescript
// Zod 스키마 위치: packages/domain/src/schemas/erp.schema.ts
export const ERPOrderSchema = z.object({
  ORDER_NO: z.string().min(1),
  BUYER_CODE: z.string().min(1),
  STYLE_CODE: z.string().min(1),
  ORDERED_QTY: z.number().int().positive(),
  SHIP_DATE: z.string().datetime(),
})
```

### 2. 스타일·BOM (ERP_IF_STYLE)

| 필드명 | 타입 | 설명 | 필수 |
|--------|------|------|------|
| STYLE_CODE | string | 스타일 코드 (PK) | ✅ |
| STYLE_NAME | string | 스타일명 | ✅ |
| BOM | array | BOM 구성 (자재코드, 수량) | ✅ |
| PROCESS_SEQ | array | 공정 순서 | ✅ |

### 3. 자재코드 (ERP_IF_MATERIAL)

| 필드명 | 타입 | 설명 | 필수 |
|--------|------|------|------|
| MATERIAL_CODE | string | 자재 코드 (PK) | ✅ |
| MATERIAL_NAME | string | 자재명 | ✅ |
| MATERIAL_TYPE | string | 소재 유형 (COTTON/LINEN/POLY/WOOL) | ✅ |
| BOM_QTY | number | BOM 소요량 | ✅ |

> **C-6 준수**: MES에서 자재 코드 직접 생성 금지. 이 테이블 수신 데이터만 드롭다운에 제공.

---

## MES→ERP 전송 (2종)

### 4. 라인별 팀 실적 (ERP_LINE_RESULT_QUEUE)

전송 주기: **매일 자정 SQS**

| 필드명 | 타입 | 설명 |
|--------|------|------|
| line_code | string | 라인 코드 |
| work_date | string | 작업일 (YYYY-MM-DD) |
| total_output | number | 총 생산량 |
| total_defect | number | 총 불량수 |

> **C-2 준수**: 임금 관련 필드 절대 포함 금지 (hourlyRate, wage, salary).

### 5. 출하 실적 (ERP_SHIPMENT_QUEUE)

전송 주기: **출하 완료 즉시 SQS**

| 필드명 | 타입 | 설명 |
|--------|------|------|
| lot_no | string | LOT 번호 |
| order_no | string | ERP 오더 번호 |
| shipped_qty | number | 출하 수량 |
| shipped_at | string | 출하 일시 (ISO8601) |
| bl_no | string | B/L 번호 |

---

## W3 전 ERP API 미수령 시 — Mock ERP (ADR-006)

- `apps/api/src/erp/mock-erp.ts` 에 샘플 10건 구성
- W13 실 연동 전환 시 Mock 코드 제거
- 현재 상태: `notes/decisions.md`에 `ADR-006-MOCK` 상태 기록 필요

---

## 수령 체크리스트

- [ ] ERP ORDER 샘플 10건 수령 (W3 전)
- [ ] ERP STYLE/BOM 샘플 수령
- [ ] ERP MATERIAL 샘플 수령
- [ ] API 방식 확정 (REST/SOAP/File)
- [ ] IF 필드 매핑 ERP 담당자 서명 (W14)
