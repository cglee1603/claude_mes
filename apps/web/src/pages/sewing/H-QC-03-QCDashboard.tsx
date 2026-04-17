import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'
import { KpiCard } from '../../components/common/KpiCard'
import { exportToCsv } from '../../utils/excel'

interface QCRecord {
  id: string
  date: string
  line: string
  orderNo: string
  dhuRate: number
  aqlResult: string
  buyerDHUStandard: number | null
  status: string
}

const MOCK_QC: QCRecord[] = [
  { id: 'QC-001', date: '2026-04-17', line: 'LINE-A', orderNo: 'NIKE-ORD-001', dhuRate: 2.5, aqlResult: 'PASS', buyerDHUStandard: 2.5, status: 'PASS' },
  { id: 'QC-002', date: '2026-04-17', line: 'LINE-B', orderNo: 'ZARA-ORD-002', dhuRate: 4.1, aqlResult: 'FAIL', buyerDHUStandard: 3.0, status: 'FAIL' },
  { id: 'QC-003', date: '2026-04-16', line: 'LINE-C', orderNo: 'GAP-ORD-003', dhuRate: 1.8, aqlResult: 'PASS', buyerDHUStandard: null, status: 'PASS' },
  { id: 'QC-004', date: '2026-04-16', line: 'LINE-A', orderNo: 'NIKE-ORD-001', dhuRate: 2.2, aqlResult: 'PASS', buyerDHUStandard: 2.5, status: 'PASS' },
  { id: 'QC-005', date: '2026-04-15', line: 'LINE-D', orderNo: 'HM-ORD-004', dhuRate: 3.5, aqlResult: 'FAIL', buyerDHUStandard: null, status: 'FAIL' },
  { id: 'QC-006', date: '2026-04-15', line: 'LINE-B', orderNo: 'ZARA-ORD-002', dhuRate: 2.9, aqlResult: 'PASS', buyerDHUStandard: 3.0, status: 'PASS' },
  { id: 'QC-007', date: '2026-04-14', line: 'LINE-C', orderNo: 'GAP-ORD-003', dhuRate: 2.0, aqlResult: 'PASS', buyerDHUStandard: null, status: 'PASS' },
]

const DEFAULT_DHU_STANDARD = 3.0

export function HQC03Page() {
  const { t } = useTranslation()
  const [records] = useState<QCRecord[]>(MOCK_QC)

  const hasMissingStandard = records.some(r => r.buyerDHUStandard === null)
  const avgDHU = (records.reduce((sum, r) => sum + r.dhuRate, 0) / records.length).toFixed(1)
  const todayInspected = records.filter(r => r.date === '2026-04-17').length * 200
  const passCount = records.filter(r => r.status === 'PASS').length
  const passRate = Math.round((passCount / records.length) * 100)
  const failBundles = records.filter(r => r.status === 'FAIL').length

  const columns: Column<QCRecord>[] = [
    { key: 'date', header: t('sewing.qcDashboard.date'), width: 110 },
    { key: 'line', header: t('sewing.qcDashboard.line'), width: 90 },
    { key: 'orderNo', header: t('sewing.qcDashboard.orderNo'), width: 130 },
    {
      key: 'dhuRate',
      header: t('sewing.qcDashboard.overallDHU'),
      width: 90,
      render: (row) => {
        const standard = row.buyerDHUStandard ?? DEFAULT_DHU_STANDARD
        return (
          <span className={row.dhuRate > standard ? 'text-red-600 font-bold' : 'text-gray-700'}>
            {row.dhuRate.toFixed(1)}%
          </span>
        )
      },
    },
    {
      key: 'aqlResult',
      header: 'AQL',
      width: 80,
      render: (row) => <StatusBadge status={row.aqlResult} label={row.aqlResult} />,
    },
    {
      key: 'buyerDHUStandard',
      header: t('sewing.qcDashboard.buyerDHUStandard'),
      width: 130,
      render: (row) => (
        <span className={row.buyerDHUStandard === null ? 'text-orange-500 text-xs' : 'text-gray-700'}>
          {row.buyerDHUStandard !== null ? `${row.buyerDHUStandard}%` : `Default ${DEFAULT_DHU_STANDARD}%`}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: 90,
      render: (row) => <StatusBadge status={row.status} label={row.status} />,
    },
  ]

  function handleExport() {
    exportToCsv(
      records.map(r => ({
        [t('sewing.qcDashboard.date')]: r.date,
        [t('sewing.qcDashboard.line')]: r.line,
        [t('sewing.qcDashboard.orderNo')]: r.orderNo,
        DHU: r.dhuRate,
        AQL: r.aqlResult,
        [t('sewing.qcDashboard.buyerDHUStandard')]: r.buyerDHUStandard ?? DEFAULT_DHU_STANDARD,
      })),
      'qc-dashboard'
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('sewing.qcDashboard.title')} />

      {hasMissingStandard && (
        <div className="rounded-md bg-orange-50 border border-orange-200 p-3">
          <p className="text-sm text-orange-700 font-medium">{t('sewing.qcDashboard.buyerStandardWarning')}</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label={t('sewing.qcDashboard.overallDHU')} value={avgDHU} unit="%" color="yellow" />
        <KpiCard label={t('sewing.qcDashboard.todayInspected')} value={todayInspected.toLocaleString()} unit="pcs" color="blue" />
        <KpiCard label={t('sewing.qcDashboard.passRate')} value={`${passRate}%`} color="green" />
        <KpiCard label={t('sewing.qcDashboard.failBundles')} value={failBundles} unit="cases" color="red" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">{t('sewing.qcDashboard.title')}</h2>
          <button className="btn-primary text-sm px-3 py-1.5" onClick={handleExport}>
            {t('common.exportExcel')}
          </button>
        </div>
        <MesGrid columns={columns} data={records} height={320} gridKey="H-QC-03-grid" />
      </div>
    </div>
  )
}
