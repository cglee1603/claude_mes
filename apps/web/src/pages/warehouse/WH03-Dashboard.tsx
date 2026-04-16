import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { KpiCard } from '../../components/common/KpiCard'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'

interface StockSummaryRow {
  id: string
  materialCode: string
  materialName: string
  totalRolls: number
  totalWeight: number
  relaxing: number
  readyForCutting: number
  status: string
}

const MOCK_SUMMARY: StockSummaryRow[] = [
  { id: '1', materialCode: 'MAT-CTN-001', materialName: 'Cotton Jersey 180gsm', totalRolls: 24, totalWeight: 1080.5, relaxing: 5, readyForCutting: 12, status: 'ACTIVE' },
  { id: '2', materialCode: 'MAT-PLY-002', materialName: 'Poly Twill 220gsm', totalRolls: 18, totalWeight: 950.2, relaxing: 3, readyForCutting: 10, status: 'ACTIVE' },
  { id: '3', materialCode: 'MAT-LIN-003', materialName: 'Linen Blend 160gsm', totalRolls: 12, totalWeight: 462.0, relaxing: 4, readyForCutting: 5, status: 'ACTIVE' },
  { id: '4', materialCode: 'MAT-WOL-004', materialName: 'Wool Flannel 300gsm', totalRolls: 8, totalWeight: 480.8, relaxing: 2, readyForCutting: 3, status: 'ACTIVE' },
  { id: '5', materialCode: 'MAT-CTN-005', materialName: 'Cotton Poplin 120gsm', totalRolls: 15, totalWeight: 630.0, relaxing: 1, readyForCutting: 9, status: 'ACTIVE' },
]

export function WH03DashboardPage() {
  const { t } = useTranslation()

  const columns: Column<StockSummaryRow>[] = [
    { key: 'materialCode', header: t('common.materialCode') },
    { key: 'materialName', header: t('warehouse.dashboard.stockByMaterial') },
    {
      key: 'totalRolls',
      header: t('warehouse.history.totalRolls'),
      render: (row) => (
        <span>
          {row.totalRolls} {t('warehouse.dashboard.rolls')}
        </span>
      ),
    },
    {
      key: 'totalWeight',
      header: t('warehouse.history.totalQty'),
      render: (row) => <span>{row.totalWeight.toFixed(1)} kg</span>,
    },
    {
      key: 'relaxing',
      header: t('warehouse.dashboard.relaxingMaterial'),
      render: (row) => (
        <span>
          {row.relaxing} {t('warehouse.dashboard.rolls')}
        </span>
      ),
    },
    {
      key: 'readyForCutting',
      header: t('warehouse.dashboard.readyForCutting'),
      render: (row) => (
        <span>
          {row.readyForCutting} {t('warehouse.dashboard.rolls')}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('warehouse.dashboard.title')}
        subtitle={t('warehouse.dashboard.subtitle')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label={t('warehouse.dashboard.todayReceived')}
          value={12}
          unit={t('warehouse.dashboard.rolls')}
          trend="up"
          color="blue"
        />
        <KpiCard
          label={t('warehouse.dashboard.relaxationPending')}
          value={15}
          unit={t('warehouse.dashboard.rolls')}
          trend="neutral"
          color="yellow"
        />
        <KpiCard
          label={t('warehouse.dashboard.totalStock')}
          value={77}
          unit={t('warehouse.dashboard.rolls')}
          trend="up"
          color="green"
        />
        <KpiCard
          label={t('warehouse.dashboard.fourPointFailRate')}
          value="4.2"
          unit="%"
          trend="down"
          color="red"
        />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('warehouse.dashboard.summaryTable')}
        </h2>
        <MesGrid<StockSummaryRow> columns={columns} data={MOCK_SUMMARY} />
      </div>
    </div>
  )
}
