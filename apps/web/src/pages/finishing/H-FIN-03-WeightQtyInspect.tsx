import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { exportToCsv } from '../../utils/excel'

interface WeightInspection {
  id: string
  cartonNo: string
  orderNo: string
  standardQty: number
  actualQty: number
  standardWeight: number
  actualWeight: number
  deviation: number
  judgement: string
}

function calcDeviation(actual: number, standard: number): number {
  if (standard === 0) return 0
  return Math.round(((actual - standard) / standard) * 1000) / 10
}

const MOCK_DATA: WeightInspection[] = [
  { id: 'WI-001', cartonNo: 'CTN-001', orderNo: 'ORD-2024-001', standardQty: 12, actualQty: 12, standardWeight: 6.5, actualWeight: 6.4, deviation: calcDeviation(6.4, 6.5), judgement: 'PASS' },
  { id: 'WI-002', cartonNo: 'CTN-002', orderNo: 'ORD-2024-001', standardQty: 12, actualQty: 11, standardWeight: 6.5, actualWeight: 6.0, deviation: calcDeviation(6.0, 6.5), judgement: 'FAIL' },
  { id: 'WI-003', cartonNo: 'CTN-003', orderNo: 'ORD-2024-002', standardQty: 10, actualQty: 10, standardWeight: 7.2, actualWeight: 7.5, deviation: calcDeviation(7.5, 7.2), judgement: 'FAIL' },
  { id: 'WI-004', cartonNo: 'CTN-004', orderNo: 'ORD-2024-002', standardQty: 10, actualQty: 10, standardWeight: 7.2, actualWeight: 7.1, deviation: calcDeviation(7.1, 7.2), judgement: 'PASS' },
  { id: 'WI-005', cartonNo: 'CTN-005', orderNo: 'ORD-2024-003', standardQty: 8, actualQty: 8, standardWeight: 5.0, actualWeight: 5.1, deviation: calcDeviation(5.1, 5.0), judgement: 'PASS' },
  { id: 'WI-006', cartonNo: 'CTN-006', orderNo: 'ORD-2024-003', standardQty: 8, actualQty: 8, standardWeight: 5.0, actualWeight: 4.6, deviation: calcDeviation(4.6, 5.0), judgement: 'FAIL' },
]

const DEVIATION_THRESHOLD = 5

export function HFin03Page() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ styleCode: '', orderNo: '', cartonNo: '', actualQty: '', actualWeight: '', standardQty: '', standardWeight: '' })

  const handleChange = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleRegister = () =>
    setForm({ styleCode: '', orderNo: '', cartonNo: '', actualQty: '', actualWeight: '', standardQty: '', standardWeight: '' })

  const handleExport = () => exportToCsv(MOCK_DATA, 'weight-qty-inspect')

  const columns: Column<WeightInspection>[] = [
    { key: 'id', header: t('finishing.weightInspect.inspectionId'), width: 100 },
    { key: 'cartonNo', header: t('finishing.weightInspect.cartonNo'), width: 110 },
    { key: 'orderNo', header: t('finishing.weightInspect.orderNo'), width: 140 },
    { key: 'standardQty', header: t('finishing.weightInspect.standardQty'), width: 100 },
    { key: 'actualQty', header: t('finishing.weightInspect.actualQty'), width: 100 },
    { key: 'standardWeight', header: t('finishing.weightInspect.standardWeight'), width: 130 },
    { key: 'actualWeight', header: t('finishing.weightInspect.actualWeight'), width: 130 },
    {
      key: 'deviation', header: t('finishing.weightInspect.deviation'), width: 100,
      render: (row) => (
        <span className={Math.abs(row.deviation) > DEVIATION_THRESHOLD ? 'text-red-600 font-semibold' : 'text-gray-800'}>
          {row.deviation > 0 ? `+${row.deviation}` : row.deviation}%
        </span>
      ),
    },
    {
      key: 'judgement', header: t('finishing.weightInspect.judgement'), width: 90,
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${row.judgement === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {row.judgement}
        </span>
      ),
    },
  ]

  const fields = [
    { label: t('finishing.weightInspect.cartonNo'), field: 'cartonNo' },
    { label: t('finishing.weightInspect.orderNo'), field: 'orderNo' },
    { label: t('finishing.weightInspect.standardQty'), field: 'standardQty' },
    { label: t('finishing.weightInspect.actualQty'), field: 'actualQty' },
    { label: t('finishing.weightInspect.standardWeight'), field: 'standardWeight' },
    { label: t('finishing.weightInspect.actualWeight'), field: 'actualWeight' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('finishing.weightInspect.title')} subtitle="H-FIN-03" />

      <div className="card space-y-4">
        <h3 className="text-base font-semibold text-gray-800">{t('finishing.weightInspect.register')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {fields.map(({ label, field }) => (
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
        </div>
        <div className="flex gap-3">
          <button onClick={handleRegister} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            {t('finishing.weightInspect.register')}
          </button>
          <button onClick={handleExport} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            {t('common.exportExcel')}
          </button>
        </div>
      </div>

      <div className="card">
        <MesGrid columns={columns} data={MOCK_DATA} height={420} gridKey="H-FIN-03-grid" />
      </div>
    </div>
  )
}
