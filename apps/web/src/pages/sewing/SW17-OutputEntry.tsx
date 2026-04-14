import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, type Column } from '@/components/common/DataTable'

interface OutputEntry {
  id: string
  lineId: string
  lineCode: string
  lotId: string
  lotNo: string
  periodStart: string
  periodEnd: string
  outputQty: number
  defectQty: number
  workerId: string | null
  lineManagerId: string
  lineManagerName: string
  createdAt: string
}

interface FormState {
  lineId: string
  lotId: string
  periodStart: string
  periodEnd: string
  outputQty: string
  defectQty: string
  workerId: string
  lineManagerId: string
}

const LINE_OPTIONS = [
  { id: 'line-1', code: 'LINE-A' },
  { id: 'line-2', code: 'LINE-B' },
  { id: 'line-3', code: 'LINE-C' },
  { id: 'line-4', code: 'LINE-D' },
]

const LOT_OPTIONS = [
  { id: 'lot-1', lotNo: 'ORD-2024-001-L001' },
  { id: 'lot-2', lotNo: 'ORD-2024-001-L002' },
  { id: 'lot-3', lotNo: 'ORD-2024-002-L001' },
]

const MANAGER_OPTIONS = [
  { id: 'mgr-1', name: 'Kim J.' },
  { id: 'mgr-2', name: 'Park S.' },
]

const MOCK_ENTRIES: OutputEntry[] = [
  { id: 'out-1', lineId: 'line-1', lineCode: 'LINE-A', lotId: 'lot-1', lotNo: 'ORD-2024-001-L001', periodStart: '2026-04-10T08:00', periodEnd: '2026-04-10T10:00', outputQty: 120, defectQty: 3, workerId: null, lineManagerId: 'mgr-1', lineManagerName: 'Kim J.', createdAt: '2026-04-10T10:05' },
  { id: 'out-2', lineId: 'line-2', lineCode: 'LINE-B', lotId: 'lot-2', lotNo: 'ORD-2024-001-L002', periodStart: '2026-04-10T08:00', periodEnd: '2026-04-10T10:00', outputQty: 95, defectQty: 5, workerId: 'wk-01', lineManagerId: 'mgr-2', lineManagerName: 'Park S.', createdAt: '2026-04-10T10:08' },
  { id: 'out-3', lineId: 'line-1', lineCode: 'LINE-A', lotId: 'lot-1', lotNo: 'ORD-2024-001-L001', periodStart: '2026-04-10T10:00', periodEnd: '2026-04-10T12:00', outputQty: 135, defectQty: 2, workerId: null, lineManagerId: 'mgr-1', lineManagerName: 'Kim J.', createdAt: '2026-04-10T12:03' },
]

const INITIAL_FORM: FormState = {
  lineId: '',
  lotId: '',
  periodStart: '',
  periodEnd: '',
  outputQty: '',
  defectQty: '',
  workerId: '',
  lineManagerId: '',
}

export function SW17OutputEntryPage() {
  const { t } = useTranslation()
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [entries, setEntries] = useState<OutputEntry[]>(MOCK_ENTRIES)

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const lineOpt = LINE_OPTIONS.find((l) => l.id === form.lineId)
    const lotOpt = LOT_OPTIONS.find((l) => l.id === form.lotId)
    const mgrOpt = MANAGER_OPTIONS.find((m) => m.id === form.lineManagerId)
    if (!lineOpt || !lotOpt || !mgrOpt) return

    const newEntry: OutputEntry = {
      id: `out-${Date.now()}`,
      lineId: form.lineId,
      lineCode: lineOpt.code,
      lotId: form.lotId,
      lotNo: lotOpt.lotNo,
      periodStart: form.periodStart,
      periodEnd: form.periodEnd,
      outputQty: Number(form.outputQty),
      defectQty: Number(form.defectQty),
      workerId: form.workerId || null,
      lineManagerId: form.lineManagerId,
      lineManagerName: mgrOpt.name,
      createdAt: new Date().toISOString(),
    }
    setEntries((prev) => [newEntry, ...prev])
    setForm(INITIAL_FORM)
  }

  const columns: Column<OutputEntry>[] = [
    { key: 'lineCode', header: t('common.lineNo') },
    { key: 'lotNo', header: t('common.lotNo') },
    { key: 'periodStart', header: t('sewing.output.periodStart'), render: (r) => r.periodStart.replace('T', ' ') },
    { key: 'periodEnd', header: t('sewing.output.periodEnd'), render: (r) => r.periodEnd.replace('T', ' ') },
    { key: 'outputQty', header: t('sewing.output.outputQty'), className: 'text-right' },
    { key: 'defectQty', header: t('sewing.output.defectQty'), className: 'text-right' },
    {
      key: 'dhu',
      header: 'DHU %',
      className: 'text-right',
      render: (r) => {
        const dhu = r.outputQty > 0 ? ((r.defectQty / r.outputQty) * 100).toFixed(1) : '0.0'
        return `${dhu}%`
      },
    },
    { key: 'lineManagerName', header: t('sewing.output.lineManager') },
    {
      key: 'workerId',
      header: 'Worker',
      render: (r) => r.workerId ?? <span className="text-gray-400">-</span>,
    },
  ]

  const inputClass = 'block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
  const labelClass = 'block text-xs font-medium text-gray-600 mb-1'

  return (
    <div className="space-y-6">
      <PageHeader title={t('sewing.output.title')} />

      {/* Entry form */}
      <form onSubmit={handleSubmit} className="card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* lineId - required */}
          <div>
            <label className={labelClass}>{t('sewing.output.lineId')} *</label>
            <select
              className={inputClass}
              value={form.lineId}
              onChange={(e) => updateField('lineId', e.target.value)}
              required
            >
              <option value="">{t('common.filter')}</option>
              {LINE_OPTIONS.map((l) => (
                <option key={l.id} value={l.id}>{l.code}</option>
              ))}
            </select>
          </div>

          {/* lotId - required */}
          <div>
            <label className={labelClass}>{t('common.lotNo')} *</label>
            <select
              className={inputClass}
              value={form.lotId}
              onChange={(e) => updateField('lotId', e.target.value)}
              required
            >
              <option value="">{t('common.filter')}</option>
              {LOT_OPTIONS.map((l) => (
                <option key={l.id} value={l.id}>{l.lotNo}</option>
              ))}
            </select>
          </div>

          {/* periodStart - required */}
          <div>
            <label className={labelClass}>{t('sewing.output.periodStart')} *</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={form.periodStart}
              onChange={(e) => updateField('periodStart', e.target.value)}
              required
            />
          </div>

          {/* periodEnd - required */}
          <div>
            <label className={labelClass}>{t('sewing.output.periodEnd')} *</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={form.periodEnd}
              onChange={(e) => updateField('periodEnd', e.target.value)}
              required
            />
          </div>

          {/* outputQty - required */}
          <div>
            <label className={labelClass}>{t('sewing.output.outputQty')} *</label>
            <input
              type="number"
              className={inputClass}
              value={form.outputQty}
              onChange={(e) => updateField('outputQty', e.target.value)}
              min={1}
              required
            />
          </div>

          {/* defectQty - required */}
          <div>
            <label className={labelClass}>{t('sewing.output.defectQty')} *</label>
            <input
              type="number"
              className={inputClass}
              value={form.defectQty}
              onChange={(e) => updateField('defectQty', e.target.value)}
              min={0}
              required
            />
          </div>

          {/* workerId - OPTIONAL / nullable (ADR-013) */}
          <div>
            <label className={labelClass}>Worker ID <span className="text-gray-400">(ADR-013 {t('common.filter')})</span></label>
            <input
              type="text"
              className={inputClass}
              value={form.workerId}
              onChange={(e) => updateField('workerId', e.target.value)}
              placeholder="optional"
            />
          </div>

          {/* lineManagerId - required */}
          <div>
            <label className={labelClass}>{t('sewing.output.lineManager')} *</label>
            <select
              className={inputClass}
              value={form.lineManagerId}
              onChange={(e) => updateField('lineManagerId', e.target.value)}
              required
            >
              <option value="">{t('common.filter')}</option>
              {MANAGER_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            {t('common.register')}
          </button>
        </div>
      </form>

      {/* Entries table */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          {t('sewing.output.title')} ({entries.length})
        </h3>
        <DataTable<OutputEntry & Record<string, unknown>>
          columns={columns as Column<OutputEntry & Record<string, unknown>>[]}
          data={entries as (OutputEntry & Record<string, unknown>)[]}
          keyField="id"
        />
      </div>
    </div>
  )
}
