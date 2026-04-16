import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader, KpiCard } from '@/components/common'
import {
  LayoutDashboard, Plus, Settings2, Save, X,
  Package, CheckSquare, TrendingUp, AlertTriangle,
  BarChart2, Activity, Maximize2, GripVertical,
} from 'lucide-react'

/* ── 위젯 타입 정의 ─────────────────────────────── */
type WidgetType =
  | 'kpi-oee'
  | 'kpi-output'
  | 'kpi-dhu'
  | 'kpi-otd'
  | 'lot-status'
  | 'line-efficiency'
  | 'mfz-alert'
  | 'wip-summary'

interface Widget {
  id: string
  type: WidgetType
  title: string
  col: number   // 1 or 2
  row: number
}

/* ── 목업 데이터 ─────────────────────────────────── */
const INITIAL_WIDGETS: Widget[] = [
  { id: 'w1', type: 'kpi-oee',        title: 'OEE',           col: 1, row: 1 },
  { id: 'w2', type: 'kpi-output',     title: '금일 생산량',    col: 2, row: 1 },
  { id: 'w3', type: 'kpi-dhu',        title: 'DHU',           col: 3, row: 1 },
  { id: 'w4', type: 'kpi-otd',        title: 'OTD',           col: 4, row: 1 },
  { id: 'w5', type: 'lot-status',     title: 'LOT 현황',      col: 1, row: 2 },
  { id: 'w6', type: 'line-efficiency','title': '라인 효율',   col: 2, row: 2 },
  { id: 'w7', type: 'mfz-alert',      title: 'MFZ 알림',     col: 3, row: 2 },
  { id: 'w8', type: 'wip-summary',    title: 'WIP 요약',     col: 4, row: 2 },
]

const AVAILABLE_WIDGETS: { type: WidgetType; title: string; icon: React.ElementType }[] = [
  { type: 'kpi-oee',        title: 'OEE 카드',      icon: Activity },
  { type: 'kpi-output',     title: '생산량 카드',    icon: Package },
  { type: 'kpi-dhu',        title: 'DHU 카드',      icon: CheckSquare },
  { type: 'kpi-otd',        title: 'OTD 카드',      icon: TrendingUp },
  { type: 'lot-status',     title: 'LOT 현황 표',   icon: BarChart2 },
  { type: 'line-efficiency','title': '라인 효율 표', icon: Activity },
  { type: 'mfz-alert',      title: 'MFZ 알림',     icon: AlertTriangle },
  { type: 'wip-summary',    title: 'WIP 요약',     icon: BarChart2 },
]

const LOT_STATUS_DATA = [
  { status: '재단', count: 12, color: 'bg-blue-100 text-blue-800' },
  { status: '봉제', count: 28, color: 'bg-purple-100 text-purple-800' },
  { status: '품질검사', count: 8, color: 'bg-yellow-100 text-yellow-800' },
  { status: '포장 대기', count: 5, color: 'bg-green-100 text-green-800' },
  { status: 'MFZ 보류', count: 2, color: 'bg-red-100 text-red-800' },
]

const LINE_DATA = [
  { line: 'LINE-A', output: 920, target: 1000, eff: 92 },
  { line: 'LINE-B', output: 710, target: 800, eff: 89 },
  { line: 'LINE-C', output: 1080, target: 1200, eff: 90 },
  { line: 'LINE-D', output: 740, target: 900, eff: 82 },
]

/* ── 위젯 콘텐츠 렌더러 ─────────────────────────── */
function WidgetContent({ type }: { type: WidgetType }) {
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
        <div className="space-y-2 p-1">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '총 활성 LOT', value: '55', color: 'text-blue-700' },
              { label: '출하 대기', value: '8', color: 'text-green-700' },
              { label: '품질 이슈', value: '3', color: 'text-red-600' },
              { label: '오더 잔량', value: '12,840', color: 'text-gray-800' },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-2 text-center">
                <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )
    default:
      return <div className="text-sm text-gray-400 text-center py-4">콘텐츠 없음</div>
  }
}

/* ── 저장된 레이아웃 목록 (Mock) ─────────────────── */
const SAVED_LAYOUTS = [
  { key: 'layout-default', name: '기본 대시보드', isDefault: true },
  { key: 'layout-quality', name: '품질 집중 뷰', isDefault: false },
]

/* ── 메인 컴포넌트 ───────────────────────────────── */
export function DashboardPage() {
  const { t } = useTranslation()
  const [widgets, setWidgets] = useState<Widget[]>(INITIAL_WIDGETS)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showWidgetPicker, setShowWidgetPicker] = useState(false)
  const [savedLayout, setSavedLayout] = useState('layout-default')
  const [saveMsg, setSaveMsg] = useState('')

  function removeWidget(id: string) {
    setWidgets(prev => prev.filter(w => w.id !== id))
  }

  function addWidget(type: WidgetType, title: string) {
    const newWidget: Widget = {
      id: `w${Date.now()}`,
      type,
      title,
      col: (widgets.length % 4) + 1,
      row: Math.floor(widgets.length / 4) + 1,
    }
    setWidgets(prev => [...prev, newWidget])
    setShowWidgetPicker(false)
  }

  function handleSave() {
    setSaveMsg('레이아웃이 저장되었습니다.')
    setIsEditMode(false)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        actions={
          <div className="flex items-center gap-2">
            {/* 레이아웃 선택 */}
            <select
              value={savedLayout}
              onChange={e => setSavedLayout(e.target.value)}
              className="input text-sm"
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
                <button
                  type="button"
                  onClick={() => { setWidgets(INITIAL_WIDGETS); setIsEditMode(false) }}
                  className="btn-secondary text-sm"
                >
                  {t('common.cancel')}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditMode(true)}
                className="btn-secondary flex items-center gap-1.5 text-sm"
              >
                <Settings2 className="w-4 h-4" />
                {t('dashboard.editLayout')}
              </button>
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
          {t('dashboard.editModeHint')}
        </div>
      )}

      {/* 위젯 그리드 — 4컬럼 */}
      <div className="grid grid-cols-4 gap-4">
        {widgets.map(widget => (
          <div
            key={widget.id}
            className={`card relative ${isEditMode ? 'ring-2 ring-blue-300 ring-dashed' : ''}`}
          >
            {/* 위젯 헤더 */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                {isEditMode && (
                  <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                )}
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  {widget.title}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" className="p-1 text-gray-300 hover:text-gray-500">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => removeWidget(widget.id)}
                    className="p-1 text-red-300 hover:text-red-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 위젯 콘텐츠 */}
            <WidgetContent type={widget.type} />
          </div>
        ))}

        {/* 위젯 추가 버튼 (편집 모드) */}
        {isEditMode && (
          <button
            type="button"
            onClick={() => setShowWidgetPicker(true)}
            className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors min-h-[120px]"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm">{t('dashboard.addWidget')}</span>
          </button>
        )}
      </div>

      {/* 위젯 선택 모달 */}
      {showWidgetPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                <LayoutDashboard className="w-5 h-5 inline mr-2 text-primary-600" />
                {t('dashboard.addWidget')}
              </h3>
              <button type="button" onClick={() => setShowWidgetPicker(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_WIDGETS.map(({ type, title, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addWidget(type, title)}
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 text-sm text-left transition-colors"
                >
                  <Icon className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <span>{title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
