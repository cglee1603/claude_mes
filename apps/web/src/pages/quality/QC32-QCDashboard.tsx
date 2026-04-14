import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'
import { KpiCard } from '@/components/common/KpiCard'
import { DataTable, type Column } from '@/components/common/DataTable'

interface DefectDistribution {
  defectType: string
  count: number
  percentage: number
}

interface RecentResult {
  id: string
  lotNo: string
  inspectionType: string
  verdict: string
  dhu: number
  inspectedAt: string
}

const MOCK_DEFECTS: DefectDistribution[] = [
  { defectType: 'BROKEN_STITCH', count: 42, percentage: 28.0 },
  { defectType: 'SKIP_STITCH', count: 31, percentage: 20.7 },
  { defectType: 'UNEVEN_SEAM', count: 25, percentage: 16.7 },
  { defectType: 'FABRIC_DAMAGE', count: 18, percentage: 12.0 },
  { defectType: 'STAIN', count: 14, percentage: 9.3 },
  { defectType: 'MEASUREMENT_ERROR', count: 11, percentage: 7.3 },
  { defectType: 'PUCKERING', count: 6, percentage: 4.0 },
  { defectType: 'OTHER', count: 3, percentage: 2.0 },
]

const MOCK_RECENT: RecentResult[] = [
  { id: '1', lotNo: 'ORD-2024-001-L001', inspectionType: 'INLINE', verdict: 'PASS', dhu: 1.67, inspectedAt: '2026-04-10 14:00' },
  { id: '2', lotNo: 'ORD-2024-001-L002', inspectionType: 'FINAL', verdict: 'FAIL', dhu: 5.0, inspectedAt: '2026-04-10 13:30' },
  { id: '3', lotNo: 'ORD-2024-002-L001', inspectionType: 'INLINE', verdict: 'PASS', dhu: 0.67, inspectedAt: '2026-04-10 13:00' },
  { id: '4', lotNo: 'ORD-2024-002-L002', inspectionType: 'PACKING', verdict: 'PASS', dhu: 1.2, inspectedAt: '2026-04-10 12:00' },
  { id: '5', lotNo: 'ORD-2024-003-L001', inspectionType: 'SHIPPING', verdict: 'PASS', dhu: 0.0, inspectedAt: '2026-04-10 11:30' },
]

const BAR_MAX_WIDTH = 200

export function QC32QCDashboardPage() {
  const { t } = useTranslation()

  const recentColumns: Column<RecentResult>[] = [
    { key: 'lotNo', header: t('quality.dashboard.lotNo') },
    { key: 'inspectionType', header: t('quality.dashboard.inspectionType') },
    {
      key: 'verdict',
      header: t('quality.dashboard.verdict'),
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.verdict === 'PASS'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.verdict}
        </span>
      ),
    },
    {
      key: 'dhu',
      header: t('quality.dashboard.dhu'),
      className: 'text-right',
      render: (row) => <span>{row.dhu.toFixed(2)}%</span>,
    },
    { key: 'inspectedAt', header: t('quality.dashboard.inspectedAt') },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('quality.dashboard.title')}
        subtitle={t('quality.dashboard.subtitle')}
      />

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label={t('quality.dashboard.kpi.totalInspections')}
          value={156}
          unit={t('quality.dashboard.kpi.unit.count')}
          trend="up"
          color="blue"
        />
        <KpiCard
          label={t('quality.dashboard.kpi.passRate')}
          value="87.2"
          unit="%"
          trend="up"
          color="green"
        />
        <KpiCard
          label={t('quality.dashboard.kpi.avgDhu')}
          value="2.14"
          unit="%"
          trend="down"
          color="yellow"
        />
        <KpiCard
          label={t('quality.dashboard.kpi.mfzHoldCount')}
          value={2}
          unit={t('quality.dashboard.kpi.unit.lots')}
          trend="neutral"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Defect distribution */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            {t('quality.dashboard.defectDistribution')}
          </h3>
          <div className="space-y-3">
            {MOCK_DEFECTS.map((defect) => (
              <div key={defect.defectType} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-32 truncate">
                  {t(`quality.defectTypes.${defect.defectType}`)}
                </span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-4 bg-blue-500 rounded-full transition-all"
                      style={{
                        width: `${(defect.count / MOCK_DEFECTS[0].count) * 100}%`,
                        maxWidth: BAR_MAX_WIDTH,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-16 text-right">
                    {defect.count} ({defect.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent results table */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            {t('quality.dashboard.recentResults')}
          </h3>
          <DataTable<RecentResult>
            columns={recentColumns}
            data={MOCK_RECENT}
            keyField="id"
          />
        </div>
      </div>
    </div>
  )
}
