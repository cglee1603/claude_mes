import { createContext, useContext, useState, useCallback } from 'react'

/* ── 전체 화면 목록 (33개) ─────────────────────────── */
export interface ScreenInfo {
  code: string
  title: string
  path: string
  group: string
}

export const ALL_SCREENS: ScreenInfo[] = [
  { code: 'WH-01', title: '원단 입고',          path: '/warehouse/receive',       group: '창고·입고' },
  { code: 'WH-02', title: '입고 이력',           path: '/warehouse/history',       group: '창고·입고' },
  { code: 'WH-03', title: '창고 대시보드',        path: '/warehouse/dashboard',     group: '창고·입고' },
  { code: 'RX-04', title: '릴렉싱 계획',         path: '/relaxation/plan',         group: '릴렉싱' },
  { code: 'RX-05', title: '소재별 시간',          path: '/relaxation/material',     group: '릴렉싱' },
  { code: 'RX-06', title: '완료 알림',            path: '/relaxation/alert',        group: '릴렉싱' },
  { code: 'SC-07', title: 'LOT 생성',            path: '/cutting/lot-create',      group: '재단' },
  { code: 'SC-08', title: 'Bundle 생성',         path: '/cutting/bundle-create',   group: '재단' },
  { code: 'SC-09', title: '마커 효율',            path: '/cutting/marker',          group: '재단' },
  { code: 'SC-10', title: 'LOT 목록',            path: '/cutting/lot-list',        group: '재단' },
  { code: 'SC-11', title: 'LOT 추적',            path: '/cutting/lot-trace',       group: '재단' },
  { code: 'SC-12', title: '쉐이딩 확인',          path: '/cutting/shading',         group: '재단' },
  { code: 'SC-13', title: '재단 대시보드',         path: '/cutting/dashboard',       group: '재단' },
  { code: 'SW-14', title: '투입 계획',            path: '/sewing/plan',             group: '봉제' },
  { code: 'SW-15', title: '라인 레이아웃',         path: '/sewing/layout',           group: '봉제' },
  { code: 'SW-16', title: '기계 상태',            path: '/sewing/machine',          group: '봉제' },
  { code: 'SW-17', title: '팀 실적 입력',         path: '/sewing/output',           group: '봉제' },
  { code: 'SW-18', title: '팀 실적 요약',         path: '/sewing/summary',          group: '봉제' },
  { code: 'QC-25', title: '인라인 검사',          path: '/quality/inline-inspect',  group: '품질검사' },
  { code: 'QC-26', title: '인라인 결과',          path: '/quality/inline-result',   group: '품질검사' },
  { code: 'QC-27', title: '최종 검사',            path: '/quality/final-inspect',   group: '품질검사' },
  { code: 'QC-28', title: '최종 결과',            path: '/quality/final-result',    group: '품질검사' },
  { code: 'QC-29', title: '포장 검사',            path: '/quality/packing-inspect', group: '품질검사' },
  { code: 'QC-30', title: '출하 검사',            path: '/quality/shipping-inspect',group: '품질검사' },
  { code: 'QC-31', title: 'DHU 트렌드',          path: '/quality/dhu-trend',       group: '품질검사' },
  { code: 'QC-32', title: '품질 대시보드',         path: '/quality/dashboard',       group: '품질검사' },
  { code: 'FP-19', title: '태깅',                 path: '/finishing/tag',           group: '완성·포장' },
  { code: 'FP-20', title: 'Polybag',             path: '/finishing/polybag',       group: '완성·포장' },
  { code: 'FP-21', title: 'MFZ 검사',            path: '/finishing/mfz',           group: '완성·포장' },
  { code: 'FP-22', title: 'Carton',              path: '/finishing/carton',        group: '완성·포장' },
  { code: 'AD-23', title: '공장장 대시보드',       path: '/analytics/kpi',           group: '분석·현황' },
  { code: 'AD-24', title: 'WIP 조회',            path: '/analytics/wip',           group: '분석·현황' },
]

/* ── Context ────────────────────────────────────────── */
interface MyMenuContextValue {
  pinned: string[]
  togglePin: (code: string) => void
  isPinned: (code: string) => boolean
  pinnedScreens: ScreenInfo[]
}

const MyMenuContext = createContext<MyMenuContextValue>({
  pinned: [],
  togglePin: () => {},
  isPinned: () => false,
  pinnedScreens: [],
})

const STORAGE_KEY = 'mes-my-menu-pins'

export function MyMenuProvider({ children }: { children: React.ReactNode }) {
  const [pinned, setPinned] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[]
    } catch {
      return []
    }
  })

  const togglePin = useCallback((code: string) => {
    setPinned(prev => {
      const next = prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isPinned = useCallback((code: string) => pinned.includes(code), [pinned])

  const pinnedScreens = ALL_SCREENS.filter(s => pinned.includes(s.code))

  return (
    <MyMenuContext.Provider value={{ pinned, togglePin, isPinned, pinnedScreens }}>
      {children}
    </MyMenuContext.Provider>
  )
}

export const useMyMenu = () => useContext(MyMenuContext)
