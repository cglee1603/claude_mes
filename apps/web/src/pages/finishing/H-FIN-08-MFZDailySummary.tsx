import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'
import { exportToCsv } from '../../utils/excel'

interface MFZDailySummary {
  id: string
  date: string
  totalInspected: number
  passCount: number
  failCount: number
  machine: string
  lockStatus: string
  signedBy: string
}

const MOCK_DATA: MFZDailySummary[] = [
  { id: 'MDS-001', date: '2026-04-17', totalInspected: 850, passCount: 850, failCount: 0, machine: 'MFZ-001', lockStatus: 'OPEN', signedBy: '-' },
  { id: 'MDS-002', date: '2026-04-16', totalInspected: 920, passCount: 918, failCount: 2, machine: 'MFZ-001', lockStatus: 'LOCKED', signedBy: 'Kim Manager' },
  { id: 'MDS-003', date: '2026-04-15', totalInspected: 780, passCount: 780, failCount: 0, machine: 'MFZ-002', lockStatus: 'LOCKED', signedBy: 'Park Manager' },
  { id: 'MDS-004', date: '2026-04-14', totalInspected: 1050, passCount: 1049, failCount: 1, machine: 'MFZ-001', lockStatus: 'LOCKED', signedBy: 'Kim Manager' },
  { id: 'MDS-005', date: '2026-04-13', totalInspected: 960, passCount: 960, failCount: 0, machine: 'MFZ-002', lockStatus: 'LOCKED', signedBy: 'Park Manager' },
  { id: 'MDS-006', date: '2026-04-12', totalInspected: 880, passCount: 878, failCount: 2, machine: 'MFZ-001', lockStatus: 'LOCKED', signedBy: 'Kim Manager' },
  { id: 'MDS-007', date: '2026-04-11', totalInspected: 740, passCount: 740, failCount: 0, machine: 'MFZ-003', lockStatus: 'LOCKED', signedBy: 'Lee Manager' },
]

export function HFin08Page() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState('2026-04-17')
  const [summaries, setSummaries] = useState<MFZDailySummary[]>(MOCK_DATA)

  const handleLock = (id: string) => {
    setSummaries(prev =>
      prev.map(s => s.id === id && s.lockStatus === 'OPEN'
        ? { ...s, lockStatus: 'LOCKED', signedBy: 'Admin' }
        : s
      )
    )
  }

  const handleExport = () => exportToCsv(summaries, 'mfz-daily-summary')

  const columns: Column<MFZDailySummary>[] = [
    { key: 'date', header: t('finishing.mfzSummary.date'), width: 120 },
    { key: 'totalInspected', header: t('finishing.mfzSummary.totalInspected'), width: 130 },
    { key: 'passCount', header: t('finishing.mfzSummary.passCount'), width: 110 },
    {
      key: 'failCount', header: t('finishing.mfzSummary.failCount'), width: 100,
      render: (row) => (
        <span className={row.failCount > 0 ? 'text-red-600 font-semibold' : 'text-gray-800'}>
          {row.failCount}
        </span>
      ),
    },
    { key: 'machine', header: t('finishing.mfzSummary.machine'), width: 110 },
    {
      key: 'lockStatus', header: t('finishing.mfzSummary.lockStatus'), width: 110,
      render: (row) => <StatusBadge status={row.lockStatus} label={row.lockStatus === 'LOCKED' ? t('finishing.mfzSummary.locked') : t('finishing.mfzSummary.open')} />,
    },
    { key: 'signedBy', header: t('finishing.mfzSummary.signedBy'), width: 120 },
    {
      key: 'id', header: t('finishing.mfzSummary.lock'), width: 100,
      render: (row) => (
        row.lockStatus === 'OPEN'
          ? <button onClick={() => handleLock(row.id)} className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors">
              {t('finishing.mfzSummary.lock')}
            </button>
          : <span className="text-xs text-gray-400">{t('finishing.mfzSummary.locked')}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('finishing.mfzSummary.title')} subtitle="H-FIN-08" />

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-600">{t('finishing.mfzSummary.date')}</label>
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
        <button onClick={handleExport} className="ml-auto px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
          {t('common.exportExcel')}
        </button>
      </div>

      <div className="card">
        <MesGrid columns={columns} data={summaries} height={440} gridKey="H-FIN-08-grid" />
      </div>
    </div>
  )
}
