import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'

interface PrintForm {
  rollNo: string
  printer: string
  copies: string
}

interface PrintHistoryRow {
  id: string
  rollNo: string
  labelType: string
  printTime: string
  printedBy: string
  status: string
}

const PRINTER_OPTIONS = [
  { value: 'ZPL-01', label: 'ZPL Printer #1 (Zebra GX430t)' },
  { value: 'ZPL-02', label: 'ZPL Printer #2 (Zebra ZD420)' },
  { value: 'HTML-FB', label: 'HTML Fallback (A4)' },
]

const MOCK_DATA: PrintHistoryRow[] = [
  { id: '1', rollNo: 'ROLL-2026-001', labelType: 'ROLL_LABEL', printTime: '2026-04-15 09:12', printedBy: 'Nguyen Van A', status: 'PRINTED' },
  { id: '2', rollNo: 'ROLL-2026-002', labelType: 'ROLL_LABEL', printTime: '2026-04-15 09:25', printedBy: 'Nguyen Van A', status: 'PRINTED' },
  { id: '3', rollNo: 'ROLL-2026-003', labelType: 'ROLL_LABEL', printTime: '2026-04-14 14:05', printedBy: 'Tran Thi B', status: 'FAILED' },
  { id: '4', rollNo: 'ROLL-2026-004', labelType: 'ROLL_LABEL', printTime: '2026-04-14 14:30', printedBy: 'Tran Thi B', status: 'PRINTED' },
]

const INITIAL_FORM: PrintForm = { rollNo: '', printer: 'ZPL-01', copies: '1' }

export function HPrint01Page() {
  const { t } = useTranslation()
  const [form, setForm] = useState<PrintForm>(INITIAL_FORM)
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false)

  const handleChange = (field: keyof PrintForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const checkDuplicate = (rollNo: string) =>
    MOCK_DATA.some((r) => r.rollNo === rollNo && r.status === 'PRINTED')

  const handlePrint = (e: React.FormEvent) => {
    e.preventDefault()
    if (checkDuplicate(form.rollNo)) {
      setShowDuplicateWarning(true)
      return
    }
    setForm(INITIAL_FORM)
  }

  const handleConfirmPrint = () => {
    setShowDuplicateWarning(false)
    setForm(INITIAL_FORM)
  }

  const columns: Column<PrintHistoryRow>[] = [
    { key: 'rollNo', header: t('print.rollLabel.rollNo'), width: 140 },
    { key: 'labelType', header: t('common.labelType'), width: 120 },
    { key: 'printTime', header: t('print.rollLabel.printTime'), width: 150 },
    { key: 'printedBy', header: t('print.rollLabel.printedBy'), width: 140 },
    {
      key: 'status',
      header: t('print.rollLabel.status'),
      width: 100,
      render: (row) => (
        <StatusBadge
          status={row.status === 'PRINTED' ? 'PASSED_QC' : 'MFZ_HOLD'}
          label={row.status}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('print.rollLabel.title')} subtitle="" />

      <div className="card">
        <form onSubmit={handlePrint} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">{t('print.rollLabel.rollNo')}</label>
            <input type="text" className="input-field" value={form.rollNo} onChange={(e) => handleChange('rollNo', e.target.value)} required />
          </div>
          <div>
            <label className="label">{t('print.rollLabel.printer')}</label>
            <select className="input-field" value={form.printer} onChange={(e) => handleChange('printer', e.target.value)}>
              {PRINTER_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t('print.rollLabel.copies')}</label>
            <input type="number" min="1" max="10" className="input-field" value={form.copies} onChange={(e) => handleChange('copies', e.target.value)} />
          </div>
          <div className="md:col-span-3 flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setForm(INITIAL_FORM)}>{t('common.reset')}</button>
            <button type="submit" className="btn-primary">{t('print.rollLabel.print')}</button>
          </div>
        </form>
      </div>

      {showDuplicateWarning && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <p className="text-sm text-gray-700 mb-4">{t('print.rollLabel.duplicateWarning')}</p>
            <div className="flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setShowDuplicateWarning(false)}>{t('common.cancel')}</button>
              <button className="btn-primary" onClick={handleConfirmPrint}>{t('print.rollLabel.print')}</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('print.rollLabel.history')}</h2>
        <MesGrid<PrintHistoryRow> columns={columns} data={MOCK_DATA} gridKey="HPrint01-grid" />
      </div>
    </div>
  )
}
