import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'

type MachineStatus = 'RUNNING' | 'IDLE' | 'BREAKDOWN'

interface Machine {
  id: string
  machineCode: string
  machineType: string
  lineCode: string
  operator: string
  status: MachineStatus
  lastMaintenance: string
  uptime: number
}

const STATUS_COLORS: Record<MachineStatus, string> = {
  RUNNING: 'bg-green-50 border-green-300',
  IDLE: 'bg-yellow-50 border-yellow-300',
  BREAKDOWN: 'bg-red-50 border-red-300',
}

const STATUS_BADGE: Record<MachineStatus, { color: string; label: string }> = {
  RUNNING: { color: 'bg-green-100 text-green-800', label: 'RUNNING' },
  IDLE: { color: 'bg-yellow-100 text-yellow-800', label: 'IDLE' },
  BREAKDOWN: { color: 'bg-red-100 text-red-800', label: 'BREAKDOWN' },
}

const MACHINE_TYPES = ['Lockstitch', 'Overlock', 'Coverstitch', 'Bartack', 'Buttonhole']
const OPERATORS = ['Nguyen T.', 'Tran V.', 'Le H.', 'Pham M.', 'Vo A.', 'Hoang D.', '-']

function generateMachines(count: number): Machine[] {
  const statuses: MachineStatus[] = ['RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'IDLE', 'IDLE', 'IDLE', 'BREAKDOWN', 'BREAKDOWN', 'RUNNING']
  const lines = ['LINE-A', 'LINE-B', 'LINE-C', 'LINE-D']
  return Array.from({ length: count }, (_, i) => ({
    id: `machine-${i + 1}`,
    machineCode: `SM-${String(i + 1).padStart(3, '0')}`,
    machineType: MACHINE_TYPES[i % MACHINE_TYPES.length],
    lineCode: lines[i % lines.length],
    operator: OPERATORS[i % OPERATORS.length],
    status: statuses[i % statuses.length],
    lastMaintenance: `2026-0${3 + (i % 2)}-${String(10 + (i % 20)).padStart(2, '0')}`,
    uptime: statuses[i % statuses.length] === 'RUNNING' ? 75 + (i % 20) : statuses[i % statuses.length] === 'IDLE' ? 0 : 0,
  }))
}

const ALL_MACHINES = generateMachines(20)

export function SW16MachineStatusPage() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<MachineStatus | 'ALL'>('ALL')

  const filtered = filter === 'ALL'
    ? ALL_MACHINES
    : ALL_MACHINES.filter((m) => m.status === filter)

  const counts: Record<MachineStatus | 'ALL', number> = {
    ALL: ALL_MACHINES.length,
    RUNNING: ALL_MACHINES.filter((m) => m.status === 'RUNNING').length,
    IDLE: ALL_MACHINES.filter((m) => m.status === 'IDLE').length,
    BREAKDOWN: ALL_MACHINES.filter((m) => m.status === 'BREAKDOWN').length,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('sewing.machine.title')}
        subtitle={`${ALL_MACHINES.length} ${t('sewing.layout.machineCount')}`}
      />

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'RUNNING', 'IDLE', 'BREAKDOWN'] as const).map((s) => {
          const isActive = filter === s
          const base = 'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors'
          const active = isActive ? 'ring-2 ring-offset-1 ring-blue-400' : ''
          const colorMap: Record<string, string> = {
            ALL: 'bg-gray-100 text-gray-700 border-gray-300',
            RUNNING: 'bg-green-100 text-green-800 border-green-300',
            IDLE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            BREAKDOWN: 'bg-red-100 text-red-800 border-red-300',
          }
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`${base} ${colorMap[s]} ${active}`}
            >
              {s === 'ALL' ? t('common.all') : s} ({counts[s]})
            </button>
          )
        })}
      </div>

      {/* Machine card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((m) => (
          <div
            key={m.id}
            className={`rounded-lg border-2 p-3 ${STATUS_COLORS[m.status]}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-900">{m.machineCode}</span>
              <StatusBadge status={m.status} label={STATUS_BADGE[m.status].label} />
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              <div>
                <span className="font-medium">{t('sewing.machine.machineType')}:</span>{' '}
                {m.machineType}
              </div>
              <div>
                <span className="font-medium">{t('common.lineNo')}:</span>{' '}
                {m.lineCode}
              </div>
              <div>
                <span className="font-medium">{t('sewing.machine.operator')}:</span>{' '}
                {m.operator}
              </div>
              <div>
                <span className="font-medium">{t('sewing.machine.lastMaintenance')}:</span>{' '}
                {m.lastMaintenance}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
