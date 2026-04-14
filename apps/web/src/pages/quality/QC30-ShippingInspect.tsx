import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'

interface ShippingCheckItem {
  key: string
  label: string
  checked: boolean
}

const CHECK_KEYS = [
  'cartonCondition',
  'weightVerified',
  'blDocumentReady',
  'mfzPassed',
] as const

type CheckKey = (typeof CHECK_KEYS)[number]

export function QC30ShippingInspectPage() {
  const { t } = useTranslation()

  const [lotId, setLotId] = useState<string>('')
  const [isMfzHold, setIsMfzHold] = useState(false)
  const [checks, setChecks] = useState<ShippingCheckItem[]>(
    CHECK_KEYS.map((key) => ({
      key,
      label: key,
      checked: false,
    })),
  )
  const [submitted, setSubmitted] = useState(false)

  const allChecked = checks.every((c) => c.checked)

  const handleLotChange = useCallback((value: string) => {
    setLotId(value)
    // Simulate MFZ_HOLD detection for lot-002
    setIsMfzHold(value === 'lot-002')
    setSubmitted(false)
  }, [])

  const toggleCheck = useCallback((key: string) => {
    setChecks((prev) =>
      prev.map((c) => (c.key === key ? { ...c, checked: !c.checked } : c)),
    )
  }, [])

  const handleSubmit = useCallback(() => {
    setSubmitted(true)
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('quality.shippingInspect.title')}
        subtitle={t('quality.shippingInspect.subtitle')}
      />

      {/* MFZ_HOLD red banner */}
      {isMfzHold && (
        <div className="bg-red-600 text-white rounded-lg p-4 flex items-center gap-3">
          <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-bold text-lg">
              {t('quality.shippingInspect.mfzHoldBanner')}
            </p>
            <p className="text-sm text-red-100">
              {t('quality.shippingInspect.mfzHoldMessage')}
            </p>
          </div>
        </div>
      )}

      <div className="card space-y-4">
        {/* LOT selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('quality.shippingInspect.lotId')}
          </label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={lotId}
            onChange={(e) => handleLotChange(e.target.value)}
          >
            <option value="">{t('common.select')}</option>
            <option value="lot-001">ORD-2024-001-L001</option>
            <option value="lot-002">ORD-2024-001-L002 (MFZ_HOLD)</option>
            <option value="lot-003">ORD-2024-002-L001</option>
          </select>
        </div>

        {/* Final gate checks */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            {t('quality.shippingInspect.gateChecks')}
          </p>
          {checks.map((item) => {
            const isMfzCheck = item.key === 'mfzPassed'
            const disabled = isMfzCheck && isMfzHold
            return (
              <label
                key={item.key}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  disabled
                    ? 'bg-red-50 border-red-200 cursor-not-allowed opacity-70'
                    : item.checked
                      ? 'bg-green-50 border-green-300 cursor-pointer'
                      : 'bg-white border-gray-200 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  disabled={disabled}
                  onChange={() => toggleCheck(item.key)}
                  className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 disabled:opacity-50"
                />
                <span className="text-sm text-gray-900">
                  {t(`quality.shippingInspect.checks.${item.key as CheckKey}`)}
                </span>
                {disabled && (
                  <span className="ml-auto text-xs font-medium text-red-600">
                    {t('quality.shippingInspect.blocked')}
                  </span>
                )}
                {item.checked && !disabled && (
                  <span className="ml-auto text-xs font-medium text-green-600">
                    {t('common.checked')}
                  </span>
                )}
              </label>
            )
          })}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          {submitted && (
            <span className="text-sm text-green-600 self-center">
              {t('quality.shippingInspect.submitted')}
            </span>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!lotId || !allChecked || isMfzHold}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('quality.shippingInspect.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
