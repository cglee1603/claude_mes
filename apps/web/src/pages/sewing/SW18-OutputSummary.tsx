import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'
import { KpiCard } from '@/components/common/KpiCard'
import { DataTable, type Column } from '@/components/common/DataTable'

interface LineSummary {
  lineId: string
  lineCode: string
  totalOutput: number
  totalDefect: number
  dhuPercent: number
  efficiencyPercent: number
}

const MOCK_SUMMARIES: Record<string, LineSummary[]> = {
  '2026-04-10': [
    { lineId: 'line-1', lineCode: 'LINE-A', totalOutput: 480, totalDefect: 12, dhuPercent: 2.5, efficiencyPercent: 88.5 },
    { lineId: 'line-2', lineCode: 'LINE-B', totalOutput: 420, totalDefect: 18, dhuPercent: 4.3, efficiencyPercent: 82.1 },
    { lineId: 'line-3', lineCode: 'LINE-C', totalOutput: 390, totalDefect: 8, dhuPercent: 2.1, efficiencyPercent: 76.3 },
    { lineId: 'line-4', lineCode: 'LINE-D', totalOutput: 510, totalDefect: 15, dhuPercent: 2.9, efficiencyPercent: 91.2 },
  ],
  '2026-04-09': [
    { lineId: 'line-1', lineCode: 'LINE-A', totalOutput: 460, totalDefect: 14, dhuPercent: 3.0, efficiencyPercent: 85.0 },
    { lineId: 'line-2', lineCode: 'LINE-B', totalOutput: 400, totalDefect: 20, dhuPercent: 5.0, efficiencyPercent: 78.5 },
    { lineId: 'line-3', lineCode: 'LINE-C', totalOutput: 370, totalDefect: 10, dhuPercent: 2.7, efficiencyPercent: 73.0 },
    { lineId: 'line-4', lineCode: 'LINE-D', totalOutput: 490, totalDefect: 12, dhuPercent: 2.4, efficiencyPercent: 89.0 },
  ],
}

export function SW18OutputSummaryPage() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState('2026-04-10')

  const summaries = MOCK_SUMMARIES[selectedDate] ?? []

  const totalOutput = summaries.reduce((s, r) => s + r.totalOutput, 0)
  const totalDefect = summaries.reduce((s, r) => s + r.totalDefect, 0)
  const avgDhu = summaries.length > 0
    ? (summaries.reduce((s, r) => s + r.dhuPercent, 0) / summaries.length).toFixed(1)
    : '0.0'
  const avgEfficiency = summaries.length > 0
    ? (summaries.reduce((s, r) => s + r.efficiencyPercent, 0) / summaries.length).toFixed(1)
    : '0.0'

  // UPH = 60min / SAM * workers  (mock: SAM 5min, avg 20 workers/line)
  const SAM = 5
  const avgWorkers = 20
  const uph = Math.round((60 / SAM) * avgWorkers)

  const columns: Column<LineSummary>[] = [
    { key: 'lineCode', header: t('common.lineNo') },
    {
      key: 'totalOutput',
      header: t('sewing.summary.totalOutput'),
      className: 'text-right',
      render: (r) => r.totalOutput.toLocaleString(),
    },
    {
      key: 'totalDefect',
      header: t('sewing.summary.totalDefect'),
      className: 'text-right',
      render: (r) => r.totalDefect.toLocaleString(),
    },
    {
      key: 'dhuPercent',
      header: 'DHU %',
      className: 'text-right',
      render: (r) => {
        const color = r.dhuPercent > 4 ? 'text-red-600 font-semibold' : r.dhuPercent > 3 ? 'text-yellow-600' : 'text-green-600'
        return <span className={color}>{r.dhuPercent.toFixed(1)}%</span>
      },
    },
    {
      key: 'efficiencyPercent',
      header: t('sewing.summary.efficiency'),
      className: 'text-right',
      render: (r) => {
        const color = r.efficiencyPercent >= 85 ? 'text-green-600 font-semibold' : r.efficiencyPercent >= 75 ? 'text-yellow-600' : 'text-red-600'
        return <span className={color}>{r.efficiencyPercent.toFixed(1)}%</span>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('sewing.summary.title')}
        actions={
          <input
            type="date"
            className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        }
      />

      {/* 5 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          label={t('sewing.summary.totalOutput')}
          value={totalOutput.toLocaleString()}
          unit="pcs"
          trend="up"
          color="blue"
        />
        <KpiCard
          label={t('sewing.summary.totalDefect')}
          value={totalDefect.toLocaleString()}
          unit="pcs"
          trend="down"
          color="red"
        />
        <KpiCard
          label="DHU %"
          value={avgDhu}
          unit="%"
          trend={Number(avgDhu) < 3 ? 'down' : 'up'}
          color={Number(avgDhu) < 3 ? 'green' : 'yellow'}
        />
        <KpiCard
          label={t('sewing.summary.efficiency')}
          value={avgEfficiency}
          unit="%"
          trend="up"
          color="green"
        />
        <KpiCard
          label="UPH"
          value={uph}
          unit="pcs/hr"
          trend="neutral"
          color="blue"
        />
      </div>

      {/* Line summary table */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          {selectedDate} - {t('sewing.plan.line')} {t('sewing.summary.title')}
        </h3>
        <DataTable<LineSummary & Record<string, unknown>>
          columns={columns as Column<LineSummary & Record<string, unknown>>[]}
          data={summaries as (LineSummary & Record<string, unknown>)[]}
          keyField="lineId"
        />
      </div>
    </div>
  )
}
