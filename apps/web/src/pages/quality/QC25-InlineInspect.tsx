import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'

interface DefectEntry {
  id: string
  defectType: string
  count: number
}

interface InlineInspectForm {
  lotId: string
  lineId: string
  inspectedQty: string
  defects: DefectEntry[]
}

const DEFECT_TYPES = [
  'BROKEN_STITCH',
  'SKIP_STITCH',
  'UNEVEN_SEAM',
  'FABRIC_DAMAGE',
  'STAIN',
  'MEASUREMENT_ERROR',
  'PUCKERING',
  'OTHER',
] as const

export function QC25InlineInspectPage() {
  const { t } = useTranslation()

  const [form, setForm] = useState<InlineInspectForm>({
    lotId: '',
    lineId: '',
    inspectedQty: '',
    defects: [],
  })

  const [submitted, setSubmitted] = useState(false)

  const totalDefects = form.defects.reduce((sum, d) => sum + d.count, 0)
  const inspectedQty = Number(form.inspectedQty) || 0
  const dhu = inspectedQty > 0 ? (totalDefects / inspectedQty) * 100 : 0

  const handleFieldChange = useCallback(
    (field: keyof Omit<InlineInspectForm, 'defects'>, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }))
    },
    [],
  )

  const addDefect = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      defects: [
        ...prev.defects,
        { id: crypto.randomUUID(), defectType: DEFECT_TYPES[0], count: 1 },
      ],
    }))
  }, [])

  const updateDefect = useCallback(
    (id: string, field: keyof Omit<DefectEntry, 'id'>, value: string | number) => {
      setForm((prev) => ({
        ...prev,
        defects: prev.defects.map((d) =>
          d.id === id ? { ...d, [field]: value } : d,
        ),
      }))
    },
    [],
  )

  const removeDefect = useCallback((id: string) => {
    setForm((prev) => ({
      ...prev,
      defects: prev.defects.filter((d) => d.id !== id),
    }))
  }, [])

  const handleSubmit = useCallback(() => {
    setSubmitted(true)
    // POST /api/quality/inline-inspect would be called here
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('quality.inlineInspect.title')}
        subtitle={t('quality.inlineInspect.subtitle')}
      />

      <div className="card space-y-4">
        {/* LOT / Line selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('quality.inlineInspect.lotId')}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('quality.inlineInspect.lineId')}
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={form.lineId}
              onChange={(e) => handleFieldChange('lineId', e.target.value)}
            >
              <option value="">{t('common.select')}</option>
              <option value="line-A">Line A</option>
              <option value="line-B">Line B</option>
              <option value="line-C">Line C</option>
              <option value="line-D">Line D</option>
            </select>
          </div>
        </div>

        {/* Inspected quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('quality.inlineInspect.inspectedQty')}
          </label>
          <input
            type="number"
            min={0}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={form.inspectedQty}
            onChange={(e) => handleFieldChange('inspectedQty', e.target.value)}
            placeholder="0"
          />
        </div>

        {/* Defects multi-add */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('quality.inlineInspect.defects')}
            </label>
            <button
              type="button"
              onClick={addDefect}
              className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              + {t('quality.inlineInspect.addDefect')}
            </button>
          </div>

          {form.defects.length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center">
              {t('quality.inlineInspect.noDefects')}
            </p>
          )}

          <div className="space-y-2">
            {form.defects.map((defect) => (
              <div
                key={defect.id}
                className="flex items-center gap-3 bg-gray-50 rounded-md px-3 py-2"
              >
                <select
                  className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
                  value={defect.defectType}
                  onChange={(e) =>
                    updateDefect(defect.id, 'defectType', e.target.value)
                  }
                >
                  {DEFECT_TYPES.map((dt) => (
                    <option key={dt} value={dt}>
                      {t(`quality.defectTypes.${dt}`)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm text-right"
                  value={defect.count}
                  onChange={(e) =>
                    updateDefect(defect.id, 'count', Number(e.target.value))
                  }
                />
                <button
                  type="button"
                  onClick={() => removeDefect(defect.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  {t('common.remove')}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Auto-calc DHU */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500">{t('quality.inlineInspect.totalDefects')}</p>
              <p className="text-xl font-bold text-gray-900">{totalDefects}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">{t('quality.inlineInspect.inspectedQty')}</p>
              <p className="text-xl font-bold text-gray-900">{inspectedQty}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">{t('quality.inlineInspect.dhuPercent')}</p>
              <p
                className={`text-xl font-bold ${
                  dhu > 3 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {dhu.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          {submitted && (
            <span className="text-sm text-green-600 self-center">
              {t('quality.inlineInspect.submitted')}
            </span>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!form.lotId || !form.lineId || inspectedQty <= 0}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('quality.inlineInspect.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
