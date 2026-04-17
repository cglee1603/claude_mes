import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/grid/MesGrid'
import { StatusBadge } from '../../components/common/StatusBadge'
import { exportToCsv } from '../../utils/excel'

type DeliveryStatus = 'DRAFT' | 'DELIVERED' | 'CONFIRMED'

interface LineDelivery {
  deliveryNo: string
  receivingLine: string
  bundleCount: number
  totalQty: number
  plannedQty: number
  status: DeliveryStatus
  deliveryDate: string
}

const MOCK_LINES = [
  { value: 'LINE-A', label: 'LINE-A (Sewing Line 1)' },
  { value: 'LINE-B', label: 'LINE-B (Sewing Line 2)' },
  { value: 'LINE-C', label: 'LINE-C (Sewing Line 3)' },
]

const MOCK_DELIVERIES: LineDelivery[] = [
  { deliveryNo: 'DLV-2026-001', receivingLine: 'LINE-A', bundleCount: 5, totalQty: 500, plannedQty: 500, status: 'CONFIRMED', deliveryDate: '2026-04-10' },
  { deliveryNo: 'DLV-2026-002', receivingLine: 'LINE-B', bundleCount: 3, totalQty: 295, plannedQty: 300, status: 'DELIVERED', deliveryDate: '2026-04-11' },
  { deliveryNo: 'DLV-2026-003', receivingLine: 'LINE-A', bundleCount: 4, totalQty: 400, plannedQty: 400, status: 'DELIVERED', deliveryDate: '2026-04-14' },
  { deliveryNo: 'DLV-2026-004', receivingLine: 'LINE-C', bundleCount: 2, totalQty: 200, plannedQty: 200, status: 'DRAFT', deliveryDate: '2026-04-17' },
]

export function HLot02Page() {
  const { t } = useTranslation()
  const [receivingLine, setReceivingLine] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [remark, setRemark] = useState('')
  const [bundleInput, setBundleInput] = useState('')
  const [plannedQty, setPlannedQty] = useState('')
  const [actualQty, setActualQty] = useState('')

  const qtyMismatch = plannedQty !== '' && actualQty !== '' && plannedQty !== actualQty

  const columns: Column<LineDelivery>[] = [
    { key: 'deliveryNo', header: t('cutting.lineDelivery.deliveryNo'), width: 150 },
    { key: 'receivingLine', header: t('cutting.lineDelivery.receivingLine'), width: 130 },
    { key: 'bundleCount', header: t('cutting.lineDelivery.bundleCount'), width: 100 },
    { key: 'totalQty', header: t('cutting.lineDelivery.totalQty'), width: 100 },
    {
      key: 'status',
      header: t('cutting.lineDelivery.status'),
      width: 120,
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: 'deliveryDate', header: t('cutting.lineDelivery.deliveryDate'), width: 110 },
  ]

  function handleExport() {
    exportToCsv(
      MOCK_DELIVERIES.map((d) => ({
        [t('cutting.lineDelivery.deliveryNo')]: d.deliveryNo,
        [t('cutting.lineDelivery.receivingLine')]: d.receivingLine,
        [t('cutting.lineDelivery.bundleCount')]: d.bundleCount,
        [t('cutting.lineDelivery.totalQty')]: d.totalQty,
        [t('cutting.lineDelivery.status')]: d.status,
        [t('cutting.lineDelivery.deliveryDate')]: d.deliveryDate,
      })),
      'line-delivery'
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setReceivingLine('')
    setDeliveryDate('')
    setRemark('')
    setBundleInput('')
    setPlannedQty('')
    setActualQty('')
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('cutting.lineDelivery.title')} />

      <div className="card max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.lineDelivery.receivingLine')}</label>
            <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={receivingLine} onChange={(e) => setReceivingLine(e.target.value)} required>
              <option value="">--</option>
              {MOCK_LINES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.lineDelivery.deliveryDate')}</label>
            <input type="date" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.cuttingPlan.plannedQty')}</label>
              <input type="number" min={0} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={plannedQty} onChange={(e) => setPlannedQty(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.lineDelivery.totalQty')}</label>
              <input type="number" min={0} className={`w-full rounded-md border px-3 py-2 text-sm ${qtyMismatch ? 'border-red-400' : 'border-gray-300'}`} value={actualQty} onChange={(e) => setActualQty(e.target.value)} />
            </div>
          </div>
          {qtyMismatch && (
            <p className="text-red-600 text-xs">{t('cutting.lineDelivery.qtyMismatchWarning')}</p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.lineDelivery.bundleCount')}</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="BDL-001, BDL-002 ..." value={bundleInput} onChange={(e) => setBundleInput(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('common.remark') || 'Remark'}</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={remark} onChange={(e) => setRemark(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full">{t('cutting.lineDelivery.issue')}</button>
        </form>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary text-sm px-3 py-1.5" onClick={handleExport}>{t('common.exportExcel')}</button>
      </div>

      <MesGrid columns={columns} data={MOCK_DELIVERIES} gridKey="HLot02-grid" height={320} />
    </div>
  )
}
