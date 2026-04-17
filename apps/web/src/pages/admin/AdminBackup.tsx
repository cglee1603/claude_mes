import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader, StatusBadge } from '@/components/common'
import {
  Database, Shield, Clock, HardDrive,
  AlertTriangle, Check, RefreshCw, Download,
} from 'lucide-react'

/* ── 목업 데이터 ─────────────────────────────────── */
interface BackupLog {
  id: string
  backupType: 'RDS_SNAPSHOT' | 'LOGICAL_DUMP' | 'MANUAL_SNAPSHOT'
  snapshotId: string
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED'
  triggeredBy: string
  fileSize: string
  createdAt: string
}

interface IntegrityIssue {
  severity: 'CRITICAL' | 'HIGH' | 'WARNING'
  table: string
  message: string
}

interface IntegrityResult {
  checkedAt: string
  status: 'OK' | 'WARNING' | 'CRITICAL'
  recordCounts: Record<string, number>
  issues: IntegrityIssue[]
}

const BACKUP_LOGS: BackupLog[] = [
  { id: 'B001', backupType: 'RDS_SNAPSHOT',    snapshotId: 'mes-weekly-2026-04-13', status: 'COMPLETED', triggeredBy: 'CRON',        fileSize: '4.2 GB', createdAt: '2026-04-13 02:00' },
  { id: 'B002', backupType: 'LOGICAL_DUMP',     snapshotId: 'mes-backup-2026-04',   status: 'COMPLETED', triggeredBy: 'CRON',        fileSize: '1.8 GB', createdAt: '2026-04-01 03:00' },
  { id: 'B003', backupType: 'MANUAL_SNAPSHOT',  snapshotId: 'mes-pre-deploy-0416',  status: 'COMPLETED', triggeredBy: 'ADMIN:admin', fileSize: '4.1 GB', createdAt: '2026-04-16 09:15' },
  { id: 'B004', backupType: 'RDS_SNAPSHOT',     snapshotId: 'mes-weekly-2026-04-06',status: 'COMPLETED', triggeredBy: 'CRON',        fileSize: '3.9 GB', createdAt: '2026-04-06 02:00' },
  { id: 'B005', backupType: 'LOGICAL_DUMP',     snapshotId: 'mes-backup-2026-03',   status: 'FAILED',    triggeredBy: 'CRON',        fileSize: '—',      createdAt: '2026-03-01 03:00' },
]

const LATEST_INTEGRITY: IntegrityResult = {
  checkedAt: '2026-04-14 04:00',
  status: 'WARNING',
  recordCounts: {
    garment_lots:        342,
    line_outputs:      5_840,
    qc_inspections:    1_230,
    mfz_records:          18,
    line_daily_summaries: 72,
  },
  issues: [
    { severity: 'WARNING', table: 'line_outputs', message: '2 orphan records detected (no lot_id reference)' },
  ],
}

/* ── 백업 현황 카드 ───────────────────────────────── */
function BackupSummaryCards() {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="card flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Database className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{t('admin.backup.pitrTitle')}</p>
          <p className="text-sm font-semibold text-gray-900">{t('admin.backup.pitrRetention')}</p>
          <p className="text-xs text-green-600 flex items-center gap-0.5 mt-0.5">
            <Check className="w-3 h-3" /> {t('admin.backup.pitrOk')} — {t('admin.backup.lastAt', { time: '04-16 01:00' })}
          </p>
        </div>
      </div>
      <div className="card flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Clock className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{t('admin.backup.weeklySnapshot')}</p>
          <p className="text-sm font-semibold text-gray-900">mes-weekly-2026-04-13</p>
          <p className="text-xs text-green-600 flex items-center gap-0.5 mt-0.5">
            <Check className="w-3 h-3" /> {t('admin.backup.doneSize', { size: '4.2 GB' })}
          </p>
        </div>
      </div>
      <div className="card flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
          <HardDrive className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{t('admin.backup.monthlyDump')}</p>
          <p className="text-sm font-semibold text-gray-900">2026-04 — 1.8 GB</p>
          <p className="text-xs text-green-600 flex items-center gap-0.5 mt-0.5">
            <Check className="w-3 h-3" /> {t('admin.backup.doneAes256')}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── 무결성 체크 결과 ─────────────────────────────── */
function IntegrityPanel() {
  const { t } = useTranslation()
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<IntegrityResult>(LATEST_INTEGRITY)

  function runCheck() {
    setIsChecking(true)
    setTimeout(() => {
      setResult({ ...LATEST_INTEGRITY, checkedAt: '2026-04-16 10:42 (just now)' })
      setIsChecking(false)
    }, 2000)
  }

  const severityColor = {
    OK: 'bg-green-100 text-green-700 border-green-200',
    WARNING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    CRITICAL: 'bg-red-100 text-red-700 border-red-200',
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">{t('admin.backup.integrityCheck')}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${severityColor[result.status]}`}>
            {result.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{t('admin.backup.lastChecked', { time: result.checkedAt })}</span>
          <button
            type="button"
            onClick={runCheck}
            disabled={isChecking}
            className="btn-secondary text-sm flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? t('admin.backup.checking') : t('admin.backup.runNow')}
          </button>
        </div>
      </div>

      {/* 레코드 카운트 */}
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(result.recordCounts).map(([table, count]) => (
          <div key={table} className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-base font-bold text-gray-900">{count.toLocaleString()}</p>
            <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{table.replace(/_/g, '_\n')}</p>
          </div>
        ))}
      </div>

      {/* 이슈 목록 */}
      {result.issues.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">{t('admin.backup.issuesFound')}</h4>
          {result.issues.map((issue, i) => (
            <div key={i} className={`flex items-start gap-2 p-3 rounded-lg border ${
              issue.severity === 'CRITICAL' ? 'bg-red-50 border-red-200' :
              issue.severity === 'HIGH' ? 'bg-orange-50 border-orange-200' :
              'bg-yellow-50 border-yellow-200'
            }`}>
              <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                issue.severity === 'CRITICAL' ? 'text-red-500' :
                issue.severity === 'HIGH' ? 'text-orange-500' : 'text-yellow-500'
              }`} />
              <div>
                <p className="text-xs font-semibold text-gray-800">[{issue.severity}] {issue.table}</p>
                <p className="text-xs text-gray-600 mt-0.5">{issue.message}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
          <Check className="w-4 h-4" />
          {t('admin.backup.noIssues')}
        </div>
      )}
    </div>
  )
}

/* ── 메인 컴포넌트 ───────────────────────────────── */
export function AdminBackupPage() {
  const { t } = useTranslation()
  const [isSnapshotting, setIsSnapshotting] = useState(false)
  const [logs, setLogs] = useState(BACKUP_LOGS)

  function triggerSnapshot() {
    setIsSnapshotting(true)
    setTimeout(() => {
      const newLog: BackupLog = {
        id: `B${Date.now()}`,
        backupType: 'MANUAL_SNAPSHOT',
        snapshotId: `mes-manual-${new Date().toISOString().slice(0, 10)}`,
        status: 'COMPLETED',
        triggeredBy: 'ADMIN:admin',
        fileSize: '4.2 GB',
        createdAt: new Date().toLocaleString('ko-KR').slice(0, 16),
      }
      setLogs(prev => [newLog, ...prev])
      setIsSnapshotting(false)
    }, 2500)
  }

  const statusBadge = (status: BackupLog['status']) => {
    switch (status) {
      case 'COMPLETED':   return <StatusBadge status="ACTIVE"   label={t('admin.backup.statusCompleted')} />
      case 'IN_PROGRESS': return <StatusBadge status="QC"       label={t('admin.backup.statusInProgress')} />
      case 'FAILED':      return <StatusBadge status="MFZ_HOLD" label={t('admin.backup.statusFailed')} />
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.backup.title')}
        subtitle={t('admin.backup.subtitle')}
        actions={
          <button
            type="button"
            onClick={triggerSnapshot}
            disabled={isSnapshotting}
            className="btn-primary flex items-center gap-1.5 text-sm"
          >
            <Database className={`w-4 h-4 ${isSnapshotting ? 'animate-pulse' : ''}`} />
            {isSnapshotting ? t('admin.backup.snapshotting') : t('admin.backup.manualSnapshot')}
          </button>
        }
      />

      {/* 3계층 현황 카드 */}
      <BackupSummaryCards />

      {/* 무결성 체크 */}
      <IntegrityPanel />

      {/* 백업 이력 테이블 */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{t('admin.backup.historyTitle')}</h3>
          <button type="button" className="btn-secondary text-sm flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            {t('admin.backup.exportCsv')}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left pb-3 font-semibold text-gray-700">{t('admin.backup.colType')}</th>
                <th className="text-left pb-3 font-semibold text-gray-700">{t('admin.backup.colSnapshotId')}</th>
                <th className="text-left pb-3 font-semibold text-gray-700">{t('admin.backup.colStatus')}</th>
                <th className="text-left pb-3 font-semibold text-gray-700">{t('admin.backup.colTriggeredBy')}</th>
                <th className="text-left pb-3 font-semibold text-gray-700">{t('admin.backup.colSize')}</th>
                <th className="text-left pb-3 font-semibold text-gray-700">{t('admin.backup.colCreatedAt')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      log.backupType === 'RDS_SNAPSHOT'   ? 'bg-blue-100 text-blue-700' :
                      log.backupType === 'LOGICAL_DUMP'   ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {log.backupType === 'LOGICAL_DUMP' ? 'pg_dump → S3' : log.backupType === 'RDS_SNAPSHOT' ? t('admin.backup.typeRdsSnapshot') : t('admin.backup.typeManualSnapshot')}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-xs text-gray-600">{log.snapshotId}</td>
                  <td className="py-3">{statusBadge(log.status)}</td>
                  <td className="py-3 text-gray-600 text-xs">{log.triggeredBy}</td>
                  <td className="py-3 text-gray-600">{log.fileSize}</td>
                  <td className="py-3 text-gray-500 text-xs">{log.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
