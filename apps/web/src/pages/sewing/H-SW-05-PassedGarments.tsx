import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { KpiCard } from '../../components/common/KpiCard'
import { exportToCsv } from '../../utils/excel'

interface PassedRecord {
  recordId: string
  bundleNo: string
  orderNo: string
  passedQty: number
  processedBy: string
  processedDate: string
}

const MOCK_RECORDS: PassedRecord[] = [
  { recordId: 'PGR-001', bundleNo: 'BND-001', orderNo: 'NIKE-ORD-001', passedQty: 98, processedBy: 'Park J.', processedDate: '2026-04-17' },
  { recordId: 'PGR-002', bundleNo: 'BND-002', orderNo: 'NIKE-ORD-001', passedQty: 95, processedBy: 'Park J.', processedDate: '2026-04-17' },
  { recordId: 'PGR-003', bundleNo: 'BND-004', orderNo: 'NIKE-ORD-001', passedQty: 99, processedBy: 'Lee D.', processedDate: '2026-04-17' },
  { recordId: 'PGR-004', bundleNo: 'BND-007', orderNo: 'NIKE-ORD-001', passedQty: 98, processedBy: 'Lee D.', processedDate: '2026-04-17' },
  { recordId: 'PGR-005', bundleNo: 'BND-010', orderNo: 'ZARA-ORD-002', passedQty: 96, processedBy: 'Kim K.', processedDate: '2026-04-16' },
  { recordId: 'PGR-006', bundleNo: 'BND-011', orderNo: 'ZARA-ORD-002', passedQty: 100, processedBy: 'Kim K.', processedDate: '2026-04-16' },
  { recordId: 'PGR-007', bundleNo: 'BND-013', orderNo: 'GAP-ORD-003', passedQty: 97, processedBy: 'Choi T.', processedDate: '2026-04-15' },
  { recordId: 'PGR-008', bundleNo: 'BND-015', orderNo: 'GAP-ORD-003', passedQty: 99, processedBy: 'Choi T.', processedDate: '2026-04-15' },
]

interface DailyTotal {
  date: string
  total: number
}

export function HSW05Page() {
  const { t } = useTranslation()
  const [records] = useState<PassedRecord[]>(MOCK_RECORDS)
  const [form, setForm] = useState({
    bundleNo: '',
    passedQty: '',
    processedBy: '',
  })

  const totalPassed = records.reduce((sum, r) => sum + r.passedQty, 0)

  const dailyTotals = records.reduce<Record<string, number>>((acc, r) => {
    acc[r.processedDate] = (acc[r.processedDate] ?? 0) + r.passedQty
    return acc
  }, {})

  const dailySummary: DailyTotal[] = Object.entries(dailyTotals)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, total]) => ({ date, total }))

  const columns: Column<PassedRecord>[] = [
    { key: 'recordId', header: t('sewing.passedGarments.recordId'), width: 100 },
    { key: 'bundleNo', header: t('sewing.passedGarments.bundleNo'), width: 110 },
    { key: 'orderNo', header: t('sewing.passedGarments.orderNo'), width: 130 },
    { key: 'passedQty', header: t('sewing.passedGarments.passedQty'), width: 100 },
    { key: 'processedBy', header: t('sewing.passedGarments.processedBy'), width: 100 },
    { key: 'processedDate', header: t('sewing.passedGarments.processedDate'), width: 110 },
  ]

  const dailyColumns: Column<DailyTotal>[] = [
    { key: 'date', header: t('sewing.passedGarments.processedDate'), width: 120 },
    { key: 'total', header: t('sewing.passedGarments.passedQty') + ' Total', width: 130 },
  ]

  function handleExport() {
    exportToCsv(
      records.map(r => ({
        [t('sewing.passedGarments.recordId')]: r.recordId,
        [t('sewing.passedGarments.bundleNo')]: r.bundleNo,
        [t('sewing.passedGarments.orderNo')]: r.orderNo,
        [t('sewing.passedGarments.passedQty')]: r.passedQty,
        [t('sewing.passedGarments.processedBy')]: r.processedBy,
        [t('sewing.passedGarments.processedDate')]: r.processedDate,
      })),
      'passed-garments'
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('sewing.passedGarments.title')} />

      <div className="grid grid-cols-3 gap-4">
        <KpiCard label={t('sewing.passedGarments.passedQty') + ' Total'} value={totalPassed.toLocaleString()} unit="pcs" color="green" />
        <KpiCard label="Today Passed" value={dailyTotals['2026-04-17'] ?? 0} unit="pcs" color="blue" />
        <KpiCard label="Total Bundles" value={records.length} unit="cases" color="yellow" />
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">{t('sewing.passedGarments.record')}</h2>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.passedGarments.bundleNo')}</label>
            <input
              className="input w-full"
              value={form.bundleNo}
              onChange={e => setForm(p => ({ ...p, bundleNo: e.target.value }))}
              placeholder="BND-XXX"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.passedGarments.passedQty')}</label>
            <input
              type="number"
              className="input w-full"
              value={form.passedQty}
              onChange={e => setForm(p => ({ ...p, passedQty: e.target.value }))}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.passedGarments.processedBy')}</label>
            <input
              className="input w-full"
              value={form.processedBy}
              onChange={e => setForm(p => ({ ...p, processedBy: e.target.value }))}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button className="btn-primary text-sm px-4 py-1.5">{t('sewing.passedGarments.record')}</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">{t('sewing.passedGarments.title')}</h2>
            <button className="btn-primary text-sm px-3 py-1.5" onClick={handleExport}>
              {t('common.exportExcel')}
            </button>
          </div>
          <MesGrid columns={columns} data={records} height={280} gridKey="H-SW-05-grid" />
        </div>
        <div className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-4">{t('sewing.passedGarments.dailyTotal')}</h2>
          <MesGrid columns={dailyColumns} data={dailySummary} height={280} gridKey="H-SW-05-daily-grid" />
        </div>
      </div>
    </div>
  )
}
