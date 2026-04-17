import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader, KpiCard } from '@/components/common'
import { HQC03Page } from '../sewing/H-QC-03-QCDashboard'
import { HFin06Page } from '../finishing/H-FIN-06-Shipment'
import {
  LayoutDashboard, Plus, Settings2, Save, X,
  Package, CheckSquare, TrendingUp, AlertTriangle,
  BarChart2, Activity, Maximize2, GripVertical,
  ChevronLeft, ChevronRight, ExternalLink, Monitor,
  Trash2, Edit2, Check,
} from 'lucide-react'

/* ── 타입 ─────────────────────────────────────────── */
type KpiWidgetType =
  | 'kpi-oee' | 'kpi-output' | 'kpi-dhu' | 'kpi-otd'
  | 'lot-status' | 'line-efficiency' | 'mfz-alert' | 'wip-summary'

type ScreenWidgetType =
  | 'screen:H-QC-03' | 'screen:H-RT-01'
  | 'screen:H-FIN-06' | 'screen:H-FIN-05' | 'screen:H-MFZ-01' | 'screen:H-PERF-01'
  | 'screen:H-WH-04' | 'screen:H-CUT-05' | 'screen:H-FIN-08' | 'screen:H-SW-07'

type WidgetType = KpiWidgetType | ScreenWidgetType

interface Widget {
  id: string
  type: WidgetType
  title: string
  colSpan: 1 | 2 | 3 | 4
  rowSpan: 1 | 2 | 3
}

interface DashboardLayout {
  id: string
  name: string
  widgets: Widget[]
  isPreset: boolean   // true = 삭제 불가 기본 제공
}

/* ── 기본 프리셋 (삭제 불가) ──────────────────────── */
const DEFAULT_PRESETS: DashboardLayout[] = [
  {
    id: 'preset-default',
    name: 'Default Dashboard',
    isPreset: true,
    widgets: [
      { id: 'w1', type: 'kpi-oee',         title: 'OEE',             colSpan: 1, rowSpan: 1 },
      { id: 'w2', type: 'kpi-output',      title: 'Today Output',    colSpan: 1, rowSpan: 1 },
      { id: 'w3', type: 'kpi-dhu',         title: 'DHU',             colSpan: 1, rowSpan: 1 },
      { id: 'w4', type: 'kpi-otd',         title: 'OTD',             colSpan: 1, rowSpan: 1 },
      { id: 'w5', type: 'lot-status',      title: 'LOT Status',      colSpan: 2, rowSpan: 1 },
      { id: 'w6', type: 'line-efficiency', title: 'Line Efficiency',  colSpan: 2, rowSpan: 1 },
      { id: 'w7', type: 'mfz-alert',       title: 'MFZ Alert',       colSpan: 2, rowSpan: 1 },
      { id: 'w8', type: 'wip-summary',     title: 'WIP Summary',     colSpan: 2, rowSpan: 1 },
    ],
  },
  {
    id: 'preset-analysis',
    name: 'Analytics + Finishing',
    isPreset: true,
    widgets: [
      { id: 'w1', type: 'kpi-oee',         title: 'OEE',              colSpan: 1, rowSpan: 1 },
      { id: 'w2', type: 'kpi-output',      title: 'Today Output',     colSpan: 1, rowSpan: 1 },
      { id: 'w3', type: 'kpi-dhu',         title: 'DHU',              colSpan: 1, rowSpan: 1 },
      { id: 'w4', type: 'kpi-otd',         title: 'OTD',              colSpan: 1, rowSpan: 1 },
      { id: 'w5', type: 'screen:H-QC-03',   title: 'QC Dashboard',     colSpan: 2, rowSpan: 2 },
      { id: 'w6', type: 'screen:H-FIN-06', title: 'Shipment',         colSpan: 2, rowSpan: 2 },
    ],
  },
  {
    id: 'preset-quality',
    name: 'Quality Focus',
    isPreset: true,
    widgets: [
      { id: 'w1', type: 'kpi-dhu',         title: 'DHU',                    colSpan: 1, rowSpan: 1 },
      { id: 'w2', type: 'kpi-oee',         title: 'OEE',                    colSpan: 1, rowSpan: 1 },
      { id: 'w3', type: 'mfz-alert',       title: 'MFZ Alert',              colSpan: 2, rowSpan: 1 },
      { id: 'w4', type: 'screen:H-QC-03',   title: 'QC Dashboard',           colSpan: 4, rowSpan: 2 },
    ],
  },
]

const STORAGE_KEY = 'mes-dashboards'

function loadLayouts(): DashboardLayout[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as DashboardLayout[]
    // 프리셋은 항상 앞에 고정, 저장된 사용자 레이아웃은 뒤에 붙임
    const userLayouts = saved.filter(l => !l.isPreset)
    return [...DEFAULT_PRESETS, ...userLayouts]
  } catch {
    return [...DEFAULT_PRESETS]
  }
}

function saveLayouts(layouts: DashboardLayout[]) {
  const userLayouts = layouts.filter(l => !l.isPreset)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userLayouts))
}

/* ── 위젯 선택기 — KPI 목록 ───────────────────────── */
const KPI_WIDGETS: { type: KpiWidgetType; title: string; icon: React.ElementType; defaultSpan: Pick<Widget, 'colSpan' | 'rowSpan'> }[] = [
  { type: 'kpi-oee',         title: 'OEE Card',            icon: Activity,      defaultSpan: { colSpan: 1, rowSpan: 1 } },
  { type: 'kpi-output',      title: 'Output Card',         icon: Package,       defaultSpan: { colSpan: 1, rowSpan: 1 } },
  { type: 'kpi-dhu',         title: 'DHU Card',            icon: CheckSquare,   defaultSpan: { colSpan: 1, rowSpan: 1 } },
  { type: 'kpi-otd',         title: 'OTD Card',            icon: TrendingUp,    defaultSpan: { colSpan: 1, rowSpan: 1 } },
  { type: 'lot-status',      title: 'LOT Status Table',    icon: BarChart2,     defaultSpan: { colSpan: 2, rowSpan: 1 } },
  { type: 'line-efficiency', title: 'Line Efficiency Table', icon: Activity,    defaultSpan: { colSpan: 2, rowSpan: 1 } },
  { type: 'mfz-alert',       title: 'MFZ Alert',           icon: AlertTriangle, defaultSpan: { colSpan: 2, rowSpan: 1 } },
  { type: 'wip-summary',     title: 'WIP Summary',         icon: BarChart2,     defaultSpan: { colSpan: 2, rowSpan: 1 } },
]

const SCREEN_WIDGETS: { type: ScreenWidgetType; title: string; group: string; defaultSpan: Pick<Widget, 'colSpan' | 'rowSpan'> }[] = [
  { type: 'screen:H-QC-03',   title: 'QC Dashboard',             group: 'Sewing',    defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:H-RT-01',   title: 'Production Output',        group: 'Sewing',    defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:H-FIN-06',  title: 'Shipment',                 group: 'Finishing', defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:H-FIN-05',  title: 'Packing List',             group: 'Finishing', defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:H-MFZ-01',  title: 'Metal Detection',          group: 'Sewing',    defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:H-PERF-01', title: 'Finishing Performance',    group: 'Finishing', defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:H-WH-04',   title: 'Inventory',                group: 'Warehouse', defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:H-CUT-05',  title: 'Daily Cutting Report',     group: 'Cutting',   defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:H-FIN-08',  title: 'MFZ Daily Summary',        group: 'Finishing', defaultSpan: { colSpan: 2, rowSpan: 2 } },
  { type: 'screen:H-SW-07',   title: 'Hourly Entry',             group: 'Sewing',    defaultSpan: { colSpan: 2, rowSpan: 2 } },
]

/* ── 목업 데이터 ─────────────────────────────────── */
const LOT_STATUS_DATA = [
  { status: 'Cutting',       count: 12, color: 'bg-blue-100 text-blue-800' },
  { status: 'Sewing',        count: 28, color: 'bg-purple-100 text-purple-800' },
  { status: 'QC',            count: 8,  color: 'bg-yellow-100 text-yellow-800' },
  { status: 'Ready to Pack', count: 5,  color: 'bg-green-100 text-green-800' },
  { status: 'MFZ Hold',      count: 2,  color: 'bg-red-100 text-red-800' },
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
      <Monitor className="w-5 h-5 mr-2" />{label}
    </div>
  )
  switch (screenType) {
    case 'screen:H-QC-03':  return <HQC03Page />
    case 'screen:H-FIN-06': return <HFin06Page />
    default: return placeholder(screenType.replace('screen:', ''))
  }
}

/* ── KPI 위젯 렌더러 ─────────────────────────────── */
function KpiWidgetContent({ type }: { type: KpiWidgetType }) {
  switch (type) {
    case 'kpi-oee':    return <KpiCard label="OEE"          value="82.3%" trend="+1.2%" trendUp />
    case 'kpi-output': return <KpiCard label="Today Output" value="3,450" trend="+230"  trendUp />
    case 'kpi-dhu':    return <KpiCard label="Avg DHU"      value="2.8%"  trend="-0.3%" trendUp />
    case 'kpi-otd':    return <KpiCard label="OTD"        value="95.3%" trend="+0.8%" trendUp />
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
              <p className="font-semibold text-red-700">LOT-2024-031 MFZ Hold</p>
              <p className="text-red-500">3 detected — Ply 12 tracing</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-yellow-700">MFZ Equipment Calibration Due</p>
              <p className="text-yellow-600">In 5 days — monthly cycle</p>
            </div>
          </div>
        </div>
      )
    case 'wip-summary':
      return (
        <div className="grid grid-cols-2 gap-2 p-1">
          {[
            { label: 'Active LOTs',    value: '55',     color: 'text-blue-700' },
            { label: 'Ready to Ship',  value: '8',      color: 'text-green-700' },
            { label: 'Quality Issues', value: '3',      color: 'text-red-600' },
            { label: 'Order Balance',  value: '12,840', color: 'text-gray-800' },
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
function WidgetCard({
  widget, index, total, isEditMode, onRemove, onMove, onResizeCol, onResizeRow,
}: {
  widget: Widget; index: number; total: number; isEditMode: boolean
  onRemove: (id: string) => void; onMove: (id: string, dir: -1 | 1) => void
  onResizeCol: (id: string, delta: -1 | 1) => void; onResizeRow: (id: string, delta: -1 | 1) => void
}) {
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
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          {isEditMode && <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />}
          {isScreen && <Monitor className="w-3.5 h-3.5 text-primary-500" />}
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide truncate max-w-[200px]">{widget.title}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {!isEditMode && isScreen && (
            <button type="button" className="p-1 text-gray-300 hover:text-primary-500">
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
          {!isEditMode && <button type="button" className="p-1 text-gray-300 hover:text-gray-500"><Maximize2 className="w-3.5 h-3.5" /></button>}
          {isEditMode && (
            <button type="button" onClick={() => onRemove(widget.id)} className="p-1 text-red-300 hover:text-red-500">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {isEditMode && (
        <div className="flex items-center gap-1 mb-2 flex-shrink-0 flex-wrap">
          <button type="button" disabled={index === 0} onClick={() => onMove(widget.id, -1)}
            className="p-0.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button type="button" disabled={index === total - 1} onClick={() => onMove(widget.id, 1)}
            className="p-0.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-gray-300 mx-0.5">|</span>
          <span className="text-xs text-gray-400">W</span>
          <button type="button" disabled={widget.colSpan <= 1} onClick={() => onResizeCol(widget.id, -1)}
            className="px-1.5 py-0.5 rounded border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-30">−</button>
          <span className="text-xs font-semibold text-gray-700 w-4 text-center">{widget.colSpan}</span>
          <button type="button" disabled={widget.colSpan >= 4} onClick={() => onResizeCol(widget.id, 1)}
            className="px-1.5 py-0.5 rounded border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-30">+</button>
          <span className="text-gray-300 mx-0.5">|</span>
          <span className="text-xs text-gray-400">H</span>
          <button type="button" disabled={widget.rowSpan <= 1} onClick={() => onResizeRow(widget.id, -1)}
            className="px-1.5 py-0.5 rounded border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-30">−</button>
          <span className="text-xs font-semibold text-gray-700 w-4 text-center">{widget.rowSpan}</span>
          <button type="button" disabled={widget.rowSpan >= 3} onClick={() => onResizeRow(widget.id, 1)}
            className="px-1.5 py-0.5 rounded border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-30">+</button>
        </div>
      )}

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
function WidgetPicker({ onAdd, onClose }: {
  onAdd: (type: WidgetType, title: string, colSpan: 1 | 2 | 3 | 4, rowSpan: 1 | 2 | 3) => void
  onClose: () => void
}) {
  const [tab, setTab] = useState<'kpi' | 'screen'>('kpi')
  const screenGroups = [...new Set(SCREEN_WIDGETS.map(s => s.group))]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary-600" />Add Widget
          </h3>
          <button type="button" onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
        </div>
        <div className="flex border-b border-gray-200 mb-4">
          {(['kpi', 'screen'] as const).map(t => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
                tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {t === 'screen' && <Monitor className="w-4 h-4" />}
              {t === 'kpi' ? 'KPI Widgets' : 'Screen Embed'}
            </button>
          ))}
        </div>
        {tab === 'kpi' && (
          <div className="grid grid-cols-2 gap-2">
            {KPI_WIDGETS.map(({ type, title, icon: Icon, defaultSpan }) => (
              <button key={type} type="button"
                onClick={() => onAdd(type, title, defaultSpan.colSpan, defaultSpan.rowSpan)}
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 text-sm text-left transition-colors">
                <Icon className="w-4 h-4 text-primary-600 flex-shrink-0" />
                <span>{title}</span>
              </button>
            ))}
          </div>
        )}
        {tab === 'screen' && (
          <div className="space-y-4 max-h-72 overflow-y-auto">
            {screenGroups.map(group => (
              <div key={group}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{group}</p>
                <div className="grid grid-cols-2 gap-2">
                  {SCREEN_WIDGETS.filter(s => s.group === group).map(({ type, title, defaultSpan }) => (
                    <button key={type} type="button"
                      onClick={() => onAdd(type, title, defaultSpan.colSpan, defaultSpan.rowSpan)}
                      className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 text-sm text-left transition-colors">
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
  const [layouts, setLayouts] = useState<DashboardLayout[]>(loadLayouts)
  const [activeId, setActiveId] = useState(layouts[0]?.id ?? 'preset-default')
  const [isEditMode, setIsEditMode] = useState(false)
  const [editWidgets, setEditWidgets] = useState<Widget[]>([])
  const [showWidgetPicker, setShowWidgetPicker] = useState(false)

  // 새 대시보드 생성 UI 상태
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')

  // 탭 이름 인라인 편집
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const active = layouts.find(l => l.id === activeId) ?? layouts[0]

  // 편집 모드 진입 시 현재 위젯 복사
  useEffect(() => {
    if (isEditMode && active) setEditWidgets([...active.widgets])
  }, [isEditMode, activeId])

  /* ── 새 대시보드 생성 ── */
  function handleCreate() {
    const name = newName.trim() || `My Dashboard ${layouts.filter(l => !l.isPreset).length + 1}`
    const newLayout: DashboardLayout = {
      id: `dash-${Date.now()}`,
      name,
      widgets: [],
      isPreset: false,
    }
    const next = [...layouts, newLayout]
    setLayouts(next)
    saveLayouts(next)
    setActiveId(newLayout.id)
    setNewName('')
    setIsCreating(false)
    setIsEditMode(true)
    setShowWidgetPicker(true)
  }

  /* ── 탭 삭제 ── */
  function handleDelete(id: string) {
    const next = layouts.filter(l => l.id !== id)
    setLayouts(next)
    saveLayouts(next)
    if (activeId === id) setActiveId(next[0]?.id ?? 'preset-default')
  }

  /* ── 탭 이름 변경 ── */
  function handleRename(id: string) {
    if (!renameValue.trim()) { setRenamingId(null); return }
    const next = layouts.map(l => l.id === id ? { ...l, name: renameValue.trim() } : l)
    setLayouts(next)
    saveLayouts(next)
    setRenamingId(null)
  }

  /* ── 위젯 조작 ── */
  function removeWidget(id: string) { setEditWidgets(prev => prev.filter(w => w.id !== id)) }

  function moveWidget(id: string, dir: -1 | 1) {
    setEditWidgets(prev => {
      const idx = prev.findIndex(w => w.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const arr = [...prev];[arr[idx], arr[next]] = [arr[next], arr[idx]]; return arr
    })
  }

  function resizeCol(id: string, d: -1 | 1) {
    setEditWidgets(prev => prev.map(w => w.id === id
      ? { ...w, colSpan: Math.max(1, Math.min(4, w.colSpan + d)) as Widget['colSpan'] } : w))
  }

  function resizeRow(id: string, d: -1 | 1) {
    setEditWidgets(prev => prev.map(w => w.id === id
      ? { ...w, rowSpan: Math.max(1, Math.min(3, w.rowSpan + d)) as Widget['rowSpan'] } : w))
  }

  function addWidget(type: WidgetType, title: string, colSpan: 1 | 2 | 3 | 4, rowSpan: 1 | 2 | 3) {
    setEditWidgets(prev => [...prev, { id: `w${Date.now()}`, type, title, colSpan, rowSpan }])
    setShowWidgetPicker(false)
  }

  function handleSave() {
    const next = layouts.map(l => l.id === activeId ? { ...l, widgets: editWidgets } : l)
    setLayouts(next)
    saveLayouts(next)
    setIsEditMode(false)
  }

  function handleCancelEdit() {
    setIsEditMode(false)
    setEditWidgets([])
  }

  const displayWidgets = isEditMode ? editWidgets : (active?.widgets ?? [])

  return (
    <div className="space-y-4">
      <PageHeader
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        actions={
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <button type="button" onClick={() => setShowWidgetPicker(true)}
                  className="btn-secondary flex items-center gap-1.5 text-sm">
                  <Plus className="w-4 h-4" />{t('dashboard.addWidget')}
                </button>
                <button type="button" onClick={handleSave}
                  className="btn-primary flex items-center gap-1.5 text-sm">
                  <Save className="w-4 h-4" />{t('dashboard.saveLayout')}
                </button>
                <button type="button" onClick={handleCancelEdit} className="btn-secondary text-sm">
                  {t('common.cancel')}
                </button>
              </>
            ) : (
              <>
                <button type="button"
                  onClick={() => { setIsEditMode(true); setShowWidgetPicker(true) }}
                  className="btn-secondary flex items-center gap-1.5 text-sm">
                  <Plus className="w-4 h-4" />{t('dashboard.addWidget')}
                </button>
                <button type="button" onClick={() => setIsEditMode(true)}
                  className="btn-secondary flex items-center gap-1.5 text-sm">
                  <Settings2 className="w-4 h-4" />{t('dashboard.editLayout')}
                </button>
              </>
            )}
          </div>
        }
      />

      {/* ── 대시보드 탭 바 ── */}
      <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto pb-0">
        {layouts.map(layout => (
          <div key={layout.id} className="flex-shrink-0">
            {renamingId === layout.id ? (
              /* 인라인 이름 편집 */
              <div className="flex items-center gap-1 px-2 py-1 mb-[-1px] border border-primary-400 rounded-t-md bg-white">
                <input
                  autoFocus
                  type="text"
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleRename(layout.id)
                    if (e.key === 'Escape') setRenamingId(null)
                  }}
                  className="text-sm border-none outline-none w-28"
                />
                <button type="button" onClick={() => handleRename(layout.id)} className="text-green-600">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => setRenamingId(null)} className="text-gray-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => { setActiveId(layout.id); setIsEditMode(false) }}
                className={`group flex items-center gap-1 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeId === layout.id
                    ? 'border-primary-600 text-primary-700 bg-primary-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{layout.name}</span>
                {layout.isPreset && (
                  <span className="text-[9px] bg-gray-200 text-gray-500 rounded px-1 font-normal">Preset</span>
                )}
                {/* 사용자 레이아웃에만 편집/삭제 버튼 */}
                {!layout.isPreset && activeId === layout.id && !isEditMode && (
                  <span className="flex items-center gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={e => { e.stopPropagation(); setRenamingId(layout.id); setRenameValue(layout.name) }}
                      onKeyDown={e => e.key === 'Enter' && (setRenamingId(layout.id), setRenameValue(layout.name))}
                      className="p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={e => { e.stopPropagation(); handleDelete(layout.id) }}
                      onKeyDown={e => e.key === 'Enter' && handleDelete(layout.id)}
                      className="p-0.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </span>
                  </span>
                )}
              </button>
            )}
          </div>
        ))}

        {/* 새 대시보드 추가 버튼 / 입력 */}
        {isCreating ? (
          <div className="flex items-center gap-1 px-2 py-1 border border-primary-400 rounded-t-md bg-white mb-[-1px] flex-shrink-0">
            <input
              autoFocus
              type="text"
              placeholder="Dashboard name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCreate()
                if (e.key === 'Escape') { setIsCreating(false); setNewName('') }
              }}
              className="text-sm border-none outline-none w-32"
            />
            <button type="button" onClick={handleCreate} className="text-green-600 hover:text-green-700">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => { setIsCreating(false); setNewName('') }} className="text-gray-400">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-t-md transition-colors flex-shrink-0"
            title="New Dashboard"
          >
            <Plus className="w-4 h-4" />
            <span>New Dashboard</span>
          </button>
        )}
      </div>

      {isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm text-blue-700 flex items-center gap-2">
          <Settings2 className="w-4 h-4 flex-shrink-0" />
          {t('dashboard.editModeHint')}
        </div>
      )}

      {/* ── 위젯 그리드 ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {displayWidgets.map((widget, idx) => (
          <WidgetCard
            key={widget.id}
            widget={widget}
            index={idx}
            total={displayWidgets.length}
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
        {!isEditMode && displayWidgets.length === 0 && (
          <div className="col-span-4 text-center py-20 text-gray-400">
            <LayoutDashboard className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-sm mb-3">No widgets.</p>
            <button type="button" onClick={() => { setIsEditMode(true); setShowWidgetPicker(true) }}
              className="btn-secondary text-sm">{t('dashboard.addWidget')}</button>
          </div>
        )}
      </div>

      {showWidgetPicker && <WidgetPicker onAdd={addWidget} onClose={() => setShowWidgetPicker(false)} />}
    </div>
  )
}
