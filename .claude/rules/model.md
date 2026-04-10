---
globs: packages/db/prisma/schema.prisma
description: Prisma 스키마 작성/수정 시 자동 참조되는 규칙
---

# Prisma Schema 규칙

> 적용 대상: `packages/db/prisma/schema.prisma`
> 참고: CLAUDE.md §11 Data Lifecycle — Layer A~D 엄격 구분

## 요약
Prisma로 PostgreSQL 스키마를 정의한다. 모든 테이블은 Layer A~D 중 하나에 속한다.
Layer C 테이블은 `dataStatus = 'PERMANENT'`이며 DB 트리거로 삭제 불가.

## Layer 분류 예시

### Layer A — ERP Origin (오더 완료+180일 ARCHIVED)
```prisma
model ErpIfOrder {
  id         String   @id @default(uuid())
  erpOrderNo String   @unique
  buyerCode  String
  orderedQty Int
  shipDate   DateTime
  ifStatus   String   @default("RECEIVED")  // RECEIVED | ARCHIVED
  dataStatus String   @default("ACTIVE")    // ACTIVE | ARCHIVED
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  @@map("erp_if_orders")
}
```

### Layer C — MES 영구 기록 (절대 삭제 불가)
```prisma
model GarmentLot {
  id                String   @id @default(uuid())
  lotNo             String   @unique   // {order}-L{serial:03d}
  erpIfOrderId      String
  colorCode         String
  orderQty          Int
  actualQty         Int      @default(0)
  lotStatus         String   @default("CUTTING")
  // CUTTING | READY_FOR_SEW | SEWN | QC | PASSED_QC
  // MFZ_HOLD | READY_PACK | PACKED | SHIPPED
  mfzCheckCompleted Boolean  @default(false)
  dataStatus        String   @default("PERMANENT")  // 절대 변경 금지
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  erpIfOrder    ErpIfOrder    @relation(fields: [erpIfOrderId], references: [id])
  lineOutputs   LineOutput[]
  qcInspections QcInspection[]
  mfzRecords    MfzRecord[]
  @@map("garment_lots")
}
```

## 공통 규칙

### 1. 네이밍
- DB 컬럼: `snake_case` (`@@map`, `@map` 사용)
- TypeScript 필드: `camelCase`
- 상태 필드: String (CLAUDE.md §10 도메인 상수와 일치)

### 2. Layer C 필수
- `dataStatus String @default("PERMANENT")` — 모든 Layer C 테이블 필수
- DB 트리거 `trg_protect_permanent` 로 DELETE 차단 (Gate 1·3·4 검증)

### 3. 인덱스
- LOT 추적 필수: `lotNo`, `erpIfOrderId`, `colorCode`
- 성능: 자주 조회되는 컬럼에 `@@index`

### 4. 마이그레이션
```bash
bunx prisma migrate dev --name "설명"
# 네이밍: add_garment_lot | add_mfz_column
```
- M6 (W15) 이후 스키마 변경은 비용이 급증하므로 신중하게
