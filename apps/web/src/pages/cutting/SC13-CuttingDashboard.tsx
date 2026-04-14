import { useTranslation } from 'react-i18next'
import { PageHeader, KpiCard } from '@/components/common'

interface StatusCount {
  status: string
  labelKey: string
  count: number
  color: string
}

const STATUS_COUNTS: StatusCount[] = [
  { status: 'CUTTING', labelKey: 'status.CUTTING', count: 3, color: 'bg-blue-500' },
  { status: 'READY_FOR_SEW', labelKey: 'status.READY_FOR_SEW', count: 2, color: 'bg-cyan-500' },
  { status: 'SEWN', labelKey: 'status.SEWN', count: 2, color: 'bg-indigo-500' },
  { status: 'QC', labelKey: 'status.QC', count: 2, color: 'bg-yellow-500' },
  { status: 'PASSED_QC', labelKey: 'status.PASSED_QC', count: 1, color: 'bg-green-500' },
  { status: 'MFZ_HOLD', labelKey: 'status.MFZ_HOLD', count: 1, color: 'bg-red-500' },
  { status: 'READY_PACK', labelKey: 'status.READY_PACK', count: 1, color: 'bg-purple-500' },
  { status: 'PACKED', labelKey: 'status.PACKED', count: 1, color: 'bg-violet-500' },
  { status: 'SHIPPED', labelKey: 'status.SHIPPED', count: 2, color: 'bg-gray-400' },
]

const TOTAL_LOTS = STATUS_COUNTS.reduce((sum, s) => sum + s.count, 0)

export function SC13CuttingDashboardPage() {
  const { t } = useTranslation()

  const activeLots = STATUS_COUNTS
    .filter((s) => !['SHIPPED', 'PACKED'].includes(s.status))
    .reduce((sum, s) => sum + s.count, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('cutting.dashboard.title')}
        subtitle={t('cutting.dashboard.subtitle')}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label={t('cutting.dashboard.totalLots')}
          value={TOTAL_LOTS}
          color="blue"
          trend="up"
        />
        <KpiCard
          label={t('cutting.dashboard.activeLots')}
          value={activeLots}
          color="green"
          trend="neutral"
        />
        <KpiCard
          label={t('cutting.dashboard.todayBundles')}
          value={24}
          color="yellow"
          trend="up"
        />
        <KpiCard
          label={t('cutting.dashboard.avgMarkerEff')}
          value="85.6%"
          color="blue"
          trend="down"
        />
      </div>

      {/* LOT Status Bar */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('cutting.dashboard.lotStatusChart')}
        </h3>

        {/* Stacked bar */}
        <div className="h-10 w-full rounded-lg overflow-hidden flex">
          {STATUS_COUNTS.map((sc) => (
            <div
              key={sc.status}
              className={`${sc.color} relative group`}
              style={{ width: `${(sc.count / TOTAL_LOTS) * 100}%` }}
              title={`${t(sc.labelKey)}: ${sc.count}`}
            >
              {sc.count / TOTAL_LOTS >= 0.08 && (
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                  {sc.count}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          {STATUS_COUNTS.map((sc) => (
            <div key={sc.status} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm ${sc.color}`} />
              <span className="text-gray-600">
                {t(sc.labelKey)} ({sc.count})
              </span>
            </div>
          ))}
        </div>

        {/* Detail table */}
        <div className="mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('common.status')}</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">{t('common.qty')}</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">%</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {STATUS_COUNTS.map((sc) => (
                <tr key={sc.status} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${sc.color}`} />
                      <span>{t(sc.labelKey)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-right font-medium">{sc.count}</td>
                  <td className="px-4 py-2 text-sm text-right text-gray-500">
                    {((sc.count / TOTAL_LOTS) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
