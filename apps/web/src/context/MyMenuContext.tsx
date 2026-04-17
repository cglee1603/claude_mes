import { createContext, useContext, useState, useCallback } from 'react'

/* ── 전체 화면 목록 (34개) ───────────────────────── */
export interface ScreenInfo {
  code: string
  title: string
  path: string
  group: string
}

export const ALL_SCREENS: ScreenInfo[] = [
  // Warehouse (7)
  { code: 'H-WH-01',    title: 'Fabric Receive',       path: '/warehouse/fabric-receive', group: 'Warehouse' },
  { code: 'H-WH-02',    title: 'Trim Receive',          path: '/warehouse/trim-receive',   group: 'Warehouse' },
  { code: 'H-WH-03',    title: 'Issue Voucher',         path: '/warehouse/issue-voucher',  group: 'Warehouse' },
  { code: 'H-WH-04',    title: 'Inventory',             path: '/warehouse/inventory',      group: 'Warehouse' },
  { code: 'H-WH-05',    title: 'Relaxation',            path: '/warehouse/relaxation',     group: 'Warehouse' },
  { code: 'H-PRINT-01', title: 'Roll Label',            path: '/warehouse/roll-label',     group: 'Warehouse' },
  { code: 'H-PRINT-02', title: 'Bundle Label',          path: '/warehouse/bundle-label',   group: 'Warehouse' },
  // Cutting (8)
  { code: 'H-SC-01',    title: 'Cutting Plan',          path: '/cutting/cutting-plan',     group: 'Cutting' },
  { code: 'H-SC-02',    title: 'Spreading Report',      path: '/cutting/spreading',        group: 'Cutting' },
  { code: 'H-SC-03',    title: 'Marker Efficiency',     path: '/cutting/marker',           group: 'Cutting' },
  { code: 'H-LOT-01',   title: 'Color Group LOT',       path: '/cutting/color-group',      group: 'Cutting' },
  { code: 'H-LOT-02',   title: 'Line Delivery',         path: '/cutting/line-delivery',    group: 'Cutting' },
  { code: 'H-SCAN-01',  title: 'Bundle Scan',           path: '/cutting/bundle-scan',      group: 'Cutting' },
  { code: 'H-CUT-04',   title: 'Outsource',             path: '/cutting/outsource',        group: 'Cutting' },
  { code: 'H-CUT-05',   title: 'Daily Cutting Report',  path: '/cutting/daily-report',     group: 'Cutting' },
  // Sewing (12)
  { code: 'H-SW-01',    title: 'Production Plan',       path: '/sewing/production-plan',    group: 'Sewing' },
  { code: 'H-SW-02',    title: 'PP Checklist',          path: '/sewing/pp-checklist',       group: 'Sewing' },
  { code: 'H-SW-03',    title: 'Material Receiving',    path: '/sewing/material-receiving', group: 'Sewing' },
  { code: 'H-RT-01',    title: 'Production Output',     path: '/sewing/output',             group: 'Sewing' },
  { code: 'H-BOARD-01', title: 'Scoreboard',            path: '/sewing/scoreboard',         group: 'Sewing' },
  { code: 'H-QC-01',    title: 'Bundle QC',             path: '/sewing/bundle-qc',          group: 'Sewing' },
  { code: 'H-QC-02',    title: 'Endline QC',            path: '/sewing/endline-qc',         group: 'Sewing' },
  { code: 'H-QC-03',    title: 'QC Dashboard',          path: '/sewing/qc-dashboard',       group: 'Sewing' },
  { code: 'H-MFZ-01',   title: 'Metal Detection',       path: '/sewing/metal-detection',    group: 'Sewing' },
  { code: 'H-SW-04',    title: 'Sharp Tools',           path: '/sewing/sharp-tools',        group: 'Sewing' },
  { code: 'H-SW-05',    title: 'Passed Garments',       path: '/sewing/passed-garments',    group: 'Sewing' },
  { code: 'H-SW-06',    title: 'Internal Transfer',     path: '/sewing/internal-transfer',  group: 'Sewing' },
  { code: 'H-SW-07',    title: 'Hourly Entry',          path: '/sewing/hourly-entry',       group: 'Sewing' },
  // Finishing (10)
  { code: 'H-FIN-01',   title: 'Hangtag Inspect',       path: '/finishing/hangtag-inspect', group: 'Finishing' },
  { code: 'H-FIN-02',   title: 'MFZ Calibration',       path: '/finishing/mfz-calibration', group: 'Finishing' },
  { code: 'H-FIN-03',   title: 'Weight / Qty Inspect',  path: '/finishing/weight-inspect',  group: 'Finishing' },
  { code: 'H-FIN-04',   title: 'Carton Inspect',        path: '/finishing/carton-inspect',  group: 'Finishing' },
  { code: 'H-FIN-05',   title: 'Packing List',          path: '/finishing/packing-list',    group: 'Finishing' },
  { code: 'H-PERF-01',  title: 'Finishing Performance', path: '/finishing/performance',     group: 'Finishing' },
  { code: 'H-FIN-06',   title: 'Shipment',              path: '/finishing/shipment',        group: 'Finishing' },
  { code: 'H-FIN-07',   title: 'Dry Room Check',        path: '/finishing/dry-room',        group: 'Finishing' },
  { code: 'H-FIN-08',   title: 'MFZ Daily Summary',     path: '/finishing/mfz-summary',     group: 'Finishing' },
  { code: 'H-FIN-09',   title: 'Monthly Report',        path: '/finishing/monthly-report',  group: 'Finishing' },
  // Dashboard (1)
  { code: 'Dashboard',   title: 'My Dashboard',          path: '/dashboard',                 group: 'Personal' },
]

/* ── 워크스페이스 타입 ───────────────────────────── */
export interface WorkspacePanel {
  id: string
  screenCode: string
  title: string
  colSpan: 1 | 2 | 3 | 4
  rowSpan: 1 | 2 | 3
}

export interface Workspace {
  id: string
  name: string
  panels: WorkspacePanel[]
}

/* ── Export / Import 파일 포맷 ───────────────────── */
export interface WorkspaceExportFile {
  version: '1.0'
  exportedAt: string
  workspaces: Workspace[]
}

/* ── Context ────────────────────────────────────── */
interface MyMenuContextValue {
  workspaces: Workspace[]
  addWorkspace: (name: string) => Workspace
  updateWorkspace: (id: string, panels: WorkspacePanel[]) => void
  renameWorkspace: (id: string, name: string) => void
  deleteWorkspace: (id: string) => void
  getWorkspace: (id: string) => Workspace | undefined
  importWorkspaces: (incoming: Workspace[]) => number
}

const MyMenuContext = createContext<MyMenuContextValue>({
  workspaces: [],
  addWorkspace: (name) => ({ id: '', name, panels: [] }),
  updateWorkspace: () => {},
  renameWorkspace: () => {},
  deleteWorkspace: () => {},
  getWorkspace: () => undefined,
  importWorkspaces: () => 0,
})

const STORAGE_KEY = 'mes-my-workspaces'

function load(): Workspace[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Workspace[]
  } catch {
    return []
  }
}

function save(ws: Workspace[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ws))
}

export function MyMenuProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(load)

  const addWorkspace = useCallback((name: string): Workspace => {
    const ws: Workspace = { id: `ws-${Date.now()}`, name, panels: [] }
    setWorkspaces(prev => { const next = [...prev, ws]; save(next); return next })
    return ws
  }, [])

  const updateWorkspace = useCallback((id: string, panels: WorkspacePanel[]) => {
    setWorkspaces(prev => {
      const next = prev.map(w => w.id === id ? { ...w, panels } : w)
      save(next); return next
    })
  }, [])

  const renameWorkspace = useCallback((id: string, name: string) => {
    setWorkspaces(prev => {
      const next = prev.map(w => w.id === id ? { ...w, name } : w)
      save(next); return next
    })
  }, [])

  const deleteWorkspace = useCallback((id: string) => {
    setWorkspaces(prev => { const next = prev.filter(w => w.id !== id); save(next); return next })
  }, [])

  const getWorkspace = useCallback(
    (id: string) => workspaces.find(w => w.id === id),
    [workspaces]
  )

  // incoming 배열을 현재 목록에 병합. 이름 충돌 시 " (가져옴)" 접미사 부여.
  // 반환값: 실제로 추가된 개수
  const importWorkspaces = useCallback((incoming: Workspace[]): number => {
    let addedCount = 0
    setWorkspaces(prev => {
      const existingNames = new Set(prev.map(w => w.name))
      const toAdd: Workspace[] = []
      incoming.forEach((ws, i) => {
        let name = ws.name
        if (existingNames.has(name)) name = `${name} (imported)`
        if (existingNames.has(name)) name = `${name} ${i + 1}`
        existingNames.add(name)
        toAdd.push({ ...ws, id: `ws-${Date.now()}-${i}`, name })
        addedCount++
      })
      const next = [...prev, ...toAdd]
      save(next)
      return next
    })
    return addedCount
  }, [])

  return (
    <MyMenuContext.Provider value={{
      workspaces, addWorkspace, updateWorkspace,
      renameWorkspace, deleteWorkspace, getWorkspace, importWorkspaces,
    }}>
      {children}
    </MyMenuContext.Provider>
  )
}

export const useMyMenu = () => useContext(MyMenuContext)
