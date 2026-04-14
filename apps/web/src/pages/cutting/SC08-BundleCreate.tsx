import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader, DataTable } from '@/components/common'
import type { Column } from '@/components/common'

interface Bundle {
  id: string
  bundleNo: string
  lotNo: string
  rollId: string
  qty: number
  shadingGroup: string
}

interface LotOption {
  id: string
  lotNo: string
  colorCode: string
}

interface RollOption {
  id: string
  rollNo: string
  colorCode: string
}

const MOCK_LOTS: LotOption[] = [
  { id: 'lot-001', lotNo: 'ORD-2026-001-L001', colorCode: 'BLK-001' },
  { id: 'lot-002', lotNo: 'ORD-2026-001-L002', colorCode: 'WHT-002' },
  { id: 'lot-003', lotNo: 'ORD-2026-002-L001', colorCode: 'NVY-003' },
]

const MOCK_ROLLS: RollOption[] = [
  { id: 'roll-001', rollNo: 'R-2026-0001', colorCode: 'BLK-001' },
  { id: 'roll-002', rollNo: 'R-2026-0002', colorCode: 'BLK-001' },
  { id: 'roll-003', rollNo: 'R-2026-0003', colorCode: 'WHT-002' },
]

const MOCK_BUNDLES: Bundle[] = [
  { id: 'bnd-001', bundleNo: 'BND-001', lotNo: 'ORD-2026-001-L001', rollId: 'R-2026-0001', qty: 100, shadingGroup: 'A' },
  { id: 'bnd-002', bundleNo: 'BND-002', lotNo: 'ORD-2026-001-L001', rollId: 'R-2026-0001', qty: 100, shadingGroup: 'A' },
  { id: 'bnd-003', bundleNo: 'BND-003', lotNo: 'ORD-2026-001-L001', rollId: 'R-2026-0001', qty: 80, shadingGroup: 'A' },
]

const BUNDLE_QTY_MIN = 80
const BUNDLE_QTY_MAX = 150

export function SC08BundleCreatePage() {
  const { t } = useTranslation()
  const [selectedLotId, setSelectedLotId] = useState('')
  const [selectedRollId, setSelectedRollId] = useState('')
  const [bundleQty, setBundleQty] = useState('100')
  const [showShadingWarning, setShowShadingWarning] = useState(false)

  const selectedLot = MOCK_LOTS.find((l) => l.id === selectedLotId)

  const handleRollChange = (rollId: string) => {
    setSelectedRollId(rollId)
    if (selectedLot) {
      const roll = MOCK_ROLLS.find((r) => r.id === rollId)
      const existingRolls = MOCK_BUNDLES
        .filter((b) => b.lotNo === selectedLot.lotNo)
        .map((b) => b.rollId)
      const hasOtherRoll = roll && existingRolls.length > 0 && !existingRolls.includes(roll.rollNo)
      setShowShadingWarning(Boolean(hasOtherRoll))
    }
  }

  const qtyNum = Number(bundleQty)
  const isQtyValid = qtyNum >= BUNDLE_QTY_MIN && qtyNum <= BUNDLE_QTY_MAX

  const columns: Column<Bundle>[] = [
    { key: 'bundleNo', header: t('cutting.createBundle.bundleNo') },
    { key: 'lotNo', header: t('cutting.createBundle.lotNo') },
    { key: 'rollId', header: t('cutting.createBundle.rollId') },
    { key: 'qty', header: t('cutting.createBundle.qty') },
    { key: 'shadingGroup', header: t('cutting.createBundle.shadingGroup') },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('cutting.createBundle.title')}
        subtitle={t('cutting.createBundle.subtitle')}
      />

      {/* Shading Warning Banner */}
      {showShadingWarning && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4">
          <div className="flex items-center gap-2">
            <span className="text-red-600 text-lg">&#9888;</span>
            <p className="text-sm font-medium text-red-800">
              {t('cutting.createBundle.shadingWarning')}
            </p>
          </div>
        </div>
      )}

      <div className="card max-w-xl">
        <div className="space-y-4">
          {/* LOT Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('cutting.createBundle.lotNo')}
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={selectedLotId}
              onChange={(e) => setSelectedLotId(e.target.value)}
            >
              <option value="">{t('cutting.createBundle.selectLot')}</option>
              {MOCK_LOTS.map((lot) => (
                <option key={lot.id} value={lot.id}>
                  {lot.lotNo} ({lot.colorCode})
                </option>
              ))}
            </select>
          </div>

          {/* Roll Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('cutting.createBundle.rollId')}
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={selectedRollId}
              onChange={(e) => handleRollChange(e.target.value)}
            >
              <option value="">{t('cutting.createBundle.selectRoll')}</option>
              {MOCK_ROLLS.map((roll) => (
                <option key={roll.id} value={roll.id}>
                  {roll.rollNo} ({roll.colorCode})
                </option>
              ))}
            </select>
          </div>

          {/* Bundle Qty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('cutting.createBundle.qty')}
            </label>
            <input
              type="number"
              className={`w-full rounded-md border px-3 py-2 text-sm focus:ring-1 ${
                bundleQty && !isQtyValid
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              value={bundleQty}
              onChange={(e) => setBundleQty(e.target.value)}
              min={BUNDLE_QTY_MIN}
              max={BUNDLE_QTY_MAX}
            />
            <p className="mt-1 text-xs text-gray-500">
              {t('cutting.createBundle.qtyRange')}
            </p>
          </div>

          {/* Submit */}
          <button
            type="button"
            disabled={!selectedLotId || !selectedRollId || !isQtyValid}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t('cutting.createBundle.create')}
          </button>
        </div>
      </div>

      {/* Bundle List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('cutting.createBundle.bundleList')}
        </h3>
        <DataTable<Bundle>
          columns={columns}
          data={MOCK_BUNDLES}
          keyField="id"
        />
      </div>
    </div>
  )
}
