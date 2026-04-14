import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { DataTable, type Column } from '../../components/common/DataTable'
import { StatusBadge } from '../../components/common/StatusBadge'

interface RelaxationPlanRow {
  id: string
  rollNo: string
  materialType: string
  requiredHours: number
  startTime: string
  expectedEnd: string
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PENDING'
}

const MOCK_PLANS: RelaxationPlanRow[] = [
  { id: '1', rollNo: 'ROLL-2026-0401', materialType: 'COTTON', requiredHours: 48, startTime: '2026-04-09T08:00:00', expectedEnd: '2026-04-11T08:00:00', status: 'IN_PROGRESS' },
  { id: '2', rollNo: 'ROLL-2026-0402', materialType: 'POLY', requiredHours: 24, startTime: '2026-04-10T06:00:00', expectedEnd: '2026-04-11T06:00:00', status: 'IN_PROGRESS' },
  { id: '3', rollNo: 'ROLL-2026-0403', materialType: 'LINEN', requiredHours: 48, startTime: '2026-04-08T14:00:00', expectedEnd: '2026-04-10T14:00:00', status: 'COMPLETED' },
  { id: '4', rollNo: 'ROLL-2026-0404', materialType: 'WOOL', requiredHours: 72, startTime: '2026-04-08T10:00:00', expectedEnd: '2026-04-11T10:00:00', status: 'IN_PROGRESS' },
  { id: '5', rollNo: 'ROLL-2026-0405', materialType: 'COTTON', requiredHours: 48, startTime: '2026-04-10T09:00:00', expectedEnd: '2026-04-12T09:00:00', status: 'PENDING' },
]

const STATUS_COLOR_MAP: Record<string, string> = {
  IN_PROGRESS: 'CUTTING',
  COMPLETED: 'PASSED_QC',
  PENDING: 'QC',
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getRemainingHours(expectedEnd: string): string {
  const diff = new Date(expectedEnd).getTime() - Date.now()
  if (diff <= 0) return '0h 0m'
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

export function RX04PlanPage() {
  const { t } = useTranslation()
  const [, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick((prev) => prev + 1), 60_000)
    return () => clearInterval(interval)
  }, [])

  const columns: Column<RelaxationPlanRow>[] = [
    { key: 'rollNo', header: t('relaxation.plan.rollNo') },
    { key: 'materialType', header: t('relaxation.plan.materialType') },
    {
      key: 'requiredHours',
      header: t('relaxation.plan.requiredHours'),
      render: (row) => <span>{row.requiredHours}h</span>,
    },
    {
      key: 'startTime',
      header: t('relaxation.plan.startTime'),
      render: (row) => <span>{formatDateTime(row.startTime)}</span>,
    },
    {
      key: 'expectedEnd',
      header: t('relaxation.plan.expectedEnd'),
      render: (row) => <span>{formatDateTime(row.expectedEnd)}</span>,
    },
    {
      key: 'remaining',
      header: t('relaxation.plan.remaining'),
      render: (row) =>
        row.status === 'COMPLETED' ? (
          <span className="text-green-600 font-medium">--</span>
        ) : (
          <span className="font-mono text-sm">{getRemainingHours(row.expectedEnd)}</span>
        ),
    },
    {
      key: 'status',
      header: t('relaxation.plan.status'),
      render: (row) => (
        <StatusBadge
          status={STATUS_COLOR_MAP[row.status] ?? row.status}
          label={t(`relaxation.plan.${row.status}`)}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('relaxation.plan.title')}
        subtitle={t('relaxation.plan.subtitle')}
      />

      <div className="card">
        <DataTable<RelaxationPlanRow> columns={columns} data={MOCK_PLANS} keyField="id" />
      </div>
    </div>
  )
}
