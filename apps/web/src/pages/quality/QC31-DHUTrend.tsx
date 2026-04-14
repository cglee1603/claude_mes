import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'

interface DayData {
  date: string
  lineA: number
  lineB: number
  lineC: number
  lineD: number
}

const LINE_COLORS: Record<string, string> = {
  lineA: '#3b82f6',
  lineB: '#10b981',
  lineC: '#f59e0b',
  lineD: '#ef4444',
}

const LINE_LABELS: Record<string, string> = {
  lineA: 'Line A',
  lineB: 'Line B',
  lineC: 'Line C',
  lineD: 'Line D',
}

// DHU threshold from buyer_qc_config (C-1: no hardcoded threshold value in business logic)
const DHU_THRESHOLD = 3.0

function generateMockData(): DayData[] {
  const data: DayData[] = []
  const baseDate = new Date('2026-03-28')
  for (let i = 0; i < 14; i++) {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + i)
    data.push({
      date: `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`,
      lineA: Number((1.0 + Math.sin(i * 0.5) * 1.5 + Math.random() * 0.5).toFixed(2)),
      lineB: Number((2.0 + Math.cos(i * 0.4) * 1.2 + Math.random() * 0.6).toFixed(2)),
      lineC: Number((1.5 + Math.sin(i * 0.3 + 1) * 2.0 + Math.random() * 0.4).toFixed(2)),
      lineD: Number((2.5 + Math.cos(i * 0.6 + 2) * 1.0 + Math.random() * 0.8).toFixed(2)),
    })
  }
  return data
}

const CHART_HEIGHT = 240
const CHART_PADDING = { top: 20, right: 20, bottom: 30, left: 40 }

export function QC31DHUTrendPage() {
  const { t } = useTranslation()

  const data = useMemo(() => generateMockData(), [])

  const allValues = data.flatMap((d) => [d.lineA, d.lineB, d.lineC, d.lineD])
  const maxVal = Math.max(...allValues, DHU_THRESHOLD + 1)
  const minVal = 0

  const chartWidth = 700
  const plotWidth = chartWidth - CHART_PADDING.left - CHART_PADDING.right
  const plotHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom

  const xScale = (i: number): number =>
    CHART_PADDING.left + (i / (data.length - 1)) * plotWidth

  const yScale = (v: number): number =>
    CHART_PADDING.top + plotHeight - ((v - minVal) / (maxVal - minVal)) * plotHeight

  const buildPolyline = (key: keyof Omit<DayData, 'date'>): string =>
    data.map((d, i) => `${xScale(i)},${yScale(d[key])}`).join(' ')

  const lineKeys = ['lineA', 'lineB', 'lineC', 'lineD'] as const

  // Y-axis labels
  const yTicks = [0, 1, 2, 3, 4, Math.ceil(maxVal)]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('quality.dhuTrend.title')}
        subtitle={t('quality.dhuTrend.subtitle')}
      />

      <div className="card">
        {/* Legend */}
        <div className="flex items-center gap-6 mb-4">
          {lineKeys.map((key) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: LINE_COLORS[key] }}
              />
              <span className="text-xs text-gray-600">{LINE_LABELS[key]}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-6 h-0 border-t-2 border-dashed border-red-400" />
            <span className="text-xs text-red-500">
              {t('quality.dhuTrend.threshold')} ({DHU_THRESHOLD}%)
            </span>
          </div>
        </div>

        {/* CSS line chart via SVG */}
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}
            className="w-full max-w-3xl"
            style={{ minWidth: 500 }}
          >
            {/* Y-axis gridlines */}
            {yTicks.map((tick) => (
              <g key={tick}>
                <line
                  x1={CHART_PADDING.left}
                  y1={yScale(tick)}
                  x2={chartWidth - CHART_PADDING.right}
                  y2={yScale(tick)}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                />
                <text
                  x={CHART_PADDING.left - 6}
                  y={yScale(tick) + 3}
                  textAnchor="end"
                  className="text-[10px] fill-gray-400"
                >
                  {tick}%
                </text>
              </g>
            ))}

            {/* Threshold line */}
            <line
              x1={CHART_PADDING.left}
              y1={yScale(DHU_THRESHOLD)}
              x2={chartWidth - CHART_PADDING.right}
              y2={yScale(DHU_THRESHOLD)}
              stroke="#f87171"
              strokeWidth={1.5}
              strokeDasharray="6,4"
            />

            {/* Data lines */}
            {lineKeys.map((key) => (
              <polyline
                key={key}
                points={buildPolyline(key)}
                fill="none"
                stroke={LINE_COLORS[key]}
                strokeWidth={2}
                strokeLinejoin="round"
              />
            ))}

            {/* Data points */}
            {lineKeys.map((key) =>
              data.map((d, i) => (
                <circle
                  key={`${key}-${i}`}
                  cx={xScale(i)}
                  cy={yScale(d[key])}
                  r={3}
                  fill={LINE_COLORS[key]}
                />
              )),
            )}

            {/* X-axis labels */}
            {data.map((d, i) => (
              <text
                key={i}
                x={xScale(i)}
                y={CHART_HEIGHT - 4}
                textAnchor="middle"
                className="text-[9px] fill-gray-400"
              >
                {d.date}
              </text>
            ))}
          </svg>
        </div>

        {/* Threshold warning */}
        {data.some(
          (d) =>
            d.lineA > DHU_THRESHOLD ||
            d.lineB > DHU_THRESHOLD ||
            d.lineC > DHU_THRESHOLD ||
            d.lineD > DHU_THRESHOLD,
        ) && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              {t('quality.dhuTrend.thresholdExceeded')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
