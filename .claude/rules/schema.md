---
globs: packages/domain/src/**/*.ts,apps/api/src/**/*.schema.ts
description: Zod 스키마 및 TypeScript 타입 작성/수정 시 자동 참조되는 규칙
---

# Zod Schema & TypeScript 타입 규칙

> 적용 대상: `packages/domain/src/`, `apps/api/src/**/*.schema.ts`
> 참고: CLAUDE.md §4 C-4 (Zod 없는 외부 입력 금지)

## 요약
Zod로 런타임 검증 스키마를 정의하고 TypeScript 타입을 자동 추론한다.
spec.yaml에서 자동생성된 타입과 일치해야 한다.

## 규칙

### 1. ERP 수신 스키마 (C-4 필수)
```typescript
// packages/domain/src/schemas/erp.schema.ts
import { z } from 'zod'

export const ERPOrderSchema = z.object({
  ORDER_NO: z.string().min(1),
  BUYER_CODE: z.string().min(1),
  STYLE_CODE: z.string().min(1),
  ORDERED_QTY: z.number().int().positive(),
  SHIP_DATE: z.string().datetime(),
})

export type ERPOrder = z.infer<typeof ERPOrderSchema>

// 사용
const parsed = ERPOrderSchema.safeParse(rawData)
if (!parsed.success) {
  logger.error('ERP 오더 파싱 실패', parsed.error)
  return
}
```

### 2. 도메인 스키마 패턴
```typescript
// packages/domain/src/schemas/lot.schema.ts
export const CreateLotSchema = z.object({
  erpIfOrderId: z.string().uuid(),
  colorCode: z.string().min(1).max(20),
  orderQty: z.number().int().positive(),
})

export const LotStatusSchema = z.enum([
  'CUTTING', 'READY_FOR_SEW', 'SEWN', 'QC',
  'PASSED_QC', 'MFZ_HOLD', 'READY_PACK', 'PACKED', 'SHIPPED'
])

export type CreateLot = z.infer<typeof CreateLotSchema>
export type LotStatus = z.infer<typeof LotStatusSchema>
```

### 3. 파일/타입 네이밍
- 파일: `{domain}.schema.ts`
- 스키마: `{Action}{Domain}Schema` (예: `CreateLotSchema`, `RecordLineOutputSchema`)
- 타입: `z.infer<typeof {Schema}>` 자동 추론 사용

### 4. 공유 타입 위치
- `packages/domain/src/schemas/` — 프론트·백 공유 스키마
- `packages/domain/src/constants/` — 도메인 상수 (§10)
- `packages/domain/src/errors/` — DomainError 코드

### 5. ISA-95 WorkOrder 상속 (ADR-007)
```typescript
// packages/domain/src/models/work-order.ts
export interface WorkOrder {
  workOrderID: string
  workOrderType: 'PRODUCTION' | 'REWORK' | 'MAINTENANCE'
  status: 'PLANNED' | 'RELEASED' | 'STARTED' | 'COMPLETED'
}

export interface GarmentLot extends WorkOrder {
  lotNo: string
  colorCode: string
  lotStatus: LotStatus
}
```

### 6. TypeScript strict 모드 필수
```json
// tsconfig.json
{ "compilerOptions": { "strict": true, "strictNullChecks": true } }
```
