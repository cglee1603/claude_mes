import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'
import { exportToCsv } from '../../utils/excel'

interface ShipmentRecord {
  id: string
  poNo: string
  lot: string
  shipDate: string
  blNo: string
  containerNo: string
  quantity: number
  status: string
  mfzCleared: boolean
}

const MOCK_DATA: ShipmentRecord[] = [
  { id: 'SHP-001', poNo: 'PO-NK-2024-001', lot: 'L1', shipDate: '2026-04-30', blNo: 'BL-2026-001', containerNo: 'TCKU3456789', quantity: 1440, status: 'DEPARTED', mfzCleared: true },
  { id: 'SHP-002', poNo: 'PO-NK-2024-001', lot: 'L2', shipDate: '2026-05-15', blNo: 'BL-2026-002', containerNo: 'MSCU9871234', quantity: 960, status: 'LOADED', mfzCleared: true },
  { id: 'SHP-003', poNo: 'PO-ZR-2024-010', lot: 'L1', shipDate: '2026-05-10', blNo: '-', containerNo: '-', quantity: 850, status: 'SCHEDULED', mfzCleared: true },
  { id: 'SHP-004', poNo: 'PO-HM-2024-005', lot: 'L1', shipDate: '2026-04-25', blNo: 'BL-2026-003', containerNo: 'HLXU2345678', quantity: 480, status: 'DEPARTED', mfzCleared: true },
  { id: 'SHP-005', poNo: 'PO-NK-2024-002', lot: 'L1', shipDate: '2026-05-20', blNo: '-', containerNo: '-', quantity: 1200, status: 'SCHEDULED', mfzCleared: false },
]

const LOT_OPTIONS = ['L1', 'L2', 'L3', 'L4']

export function HFin06Page() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ poNo: '', lot: 'L1', shipDate: '', blNo: '', containerNo: '', quantity: '' })
  const [mfzCleared] = useState(true)

  const handleChange = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleRegister = () => {
    if (!mfzCleared) return
    setForm({ poNo: '', lot: 'L1', shipDate: '', blNo: '', containerNo: '', quantity: '' })
  }

  const handleExport = () => exportToCsv(MOCK_DATA, 'shipment')

  const columns: Column<ShipmentRecord>[] = [
    { key: 'id', header: t('finishing.shipment.shipmentId'), width: 100 },
    { key: 'poNo', header: t('finishing.shipment.poNo'), width: 150 },
    { key: 'lot', header: t('finishing.shipment.lot'), width: 80 },
    { key: 'shipDate', header: t('finishing.shipment.shipDate'), width: 110 },
    { key: 'blNo', header: t('finishing.shipment.blNo'), width: 130 },
    { key: 'containerNo', header: t('finishing.shipment.containerNo'), width: 140 },
    { key: 'quantity', header: t('finishing.shipment.quantity'), width: 90 },
    {
      key: 'status', header: t('finishing.shipment.status'), width: 110,
      render: (row) => <StatusBadge status={row.status} label={row.status} />,
    },
    {
      key: 'mfzCleared', header: 'MFZ', width: 80,
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${row.mfzCleared ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {row.mfzCleared ? 'OK' : 'NG'}
        </span>
      ),
    },
  ]

  const formFields = [
    { label: t('finishing.shipment.poNo'), field: 'poNo', type: 'text' },
    { label: t('finishing.shipment.shipDate'), field: 'shipDate', type: 'date' },
    { label: t('finishing.shipment.blNo'), field: 'blNo', type: 'text' },
    { label: t('finishing.shipment.containerNo'), field: 'containerNo', type: 'text' },
    { label: t('finishing.shipment.quantity'), field: 'quantity', type: 'number' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('finishing.shipment.title')} subtitle="H-FIN-06" />

      {!mfzCleared && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm font-semibold">
          <span>&#9888;</span>
          <span>{t('finishing.shipment.mfzBlockWarning')}</span>
        </div>
      )}

      <div className="card space-y-4">
        <h3 className="text-base font-semibold text-gray-800">{t('finishing.shipment.register')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {formFields.map(({ label, field, type }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input type={type} value={form[field as keyof typeof form]} onChange={e => handleChange(field, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('finishing.shipment.lot')}</label>
            <select value={form.lot} onChange={e => handleChange('lot', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500">
              {LOT_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRegister}
            disabled={!mfzCleared}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t('finishing.shipment.register')}
          </button>
          <button onClick={handleExport} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            {t('common.exportExcel')}
          </button>
        </div>
      </div>

      <div className="card">
        <MesGrid columns={columns} data={MOCK_DATA} height={380} gridKey="H-FIN-06-grid" />
      </div>
    </div>
  )
}
