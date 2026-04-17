import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/grid/MesGrid'
import { exportToCsv } from '../../utils/excel'

interface MarkerRecord {
  markerId: string
  styleCode: string
  fabricWidth: number
  efficiency: number
  markerFile: string
  plannedQty: number
  date: string
}

const MOCK_MARKERS: MarkerRecord[] = [
  { markerId: 'MRK-001', styleCode: 'NK-SS26-001', fabricWidth: 150, efficiency: 92.5, markerFile: 'NK-SS26-001-BLK.mrk', plannedQty: 500, date: '2026-04-10' },
  { markerId: 'MRK-002', styleCode: 'NK-SS26-001', fabricWidth: 150, efficiency: 88.3, markerFile: 'NK-SS26-001-WHT.mrk', plannedQty: 300, date: '2026-04-11' },
  { markerId: 'MRK-003', styleCode: 'ZR-SS26-010', fabricWidth: 140, efficiency: 75.1, markerFile: 'ZR-SS26-010-RED.mrk', plannedQty: 400, date: '2026-04-14' },
  { markerId: 'MRK-004', styleCode: 'ZR-SS26-010', fabricWidth: 140, efficiency: 82.0, markerFile: 'ZR-SS26-010-BLU.mrk', plannedQty: 400, date: '2026-04-15' },
  { markerId: 'MRK-005', styleCode: 'HM-FW26-005', fabricWidth: 160, efficiency: 79.8, markerFile: 'HM-FW26-005-GRY.mrk', plannedQty: 600, date: '2026-04-17' },
]

export function HSC03Page() {
  const { t } = useTranslation()
  const [styleCode, setStyleCode] = useState('')
  const [fabricWidth, setFabricWidth] = useState('')
  const [efficiency, setEfficiency] = useState('')
  const [markerFile, setMarkerFile] = useState('')
  const [plannedQty, setPlannedQty] = useState('')

  const isFabricWidthMissing = fabricWidth === '' || Number(fabricWidth) <= 0
  const efficiencyNum = Number(efficiency)

  const columns: Column<MarkerRecord>[] = [
    { key: 'markerId', header: t('cutting.marker.markerId'), width: 110 },
    { key: 'styleCode', header: t('cutting.marker.styleCode'), width: 130 },
    { key: 'fabricWidth', header: t('cutting.marker.fabricWidth'), width: 120 },
    {
      key: 'efficiency',
      header: t('cutting.marker.efficiency'),
      width: 130,
      render: (row) => (
        <span className={row.efficiency < 80 ? 'text-yellow-700 font-semibold' : ''}>
          {row.efficiency.toFixed(1)}%
        </span>
      ),
    },
    { key: 'markerFile', header: t('cutting.marker.markerFile'), width: 180 },
    { key: 'plannedQty', header: t('cutting.marker.plannedQty'), width: 110 },
    { key: 'date', header: t('cutting.marker.date'), width: 110 },
  ]

  function handleExport() {
    exportToCsv(
      MOCK_MARKERS.map((m) => ({
        [t('cutting.marker.markerId')]: m.markerId,
        [t('cutting.marker.styleCode')]: m.styleCode,
        [t('cutting.marker.fabricWidth')]: m.fabricWidth,
        [t('cutting.marker.efficiency')]: m.efficiency,
        [t('cutting.marker.markerFile')]: m.markerFile,
        [t('cutting.marker.plannedQty')]: m.plannedQty,
        [t('cutting.marker.date')]: m.date,
      })),
      'marker-efficiency'
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStyleCode('')
    setFabricWidth('')
    setEfficiency('')
    setMarkerFile('')
    setPlannedQty('')
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('cutting.marker.title')} />

      <div className="card max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.marker.styleCode')}</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={styleCode} onChange={(e) => setStyleCode(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('cutting.marker.fabricWidth')} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={fabricWidth}
              onChange={(e) => setFabricWidth(e.target.value)}
              required
            />
            {isFabricWidthMissing && fabricWidth !== '' && (
              <p className="text-red-500 text-xs mt-1">{t('cutting.marker.widthRequired')}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.marker.efficiency')}</label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
              value={efficiency}
              onChange={(e) => setEfficiency(e.target.value)}
              disabled={isFabricWidthMissing}
              required
            />
            {efficiencyNum > 0 && efficiencyNum < 80 && (
              <p className="text-yellow-600 text-xs mt-1">{t('cutting.marker.lowEfficiencyWarning')}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.marker.markerFile')}</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={markerFile} onChange={(e) => setMarkerFile(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.marker.plannedQty')}</label>
            <input type="number" min={1} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={plannedQty} onChange={(e) => setPlannedQty(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={isFabricWidthMissing}>
            {t('cutting.marker.title')}
          </button>
        </form>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary text-sm px-3 py-1.5" onClick={handleExport}>{t('common.exportExcel')}</button>
      </div>

      <MesGrid columns={columns} data={MOCK_MARKERS} gridKey="HSC03-grid" height={360} />
    </div>
  )
}
