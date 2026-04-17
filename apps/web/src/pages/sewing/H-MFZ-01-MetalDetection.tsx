import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'
import { KpiCard } from '../../components/common/KpiCard'
import { exportToCsv } from '../../utils/excel'

interface MFZRecord {
  inspectionId: string
  styleCode: string
  orderNo: string
  inspectedQty: number
  result: 'PASS' | 'FAIL'
  inspector: string
  inspectedAt: string
}

const MOCK_RECORDS: MFZRecord[] = [
  { inspectionId: 'MFZ-001', styleCode: 'ST-100', orderNo: 'NIKE-ORD-001', inspectedQty: 200, result: 'PASS', inspector: 'Nguyen Van An', inspectedAt: '2026-04-17 09:00' },
  { inspectionId: 'MFZ-002', styleCode: 'ST-200', orderNo: 'ZARA-ORD-002', inspectedQty: 180, result: 'PASS', inspector: 'Tran Thi Mai', inspectedAt: '2026-04-17 10:30' },
  { inspectionId: 'MFZ-003', styleCode: 'ST-300', orderNo: 'GAP-ORD-003', inspectedQty: 220, result: 'FAIL', inspector: 'Le Van Duc', inspectedAt: '2026-04-17 11:15' },
  { inspectionId: 'MFZ-004', styleCode: 'ST-100', orderNo: 'NIKE-ORD-001', inspectedQty: 195, result: 'PASS', inspector: 'Nguyen Van An', inspectedAt: '2026-04-16 09:00' },
  { inspectionId: 'MFZ-005', styleCode: 'ST-400', orderNo: 'HM-ORD-004', inspectedQty: 210, result: 'PASS', inspector: 'Pham Thi Huong', inspectedAt: '2026-04-16 10:00' },
  { inspectionId: 'MFZ-006', styleCode: 'ST-200', orderNo: 'ZARA-ORD-002', inspectedQty: 175, result: 'PASS', inspector: 'Tran Thi Mai', inspectedAt: '2026-04-15 09:30' },
]

export function HMFZ01Page() {
  const { t } = useTranslation()
  const [records] = useState<MFZRecord[]>(MOCK_RECORDS)
  const [form, setForm] = useState({
    styleCode: '',
    orderNo: '',
    inspectedQty: '',
    result: 'PASS' as 'PASS' | 'FAIL',
    inspector: '',
  })

  const allPassed = records.every(r => r.result === 'PASS')
  const todayRecords = records.filter(r => r.inspectedAt.startsWith('2026-04-17'))
  const todayPass = todayRecords.filter(r => r.result === 'PASS').length
  const todayFail = todayRecords.filter(r => r.result === 'FAIL').length
  const totalInspected = todayRecords.reduce((sum, r) => sum + r.inspectedQty, 0)

  const columns: Column<MFZRecord>[] = [
    { key: 'inspectionId', header: t('sewing.metalDetection.inspectionId'), width: 100 },
    { key: 'styleCode', header: t('sewing.metalDetection.styleCode'), width: 100 },
    { key: 'orderNo', header: t('sewing.metalDetection.orderNo'), width: 130 },
    { key: 'inspectedQty', header: t('sewing.metalDetection.inspectedQty'), width: 100 },
    {
      key: 'result',
      header: t('sewing.metalDetection.result'),
      width: 130,
      render: (row) => {
        if (row.result === 'FAIL') {
          return (
            <div className="flex items-center gap-1">
              <StatusBadge status="MFZ_HOLD" label="FAIL" />
              <span className="text-xs text-red-600 font-semibold">{t('sewing.metalDetection.shipmentBlocked')}</span>
            </div>
          )
        }
        return <StatusBadge status="PASSED_QC" label="PASS" />
      },
    },
    { key: 'inspector', header: t('sewing.metalDetection.inspector'), width: 110 },
    { key: 'inspectedAt', header: t('sewing.metalDetection.inspectedAt'), width: 150 },
  ]

  function handleExport() {
    exportToCsv(
      records.map(r => ({
        [t('sewing.metalDetection.inspectionId')]: r.inspectionId,
        [t('sewing.metalDetection.styleCode')]: r.styleCode,
        [t('sewing.metalDetection.orderNo')]: r.orderNo,
        [t('sewing.metalDetection.inspectedQty')]: r.inspectedQty,
        [t('sewing.metalDetection.result')]: r.result,
        [t('sewing.metalDetection.inspector')]: r.inspector,
        [t('sewing.metalDetection.inspectedAt')]: r.inspectedAt,
      })),
      'metal-detection'
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('sewing.metalDetection.title')} />

      {!allPassed && (
        <div className="rounded-md bg-red-50 border border-red-300 p-3">
          <p className="text-sm text-red-700 font-semibold">{t('sewing.metalDetection.allPassedRequired')}</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label={t('sewing.metalDetection.inspectedQty')} value={totalInspected.toLocaleString()} unit="pcs" color="blue" />
        <KpiCard label="Today Count" value={todayRecords.length} unit="cases" color="blue" />
        <KpiCard label="PASS" value={todayPass} unit="cases" color="green" />
        <KpiCard label="FAIL" value={todayFail} unit="cases" color="red" />
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">{t('sewing.metalDetection.register')}</h2>
        <div className="grid grid-cols-5 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.metalDetection.styleCode')}</label>
            <input
              className="input w-full"
              value={form.styleCode}
              onChange={e => setForm(p => ({ ...p, styleCode: e.target.value }))}
              placeholder="ST-XXX"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.metalDetection.orderNo')}</label>
            <input
              className="input w-full"
              value={form.orderNo}
              onChange={e => setForm(p => ({ ...p, orderNo: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.metalDetection.inspectedQty')}</label>
            <input
              type="number"
              className="input w-full"
              value={form.inspectedQty}
              onChange={e => setForm(p => ({ ...p, inspectedQty: e.target.value }))}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.metalDetection.result')}</label>
            <select
              className="input w-full"
              value={form.result}
              onChange={e => setForm(p => ({ ...p, result: e.target.value as 'PASS' | 'FAIL' }))}
            >
              <option value="PASS">PASS</option>
              <option value="FAIL">FAIL</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.metalDetection.inspector')}</label>
            <input
              className="input w-full"
              value={form.inspector}
              onChange={e => setForm(p => ({ ...p, inspector: e.target.value }))}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button className="btn-primary text-sm px-4 py-1.5">{t('sewing.metalDetection.register')}</button>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">{t('sewing.metalDetection.title')}</h2>
          <button className="btn-primary text-sm px-3 py-1.5" onClick={handleExport}>
            {t('common.exportExcel')}
          </button>
        </div>
        <MesGrid columns={columns} data={records} height={300} gridKey="H-MFZ-01-grid" />
      </div>
    </div>
  )
}
