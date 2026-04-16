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
│   ├── common/       # Button, KpiCard, PageHeader, StatusBadge 등 + MesGrid re-export
│   ├── grid/         # MesGrid.tsx (AG Grid v35 래퍼 — 실제 구현체)
│   └── layout/       # Header, Sidebar, MainLayout
├── context/
│   └── MyMenuContext.tsx  # 워크스페이스 상태 + localStorage 영속성
├── pages/
│   ├── dashboard/    # DashboardPage.tsx — 다중 대시보드 (탭 기반)
│   ├── my-menu/      # MyMenuPage.tsx, WorkspacePage.tsx
│   ├── mypage/       # MyPage.tsx
│   └── …(33개 업무 화면)
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

### 7. AG Grid — 표준 그리드 컴포넌트 (구현 완료)

모든 시트형(목록·실적·검사) 화면은 AG Grid를 사용한다.
**현재 구현체**: `apps/web/src/components/grid/MesGrid.tsx`

#### 핵심 구현 패턴 (AG Grid v35)

```typescript
// components/grid/MesGrid.tsx
import { ModuleRegistry, AllCommunityModule, type ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

// ⚠️ 모듈 등록은 반드시 파일 최상위 레벨에서 호출 — 컴포넌트 내부 금지
ModuleRegistry.registerModules([AllCommunityModule])

export interface Column<T = object> {
  key: keyof T | string
  header: string
  render?: (row: T) => React.ReactNode
  width?: number
}

// 제네릭 제약: T extends object (Record<string, unknown> 금지 — TS 오류 발생)
export function MesGrid<T extends object>({
  columns, data, loading = false, height = 400,
}: {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  height?: number
}) {
  const colDefs: ColDef[] = columns.map(col => ({
    field: col.key as string,
    headerName: col.header,
    width: col.width,
    cellRenderer: col.render
      ? (params: { data: T }) => col.render!(params.data as T)
      : undefined,
  }))

  return (
    <div className="ag-theme-alpine" style={{ height, width: '100%' }}>
      {loading
        ? <div className="flex items-center justify-center h-full text-gray-400 text-sm">로딩 중...</div>
        : <AgGridReact columnDefs={colDefs} rowData={data} />
      }
    </div>
  )
}
```

#### 사용 방법 (기존 DataTable 대체)
```typescript
// ✅ MesGrid 사용 (모든 시트형 화면 표준)
import { MesGrid } from '@/components/common'  // common/index.ts에서 re-export

const columns: Column<RowType>[] = [
  { key: 'lotNo',   header: 'LOT 번호', width: 120 },
  { key: 'status',  header: '상태',      render: row => <StatusBadge status={row.status} /> },
]
<MesGrid columns={columns} data={rows} loading={isLoading} height={500} />

// ❌ DataTable 사용 금지 (레거시 — 삭제 예정)
```

#### 주의사항
- `ModuleRegistry.registerModules([AllCommunityModule])` 누락 시 컬럼/데이터 미표시 (런타임 무증상 실패)
- `T extends object` — `Record<string, unknown>` 으로 바꾸면 TypeScript 오류 발생
- `ColDef[]` (비제네릭) 사용 — `ColDef<T>[]` 사용 시 `field` 타입 오류

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

### 8. 다중 대시보드 (Dashboard) — 구현 완료

**파일**: `apps/web/src/pages/dashboard/DashboardPage.tsx`

#### 아키텍처
- **탭 기반** 다중 대시보드: 기본 프리셋 3개 + 사용자 생성 레이아웃 무제한
- **localStorage 영속** (`mes-dashboards` 키) — 프리셋은 코드에 고정, 사용자 레이아웃만 저장
- 4컬럼 CSS Grid: `gridTemplateColumns: 'repeat(4, 1fr)'`

#### 타입 구조
```typescript
interface Widget {
  id: string
  type: KpiWidgetType | ScreenWidgetType  // 'kpi-oee' | 'screen:AD-23' 등
  title: string
  colSpan: 1 | 2 | 3 | 4   // 가로 칸 수
  rowSpan: 1 | 2 | 3        // 세로 칸 수
}

interface DashboardLayout {
  id: string
  name: string
  widgets: Widget[]
  isPreset: boolean   // true = 삭제 불가 기본 제공 (preset-default, preset-analysis, preset-quality)
}
```

#### localStorage 패턴
```typescript
const STORAGE_KEY = 'mes-dashboards'

// 로드: 프리셋(코드 고정) + 사용자 레이아웃(localStorage)
function loadLayouts(): DashboardLayout[] {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  const userLayouts = saved.filter((l: DashboardLayout) => !l.isPreset)
  return [...DEFAULT_PRESETS, ...userLayouts]
}

// 저장: 사용자 레이아웃만 localStorage에 저장 (프리셋 제외)
function saveLayouts(layouts: DashboardLayout[]) {
  const userLayouts = layouts.filter(l => !l.isPreset)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userLayouts))
}
```

#### 신규 대시보드 생성 플로우
1. 탭 바 우측 `+ 새 대시보드` 클릭
2. 인라인 이름 입력 → Enter
3. `isPreset: false` 로 생성 → localStorage 저장
4. 빈 캔버스 + 위젯 선택 모달 자동 오픈
5. 위젯 추가 후 저장 → 레이아웃 영속

#### 위젯 유형
| 유형 prefix | 설명 | 예시 |
|------------|------|------|
| `kpi-*` | KPI 카드·표 | `kpi-oee`, `kpi-dhu`, `lot-status` |
| `screen:*` | 실제 화면 임베드 | `screen:AD-23`, `screen:QC-32` |

#### 화면 임베드 확장 시
`ScreenEmbedContent` 컴포넌트의 switch 문에 케이스 추가:
```typescript
case 'screen:WH-03': return <WH03DashboardPage />
```
`SCREEN_WIDGETS` 배열에도 항목 추가 (위젯 선택 모달에 노출).

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

### 11. 내 메뉴 (My Menu / Workspace) — 구현 완료

**파일**: `apps/web/src/context/MyMenuContext.tsx`, `apps/web/src/pages/my-menu/`
**라우트**: `/my-menu` (목록), `/my-menu/:id` (편집/뷰)

#### 개념
여러 화면을 하나의 레이아웃으로 합쳐 저장하는 워크스페이스 시스템.
개별 화면 북마크가 아닌 **복합 레이아웃** 단위로 관리.

#### 타입 구조
```typescript
// apps/web/src/context/MyMenuContext.tsx
interface WorkspacePanel {
  id: string
  screenCode: string    // 'WH-01' ~ 'AD-24' (33개 화면 코드)
  title: string
  colSpan: 1 | 2 | 3 | 4
  rowSpan: 1 | 2 | 3
}

interface Workspace {
  id: string       // 'ws-{timestamp}'
  name: string     // 사용자 지정 이름
  panels: WorkspacePanel[]
}
```

#### Context API
```typescript
const { workspaces, addWorkspace, updateWorkspace, renameWorkspace, deleteWorkspace, getWorkspace } = useMyMenu()

// 워크스페이스 생성 (반환값으로 즉시 navigate 가능)
const ws = addWorkspace('아침 체크')
navigate(`/my-menu/${ws.id}`)

// 패널 레이아웃 저장
updateWorkspace(id, panels)
```

#### localStorage 영속
- 저장 키: `mes-my-workspaces`
- `MyMenuProvider`를 `App.tsx`의 `<Routes>` 전체를 감싸도록 배치 (현재 적용 완료)

#### 사이드바 표시 규칙
- `Sidebar.tsx`에서 `useMyMenu()` 훅으로 워크스페이스 목록 자동 반영
- 각 워크스페이스 → `/my-menu/:id` NavLink
- 탭 하단 `+ 새 레이아웃` → `/my-menu`

#### 화면 임베드 (WorkspacePage)
33개 모든 화면이 `React.lazy()`로 등록되어 있어 패널로 추가 가능:
```typescript
// 새 화면을 SCREEN_COMPONENTS 맵에 추가할 때
'XX-99': lazy(() => import('../category/XX99-Screen').then(m => ({ default: m.XX99Page }))),
```

---

### 12. i18n 네임스페이스 목록

현재 구현된 번역 키 네임스페이스:
| 네임스페이스 | 파일 위치 | 설명 |
|------------|---------|------|
| `nav.*` | `ko/en/vi.json` | 사이드바 메뉴 레이블 |
| `myMenu.*` | `ko/en/vi.json` | 내 메뉴 화면 전체 |
| `dashboard.*` | `ko/en/vi.json` | 대시보드 화면 |
| `mypage.*` | `ko/en/vi.json` | 마이페이지 화면 |
| `common.*` | `ko/en/vi.json` | 공통 버튼·레이블 |
| `admin.*` | `ko/en/vi.json` | 관리자 화면 |
| `warehouse/relaxation/cutting/…` | `ko/en/vi.json` | 각 업무 도메인 |

**새 화면 추가 시 반드시 3개 파일(ko/en/vi.json) 모두에 키 추가.**

---

### 13. 화면 전체 목록
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
| 개인화 | **다중 대시보드** (`/dashboard`), **마이페이지** (`/mypage`), **내 메뉴** (`/my-menu`, `/my-menu/:id`) |
