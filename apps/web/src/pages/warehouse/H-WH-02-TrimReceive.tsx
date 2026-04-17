import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'
import { exportToCsv } from '../../utils/excel'

interface TrimReceiveForm {
  trimCode: string
  trimName: string
  supplier: string
  quantity: string
  unit: string
  poNo: string
}

interface TrimReceiveRow {
  id: string
  trimCode: string
  trimName: string
  supplier: string
  quantity: number
  unit: string
  inspectionStatus: string
  receivedDate: string
}

const UNIT_OPTIONS = ['PCS', 'ROLL', 'YARD', 'MTR', 'SET']

const MOCK_DATA: TrimReceiveRow[] = [
  { id: '1', trimCode: 'TRM-ZIP-001', trimName: 'YKK Zipper 20cm', supplier: 'YKK Vietnam', quantity: 500, unit: 'PCS', inspectionStatus: 'PASSED', receivedDate: '2026-04-15' },
  { id: '2', trimCode: 'TRM-BTN-002', trimName: 'Button 2-hole 15mm', supplier: 'Dong A Button', quantity: 2000, unit: 'PCS', inspectionStatus: 'PASSED', receivedDate: '2026-04-15' },
  { id: '3', trimCode: 'TRM-INT-003', trimName: 'Interlining 100gsm', supplier: 'Hanoi Trim', quantity: 200, unit: 'MTR', inspectionStatus: 'PASSED', receivedDate: '2026-04-14' },
  { id: '4', trimCode: 'TRM-RBN-004', trimName: 'Ribbon 1.5cm Black', supplier: 'Saigon Trim', quantity: 300, unit: 'YARD', inspectionStatus: 'FAILED', receivedDate: '2026-04-14' },
  { id: '5', trimCode: 'TRM-LBL-005', trimName: 'Main Label Woven', supplier: 'Label Pro VN', quantity: 1000, unit: 'PCS', inspectionStatus: 'PASSED', receivedDate: '2026-04-13' },
]

const INITIAL_FORM: TrimReceiveForm = {
  trimCode: '', trimName: '', supplier: '', quantity: '', unit: 'PCS', poNo: '',
}

export function HWH02Page() {
  const { t } = useTranslation()
  const [form, setForm] = useState<TrimReceiveForm>(INITIAL_FORM)

  const handleChange = (field: keyof TrimReceiveForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setForm(INITIAL_FORM)
  }

  const columns: Column<TrimReceiveRow>[] = [
    { key: 'trimCode', header: t('warehouse.trimReceive.trimCode'), width: 130 },
    { key: 'trimName', header: t('warehouse.trimReceive.trimName'), width: 180 },
    { key: 'supplier', header: t('warehouse.trimReceive.supplier'), width: 150 },
    { key: 'quantity', header: t('warehouse.trimReceive.quantity'), width: 90 },
    { key: 'unit', header: t('warehouse.trimReceive.unit'), width: 80 },
    {
      key: 'inspectionStatus',
      header: t('warehouse.trimReceive.inspectionStatus'),
      width: 120,
      render: (row) => (
        <StatusBadge
          status={row.inspectionStatus === 'PASSED' ? 'PASSED_QC' : 'MFZ_HOLD'}
          label={row.inspectionStatus}
        />
      ),
    },
    { key: 'receivedDate', header: t('warehouse.trimReceive.receivedDate'), width: 120 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('warehouse.trimReceive.title')} subtitle="" />

      <div className="card">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="label">{t('warehouse.trimReceive.trimCode')}</label>
            <input type="text" className="input-field" value={form.trimCode} onChange={(e) => handleChange('trimCode', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('warehouse.trimReceive.trimName')}</label>
            <input type="text" className="input-field" value={form.trimName} onChange={(e) => handleChange('trimName', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('warehouse.trimReceive.supplier')}</label>
            <input type="text" className="input-field" value={form.supplier} onChange={(e) => handleChange('supplier', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('warehouse.trimReceive.poNo')}</label>
            <input type="text" className="input-field" value={form.poNo} onChange={(e) => handleChange('poNo', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('warehouse.trimReceive.quantity')}</label>
            <input type="number" className="input-field" value={form.quantity} onChange={(e) => handleChange('quantity', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('warehouse.trimReceive.unit')}</label>
            <select className="input-field" value={form.unit} onChange={(e) => handleChange('unit', e.target.value)}>
              {UNIT_OPTIONS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setForm(INITIAL_FORM)}>{t('common.reset')}</button>
            <button type="submit" className="btn-primary">{t('warehouse.trimReceive.register')}</button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('warehouse.trimReceive.title')}</h2>
          <button className="btn-secondary text-sm" onClick={() => exportToCsv(MOCK_DATA, 'trim-receive')}>
            {t('common.exportExcel')}
          </button>
        </div>
        <MesGrid<TrimReceiveRow> columns={columns} data={MOCK_DATA} gridKey="HWH02-grid" />
      </div>
    </div>
  )
}
