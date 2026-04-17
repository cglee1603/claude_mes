import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'
import { exportToCsv } from '../../utils/excel'

type TransferStatus = 'PENDING' | 'APPROVED' | 'COMPLETED'

interface TransferRecord {
  transferId: string
  fromLine: string
  toLine: string
  bundleCount: number
  reason: string
  transferredAt: string
  approvedBy: string
  status: TransferStatus
}

const MOCK_TRANSFERS: TransferRecord[] = [
  { transferId: 'TRF-001', fromLine: 'LINE-A', toLine: 'LINE-B', bundleCount: 5, reason: 'Line load balancing', transferredAt: '2026-04-17 09:00', approvedBy: 'Choi T.', status: 'COMPLETED' },
  { transferId: 'TRF-002', fromLine: 'LINE-C', toLine: 'LINE-D', bundleCount: 3, reason: 'Machine breakdown temp. transfer', transferredAt: '2026-04-17 10:30', approvedBy: 'Choi T.', status: 'APPROVED' },
  { transferId: 'TRF-003', fromLine: 'LINE-B', toLine: 'LINE-A', bundleCount: 2, reason: 'Priority order processing', transferredAt: '2026-04-16 14:00', approvedBy: 'Choi T.', status: 'COMPLETED' },
  { transferId: 'TRF-004', fromLine: 'LINE-D', toLine: 'LINE-C', bundleCount: 4, reason: 'Production plan change', transferredAt: '2026-04-16 15:00', approvedBy: '', status: 'PENDING' },
  { transferId: 'TRF-005', fromLine: 'LINE-A', toLine: 'LINE-C', bundleCount: 6, reason: 'Line balance adjustment', transferredAt: '2026-04-15 11:00', approvedBy: 'Choi T.', status: 'COMPLETED' },
]

const LINES = ['LINE-A', 'LINE-B', 'LINE-C', 'LINE-D']
const REASONS = ['Line load balancing', 'Machine breakdown temp. transfer', 'Priority order processing', 'Production plan change', 'Line balance adjustment', 'Other']

export function HSW06Page() {
  const { t } = useTranslation()
  const [transfers] = useState<TransferRecord[]>(MOCK_TRANSFERS)
  const [form, setForm] = useState({
    fromLine: '',
    toLine: '',
    bundleNo: '',
    reason: '',
  })

  const columns: Column<TransferRecord>[] = [
    { key: 'transferId', header: t('sewing.internalTransfer.transferId'), width: 100 },
    { key: 'fromLine', header: t('sewing.internalTransfer.fromLine'), width: 90 },
    { key: 'toLine', header: t('sewing.internalTransfer.toLine'), width: 90 },
    { key: 'bundleCount', header: t('sewing.internalTransfer.bundleCount'), width: 90 },
    { key: 'reason', header: t('sewing.internalTransfer.reason'), width: 160 },
    { key: 'transferredAt', header: t('sewing.internalTransfer.transferredAt'), width: 140 },
    {
      key: 'approvedBy',
      header: t('sewing.internalTransfer.approvedBy'),
      width: 100,
      render: (row) => (
        <span className={!row.approvedBy ? 'text-gray-400 italic text-xs' : 'text-gray-700'}>
          {row.approvedBy || '-'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: 100,
      render: (row) => <StatusBadge status={row.status} label={row.status} />,
    },
  ]

  function handleExport() {
    exportToCsv(
      transfers.map(r => ({
        [t('sewing.internalTransfer.transferId')]: r.transferId,
        [t('sewing.internalTransfer.fromLine')]: r.fromLine,
        [t('sewing.internalTransfer.toLine')]: r.toLine,
        [t('sewing.internalTransfer.bundleCount')]: r.bundleCount,
        [t('sewing.internalTransfer.reason')]: r.reason,
        [t('sewing.internalTransfer.transferredAt')]: r.transferredAt,
        [t('sewing.internalTransfer.approvedBy')]: r.approvedBy,
      })),
      'internal-transfer'
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('sewing.internalTransfer.title')} />

      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">{t('sewing.internalTransfer.register')}</h2>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.internalTransfer.fromLine')}</label>
            <select
              className="input w-full"
              value={form.fromLine}
              onChange={e => setForm(p => ({ ...p, fromLine: e.target.value }))}
            >
              <option value="">-- Select --</option>
              {LINES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.internalTransfer.toLine')}</label>
            <select
              className="input w-full"
              value={form.toLine}
              onChange={e => setForm(p => ({ ...p, toLine: e.target.value }))}
            >
              <option value="">-- Select --</option>
              {LINES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.internalTransfer.bundleCount')}</label>
            <input
              type="number"
              className="input w-full"
              value={form.bundleNo}
              onChange={e => setForm(p => ({ ...p, bundleNo: e.target.value }))}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.internalTransfer.reason')}</label>
            <select
              className="input w-full"
              value={form.reason}
              onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
            >
              <option value="">-- Select --</option>
              {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button className="btn-primary text-sm px-4 py-1.5">{t('sewing.internalTransfer.register')}</button>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">{t('sewing.internalTransfer.title')}</h2>
          <button className="btn-primary text-sm px-3 py-1.5" onClick={handleExport}>
            {t('common.exportExcel')}
          </button>
        </div>
        <MesGrid columns={columns} data={transfers} height={300} gridKey="H-SW-06-grid" />
      </div>
    </div>
  )
}
