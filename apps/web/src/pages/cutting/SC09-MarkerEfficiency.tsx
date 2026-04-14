import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common'

interface MarkerData {
  id: string
  styleCode: string
  markerNo: string
  efficiency: number
}

const MOCK_MARKERS: MarkerData[] = [
  { id: 'mk-1', styleCode: 'NK-SS26-001', markerNo: 'MK-001', efficiency: 92.4 },
  { id: 'mk-2', styleCode: 'ZR-SS26-010', markerNo: 'MK-002', efficiency: 87.1 },
  { id: 'mk-3', styleCode: 'HM-FW26-005', markerNo: 'MK-003', efficiency: 78.5 },
  { id: 'mk-4', styleCode: 'NK-SS26-002', markerNo: 'MK-004', efficiency: 94.2 },
  { id: 'mk-5', styleCode: 'ZR-FW26-003', markerNo: 'MK-005', efficiency: 75.8 },
]

function getBarColor(efficiency: number): string {
  if (efficiency > 90) return 'bg-green-500'
  if (efficiency >= 80) return 'bg-yellow-500'
  return 'bg-red-500'
}

function getTextColor(efficiency: number): string {
  if (efficiency > 90) return 'text-green-700'
  if (efficiency >= 80) return 'text-yellow-700'
  return 'text-red-700'
}

export function SC09MarkerEfficiencyPage() {
  const { t } = useTranslation()

  const avgEfficiency =
    MOCK_MARKERS.reduce((sum, m) => sum + m.efficiency, 0) / MOCK_MARKERS.length

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('cutting.markerEfficiency.title')}
        subtitle={t('cutting.markerEfficiency.subtitle')}
      />

      {/* Average Efficiency */}
      <div className="card">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">
            {t('cutting.markerEfficiency.avgEfficiency')}
          </span>
          <span className={`text-2xl font-bold ${getTextColor(avgEfficiency)}`}>
            {avgEfficiency.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card">
        <div className="space-y-4">
          {MOCK_MARKERS.map((marker) => (
            <div key={marker.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{marker.styleCode}</span>
                  <span className="text-gray-500">({marker.markerNo})</span>
                </div>
                <span className={`font-semibold ${getTextColor(marker.efficiency)}`}>
                  {marker.efficiency}%
                </span>
              </div>
              <div className="h-6 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(marker.efficiency)}`}
                  style={{ width: `${marker.efficiency}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span>&gt;90%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span>80~90%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span>&lt;80%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
