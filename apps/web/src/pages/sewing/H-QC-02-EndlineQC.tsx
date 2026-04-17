import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'
import { KpiCard } from '../../components/common/KpiCard'
import { exportToCsv } from '../../utils/excel'

interface EndlineReport {
  reportId: string
  line: string
  orderNo: string
  inspectedQty: number
  dhuRate: number
  mainDefect: string
  judgement: string
  date: string
}

const MOCK_REPORTS: EndlineReport[] = [
  { reportId: 'EQC-001', line: 'LINE-A', orderNo: 'NIKE-ORD-001', inspectedQty: 200, dhuRate: 2.5, mainDefect: 'Stitch defect', judgement: 'PASS', date: '2026-04-17' },
  { reportId: 'EQC-002', line: 'LINE-B', orderNo: 'ZARA-ORD-002', inspectedQty: 180, dhuRate: 4.2, mainDefect: 'Size defect', judgement: 'FAIL', date: '2026-04-17' },
  { reportId: 'EQC-003', line: 'LINE-C', orderNo: 'GAP-ORD-003', inspectedQty: 220, dhuRate: 1.8, mainDefect: 'Loose thread', judgement: 'PASS', date: '2026-04-16' },
  { reportId: 'EQC-004', line: 'LINE-A', orderNo: 'NIKE-ORD-001', inspectedQty: 195, dhuRate: 2.1, mainDefect: 'Stitch defect', judgement: 'PASS', date: '2026-04-16' },
  { reportId: 'EQC-005', line: 'LINE-D', orderNo: 'HM-ORD-004', inspectedQty: 210, dhuRate: 3.3, mainDefect: 'Button defect', judgement: 'FAIL', date: '2026-04-15' },
]

export function HQC02Page() {
  const { t } = useTranslation()
  const [reports] = useState<EndlineReport[]>(MOCK_REPORTS)
  const [filterDate, setFilterDate] = useState('')
  const [filterLine, setFilterLine] = useState('')

  const filtered = reports.filter(r => {
    if (filterDate && r.date !== filterDate) return false
    if (filterLine && r.line !== filterLine) return false
    return true
  })

  const totalInspected = filtered.reduce((sum, r) => sum + r.inspectedQty, 0)
  const totalDefects = filtered.reduce((sum, r) => sum + Math.round(r.inspectedQty * r.dhuRate / 100), 0)
  const avgDHU = filtered.length > 0
    ? (filtered.reduce((sum, r) => sum + r.dhuRate, 0) / filtered.length).toFixed(1)
    : '0.0'
  const passCount = filtered.filter(r => r.judgement === 'PASS').length
  const passRate = filtered.length > 0 ? Math.round((passCount / filtered.length) * 100) : 0

  const columns: Column<EndlineReport>[] = [
    { key: 'reportId', header: t('sewing.endlineQC.reportId'), width: 100 },
    { key: 'line', header: t('sewing.endlineQC.line'), width: 90 },
    { key: 'orderNo', header: t('sewing.endlineQC.orderNo'), width: 130 },
    { key: 'inspectedQty', header: t('sewing.endlineQC.inspectedQty'), width: 100 },
    {
      key: 'dhuRate',
      header: t('sewing.endlineQC.dhuRate'),
      width: 90,
      render: (row) => (
        <span className={row.dhuRate > 3 ? 'text-red-600 font-semibold' : 'text-gray-700'}>
          {row.dhuRate.toFixed(1)}%
        </span>
      ),
    },
    { key: 'mainDefect', header: t('sewing.endlineQC.mainDefect'), width: 130 },
    {
      key: 'judgement',
      header: t('sewing.endlineQC.judgement'),
      width: 90,
      render: (row) => <StatusBadge status={row.judgement} label={row.judgement} />,
    },
    { key: 'date', header: t('sewing.endlineQC.date'), width: 110 },
  ]

  function handleExport() {
    exportToCsv(
      filtered.map(r => ({
        [t('sewing.endlineQC.reportId')]: r.reportId,
        [t('sewing.endlineQC.line')]: r.line,
        [t('sewing.endlineQC.orderNo')]: r.orderNo,
        [t('sewing.endlineQC.inspectedQty')]: r.inspectedQty,
        [t('sewing.endlineQC.dhuRate')]: r.dhuRate,
        [t('sewing.endlineQC.mainDefect')]: r.mainDefect,
        [t('sewing.endlineQC.judgement')]: r.judgement,
        [t('sewing.endlineQC.date')]: r.date,
      })),
      'endline-qc'
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('sewing.endlineQC.title')} />

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label={t('sewing.endlineQC.inspectedQty')} value={totalInspected.toLocaleString()} unit="pcs" color="blue" />
        <KpiCard label="Defect Qty" value={totalDefects} unit="pcs" color="red" />
        <KpiCard label={t('sewing.endlineQC.dhuRate')} value={avgDHU} unit="%" color="yellow" />
        <KpiCard label={t('sewing.endlineQC.passRate')} value={`${passRate}%`} color="green" />
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.endlineQC.date')}</label>
            <input
              type="date"
              className="input"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.endlineQC.line')}</label>
            <select className="input" value={filterLine} onChange={e => setFilterLine(e.target.value)}>
              <option value="">All</option>
              {['LINE-A', 'LINE-B', 'LINE-C', 'LINE-D'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="ml-auto self-end">
            <button className="btn-primary text-sm px-3 py-1.5" onClick={handleExport}>
              {t('common.exportExcel')}
            </button>
          </div>
        </div>
        <MesGrid columns={columns} data={filtered} height={320} gridKey="H-QC-02-grid" />
      </div>
    </div>
  )
}
