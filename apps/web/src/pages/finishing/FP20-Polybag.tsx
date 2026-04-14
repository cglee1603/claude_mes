import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { KpiCard } from '@/components/common/KpiCard'

interface ChecklistItem {
  key: string
  label: string
  checked: boolean
}

interface LotOption {
  lotNo: string
  orderNo: string
  styleCode: string
  colorCode: string
  qty: number
}

const MOCK_LOTS: LotOption[] = [
  { lotNo: 'ORD-2024-001-L001', orderNo: 'ORD-2024-001', styleCode: 'STY-NK-001', colorCode: 'BLK-001', qty: 100 },
  { lotNo: 'ORD-2024-001-L002', orderNo: 'ORD-2024-001', styleCode: 'STY-NK-001', colorCode: 'WHT-002', qty: 120 },
  { lotNo: 'ORD-2024-002-L001', orderNo: 'ORD-2024-002', styleCode: 'STY-ZR-010', colorCode: 'RED-001', qty: 80 },
  { lotNo: 'ORD-2024-003-L001', orderNo: 'ORD-2024-003', styleCode: 'STY-NK-002', colorCode: 'NVY-003', qty: 150 },
]

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { key: 'folding', label: 'finishing.polybag.folding', checked: false },
  { key: 'polybag', label: 'finishing.polybag.insertBag', checked: false },
  { key: 'sticker', label: 'finishing.polybag.sticker', checked: false },
  { key: 'hanger', label: 'finishing.polybag.hanger', checked: false },
]

export function FP20PolybagPage() {
  const { t } = useTranslation()
  const [selectedLotNo, setSelectedLotNo] = useState('')
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST)

  const selectedLot = MOCK_LOTS.find((l) => l.lotNo === selectedLotNo)
  const completedCount = checklist.filter((c) => c.checked).length
  const totalCount = checklist.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const allComplete = completedCount === totalCount

  const handleCheckToggle = (key: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, checked: !item.checked } : item
      )
    )
  }

  const handleLotChange = (lotNo: string) => {
    setSelectedLotNo(lotNo)
    setChecklist(INITIAL_CHECKLIST.map((item) => ({ ...item, checked: false })))
  }

  const handleConfirm = () => {
    // Mock confirm action
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('finishing.polybag.title')}
        subtitle="FP-20"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard label={t('finishing.polybag.title')} value={MOCK_LOTS.length} unit="LOTs" color="blue" />
        <KpiCard label={t('finishing.polybag.sealed')} value={2} unit="LOTs" color="green" trend="up" />
        <KpiCard label={t('common.qty')} value={450} unit="pcs" color="blue" />
        <KpiCard label="Progress" value={`${progressPercent}%`} color={allComplete ? 'green' : 'yellow'} />
      </div>

      {/* LOT Selector */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('common.lotNo')} Selection</h3>
        <select
          value={selectedLotNo}
          onChange={(e) => handleLotChange(e.target.value)}
          className="w-full md:w-1/2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        >
          <option value="">-- {t('common.lotNo')} --</option>
          {MOCK_LOTS.map((lot) => (
            <option key={lot.lotNo} value={lot.lotNo}>
              {lot.lotNo} ({lot.styleCode} / {lot.colorCode})
            </option>
          ))}
        </select>

        {/* Selected LOT Info */}
        {selectedLot && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-500">{t('common.lotNo')}</span>
              <p className="font-medium">{selectedLot.lotNo}</p>
            </div>
            <div>
              <span className="text-gray-500">{t('common.orderNo')}</span>
              <p className="font-medium">{selectedLot.orderNo}</p>
            </div>
            <div>
              <span className="text-gray-500">Style</span>
              <p className="font-medium">{selectedLot.styleCode}</p>
            </div>
            <div>
              <span className="text-gray-500">Color</span>
              <p className="font-medium">{selectedLot.colorCode}</p>
            </div>
            <div>
              <span className="text-gray-500">{t('common.qty')}</span>
              <p className="font-medium">{selectedLot.qty}</p>
            </div>
          </div>
        )}
      </div>

      {/* Checklist + Progress */}
      {selectedLot && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Polybag Checklist</h3>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {completedCount} / {totalCount} {t('common.confirm')}
              </span>
              <span className={`text-sm font-bold ${allComplete ? 'text-green-600' : 'text-yellow-600'}`}>
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  allComplete ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {checklist.map((item) => (
              <label
                key={item.key}
                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                  item.checked
                    ? 'bg-green-50 border-green-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleCheckToggle(item.key)}
                  className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className={`text-sm font-medium ${item.checked ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                  {t(item.label)}
                </span>
                {item.checked && (
                  <StatusBadge status="PASSED_QC" label={t('common.confirm')} />
                )}
              </label>
            ))}
          </div>

          {/* Confirm Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleConfirm}
              disabled={!allComplete}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                allComplete
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('finishing.polybag.sealed')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
