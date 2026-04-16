import { useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
  ModuleRegistry,
  AllCommunityModule,
  type ColDef,
  type ICellRendererParams,
} from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useTranslation } from 'react-i18next'

// v35 필수: 커뮤니티 모듈 전체 등록 (한 번만 실행됨)
ModuleRegistry.registerModules([AllCommunityModule])

// DataTable 호환 인터페이스
export interface Column<T = object> {
  key: keyof T | string
  header: string
  render?: (row: T) => React.ReactNode
  className?: string
  width?: number
}

interface MesGridProps<T extends object> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  gridKey?: string
  height?: number | string
}

export function MesGrid<T extends object>({
  columns,
  data,
  loading = false,
  height = 400,
}: MesGridProps<T>) {
  const { t } = useTranslation()

  const colDefs = useMemo<ColDef[]>(() =>
    columns.map(col => {
      const def: ColDef = {
        field: col.key as string,
        headerName: col.header,
        resizable: true,
        ...(col.width ? { width: col.width } : { flex: 1 }),
        ...(col.className ? { cellClass: col.className } : {}),
      }
      if (col.render) {
        def.cellRenderer = (params: ICellRendererParams) =>
          params.data ? col.render!(params.data as T) : null
      }
      return def
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(columns.map(c => ({ key: c.key, header: c.header, width: c.width })))]
  )

  const defaultColDef = useMemo<ColDef>(
    () => ({ sortable: true, filter: true, resizable: true }),
    []
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        <span className="text-sm">{t('common.loading')}</span>
      </div>
    )
  }

  return (
    <div className="ag-theme-alpine w-full" style={{ height }}>
      <AgGridReact
        rowData={data}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        noRowsOverlayComponent={() => (
          <span className="text-sm text-gray-400">{t('common.noData')}</span>
        )}
      />
    </div>
  )
}
