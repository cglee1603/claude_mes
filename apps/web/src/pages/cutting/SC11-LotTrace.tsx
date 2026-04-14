import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common'

interface TraceStep {
  key: string
  labelKey: string
  status: 'completed' | 'current' | 'pending'
  timestamp: string | null
}

interface LotTraceData {
  lotNo: string
  currentStep: number
  steps: TraceStep[]
}

const STEP_KEYS = [
  'cutting',
  'readyForSew',
  'sewn',
  'qc',
  'passedQc',
  'readyPack',
  'shipped',
] as const

function buildTrace(lotNo: string, currentStepIndex: number): LotTraceData {
  const timestamps = [
    '2026-04-01 08:30',
    '2026-04-02 14:00',
    '2026-04-03 09:15',
    '2026-04-05 11:00',
    '2026-04-05 16:30',
    '2026-04-06 10:00',
    '2026-04-07 14:00',
  ]

  const steps: TraceStep[] = STEP_KEYS.map((key, idx) => ({
    key,
    labelKey: `cutting.lotTrace.step.${key}`,
    status: idx < currentStepIndex ? 'completed' : idx === currentStepIndex ? 'current' : 'pending',
    timestamp: idx <= currentStepIndex ? timestamps[idx] : null,
  }))

  return { lotNo, currentStep: currentStepIndex, steps }
}

interface LotOption {
  lotNo: string
  currentStepIndex: number
}

const LOT_OPTIONS: LotOption[] = [
  { lotNo: 'ORD-2026-001-L001', currentStepIndex: 6 },
  { lotNo: 'ORD-2026-002-L001', currentStepIndex: 4 },
  { lotNo: 'ORD-2026-003-L001', currentStepIndex: 2 },
  { lotNo: 'ORD-2026-003-L003', currentStepIndex: 0 },
]

export function SC11LotTracePage() {
  const { t } = useTranslation()
  const [selectedLotNo, setSelectedLotNo] = useState(LOT_OPTIONS[1].lotNo)

  const selectedOption = LOT_OPTIONS.find((o) => o.lotNo === selectedLotNo)
  const traceData = selectedOption
    ? buildTrace(selectedOption.lotNo, selectedOption.currentStepIndex)
    : null

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('cutting.lotTrace.title')}
        subtitle={t('cutting.lotTrace.subtitle')}
      />

      {/* LOT selector */}
      <div className="card max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('common.lotNo')}
        </label>
        <select
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={selectedLotNo}
          onChange={(e) => setSelectedLotNo(e.target.value)}
        >
          {LOT_OPTIONS.map((opt) => (
            <option key={opt.lotNo} value={opt.lotNo}>
              {opt.lotNo}
            </option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      {traceData && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {t('cutting.lotTrace.timeline')}
          </h3>

          <div className="relative">
            {traceData.steps.map((step, idx) => {
              const isLast = idx === traceData.steps.length - 1

              return (
                <div key={step.key} className="flex items-start gap-4 relative">
                  {/* Vertical line */}
                  {!isLast && (
                    <div
                      className={`absolute left-[15px] top-[32px] w-0.5 h-[calc(100%-8px)] ${
                        step.status === 'completed' ? 'bg-green-400' : 'bg-gray-200'
                      }`}
                    />
                  )}

                  {/* Circle indicator */}
                  <div className="flex-shrink-0 relative z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        step.status === 'completed'
                          ? 'bg-green-500 text-white'
                          : step.status === 'current'
                            ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                            : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {step.status === 'completed' ? '\u2713' : idx + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`pb-8 ${isLast ? 'pb-0' : ''}`}>
                    <p
                      className={`text-sm font-medium ${
                        step.status === 'current'
                          ? 'text-blue-700'
                          : step.status === 'completed'
                            ? 'text-gray-900'
                            : 'text-gray-400'
                      }`}
                    >
                      {t(step.labelKey)}
                      {step.status === 'current' && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {t('cutting.lotTrace.current')}
                        </span>
                      )}
                    </p>
                    {step.timestamp && (
                      <p className="text-xs text-gray-500 mt-0.5">{step.timestamp}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
