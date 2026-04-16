import { useState, useRef, lazy, Suspense } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common'
import { useMyMenu, ALL_SCREENS, type WorkspacePanel } from '@/context/MyMenuContext'
import {
  Settings2, Save, Plus, X, ChevronLeft, ChevronRight,
  Monitor, ArrowLeft, ExternalLink, Pencil, Check,
} from 'lucide-react'

/* ── 화면 코드 → 실제 컴포넌트 매핑 ─────────────── */
const SCREEN_COMPONENTS: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  'WH-01': lazy(() => import('../warehouse/WH01-Receive').then(m => ({ default: m.WH01ReceivePage }))),
  'WH-02': lazy(() => import('../warehouse/WH02-History').then(m => ({ default: m.WH02HistoryPage }))),
  'WH-03': lazy(() => import('../warehouse/WH03-Dashboard').then(m => ({ default: m.WH03DashboardPage }))),
  'RX-04': lazy(() => import('../relaxation/RX04-Plan').then(m => ({ default: m.RX04PlanPage }))),
  'RX-05': lazy(() => import('../relaxation/RX05-Material').then(m => ({ default: m.RX05MaterialPage }))),
  'RX-06': lazy(() => import('../relaxation/RX06-Alert').then(m => ({ default: m.RX06AlertPage }))),
  'SC-07': lazy(() => import('../cutting/SC07-LotCreate').then(m => ({ default: m.SC07LotCreatePage }))),
  'SC-08': lazy(() => import('../cutting/SC08-BundleCreate').then(m => ({ default: m.SC08BundleCreatePage }))),
  'SC-09': lazy(() => import('../cutting/SC09-MarkerEfficiency').then(m => ({ default: m.SC09MarkerEfficiencyPage }))),
  'SC-10': lazy(() => import('../cutting/SC10-LotList').then(m => ({ default: m.SC10LotListPage }))),
  'SC-11': lazy(() => import('../cutting/SC11-LotTrace').then(m => ({ default: m.SC11LotTracePage }))),
  'SC-12': lazy(() => import('../cutting/SC12-ShadingCheck').then(m => ({ default: m.SC12ShadingCheckPage }))),
  'SC-13': lazy(() => import('../cutting/SC13-CuttingDashboard').then(m => ({ default: m.SC13CuttingDashboardPage }))),
  'SW-14': lazy(() => import('../sewing/SW14-InputPlan').then(m => ({ default: m.SW14InputPlanPage }))),
  'SW-15': lazy(() => import('../sewing/SW15-LineLayout').then(m => ({ default: m.SW15LineLayoutPage }))),
  'SW-16': lazy(() => import('../sewing/SW16-MachineStatus').then(m => ({ default: m.SW16MachineStatusPage }))),
  'SW-17': lazy(() => import('../sewing/SW17-OutputEntry').then(m => ({ default: m.SW17OutputEntryPage }))),
  'SW-18': lazy(() => import('../sewing/SW18-OutputSummary').then(m => ({ default: m.SW18OutputSummaryPage }))),
  'QC-25': lazy(() => import('../quality/QC25-InlineInspect').then(m => ({ default: m.QC25InlineInspectPage }))),
  'QC-26': lazy(() => import('../quality/QC26-InlineResult').then(m => ({ default: m.QC26InlineResultPage }))),
  'QC-27': lazy(() => import('../quality/QC27-FinalInspect').then(m => ({ default: m.QC27FinalInspectPage }))),
  'QC-28': lazy(() => import('../quality/QC28-FinalResult').then(m => ({ default: m.QC28FinalResultPage }))),
  'QC-29': lazy(() => import('../quality/QC29-PackingInspect').then(m => ({ default: m.QC29PackingInspectPage }))),
  'QC-30': lazy(() => import('../quality/QC30-ShippingInspect').then(m => ({ default: m.QC30ShippingInspectPage }))),
  'QC-31': lazy(() => import('../quality/QC31-DHUTrend').then(m => ({ default: m.QC31DHUTrendPage }))),
  'QC-32': lazy(() => import('../quality/QC32-QCDashboard').then(m => ({ default: m.QC32QCDashboardPage }))),
  'FP-19': lazy(() => import('../finishing/FP19-Tagging').then(m => ({ default: m.FP19TaggingPage }))),
  'FP-20': lazy(() => import('../finishing/FP20-Polybag').then(m => ({ default: m.FP20PolybagPage }))),
  'FP-21': lazy(() => import('../finishing/FP21-MFZ').then(m => ({ default: m.FP21MFZPage }))),
  'FP-22': lazy(() => import('../finishing/FP22-Carton').then(m => ({ default: m.FP22CartonPage }))),
  'AD-23': lazy(() => import('../analytics/AD23-KPI').then(m => ({ default: m.AD23KPIPage }))),
  'AD-24': lazy(() => import('../analytics/AD24-WIP').then(m => ({ default: m.AD24WIPPage }))),
}

const GROUPS = [...new Set(ALL_SCREENS.map(s => s.group))]

/* ── 화면 패널 카드 ─────────────────────────────── */
function ScreenPanel({
  panel,
  index,
  total,
  isEdit,
  onRemove,
  onMove,
  onResizeCol,
  onResizeRow,
}: {
  panel: WorkspacePanel
  index: number
  total: number
  isEdit: boolean
  onRemove: (id: string) => void
  onMove: (id: string, dir: -1 | 1) => void
  onResizeCol: (id: string, d: -1 | 1) => void
  onResizeRow: (id: string, d: -1 | 1) => void
}) {
  const { t } = useTranslation()
  const Comp = SCREEN_COMPONENTS[panel.screenCode]

  return (
    <div
      className={`card flex flex-col ${isEdit ? 'ring-2 ring-blue-300 ring-dashed' : ''}`}
      style={{
        gridColumn: `span ${panel.colSpan} / span ${panel.colSpan}`,
        gridRow: `span ${panel.rowSpan} / span ${panel.rowSpan}`,
        minHeight: panel.rowSpan === 1 ? '200px' : panel.rowSpan === 2 ? '420px' : '620px',
      }}
    >
      {/* 패널 헤더 */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Monitor className="w-3.5 h-3.5 text-primary-500" />
          <span className="text-xs font-semibold text-gray-600 truncate max-w-[180px]">{panel.title}</span>
          <span className="text-[9px] text-gray-400 font-mono">{panel.screenCode}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {!isEdit && (
            <a
              href={ALL_SCREENS.find(s => s.code === panel.screenCode)?.path}
              target="_blank"
              rel="noreferrer"
              className="p-1 text-gray-300 hover:text-primary-500"
              title={t('myMenu.openNewTab')}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {isEdit && (
            <button type="button" onClick={() => onRemove(panel.id)} className="p-1 text-red-300 hover:text-red-500">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 편집 모드 컨트롤 */}
      {isEdit && (
        <div className="flex items-center gap-1 mb-2 flex-shrink-0 flex-wrap text-xs">
          <button type="button" disabled={index === 0} onClick={() => onMove(panel.id, -1)}
            className="p-0.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button type="button" disabled={index === total - 1} onClick={() => onMove(panel.id, 1)}
            className="p-0.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-gray-300 mx-0.5">|</span>
          <span className="text-gray-400">W</span>
          <button type="button" disabled={panel.colSpan <= 1} onClick={() => onResizeCol(panel.id, -1)}
            className="px-1.5 py-0.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30">−</button>
          <span className="font-semibold text-gray-700 w-4 text-center">{panel.colSpan}</span>
          <button type="button" disabled={panel.colSpan >= 4} onClick={() => onResizeCol(panel.id, 1)}
            className="px-1.5 py-0.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30">+</button>
          <span className="text-gray-300 mx-0.5">|</span>
          <span className="text-gray-400">H</span>
          <button type="button" disabled={panel.rowSpan <= 1} onClick={() => onResizeRow(panel.id, -1)}
            className="px-1.5 py-0.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30">−</button>
          <span className="font-semibold text-gray-700 w-4 text-center">{panel.rowSpan}</span>
          <button type="button" disabled={panel.rowSpan >= 3} onClick={() => onResizeRow(panel.id, 1)}
            className="px-1.5 py-0.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30">+</button>
        </div>
      )}

      {/* 화면 콘텐츠 */}
      <div className="flex-1 min-h-0 overflow-auto rounded border border-gray-100">
        {Comp ? (
          <Suspense fallback={<div className="flex items-center justify-center h-32 text-gray-400 text-sm">{t('common.loading')}</div>}>
            <Comp />
          </Suspense>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            <Monitor className="w-5 h-5 mr-2" />{panel.screenCode}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── 화면 추가 모달 ─────────────────────────────── */
function ScreenPickerModal({ onAdd, onClose }: {
  onAdd: (code: string, title: string) => void
  onClose: () => void
}) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const filtered = query.trim()
    ? ALL_SCREENS.filter(s => s.title.includes(query) || s.code.toLowerCase().includes(query.toLowerCase()))
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-primary-600" />{t('myMenu.addScreen')}
          </h3>
          <button type="button" onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <input
          autoFocus
          type="text"
          placeholder={t('myMenu.searchScreen')}
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="input text-sm mb-4 flex-shrink-0"
        />
        <div className="overflow-y-auto flex-1">
          {filtered !== null ? (
            <div className="grid grid-cols-2 gap-2">
              {filtered.map(s => (
                <ScreenItem key={s.code} screen={s} onAdd={onAdd} />
              ))}
            </div>
          ) : (
            GROUPS.map(group => (
              <div key={group} className="mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{group}</p>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_SCREENS.filter(s => s.group === group).map(s => (
                    <ScreenItem key={s.code} screen={s} onAdd={onAdd} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function ScreenItem({ screen, onAdd }: { screen: { code: string; title: string }; onAdd: (code: string, title: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onAdd(screen.code, screen.title)}
      className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 text-left transition-colors"
    >
      <Monitor className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
      <div>
        <p className="text-[10px] text-gray-400 font-mono">{screen.code}</p>
        <p className="text-xs font-medium text-gray-700 leading-tight">{screen.title}</p>
      </div>
    </button>
  )
}

/* ── 메인 워크스페이스 페이지 ───────────────────── */
export function WorkspacePage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getWorkspace, updateWorkspace, renameWorkspace } = useMyMenu()

  const workspace = id ? getWorkspace(id) : undefined
  const [panels, setPanels] = useState<WorkspacePanel[]>(workspace?.panels ?? [])
  const [isEdit, setIsEdit] = useState(panels.length === 0)
  const [showPicker, setShowPicker] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(workspace?.name ?? '')
  const renameInputRef = useRef<HTMLInputElement>(null)

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
        <p className="text-sm">{t('common.noData')}</p>
        <button type="button" onClick={() => navigate('/my-menu')} className="btn-secondary text-sm flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />{t('myMenu.backToList')}
        </button>
      </div>
    )
  }

  function addPanel(code: string, title: string) {
    const panel: WorkspacePanel = {
      id: `p-${Date.now()}`,
      screenCode: code,
      title,
      colSpan: 2,
      rowSpan: 2,
    }
    setPanels(prev => [...prev, panel])
    setShowPicker(false)
  }

  function removePanel(pid: string) { setPanels(prev => prev.filter(p => p.id !== pid)) }

  function movePanel(pid: string, dir: -1 | 1) {
    setPanels(prev => {
      const idx = prev.findIndex(p => p.id === pid)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]]
      return arr
    })
  }

  function resizeCol(pid: string, d: -1 | 1) {
    setPanels(prev => prev.map(p => p.id === pid
      ? { ...p, colSpan: Math.max(1, Math.min(4, p.colSpan + d)) as WorkspacePanel['colSpan'] }
      : p))
  }

  function resizeRow(pid: string, d: -1 | 1) {
    setPanels(prev => prev.map(p => p.id === pid
      ? { ...p, rowSpan: Math.max(1, Math.min(3, p.rowSpan + d)) as WorkspacePanel['rowSpan'] }
      : p))
  }

  function startRename() {
    setRenameValue(workspace?.name ?? '')
    setIsRenaming(true)
    setTimeout(() => renameInputRef.current?.focus(), 0)
  }

  function commitRename() {
    const trimmed = renameValue.trim()
    if (trimmed && id) renameWorkspace(id, trimmed)
    setIsRenaming(false)
  }

  function handleSave() {
    if (id) updateWorkspace(id, panels)
    setIsEdit(false)
    setSaveMsg(t('mypage.profile.saved'))
    setTimeout(() => setSaveMsg(''), 3000)
  }

  function handleCancel() {
    setPanels(workspace?.panels ?? [])
    setIsEdit(false)
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={
          isRenaming ? (
            <div className="flex items-center gap-2">
              <input
                ref={renameInputRef}
                type="text"
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') commitRename()
                  if (e.key === 'Escape') setIsRenaming(false)
                }}
                onBlur={commitRename}
                className="input text-lg font-bold py-1 w-56"
              />
              <button type="button" onMouseDown={e => { e.preventDefault(); commitRename() }}
                className="p-1 text-green-600 hover:text-green-700">
                <Check className="w-4 h-4" />
              </button>
              <button type="button" onMouseDown={e => { e.preventDefault(); setIsRenaming(false) }}
                className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={startRename}
              className="flex items-center gap-2 group hover:text-primary-600 transition-colors"
              title={t('myMenu.rename')}
            >
              <span>{workspace.name}</span>
              <Pencil className="w-4 h-4 text-gray-300 group-hover:text-primary-400 transition-colors" />
            </button>
          )
        }
        subtitle={`${panels.length} ${t('myMenu.screenAdd')}`}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/my-menu')}
              className="btn-secondary text-sm flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />{t('myMenu.backToList')}
            </button>
            {isEdit ? (
              <>
                <button type="button" onClick={() => setShowPicker(true)} className="btn-secondary text-sm flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />{t('myMenu.addScreen')}
                </button>
                <button type="button" onClick={handleSave} className="btn-primary text-sm flex items-center gap-1.5">
                  <Save className="w-4 h-4" />{t('common.save')}
                </button>
                <button type="button" onClick={handleCancel} className="btn-secondary text-sm">{t('common.cancel')}</button>
              </>
            ) : (
              <button type="button" onClick={() => setIsEdit(true)} className="btn-secondary text-sm flex items-center gap-1.5">
                <Settings2 className="w-4 h-4" />{t('myMenu.editLayout')}
              </button>
            )}
          </div>
        }
      />

      {saveMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg">{saveMsg}</div>
      )}

      {isEdit && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm text-blue-700 flex items-center gap-2">
          <Settings2 className="w-4 h-4 flex-shrink-0" />
          {t('myMenu.addScreen')} · W(1–4) · H(1–3)
        </div>
      )}

      {/* 패널 그리드 */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {panels.map((panel, idx) => (
          <ScreenPanel
            key={panel.id}
            panel={panel}
            index={idx}
            total={panels.length}
            isEdit={isEdit}
            onRemove={removePanel}
            onMove={movePanel}
            onResizeCol={resizeCol}
            onResizeRow={resizeRow}
          />
        ))}
        {isEdit && (
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors"
            style={{ minHeight: '200px', gridColumn: 'span 2 / span 2' }}
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm">{t('myMenu.addScreen')}</span>
          </button>
        )}
        {!isEdit && panels.length === 0 && (
          <div className="col-span-4 text-center py-20 text-gray-400">
            <Monitor className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-sm mb-3">{t('myMenu.noPanels')}</p>
            <button type="button" onClick={() => setIsEdit(true)} className="btn-secondary text-sm">{t('myMenu.startEdit')}</button>
          </div>
        )}
      </div>

      {showPicker && <ScreenPickerModal onAdd={addPanel} onClose={() => setShowPicker(false)} />}
    </div>
  )
}
