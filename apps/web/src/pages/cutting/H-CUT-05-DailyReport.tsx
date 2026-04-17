import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/grid/MesGrid'
import { KpiCard } from '../../components/common/KpiCard'
import { exportToCsv } from '../../utils/excel'

interface DailyRow {
  line: string
  orderNo: string
  colorCode: string
  plannedQty: number
  actualQty: number
  achievementRate: number
  manager: string
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

const MOCK_ROWS: DailyRow[] = [
  { line: 'LINE-A', orderNo: 'ORD-2026-001', colorCode: 'BLK', plannedQty: 500, actualQty: 490, achievementRate: 98.0, manager: 'Nguyen Van A' },
  { line: 'LINE-A', orderNo: 'ORD-2026-001', colorCode: 'WHT', plannedQty: 300, actualQty: 195, achievementRate: 65.0, manager: 'Nguyen Van A' },
  { line: 'LINE-B', orderNo: 'ORD-2026-002', colorCode: 'RED', plannedQty: 400, actualQty: 360, achievementRate: 90.0, manager: 'Tran Thi B' },
  { line: 'LINE-B', orderNo: 'ORD-2026-002', colorCode: 'BLU', plannedQty: 400, actualQty: 405, achievementRate: 101.3, manager: 'Tran Thi B' },
  { line: 'LINE-C', orderNo: 'ORD-2026-003', colorCode: 'GRY', plannedQty: 600, actualQty: 420, achievementRate: 70.0, manager: 'Le Van C' },
]

export function HCut05Page() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState(todayStr())

  const totalPlanned = MOCK_ROWS.reduce((s, r) => s + r.plannedQty, 0)
  const totalActual = MOCK_ROWS.reduce((s, r) => s + r.actualQty, 0)
  const overallRate = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0
  const totalBundles = MOCK_ROWS.length * 2

  const columns: Column<DailyRow>[] = [
    { key: 'line', header: t('cutting.dailyReport.line'), width: 110 },
    { key: 'orderNo', header: t('cutting.dailyReport.orderNo'), width: 140 },
    { key: 'colorCode', header: t('cutting.dailyReport.colorCode'), width: 100 },
    { key: 'plannedQty', header: t('cutting.dailyReport.plannedQty'), width: 110 },
    { key: 'actualQty', header: t('cutting.dailyReport.actualQty'), width: 110 },
    {
      key: 'achievementRate',
      header: t('cutting.dailyReport.achievementRate'),
      width: 120,
      render: (row) => (
        <span className={row.achievementRate < 80 ? 'text-red-600 font-semibold' : 'text-green-700 font-medium'}>
          {row.achievementRate.toFixed(1)}%
        </span>
      ),
    },
    { key: 'manager', header: t('cutting.dailyReport.manager'), width: 140 },
  ]

  function handleExport() {
    exportToCsv(
      MOCK_ROWS.map((r) => ({
        [t('cutting.dailyReport.line')]: r.line,
        [t('cutting.dailyReport.orderNo')]: r.orderNo,
        [t('cutting.dailyReport.colorCode')]: r.colorCode,
        [t('cutting.dailyReport.plannedQty')]: r.plannedQty,
        [t('cutting.dailyReport.actualQty')]: r.actualQty,
        [t('cutting.dailyReport.achievementRate')]: r.achievementRate,
        [t('cutting.dailyReport.manager')]: r.manager,
      })),
      `daily-cutting-report-${selectedDate}`
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('cutting.dailyReport.title')} />

      <div className="flex items-center gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.dailyReport.date')}</label>
          <input
            type="date"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard
          label={t('cutting.dailyReport.todayPlan')}
          value={totalPlanned.toLocaleString()}
          unit="pcs"
          color="blue"
        />
        <KpiCard
          label={t('cutting.dailyReport.todayActual')}
          value={totalActual.toLocaleString()}
          unit="pcs"
          color="green"
        />
        <KpiCard
          label={t('cutting.dailyReport.achievementRate')}
          value={overallRate.toFixed(1)}
          unit="%"
          color={overallRate < 80 ? 'red' : 'green'}
        />
        <KpiCard
          label={t('cutting.dailyReport.bundleCreated')}
          value={String(totalBundles)}
          unit="bdl"
          color="blue"
        />
      </div>

      <div className="flex justify-end">
        <button className="btn-primary text-sm px-3 py-1.5" onClick={handleExport}>{t('common.exportExcel')}</button>
      </div>

      <MesGrid columns={columns} data={MOCK_ROWS} gridKey="HCut05-grid" height={360} />
    </div>
  )
}
