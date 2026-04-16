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
**그리드 UI는 AG Grid(ag-grid.com)를 표준으로 사용** — 시트형 화면 전체 적용.

## 디렉토리 구조
```
apps/web/src/
├── components/
│   ├── common/       # Button, Table, Modal, Form, StatusBadge
│   ├── grid/         # MesGrid (AG Grid 래퍼), GridToolbar, ColumnSettingPanel
│   ├── dashboard/    # DashboardCanvas, GridWidget, WidgetSelector
│   └── layout/       # Header, Sidebar, MainLayout
├── pages/            # 33개 화면 + Dashboard, MyPage
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

### 7. AG Grid — 표준 그리드 컴포넌트

모든 시트형(목록·실적·검사) 화면은 AG Grid를 사용한다.

```typescript
// components/grid/MesGrid.tsx — 공통 래퍼
import { AgGridReact } from 'ag-grid-react'
import { useGridLayout } from '../../hooks/useGridLayout'

interface MesGridProps {
  gridKey: string          // 레이아웃 저장 키 (예: 'WH-01-grid')
  columnDefs: ColDef[]
  rowData: unknown[]
  onGridReady?: (api: GridApi) => void
}

export function MesGrid({ gridKey, columnDefs, rowData, onGridReady }: MesGridProps) {
  const { columnState, saveColumnState } = useGridLayout(gridKey)

  return (
    <AgGridReact
      columnDefs={columnDefs}
      rowData={rowData}
      onGridReady={e => {
        if (columnState) e.api.applyColumnState({ state: columnState, applyOrder: true })
        onGridReady?.(e.api)
      }}
      onColumnResized={e => saveColumnState(e.api.getColumnState())}
      onColumnMoved={e => saveColumnState(e.api.getColumnState())}
      onColumnVisible={e => saveColumnState(e.api.getColumnState())}
    />
  )
}
```

#### 컬럼 가로 사이즈 저장 규칙
- `onColumnResized` 이벤트에서 `columnState` 자동 저장 (디바운스 500ms)
- 저장 키 형식: `{screenCode}-grid` (예: `WH-01-grid`, `SC-07-grid`)
- 저장 위치: DB `user_layout_preferences` (서버) + `localStorage` (오프라인 캐시)
- 사용자별 독립 저장 — 다른 사용자의 설정에 영향 없음

```typescript
// hooks/useGridLayout.ts
export function useGridLayout(gridKey: string) {
  const { mutate: save } = useMutation({
    mutationFn: (columnState: ColumnState[]) =>
      api.post('/api/user/layout', { layoutKey: gridKey, layoutData: { columnState } })
  })

  const { data } = useQuery({
    queryKey: ['layout', gridKey],
    queryFn: () => api.get(`/api/user/layout/${gridKey}`)
  })

  const saveColumnState = useDebouncedCallback(
    (state: ColumnState[]) => {
      localStorage.setItem(`layout:${gridKey}`, JSON.stringify(state))  // 오프라인 캐시
      save(state)
    },
    500
  )

  return { columnState: data?.layoutData?.columnState, saveColumnState }
}
```

#### Gantt 차트 연동 준비
- AG Grid Enterprise의 `groupRowRenderer` 활용 예정
- 간트차트 라이브러리(dhtmlx-gantt 또는 frappe-gantt) 연동 인터페이스를 MesGrid에 슬롯으로 예약
- Phase 2에서 구체화 — 현재는 연동 훅 인터페이스만 정의

---

### 8. 대시보드 (Dashboard)

개인화 대시보드: 사용자가 원하는 화면·위젯을 그리드 형태로 배치 후 저장.

```
레이아웃 구성:
- 12컬럼 그리드 기반 (React Grid Layout 또는 AG Grid 커스텀)
- 위젯 유형: 미니 화면 임베드, KPI 카드, 차트, AG Grid 요약
- 배치(위치·크기)를 JSON으로 직렬화 → DB 저장
- 저장된 레이아웃 불러오기 (복수 개, 이름 부여 가능)
```

```typescript
// 대시보드 레이아웃 저장 API
// POST /api/user/layout
// { layoutKey: 'dashboard-main', layoutName: '공장 현황', layoutData: { widgets: [...] } }
//
// widget 예시:
// { id: 'w1', screenCode: 'WH-03', x: 0, y: 0, w: 6, h: 4 }   — 창고 대시보드 임베드
// { id: 'w2', screenCode: 'AD-23', x: 6, y: 0, w: 6, h: 4 }   — 공장장 대시보드 임베드
```

---

### 9. 마이페이지 (MyPage)

| 기능 | 설명 |
|------|------|
| 프로필 | 이름, 이메일, 언어 설정(KO/EN/VI), 비밀번호 변경 |
| 레이아웃 관리 | 저장된 그리드/대시보드 레이아웃 목록, 기본값 설정, 삭제 |
| 커스텀 대시보드 | 개인 대시보드 편집 (위젯 추가·제거·배치) |
| 내 권한 조회 | 본인의 화면별 접근 권한 확인 (읽기 전용) |
| (Admin 전용) DB 백업 현황 | 최근 백업 이력 및 수동 스냅샷 실행 (Admin-B 화면으로 이동) |

---

### 10. 사용자 레이아웃 저장 — API 규칙

```typescript
// Prisma 스키마 (packages/db/prisma/schema.prisma)
model UserLayoutPreference {
  id          String   @id @default(uuid())
  userId      String
  layoutKey   String   // '{screenCode}-grid' | 'dashboard-{name}'
  layoutName  String   @default("기본")
  layoutData  Json     // columnState[] | { widgets: Widget[] }
  isDefault   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([userId, layoutKey])
  @@map("user_layout_preferences")
}
```

```
API 엔드포인트:
GET    /api/user/layout/:layoutKey        — 레이아웃 조회
POST   /api/user/layout                   — 생성/업서트
DELETE /api/user/layout/:layoutKey        — 삭제
GET    /api/user/layouts                  — 전체 레이아웃 목록
```

---

### 11. 33개 화면 목록
| 그룹 | 화면 |
|------|------|
| 창고 | WH-01(원단입고), WH-02(이력조회), WH-03(대시보드) |
| 릴렉싱 | RX-04(계획), RX-05(소재별시간), RX-06(완료알림) |
| 재단 | SC-07~13 |
| 봉제 | SW-14(투입계획), SW-15(Layout), SW-16(기계상태), SW-17~18(팀실적) |
| 품질 | QC-25~32 (8단계 검사) |
| 완성·포장 | FP-19(태깅), FP-20(Polybag), FP-21(MFZ), FP-22(Carton) |
| 분석 | AD-23(공장장대시보드), AD-24(WIP조회) |
| Admin | 생산라인, 기계, SMV, ERP동기화, 수명주기, QC기준, **권한관리(Admin-P)**, **백업관리(Admin-B)** |
| 개인화 | **대시보드(커스텀)**, **마이페이지** |
