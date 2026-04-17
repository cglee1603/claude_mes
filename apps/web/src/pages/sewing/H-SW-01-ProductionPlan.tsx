import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'
import { KpiCard } from '../../components/common/KpiCard'
import { exportToCsv } from '../../utils/excel'

interface ProductionPlan {
  planId: string
  orderNo: string
  line: string
  startDate: string
  endDate: string
  targetQty: number
  status: string
}

interface RampupRow {
  week: string
  weeklyTarget: number
  cumulativeTarget: number
}

const MOCK_PLANS: ProductionPlan[] = [
  { planId: 'PLN-001', orderNo: 'NIKE-ORD-001', line: 'LINE-A', startDate: '2026-04-10', endDate: '2026-04-30', targetQty: 2500, status: 'IN_PROGRESS' },
  { planId: 'PLN-002', orderNo: 'ZARA-ORD-002', line: 'LINE-B', startDate: '2026-04-12', endDate: '2026-05-05', targetQty: 3200, status: 'IN_PROGRESS' },
  { planId: 'PLN-003', orderNo: 'GAP-ORD-003', line: 'LINE-C', startDate: '2026-04-15', endDate: '2026-05-10', targetQty: 1800, status: 'PLANNED' },
  { planId: 'PLN-004', orderNo: 'HM-ORD-004', line: 'LINE-D', startDate: '2026-04-20', endDate: '2026-05-15', targetQty: 4000, status: 'PLANNED' },
  { planId: 'PLN-005', orderNo: 'NIKE-ORD-005', line: 'LINE-A', startDate: '2026-03-01', endDate: '2026-04-05', targetQty: 2000, status: 'COMPLETED' },
]

const MOCK_RAMPUP: RampupRow[] = [
  { week: 'W1', weeklyTarget: 300, cumulativeTarget: 300 },
  { week: 'W2', weeklyTarget: 500, cumulativeTarget: 800 },
  { week: 'W3', weeklyTarget: 700, cumulativeTarget: 1500 },
  { week: 'W4', weeklyTarget: 1000, cumulativeTarget: 2500 },
]

export function HSW01Page() {
  const { t } = useTranslation()
  const [plans] = useState<ProductionPlan[]>(MOCK_PLANS)
  const [rampup] = useState<RampupRow[]>(MOCK_RAMPUP)
  const [importFile, setImportFile] = useState<File | null>(null)

  const totalTargetQty = plans.reduce((sum, p) => sum + p.targetQty, 0)
  const inProgressCount = plans.filter(p => p.status === 'IN_PROGRESS').length
  const completedCount = plans.filter(p => p.status === 'COMPLETED').length

  const planColumns: Column<ProductionPlan>[] = [
    { key: 'planId', header: t('sewing.productionPlan.planId'), width: 100 },
    { key: 'orderNo', header: t('sewing.productionPlan.orderNo'), width: 140 },
    { key: 'line', header: t('sewing.productionPlan.line'), width: 90 },
    { key: 'startDate', header: t('sewing.productionPlan.startDate'), width: 100 },
    { key: 'endDate', header: t('sewing.productionPlan.endDate'), width: 100 },
    { key: 'targetQty', header: t('sewing.productionPlan.targetQty'), width: 100 },
    {
      key: 'status',
      header: t('sewing.productionPlan.status'),
      width: 110,
      render: (row) => <StatusBadge status={row.status} label={row.status} />,
    },
  ]

  const rampupColumns: Column<RampupRow>[] = [
    { key: 'week', header: t('sewing.productionPlan.rampupTarget'), width: 80 },
    { key: 'weeklyTarget', header: t('sewing.productionPlan.targetQty'), width: 110 },
    { key: 'cumulativeTarget', header: t('sewing.productionPlan.targetQty') + ' (Cumulative)', width: 130 },
  ]

  function handleExport() {
    exportToCsv(
      plans.map(p => ({
        [t('sewing.productionPlan.planId')]: p.planId,
        [t('sewing.productionPlan.orderNo')]: p.orderNo,
        [t('sewing.productionPlan.line')]: p.line,
        [t('sewing.productionPlan.startDate')]: p.startDate,
        [t('sewing.productionPlan.endDate')]: p.endDate,
        [t('sewing.productionPlan.targetQty')]: p.targetQty,
        [t('sewing.productionPlan.status')]: p.status,
      })),
      'production-plan'
    )
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImportFile(file)
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('sewing.productionPlan.title')} />

      <div className="grid grid-cols-3 gap-4">
        <KpiCard label={t('sewing.productionPlan.targetQty')} value={totalTargetQty.toLocaleString()} unit="pcs" color="blue" />
        <KpiCard label="In Progress" value={inProgressCount} unit="orders" color="green" />
        <KpiCard label="Completed" value={completedCount} unit="orders" color="yellow" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">{t('sewing.productionPlan.title')}</h2>
          <div className="flex gap-2">
            <label className="btn-secondary cursor-pointer text-sm px-3 py-1.5">
              {t('common.importExcel')}
              <input type="file" accept=".xlsx,.csv" className="hidden" onChange={handleImport} />
            </label>
            {importFile && (
              <span className="text-xs text-gray-500 self-center">{importFile.name}</span>
            )}
            <button className="btn-primary text-sm px-3 py-1.5" onClick={handleExport}>
              {t('common.exportExcel')}
            </button>
          </div>
        </div>
        <MesGrid columns={planColumns} data={plans} height={280} gridKey="H-SW-01-grid" />
      </div>

      <div className="card">
        <h2 className="text-base font-semibold text-gray-800 mb-4">{t('sewing.productionPlan.rampupTarget')}</h2>
        <MesGrid columns={rampupColumns} data={rampup} height={200} gridKey="H-SW-01-rampup-grid" />
      </div>
    </div>
  )
}
