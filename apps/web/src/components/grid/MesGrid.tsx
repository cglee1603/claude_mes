import { useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useTranslation } from 'react-i18next'

// DataTable 호환 인터페이스 — 모든 페이지의 Column<T>를 그대로 수용
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
  /** 레이아웃 저장 키 (예: 'WH-01-grid') — 추후 DB 저장 연동 */
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

  const colDefs = useMemo<ColDef[]>(
    () =>
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
    // 컬럼 구조가 바뀔 때만 재계산
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
        suppressMovableColumns={false}
        animateRows
      />
    </div>
  )
}
