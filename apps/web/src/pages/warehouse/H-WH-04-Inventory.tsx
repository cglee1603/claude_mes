import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { KpiCard } from '../../components/common/KpiCard'
import { exportToCsv } from '../../utils/excel'

interface InventoryFilters {
  dateFrom: string
  dateTo: string
  itemType: string
  status: string
}

interface InventoryRow {
  id: string
  itemCode: string
  itemName: string
  type: string
  currentStock: number
  unit: string
  location: string
  lastUpdated: string
}

const MOCK_DATA: InventoryRow[] = [
  { id: '1', itemCode: 'ROLL-2026-003', itemName: 'Linen Blend WHT-001', type: 'FABRIC', currentStock: 280.5, unit: 'm', location: 'A-01-03', lastUpdated: '2026-04-14' },
  { id: '2', itemCode: 'ROLL-2026-004', itemName: 'Wool Flannel GRY-003', type: 'FABRIC', currentStock: 320.0, unit: 'm', location: 'A-01-04', lastUpdated: '2026-04-14' },
  { id: '3', itemCode: 'ROLL-2026-005', itemName: 'Cotton Poplin RED-001', type: 'FABRIC', currentStock: 150.2, unit: 'm', location: 'A-02-01', lastUpdated: '2026-04-13' },
  { id: '4', itemCode: 'TRM-ZIP-001', itemName: 'YKK Zipper 20cm', type: 'TRIM', currentStock: 450, unit: 'PCS', location: 'B-01-01', lastUpdated: '2026-04-15' },
  { id: '5', itemCode: 'TRM-BTN-002', itemName: 'Button 2-hole 15mm', type: 'TRIM', currentStock: 1800, unit: 'PCS', location: 'B-01-02', lastUpdated: '2026-04-15' },
  { id: '6', itemCode: 'TRM-INT-003', itemName: 'Interlining 100gsm', type: 'TRIM', currentStock: 185, unit: 'MTR', location: 'B-02-01', lastUpdated: '2026-04-14' },
]

const INITIAL_FILTERS: InventoryFilters = {
  dateFrom: '', dateTo: '', itemType: 'ALL', status: 'ALL',
}

export function HWH04Page() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<InventoryFilters>(INITIAL_FILTERS)

  const handleFilter = (field: keyof InventoryFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const filtered = MOCK_DATA.filter((row) => {
    if (filters.itemType !== 'ALL' && row.type !== filters.itemType) return false
    return true
  })

  const totalFabric = MOCK_DATA.filter((r) => r.type === 'FABRIC').reduce((s, r) => s + r.currentStock, 0)
  const totalTrimItems = MOCK_DATA.filter((r) => r.type === 'TRIM').length
  const lowStockRolls = MOCK_DATA.filter((r) => r.type === 'FABRIC' && r.currentStock < 200).length

  const columns: Column<InventoryRow>[] = [
    { key: 'itemCode', header: t('warehouse.inventory.itemCode'), width: 140 },
    { key: 'itemName', header: t('warehouse.inventory.itemName'), width: 180 },
    { key: 'type', header: t('warehouse.inventory.type'), width: 90 },
    { key: 'currentStock', header: t('warehouse.inventory.currentStock'), width: 110 },
    { key: 'unit', header: t('warehouse.inventory.unit'), width: 70 },
    { key: 'location', header: t('warehouse.inventory.location'), width: 100 },
    { key: 'lastUpdated', header: t('warehouse.inventory.lastUpdated'), width: 130 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('warehouse.inventory.title')} subtitle="" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label={t('warehouse.inventory.totalFabric')} value={`${totalFabric.toFixed(1)} m`} />
        <KpiCard label={t('warehouse.inventory.totalTrims')} value={`${totalTrimItems}`} />
        <KpiCard label={t('common.lowStock')} value={`${lowStockRolls}`} />
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="label">{t('common.dateFrom')}</label>
            <input type="date" className="input-field" value={filters.dateFrom} onChange={(e) => handleFilter('dateFrom', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('common.dateTo')}</label>
            <input type="date" className="input-field" value={filters.dateTo} onChange={(e) => handleFilter('dateTo', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('warehouse.inventory.type')}</label>
            <select className="input-field" value={filters.itemType} onChange={(e) => handleFilter('itemType', e.target.value)}>
              <option value="ALL">{t('common.all')}</option>
              <option value="FABRIC">FABRIC</option>
              <option value="TRIM">TRIM</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn-secondary w-full" onClick={() => setFilters(INITIAL_FILTERS)}>{t('common.reset')}</button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('warehouse.inventory.title')}</h2>
          <button className="btn-secondary text-sm" onClick={() => exportToCsv(filtered, 'inventory')}>
            {t('common.exportExcel')}
          </button>
        </div>
        <MesGrid<InventoryRow> columns={columns} data={filtered} gridKey="HWH04-grid" />
      </div>
    </div>
  )
}
