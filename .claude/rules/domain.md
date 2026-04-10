---
globs: packages/domain/src/**/*.ts
description: 도메인 패키지(상수·타입·에러) 작성/수정 시 자동 참조되는 규칙
---

# Domain Rules 규칙

> 적용 대상: `packages/domain/src/`
> 참고: CLAUDE.md §10 Domain Rules, §4 Forbidden Patterns

## 요약
모든 도메인 상수, 타입, 에러 코드, 비즈니스 규칙은 `packages/domain`에서 정의한다.
앱 코드에서 숫자/문자열을 하드코딩하지 않고 이 패키지의 상수를 참조한다.

## 상수 정의 (packages/domain/src/constants/index.ts)

```typescript
// 원단 검사 — 4점법
export const FOUR_POINT_THRESHOLD = 28  // pts/100m (M-3: 이 상수 사용 필수)

// 소재별 릴렉싱 시간 (시간 단위) — M-4: 하드코딩 금지
export const RELAXATION_HOURS: Record<string, number> = {
  COTTON: 48,
  LINEN: 48,
  POLY: 24,
  WOOL: 72,
}

// Bundle 수량 (M-2: SMV 등 상수 하드코딩 금지)
export const BUNDLE_QTY_DEFAULT = 100
export const BUNDLE_QTY_MIN = 80
export const BUNDLE_QTY_MAX = 150

// PWA 오프라인 허용 시간
export const OFFLINE_MAX_HOURS = 2

// 데이터 아카이브 기간
export const ARCHIVE_ORDER_DAYS = 180
export const ARCHIVE_MATERIAL_DAYS = 90
export const ERP_QUEUE_ARCHIVE_DAYS = 90

// LOT 번호 형식
export const LOT_NO_FORMAT = '{order}-L{serial:03d}'

// 교정/평가 주기
export const MFZ_MAINTENANCE_CYCLE = 'monthly'
export const SKILL_MATRIX_UPDATE_CYCLE = 'quarterly'
```

## LOT 상태 전이 규칙
```typescript
// packages/domain/src/models/lot.model.ts
export type LotStatus =
  | 'CUTTING'
  | 'READY_FOR_SEW'
  | 'SEWN'
  | 'QC'
  | 'PASSED_QC'
  | 'MFZ_HOLD'      // C-7: FinishingService.recordMFZ() 만이 설정 가능
  | 'READY_PACK'
  | 'PACKED'
  | 'SHIPPED'

// 허용 전이 맵
export const LOT_STATUS_TRANSITIONS: Record<LotStatus, LotStatus[]> = {
  CUTTING:       ['READY_FOR_SEW'],
  READY_FOR_SEW: ['SEWN'],
  SEWN:          ['QC'],
  QC:            ['PASSED_QC', 'SEWN'],  // 재작업 허용
  PASSED_QC:     ['MFZ_HOLD', 'READY_PACK'],
  MFZ_HOLD:      ['PASSED_QC'],           // 재검사 통과 시만
  READY_PACK:    ['PACKED'],
  PACKED:        ['SHIPPED'],
  SHIPPED:       [],                      // 종료 상태
}

export function canTransition(from: LotStatus, to: LotStatus): boolean {
  return LOT_STATUS_TRANSITIONS[from].includes(to)
}
```

## Forbidden Pattern 검사 대상 (domain-validate.sh)
```bash
# C-1: AQL/DHU 숫자 하드코딩 검사
grep -rn "dhu > [0-9]" apps/ packages/ | grep -v "\.test\."
grep -rn "aql.*[0-9]\." apps/ packages/ | grep -v "\.test\."

# C-2: 임금 계산 금지
grep -rn "hourlyRate\|wage\|salary" apps/api/src/services/

# C-3: Service에서 Prisma 직접 접근
grep -rn "this\.prisma\." apps/api/src/services/ | grep -v "\.test\."

# M-3: FOUR_POINT_THRESHOLD 대신 28 직접 사용
grep -rn "[^A-Z_]28[^0-9]" apps/api/src/ | grep -v "test\|mock"

# M-4: 릴렉싱 시간 하드코딩
grep -rn "48\|72\|24" apps/api/src/ | grep -i "relaxat" | grep -v "HOURS"
```

## 패키지 구조
```
packages/domain/src/
├── constants/
│   └── index.ts          # 모든 도메인 상수
├── models/
│   ├── lot.model.ts      # LotStatus, 전이 규칙
│   ├── work-order.ts     # ISA-95 WorkOrder 상속
│   └── qc.model.ts       # QC 단계, DHU 계산
├── schemas/
│   ├── erp.schema.ts     # ERP 수신 Zod 스키마
│   ├── lot.schema.ts     # LOT 생성/수정 스키마
│   └── common.schema.ts  # 공통 스키마
├── errors/
│   └── index.ts          # Result<T,E>, DomainError, 에러 코드
└── __tests__/
    └── properties.test.ts # fast-check 6개 속성
```
