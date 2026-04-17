import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'
import { exportToCsv } from '../../utils/excel'

interface BundleQCRecord {
  id: string
  bundleNo: string
  inspectedQty: number
  defectQty: number
  defectType: string
  dhuRate: number | null
  judgement: string
  inspectionDate: string
}

const MOCK_RECORDS: BundleQCRecord[] = [
  { id: 'BQC-001', bundleNo: 'BND-001', inspectedQty: 100, defectQty: 2, defectType: 'Stitch defect', dhuRate: 2.0, judgement: 'PASS', inspectionDate: '2026-04-17' },
  { id: 'BQC-002', bundleNo: 'BND-002', inspectedQty: 100, defectQty: 5, defectType: 'Fabric contamination', dhuRate: 5.0, judgement: 'FAIL', inspectionDate: '2026-04-17' },
  { id: 'BQC-003', bundleNo: 'BND-003', inspectedQty: 0, defectQty: 0, defectType: '', dhuRate: null, judgement: 'PENDING', inspectionDate: '' },
  { id: 'BQC-004', bundleNo: 'BND-004', inspectedQty: 100, defectQty: 1, defectType: 'Size defect', dhuRate: 1.0, judgement: 'PASS', inspectionDate: '2026-04-17' },
  { id: 'BQC-005', bundleNo: 'BND-005', inspectedQty: 0, defectQty: 0, defectType: '', dhuRate: null, judgement: 'PENDING', inspectionDate: '' },
  { id: 'BQC-006', bundleNo: 'BND-006', inspectedQty: 100, defectQty: 4, defectType: 'Button defect', dhuRate: 4.0, judgement: 'FAIL', inspectionDate: '2026-04-16' },
  { id: 'BQC-007', bundleNo: 'BND-007', inspectedQty: 100, defectQty: 2, defectType: 'Loose thread', dhuRate: 2.0, judgement: 'PASS', inspectionDate: '2026-04-16' },
]

const DEFECT_TYPES = ['Stitch defect', 'Fabric contamination', 'Size defect', 'Button defect', 'Loose thread', 'Other']

export function HQC01Page() {
  const { t } = useTranslation()
  const [records] = useState<BundleQCRecord[]>(MOCK_RECORDS)
  const [form, setForm] = useState({
    bundleNo: '',
    inspectedQty: '',
    defectQty: '',
    defectType: '',
  })

  const columns: Column<BundleQCRecord>[] = [
    { key: 'bundleNo', header: t('sewing.bundleQC.bundleNo'), width: 110 },
    {
      key: 'inspectedQty',
      header: t('sewing.bundleQC.inspectedQty'),
      width: 100,
    },
    { key: 'defectQty', header: t('sewing.bundleQC.defectQty'), width: 90 },
    { key: 'defectType', header: t('sewing.bundleQC.defectType'), width: 120 },
    {
      key: 'dhuRate',
      header: t('sewing.bundleQC.dhuRate'),
      width: 90,
      render: (row) => {
        if (row.inspectedQty === 0 || row.dhuRate === null) {
          return (
            <span className="text-xs text-gray-400 italic">{t('sewing.bundleQC.waitingInput')}</span>
          )
        }
        return (
          <span className={row.dhuRate > 3 ? 'text-red-600 font-semibold' : 'text-gray-700'}>
            {row.dhuRate.toFixed(1)}%
          </span>
        )
      },
    },
    {
      key: 'judgement',
      header: t('sewing.bundleQC.judgement'),
      width: 90,
      render: (row) => {
        if (row.inspectedQty === 0) {
          return <span className="text-xs text-gray-400 italic">{t('sewing.bundleQC.waitingInput')}</span>
        }
        return <StatusBadge status={row.judgement} label={row.judgement} />
      },
    },
    { key: 'inspectionDate', header: t('sewing.bundleQC.inspectionDate'), width: 110 },
  ]

  function handleExport() {
    exportToCsv(
      records.map(r => ({
        [t('sewing.bundleQC.bundleNo')]: r.bundleNo,
        [t('sewing.bundleQC.inspectedQty')]: r.inspectedQty,
        [t('sewing.bundleQC.defectQty')]: r.defectQty,
        [t('sewing.bundleQC.defectType')]: r.defectType,
        [t('sewing.bundleQC.dhuRate')]: r.dhuRate !== null ? r.dhuRate : '',
        [t('sewing.bundleQC.judgement')]: r.judgement,
        [t('sewing.bundleQC.inspectionDate')]: r.inspectionDate,
      })),
      'bundle-qc'
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('sewing.bundleQC.title')} />

      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">{t('sewing.bundleQC.register')}</h2>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.bundleQC.bundleNo')}</label>
            <input
              className="input w-full"
              value={form.bundleNo}
              onChange={e => setForm(p => ({ ...p, bundleNo: e.target.value }))}
              placeholder="BND-XXX"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.bundleQC.inspectedQty')}</label>
            <input
              type="number"
              className="input w-full"
              value={form.inspectedQty}
              onChange={e => setForm(p => ({ ...p, inspectedQty: e.target.value }))}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.bundleQC.defectQty')}</label>
            <input
              type="number"
              className="input w-full"
              value={form.defectQty}
              onChange={e => setForm(p => ({ ...p, defectQty: e.target.value }))}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.bundleQC.defectType')}</label>
            <select
              className="input w-full"
              value={form.defectType}
              onChange={e => setForm(p => ({ ...p, defectType: e.target.value }))}
            >
              <option value="">-- Select --</option>
              {DEFECT_TYPES.map(dt => <option key={dt} value={dt}>{dt}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button className="btn-primary text-sm px-4 py-1.5">{t('sewing.bundleQC.register')}</button>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">{t('sewing.bundleQC.title')}</h2>
          <button className="btn-primary text-sm px-3 py-1.5" onClick={handleExport}>
            {t('common.exportExcel')}
          </button>
        </div>
        <MesGrid columns={columns} data={records} height={320} gridKey="H-QC-01-grid" />
      </div>
    </div>
  )
}
