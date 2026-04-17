import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'
import { exportToCsv } from '../../utils/excel'

interface CalibrationRecord {
  id: string
  machineNo: string
  calibrationDate: string
  testResult: string
  calibratedBy: string
  nextCalibration: string
}

type PointResult = 'PASS' | 'FAIL' | 'UNTESTED'

const POINT_LABELS = ['TL', 'TM', 'TR', 'ML', 'MM', 'MR', 'BL', 'BM', 'BR']

const MOCK_DATA: CalibrationRecord[] = [
  { id: 'CAL-001', machineNo: 'MFZ-001', calibrationDate: '2026-04-17', testResult: 'PASS', calibratedBy: 'Nguyen A', nextCalibration: '2026-05-17' },
  { id: 'CAL-002', machineNo: 'MFZ-002', calibrationDate: '2026-04-15', testResult: 'FAIL', calibratedBy: 'Tran B', nextCalibration: '2026-04-16' },
  { id: 'CAL-003', machineNo: 'MFZ-001', calibrationDate: '2026-03-17', testResult: 'PASS', calibratedBy: 'Le C', nextCalibration: '2026-04-17' },
  { id: 'CAL-004', machineNo: 'MFZ-003', calibrationDate: '2026-04-10', testResult: 'PASS', calibratedBy: 'Pham D', nextCalibration: '2026-05-10' },
]

const initialPoints = (): Record<string, PointResult> =>
  Object.fromEntries(POINT_LABELS.map(p => [p, 'UNTESTED' as PointResult]))

export function HFin02Page() {
  const { t } = useTranslation()
  const [machineNo, setMachineNo] = useState('')
  const [calibrationDate, setCalibrationDate] = useState('')
  const [calibratedBy, setCalibratedBy] = useState('')
  const [points, setPoints] = useState<Record<string, PointResult>>(initialPoints)

  const togglePoint = (label: string) => {
    setPoints(prev => {
      const cur = prev[label]
      const next: PointResult = cur === 'UNTESTED' ? 'PASS' : cur === 'PASS' ? 'FAIL' : 'UNTESTED'
      return { ...prev, [label]: next }
    })
  }

  const hasFail = Object.values(points).some(v => v === 'FAIL')

  const handleRegister = () => {
    setMachineNo('')
    setCalibrationDate('')
    setCalibratedBy('')
    setPoints(initialPoints())
  }

  const handleExport = () => exportToCsv(MOCK_DATA, 'mfz-calibration')

  const pointColor = (r: PointResult) =>
    r === 'PASS' ? 'bg-green-500 text-white' : r === 'FAIL' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'

  const columns: Column<CalibrationRecord>[] = [
    { key: 'id', header: t('finishing.mfzCalibration.calibrationId'), width: 100 },
    { key: 'machineNo', header: t('finishing.mfzCalibration.machineNo'), width: 110 },
    { key: 'calibrationDate', header: t('finishing.mfzCalibration.calibrationDate'), width: 130 },
    {
      key: 'testResult', header: t('finishing.mfzCalibration.testResult'), width: 110,
      render: (row) => <StatusBadge status={row.testResult} label={row.testResult} />,
    },
    { key: 'calibratedBy', header: t('finishing.mfzCalibration.calibratedBy'), width: 110 },
    { key: 'nextCalibration', header: t('finishing.mfzCalibration.nextCalibration'), width: 150 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('finishing.mfzCalibration.title')} subtitle="H-FIN-02" />

      <div className="card space-y-4">
        <h3 className="text-base font-semibold text-gray-800">{t('finishing.mfzCalibration.register')}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('finishing.mfzCalibration.machineNo')}</label>
            <input type="text" value={machineNo} onChange={e => setMachineNo(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('finishing.mfzCalibration.calibrationDate')}</label>
            <input type="date" value={calibrationDate} onChange={e => setCalibrationDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('finishing.mfzCalibration.calibratedBy')}</label>
            <input type="text" value={calibratedBy} onChange={e => setCalibratedBy(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">{t('finishing.mfzCalibration.ninePointTest')}</p>
          <div className="inline-grid grid-cols-3 gap-2">
            {POINT_LABELS.map(label => (
              <button key={label} onClick={() => togglePoint(label)}
                className={`w-20 h-10 rounded-lg text-xs font-semibold transition-colors ${pointColor(points[label])}`}>
                {label}: {points[label]}
              </button>
            ))}
          </div>
        </div>

        {hasFail && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm font-medium">
            <span>&#9888;</span>
            <span>{t('finishing.mfzCalibration.stopRecommended')}</span>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={handleRegister} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            {t('finishing.mfzCalibration.register')}
          </button>
          <button onClick={handleExport} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            {t('common.exportExcel')}
          </button>
        </div>
      </div>

      <div className="card">
        <MesGrid columns={columns} data={MOCK_DATA} height={320} gridKey="H-FIN-02-grid" />
      </div>
    </div>
  )
}
