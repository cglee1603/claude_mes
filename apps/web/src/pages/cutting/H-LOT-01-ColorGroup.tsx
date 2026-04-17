import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/grid/MesGrid'
import { StatusBadge } from '../../components/common/StatusBadge'
import { exportToCsv } from '../../utils/excel'

type GroupStatus = 'PLANNED' | 'CUTTING' | 'COMPLETED'

interface ColorGroup {
  groupId: string
  orderNo: string
  colorCode: string
  sizeRange: string
  totalQty: number
  bundleCount: number
  status: GroupStatus
}

const MOCK_ORDERS = [
  { value: 'ORD-2026-001', label: 'ORD-2026-001 (NIKE)' },
  { value: 'ORD-2026-002', label: 'ORD-2026-002 (ZARA)' },
  { value: 'ORD-2026-003', label: 'ORD-2026-003 (H&M)' },
]

const MOCK_GROUPS: ColorGroup[] = [
  { groupId: 'LCG-2026-001', orderNo: 'ORD-2026-001', colorCode: 'BLK', sizeRange: 'XS/S/M/L/XL', totalQty: 500, bundleCount: 5, status: 'COMPLETED' },
  { groupId: 'LCG-2026-002', orderNo: 'ORD-2026-001', colorCode: 'WHT', sizeRange: 'XS/S/M/L/XL', totalQty: 300, bundleCount: 3, status: 'COMPLETED' },
  { groupId: 'LCG-2026-003', orderNo: 'ORD-2026-001', colorCode: 'RED', sizeRange: 'S/M/L', totalQty: 200, bundleCount: 2, status: 'CUTTING' },
  { groupId: 'LCG-2026-004', orderNo: 'ORD-2026-001', colorCode: 'BLU', sizeRange: 'S/M/L/XL', totalQty: 250, bundleCount: 3, status: 'PLANNED' },
  { groupId: 'LCG-2026-005', orderNo: 'ORD-2026-001', colorCode: 'GRN', sizeRange: 'M/L/XL', totalQty: 180, bundleCount: 2, status: 'PLANNED' },
]

export function HLot01Page() {
  const { t } = useTranslation()
  const [orderNo, setOrderNo] = useState('')
  const [colorCode, setColorCode] = useState('')
  const [sizeRange, setSizeRange] = useState('')
  const [totalQty, setTotalQty] = useState('')

  const columns: Column<ColorGroup>[] = [
    { key: 'groupId', header: t('cutting.colorGroup.groupId'), width: 150 },
    { key: 'orderNo', header: t('cutting.colorGroup.orderNo'), width: 140 },
    { key: 'colorCode', header: t('cutting.colorGroup.colorCode'), width: 100 },
    { key: 'sizeRange', header: t('cutting.colorGroup.sizeRange'), width: 140 },
    { key: 'totalQty', header: t('cutting.colorGroup.totalQty'), width: 100 },
    { key: 'bundleCount', header: t('cutting.colorGroup.bundleCount'), width: 100 },
    {
      key: 'status',
      header: t('cutting.colorGroup.status'),
      width: 120,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ]

  function handleExport() {
    exportToCsv(
      MOCK_GROUPS.map((g) => ({
        [t('cutting.colorGroup.groupId')]: g.groupId,
        [t('cutting.colorGroup.orderNo')]: g.orderNo,
        [t('cutting.colorGroup.colorCode')]: g.colorCode,
        [t('cutting.colorGroup.sizeRange')]: g.sizeRange,
        [t('cutting.colorGroup.totalQty')]: g.totalQty,
        [t('cutting.colorGroup.bundleCount')]: g.bundleCount,
        [t('cutting.colorGroup.status')]: g.status,
      })),
      'lot-color-group'
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setOrderNo('')
    setColorCode('')
    setSizeRange('')
    setTotalQty('')
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('cutting.colorGroup.title')} />

      <div className="card max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.colorGroup.orderNo')}</label>
            <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={orderNo} onChange={(e) => setOrderNo(e.target.value)} required>
              <option value="">--</option>
              {MOCK_ORDERS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.colorGroup.colorCode')}</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={colorCode} onChange={(e) => setColorCode(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.colorGroup.sizeRange')}</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="XS/S/M/L/XL" value={sizeRange} onChange={(e) => setSizeRange(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.colorGroup.totalQty')}</label>
            <input type="number" min={1} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={totalQty} onChange={(e) => setTotalQty(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary w-full">{t('cutting.colorGroup.create')}</button>
        </form>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary text-sm px-3 py-1.5" onClick={handleExport}>{t('common.exportExcel')}</button>
      </div>

      <MesGrid columns={columns} data={MOCK_GROUPS} gridKey="HLot01-grid" height={360} />
    </div>
  )
}
