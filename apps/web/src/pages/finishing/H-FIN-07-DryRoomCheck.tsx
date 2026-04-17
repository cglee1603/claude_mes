import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { exportToCsv } from '../../utils/excel'

interface DryRoomRecord {
  id: string
  checkDate: string
  inspector: string
  temperature: number
  humidity: number
  abnormal: boolean
  remarks: string
}

const TEMP_MIN = 18
const TEMP_MAX = 28
const HUMID_MIN = 40
const HUMID_MAX = 70

function isAbnormal(temp: number, humid: number): boolean {
  return temp < TEMP_MIN || temp > TEMP_MAX || humid < HUMID_MIN || humid > HUMID_MAX
}

const MOCK_DATA: DryRoomRecord[] = [
  { id: 'DRC-001', checkDate: '2026-04-17', inspector: 'Nguyen A', temperature: 23, humidity: 55, abnormal: false, remarks: '-' },
  { id: 'DRC-002', checkDate: '2026-04-16', inspector: 'Tran B', temperature: 29, humidity: 58, abnormal: true, remarks: 'Temperature high, ventilation applied' },
  { id: 'DRC-003', checkDate: '2026-04-15', inspector: 'Nguyen A', temperature: 22, humidity: 62, abnormal: false, remarks: '-' },
  { id: 'DRC-004', checkDate: '2026-04-14', inspector: 'Le C', temperature: 24, humidity: 38, abnormal: true, remarks: 'Humidity low, humidifier activated' },
  { id: 'DRC-005', checkDate: '2026-04-13', inspector: 'Tran B', temperature: 20, humidity: 50, abnormal: false, remarks: '-' },
  { id: 'DRC-006', checkDate: '2026-04-12', inspector: 'Nguyen A', temperature: 25, humidity: 65, abnormal: false, remarks: '-' },
  { id: 'DRC-007', checkDate: '2026-04-11', inspector: 'Pham D', temperature: 17, humidity: 45, abnormal: true, remarks: 'Temperature low, AC unit inspected' },
]

export function HFin07Page() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ checkDate: '', inspector: '', temperature: '', humidity: '', remarks: '' })

  const handleChange = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const tempVal = parseFloat(form.temperature)
  const humidVal = parseFloat(form.humidity)
  const formAbnormal = form.temperature && form.humidity ? isAbnormal(tempVal, humidVal) : false

  const handleRegister = () =>
    setForm({ checkDate: '', inspector: '', temperature: '', humidity: '', remarks: '' })

  const handleExport = () => exportToCsv(MOCK_DATA, 'dry-room-check')

  const columns: Column<DryRoomRecord>[] = [
    { key: 'checkDate', header: t('finishing.dryRoom.checkDate'), width: 120 },
    {
      key: 'temperature', header: t('finishing.dryRoom.temperature'), width: 120,
      render: (row) => (
        <span className={(row.temperature < TEMP_MIN || row.temperature > TEMP_MAX) ? 'text-red-600 font-semibold' : 'text-gray-800'}>
          {row.temperature}°C
        </span>
      ),
    },
    {
      key: 'humidity', header: t('finishing.dryRoom.humidity'), width: 110,
      render: (row) => (
        <span className={(row.humidity < HUMID_MIN || row.humidity > HUMID_MAX) ? 'text-red-600 font-semibold' : 'text-gray-800'}>
          {row.humidity}%
        </span>
      ),
    },
    {
      key: 'abnormal', header: t('finishing.dryRoom.abnormal'), width: 100,
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${row.abnormal ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {row.abnormal ? 'YES' : 'NO'}
        </span>
      ),
    },
    { key: 'inspector', header: t('finishing.dryRoom.inspector'), width: 110 },
    { key: 'remarks', header: t('finishing.dryRoom.remarks') },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('finishing.dryRoom.title')} subtitle="H-FIN-07" />

      <div className="flex gap-4 text-xs text-gray-500">
        <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">{t('finishing.dryRoom.tempRange')}</span>
        <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">{t('finishing.dryRoom.humidityRange')}</span>
      </div>

      {formAbnormal && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm font-semibold">
          <span>&#9888;</span>
          <span>{t('finishing.dryRoom.abnormalWarning')}</span>
        </div>
      )}

      <div className="card space-y-4">
        <h3 className="text-base font-semibold text-gray-800">{t('finishing.dryRoom.register')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: t('finishing.dryRoom.checkDate'), field: 'checkDate', type: 'date' },
            { label: t('finishing.dryRoom.inspector'), field: 'inspector', type: 'text' },
            { label: t('finishing.dryRoom.temperature'), field: 'temperature', type: 'number' },
            { label: t('finishing.dryRoom.humidity'), field: 'humidity', type: 'number' },
            { label: t('finishing.dryRoom.remarks'), field: 'remarks', type: 'text' },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input type={type} value={form[field as keyof typeof form]} onChange={e => handleChange(field, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={handleRegister} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            {t('finishing.dryRoom.register')}
          </button>
          <button onClick={handleExport} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            {t('common.exportExcel')}
          </button>
        </div>
      </div>

      <div className="card">
        <MesGrid columns={columns} data={MOCK_DATA} height={380} gridKey="H-FIN-07-grid" />
      </div>
    </div>
  )
}
