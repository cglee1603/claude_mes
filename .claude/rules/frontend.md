---
globs: frontend/src/**/*.{ts,tsx,css}
description: 프론트엔드 파일 작성/수정 시 자동 참조되는 규칙
---

# Frontend 레이어 규칙

> 적용 대상: `frontend/src/**/*.{ts,tsx,css}`

## 요약
React + TypeScript 기반 SPA. 백엔드 API(`/api/v1/`)와 통신하며 MES 화면을 구성한다.

## 디렉토리 구조

```
frontend/src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── common/          # Button, Table, Modal, Form 등 공통 컴포넌트
│   └── layout/          # Header, Sidebar, MainLayout 등 레이아웃
├── pages/               # 라우트 단위 페이지 컴포넌트
├── hooks/               # 커스텀 React 훅
├── services/            # API 호출 함수 (fetch/axios 래퍼)
├── types/               # TypeScript 타입/인터페이스 정의
├── utils/               # 유틸리티 함수 (날짜 포맷, 숫자 변환 등)
├── styles/              # 글로벌 스타일, 테마
└── assets/              # 이미지, 아이콘 등 정적 리소스
```

## 규칙

### 1. 파일/컴포넌트 네이밍
- 컴포넌트 파일: `PascalCase.tsx` (예: `ProductionOrderList.tsx`)
- 훅 파일: `use{기능}.ts` (예: `useProductionOrders.ts`)
- 서비스 파일: `{도메인}.ts` (예: `productionOrder.ts`)
- 타입 파일: `{도메인}.ts` (예: `productionOrder.ts`)
- 유틸 파일: `camelCase.ts` (예: `dateFormat.ts`)
- 페이지 파일: `{Domain}Page.tsx` 또는 `{Domain}ListPage.tsx`

### 2. 컴포넌트 규칙
- 함수형 컴포넌트만 사용 (class 컴포넌트 금지).
- Props는 인터페이스로 정의: `interface {Component}Props`.
- 컴포넌트당 하나의 파일. 300줄 초과 시 분리 검토.
- 상태 관리: 로컬은 `useState`, 서버 데이터는 커스텀 훅.

### 3. API 통신 (services/)
- 모든 API 호출은 `services/` 내 함수로 캡슐화.
- 백엔드 응답 타입 `ApiResponse<T>`에 맞춰 처리.
- 기본 URL: 환경변수 `VITE_API_BASE_URL` 사용.
- 에러 처리: 서비스 함수에서 throw, 호출부에서 catch.

```typescript
// services/productionOrder.ts
export async function getProductionOrders(params: ProductionOrderFilter): Promise<PaginatedResponse<ProductionOrder>> { ... }
export async function createProductionOrder(data: ProductionOrderCreate): Promise<ProductionOrder> { ... }
```

### 4. 타입 정의 (types/)
- 백엔드 Schema(DTO)와 1:1 대응하는 타입 정의.
- `{Domain}`, `{Domain}Create`, `{Domain}Update`, `{Domain}Filter` 패턴.
- 공통 타입: `ApiResponse<T>`, `PaginatedResponse<T>`.

```typescript
// types/common.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}
```

### 5. 훅 (hooks/)
- API 데이터 조회/변경은 커스텀 훅으로 추상화.
- `use{Domain}s()` — 목록 조회 + 필터 + 페이지네이션.
- `use{Domain}(id)` — 단건 조회.
- `use{Domain}Mutation()` — 생성/수정/삭제.

### 6. 페이지 구성 패턴
- 목록 페이지: 필터 영역 + 테이블 + 페이지네이션.
- 상세/폼 페이지: 폼 필드 + 저장/취소 버튼.
- 페이지는 레이아웃 컴포넌트(`MainLayout`) 내부에 렌더링.

### 7. 스타일
- CSS Modules 또는 Tailwind CSS 사용.
- 인라인 스타일 지양. 공통 컴포넌트에 스타일 캡슐화.
- 테마 변수는 `styles/` 에서 중앙 관리.
