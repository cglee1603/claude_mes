import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'
import { exportToCsv } from '../../utils/excel'

interface HangtagInspection {
  id: string
  styleCode: string
  orderNo: string
  aqlLevel: string
  sampleQty: number
  defectQty: number
  defectType: string
  aqlResult: string
  inspector: string
  date: string
}

const MOCK_DATA: HangtagInspection[] = [
  { id: 'HI-001', styleCode: 'STY-NK-001', orderNo: 'ORD-2024-001', aqlLevel: 'II', sampleQty: 125, defectQty: 2, defectType: 'Label misattached', aqlResult: 'PASS', inspector: 'Nguyen A', date: '2026-04-17' },
  { id: 'HI-002', styleCode: 'STY-ZR-010', orderNo: 'ORD-2024-002', aqlLevel: 'II', sampleQty: 200, defectQty: 8, defectType: 'Hangtag missing', aqlResult: 'FAIL', inspector: 'Tran B', date: '2026-04-17' },
  { id: 'HI-003', styleCode: 'STY-NK-002', orderNo: 'ORD-2024-003', aqlLevel: 'I', sampleQty: 80, defectQty: 1, defectType: 'Size mismatch', aqlResult: 'CONDITIONAL', inspector: 'Le C', date: '2026-04-16' },
  { id: 'HI-004', styleCode: 'STY-HM-005', orderNo: 'ORD-2024-004', aqlLevel: 'II', sampleQty: 150, defectQty: 0, defectType: '-', aqlResult: 'PASS', inspector: 'Pham D', date: '2026-04-16' },
  { id: 'HI-005', styleCode: 'STY-NK-003', orderNo: 'ORD-2024-005', aqlLevel: 'II', sampleQty: 200, defectQty: 3, defectType: 'Care label error', aqlResult: 'PASS', inspector: 'Nguyen A', date: '2026-04-15' },
]

export function HFin01Page() {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    styleCode: '', orderNo: '', aqlLevel: 'II',
    sampleQty: '', defectQty: '', defectType: '',
  })

  const handleChange = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleRegister = () => setForm({ styleCode: '', orderNo: '', aqlLevel: 'II', sampleQty: '', defectQty: '', defectType: '' })

  const handleExport = () => exportToCsv(MOCK_DATA, 'hangtag-inspect')

  const columns: Column<HangtagInspection>[] = [
    { key: 'id', header: t('finishing.hangtagInspect.inspectionId'), width: 100 },
    { key: 'styleCode', header: t('finishing.hangtagInspect.styleCode'), width: 120 },
    { key: 'orderNo', header: t('finishing.hangtagInspect.orderNo'), width: 140 },
    { key: 'aqlLevel', header: t('finishing.hangtagInspect.aqlLevel'), width: 90 },
    { key: 'sampleQty', header: t('finishing.hangtagInspect.sampleQty'), width: 100 },
    { key: 'defectQty', header: t('finishing.hangtagInspect.defectQty'), width: 100 },
    { key: 'defectType', header: t('finishing.hangtagInspect.defectType'), width: 140 },
    {
      key: 'aqlResult', header: t('finishing.hangtagInspect.aqlResult'), width: 110,
      render: (row) => <StatusBadge status={row.aqlResult} label={row.aqlResult} />,
    },
    { key: 'inspector', header: t('finishing.hangtagInspect.inspector'), width: 110 },
    { key: 'date', header: t('finishing.hangtagInspect.date'), width: 110 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('finishing.hangtagInspect.title')} subtitle="H-FIN-01" />

      <div className="card space-y-4">
        <h3 className="text-base font-semibold text-gray-800">{t('finishing.hangtagInspect.register')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: t('finishing.hangtagInspect.styleCode'), field: 'styleCode', type: 'text' },
            { label: t('finishing.hangtagInspect.orderNo'), field: 'orderNo', type: 'text' },
            { label: t('finishing.hangtagInspect.sampleQty'), field: 'sampleQty', type: 'number' },
            { label: t('finishing.hangtagInspect.defectQty'), field: 'defectQty', type: 'number' },
            { label: t('finishing.hangtagInspect.defectType'), field: 'defectType', type: 'text' },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input
                type={type}
                value={form[field as keyof typeof form]}
                onChange={e => handleChange(field, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('finishing.hangtagInspect.aqlLevel')}</label>
            <select
              value={form.aqlLevel}
              onChange={e => handleChange('aqlLevel', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 outline-none"
            >
              {['I', 'II', 'III'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleRegister} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            {t('finishing.hangtagInspect.register')}
          </button>
          <button onClick={handleExport} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            {t('common.exportExcel')}
          </button>
        </div>
      </div>

      <div className="card">
        <MesGrid columns={columns} data={MOCK_DATA} height={380} gridKey="H-FIN-01-grid" />
      </div>
    </div>
  )
}
