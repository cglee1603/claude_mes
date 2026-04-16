---
globs: apps/web/src/pages/dashboard/**,apps/web/src/pages/my-menu/**,apps/web/src/context/MyMenuContext.tsx
description: 대시보드·내 메뉴 개인화 기능 작성/수정 시 자동 참조되는 규칙
---

# 개인화 기능 규칙 — 다중 대시보드 & 내 메뉴 (워크스페이스)

> 적용 대상:
> - `apps/web/src/pages/dashboard/DashboardPage.tsx`
> - `apps/web/src/pages/my-menu/MyMenuPage.tsx`
> - `apps/web/src/pages/my-menu/WorkspacePage.tsx`
> - `apps/web/src/context/MyMenuContext.tsx`

---

## §1 다중 대시보드 (`/dashboard`)

### 1-1. 데이터 모델

```typescript
interface Widget {
  id: string
  type: KpiWidgetType | ScreenWidgetType
  title: string
  colSpan: 1 | 2 | 3 | 4   // CSS Grid span
  rowSpan: 1 | 2 | 3
}

interface DashboardLayout {
  id: string
  name: string
  widgets: Widget[]
  isPreset: boolean   // true → 삭제 불가
}
```

### 1-2. localStorage 영속

| 항목 | 내용 |
|------|------|
| 저장 키 | `mes-dashboards` |
| 저장 대상 | `isPreset: false` 인 사용자 레이아웃만 |
| 프리셋 | 코드에 `DEFAULT_PRESETS` 상수로 고정 (`preset-default`, `preset-analysis`, `preset-quality`) |

```typescript
// ✅ 올바른 저장 패턴 — 프리셋 제외
function saveLayouts(layouts: DashboardLayout[]) {
  const userLayouts = layouts.filter(l => !l.isPreset)
  localStorage.setItem('mes-dashboards', JSON.stringify(userLayouts))
}

// ✅ 올바른 로드 패턴 — 프리셋 + 사용자 레이아웃 합산
function loadLayouts(): DashboardLayout[] {
  const saved = JSON.parse(localStorage.getItem('mes-dashboards') ?? '[]')
  return [...DEFAULT_PRESETS, ...saved.filter((l: DashboardLayout) => !l.isPreset)]
}
```

### 1-3. 위젯 유형 확장

#### KPI 위젯 추가
`KPI_WIDGETS` 배열에 항목 추가:
```typescript
{ type: 'kpi-new', title: '새 KPI 카드', icon: SomeIcon, defaultSpan: { colSpan: 1, rowSpan: 1 } }
```
`KpiWidgetContent` switch 문에 케이스 추가.

#### 화면 임베드 추가
`SCREEN_WIDGETS` 배열에 항목 추가:
```typescript
{ type: 'screen:WH-01', title: '원단 입고 (WH-01)', group: '창고', defaultSpan: { colSpan: 2, rowSpan: 2 } }
```
`ScreenEmbedContent` switch 문에 케이스 추가:
```typescript
case 'screen:WH-01': return <WH01ReceivePage />
```
`ScreenWidgetType` 유니온 타입에도 `'screen:WH-01'` 추가.

### 1-4. 편집 모드 규칙
- 편집 모드 진입 시 `useEffect`로 현재 위젯 배열을 `editWidgets` 상태에 복사
- 취소(`handleCancelEdit`) → 원본 위젯 복원 (저장 없음)
- 저장(`handleSave`) → `layouts` 상태 + localStorage 동시 업데이트

---

## §2 내 메뉴 / 워크스페이스 (`/my-menu`, `/my-menu/:id`)

### 2-1. 데이터 모델

```typescript
// apps/web/src/context/MyMenuContext.tsx
interface WorkspacePanel {
  id: string          // 'p-{timestamp}'
  screenCode: string  // 'WH-01' ~ 'AD-24'
  title: string       // ALL_SCREENS에서 자동 설정
  colSpan: 1 | 2 | 3 | 4
  rowSpan: 1 | 2 | 3
}

interface Workspace {
  id: string          // 'ws-{timestamp}'
  name: string
  panels: WorkspacePanel[]
}
```

### 2-2. Context 사용법

```typescript
import { useMyMenu } from '@/context/MyMenuContext'

// 어느 컴포넌트에서든 사용 가능 (App.tsx의 MyMenuProvider 내부면 됨)
const { workspaces, addWorkspace, updateWorkspace, renameWorkspace, deleteWorkspace, getWorkspace } = useMyMenu()

// 신규 워크스페이스 생성 후 즉시 이동
const ws = addWorkspace('아침 체크')
navigate(`/my-menu/${ws.id}`)

// 패널 레이아웃 저장
updateWorkspace(id, panels)
```

### 2-3. localStorage 영속

| 항목 | 내용 |
|------|------|
| 저장 키 | `mes-my-workspaces` |
| 저장 시점 | add/update/rename/delete 모든 변경 즉시 |
| 로드 시점 | `MyMenuProvider` 마운트 시 (useState 초기값) |

### 2-4. 화면 코드 등록 (`SCREEN_COMPONENTS`)

`WorkspacePage.tsx`의 `SCREEN_COMPONENTS` 맵에 33개 화면이 `React.lazy()`로 등록됨.
새 화면 추가 시:
1. `SCREEN_COMPONENTS`에 lazy import 추가
2. `MyMenuContext.tsx`의 `ALL_SCREENS` 배열에 `{ code, title, path, group }` 추가

```typescript
// ALL_SCREENS 항목 형식
{ code: 'XX-99', title: '새 화면',  path: '/category/path', group: '그룹명' }
```

### 2-5. 사이드바 자동 반영
`Sidebar.tsx`에서 `useMyMenu().workspaces`를 직접 구독 → 워크스페이스 추가/삭제 즉시 반영.
별도 사이드바 업데이트 코드 불필요.

### 2-6. 패널 기본 크기
신규 패널 추가 시 기본값: `colSpan: 2, rowSpan: 2`
사용자가 편집 모드에서 W(1–4) / H(1–3) 버튼으로 조절.

---

## §3 공통 규칙

### CSS Grid 레이아웃
두 기능 모두 동일한 4컬럼 CSS Grid 사용:
```css
grid-template-columns: repeat(4, 1fr);
```
```tsx
style={{
  gridColumn: `span ${colSpan} / span ${colSpan}`,
  gridRow: `span ${rowSpan} / span ${rowSpan}`,
}}
```

### i18n 필수
- 대시보드: `t('dashboard.*')` 네임스페이스
- 내 메뉴: `t('myMenu.*')` 네임스페이스
- 새 텍스트 추가 시 반드시 `ko.json`, `en.json`, `vi.json` 3개 파일에 동시 추가

### 금지 사항
- `localStorage`를 직접 읽지 않고 반드시 `loadLayouts()` / `useMyMenu()` 경유
- 프리셋 레이아웃(`isPreset: true`)을 localStorage에 저장하지 않음
- `WorkspacePage`의 `SCREEN_COMPONENTS` 외부에서 화면 컴포넌트를 직접 import하여 패널 렌더링 금지
