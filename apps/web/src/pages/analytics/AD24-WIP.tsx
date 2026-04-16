import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader, StatusBadge, MesGrid } from '@/components/common'
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

interface WipLot {
  id: string
  lotNo: string
  erpOrderNo: string
  buyerCode: string
  styleCode: string
  colorCode: string
  orderQty: number
  actualQty: number
  lotStatus: LotStatus
  updatedAt: string
}

const ALL_STATUSES: LotStatus[] = [
  'CUTTING', 'READY_FOR_SEW', 'SEWN', 'QC', 'PASSED_QC',
  'MFZ_HOLD', 'READY_PACK', 'PACKED', 'SHIPPED',
]

const statusColorMap: Record<LotStatus, string> = {
  CUTTING: 'bg-blue-500',
  READY_FOR_SEW: 'bg-cyan-500',
  SEWN: 'bg-indigo-500',
  QC: 'bg-yellow-500',
  PASSED_QC: 'bg-green-500',
  MFZ_HOLD: 'bg-red-500',
  READY_PACK: 'bg-purple-500',
  PACKED: 'bg-violet-500',
  SHIPPED: 'bg-gray-400',
}

const mockWipLots: WipLot[] = [
  { id: '1', lotNo: 'ORD-2026-001-L001', erpOrderNo: 'ORD-2026-001', buyerCode: 'NIKE', styleCode: 'NK-SS26-001', colorCode: 'BLK', orderQty: 500, actualQty: 320, lotStatus: 'SEWN', updatedAt: '2026-04-10T08:30:00Z' },
  { id: '2', lotNo: 'ORD-2026-001-L002', erpOrderNo: 'ORD-2026-001', buyerCode: 'NIKE', styleCode: 'NK-SS26-001', colorCode: 'WHT', orderQty: 500, actualQty: 500, lotStatus: 'QC', updatedAt: '2026-04-10T09:15:00Z' },
  { id: '3', lotNo: 'ORD-2026-002-L001', erpOrderNo: 'ORD-2026-002', buyerCode: 'ZARA', styleCode: 'ZR-FW26-010', colorCode: 'NVY', orderQty: 800, actualQty: 0, lotStatus: 'CUTTING', updatedAt: '2026-04-10T07:00:00Z' },
  { id: '4', lotNo: 'ORD-2026-002-L002', erpOrderNo: 'ORD-2026-002', buyerCode: 'ZARA', styleCode: 'ZR-FW26-010', colorCode: 'GRY', orderQty: 600, actualQty: 450, lotStatus: 'PASSED_QC', updatedAt: '2026-04-09T16:00:00Z' },
  { id: '5', lotNo: 'ORD-2026-003-L001', erpOrderNo: 'ORD-2026-003', buyerCode: 'H&M', styleCode: 'HM-BS26-005', colorCode: 'RED', orderQty: 1000, actualQty: 1000, lotStatus: 'PACKED', updatedAt: '2026-04-09T14:00:00Z' },
  { id: '6', lotNo: 'ORD-2026-003-L002', erpOrderNo: 'ORD-2026-003', buyerCode: 'H&M', styleCode: 'HM-BS26-005', colorCode: 'BLU', orderQty: 700, actualQty: 700, lotStatus: 'SHIPPED', updatedAt: '2026-04-08T10:00:00Z' },
  { id: '7', lotNo: 'ORD-2026-004-L001', erpOrderNo: 'ORD-2026-004', buyerCode: 'UNIQLO', styleCode: 'UQ-UT26-003', colorCode: 'BLK', orderQty: 400, actualQty: 250, lotStatus: 'MFZ_HOLD', updatedAt: '2026-04-10T10:00:00Z' },
  { id: '8', lotNo: 'ORD-2026-004-L002', erpOrderNo: 'ORD-2026-004', buyerCode: 'UNIQLO', styleCode: 'UQ-UT26-003', colorCode: 'WHT', orderQty: 400, actualQty: 400, lotStatus: 'READY_PACK', updatedAt: '2026-04-10T06:00:00Z' },
  { id: '9', lotNo: 'ORD-2026-005-L001', erpOrderNo: 'ORD-2026-005', buyerCode: 'NIKE', styleCode: 'NK-SS26-008', colorCode: 'GRN', orderQty: 300, actualQty: 150, lotStatus: 'READY_FOR_SEW', updatedAt: '2026-04-10T11:00:00Z' },
  { id: '10', lotNo: 'ORD-2026-005-L002', erpOrderNo: 'ORD-2026-005', buyerCode: 'NIKE', styleCode: 'NK-SS26-008', colorCode: 'BLK', orderQty: 300, actualQty: 300, lotStatus: 'SEWN', updatedAt: '2026-04-09T18:00:00Z' },
  { id: '11', lotNo: 'ORD-2026-006-L001', erpOrderNo: 'ORD-2026-006', buyerCode: 'ZARA', styleCode: 'ZR-FW26-022', colorCode: 'BRN', orderQty: 600, actualQty: 0, lotStatus: 'CUTTING', updatedAt: '2026-04-10T07:30:00Z' },
  { id: '12', lotNo: 'ORD-2026-006-L002', erpOrderNo: 'ORD-2026-006', buyerCode: 'ZARA', styleCode: 'ZR-FW26-022', colorCode: 'BLK', orderQty: 600, actualQty: 350, lotStatus: 'QC', updatedAt: '2026-04-10T09:45:00Z' },
  { id: '13', lotNo: 'ORD-2026-007-L001', erpOrderNo: 'ORD-2026-007', buyerCode: 'H&M', styleCode: 'HM-BS26-011', colorCode: 'PNK', orderQty: 900, actualQty: 900, lotStatus: 'PASSED_QC', updatedAt: '2026-04-09T15:00:00Z' },
  { id: '14', lotNo: 'ORD-2026-007-L002', erpOrderNo: 'ORD-2026-007', buyerCode: 'H&M', styleCode: 'HM-BS26-011', colorCode: 'YEL', orderQty: 500, actualQty: 200, lotStatus: 'SEWN', updatedAt: '2026-04-10T08:00:00Z' },
  { id: '15', lotNo: 'ORD-2026-008-L001', erpOrderNo: 'ORD-2026-008', buyerCode: 'UNIQLO', styleCode: 'UQ-UT26-009', colorCode: 'NVY', orderQty: 450, actualQty: 450, lotStatus: 'PACKED', updatedAt: '2026-04-09T12:00:00Z' },
  { id: '16', lotNo: 'ORD-2026-008-L002', erpOrderNo: 'ORD-2026-008', buyerCode: 'UNIQLO', styleCode: 'UQ-UT26-009', colorCode: 'GRY', orderQty: 450, actualQty: 300, lotStatus: 'READY_PACK', updatedAt: '2026-04-10T05:00:00Z' },
  { id: '17', lotNo: 'ORD-2026-009-L001', erpOrderNo: 'ORD-2026-009', buyerCode: 'NIKE', styleCode: 'NK-SS26-015', colorCode: 'ORG', orderQty: 350, actualQty: 0, lotStatus: 'CUTTING', updatedAt: '2026-04-10T06:30:00Z' },
  { id: '18', lotNo: 'ORD-2026-009-L002', erpOrderNo: 'ORD-2026-009', buyerCode: 'NIKE', styleCode: 'NK-SS26-015', colorCode: 'BLK', orderQty: 350, actualQty: 180, lotStatus: 'READY_FOR_SEW', updatedAt: '2026-04-10T10:30:00Z' },
  { id: '19', lotNo: 'ORD-2026-010-L001', erpOrderNo: 'ORD-2026-010', buyerCode: 'ZARA', styleCode: 'ZR-FW26-035', colorCode: 'WHT', orderQty: 700, actualQty: 700, lotStatus: 'SHIPPED', updatedAt: '2026-04-07T16:00:00Z' },
  { id: '20', lotNo: 'ORD-2026-010-L002', erpOrderNo: 'ORD-2026-010', buyerCode: 'ZARA', styleCode: 'ZR-FW26-035', colorCode: 'BLK', orderQty: 700, actualQty: 550, lotStatus: 'QC', updatedAt: '2026-04-10T11:30:00Z' },
]

export function AD24WIPPage() {
  const { t } = useTranslation()
  const [filterStatus, setFilterStatus] = useState<LotStatus | 'ALL'>('ALL')

  const statusCounts = ALL_STATUSES.map((status) => ({
    status,
    count: mockWipLots.filter((lot) => lot.lotStatus === status).length,
  }))

  const filteredLots = filterStatus === 'ALL'
    ? mockWipLots
    : mockWipLots.filter((lot) => lot.lotStatus === filterStatus)

  const columns: Column<WipLot>[] = [
    { key: 'lotNo', header: t('common.lotNo') },
    { key: 'erpOrderNo', header: t('common.orderNo') },
    { key: 'buyerCode', header: t('analytics.wip.buyer') },
    { key: 'styleCode', header: t('analytics.wip.style') },
    { key: 'colorCode', header: t('analytics.wip.colorCode') },
    {
      key: 'orderQty',
      header: t('common.qty'),
      render: (row) => <span>{row.orderQty.toLocaleString()}</span>,
    },
    {
      key: 'progress',
      header: t('analytics.wip.progress'),
      render: (row) => {
        const pct = row.orderQty > 0 ? Math.round((row.actualQty / row.orderQty) * 100) : 0
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 w-10 text-right">{pct}%</span>
          </div>
        )
      },
    },
    {
      key: 'lotStatus',
      header: t('common.status'),
      render: (row) => (
        <StatusBadge status={row.lotStatus} label={t(`status.${row.lotStatus}`)} />
      ),
    },
    {
      key: 'updatedAt',
      header: t('analytics.wip.lastUpdated'),
      render: (row) => (
        <span className="text-xs text-gray-500">
          {new Date(row.updatedAt).toLocaleString()}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('analytics.wip.title')}
        subtitle={t('analytics.wip.subtitle')}
      />

      {/* Status Blocks */}
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
        {statusCounts.map(({ status, count }) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilterStatus(filterStatus === status ? 'ALL' : status)}
            className={`rounded-lg p-3 text-center transition-all cursor-pointer ${
              filterStatus === status
                ? 'ring-2 ring-offset-2 ring-blue-500'
                : 'hover:shadow-md'
            }`}
          >
            <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${statusColorMap[status]}`} />
            <div className="text-2xl font-bold text-gray-900">{count}</div>
            <div className="text-xs text-gray-500 mt-1 truncate">
              {t(`status.${status}`)}
            </div>
          </button>
        ))}
      </div>

      {/* Filter indicator */}
      {filterStatus !== 'ALL' && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{t('common.filter')}:</span>
          <StatusBadge status={filterStatus} label={t(`status.${filterStatus}`)} />
          <button
            type="button"
            onClick={() => setFilterStatus('ALL')}
            className="text-blue-600 hover:underline ml-2"
          >
            {t('common.reset')}
          </button>
        </div>
      )}

      {/* LOT Detail Table */}
      <div className="card">
        <MesGrid<WipLot>
          columns={columns}
          data={filteredLots}
        />
      </div>
    </div>
  )
}
