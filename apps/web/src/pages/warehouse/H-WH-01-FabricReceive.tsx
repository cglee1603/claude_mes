import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'
import { exportToCsv } from '../../utils/excel'

interface FabricReceiveForm {
  supplier: string
  colorCode: string
  fabricType: string
  rollNo: string
  quantity: string
  width: string
  weight: string
}

interface FabricReceiveRow {
  id: string
  rollNo: string
  supplier: string
  colorCode: string
  fabricType: string
  fourPointScore: number
  inspectionStatus: string
  receivedDate: string
}

const FABRIC_TYPE_OPTIONS = [
  { value: 'Cotton Jersey', label: 'Cotton Jersey' },
  { value: 'Poly Twill', label: 'Poly Twill' },
  { value: 'Linen Blend', label: 'Linen Blend' },
  { value: 'Wool Flannel', label: 'Wool Flannel' },
  { value: 'Cotton Poplin', label: 'Cotton Poplin' },
]

const MOCK_DATA: FabricReceiveRow[] = [
  { id: '1', rollNo: 'ROLL-2026-001', supplier: 'Viet Textile Co.', colorCode: 'NVY-001', fabricType: 'Cotton Jersey', fourPointScore: 28, inspectionStatus: 'PASSED', receivedDate: '2026-04-15' },
  { id: '2', rollNo: 'ROLL-2026-002', supplier: 'Saigon Fabric', colorCode: 'BLK-002', fabricType: 'Poly Twill', fourPointScore: 45, inspectionStatus: 'FAILED', receivedDate: '2026-04-15' },
  { id: '3', rollNo: 'ROLL-2026-003', supplier: 'Hanoi Weaving', colorCode: 'WHT-001', fabricType: 'Linen Blend', fourPointScore: 22, inspectionStatus: 'PASSED', receivedDate: '2026-04-14' },
  { id: '4', rollNo: 'ROLL-2026-004', supplier: 'Viet Textile Co.', colorCode: 'GRY-003', fabricType: 'Wool Flannel', fourPointScore: 35, inspectionStatus: 'PASSED', receivedDate: '2026-04-14' },
  { id: '5', rollNo: 'ROLL-2026-005', supplier: 'Saigon Fabric', colorCode: 'RED-001', fabricType: 'Cotton Poplin', fourPointScore: 52, inspectionStatus: 'FAILED', receivedDate: '2026-04-13' },
]

const INITIAL_FORM: FabricReceiveForm = {
  supplier: '', colorCode: '', fabricType: '', rollNo: '', quantity: '', width: '', weight: '',
}

export function HWH01Page() {
  const { t } = useTranslation()
  const [form, setForm] = useState<FabricReceiveForm>(INITIAL_FORM)

  const handleChange = (field: keyof FabricReceiveForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setForm(INITIAL_FORM)
  }

  const columns: Column<FabricReceiveRow>[] = [
    { key: 'rollNo', header: t('warehouse.fabricReceive.rollNo'), width: 140 },
    { key: 'supplier', header: t('warehouse.fabricReceive.supplier'), width: 160 },
    { key: 'colorCode', header: t('warehouse.fabricReceive.colorCode'), width: 110 },
    { key: 'fabricType', header: t('warehouse.fabricReceive.fabricType'), width: 140 },
    { key: 'fourPointScore', header: t('warehouse.fabricReceive.fourPointScore'), width: 120 },
    {
      key: 'inspectionStatus',
      header: t('warehouse.fabricReceive.inspectionStatus'),
      width: 120,
      render: (row) => (
        <StatusBadge
          status={row.inspectionStatus === 'PASSED' ? 'PASSED_QC' : 'MFZ_HOLD'}
          label={row.inspectionStatus}
        />
      ),
    },
    { key: 'receivedDate', header: t('warehouse.fabricReceive.receivedDate'), width: 120 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('warehouse.fabricReceive.title')}
        subtitle=""
      />

      <div className="card">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="label">{t('warehouse.fabricReceive.rollNo')}</label>
            <input type="text" className="input-field" value={form.rollNo} onChange={(e) => handleChange('rollNo', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('warehouse.fabricReceive.supplier')}</label>
            <input type="text" className="input-field" value={form.supplier} onChange={(e) => handleChange('supplier', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('warehouse.fabricReceive.colorCode')}</label>
            <input type="text" className="input-field" value={form.colorCode} onChange={(e) => handleChange('colorCode', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('warehouse.fabricReceive.fabricType')}</label>
            <select className="input-field" value={form.fabricType} onChange={(e) => handleChange('fabricType', e.target.value)}>
              <option value="">{t('common.select')}</option>
              {FABRIC_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t('warehouse.fabricReceive.quantity')}</label>
            <input type="number" className="input-field" value={form.quantity} onChange={(e) => handleChange('quantity', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('warehouse.fabricReceive.width')}</label>
            <input type="number" className="input-field" value={form.width} onChange={(e) => handleChange('width', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('warehouse.fabricReceive.weight')}</label>
            <input type="number" className="input-field" value={form.weight} onChange={(e) => handleChange('weight', e.target.value)} />
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setForm(INITIAL_FORM)}>{t('common.reset')}</button>
            <button type="submit" className="btn-primary">{t('warehouse.fabricReceive.register')}</button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('warehouse.fabricReceive.title')}</h2>
          <button
            className="btn-secondary text-sm"
            onClick={() => exportToCsv(MOCK_DATA, 'fabric-receive')}
          >
            {t('common.exportExcel')}
          </button>
        </div>
        <MesGrid<FabricReceiveRow> columns={columns} data={MOCK_DATA} gridKey="HWH01-grid" />
      </div>
    </div>
  )
}
