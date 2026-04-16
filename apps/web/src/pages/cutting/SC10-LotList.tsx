import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader, MesGrid, StatusBadge } from '@/components/common'
import type { Column } from '@/components/common'

type LotStatus =
  | 'CUTTING'
  | 'READY_FOR_SEW'
  | 'SEWN'
  | 'QC'
  | 'PASSED_QC'
  | 'MFZ_HOLD'
  | 'READY_PACK'
  | 'PACKED'
  | 'SHIPPED'

interface LotRow {
  id: string
  lotNo: string
  erpOrderNo: string
  buyerCode: string
  colorCode: string
  orderQty: number
  actualQty: number
  lotStatus: LotStatus
  createdAt: string
}

const MOCK_LOTS: LotRow[] = [
  { id: 'l01', lotNo: 'ORD-2026-001-L001', erpOrderNo: 'ORD-2026-001', buyerCode: 'NIKE', colorCode: 'BLK-001', orderQty: 200, actualQty: 200, lotStatus: 'SHIPPED', createdAt: '2026-04-01' },
  { id: 'l02', lotNo: 'ORD-2026-001-L002', erpOrderNo: 'ORD-2026-001', buyerCode: 'NIKE', colorCode: 'WHT-002', orderQty: 150, actualQty: 150, lotStatus: 'PACKED', createdAt: '2026-04-01' },
  { id: 'l03', lotNo: 'ORD-2026-001-L003', erpOrderNo: 'ORD-2026-001', buyerCode: 'NIKE', colorCode: 'NVY-003', orderQty: 150, actualQty: 140, lotStatus: 'READY_PACK', createdAt: '2026-04-02' },
  { id: 'l04', lotNo: 'ORD-2026-002-L001', erpOrderNo: 'ORD-2026-002', buyerCode: 'ZARA', colorCode: 'RED-001', orderQty: 300, actualQty: 290, lotStatus: 'PASSED_QC', createdAt: '2026-04-02' },
  { id: 'l05', lotNo: 'ORD-2026-002-L002', erpOrderNo: 'ORD-2026-002', buyerCode: 'ZARA', colorCode: 'BLU-002', orderQty: 250, actualQty: 230, lotStatus: 'QC', createdAt: '2026-04-03' },
  { id: 'l06', lotNo: 'ORD-2026-002-L003', erpOrderNo: 'ORD-2026-002', buyerCode: 'ZARA', colorCode: 'GRN-003', orderQty: 250, actualQty: 250, lotStatus: 'MFZ_HOLD', createdAt: '2026-04-03' },
  { id: 'l07', lotNo: 'ORD-2026-003-L001', erpOrderNo: 'ORD-2026-003', buyerCode: 'H&M', colorCode: 'BLK-001', orderQty: 400, actualQty: 380, lotStatus: 'SEWN', createdAt: '2026-04-04' },
  { id: 'l08', lotNo: 'ORD-2026-003-L002', erpOrderNo: 'ORD-2026-003', buyerCode: 'H&M', colorCode: 'WHT-001', orderQty: 400, actualQty: 200, lotStatus: 'READY_FOR_SEW', createdAt: '2026-04-05' },
  { id: 'l09', lotNo: 'ORD-2026-003-L003', erpOrderNo: 'ORD-2026-003', buyerCode: 'H&M', colorCode: 'GRY-002', orderQty: 400, actualQty: 0, lotStatus: 'CUTTING', createdAt: '2026-04-06' },
  { id: 'l10', lotNo: 'ORD-2026-004-L001', erpOrderNo: 'ORD-2026-004', buyerCode: 'UNIQLO', colorCode: 'BLK-001', orderQty: 500, actualQty: 500, lotStatus: 'SHIPPED', createdAt: '2026-04-01' },
  { id: 'l11', lotNo: 'ORD-2026-004-L002', erpOrderNo: 'ORD-2026-004', buyerCode: 'UNIQLO', colorCode: 'NVY-001', orderQty: 500, actualQty: 480, lotStatus: 'PACKED', createdAt: '2026-04-02' },
  { id: 'l12', lotNo: 'ORD-2026-005-L001', erpOrderNo: 'ORD-2026-005', buyerCode: 'GAP', colorCode: 'KHK-001', orderQty: 300, actualQty: 100, lotStatus: 'SEWN', createdAt: '2026-04-07' },
  { id: 'l13', lotNo: 'ORD-2026-005-L002', erpOrderNo: 'ORD-2026-005', buyerCode: 'GAP', colorCode: 'OLV-002', orderQty: 300, actualQty: 0, lotStatus: 'CUTTING', createdAt: '2026-04-08' },
  { id: 'l14', lotNo: 'ORD-2026-006-L001', erpOrderNo: 'ORD-2026-006', buyerCode: 'PUMA', colorCode: 'RED-010', orderQty: 200, actualQty: 190, lotStatus: 'QC', createdAt: '2026-04-08' },
  { id: 'l15', lotNo: 'ORD-2026-006-L002', erpOrderNo: 'ORD-2026-006', buyerCode: 'PUMA', colorCode: 'BLK-010', orderQty: 200, actualQty: 50, lotStatus: 'READY_FOR_SEW', createdAt: '2026-04-09' },
]

const ALL_STATUSES: LotStatus[] = [
  'CUTTING', 'READY_FOR_SEW', 'SEWN', 'QC', 'PASSED_QC',
  'MFZ_HOLD', 'READY_PACK', 'PACKED', 'SHIPPED',
]

export function SC10LotListPage() {
  const { t } = useTranslation()
  const [statusFilter, setStatusFilter] = useState<string>('')

  const filteredLots = statusFilter
    ? MOCK_LOTS.filter((lot) => lot.lotStatus === statusFilter)
    : MOCK_LOTS

  const columns: Column<Record<string, unknown>>[] = [
    { key: 'lotNo', header: t('common.lotNo'), className: 'font-mono' },
    { key: 'erpOrderNo', header: t('common.orderNo') },
    { key: 'buyerCode', header: t('cutting.lotList.buyer') },
    { key: 'colorCode', header: t('cutting.createLot.colorCode') },
    { key: 'orderQty', header: t('cutting.createLot.orderQty') },
    { key: 'actualQty', header: t('cutting.lotList.actualQty') },
    {
      key: 'lotStatus',
      header: t('common.status'),
      render: (row) => (
        <StatusBadge
          status={String(row['lotStatus'])}
          label={t(`status.${String(row['lotStatus'])}`)}
        />
      ),
    },
    { key: 'createdAt', header: t('cutting.lotList.createdAt') },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('cutting.lotList.title')}
        subtitle={t('cutting.lotList.subtitle')}
        actions={
          <select
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">{t('common.all')}</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`status.${s}`)}
              </option>
            ))}
          </select>
        }
      />

      <div className="card">
        <MesGrid<Record<string, unknown>>
          columns={columns}
          data={filteredLots as unknown as Record<string, unknown>[]}
        />
      </div>
    </div>
  )
}
