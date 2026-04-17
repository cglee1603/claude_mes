import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { KpiCard } from '../../components/common/KpiCard'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { exportToCsv } from '../../utils/excel'

interface WeeklyRecord {
  week: string
  orderNo: string
  completedQty: number
  defectQty: number
  dhuRate: number
  packingDone: number
  shipmentDone: number
}

const MOCK_WEEKLY: WeeklyRecord[] = [
  { week: 'Week 1', orderNo: 'ORD-2024-001', completedQty: 480, defectQty: 6, dhuRate: 1.25, packingDone: 480, shipmentDone: 480 },
  { week: 'Week 1', orderNo: 'ORD-2024-002', completedQty: 350, defectQty: 4, dhuRate: 1.14, packingDone: 350, shipmentDone: 0 },
  { week: 'Week 2', orderNo: 'ORD-2024-003', completedQty: 520, defectQty: 8, dhuRate: 1.54, packingDone: 520, shipmentDone: 520 },
  { week: 'Week 2', orderNo: 'ORD-2024-004', completedQty: 300, defectQty: 3, dhuRate: 1.00, packingDone: 300, shipmentDone: 300 },
  { week: 'Week 3', orderNo: 'ORD-2024-001', completedQty: 440, defectQty: 5, dhuRate: 1.14, packingDone: 440, shipmentDone: 440 },
  { week: 'Week 3', orderNo: 'ORD-2024-005', completedQty: 610, defectQty: 7, dhuRate: 1.15, packingDone: 610, shipmentDone: 0 },
  { week: 'Week 4', orderNo: 'ORD-2024-006', completedQty: 390, defectQty: 4, dhuRate: 1.03, packingDone: 390, shipmentDone: 390 },
  { week: 'Week 4', orderNo: 'ORD-2024-007', completedQty: 270, defectQty: 2, dhuRate: 0.74, packingDone: 270, shipmentDone: 0 },
]

function computeKpis(data: WeeklyRecord[]) {
  const monthlyTotal = data.reduce((s, r) => s + r.completedQty, 0)
  const completedOrders = new Set(data.filter(r => r.shipmentDone > 0).map(r => r.orderNo)).size
  const avgDHU = Math.round(data.reduce((s, r) => s + r.dhuRate, 0) / data.length * 100) / 100
  const avgProductivity = Math.round(monthlyTotal / 20)
  return { monthlyTotal, completedOrders, avgDHU, avgProductivity }
}

export function HFin09Page() {
  const { t } = useTranslation()
  const [yearMonth, setYearMonth] = useState('2026-04')

  const kpis = computeKpis(MOCK_WEEKLY)

  const handleExport = () => exportToCsv(MOCK_WEEKLY, `monthly-report-${yearMonth}`)

  const columns: Column<WeeklyRecord>[] = [
    { key: 'week', header: t('finishing.monthlyReport.week'), width: 80 },
    { key: 'orderNo', header: t('finishing.monthlyReport.orderNo'), width: 150 },
    { key: 'completedQty', header: t('finishing.monthlyReport.completedQty'), width: 120 },
    { key: 'defectQty', header: t('finishing.monthlyReport.defectQty'), width: 110 },
    {
      key: 'dhuRate', header: t('finishing.monthlyReport.dhuRate'), width: 100,
      render: (row) => (
        <span className={row.dhuRate > 1.5 ? 'text-red-600 font-semibold' : 'text-gray-800'}>
          {row.dhuRate.toFixed(2)}%
        </span>
      ),
    },
    { key: 'packingDone', header: t('finishing.monthlyReport.packingDone'), width: 110 },
    { key: 'shipmentDone', header: t('finishing.monthlyReport.shipmentDone'), width: 110 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('finishing.monthlyReport.title')} subtitle="H-FIN-09" />

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-600">{t('finishing.monthlyReport.month')}</label>
        <input type="month" value={yearMonth} onChange={e => setYearMonth(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
        <button onClick={handleExport} className="ml-auto px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
          {t('common.exportExcel')}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label={t('finishing.monthlyReport.monthlyTotal')} value={kpis.monthlyTotal.toLocaleString()} unit="pcs" color="blue" />
        <KpiCard label={t('finishing.monthlyReport.completedOrders')} value={kpis.completedOrders} unit={t('common.qty')} color="green" />
        <KpiCard label={t('finishing.monthlyReport.avgDHU')} value={`${kpis.avgDHU}%`} color={kpis.avgDHU > 1.5 ? 'red' : 'green'} />
        <KpiCard label={t('finishing.monthlyReport.avgProductivity')} value={kpis.avgProductivity} unit="pcs/day" color="yellow" />
      </div>

      <div className="card">
        <h3 className="text-base font-semibold text-gray-800 mb-4">{t('finishing.monthlyReport.week')} {t('common.detail')}</h3>
        <MesGrid columns={columns} data={MOCK_WEEKLY} height={420} gridKey="H-FIN-09-grid" />
      </div>
    </div>
  )
}
