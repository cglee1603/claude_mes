import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'

interface ChecklistItem {
  key: string
  checked: boolean
}

const CHECKLIST_KEYS = [
  'labelAttached',
  'polybagSealed',
  'barcodeScanned',
  'qtyVerified',
] as const

type ChecklistKey = (typeof CHECKLIST_KEYS)[number]

export function QC29PackingInspectPage() {
  const { t } = useTranslation()

  const [lotId, setLotId] = useState<string>('')
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    CHECKLIST_KEYS.map((key) => ({ key, checked: false })),
  )
  const [submitted, setSubmitted] = useState(false)

  const allChecked = checklist.every((item) => item.checked)
  const checkedCount = checklist.filter((item) => item.checked).length

  const toggleItem = useCallback((key: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, checked: !item.checked } : item,
      ),
    )
  }, [])

  const handleSubmit = useCallback(() => {
    setSubmitted(true)
  }, [])

  const getChecklistLabel = (key: ChecklistKey): string => {
    return t(`quality.packingInspect.checklist.${key}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('quality.packingInspect.title')}
        subtitle={t('quality.packingInspect.subtitle')}
      />

      <div className="card space-y-4">
        {/* LOT selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('quality.packingInspect.lotId')}
          </label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={lotId}
            onChange={(e) => setLotId(e.target.value)}
          >
            <option value="">{t('common.select')}</option>
            <option value="lot-001">ORD-2024-001-L001</option>
            <option value="lot-002">ORD-2024-001-L002</option>
            <option value="lot-003">ORD-2024-002-L001</option>
          </select>
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            {t('quality.packingInspect.checklistTitle')}
          </p>
          {checklist.map((item) => (
            <label
              key={item.key}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                item.checked
                  ? 'bg-green-50 border-green-300'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(item.key)}
                className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-900">
                {getChecklistLabel(item.key as ChecklistKey)}
              </span>
              {item.checked && (
                <span className="ml-auto text-green-600 text-xs font-medium">
                  {t('common.checked')}
                </span>
              )}
            </label>
          ))}
        </div>

        {/* Progress */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {t('quality.packingInspect.progress')}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {checkedCount}/{checklist.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                allChecked ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{
                width: `${(checkedCount / checklist.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          {submitted && (
            <span className="text-sm text-green-600 self-center">
              {t('quality.packingInspect.submitted')}
            </span>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!lotId || !allChecked}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('quality.packingInspect.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
