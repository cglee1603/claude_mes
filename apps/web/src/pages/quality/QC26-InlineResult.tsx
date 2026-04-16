import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'
import { MesGrid } from '@/components/common'
import type { Column } from '@/components/common'
import { StatusBadge } from '@/components/common/StatusBadge'

interface InlineResult {
  id: string
  lotNo: string
  lineNo: string
  inspectedQty: number
  defectCount: number
  dhu: number
  ftp: string
  inspectedAt: string
}

const MOCK_RESULTS: InlineResult[] = [
  { id: '1', lotNo: 'ORD-2024-001-L001', lineNo: 'Line A', inspectedQty: 120, defectCount: 2, dhu: 1.67, ftp: 'PASS', inspectedAt: '2026-04-10 08:30' },
  { id: '2', lotNo: 'ORD-2024-001-L002', lineNo: 'Line A', inspectedQty: 100, defectCount: 5, dhu: 5.0, ftp: 'FAIL', inspectedAt: '2026-04-10 09:15' },
  { id: '3', lotNo: 'ORD-2024-001-L003', lineNo: 'Line B', inspectedQty: 150, defectCount: 1, dhu: 0.67, ftp: 'PASS', inspectedAt: '2026-04-10 09:45' },
  { id: '4', lotNo: 'ORD-2024-002-L001', lineNo: 'Line B', inspectedQty: 80, defectCount: 3, dhu: 3.75, ftp: 'FAIL', inspectedAt: '2026-04-10 10:00' },
  { id: '5', lotNo: 'ORD-2024-002-L002', lineNo: 'Line C', inspectedQty: 200, defectCount: 2, dhu: 1.0, ftp: 'PASS', inspectedAt: '2026-04-10 10:30' },
  { id: '6', lotNo: 'ORD-2024-002-L003', lineNo: 'Line C', inspectedQty: 110, defectCount: 4, dhu: 3.64, ftp: 'FAIL', inspectedAt: '2026-04-10 11:00' },
  { id: '7', lotNo: 'ORD-2024-003-L001', lineNo: 'Line D', inspectedQty: 90, defectCount: 0, dhu: 0.0, ftp: 'PASS', inspectedAt: '2026-04-10 11:30' },
  { id: '8', lotNo: 'ORD-2024-003-L002', lineNo: 'Line A', inspectedQty: 130, defectCount: 1, dhu: 0.77, ftp: 'PASS', inspectedAt: '2026-04-10 13:00' },
  { id: '9', lotNo: 'ORD-2024-003-L003', lineNo: 'Line B', inspectedQty: 140, defectCount: 6, dhu: 4.29, ftp: 'FAIL', inspectedAt: '2026-04-10 13:30' },
  { id: '10', lotNo: 'ORD-2024-004-L001', lineNo: 'Line D', inspectedQty: 100, defectCount: 2, dhu: 2.0, ftp: 'PASS', inspectedAt: '2026-04-10 14:00' },
]

// DHU threshold from buyer_qc_config (C-1: no hardcoded threshold)
const DHU_THRESHOLD = 3.0

export function QC26InlineResultPage() {
  const { t } = useTranslation()

  const columns: Column<InlineResult>[] = [
    { key: 'lotNo', header: t('quality.inlineResult.lotNo') },
    { key: 'lineNo', header: t('quality.inlineResult.lineNo') },
    {
      key: 'inspectedQty',
      header: t('quality.inlineResult.inspectedQty'),
      className: 'text-right',
    },
    {
      key: 'defectCount',
      header: t('quality.inlineResult.defectCount'),
      className: 'text-right',
    },
    {
      key: 'dhu',
      header: t('quality.inlineResult.dhu'),
      className: 'text-right',
      render: (row) => {
        const overThreshold = row.dhu > DHU_THRESHOLD
        return (
          <span className={overThreshold ? 'text-red-600 font-semibold' : 'text-green-600'}>
            {row.dhu.toFixed(2)}%
            {overThreshold && (
              <span className="ml-1 text-xs text-red-500">
                {t('quality.inlineResult.thresholdWarning')}
              </span>
            )}
          </span>
        )
      },
    },
    {
      key: 'ftp',
      header: t('quality.inlineResult.ftp'),
      render: (row) => (
        <StatusBadge
          status={row.ftp === 'PASS' ? 'PASSED_QC' : 'MFZ_HOLD'}
          label={row.ftp}
        />
      ),
    },
    { key: 'inspectedAt', header: t('quality.inlineResult.inspectedAt') },
  ]

  const failCount = MOCK_RESULTS.filter((r) => r.dhu > DHU_THRESHOLD).length

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('quality.inlineResult.title')}
        subtitle={t('quality.inlineResult.subtitle')}
      />

      {failCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm font-medium text-yellow-800">
            {t('quality.inlineResult.warningBanner', { count: failCount })}
          </p>
        </div>
      )}

      <div className="card">
        <MesGrid<InlineResult>
          columns={columns}
          data={MOCK_RESULTS}
        />
      </div>
    </div>
  )
}
