import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'

type Utilization = 'high' | 'medium' | 'low' | 'idle'

interface MachineSlot {
  machineCode: string
  operation: string
  operators: number
  utilization: Utilization
}

interface LineLayoutData {
  lineId: string
  lineCode: string
  machines: MachineSlot[]
}

const UTILIZATION_COLORS: Record<Utilization, string> = {
  high: 'bg-green-100 border-green-400 text-green-900',
  medium: 'bg-yellow-100 border-yellow-400 text-yellow-900',
  low: 'bg-orange-100 border-orange-400 text-orange-900',
  idle: 'bg-gray-100 border-gray-300 text-gray-500',
}

const UTILIZATION_LABEL: Record<Utilization, string> = {
  high: '>80%',
  medium: '50-80%',
  low: '<50%',
  idle: 'Idle',
}

function makeMachines(lineCode: string, count: number): MachineSlot[] {
  const ops = ['Collar', 'Sleeve', 'Body', 'Cuff', 'Pocket', 'Hem', 'Button', 'Side Seam', 'Shoulder', 'Label', 'Zip', 'Lining', 'Top Stitch', 'Bar Tack', 'Trim']
  const utils: Utilization[] = ['high', 'high', 'high', 'medium', 'medium', 'low', 'idle', 'high', 'medium', 'high', 'high', 'medium', 'high', 'low', 'high']
  return Array.from({ length: count }, (_, i) => ({
    machineCode: `${lineCode}-M${String(i + 1).padStart(2, '0')}`,
    operation: ops[i % ops.length],
    operators: i % 3 === 0 ? 2 : 1,
    utilization: utils[i % utils.length],
  }))
}

const MOCK_LAYOUTS: LineLayoutData[] = [
  { lineId: 'line-1', lineCode: 'LINE-A', machines: makeMachines('A', 12) },
  { lineId: 'line-2', lineCode: 'LINE-B', machines: makeMachines('B', 15) },
  { lineId: 'line-3', lineCode: 'LINE-C', machines: makeMachines('C', 10) },
  { lineId: 'line-4', lineCode: 'LINE-D', machines: makeMachines('D', 13) },
]

export function SW15LineLayoutPage() {
  const { t } = useTranslation()
  const [layouts] = useState<LineLayoutData[]>(MOCK_LAYOUTS)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('sewing.layout.title')}
        subtitle={`${layouts.length} ${t('sewing.plan.line')} / ${layouts.reduce((s, l) => s + l.machines.length, 0)} ${t('sewing.layout.machineCount')}`}
      />

      {layouts.map((line) => (
        <div key={line.lineId} className="card">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            {line.lineCode}
            <span className="ml-2 text-xs font-normal text-gray-500">
              {line.machines.length} {t('sewing.layout.machineCount')} / {line.machines.reduce((s, m) => s + m.operators, 0)} {t('sewing.layout.operatorCount')}
            </span>
          </h3>
          <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 xl:grid-cols-15 gap-2">
            {line.machines.map((m) => (
              <div
                key={m.machineCode}
                className={`rounded border p-2 text-center min-w-0 ${UTILIZATION_COLORS[m.utilization]}`}
              >
                <div className="text-[10px] font-bold truncate">{m.machineCode}</div>
                <div className="text-[9px] truncate mt-0.5">{m.operation}</div>
                <div className="text-[9px] mt-0.5">{m.operators}P</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="card">
        <div className="flex flex-wrap gap-4">
          {(Object.entries(UTILIZATION_COLORS) as [Utilization, string][]).map(([key, cls]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`inline-block w-4 h-4 rounded border ${cls}`} />
              <span className="text-xs text-gray-600 capitalize">{key} ({UTILIZATION_LABEL[key]})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
