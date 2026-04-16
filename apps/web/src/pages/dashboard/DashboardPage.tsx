import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader, KpiCard } from '@/components/common'
import { AD23KPIPage } from '../analytics/AD23-KPI'
import { FP19TaggingPage } from '../finishing/FP19-Tagging'
import {
  LayoutDashboard, Plus, Settings2, Save, X,
  Package, CheckSquare, TrendingUp, AlertTriangle,
  BarChart2, Activity, Maximize2, GripVertical,
  ChevronLeft, ChevronRight, ExternalLink, Monitor,
} from 'lucide-react'

/* ── 타입 ─────────────────────────────────────────── */
type KpiWidgetType =
  | 'kpi-oee' | 'kpi-output' | 'kpi-dhu' | 'kpi-otd'
  | 'lot-status' | 'line-efficiency' | 'mfz-alert' | 'wip-summary'

type ScreenWidgetType =
  | 'screen:AD-23' | 'screen:AD-24'
  | 'screen:FP-19' | 'screen:FP-20' | 'screen:FP-21' | 'screen:FP-22'
  | 'screen:WH-03' | 'screen:SC-13' | 'screen:QC-32' | 'screen:SW-18'

type WidgetType = KpiWidgetType | ScreenWidgetType

interface Widget {
  id: string
  type: WidgetType
  title: string
  colSpan: 1 | 2 | 3 | 4
  rowSpan: 1 | 2 | 3
}

/* ── 레이아웃 프리셋 ──────────────────────────────── */
const LAYOUT_PRESETS: Record<string, Widget[]> = {
  'layout-default': [
    { id: 'w1', type: 'kpi-oee',         title: 'OEE',       colSpan: 1, rowSpan: 1 },
    { id: 'w2', type: 'kpi-output',      title: '금일 생산량', colSpan: 1, rowSpan: 1 },
    { id: 'w3', type: 'kpi-dhu',         title: 'DHU',        colSpan: 1, rowSpan: 1 },
    { id: 'w4', type: 'kpi-otd',         title: 'OTD',        colSpan: 1, rowSpan: 1 },
    { id: 'w5', type: 'lot-status',      title: 'LOT 현황',   colSpan: 2, rowSpan: 1 },
    { id: 'w6', type: 'line-efficiency', title: '라인 효율',  colSpan: 2, rowSpan: 1 },
    { id: 'w7', type: 'mfz-alert',       title: 'MFZ 알림',   colSpan: 2, rowSpan: 1 },
    { id: 'w8', type: 'wip-summary',     title: 'WIP 요약',   colSpan: 2, rowSpan: 1 },
  ],
  'layout-ad23-fp19': [
    { id: 'w1', type: 'kpi-oee',     title: 'OEE',       colSpan: 1, rowSpan: 1 },
    { id: 'w2', type: 'kpi-output',  title: '금일 생산량', colSpan: 1, rowSpan: 1 },
    { id: 'w3', type: 'kpi-dhu',     title: 'DHU',        colSpan: 1, rowSpan: 1 },
    { id: 'w4', type: 'kpi-otd',     title: 'OTD',        colSpan: 1, rowSpan: 1 },
    { id: 'w5', type: 'screen:AD-23', title: '분석현황 (AD-23)',     colSpan: 2, rowSpan: 2 },
    { id: 'w6', type: 'screen:FP-19', title: '완성포장 태깅 (FP-19)', colSpan: 2, rowSpan: 2 },
  ],
  'layout-quality': [
    { id: 'w1', type: 'kpi-dhu',     title: 'DHU',      colSpan: 1, rowSpan: 1 },
    { id: 'w2', type: 'kpi-oee',     title: 'OEE',      colSpan: 1, rowSpan: 1 },
    { id: 'w3', type: 'mfz-alert',   title: 'MFZ 알림', colSpan: 2, rowSpan: 1 },
    { id: 'w4', type: 'screen:QC-32', title: 'QC 대시보드 (QC-32)', colSpan: 4, rowSpan: 2 },
  ],
}

const SAVED_LAYOUTS = [
  { key: 'layout-default',   name: '기본 대시보드',         isDefault: true },
  { key: 'layout-ad23-fp19', name: '분석 + 완성포장 뷰',    isDefault: false },
  { key: 'layout-quality',   name: '품질 집중 뷰',          isDefault: false },
]

/* ── 위젯 선택기 — KPI 목록 ───────────────────────── */
const KPI_WIDGETS: { type: KpiWidgetType; title: string; icon: React.ElementType; defaultSpan: Pick<Widget, 'colSpan' | 'rowSpan'> }[] = [
  { type: 'kpi-oee',         title: 'OEE 카드',      icon: Activity,      defaultSpan: { colSpan: 1, rowSpan: 1 } },
  { type: 'kpi-output',      title: '생산량 카드',    icon: Package,       defaultSpan: { colSpan: 1, rowSpan: 1 } },
  { type: 'kpi-dhu',         title: 'DHU 카드',       icon: CheckSquare,   defaultSpan: { colSpan: 1, rowSpan: 1 } },
  { type: 'kpi-otd',         title: 'OTD 카드',       icon: TrendingUp,    defaultSpan: { colSpan: 1, rowSpan: 1 } },
  { type: 'lot-status',      title: 'LOT 현황 표',    icon: BarChart2,     defaultSpan: { colSpan: 2, rowSpan: 1 } },
  { type: 'line-efficiency', title: '라인 효율 표',   icon: Activity,      defaultSpan: { colSpan: 2, rowSpan: 1 } },
  { type: 'mfz-alert',       title: 'MFZ 알림',       icon: AlertTriangle, defaultSpan: { colSpan: 2, rowSpan: 1 } },
  { type: 'wip-summary',     title: 'WIP 요약',       icon: BarChart2,     defaultSpan: { colSpan: 2, rowSpan: 1 } },
]

/* ── 위젯 선택기 — 화면 임베드 목록 ────────────────── */
const SCREEN_WIDGETS: { type: ScreenWidgetType; title: string; group: string; defaultSpan: Pick<Widget, 'colSpan' | 'rowSpan'> }[] = [
  { type: 'screen:AD-23', title: '공장장 대시보드 (AD-23)',  group: '분석',    defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:AD-24', title: 'WIP 조회 (AD-24)',         group: '분석',    defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:FP-19', title: '태깅 (FP-19)',              group: '완성포장', defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:FP-20', title: 'Polybag (FP-20)',           group: '완성포장', defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:FP-21', title: 'MFZ 검사 (FP-21)',          group: '완성포장', defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:FP-22', title: 'Carton (FP-22)',             group: '완성포장', defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:WH-03', title: '창고 대시보드 (WH-03)',      group: '창고',    defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:SC-13', title: '재단 대시보드 (SC-13)',      group: '재단',    defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:QC-32', title: 'QC 대시보드 (QC-32)',        group: '품질',    defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:SW-18', title: '봉제 실적 요약 (SW-18)',     group: '봉제',    defaultSpan: { colSpan: 2, rowSpan: 2 } },
]

/* ── 목업 데이터 ─────────────────────────────────── */
const LOT_STATUS_DATA = [
  { status: '재단',     count: 12, color: 'bg-blue-100 text-blue-800' },
  { status: '봉제',     count: 28, color: 'bg-purple-100 text-purple-800' },
  { status: '품질검사', count: 8,  color: 'bg-yellow-100 text-yellow-800' },
  { status: '포장 대기', count: 5, color: 'bg-green-100 text-green-800' },
  { status: 'MFZ 보류', count: 2,  color: 'bg-red-100 text-red-800' },
]

const LINE_DATA = [
  { line: 'LINE-A', output: 920,  target: 1000, eff: 92 },
  { line: 'LINE-B', output: 710,  target: 800,  eff: 89 },
  { line: 'LINE-C', output: 1080, target: 1200, eff: 90 },
  { line: 'LINE-D', output: 740,  target: 900,  eff: 82 },
]

/* ── 화면 임베드 렌더러 ──────────────────────────── */
function ScreenEmbedContent({ screenType }: { screenType: ScreenWidgetType }) {
  const placeholder = (label: string) => (
    <div className="flex items-center justify-center h-full min-h-[200px] text-gray-400 text-sm">
      <Monitor className="w-5 h-5 mr-2" />{label} 화면
    </div>
  )
  switch (screenType) {
    case 'screen:AD-23': return <AD23KPIPage />
    case 'screen:FP-19': return <FP19TaggingPage />
    default:
      return placeholder(screenType.replace('screen:', ''))
  }
}

/* ── KPI 위젯 렌더러 ─────────────────────────────── */
function KpiWidgetContent({ type }: { type: KpiWidgetType }) {
  switch (type) {
    case 'kpi-oee':
      return <KpiCard label="OEE" value="82.3%" trend="+1.2%" trendUp />
    case 'kpi-output':
      return <KpiCard label="금일 생산량" value="3,450" trend="+230" trendUp />
    case 'kpi-dhu':
      return <KpiCard label="평균 DHU" value="2.8%" trend="-0.3%" trendUp />
    case 'kpi-otd':
      return <KpiCard label="OTD" value="95.3%" trend="+0.8%" trendUp />
    case 'lot-status':
      return (
        <div className="space-y-2 p-1">
          {LOT_STATUS_DATA.map(d => (
            <div key={d.status} className="flex items-center justify-between">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.color}`}>{d.status}</span>
              <span className="text-sm font-semibold text-gray-900">{d.count} LOT</span>
            </div>
          ))}
        </div>
      )
    case 'line-efficiency':
      return (
        <div className="space-y-2 p-1">
          {LINE_DATA.map(d => (
            <div key={d.line}>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="font-medium text-gray-700">{d.line}</span>
                <span className="text-gray-500">{d.output}/{d.target}</span>
                <span className={`font-semibold ${d.eff >= 90 ? 'text-green-600' : d.eff >= 85 ? 'text-yellow-600' : 'text-red-500'}`}>{d.eff}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${d.eff}%` }} />
              </div>
            </div>
          ))}
        </div>
      )
    case 'mfz-alert':
      return (
        <div className="space-y-2 p-1">
          <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-red-700">LOT-2024-031 MFZ 보류</p>
              <p className="text-red-500">검출 3개 — Ply 12 역추적 중</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-yellow-700">MFZ 장비 교정 예정</p>
              <p className="text-yellow-600">5일 후 — monthly 교정 주기</p>
            </div>
          </div>
        </div>
      )
    case 'wip-summary':
      return (
        <div className="grid grid-cols-2 gap-2 p-1">
          {[
            { label: '총 활성 LOT', value: '55',    color: 'text-blue-700' },
            { label: '출하 대기',   value: '8',     color: 'text-green-700' },
            { label: '품질 이슈',   value: '3',     color: 'text-red-600' },
            { label: '오더 잔량',   value: '12,840', color: 'text-gray-800' },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-lg p-2 text-center">
              <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      )
  }
}

/* ── 위젯 카드 ───────────────────────────────────── */
interface WidgetCardProps {
  widget: Widget
  index: number
  total: number
  isEditMode: boolean
  onRemove: (id: string) => void
  onMove: (id: string, dir: -1 | 1) => void
  onResizeCol: (id: string, delta: -1 | 1) => void
  onResizeRow: (id: string, delta: -1 | 1) => void
}

function WidgetCard({ widget, index, total, isEditMode, onRemove, onMove, onResizeCol, onResizeRow }: WidgetCardProps) {
  const isScreen = widget.type.startsWith('screen:')

  return (
    <div
      className={`card relative flex flex-col ${isEditMode ? 'ring-2 ring-blue-300 ring-dashed' : ''}`}
      style={{
        gridColumn: `span ${widget.colSpan} / span ${widget.colSpan}`,
        gridRow: `span ${widget.rowSpan} / span ${widget.rowSpan}`,
        minHeight: widget.rowSpan === 1 ? '160px' : widget.rowSpan === 2 ? '360px' : '540px',
      }}
    >
      {/* 위젯 헤더 */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          {isEditMode && <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />}
          {isScreen && <Monitor className="w-3.5 h-3.5 text-primary-500" />}
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide truncate max-w-[200px]">
            {widget.title}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {!isEditMode && isScreen && (
            <button type="button" className="p-1 text-gray-300 hover:text-primary-500" title="전체화면으로 열기">
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
          {!isEditMode && (
            <button type="button" className="p-1 text-gray-300 hover:text-gray-500">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
          {isEditMode && (
            <button type="button" onClick={() => onRemove(widget.id)} className="p-1 text-red-300 hover:text-red-500">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 편집 모드 크기·순서 컨트롤 */}
      {isEditMode && (
        <div className="flex items-center gap-1 mb-2 flex-shrink-0 flex-wrap">
          {/* 순서 이동 */}
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(widget.id, -1)}
            className="p-0.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            title="왼쪽으로"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(widget.id, 1)}
            className="p-0.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            title="오른쪽으로"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <span className="text-gray-300 mx-0.5">|</span>

          {/* 가로 크기 */}
          <span className="text-xs text-gray-400">가로</span>
          <button
            type="button"
            disabled={widget.colSpan <= 1}
            onClick={() => onResizeCol(widget.id, -1)}
            className="px-1.5 py-0.5 rounded border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-30"
          >−</button>
          <span className="text-xs font-semibold text-gray-700 w-4 text-center">{widget.colSpan}</span>
          <button
            type="button"
            disabled={widget.colSpan >= 4}
            onClick={() => onResizeCol(widget.id, 1)}
            className="px-1.5 py-0.5 rounded border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-30"
          >+</button>

          <span className="text-gray-300 mx-0.5">|</span>

          {/* 세로 크기 */}
          <span className="text-xs text-gray-400">세로</span>
          <button
            type="button"
            disabled={widget.rowSpan <= 1}
            onClick={() => onResizeRow(widget.id, -1)}
            className="px-1.5 py-0.5 rounded border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-30"
          >−</button>
          <span className="text-xs font-semibold text-gray-700 w-4 text-center">{widget.rowSpan}</span>
          <button
            type="button"
            disabled={widget.rowSpan >= 3}
            onClick={() => onResizeRow(widget.id, 1)}
            className="px-1.5 py-0.5 rounded border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-30"
          >+</button>
        </div>
      )}

      {/* 위젯 콘텐츠 */}
      <div className={`flex-1 min-h-0 ${isScreen ? 'overflow-auto rounded-lg border border-gray-100' : ''}`}>
        {isScreen
          ? <ScreenEmbedContent screenType={widget.type as ScreenWidgetType} />
          : <KpiWidgetContent type={widget.type as KpiWidgetType} />
        }
      </div>
    </div>
  )
}

/* ── 위젯 선택 모달 ──────────────────────────────── */
interface WidgetPickerProps {
  onAdd: (type: WidgetType, title: string, colSpan: 1 | 2 | 3 | 4, rowSpan: 1 | 2 | 3) => void
  onClose: () => void
}

function WidgetPicker({ onAdd, onClose }: WidgetPickerProps) {
  const [tab, setTab] = useState<'kpi' | 'screen'>('kpi')
  const screenGroups = [...new Set(SCREEN_WIDGETS.map(s => s.group))]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary-600" />
            위젯 추가
          </h3>
          <button type="button" onClick={onClose}>
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* 탭 */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            type="button"
            onClick={() => setTab('kpi')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === 'kpi' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            KPI 위젯
          </button>
          <button
            type="button"
            onClick={() => setTab('screen')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
              tab === 'screen' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Monitor className="w-4 h-4" />
            화면 임베드
          </button>
        </div>

        {/* KPI 탭 */}
        {tab === 'kpi' && (
          <div className="grid grid-cols-2 gap-2">
            {KPI_WIDGETS.map(({ type, title, icon: Icon, defaultSpan }) => (
              <button
                key={type}
                type="button"
                onClick={() => onAdd(type, title, defaultSpan.colSpan, defaultSpan.rowSpan)}
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 text-sm text-left transition-colors"
              >
                <Icon className="w-4 h-4 text-primary-600 flex-shrink-0" />
                <span>{title}</span>
              </button>
            ))}
          </div>
        )}

        {/* 화면 임베드 탭 */}
        {tab === 'screen' && (
          <div className="space-y-4 max-h-72 overflow-y-auto">
            <p className="text-xs text-gray-500 flex items-start gap-1.5">
              <Monitor className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              실제 화면을 대시보드에 패널로 임베드합니다. 편집 모드에서 크기와 위치를 조절할 수 있습니다.
            </p>
            {screenGroups.map(group => (
              <div key={group}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{group}</p>
                <div className="grid grid-cols-2 gap-2">
                  {SCREEN_WIDGETS.filter(s => s.group === group).map(({ type, title, defaultSpan }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => onAdd(type, title, defaultSpan.colSpan, defaultSpan.rowSpan)}
                      className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 text-sm text-left transition-colors"
                    >
                      <Monitor className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      <span className="leading-tight">{title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── 메인 컴포넌트 ───────────────────────────────── */
export function DashboardPage() {
  const { t } = useTranslation()
  const [selectedLayout, setSelectedLayout] = useState('layout-default')
  const [widgets, setWidgets] = useState<Widget[]>(LAYOUT_PRESETS['layout-default'])
  const [isEditMode, setIsEditMode] = useState(false)
  const [showWidgetPicker, setShowWidgetPicker] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  function handleLayoutChange(key: string) {
    setSelectedLayout(key)
    setWidgets(LAYOUT_PRESETS[key] ?? LAYOUT_PRESETS['layout-default'])
    setIsEditMode(false)
  }

  function removeWidget(id: string) {
    setWidgets(prev => prev.filter(w => w.id !== id))
  }

  function moveWidget(id: string, dir: -1 | 1) {
    setWidgets(prev => {
      const idx = prev.findIndex(w => w.id === id)
      if (idx < 0) return prev
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const arr = [...prev]
      ;[arr[idx], arr[next]] = [arr[next], arr[idx]]
      return arr
    })
  }

  function resizeCol(id: string, delta: -1 | 1) {
    setWidgets(prev => prev.map(w =>
      w.id === id
        ? { ...w, colSpan: Math.max(1, Math.min(4, w.colSpan + delta)) as Widget['colSpan'] }
        : w
    ))
  }

  function resizeRow(id: string, delta: -1 | 1) {
    setWidgets(prev => prev.map(w =>
      w.id === id
        ? { ...w, rowSpan: Math.max(1, Math.min(3, w.rowSpan + delta)) as Widget['rowSpan'] }
        : w
    ))
  }

  function addWidget(type: WidgetType, title: string, colSpan: 1 | 2 | 3 | 4, rowSpan: 1 | 2 | 3) {
    setWidgets(prev => [...prev, { id: `w${Date.now()}`, type, title, colSpan, rowSpan }])
    setShowWidgetPicker(false)
  }

  function handleSave() {
    setSaveMsg(t('mypage.profile.saved'))
    setIsEditMode(false)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  function handleCancelEdit() {
    setWidgets(LAYOUT_PRESETS[selectedLayout] ?? LAYOUT_PRESETS['layout-default'])
    setIsEditMode(false)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        actions={
          <div className="flex items-center gap-2">
            {/* 저장된 레이아웃 선택 */}
            <select
              value={selectedLayout}
              onChange={e => handleLayoutChange(e.target.value)}
              className="input text-sm"
              disabled={isEditMode}
            >
              {SAVED_LAYOUTS.map(l => (
                <option key={l.key} value={l.key}>
                  {l.name}{l.isDefault ? ' ★' : ''}
                </option>
              ))}
            </select>

            {isEditMode ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowWidgetPicker(true)}
                  className="btn-secondary flex items-center gap-1.5 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  {t('dashboard.addWidget')}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn-primary flex items-center gap-1.5 text-sm"
                >
                  <Save className="w-4 h-4" />
                  {t('dashboard.saveLayout')}
                </button>
                <button type="button" onClick={handleCancelEdit} className="btn-secondary text-sm">
                  {t('common.cancel')}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => { setIsEditMode(true); setShowWidgetPicker(true) }}
                  className="btn-secondary flex items-center gap-1.5 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  {t('dashboard.addWidget')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditMode(true)}
                  className="btn-secondary flex items-center gap-1.5 text-sm"
                >
                  <Settings2 className="w-4 h-4" />
                  {t('dashboard.editLayout')}
                </button>
              </>
            )}
          </div>
        }
      />

      {saveMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg">
          {saveMsg}
        </div>
      )}

      {isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm text-blue-700 flex items-center gap-2">
          <Settings2 className="w-4 h-4 flex-shrink-0" />
          위젯 크기(가로/세로)와 순서(← →)를 조절한 뒤 저장하세요. 화면 임베드 위젯은 가로 2 이상 권장.
        </div>
      )}

      {/* 위젯 그리드 */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
      >
        {widgets.map((widget, idx) => (
          <WidgetCard
            key={widget.id}
            widget={widget}
            index={idx}
            total={widgets.length}
            isEditMode={isEditMode}
            onRemove={removeWidget}
            onMove={moveWidget}
            onResizeCol={resizeCol}
            onResizeRow={resizeRow}
          />
        ))}

        {isEditMode && (
          <button
            type="button"
            onClick={() => setShowWidgetPicker(true)}
            className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors"
            style={{ minHeight: '160px' }}
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm">{t('dashboard.addWidget')}</span>
          </button>
        )}
      </div>

      {showWidgetPicker && (
        <WidgetPicker onAdd={addWidget} onClose={() => setShowWidgetPicker(false)} />
      )}
    </div>
  )
}
