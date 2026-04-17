import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'

interface BundlePrintForm {
  bundleNo: string
  printer: string
  copies: string
}

interface BundlePrintHistoryRow {
  id: string
  bundleNo: string
  lotNo: string
  colorCode: string
  printTime: string
  printedBy: string
  status: string
}

const PRINTER_OPTIONS = [
  { value: 'ZPL-01', label: 'ZPL Printer #1 (Zebra GX430t)' },
  { value: 'ZPL-02', label: 'ZPL Printer #2 (Zebra ZD420)' },
  { value: 'HTML-FB', label: 'HTML Fallback (A4)' },
]

const MOCK_DATA: BundlePrintHistoryRow[] = [
  { id: '1', bundleNo: 'BDL-2026-001', lotNo: 'ORD-2026-039-L001', colorCode: 'NVY-001', printTime: '2026-04-15 10:05', printedBy: 'Le Van C', status: 'PRINTED' },
  { id: '2', bundleNo: 'BDL-2026-002', lotNo: 'ORD-2026-039-L001', colorCode: 'NVY-001', printTime: '2026-04-15 10:08', printedBy: 'Le Van C', status: 'PRINTED' },
  { id: '3', bundleNo: 'BDL-2026-003', lotNo: 'ORD-2026-040-L001', colorCode: 'BLK-002', printTime: '2026-04-14 15:12', printedBy: 'Pham Thi D', status: 'FAILED' },
  { id: '4', bundleNo: 'BDL-2026-004', lotNo: 'ORD-2026-040-L001', colorCode: 'BLK-002', printTime: '2026-04-14 15:20', printedBy: 'Pham Thi D', status: 'PRINTED' },
  { id: '5', bundleNo: 'BDL-2026-005', lotNo: 'ORD-2026-041-L001', colorCode: 'WHT-001', printTime: '2026-04-13 11:00', printedBy: 'Nguyen Van A', status: 'PRINTED' },
]

const INITIAL_FORM: BundlePrintForm = { bundleNo: '', printer: 'ZPL-01', copies: '1' }

export function HPrint02Page() {
  const { t } = useTranslation()
  const [form, setForm] = useState<BundlePrintForm>(INITIAL_FORM)
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false)

  const handleChange = (field: keyof BundlePrintForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const checkDuplicate = (bundleNo: string) =>
    MOCK_DATA.some((r) => r.bundleNo === bundleNo && r.status === 'PRINTED')

  const handlePrint = (e: React.FormEvent) => {
    e.preventDefault()
    if (checkDuplicate(form.bundleNo)) {
      setShowDuplicateWarning(true)
      return
    }
    setForm(INITIAL_FORM)
  }

  const handleConfirmPrint = () => {
    setShowDuplicateWarning(false)
    setForm(INITIAL_FORM)
  }

  const columns: Column<BundlePrintHistoryRow>[] = [
    { key: 'bundleNo', header: t('print.bundleLabel.bundleNo'), width: 140 },
    { key: 'lotNo', header: t('print.bundleLabel.lotNo'), width: 170 },
    { key: 'colorCode', header: t('print.bundleLabel.colorCode'), width: 110 },
    { key: 'printTime', header: t('print.bundleLabel.printTime'), width: 150 },
    { key: 'printedBy', header: t('print.bundleLabel.printedBy'), width: 140 },
    {
      key: 'status',
      header: t('print.bundleLabel.status'),
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
      <PageHeader title={t('print.bundleLabel.title')} subtitle="" />

      <div className="card">
        <form onSubmit={handlePrint} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">{t('print.bundleLabel.bundleNo')}</label>
            <input type="text" className="input-field" value={form.bundleNo} onChange={(e) => handleChange('bundleNo', e.target.value)} required />
          </div>
          <div>
            <label className="label">{t('print.bundleLabel.printer')}</label>
            <select className="input-field" value={form.printer} onChange={(e) => handleChange('printer', e.target.value)}>
              {PRINTER_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t('print.bundleLabel.copies')}</label>
            <input type="number" min="1" max="10" className="input-field" value={form.copies} onChange={(e) => handleChange('copies', e.target.value)} />
          </div>
          <div className="md:col-span-3 flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setForm(INITIAL_FORM)}>{t('common.reset')}</button>
            <button type="submit" className="btn-primary">{t('print.bundleLabel.print')}</button>
          </div>
        </form>
      </div>

      {showDuplicateWarning && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <p className="text-sm text-gray-700 mb-4">{t('print.bundleLabel.duplicateWarning')}</p>
            <div className="flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setShowDuplicateWarning(false)}>{t('common.cancel')}</button>
              <button className="btn-primary" onClick={handleConfirmPrint}>{t('print.bundleLabel.print')}</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('print.bundleLabel.history')}</h2>
        <MesGrid<BundlePrintHistoryRow> columns={columns} data={MOCK_DATA} gridKey="HPrint02-grid" />
      </div>
    </div>
  )
}
