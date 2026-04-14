import { useTranslation } from 'react-i18next'
import { PageHeader, DataTable } from '@/components/common'
import type { Column } from '@/components/common'

interface LayerStats {
  layer: string
  label: string
  totalCount: number
  activeCount: number
  archivedCount: number
  permanentCount: number
  nextArchiveDate: string
  color: string
}

interface ArchiveScheduleItem {
  id: string
  layer: string
  entityType: string
  candidateCount: number
  scheduledDate: string
  archiveDays: number
}

const MOCK_LAYER_STATS: LayerStats[] = [
  {
    layer: 'A',
    label: 'Layer A — ERP Origin',
    totalCount: 342,
    activeCount: 280,
    archivedCount: 62,
    permanentCount: 0,
    nextArchiveDate: '2026-04-15',
    color: 'blue',
  },
  {
    layer: 'B',
    label: 'Layer B — MES 자체',
    totalCount: 48,
    activeCount: 44,
    archivedCount: 0,
    permanentCount: 0,
    nextArchiveDate: '—',
    color: 'indigo',
  },
  {
    layer: 'C',
    label: 'Layer C — 영구 기록 (삭제 불가)',
    totalCount: 1284,
    activeCount: 0,
    archivedCount: 0,
    permanentCount: 1284,
    nextArchiveDate: '영원히 보관',
    color: 'red',
  },
  {
    layer: 'D',
    label: 'Layer D — ERP 전송큐',
    totalCount: 120,
    activeCount: 3,
    archivedCount: 117,
    permanentCount: 0,
    nextArchiveDate: '2026-04-20',
    color: 'green',
  },
]

const MOCK_ARCHIVE_SCHEDULE: ArchiveScheduleItem[] = [
  { id: 's1', layer: 'A', entityType: 'ERP_IF_ORDER', candidateCount: 14, scheduledDate: '2026-04-15', archiveDays: 180 },
  { id: 's2', layer: 'A', entityType: 'ERP_IF_MATERIAL', candidateCount: 8, scheduledDate: '2026-04-18', archiveDays: 90 },
  { id: 's3', layer: 'D', entityType: 'ERP_LINE_RESULT_QUEUE', candidateCount: 42, scheduledDate: '2026-04-20', archiveDays: 90 },
  { id: 's4', layer: 'D', entityType: 'ERP_SHIPMENT_QUEUE', candidateCount: 12, scheduledDate: '2026-04-25', archiveDays: 90 },
]

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-50 border-blue-200',
  indigo: 'bg-indigo-50 border-indigo-200',
  red: 'bg-red-50 border-red-200',
  green: 'bg-green-50 border-green-200',
}

const HEADER_COLOR_MAP: Record<string, string> = {
  blue: 'text-blue-700',
  indigo: 'text-indigo-700',
  red: 'text-red-700',
  green: 'text-green-700',
}

export function AdminLifecyclePage() {
  const { t } = useTranslation()

  const scheduleColumns: Column<ArchiveScheduleItem>[] = [
    { key: 'layer', header: 'Layer', render: (row) => <span className="font-mono">Layer {row.layer}</span> },
    { key: 'entityType', header: '엔티티 유형' },
    {
      key: 'candidateCount',
      header: '대상 건수',
      render: (row) => <span className="font-semibold text-amber-600">{row.candidateCount}건</span>,
    },
    { key: 'scheduledDate', header: '예정일' },
    {
      key: 'archiveDays',
      header: '아카이브 기준',
      render: (row) => <span className="text-gray-600">{row.archiveDays}일 경과</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.lifecycle.title')}
        subtitle="Layer A~D 데이터 현황 및 아카이브 일정 (Layer C는 트리거로 삭제 영구 차단)"
      />

      {/* Layer stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_LAYER_STATS.map((layer) => (
          <div
            key={layer.layer}
            className={`card border ${COLOR_MAP[layer.color]}`}
          >
            <h3 className={`text-sm font-bold mb-3 ${HEADER_COLOR_MAP[layer.color]}`}>
              {layer.label}
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">총 레코드</p>
                <p className="font-semibold text-gray-900">{layer.totalCount.toLocaleString()}건</p>
              </div>
              {layer.permanentCount > 0 ? (
                <div>
                  <p className="text-gray-500">PERMANENT</p>
                  <p className="font-semibold text-red-700">{layer.permanentCount.toLocaleString()}건</p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-gray-500">ACTIVE</p>
                    <p className="font-semibold text-gray-900">{layer.activeCount.toLocaleString()}건</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{t('admin.lifecycle.archivedCount')}</p>
                    <p className="font-semibold text-gray-500">{layer.archivedCount.toLocaleString()}건</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{t('admin.lifecycle.archiveSchedule')}</p>
                    <p className="font-semibold text-gray-700">{layer.nextArchiveDate}</p>
                  </div>
                </>
              )}
            </div>
            {layer.layer === 'C' && (
              <div className="mt-3 rounded bg-red-100 px-3 py-2 text-xs text-red-700 font-medium">
                DB 트리거 활성화 — PERMANENT 레코드 DELETE 시 예외 발생
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Archive schedule */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          {t('admin.lifecycle.archiveSchedule')} (30일 이내)
        </h3>
        <DataTable<ArchiveScheduleItem>
          columns={scheduleColumns}
          data={MOCK_ARCHIVE_SCHEDULE}
          keyField="id"
        />
      </div>

      {/* Trigger info */}
      <div className="card bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Layer C 삭제 방지 트리거 상태</h3>
        <div className="space-y-1 text-xs text-gray-600">
          {['garment_lots', 'line_outputs', 'line_daily_summaries', 'qc_inspections', 'mfz_records'].map((table) => (
            <div key={table} className="flex items-center justify-between py-1 border-b border-gray-200 last:border-0">
              <span className="font-mono">{table}</span>
              <span className="flex items-center gap-1 text-green-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                활성화
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">최근 트리거 동작: 2026-04-10 09:14 (삭제 시도 차단)</p>
      </div>
    </div>
  )
}
