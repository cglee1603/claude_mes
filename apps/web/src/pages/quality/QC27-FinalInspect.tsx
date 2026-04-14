import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'

interface FinalInspectForm {
  lotId: string
  sampleSize: string
  majorDefects: string
  minorDefects: string
}

const AQL_LEVELS: Record<string, { major: number; minor: number }> = {
  '2.5': { major: 2, minor: 5 },
  '4.0': { major: 3, minor: 7 },
  '6.5': { major: 5, minor: 10 },
}

export function QC27FinalInspectPage() {
  const { t } = useTranslation()

  const [form, setForm] = useState<FinalInspectForm>({
    lotId: '',
    sampleSize: '',
    majorDefects: '0',
    minorDefects: '0',
  })

  const [aqlLevel] = useState<string>('2.5')
  const [submitted, setSubmitted] = useState(false)

  const currentAql = AQL_LEVELS[aqlLevel]
  const majorCount = Number(form.majorDefects) || 0
  const minorCount = Number(form.minorDefects) || 0

  const majorPass = currentAql ? majorCount <= currentAql.major : false
  const minorPass = currentAql ? minorCount <= currentAql.minor : false
  const overallPass = majorPass && minorPass

  const handleFieldChange = useCallback(
    (field: keyof FinalInspectForm, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }))
    },
    [],
  )

  const handleSubmit = useCallback(() => {
    setSubmitted(true)
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('quality.finalInspect.title')}
        subtitle={t('quality.finalInspect.subtitle')}
      />

      <div className="card space-y-4">
        {/* AQL Level display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-800">
            {t('quality.finalInspect.aqlLevel')}: AQL {aqlLevel}
          </p>
          {currentAql && (
            <p className="text-xs text-blue-600 mt-1">
              {t('quality.finalInspect.aqlAcceptance', {
                major: currentAql.major,
                minor: currentAql.minor,
              })}
            </p>
          )}
        </div>

        {/* LOT selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('quality.finalInspect.lotId')}
          </label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={form.lotId}
            onChange={(e) => handleFieldChange('lotId', e.target.value)}
          >
            <option value="">{t('common.select')}</option>
            <option value="lot-001">ORD-2024-001-L001</option>
            <option value="lot-002">ORD-2024-001-L002</option>
            <option value="lot-003">ORD-2024-002-L001</option>
          </select>
        </div>

        {/* Sample size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('quality.finalInspect.sampleSize')}
          </label>
          <input
            type="number"
            min={0}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={form.sampleSize}
            onChange={(e) => handleFieldChange('sampleSize', e.target.value)}
            placeholder="0"
          />
        </div>

        {/* Defects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('quality.finalInspect.majorDefects')}
              <span className="ml-2 text-xs text-gray-400">
                ({t('quality.finalInspect.accept')}: &le; {currentAql?.major ?? '-'})
              </span>
            </label>
            <input
              type="number"
              min={0}
              className={`w-full rounded-md border px-3 py-2 text-sm ${
                !majorPass && majorCount > 0
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300'
              }`}
              value={form.majorDefects}
              onChange={(e) => handleFieldChange('majorDefects', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('quality.finalInspect.minorDefects')}
              <span className="ml-2 text-xs text-gray-400">
                ({t('quality.finalInspect.accept')}: &le; {currentAql?.minor ?? '-'})
              </span>
            </label>
            <input
              type="number"
              min={0}
              className={`w-full rounded-md border px-3 py-2 text-sm ${
                !minorPass && minorCount > 0
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300'
              }`}
              value={form.minorDefects}
              onChange={(e) => handleFieldChange('minorDefects', e.target.value)}
            />
          </div>
        </div>

        {/* Verdict preview */}
        <div
          className={`rounded-lg p-4 text-center ${
            overallPass
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <p
            className={`text-lg font-bold ${
              overallPass ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {overallPass
              ? t('quality.finalInspect.verdictPass')
              : t('quality.finalInspect.verdictFail')}
          </p>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          {submitted && (
            <span className="text-sm text-green-600 self-center">
              {t('quality.finalInspect.submitted')}
            </span>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!form.lotId || !form.sampleSize}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('quality.finalInspect.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
