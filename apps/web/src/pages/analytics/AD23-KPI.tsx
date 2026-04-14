import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader, KpiCard, DataTable } from '@/components/common'
import type { Column } from '@/components/common'

interface KpiData {
  oee: number
  dailyOutput: number
  productionAchievement: number
  avgDhu: number
  mfzDetections: number
  lineUtilization: number
  lines: LineEfficiency[]
}

interface LineEfficiency {
  lineId: string
  lineCode: string
  lineName: string
  targetQty: number
  actualQty: number
  efficiency: number
  oee: number
  defectRate: number
}

const mockKpi: KpiData = {
  oee: 82.3,
  dailyOutput: 3450,
  productionAchievement: 91.2,
  avgDhu: 2.8,
  mfzDetections: 3,
  lineUtilization: 87.5,
  lines: [
    { lineId: 'L001', lineCode: 'LINE-A', lineName: 'A Line', targetQty: 1000, actualQty: 920, efficiency: 92.0, oee: 85.1, defectRate: 2.1 },
    { lineId: 'L002', lineCode: 'LINE-B', lineName: 'B Line', targetQty: 800, actualQty: 710, efficiency: 88.8, oee: 80.5, defectRate: 3.2 },
    { lineId: 'L003', lineCode: 'LINE-C', lineName: 'C Line', targetQty: 1200, actualQty: 1080, efficiency: 90.0, oee: 83.7, defectRate: 2.5 },
    { lineId: 'L004', lineCode: 'LINE-D', lineName: 'D Line', targetQty: 900, actualQty: 740, efficiency: 82.2, oee: 76.4, defectRate: 4.1 },
  ],
}

export function AD23KPIPage() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState('2026-04-10')
  const kpi = mockKpi

  const lineColumns: Column<LineEfficiency>[] = [
    { key: 'lineCode', header: t('admin.line.lineCode') },
    { key: 'lineName', header: t('admin.line.lineName') },
    {
      key: 'targetQty',
      header: t('analytics.kpi.targetQty'),
      render: (row) => <span>{row.targetQty.toLocaleString()}</span>,
    },
    {
      key: 'actualQty',
      header: t('analytics.kpi.actualQty'),
      render: (row) => <span className="font-semibold">{row.actualQty.toLocaleString()}</span>,
    },
    {
      key: 'efficiency',
      header: t('sewing.summary.efficiency'),
      render: (row) => (
        <span className={row.efficiency >= 90 ? 'text-green-600 font-semibold' : row.efficiency >= 85 ? 'text-yellow-600' : 'text-red-600'}>
          {row.efficiency.toFixed(1)}%
        </span>
      ),
    },
    {
      key: 'oee',
      header: t('sewing.summary.oee'),
      render: (row) => (
        <span className={row.oee >= 80 ? 'text-green-600' : 'text-yellow-600'}>
          {row.oee.toFixed(1)}%
        </span>
      ),
    },
    {
      key: 'defectRate',
      header: t('analytics.kpi.defectRate'),
      render: (row) => (
        <span className={row.defectRate <= 2.5 ? 'text-green-600' : 'text-red-600'}>
          {row.defectRate.toFixed(1)}%
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('analytics.kpi.title')}
        subtitle={t('analytics.kpi.subtitle')}
        actions={
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input"
          />
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          label={t('analytics.kpi.oee')}
          value={kpi.oee}
          unit="%"
          trend="up"
          color="blue"
        />
        <KpiCard
          label={t('analytics.kpi.dailyOutput')}
          value={kpi.dailyOutput.toLocaleString()}
          unit={t('common.qty')}
          trend="up"
          color="green"
        />
        <KpiCard
          label={t('analytics.kpi.productionAchievement')}
          value={kpi.productionAchievement}
          unit="%"
          trend="up"
          color="green"
        />
        <KpiCard
          label={t('analytics.kpi.avgDhu')}
          value={kpi.avgDhu}
          unit="%"
          trend="down"
          color="yellow"
        />
        <KpiCard
          label={t('analytics.kpi.mfzDetections')}
          value={kpi.mfzDetections}
          unit={t('analytics.kpi.cases')}
          trend="neutral"
          color="red"
        />
        <KpiCard
          label={t('analytics.kpi.lineUtilization')}
          value={kpi.lineUtilization}
          unit="%"
          trend="up"
          color="blue"
        />
      </div>

      {/* Line Efficiency Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('analytics.kpi.lineEfficiency')}
        </h3>
        <DataTable<LineEfficiency>
          columns={lineColumns}
          data={kpi.lines}
          keyField="lineId"
        />
      </div>
    </div>
  )
}
