import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { KpiCard } from '../../components/common/KpiCard'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { exportToCsv } from '../../utils/excel'

interface WorkerOutput {
  worker: string
  process: string
  completedQty: number
  defectQty: number
  hours: number
  productivity: number
}

interface DailyTrend {
  date: string
  completedQty: number
  defectQty: number
  productivity: number
}

const MOCK_WORKERS: WorkerOutput[] = [
  { worker: 'Nguyen Thi A', process: 'Hangtag Attach', completedQty: 320, defectQty: 3, hours: 8, productivity: 40.0 },
  { worker: 'Tran Van B', process: 'Polybag', completedQty: 280, defectQty: 1, hours: 8, productivity: 35.0 },
  { worker: 'Le Thi C', process: 'Carton Packing', completedQty: 150, defectQty: 2, hours: 8, productivity: 18.8 },
  { worker: 'Pham Van D', process: 'MFZ Inspection', completedQty: 500, defectQty: 0, hours: 8, productivity: 62.5 },
  { worker: 'Hoang Thi E', process: 'Hangtag Attach', completedQty: 310, defectQty: 4, hours: 8, productivity: 38.8 },
  { worker: 'Vo Van F', process: 'Polybag', completedQty: 290, defectQty: 2, hours: 8, productivity: 36.3 },
]

const MOCK_TREND: DailyTrend[] = [
  { date: '2026-04-11', completedQty: 1680, defectQty: 14, productivity: 35.0 },
  { date: '2026-04-14', completedQty: 1750, defectQty: 10, productivity: 36.5 },
  { date: '2026-04-15', completedQty: 1820, defectQty: 8, productivity: 37.9 },
  { date: '2026-04-16', completedQty: 1790, defectQty: 12, productivity: 37.3 },
  { date: '2026-04-17', completedQty: 1850, defectQty: 12, productivity: 38.5 },
]

const TODAY_TARGET = 2000

export function HPerf01Page() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState('2026-04-17')

  const todayCompleted = MOCK_WORKERS.reduce((s, w) => s + w.completedQty, 0)
  const totalDefect = MOCK_WORKERS.reduce((s, w) => s + w.defectQty, 0)
  const achievementRate = Math.round((todayCompleted / TODAY_TARGET) * 100)
  const defectRate = Math.round((totalDefect / todayCompleted) * 1000) / 10
  const perPersonProd = Math.round((todayCompleted / MOCK_WORKERS.length) * 10) / 10

  const handleExport = () => exportToCsv(MOCK_WORKERS, 'finishing-performance')

  const workerColumns: Column<WorkerOutput>[] = [
    { key: 'worker', header: t('finishing.performance.worker'), width: 140 },
    { key: 'process', header: t('finishing.performance.process'), width: 110 },
    { key: 'completedQty', header: t('finishing.performance.completedQty'), width: 110 },
    { key: 'defectQty', header: t('finishing.performance.defectQty'), width: 100 },
    { key: 'hours', header: t('finishing.performance.hours'), width: 100 },
    { key: 'productivity', header: t('finishing.performance.productivity'), width: 120 },
  ]

  const trendColumns: Column<DailyTrend>[] = [
    { key: 'date', header: t('common.date'), width: 120 },
    { key: 'completedQty', header: t('finishing.performance.completedQty'), width: 130 },
    { key: 'defectQty', header: t('finishing.performance.defectQty'), width: 110 },
    { key: 'productivity', header: t('finishing.performance.productivity'), width: 130 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('finishing.performance.title')} subtitle="H-PERF-01" />

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-600">{t('common.date')}</label>
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
        <button onClick={handleExport} className="ml-auto px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
          {t('common.exportExcel')}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label={t('finishing.performance.todayCompleted')} value={todayCompleted} unit="pcs" color="blue" trendUp={true} trend="+3.3%" />
        <KpiCard label={t('finishing.performance.perPersonProd')} value={perPersonProd} unit="pcs/hr" color="green" />
        <KpiCard label={t('finishing.performance.achievementRate')} value={`${achievementRate}%`} color={achievementRate >= 100 ? 'green' : 'yellow'} />
        <KpiCard label={t('finishing.performance.defectRate')} value={`${defectRate}%`} color={defectRate > 1 ? 'red' : 'green'} />
      </div>

      <div className="card">
        <h3 className="text-base font-semibold text-gray-800 mb-4">{t('finishing.performance.worker')} {t('common.detail')}</h3>
        <MesGrid columns={workerColumns} data={MOCK_WORKERS} height={340} gridKey="H-PERF-01-worker-grid" />
      </div>

      <div className="card">
        <h3 className="text-base font-semibold text-gray-800 mb-4">{t('common.trend')}</h3>
        <MesGrid columns={trendColumns} data={MOCK_TREND} height={280} gridKey="H-PERF-01-trend-grid" />
      </div>
    </div>
  )
}
