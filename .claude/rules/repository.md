---
globs: apps/api/src/repositories/**/*.ts
description: Repository 파일 작성/수정 시 자동 참조되는 규칙
---

# Repository 레이어 규칙

> 적용 대상: `apps/api/src/repositories/*.ts`
> 참고: CLAUDE.md §4 C-3 (Service에서 Prisma 직접 접근 금지)

## 요약
데이터베이스 CRUD를 담당하는 계층. PrismaClient를 생성자로 주입받아 사용한다.
Service에서 Prisma를 직접 호출하지 않도록 반드시 Repository를 경유한다 (C-3).

## 규칙

### 1. 인터페이스 + 구현체 패턴 (테스트 Mock 교체 가능)
```typescript
// 인터페이스 정의 (packages/domain/src/repositories/)
export interface ILotRepository {
  findById(id: string): Promise<GarmentLot | null>
  findByLotNo(lotNo: string): Promise<GarmentLot | null>
  create(data: CreateLotData): Promise<GarmentLot>
  updateStatus(id: string, status: LotStatus): Promise<GarmentLot>
}

// 구현체 (apps/api/src/repositories/)
export class LotRepository implements ILotRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.garmentLot.findUnique({ where: { id } })
  }

  async findByLotNo(lotNo: string) {
    return this.prisma.garmentLot.findUnique({ where: { lotNo } })
  }

  async create(data: CreateLotData) {
    return this.prisma.garmentLot.create({
      data: { ...data, dataStatus: 'PERMANENT' }  // Layer C 필수
    })
  }
}
```

### 2. 파일/클래스 네이밍
- 파일: `{domain}.repository.ts` (예: `lot.repository.ts`)
- 인터페이스: `I{Domain}Repository`
- 구현체: `{Domain}Repository`

### 3. LOT 완전 추적 쿼리 (N+1 방지)
```typescript
async findWithFullTrace(lotNo: string) {
  return this.prisma.garmentLot.findUniqueOrThrow({
    where: { lotNo },
    include: {
      erpIfOrder: { include: { erpIfStyle: true } },
      bundles: { include: { materialReceipt: true } },
      lineOutputs: true,
      qcInspections: true,
      mfzRecords: true,
    }
  })
}
```

### 4. 세션 관리 규칙
- Repository에서 `commit()` 하지 않는다 — Service 레이어에서 트랜잭션 관리
- `$transaction`은 Service에서 호출, Repository는 단일 작업만

### 5. soft delete 없음
- Layer C는 삭제 불가 (DB 트리거)
- Layer B는 `isActive = false` (물리 삭제 대신)
