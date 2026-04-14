import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader, DataTable, StatusBadge } from '@/components/common'
import type { Column } from '@/components/common'

interface ERPSyncItem {
  id: string
  ifType: string
  direction: 'IN' | 'OUT'
  lastSync: string
  pendingCount: number
  lastStatus: 'SUCCESS' | 'PARTIAL' | 'PENDING'
}

interface SyncHistoryItem {
  id: string
  ifType: string
  syncedAt: string
  recordCount: number
  status: 'SUCCESS' | 'FAILED'
  message: string
}

const MOCK_SYNC_ITEMS: ERPSyncItem[] = [
  { id: '1', ifType: 'ORDER', direction: 'IN', lastSync: '2026-04-10 06:00', pendingCount: 0, lastStatus: 'SUCCESS' },
  { id: '2', ifType: 'STYLE', direction: 'IN', lastSync: '2026-04-10 06:05', pendingCount: 0, lastStatus: 'SUCCESS' },
  { id: '3', ifType: 'MATERIAL', direction: 'IN', lastSync: '2026-04-10 06:10', pendingCount: 2, lastStatus: 'PARTIAL' },
  { id: '4', ifType: 'LINE_RESULT', direction: 'OUT', lastSync: '2026-04-10 00:00', pendingCount: 0, lastStatus: 'SUCCESS' },
  { id: '5', ifType: 'SHIPMENT', direction: 'OUT', lastSync: '2026-04-09 18:30', pendingCount: 1, lastStatus: 'PENDING' },
]

const MOCK_HISTORY: SyncHistoryItem[] = [
  { id: 'h1', ifType: 'ORDER', syncedAt: '2026-04-10 06:00', recordCount: 12, status: 'SUCCESS', message: '12건 동기화 완료' },
  { id: 'h2', ifType: 'STYLE', syncedAt: '2026-04-10 06:05', recordCount: 8, status: 'SUCCESS', message: '8건 동기화 완료' },
  { id: 'h3', ifType: 'MATERIAL', syncedAt: '2026-04-10 06:10', recordCount: 5, status: 'SUCCESS', message: '5/7건 처리, 2건 파싱 실패' },
  { id: 'h4', ifType: 'LINE_RESULT', syncedAt: '2026-04-10 00:00', recordCount: 4, status: 'SUCCESS', message: '4개 라인 실적 전송' },
  { id: 'h5', ifType: 'ORDER', syncedAt: '2026-04-09 06:00', recordCount: 10, status: 'SUCCESS', message: '10건 동기화 완료' },
]

const DIRECTION_LABEL: Record<string, string> = { IN: 'ERP → MES', OUT: 'MES → ERP' }

export function AdminERPPage() {
  const { t } = useTranslation()
  const [syncing, setSyncing] = useState<string | null>(null)

  function handleSync(ifType: string) {
    setSyncing(ifType)
    setTimeout(() => setSyncing(null), 2000)
  }

  const syncColumns: Column<ERPSyncItem>[] = [
    { key: 'ifType', header: 'IF 유형' },
    {
      key: 'direction',
      header: '방향',
      render: (row) => (
        <span className="text-xs font-medium text-gray-600">{DIRECTION_LABEL[row.direction]}</span>
      ),
    },
    { key: 'lastSync', header: t('admin.erp.lastSync') },
    {
      key: 'pendingCount',
      header: t('admin.erp.pendingItems'),
      render: (row) => (
        <span className={row.pendingCount > 0 ? 'text-amber-600 font-semibold' : 'text-gray-500'}>
          {row.pendingCount}
        </span>
      ),
    },
    {
      key: 'lastStatus',
      header: t('admin.erp.syncStatus'),
      render: (row) => {
        const statusMap = { SUCCESS: 'PASSED_QC', PARTIAL: 'READY_PACK', PENDING: 'CUTTING' } as const
        return <StatusBadge status={statusMap[row.lastStatus]} label={row.lastStatus} />
      },
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          type="button"
          onClick={() => handleSync(row.ifType)}
          disabled={syncing === row.ifType}
          className="btn-secondary text-xs py-1 px-3 disabled:opacity-50"
        >
          {syncing === row.ifType ? '동기화 중...' : t('admin.erp.syncNow')}
        </button>
      ),
    },
  ]

  const historyColumns: Column<SyncHistoryItem>[] = [
    { key: 'ifType', header: 'IF 유형' },
    { key: 'syncedAt', header: '동기화 시각' },
    { key: 'recordCount', header: '처리 건수', render: (row) => <span>{row.recordCount}건</span> },
    {
      key: 'status',
      header: '결과',
      render: (row) => (
        <StatusBadge
          status={row.status === 'SUCCESS' ? 'PASSED_QC' : 'MFZ_HOLD'}
          label={row.status}
        />
      ),
    },
    { key: 'message', header: '메시지' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.erp.title')}
        subtitle="ERP ↔ MES 5종 IF 동기화 현황"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">3</p>
          <p className="text-xs text-gray-500 mt-1">정상 IF</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-amber-600">1</p>
          <p className="text-xs text-gray-500 mt-1">부분 성공</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-blue-600">1</p>
          <p className="text-xs text-gray-500 mt-1">전송 대기</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-gray-700">3</p>
          <p className="text-xs text-gray-500 mt-1">총 대기 항목</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">IF 동기화 현황</h3>
        <DataTable<ERPSyncItem>
          columns={syncColumns}
          data={MOCK_SYNC_ITEMS}
          keyField="id"
        />
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">동기화 이력 (최근 5건)</h3>
        <DataTable<SyncHistoryItem>
          columns={historyColumns}
          data={MOCK_HISTORY}
          keyField="id"
        />
      </div>
    </div>
  )
}
