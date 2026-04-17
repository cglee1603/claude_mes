import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/grid/MesGrid'
import { exportToCsv } from '../../utils/excel'

interface SpreadingReport {
  reportNo: string
  planNo: string
  rollNo: string
  colorCode: string
  layers: number
  spreadLength: number
  worker: string
  workDate: string
}

const MOCK_REPORTS: SpreadingReport[] = [
  { reportNo: 'SPR-2026-001', planNo: 'CTP-2026-001', rollNo: 'ROLL-BLK-001', colorCode: 'BLK', layers: 80, spreadLength: 120.5, worker: 'Nguyen Van A', workDate: '2026-04-10' },
  { reportNo: 'SPR-2026-002', planNo: 'CTP-2026-001', rollNo: 'ROLL-BLK-002', colorCode: 'BLK', layers: 75, spreadLength: 118.0, worker: 'Nguyen Van A', workDate: '2026-04-10' },
  { reportNo: 'SPR-2026-003', planNo: 'CTP-2026-002', rollNo: 'ROLL-WHT-001', colorCode: 'WHT', layers: 60, spreadLength: 95.0, worker: 'Tran Thi B', workDate: '2026-04-11' },
  { reportNo: 'SPR-2026-004', planNo: 'CTP-2026-003', rollNo: 'ROLL-RED-001', colorCode: 'RED', layers: 70, spreadLength: 110.0, worker: 'Le Van C', workDate: '2026-04-14' },
  { reportNo: 'SPR-2026-005', planNo: 'CTP-2026-003', rollNo: 'ROLL-RED-002', colorCode: 'RED', layers: 65, spreadLength: 105.5, worker: 'Le Van C', workDate: '2026-04-14' },
  { reportNo: 'SPR-2026-006', planNo: 'CTP-2026-004', rollNo: 'ROLL-BLU-001', colorCode: 'BLU', layers: 72, spreadLength: 115.0, worker: 'Pham Thi D', workDate: '2026-04-15' },
]

export function HSC02Page() {
  const { t } = useTranslation()
  const [filterPlanNo, setFilterPlanNo] = useState('')
  const [filterDate, setFilterDate] = useState('')

  const filtered = MOCK_REPORTS.filter((r) => {
    const matchPlan = filterPlanNo === '' || r.planNo.includes(filterPlanNo)
    const matchDate = filterDate === '' || r.workDate === filterDate
    return matchPlan && matchDate
  })

  const totalLayers = filtered.reduce((sum, r) => sum + r.layers, 0)
  const totalLength = filtered.reduce((sum, r) => sum + r.spreadLength, 0)

  const columns: Column<SpreadingReport>[] = [
    { key: 'reportNo', header: t('cutting.spreading.reportNo'), width: 150 },
    { key: 'planNo', header: t('cutting.spreading.planNo'), width: 140 },
    { key: 'rollNo', header: t('cutting.spreading.rollNo'), width: 140 },
    { key: 'colorCode', header: t('cutting.spreading.colorCode'), width: 100 },
    { key: 'layers', header: t('cutting.spreading.layers'), width: 100 },
    { key: 'spreadLength', header: t('cutting.spreading.spreadLength'), width: 130 },
    { key: 'worker', header: t('cutting.spreading.worker'), width: 130 },
    { key: 'workDate', header: t('cutting.spreading.workDate'), width: 110 },
  ]

  function handleExport() {
    exportToCsv(
      filtered.map((r) => ({
        [t('cutting.spreading.reportNo')]: r.reportNo,
        [t('cutting.spreading.planNo')]: r.planNo,
        [t('cutting.spreading.rollNo')]: r.rollNo,
        [t('cutting.spreading.colorCode')]: r.colorCode,
        [t('cutting.spreading.layers')]: r.layers,
        [t('cutting.spreading.spreadLength')]: r.spreadLength,
        [t('cutting.spreading.worker')]: r.worker,
        [t('cutting.spreading.workDate')]: r.workDate,
      })),
      'spreading-report'
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('cutting.spreading.title')} />

      <div className="card flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.spreading.planNo')}</label>
          <input
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="CTP-2026-..."
            value={filterPlanNo}
            onChange={(e) => setFilterPlanNo(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.spreading.workDate')}</label>
          <input
            type="date"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <button className="btn-primary text-sm px-3 py-2" onClick={handleExport}>
          {t('common.exportExcel')}
        </button>
      </div>

      <MesGrid columns={columns} data={filtered} gridKey="HSC02-grid" height={380} />

      <div className="card flex gap-8 text-sm font-medium text-gray-700">
        <span>{t('cutting.spreading.totalLayers')}: <span className="text-blue-700 font-bold">{totalLayers}</span></span>
        <span>{t('cutting.spreading.spreadLength')}: <span className="text-blue-700 font-bold">{totalLength.toFixed(1)} m</span></span>
      </div>
    </div>
  )
}
