import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'
import { MesGrid } from '@/components/common'
import type { Column } from '@/components/common'
import { StatusBadge } from '@/components/common/StatusBadge'
import { KpiCard } from '@/components/common/KpiCard'

type MfzResult = 'PASS' | 'FAIL'

interface MfzRecord {
  id: string
  lotNo: string
  orderNo: string
  result: MfzResult
  detectedCount: number
  inspector: string
  machineNo: string
  checkedAt: string
  plyTraceback: string
}

interface MfzHoldLot {
  id: string
  lotNo: string
  orderNo: string
  styleCode: string
  colorCode: string
  qty: number
  holdSince: string
  detectedCount: number
}

const MOCK_RECORDS: MfzRecord[] = [
  { id: '1', lotNo: 'ORD-2024-001-L001', orderNo: 'ORD-2024-001', result: 'PASS', detectedCount: 0, inspector: 'Nguyen A', machineNo: 'MFZ-01', checkedAt: '2026-04-10 09:00', plyTraceback: '-' },
  { id: '2', lotNo: 'ORD-2024-001-L002', orderNo: 'ORD-2024-001', result: 'PASS', detectedCount: 0, inspector: 'Nguyen A', machineNo: 'MFZ-01', checkedAt: '2026-04-10 09:15', plyTraceback: '-' },
  { id: '3', lotNo: 'ORD-2024-002-L001', orderNo: 'ORD-2024-002', result: 'FAIL', detectedCount: 2, inspector: 'Tran B', machineNo: 'MFZ-02', checkedAt: '2026-04-10 09:30', plyTraceback: 'Ply #3, #7' },
  { id: '4', lotNo: 'ORD-2024-002-L002', orderNo: 'ORD-2024-002', result: 'PASS', detectedCount: 0, inspector: 'Tran B', machineNo: 'MFZ-02', checkedAt: '2026-04-10 09:45', plyTraceback: '-' },
  { id: '5', lotNo: 'ORD-2024-003-L001', orderNo: 'ORD-2024-003', result: 'PASS', detectedCount: 0, inspector: 'Le C', machineNo: 'MFZ-01', checkedAt: '2026-04-10 10:00', plyTraceback: '-' },
  { id: '6', lotNo: 'ORD-2024-003-L002', orderNo: 'ORD-2024-003', result: 'PASS', detectedCount: 0, inspector: 'Le C', machineNo: 'MFZ-01', checkedAt: '2026-04-10 10:15', plyTraceback: '-' },
  { id: '7', lotNo: 'ORD-2024-004-L001', orderNo: 'ORD-2024-004', result: 'PASS', detectedCount: 0, inspector: 'Nguyen A', machineNo: 'MFZ-02', checkedAt: '2026-04-10 10:30', plyTraceback: '-' },
  { id: '8', lotNo: 'ORD-2024-004-L002', orderNo: 'ORD-2024-004', result: 'FAIL', detectedCount: 1, inspector: 'Tran B', machineNo: 'MFZ-01', checkedAt: '2026-04-10 10:45', plyTraceback: 'Ply #12' },
  { id: '9', lotNo: 'ORD-2024-005-L001', orderNo: 'ORD-2024-005', result: 'PASS', detectedCount: 0, inspector: 'Le C', machineNo: 'MFZ-02', checkedAt: '2026-04-10 11:00', plyTraceback: '-' },
  { id: '10', lotNo: 'ORD-2024-005-L002', orderNo: 'ORD-2024-005', result: 'PASS', detectedCount: 0, inspector: 'Nguyen A', machineNo: 'MFZ-01', checkedAt: '2026-04-10 11:15', plyTraceback: '-' },
]

const MOCK_HOLD_LOTS: MfzHoldLot[] = [
  { id: '1', lotNo: 'ORD-2024-002-L001', orderNo: 'ORD-2024-002', styleCode: 'STY-ZR-010', colorCode: 'RED-001', qty: 80, holdSince: '2026-04-10 09:30', detectedCount: 2 },
  { id: '2', lotNo: 'ORD-2024-004-L002', orderNo: 'ORD-2024-004', styleCode: 'STY-HM-005', colorCode: 'GRN-001', qty: 100, holdSince: '2026-04-10 10:45', detectedCount: 1 },
]

export function FP21MFZPage() {
  const { t } = useTranslation()
  const [formLotId, setFormLotId] = useState('')
  const [formResult, setFormResult] = useState<MfzResult | ''>('')
  const [formDetectedCount, setFormDetectedCount] = useState(0)
  const [showAlert, setShowAlert] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formResult === 'FAIL') {
      setShowAlert(true)
    } else {
      setShowAlert(false)
    }
  }

  const handleResultChange = (value: string) => {
    const result = value as MfzResult | ''
    setFormResult(result)
    if (result === 'PASS') {
      setFormDetectedCount(0)
      setShowAlert(false)
    }
  }

  const recordColumns: Column<MfzRecord>[] = [
    { key: 'lotNo', header: t('common.lotNo') },
    { key: 'orderNo', header: t('common.orderNo') },
    {
      key: 'result',
      header: t('finishing.mfz.detectionStatus'),
      render: (row) =>
        row.result === 'FAIL' ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            FAIL
          </span>
        ) : (
          <StatusBadge status="PASSED_QC" label={t('finishing.mfz.passed')} />
        ),
    },
    { key: 'detectedCount', header: t('finishing.mfz.detectedCount') },
    { key: 'inspector', header: t('finishing.mfz.inspector') },
    { key: 'machineNo', header: t('finishing.mfz.machine') },
    { key: 'checkedAt', header: t('common.date') },
    { key: 'plyTraceback', header: 'Ply Traceback' },
  ]

  const holdColumns: Column<MfzHoldLot>[] = [
    { key: 'lotNo', header: t('common.lotNo') },
    { key: 'orderNo', header: t('common.orderNo') },
    { key: 'styleCode', header: 'Style' },
    { key: 'colorCode', header: 'Color' },
    { key: 'qty', header: t('common.qty') },
    { key: 'detectedCount', header: t('finishing.mfz.detectedCount') },
    { key: 'holdSince', header: 'Hold Since' },
    {
      key: 'status',
      header: t('common.status'),
      render: () => <StatusBadge status="MFZ_HOLD" label={t('status.MFZ_HOLD')} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('finishing.mfz.title')}
        subtitle="FP-21 | MFZ Zero Policy"
        actions={
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-600 text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            CRITICAL
          </span>
        }
      />

      {/* RED ALERT Banner */}
      {showAlert && (
        <div className="bg-red-600 border-2 border-red-700 rounded-lg p-5 shadow-lg animate-pulse">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">
                {t('finishing.mfz.alertTitle')}
              </h3>
              <p className="text-red-100 text-sm mt-1">
                LOT: {formLotId || 'N/A'} | {t('finishing.mfz.detectedCount')}: {formDetectedCount}
              </p>
            </div>
            <div>
              <StatusBadge status="MFZ_HOLD" label={t('status.MFZ_HOLD')} />
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard label={t('finishing.mfz.title')} value={10} unit="checks" color="blue" />
        <KpiCard label={t('finishing.mfz.passed')} value={8} unit="LOTs" color="green" trend="up" />
        <KpiCard label="FAIL" value={2} unit="LOTs" color="red" trend="down" />
        <KpiCard label={t('finishing.mfz.hold')} value={MOCK_HOLD_LOTS.length} unit="LOTs" color="red" />
      </div>

      {/* MFZ Check Form */}
      <div className="card border-2 border-red-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          MFZ Check
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* LOT ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.lotNo')}
              </label>
              <input
                type="text"
                value={formLotId}
                onChange={(e) => setFormLotId(e.target.value)}
                placeholder="ORD-2024-XXX-LXXX"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* Result */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('finishing.mfz.detectionStatus')}
              </label>
              <select
                value={formResult}
                onChange={(e) => handleResultChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">-- Select --</option>
                <option value="PASS">{t('finishing.mfz.passed')}</option>
                <option value="FAIL">FAIL</option>
              </select>
            </div>

            {/* Detected Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('finishing.mfz.detectedCount')}
              </label>
              <input
                type="number"
                min={0}
                value={formDetectedCount}
                onChange={(e) => setFormDetectedCount(Number(e.target.value))}
                disabled={formResult === 'PASS'}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                formResult === 'FAIL'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {t('common.register')}
            </button>
          </div>
        </form>
      </div>

      {/* MFZ_HOLD LOTs List */}
      {MOCK_HOLD_LOTS.length > 0 && (
        <div className="card border-2 border-red-300 bg-red-50">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            MFZ_HOLD LOTs ({MOCK_HOLD_LOTS.length})
          </h3>
          <MesGrid columns={holdColumns} data={MOCK_HOLD_LOTS} />
        </div>
      )}

      {/* History Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">MFZ History</h3>
        <MesGrid columns={recordColumns} data={MOCK_RECORDS} />
      </div>
    </div>
  )
}
