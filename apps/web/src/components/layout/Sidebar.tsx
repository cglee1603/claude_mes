import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
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
} from 'lucide-react'

interface SubItem {
  label: string
  path: string
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
    label: '창고·입고',
    path: '/warehouse',
    icon: Package,
    children: [
      { label: 'WH-01 원단 입고', path: '/warehouse/receive' },
      { label: 'WH-02 입고 이력', path: '/warehouse/history' },
      { label: 'WH-03 창고 대시보드', path: '/warehouse/dashboard' },
    ],
  },
  {
    key: 'relaxation',
    label: '릴렉싱',
    path: '/relaxation',
    icon: Layers,
    children: [
      { label: 'RX-04 릴렉싱 계획', path: '/relaxation/plan' },
      { label: 'RX-05 소재별 시간', path: '/relaxation/material' },
      { label: 'RX-06 완료 알림', path: '/relaxation/alert' },
    ],
  },
  {
    key: 'cutting',
    label: '재단',
    path: '/cutting',
    icon: Scissors,
    children: [
      { label: 'SC-07 LOT 생성', path: '/cutting/lot-create' },
      { label: 'SC-08 Bundle 생성', path: '/cutting/bundle-create' },
      { label: 'SC-09 마커 효율', path: '/cutting/marker' },
      { label: 'SC-10 LOT 목록', path: '/cutting/lot-list' },
      { label: 'SC-11 LOT 추적', path: '/cutting/lot-trace' },
      { label: 'SC-12 쉐이딩 확인', path: '/cutting/shading' },
      { label: 'SC-13 재단 대시보드', path: '/cutting/dashboard' },
    ],
  },
  {
    key: 'sewing',
    label: '봉제',
    path: '/sewing',
    icon: Shirt,
    children: [
      { label: 'SW-14 투입 계획', path: '/sewing/plan' },
      { label: 'SW-15 라인 레이아웃', path: '/sewing/layout' },
      { label: 'SW-16 기계 상태', path: '/sewing/machine' },
      { label: 'SW-17 팀 실적 입력', path: '/sewing/output' },
      { label: 'SW-18 팀 실적 요약', path: '/sewing/summary' },
    ],
  },
  {
    key: 'quality',
    label: '품질검사',
    path: '/quality',
    icon: CheckSquare,
    children: [
      { label: 'QC-25 인라인 검사', path: '/quality/inline-inspect' },
      { label: 'QC-26 인라인 결과', path: '/quality/inline-result' },
      { label: 'QC-27 최종 검사', path: '/quality/final-inspect' },
      { label: 'QC-28 최종 결과', path: '/quality/final-result' },
      { label: 'QC-29 포장 검사', path: '/quality/packing-inspect' },
      { label: 'QC-30 출하 검사', path: '/quality/shipping-inspect' },
      { label: 'QC-31 DHU 트렌드', path: '/quality/dhu-trend' },
      { label: 'QC-32 품질 대시보드', path: '/quality/dashboard' },
    ],
  },
  {
    key: 'finishing',
    label: '완성·포장',
    path: '/finishing',
    icon: Archive,
    children: [
      { label: 'FP-19 태깅', path: '/finishing/tag' },
      { label: 'FP-20 Polybag', path: '/finishing/polybag' },
      { label: 'FP-21 금속 검출 (MFZ)', path: '/finishing/mfz' },
      { label: 'FP-22 Carton 포장', path: '/finishing/carton' },
    ],
  },
  {
    key: 'analytics',
    label: '분석·현황',
    path: '/analytics',
    icon: BarChart2,
    children: [
      { label: 'AD-23 공장장 대시보드', path: '/analytics/kpi' },
      { label: 'AD-24 WIP 조회', path: '/analytics/wip' },
    ],
  },
  {
    key: 'admin',
    label: '관리자',
    path: '/admin',
    icon: Settings,
    children: [
      { label: '생산 라인', path: '/admin/line' },
      { label: '재봉 기계', path: '/admin/machine' },
      { label: 'SMV 관리', path: '/admin/smv' },
      { label: 'ERP 동기화', path: '/admin/erp' },
      { label: '데이터 수명주기', path: '/admin/lifecycle' },
      { label: 'QC 기준', path: '/admin/qc-config' },
    ],
  },
]

export function Sidebar() {
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
                <span className="flex-1 text-left truncate">{label}</span>
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
                        `block px-3 py-2 rounded-md text-xs transition-colors ${
                          isActive
                            ? 'bg-primary-700 text-white font-medium'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                        }`
                      }
                    >
                      {child.label}
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
