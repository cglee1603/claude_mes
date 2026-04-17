import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'
import { exportToCsv } from '../../utils/excel'

interface IssueVoucherForm {
  recipient: string
  orderNo: string
  issueDate: string
  remark: string
}

interface VoucherRow {
  id: string
  voucherNo: string
  recipient: string
  orderNo: string
  issueDate: string
  itemCount: number
  status: string
}

const RECIPIENT_OPTIONS = [
  { value: 'CUTTING-1', label: 'Cutting Team 1' },
  { value: 'CUTTING-2', label: 'Cutting Team 2' },
  { value: 'SEW-LINE-1', label: 'Sewing Line 1' },
  { value: 'SEW-LINE-2', label: 'Sewing Line 2' },
  { value: 'SEW-LINE-3', label: 'Sewing Line 3' },
]

const MOCK_DATA: VoucherRow[] = [
  { id: '1', voucherNo: 'VCH-2026-001', recipient: 'Cutting Team 1', orderNo: 'ORD-2026-041', issueDate: '2026-04-15', itemCount: 3, status: 'CONFIRMED' },
  { id: '2', voucherNo: 'VCH-2026-002', recipient: 'Sewing Line 2', orderNo: 'ORD-2026-042', issueDate: '2026-04-15', itemCount: 5, status: 'ISSUED' },
  { id: '3', voucherNo: 'VCH-2026-003', recipient: 'Cutting Team 2', orderNo: 'ORD-2026-040', issueDate: '2026-04-14', itemCount: 2, status: 'CONFIRMED' },
  { id: '4', voucherNo: 'VCH-2026-004', recipient: 'Sewing Line 1', orderNo: 'ORD-2026-039', issueDate: '2026-04-13', itemCount: 4, status: 'DRAFT' },
]

const INITIAL_FORM: IssueVoucherForm = {
  recipient: '', orderNo: '', issueDate: '', remark: '',
}

const VOUCHER_STATUS_MAP: Record<string, string> = {
  DRAFT: 'CUTTING',
  ISSUED: 'QC',
  CONFIRMED: 'PASSED_QC',
}

export function HWH03Page() {
  const { t } = useTranslation()
  const [form, setForm] = useState<IssueVoucherForm>(INITIAL_FORM)

  const handleChange = (field: keyof IssueVoucherForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setForm(INITIAL_FORM)
  }

  const columns: Column<VoucherRow>[] = [
    { key: 'voucherNo', header: t('warehouse.issueVoucher.voucherNo'), width: 140 },
    { key: 'recipient', header: t('warehouse.issueVoucher.recipient'), width: 130 },
    { key: 'orderNo', header: t('warehouse.issueVoucher.orderNo'), width: 140 },
    { key: 'issueDate', header: t('warehouse.issueVoucher.issueDate'), width: 120 },
    { key: 'itemCount', header: t('warehouse.issueVoucher.itemCount'), width: 90 },
    {
      key: 'status',
      header: t('warehouse.issueVoucher.status'),
      width: 110,
      render: (row) => (
        <StatusBadge status={VOUCHER_STATUS_MAP[row.status] ?? row.status} label={row.status} />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('warehouse.issueVoucher.title')} subtitle="" />

      <div className="card">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="label">{t('warehouse.issueVoucher.recipient')}</label>
            <select className="input-field" value={form.recipient} onChange={(e) => handleChange('recipient', e.target.value)}>
              <option value="">{t('common.select')}</option>
              {RECIPIENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t('warehouse.issueVoucher.orderNo')}</label>
            <input type="text" className="input-field" value={form.orderNo} onChange={(e) => handleChange('orderNo', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('warehouse.issueVoucher.issueDate')}</label>
            <input type="date" className="input-field" value={form.issueDate} onChange={(e) => handleChange('issueDate', e.target.value)} />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="label">{t('common.remark')}</label>
            <input type="text" className="input-field" value={form.remark} onChange={(e) => handleChange('remark', e.target.value)} />
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setForm(INITIAL_FORM)}>{t('common.reset')}</button>
            <button type="submit" className="btn-primary">{t('warehouse.issueVoucher.issue')}</button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('warehouse.issueVoucher.title')}</h2>
          <button className="btn-secondary text-sm" onClick={() => exportToCsv(MOCK_DATA, 'issue-voucher')}>
            {t('common.exportExcel')}
          </button>
        </div>
        <MesGrid<VoucherRow> columns={columns} data={MOCK_DATA} gridKey="HWH03-grid" />
      </div>
    </div>
  )
}
