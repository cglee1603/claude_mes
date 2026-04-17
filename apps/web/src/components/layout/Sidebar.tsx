import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Package, Scissors, Shirt, Archive,
  Settings, ChevronDown, ChevronRight,
  LayoutDashboard, Star, Plus, X, ArrowUp, ArrowDown, Search,
} from 'lucide-react'
import { useMyMenu } from '@/context/MyMenuContext'
import { useFavorites } from '@/context/FavoritesContext'
import { ALL_SCREENS } from '@/context/MyMenuContext'

type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM'

const PRIORITY_BADGE: Record<Priority, string> = {
  CRITICAL: 'bg-red-600 text-white',
  HIGH:     'bg-orange-500 text-white',
  MEDIUM:   'bg-gray-500 text-white',
}

interface SubItem { label: string; path: string; priority?: Priority }
interface NavGroup { key: string; label: string; path: string; icon: React.ElementType; children: SubItem[] }

const NAV_GROUPS: NavGroup[] = [
  {
    key: 'warehouse', label: 'nav.warehouse', path: '/warehouse', icon: Package,
    children: [
      { label: 'nav.hwh01',   path: '/warehouse/fabric-receive' },
      { label: 'nav.hwh02',   path: '/warehouse/trim-receive' },
      { label: 'nav.hwh03',   path: '/warehouse/issue-voucher' },
      { label: 'nav.hwh04',   path: '/warehouse/inventory' },
      { label: 'nav.hwh05',   path: '/warehouse/relaxation' },
      { label: 'nav.hprint01', path: '/warehouse/roll-label' },
      { label: 'nav.hprint02', path: '/warehouse/bundle-label' },
    ],
  },
  {
    key: 'cutting', label: 'nav.cutting', path: '/cutting', icon: Scissors,
    children: [
      { label: 'nav.hsc01',   path: '/cutting/cutting-plan' },
      { label: 'nav.hsc02',   path: '/cutting/spreading' },
      { label: 'nav.hsc03',   path: '/cutting/marker' },
      { label: 'nav.hlot01',  path: '/cutting/color-group' },
      { label: 'nav.hlot02',  path: '/cutting/line-delivery' },
      { label: 'nav.hscan01', path: '/cutting/bundle-scan' },
      { label: 'nav.hcut04',  path: '/cutting/outsource' },
      { label: 'nav.hcut05',  path: '/cutting/daily-report' },
    ],
  },
  {
    key: 'sewing', label: 'nav.sewing', path: '/sewing', icon: Shirt,
    children: [
      { label: 'nav.hsw01',  path: '/sewing/production-plan',    priority: 'CRITICAL' },
      { label: 'nav.hsw02',  path: '/sewing/pp-checklist' },
      { label: 'nav.hsw03',  path: '/sewing/material-receiving' },
      { label: 'nav.hrt01',   path: '/sewing/output',            priority: 'CRITICAL' },
      { label: 'nav.hqc01',  path: '/sewing/bundle-qc',          priority: 'HIGH' },
      { label: 'nav.hqc02',  path: '/sewing/endline-qc' },
      { label: 'nav.hqc03',  path: '/sewing/qc-dashboard' },
      { label: 'nav.hmfz01', path: '/sewing/metal-detection',    priority: 'CRITICAL' },
      { label: 'nav.hsw04',  path: '/sewing/sharp-tools' },
      { label: 'nav.hsw05',  path: '/sewing/passed-garments' },
      { label: 'nav.hsw06',  path: '/sewing/internal-transfer' },
      { label: 'nav.hsw07',  path: '/sewing/hourly-entry',       priority: 'CRITICAL' },
    ],
  },
  {
    key: 'finishing', label: 'nav.finishing', path: '/finishing', icon: Archive,
    children: [
      { label: 'nav.hfin01',  path: '/finishing/hangtag-inspect' },
      { label: 'nav.hfin02',  path: '/finishing/mfz-calibration' },
      { label: 'nav.hfin03',  path: '/finishing/weight-inspect' },
      { label: 'nav.hfin04',  path: '/finishing/carton-inspect' },
      { label: 'nav.hfin05',  path: '/finishing/packing-list',   priority: 'HIGH' },
      { label: 'nav.hperf01', path: '/finishing/performance' },
      { label: 'nav.hfin06',  path: '/finishing/shipment',       priority: 'CRITICAL' },
      { label: 'nav.hfin07',  path: '/finishing/dry-room' },
      { label: 'nav.hfin08',  path: '/finishing/mfz-summary' },
      { label: 'nav.hfin09',  path: '/finishing/monthly-report' },
    ],
  },
  {
    key: 'admin', label: 'nav.admin', path: '/admin', icon: Settings,
    children: [
      { label: 'nav.adminLine',       path: '/admin/line' },
      { label: 'nav.adminMachine',    path: '/admin/machine' },
      { label: 'nav.adminSmv',        path: '/admin/smv' },
      { label: 'nav.adminErp',        path: '/admin/erp' },
      { label: 'nav.adminLifecycle',  path: '/admin/lifecycle' },
      { label: 'nav.adminQcConfig',   path: '/admin/qc-config' },
      { label: 'nav.adminPermission', path: '/admin/permission' },
      { label: 'nav.adminBackup',     path: '/admin/backup' },
      { label: 'nav.hboard01',        path: '/sewing/scoreboard',  priority: 'HIGH' },
    ],
  },
  {
    key: 'personal', label: 'nav.personal', path: '/dashboard', icon: LayoutDashboard,
    children: [
      { label: 'nav.dashboard', path: '/dashboard' },
      { label: 'nav.mypage',    path: '/mypage' },
    ],
  },
]

/* ── 화면 추가 모달 ──────────────────────────── */
function ScreenPickerModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const { addFavorite, hasFavorite } = useFavorites()
  const [query, setQuery] = useState('')

  const groups = [...new Set(ALL_SCREENS.map(s => s.group))]
  const filtered = query.trim()
    ? ALL_SCREENS.filter(s =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.code.toLowerCase().includes(query.toLowerCase())
      )
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 text-sm">{t('nav.addFavorite')}</h3>
          <button type="button" onClick={onClose}><X className="w-4 h-4 text-gray-400 hover:text-gray-600" /></button>
        </div>
        <div className="px-3 py-2 border-b border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder={t('nav.searchScreens')}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto p-3 space-y-3">
          {filtered ? (
            <div className="grid grid-cols-2 gap-1.5">
              {filtered.map(s => (
                <ScreenPickerItem key={s.code} screen={s} added={hasFavorite(s.code)} onAdd={() => addFavorite(s)} />
              ))}
            </div>
          ) : (
            groups.map(group => (
              <div key={group}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{group}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {ALL_SCREENS.filter(s => s.group === group).map(s => (
                    <ScreenPickerItem key={s.code} screen={s} added={hasFavorite(s.code)} onAdd={() => addFavorite(s)} />
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

function ScreenPickerItem({ screen, added, onAdd }: {
  screen: { code: string; path: string; title: string }
  added: boolean
  onAdd: () => void
}) {
  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={added}
      className={`flex items-start gap-1.5 p-2 rounded-lg border text-left text-xs transition-colors ${
        added
          ? 'border-yellow-200 bg-yellow-50 text-yellow-700 cursor-default'
          : 'border-gray-200 hover:border-primary-400 hover:bg-primary-50 text-gray-700'
      }`}
    >
      {added && <Star className="w-3 h-3 flex-shrink-0 mt-0.5 text-yellow-500" />}
      <div className="min-w-0">
        <span className="font-mono text-[10px] text-gray-400 block">{screen.code}</span>
        <span className="leading-tight truncate block">{screen.title}</span>
      </div>
    </button>
  )
}

/* ── 즐겨찾기 섹션 ──────────────────────────── */
function FavoritesSection({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const { t } = useTranslation()
  const { favorites, removeFavorite, moveFavorite } = useFavorites()
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-gray-300 hover:bg-gray-800 hover:text-white"
      >
        <Star className="w-4 h-4 flex-shrink-0 text-yellow-400" />
        <span className="flex-1 text-left">{t('nav.favorites')}</span>
        {favorites.length > 0 && (
          <span className="text-[10px] bg-yellow-500/80 text-white rounded-full px-1.5 font-bold mr-0.5">
            {favorites.length}
          </span>
        )}
        {isOpen
          ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        }
      </button>

      {isOpen && (
        <div className="mt-0.5 ml-3 border-l border-gray-700 pl-2 space-y-0.5">
          {favorites.length === 0 && (
            <p className="px-3 py-2 text-xs text-gray-500">{t('nav.noFavorites')}</p>
          )}
          {favorites.map((fav, idx) => (
            <div key={fav.code} className="flex items-center gap-0.5 group">
              <NavLink
                to={fav.path}
                className={({ isActive }) =>
                  `flex-1 min-w-0 flex items-center px-2 py-1.5 rounded-md text-xs transition-colors ${
                    isActive
                      ? 'bg-primary-700 text-white font-medium'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }`
                }
              >
                <span className="font-mono text-[10px] text-gray-500 mr-1.5 flex-shrink-0">{fav.code}</span>
                <span className="truncate">{fav.title}</span>
              </NavLink>
              <div className="flex-shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveFavorite(fav.code, -1)}
                  title={t('nav.moveUp')}
                  className="p-0.5 rounded text-gray-500 hover:text-gray-300 disabled:opacity-30"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  disabled={idx === favorites.length - 1}
                  onClick={() => moveFavorite(fav.code, 1)}
                  title={t('nav.moveDown')}
                  className="p-0.5 rounded text-gray-500 hover:text-gray-300 disabled:opacity-30"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => removeFavorite(fav.code)}
                  title={t('nav.removeFavorite')}
                  className="p-0.5 rounded text-gray-500 hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors w-full"
          >
            <Plus className="w-3 h-3" />
            <span>{t('nav.addFavorite')}</span>
          </button>
        </div>
      )}

      {showPicker && <ScreenPickerModal onClose={() => setShowPicker(false)} />}
    </div>
  )
}

/* ── 메인 사이드바 ──────────────────────────── */
export function Sidebar() {
  const { t } = useTranslation()
  const location = useLocation()
  const { workspaces } = useMyMenu()

  const isMyMenuActive = location.pathname.startsWith('/my-menu')

  const initialOpen = NAV_GROUPS.reduce<Record<string, boolean>>((acc, g) => {
    acc[g.key] = location.pathname.startsWith(g.path)
    return acc
  }, { myMenu: isMyMenuActive, favorites: true })

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(initialOpen)

  function toggle(key: string) {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <aside className="w-56 min-h-screen bg-gray-900 flex flex-col">
      <div className="px-4 py-5 border-b border-gray-700">
        <h2 className="text-white font-bold text-lg leading-tight">Garment</h2>
        <p className="text-gray-400 text-xs mt-0.5">OEM MES</p>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">

        {/* ── 즐겨찾기 ─────────────────────────── */}
        <FavoritesSection isOpen={!!openGroups['favorites']} onToggle={() => toggle('favorites')} />

        {/* ── 내 메뉴 (워크스페이스) ──────────────── */}
        <div>
          <button
            type="button"
            onClick={() => toggle('myMenu')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              isMyMenuActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Star className="w-4 h-4 flex-shrink-0 text-blue-400" />
            <span className="flex-1 text-left">{t('nav.myMenu')}</span>
            {workspaces.length > 0 && (
              <span className="text-[10px] bg-blue-500/80 text-white rounded-full px-1.5 font-bold mr-0.5">
                {workspaces.length}
              </span>
            )}
            {openGroups['myMenu']
              ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            }
          </button>

          {openGroups['myMenu'] && (
            <div className="mt-0.5 ml-3 border-l border-gray-700 pl-2 space-y-0.5">
              {workspaces.map(ws => (
                <NavLink
                  key={ws.id}
                  to={`/my-menu/${ws.id}`}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors ${
                      isActive
                        ? 'bg-primary-700 text-white font-medium'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                    }`
                  }
                >
                  <span className="truncate">{ws.name}</span>
                  {ws.panels.length > 0 && (
                    <span className="text-[9px] text-gray-500 flex-shrink-0 ml-1">
                      {ws.panels.length}{t('myMenu.panelCount')}
                    </span>
                  )}
                </NavLink>
              ))}
              <NavLink
                to="/my-menu"
                end
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-md text-xs transition-colors ${
                    isActive
                      ? 'bg-primary-700 text-white font-medium'
                      : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                  }`
                }
              >
                <Plus className="w-3 h-3" />
                <span>{t('nav.newLayout')}</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* ── 기존 메뉴 그룹 ──────────────────────── */}
        {NAV_GROUPS.map(({ key, label, path, icon: Icon, children }) => {
          const isGroupActive = location.pathname.startsWith(path)
          const isOpen = openGroups[key]
          return (
            <div key={key}>
              <button
                type="button"
                onClick={() => toggle(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isGroupActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left truncate">{t(label)}</span>
                {isOpen
                  ? <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                  : <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                }
              </button>
              {isOpen && (
                <div className="mt-0.5 ml-3 border-l border-gray-700 pl-2 space-y-0.5">
                  {children.map(child => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors ${
                          isActive
                            ? 'bg-primary-700 text-white font-medium'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                        }`
                      }
                    >
                      <span className="truncate">{t(child.label)}</span>
                      {child.priority && (
                        <span className={`ml-1 flex-shrink-0 px-1 py-0.5 rounded text-[9px] font-bold leading-none ${PRIORITY_BADGE[child.priority]}`}>
                          {child.priority === 'CRITICAL' ? 'C' : child.priority === 'HIGH' ? 'H' : 'M'}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
