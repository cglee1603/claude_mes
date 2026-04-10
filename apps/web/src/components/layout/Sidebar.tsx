import { NavLink } from 'react-router-dom'
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
} from 'lucide-react'

const navItems = [
  { key: 'warehouse', path: '/warehouse', icon: Package },
  { key: 'relaxation', path: '/relaxation', icon: Layers },
  { key: 'cutting', path: '/cutting', icon: Scissors },
  { key: 'sewing', path: '/sewing', icon: Shirt },
  { key: 'quality', path: '/quality', icon: CheckSquare },
  { key: 'finishing', path: '/finishing', icon: Archive },
  { key: 'analytics', path: '/analytics', icon: BarChart2 },
  { key: 'admin', path: '/admin', icon: Settings },
] as const

export function Sidebar() {
  const { t } = useTranslation()

  return (
    <aside className="w-56 min-h-screen bg-gray-900 flex flex-col">
      <div className="px-4 py-5 border-b border-gray-700">
        <h2 className="text-white font-bold text-lg leading-tight">Garment</h2>
        <p className="text-gray-400 text-xs mt-0.5">OEM MES</p>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map(({ key, path, icon: Icon }) => (
          <NavLink
            key={key}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-700 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{t(`nav.${key}`)}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
