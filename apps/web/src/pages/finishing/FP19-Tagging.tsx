import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, Column } from '@/components/common/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { KpiCard } from '@/components/common/KpiCard'

interface TagRecord {
  id: string
  lotNo: string
  tagNo: string
  tagType: string
  orderNo: string
  styleCode: string
  colorCode: string
  appliedAt: string
  appliedBy: string
  status: string
}

interface ScannedLot {
  lotNo: string
  orderNo: string
  styleCode: string
  colorCode: string
  qty: number
  lotStatus: string
}

const MOCK_SCANNED_LOT: ScannedLot = {
  lotNo: 'ORD-2024-001-L001',
  orderNo: 'ORD-2024-001',
  styleCode: 'STY-NK-001',
  colorCode: 'BLK-001',
  qty: 100,
  lotStatus: 'PASSED_QC',
}

const MOCK_HISTORY: TagRecord[] = [
  { id: '1', lotNo: 'ORD-2024-001-L001', tagNo: 'TAG-001', tagType: 'MAIN', orderNo: 'ORD-2024-001', styleCode: 'STY-NK-001', colorCode: 'BLK-001', appliedAt: '2026-04-10 09:15', appliedBy: 'Nguyen A', status: 'APPLIED' },
  { id: '2', lotNo: 'ORD-2024-001-L002', tagNo: 'TAG-002', tagType: 'CARE', orderNo: 'ORD-2024-001', styleCode: 'STY-NK-001', colorCode: 'WHT-002', appliedAt: '2026-04-10 09:30', appliedBy: 'Nguyen A', status: 'APPLIED' },
  { id: '3', lotNo: 'ORD-2024-002-L001', tagNo: 'TAG-003', tagType: 'MAIN', orderNo: 'ORD-2024-002', styleCode: 'STY-ZR-010', colorCode: 'RED-001', appliedAt: '2026-04-10 10:00', appliedBy: 'Tran B', status: 'APPLIED' },
  { id: '4', lotNo: 'ORD-2024-002-L002', tagNo: 'TAG-004', tagType: 'SIZE', orderNo: 'ORD-2024-002', styleCode: 'STY-ZR-010', colorCode: 'RED-001', appliedAt: '2026-04-10 10:15', appliedBy: 'Tran B', status: 'APPLIED' },
  { id: '5', lotNo: 'ORD-2024-003-L001', tagNo: 'TAG-005', tagType: 'MAIN', orderNo: 'ORD-2024-003', styleCode: 'STY-NK-002', colorCode: 'NVY-003', appliedAt: '2026-04-09 14:20', appliedBy: 'Le C', status: 'APPLIED' },
  { id: '6', lotNo: 'ORD-2024-003-L002', tagNo: 'TAG-006', tagType: 'CARE', orderNo: 'ORD-2024-003', styleCode: 'STY-NK-002', colorCode: 'NVY-003', appliedAt: '2026-04-09 14:45', appliedBy: 'Le C', status: 'APPLIED' },
  { id: '7', lotNo: 'ORD-2024-004-L001', tagNo: 'TAG-007', tagType: 'MAIN', orderNo: 'ORD-2024-004', styleCode: 'STY-HM-005', colorCode: 'GRN-001', appliedAt: '2026-04-09 15:10', appliedBy: 'Nguyen A', status: 'APPLIED' },
  { id: '8', lotNo: 'ORD-2024-004-L002', tagNo: 'TAG-008', tagType: 'SIZE', orderNo: 'ORD-2024-004', styleCode: 'STY-HM-005', colorCode: 'GRN-001', appliedAt: '2026-04-09 15:30', appliedBy: 'Tran B', status: 'APPLIED' },
]

export function FP19TaggingPage() {
  const { t } = useTranslation()
  const [barcode, setBarcode] = useState('')
  const [scannedLot, setScannedLot] = useState<ScannedLot | null>(null)

  const handleScan = () => {
    if (barcode.trim()) {
      setScannedLot(MOCK_SCANNED_LOT)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleScan()
    }
  }

  const handlePrintTag = () => {
    // Mock print action
  }

  const columns: Column<TagRecord>[] = [
    { key: 'tagNo', header: t('finishing.tag.tagNo') },
    { key: 'lotNo', header: t('common.lotNo') },
    { key: 'tagType', header: t('finishing.tag.tagType') },
    { key: 'orderNo', header: t('common.orderNo') },
    { key: 'styleCode', header: 'Style' },
    { key: 'colorCode', header: 'Color' },
    { key: 'appliedAt', header: t('common.date') },
    { key: 'appliedBy', header: 'Operator' },
    {
      key: 'status',
      header: t('common.status'),
      render: (row) => <StatusBadge status={row.status} label={t('finishing.tag.applied')} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('finishing.tag.title')}
        subtitle="FP-19"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label={t('finishing.tag.title')} value={8} unit={t('common.qty')} color="blue" trend="up" />
        <KpiCard label="MAIN" value={4} unit={t('common.qty')} color="green" />
        <KpiCard label="CARE / SIZE" value={4} unit={t('common.qty')} color="yellow" />
      </div>

      {/* Barcode Scan Input */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Barcode Scan</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('common.lotNo')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              autoFocus
            />
          </div>
          <button
            onClick={handleScan}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {t('common.search')}
          </button>
        </div>
      </div>

      {/* Scanned LOT Info */}
      {scannedLot && (
        <div className="card border-l-4 border-l-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">LOT {t('common.detail')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">{t('common.lotNo')}</span>
                  <p className="font-medium text-gray-900">{scannedLot.lotNo}</p>
                </div>
                <div>
                  <span className="text-gray-500">{t('common.orderNo')}</span>
                  <p className="font-medium text-gray-900">{scannedLot.orderNo}</p>
                </div>
                <div>
                  <span className="text-gray-500">Style</span>
                  <p className="font-medium text-gray-900">{scannedLot.styleCode}</p>
                </div>
                <div>
                  <span className="text-gray-500">Color</span>
                  <p className="font-medium text-gray-900">{scannedLot.colorCode}</p>
                </div>
                <div>
                  <span className="text-gray-500">{t('common.qty')}</span>
                  <p className="font-medium text-gray-900">{scannedLot.qty}</p>
                </div>
                <div>
                  <span className="text-gray-500">{t('common.status')}</span>
                  <p><StatusBadge status={scannedLot.lotStatus} label={t(`status.${scannedLot.lotStatus}`)} /></p>
                </div>
              </div>
            </div>
            <button
              onClick={handlePrintTag}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Tag
            </button>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tag History</h3>
        <DataTable columns={columns} data={MOCK_HISTORY} keyField="id" />
      </div>
    </div>
  )
}
