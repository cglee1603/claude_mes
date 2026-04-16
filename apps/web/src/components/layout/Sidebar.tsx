import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Package,
  Layers,
  Scissors,
  Shirt,
  CheckSquare,
  Archive,
  BarChart2,
  Settings,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  User,
} from 'lucide-react'

type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM'

const PRIORITY_BADGE: Record<Priority, string> = {
  CRITICAL: 'bg-red-600 text-white',
  HIGH:     'bg-orange-500 text-white',
  MEDIUM:   'bg-gray-500 text-white',
}

interface SubItem {
  label: string
  path: string
  priority?: Priority
}

interface NavGroup {
  key: string
  label: string
  path: string
  icon: React.ElementType
  children: SubItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    key: 'warehouse',
    label: 'nav.warehouse',
    path: '/warehouse',
    icon: Package,
    children: [
      { label: 'nav.wh01', path: '/warehouse/receive' },
      { label: 'nav.wh02', path: '/warehouse/history' },
      { label: 'nav.wh03', path: '/warehouse/dashboard' },
    ],
  },
  {
    key: 'relaxation',
    label: 'nav.relaxation',
    path: '/relaxation',
    icon: Layers,
    children: [
      { label: 'nav.rx04', path: '/relaxation/plan' },
      { label: 'nav.rx05', path: '/relaxation/material' },
      { label: 'nav.rx06', path: '/relaxation/alert' },
    ],
  },
  {
    key: 'cutting',
    label: 'nav.cutting',
    path: '/cutting',
    icon: Scissors,
    children: [
      { label: 'nav.sc07', path: '/cutting/lot-create' },
      { label: 'nav.sc08', path: '/cutting/bundle-create' },
      { label: 'nav.sc09', path: '/cutting/marker' },
      { label: 'nav.sc10', path: '/cutting/lot-list' },
      { label: 'nav.sc11', path: '/cutting/lot-trace' },
      { label: 'nav.sc12', path: '/cutting/shading' },
      { label: 'nav.sc13', path: '/cutting/dashboard' },
    ],
  },
  {
    key: 'sewing',
    label: 'nav.sewing',
    path: '/sewing',
    icon: Shirt,
    children: [
      { label: 'nav.sw14', path: '/sewing/plan', priority: 'CRITICAL' },
      { label: 'nav.sw15', path: '/sewing/layout', priority: 'CRITICAL' },
      { label: 'nav.sw16', path: '/sewing/machine', priority: 'HIGH' },
      { label: 'nav.sw17', path: '/sewing/output', priority: 'CRITICAL' },
      { label: 'nav.sw18', path: '/sewing/summary', priority: 'CRITICAL' },
    ],
  },
  {
    key: 'quality',
    label: 'nav.quality',
    path: '/quality',
    icon: CheckSquare,
    children: [
      { label: 'nav.qc25', path: '/quality/inline-inspect', priority: 'CRITICAL' },
      { label: 'nav.qc26', path: '/quality/inline-result', priority: 'HIGH' },
      { label: 'nav.qc27', path: '/quality/final-inspect', priority: 'CRITICAL' },
      { label: 'nav.qc28', path: '/quality/final-result', priority: 'CRITICAL' },
      { label: 'nav.qc29', path: '/quality/packing-inspect', priority: 'CRITICAL' },
      { label: 'nav.qc30', path: '/quality/shipping-inspect', priority: 'HIGH' },
      { label: 'nav.qc31', path: '/quality/dhu-trend', priority: 'CRITICAL' },
      { label: 'nav.qc32', path: '/quality/dashboard', priority: 'CRITICAL' },
    ],
  },
  {
    key: 'finishing',
    label: 'nav.finishing',
    path: '/finishing',
    icon: Archive,
    children: [
      { label: 'nav.fp19', path: '/finishing/tag', priority: 'HIGH' },
      { label: 'nav.fp20', path: '/finishing/polybag', priority: 'HIGH' },
      { label: 'nav.fp21', path: '/finishing/mfz', priority: 'HIGH' },
      { label: 'nav.fp22', path: '/finishing/carton', priority: 'HIGH' },
    ],
  },
  {
    key: 'analytics',
    label: 'nav.analytics',
    path: '/analytics',
    icon: BarChart2,
    children: [
      { label: 'nav.ad23', path: '/analytics/kpi' },
      { label: 'nav.ad24', path: '/analytics/wip' },
    ],
  },
  {
    key: 'admin',
    label: 'nav.admin',
    path: '/admin',
    icon: Settings,
    children: [
      { label: 'nav.adminLine',       path: '/admin/line' },
      { label: 'nav.adminMachine',    path: '/admin/machine' },
      { label: 'nav.adminSmv',        path: '/admin/smv' },
      { label: 'nav.adminErp',        path: '/admin/erp' },
      { label: 'nav.adminLifecycle',  path: '/admin/lifecycle' },
      { label: 'nav.adminQcConfig',   path: '/admin/qc-config' },
      { label: 'nav.adminPermission', path: '/admin/permission' },
      { label: 'nav.adminBackup',     path: '/admin/backup' },
    ],
  },
  {
    key: 'personal',
    label: 'nav.personal',
    path: '/dashboard',
    icon: LayoutDashboard,
    children: [
      { label: 'nav.dashboard', path: '/dashboard' },
      { label: 'nav.mypage',    path: '/mypage' },
    ],
  },
]

export function Sidebar() {
  const { t } = useTranslation()
  const location = useLocation()

  // 현재 경로에 해당하는 그룹을 초기 열림 상태로 설정
  const initialOpen = NAV_GROUPS.reduce<Record<string, boolean>>((acc, g) => {
    acc[g.key] = location.pathname.startsWith(g.path)
    return acc
  }, {})

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(initialOpen)

  function toggle(key: string) {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <aside className="w-56 min-h-screen bg-gray-900 flex flex-col">
      <div className="px-4 py-5 border-b border-gray-700">
        <h2 className="text-white font-bold text-lg leading-tight">Garment</h2>
        <p className="text-gray-400 text-xs mt-0.5">OEM MES</p>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_GROUPS.map(({ key, label, path, icon: Icon, children }) => {
          const isGroupActive = location.pathname.startsWith(path)
          const isOpen = openGroups[key]

          return (
            <div key={key}>
              {/* Group header */}
              <button
                type="button"
                onClick={() => toggle(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isGroupActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left truncate">{t(label)}</span>
                {isOpen
                  ? <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                  : <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                }
              </button>

              {/* Sub items */}
              {isOpen && (
                <div className="mt-0.5 ml-3 border-l border-gray-700 pl-2 space-y-0.5">
                  {children.map((child) => (
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
