import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'

interface ReceiveFormData {
  rollNo: string
  supplier: string
  materialCode: string
  colorCode: string
  weight: string
  width: string
}

interface ReceiptRow {
  id: string
  rollNo: string
  supplier: string
  materialCode: string
  colorCode: string
  weight: number
  width: number
  receivedDate: string
  status: string
}

const MATERIAL_OPTIONS = [
  { value: 'MAT-CTN-001', label: 'Cotton Jersey 180gsm' },
  { value: 'MAT-PLY-002', label: 'Poly Twill 220gsm' },
  { value: 'MAT-LIN-003', label: 'Linen Blend 160gsm' },
  { value: 'MAT-WOL-004', label: 'Wool Flannel 300gsm' },
  { value: 'MAT-CTN-005', label: 'Cotton Poplin 120gsm' },
]

const MOCK_RECEIPTS: ReceiptRow[] = [
  { id: '1', rollNo: 'ROLL-2026-0401', supplier: 'Viet Textile Co.', materialCode: 'MAT-CTN-001', colorCode: 'NVY-001', weight: 45.2, width: 150, receivedDate: '2026-04-10', status: 'ACTIVE' },
  { id: '2', rollNo: 'ROLL-2026-0402', supplier: 'Saigon Fabric', materialCode: 'MAT-PLY-002', colorCode: 'BLK-002', weight: 52.8, width: 145, receivedDate: '2026-04-10', status: 'ACTIVE' },
  { id: '3', rollNo: 'ROLL-2026-0403', supplier: 'Hanoi Weaving', materialCode: 'MAT-LIN-003', colorCode: 'WHT-001', weight: 38.5, width: 140, receivedDate: '2026-04-09', status: 'ACTIVE' },
  { id: '4', rollNo: 'ROLL-2026-0404', supplier: 'Viet Textile Co.', materialCode: 'MAT-WOL-004', colorCode: 'GRY-003', weight: 60.1, width: 155, receivedDate: '2026-04-09', status: 'ARCHIVED' },
  { id: '5', rollNo: 'ROLL-2026-0405', supplier: 'Saigon Fabric', materialCode: 'MAT-CTN-005', colorCode: 'RED-001', weight: 42.0, width: 150, receivedDate: '2026-04-08', status: 'ACTIVE' },
]

const INITIAL_FORM: ReceiveFormData = {
  rollNo: '',
  supplier: '',
  materialCode: '',
  colorCode: '',
  weight: '',
  width: '',
}

export function WH01ReceivePage() {
  const { t } = useTranslation()
  const [form, setForm] = useState<ReceiveFormData>(INITIAL_FORM)

  const handleChange = (field: keyof ReceiveFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setForm(INITIAL_FORM)
  }

  const columns: Column<ReceiptRow>[] = [
    { key: 'rollNo', header: t('warehouse.receive.rollNo') },
    { key: 'supplier', header: t('warehouse.receive.supplier') },
    { key: 'materialCode', header: t('warehouse.receive.materialCode') },
    { key: 'colorCode', header: t('warehouse.receive.colorCode') },
    { key: 'weight', header: t('warehouse.receive.weight') },
    { key: 'width', header: t('warehouse.receive.width') },
    { key: 'receivedDate', header: t('warehouse.history.receivedDate') },
    {
      key: 'status',
      header: t('common.status'),
      render: (row) => <StatusBadge status={row.status} label={t(`status.${row.status}`)} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('warehouse.receive.title')}
        subtitle={t('warehouse.receive.subtitle')}
      />

      <div className="card">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="label">{t('warehouse.receive.rollNo')}</label>
            <input
              type="text"
              className="input-field"
              value={form.rollNo}
              onChange={(e) => handleChange('rollNo', e.target.value)}
            />
          </div>
          <div>
            <label className="label">{t('warehouse.receive.supplier')}</label>
            <input
              type="text"
              className="input-field"
              value={form.supplier}
              onChange={(e) => handleChange('supplier', e.target.value)}
            />
          </div>
          <div>
            <label className="label">{t('warehouse.receive.materialCode')}</label>
            <select
              className="input-field"
              value={form.materialCode}
              onChange={(e) => handleChange('materialCode', e.target.value)}
            >
              <option value="">{t('common.all')}</option>
              {MATERIAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t('warehouse.receive.colorCode')}</label>
            <input
              type="text"
              className="input-field"
              value={form.colorCode}
              onChange={(e) => handleChange('colorCode', e.target.value)}
            />
          </div>
          <div>
            <label className="label">{t('warehouse.receive.weight')}</label>
            <input
              type="number"
              className="input-field"
              value={form.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
            />
          </div>
          <div>
            <label className="label">{t('warehouse.receive.width')}</label>
            <input
              type="number"
              className="input-field"
              value={form.width}
              onChange={(e) => handleChange('width', e.target.value)}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setForm(INITIAL_FORM)}>
              {t('common.reset')}
            </button>
            <button type="submit" className="btn-primary">
              {t('warehouse.receive.register')}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('warehouse.receive.recentReceipts')}
        </h2>
        <MesGrid<ReceiptRow> columns={columns} data={MOCK_RECEIPTS} />
      </div>
    </div>
  )
}
