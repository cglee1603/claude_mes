import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'
import { exportToCsv } from '../../utils/excel'

interface CartonInspection {
  id: string
  cartonNo: string
  orderNo: string
  quantity: number
  sizeAssortment: string
  packingMethod: string
  sampleQty: number
  defectQty: number
  aqlResult: string
  inspectionDate: string
}

const MOCK_DATA: CartonInspection[] = [
  { id: 'CI-001', cartonNo: 'CTN-A001', orderNo: 'ORD-2024-001', quantity: 12, sizeAssortment: 'S×2/M×4/L×4/XL×2', packingMethod: 'FLAT', sampleQty: 5, defectQty: 0, aqlResult: 'PASS', inspectionDate: '2026-04-17' },
  { id: 'CI-002', cartonNo: 'CTN-A002', orderNo: 'ORD-2024-001', quantity: 12, sizeAssortment: 'S×2/M×4/L×4/XL×2', packingMethod: 'FLAT', sampleQty: 5, defectQty: 2, aqlResult: 'FAIL', inspectionDate: '2026-04-17' },
  { id: 'CI-003', cartonNo: 'CTN-B001', orderNo: 'ORD-2024-002', quantity: 10, sizeAssortment: 'M×5/L×5', packingMethod: 'HANGING', sampleQty: 5, defectQty: 1, aqlResult: 'RE-INSPECT', inspectionDate: '2026-04-16' },
  { id: 'CI-004', cartonNo: 'CTN-B002', orderNo: 'ORD-2024-002', quantity: 10, sizeAssortment: 'M×5/L×5', packingMethod: 'HANGING', sampleQty: 5, defectQty: 0, aqlResult: 'PASS', inspectionDate: '2026-04-16' },
  { id: 'CI-005', cartonNo: 'CTN-C001', orderNo: 'ORD-2024-003', quantity: 8, sizeAssortment: 'S×4/M×4', packingMethod: 'FLAT', sampleQty: 5, defectQty: 0, aqlResult: 'PASS', inspectionDate: '2026-04-15' },
]

export function HFin04Page() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ cartonNo: '', orderNo: '', quantity: '', sizeAssortment: '', packingMethod: 'FLAT', packer: '', sampleQty: '', defectQty: '' })

  const handleChange = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleRegister = () =>
    setForm({ cartonNo: '', orderNo: '', quantity: '', sizeAssortment: '', packingMethod: 'FLAT', packer: '', sampleQty: '', defectQty: '' })

  const handleExport = () => exportToCsv(MOCK_DATA, 'carton-inspect')

  const columns: Column<CartonInspection>[] = [
    { key: 'id', header: 'ID', width: 90 },
    { key: 'cartonNo', header: t('finishing.cartonInspect.cartonNo'), width: 110 },
    { key: 'orderNo', header: t('finishing.cartonInspect.orderNo'), width: 140 },
    { key: 'quantity', header: t('finishing.cartonInspect.quantity'), width: 80 },
    { key: 'sizeAssortment', header: t('finishing.cartonInspect.sizeAssortment'), width: 160 },
    { key: 'packingMethod', header: t('finishing.cartonInspect.packingMethod'), width: 110 },
    {
      key: 'aqlResult', header: t('finishing.cartonInspect.aqlResult'), width: 110,
      render: (row) => <StatusBadge status={row.aqlResult} label={row.aqlResult} />,
    },
    { key: 'inspectionDate', header: t('finishing.cartonInspect.inspectionDate'), width: 120 },
  ]

  const inputFields = [
    { label: t('finishing.cartonInspect.cartonNo'), field: 'cartonNo' },
    { label: t('finishing.cartonInspect.orderNo'), field: 'orderNo' },
    { label: t('finishing.cartonInspect.quantity'), field: 'quantity' },
    { label: t('finishing.cartonInspect.sizeAssortment'), field: 'sizeAssortment' },
    { label: t('finishing.cartonInspect.packer'), field: 'packer' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('finishing.cartonInspect.title')} subtitle="H-FIN-04" />

      <div className="card space-y-4">
        <h3 className="text-base font-semibold text-gray-800">{t('finishing.cartonInspect.register')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {inputFields.map(({ label, field }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input
                type="text"
                value={form[field as keyof typeof form]}
                onChange={e => handleChange(field, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('finishing.cartonInspect.packingMethod')}</label>
            <select
              value={form.packingMethod}
              onChange={e => handleChange('packingMethod', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="FLAT">FLAT</option>
              <option value="HANGING">HANGING</option>
              <option value="FOLDED">FOLDED</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Sample Qty', field: 'sampleQty' },
            { label: 'Defect Qty', field: 'defectQty' },
          ].map(({ label, field }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input type="number" value={form[field as keyof typeof form]} onChange={e => handleChange(field, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={handleRegister} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            {t('finishing.cartonInspect.register')}
          </button>
          <button onClick={handleExport} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            {t('common.exportExcel')}
          </button>
        </div>
      </div>

      <div className="card">
        <MesGrid columns={columns} data={MOCK_DATA} height={380} gridKey="H-FIN-04-grid" />
      </div>
    </div>
  )
}
