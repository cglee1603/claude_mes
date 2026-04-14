import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { DataTable, type Column } from '../../components/common/DataTable'
import { StatusBadge } from '../../components/common/StatusBadge'

interface AlertRow {
  id: string
  rollNo: string
  materialType: string
  completedAt: string
  notificationStatus: 'SENT' | 'PENDING' | 'FAILED'
}

const NOTIFICATION_COLOR_MAP: Record<string, string> = {
  SENT: 'PASSED_QC',
  PENDING: 'QC',
  FAILED: 'MFZ_HOLD',
}

const MOCK_ALERTS: AlertRow[] = [
  { id: '1', rollNo: 'ROLL-2026-0301', materialType: 'COTTON', completedAt: '2026-04-10T08:15:00', notificationStatus: 'SENT' },
  { id: '2', rollNo: 'ROLL-2026-0302', materialType: 'POLY', completedAt: '2026-04-10T06:30:00', notificationStatus: 'SENT' },
  { id: '3', rollNo: 'ROLL-2026-0303', materialType: 'LINEN', completedAt: '2026-04-10T14:00:00', notificationStatus: 'PENDING' },
  { id: '4', rollNo: 'ROLL-2026-0304', materialType: 'WOOL', completedAt: '2026-04-09T22:00:00', notificationStatus: 'SENT' },
  { id: '5', rollNo: 'ROLL-2026-0305', materialType: 'COTTON', completedAt: '2026-04-09T18:45:00', notificationStatus: 'FAILED' },
  { id: '6', rollNo: 'ROLL-2026-0306', materialType: 'POLY', completedAt: '2026-04-09T12:00:00', notificationStatus: 'SENT' },
  { id: '7', rollNo: 'ROLL-2026-0307', materialType: 'LINEN', completedAt: '2026-04-08T20:30:00', notificationStatus: 'SENT' },
  { id: '8', rollNo: 'ROLL-2026-0308', materialType: 'WOOL', completedAt: '2026-04-08T16:00:00', notificationStatus: 'PENDING' },
]

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function RX06AlertPage() {
  const { t } = useTranslation()

  const columns: Column<AlertRow>[] = [
    { key: 'rollNo', header: t('relaxation.complete.rollNo') },
    { key: 'materialType', header: t('relaxation.complete.materialType') },
    {
      key: 'completedAt',
      header: t('relaxation.complete.completedAt'),
      render: (row) => <span>{formatDateTime(row.completedAt)}</span>,
    },
    {
      key: 'notificationStatus',
      header: t('relaxation.complete.notificationStatus'),
      render: (row) => (
        <StatusBadge
          status={NOTIFICATION_COLOR_MAP[row.notificationStatus] ?? row.notificationStatus}
          label={t(`relaxation.complete.${row.notificationStatus}`)}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('relaxation.complete.title')}
        subtitle={t('relaxation.complete.subtitle')}
      />

      <div className="card">
        <DataTable<AlertRow> columns={columns} data={MOCK_ALERTS} keyField="id" />
      </div>
    </div>
  )
}
