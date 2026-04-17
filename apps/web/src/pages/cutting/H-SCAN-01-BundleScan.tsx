import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/grid/MesGrid'

interface ScanRecord {
  bundleNo: string
  scanTime: string
  direction: string
  operator: string
}

const MOCK_SCANS: ScanRecord[] = [
  { bundleNo: 'BDL-001', scanTime: '09:12:34', direction: 'CUT→SEW', operator: 'Nguyen Van A' },
  { bundleNo: 'BDL-002', scanTime: '09:13:01', direction: 'CUT→SEW', operator: 'Nguyen Van A' },
  { bundleNo: 'BDL-003', scanTime: '09:14:22', direction: 'CUT→SEW', operator: 'Tran Thi B' },
  { bundleNo: 'BDL-004', scanTime: '09:15:10', direction: 'CUT→SEW', operator: 'Tran Thi B' },
  { bundleNo: 'BDL-005', scanTime: '09:16:05', direction: 'CUT→SEW', operator: 'Le Van C' },
  { bundleNo: 'BDL-006', scanTime: '09:17:30', direction: 'CUT→SEW', operator: 'Le Van C' },
  { bundleNo: 'BDL-007', scanTime: '09:18:44', direction: 'CUT→SEW', operator: 'Pham Thi D' },
  { bundleNo: 'BDL-008', scanTime: '09:19:11', direction: 'CUT→SEW', operator: 'Pham Thi D' },
  { bundleNo: 'BDL-009', scanTime: '09:20:05', direction: 'CUT→SEW', operator: 'Nguyen Van A' },
  { bundleNo: 'BDL-010', scanTime: '09:21:33', direction: 'CUT→SEW', operator: 'Tran Thi B' },
]

type FlashState = 'idle' | 'success' | 'error'

export function HScan01Page() {
  const { t } = useTranslation()
  const [scanInput, setScanInput] = useState('')
  const [direction] = useState('CUT→SEW')
  const [scans, setScans] = useState<ScanRecord[]>(MOCK_SCANS)
  const [flash, setFlash] = useState<FlashState>('idle')
  const [duplicateWarning, setDuplicateWarning] = useState(false)
  const lastScanRef = useRef<{ bundleNo: string; time: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const DUPLICATE_THRESHOLD_MS = 300

  const columns: Column<ScanRecord>[] = [
    { key: 'bundleNo', header: t('cutting.scan.bundleNo'), width: 130 },
    { key: 'scanTime', header: t('cutting.scan.scanTime'), width: 120 },
    { key: 'direction', header: t('cutting.scan.direction'), width: 120 },
    { key: 'operator', header: t('cutting.scan.operator'), width: 150 },
  ]

  const handleScan = useCallback((value: string) => {
    if (!value.trim()) return

    const now = Date.now()
    const nowStr = new Date().toLocaleTimeString('ko-KR', { hour12: false })

    if (
      lastScanRef.current &&
      lastScanRef.current.bundleNo === value &&
      now - lastScanRef.current.time < DUPLICATE_THRESHOLD_MS
    ) {
      setDuplicateWarning(true)
      setFlash('error')
      setTimeout(() => { setFlash('idle'); setDuplicateWarning(false) }, 1500)
      setScanInput('')
      return
    }

    lastScanRef.current = { bundleNo: value, time: now }

    const newRecord: ScanRecord = {
      bundleNo: value,
      scanTime: nowStr,
      direction,
      operator: 'Current User',
    }

    setScans((prev) => [newRecord, ...prev].slice(0, 10))
    setFlash('success')
    setDuplicateWarning(false)
    setTimeout(() => setFlash('idle'), 1000)
    setScanInput('')
    inputRef.current?.focus()
  }, [direction])

  const flashClass =
    flash === 'success' ? 'ring-4 ring-green-400 bg-green-50' :
    flash === 'error' ? 'ring-4 ring-red-400 bg-red-50' :
    'bg-white'

  return (
    <div className="space-y-6">
      <PageHeader title={t('cutting.scan.title')} />

      <div className={`card max-w-xl transition-all duration-200 ${flashClass}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('cutting.scan.transferDirection')}</label>
            <div className="text-blue-700 font-semibold text-sm bg-blue-50 px-3 py-2 rounded-md inline-block">{direction}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('cutting.scan.scanInput')}</label>
            <input
              ref={inputRef}
              autoFocus
              className="w-full rounded-md border-2 border-blue-400 px-4 py-3 text-lg font-mono focus:outline-none focus:border-blue-600"
              placeholder="▶ BDL-..."
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleScan(scanInput) }}
            />
          </div>
          {duplicateWarning && (
            <p className="text-red-600 text-sm font-medium">{t('cutting.scan.duplicateWarning')}</p>
          )}
          {flash === 'success' && (
            <p className="text-green-600 text-sm font-medium">{t('cutting.scan.success')}</p>
          )}
          <button
            className="btn-primary w-full"
            onClick={() => handleScan(scanInput)}
          >
            {t('cutting.scan.scanInput')}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('cutting.scan.recentScans')}</h3>
        <MesGrid columns={columns} data={scans} gridKey="HScan01-grid" height={320} />
      </div>
    </div>
  )
}
