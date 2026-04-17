import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/grid/MesGrid'
import { StatusBadge } from '../../components/common/StatusBadge'
import { exportToCsv } from '../../utils/excel'

type OutsourceStatus = 'SENT' | 'RETURNED' | 'OVERDUE'

interface OutsourceRecord {
  shipmentNo: string
  contractor: string
  workType: string
  bundleCount: number
  shipDate: string
  expectedReturn: string
  actualReturn: string
  status: OutsourceStatus
}

const WORK_TYPES = [
  { value: 'EMBROIDERY', label: 'Embroidery' },
  { value: 'PRINTING', label: 'Printing' },
]

const MOCK_OUTSOURCE: OutsourceRecord[] = [
  { shipmentNo: 'EMB-2026-001', contractor: 'VN Embroidery Co.', workType: 'EMBROIDERY', bundleCount: 5, shipDate: '2026-04-01', expectedReturn: '2026-04-05', actualReturn: '2026-04-05', status: 'RETURNED' },
  { shipmentNo: 'EMB-2026-002', contractor: 'Saigon Print Ltd.', workType: 'PRINTING', bundleCount: 8, shipDate: '2026-04-05', expectedReturn: '2026-04-10', actualReturn: '2026-04-09', status: 'RETURNED' },
  { shipmentNo: 'EMB-2026-003', contractor: 'VN Embroidery Co.', workType: 'EMBROIDERY', bundleCount: 4, shipDate: '2026-04-10', expectedReturn: '2026-04-14', actualReturn: '', status: 'OVERDUE' },
  { shipmentNo: 'EMB-2026-004', contractor: 'Hanoi Printing', workType: 'PRINTING', bundleCount: 6, shipDate: '2026-04-12', expectedReturn: '2026-04-17', actualReturn: '', status: 'SENT' },
  { shipmentNo: 'EMB-2026-005', contractor: 'Saigon Print Ltd.', workType: 'PRINTING', bundleCount: 3, shipDate: '2026-04-15', expectedReturn: '2026-04-20', actualReturn: '', status: 'SENT' },
]

export function HCut04Page() {
  const { t } = useTranslation()
  const [contractor, setContractor] = useState('')
  const [orderNo, setOrderNo] = useState('')
  const [workType, setWorkType] = useState('')
  const [bundleCount, setBundleCount] = useState('')
  const [shipDate, setShipDate] = useState('')

  const columns: Column<OutsourceRecord>[] = [
    { key: 'shipmentNo', header: t('cutting.outsource.shipmentNo'), width: 150 },
    { key: 'contractor', header: t('cutting.outsource.contractor'), width: 160 },
    { key: 'workType', header: t('cutting.outsource.workType'), width: 120 },
    { key: 'bundleCount', header: t('cutting.outsource.bundleCount'), width: 100 },
    { key: 'shipDate', header: t('cutting.outsource.shipDate'), width: 110 },
    { key: 'expectedReturn', header: t('cutting.outsource.expectedReturn'), width: 120 },
    { key: 'actualReturn', header: t('cutting.outsource.actualReturn'), width: 110 },
    {
      key: 'status',
      header: t('cutting.outsource.status'),
      width: 120,
      render: (row) => (
        <span className={row.status === 'OVERDUE' ? 'font-semibold text-red-700' : ''}>
          <StatusBadge status={row.status} label={row.status === 'OVERDUE' ? t('cutting.outsource.overdue') : undefined} />
        </span>
      ),
    },
  ]

  function handleExport() {
    exportToCsv(
      MOCK_OUTSOURCE.map((o) => ({
        [t('cutting.outsource.shipmentNo')]: o.shipmentNo,
        [t('cutting.outsource.contractor')]: o.contractor,
        [t('cutting.outsource.workType')]: o.workType,
        [t('cutting.outsource.bundleCount')]: o.bundleCount,
        [t('cutting.outsource.shipDate')]: o.shipDate,
        [t('cutting.outsource.expectedReturn')]: o.expectedReturn,
        [t('cutting.outsource.actualReturn')]: o.actualReturn,
        [t('cutting.outsource.status')]: o.status,
      })),
      'outsource-tracking'
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setContractor('')
    setOrderNo('')
    setWorkType('')
    setBundleCount('')
    setShipDate('')
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('cutting.outsource.title')} />

      <div className="card max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.outsource.contractor')}</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={contractor} onChange={(e) => setContractor(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.outsource.workType')}</label>
            <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={workType} onChange={(e) => setWorkType(e.target.value)} required>
              <option value="">--</option>
              {WORK_TYPES.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.outsource.bundleCount')}</label>
            <input type="number" min={1} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={bundleCount} onChange={(e) => setBundleCount(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.outsource.shipDate')}</label>
            <input type="date" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={shipDate} onChange={(e) => setShipDate(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.cuttingPlan.orderNo')}</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={orderNo} onChange={(e) => setOrderNo(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full">{t('cutting.outsource.register')}</button>
        </form>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary text-sm px-3 py-1.5" onClick={handleExport}>{t('common.exportExcel')}</button>
      </div>

      <MesGrid columns={columns} data={MOCK_OUTSOURCE} gridKey="HCut04-grid" height={360} />
    </div>
  )
}
