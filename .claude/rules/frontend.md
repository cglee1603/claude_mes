---
globs: apps/web/src/**/*.{ts,tsx,css}
description: 프론트엔드 파일 작성/수정 시 자동 참조되는 규칙
---

# Frontend 레이어 규칙

> 적용 대상: `apps/web/src/**/*.{ts,tsx,css}`
> 참고: CLAUDE.md §12 i18n Rules, §3 Tech Stack

## 요약
React 18 + TanStack Query 기반 SPA. MSW는 spec.yaml에서 자동생성 사용 (H-1).
베트남 공장 현장을 위한 KO/EN/VI 3개 언어 지원 필수.
PWA 오프라인 2시간(OFFLINE_MAX_HOURS) 지원.

## 디렉토리 구조
```
apps/web/src/
├── components/
│   ├── common/       # Button, Table, Modal, Form, StatusBadge
│   └── layout/       # Header, Sidebar, MainLayout
├── pages/            # 33개 화면 (WH, RX, SC, SW, QC, FP, AD, Admin)
├── hooks/            # TanStack Query 커스텀 훅
├── mocks/            # MSW 핸들러 (자동생성 — 수동 작성 금지 H-1)
├── services/         # API 호출 함수
├── types/            # TypeScript 타입 (spec.yaml 자동생성)
├── i18n/             # ko.json, en.json, vi.json
├── sw/               # PWA Service Worker, IndexedDB
└── styles/
```

## 규칙

### 1. MSW 핸들러 — 자동생성만 (H-1)
```bash
# spec.yaml 변경 후 반드시 실행
bun run generate-msw
# 수동으로 apps/web/src/mocks/ 수정 절대 금지
```

### 2. i18n 필수 (§12)
```typescript
// ❌ 하드코딩 금지
<Button>원단 입고</Button>

// ✅ i18next 사용
import { useTranslation } from 'react-i18next'
const { t } = useTranslation()
<Button>{t('warehouse.receive.title')}</Button>
```
- 번역 키 형식: `{screen}.{component}.{label}`
- `/add-i18n {screen}` 커맨드로 자동 추출

### 3. TanStack Query 패턴
```typescript
// hooks/useProductionOrder.ts
import { useQuery, useMutation } from '@tanstack/react-query'

export function useLineOutputRecord() {
  return useMutation({
    mutationFn: (data: RecordLineOutputData) =>
      api.post('/production/record-line-output', data),
    onSuccess: () => queryClient.invalidateQueries(['line-output'])
  })
}
```

### 4. PWA 오프라인 (OFFLINE_MAX_HOURS = 2h)
```typescript
// sw/offline-queue.ts
const MAX_AGE_MS = 2 * 60 * 60 * 1000  // OFFLINE_MAX_HOURS

// IndexedDB에 큐잉
async function enqueueOfflineAction(action: OfflineAction) {
  if (Date.now() - action.timestamp > MAX_AGE_MS) {
    alert(t('offline.expired'))  // 사용자 경고
    return
  }
  await db.offlineQueue.add(action)
}
// Background Sync로 온라인 복구 시 자동 전송
```

### 5. 컴포넌트 규칙
- 함수형 컴포넌트만 사용 (class 컴포넌트 금지)
- Props 인터페이스: `interface {Component}Props`
- 300줄 초과 시 분리

### 6. API 서비스 함수 패턴
```typescript
// services/production.ts
export async function recordLineOutput(
  data: RecordLineOutputData
): Promise<Result<LineOutput>> {
  const res = await fetch('/api/production/record-line-output', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
  return res.json()
}
```

### 7. 33개 화면 목록
| 그룹 | 화면 |
|------|------|
| 창고 | WH-01(원단입고), WH-02(이력조회), WH-03(대시보드) |
| 릴렉싱 | RX-04(계획), RX-05(소재별시간), RX-06(완료알림) |
| 재단 | SC-07~13 |
| 봉제 | SW-14(투입계획), SW-15(Layout), SW-16(기계상태), SW-17~18(팀실적) |
| 품질 | QC-25~32 (8단계 검사) |
| 완성·포장 | FP-19(태깅), FP-20(Polybag), FP-21(MFZ), FP-22(Carton) |
| 분석 | AD-23(공장장대시보드), AD-24(WIP조회) |
| Admin | 생산라인, 기계, SMV, ERP동기화, 수명주기, QC기준 |
