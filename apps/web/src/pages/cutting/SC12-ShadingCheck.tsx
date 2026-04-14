import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common'

type RiskLevel = 'safe' | 'warning' | 'danger'

interface ShadingLot {
  id: string
  lotNo: string
  colorCode: string
  rollA: { rollNo: string; hexColor: string }
  rollB: { rollNo: string; hexColor: string }
  riskLevel: RiskLevel
  deltaE: number
}

const MOCK_SHADING_DATA: ShadingLot[] = [
  {
    id: 'sh-1',
    lotNo: 'ORD-2026-001-L001',
    colorCode: 'BLK-001',
    rollA: { rollNo: 'R-2026-0001', hexColor: '#1a1a1a' },
    rollB: { rollNo: 'R-2026-0002', hexColor: '#1f1f1f' },
    riskLevel: 'safe',
    deltaE: 0.8,
  },
  {
    id: 'sh-2',
    lotNo: 'ORD-2026-002-L001',
    colorCode: 'RED-001',
    rollA: { rollNo: 'R-2026-0010', hexColor: '#c41e3a' },
    rollB: { rollNo: 'R-2026-0011', hexColor: '#b5172f' },
    riskLevel: 'warning',
    deltaE: 2.4,
  },
  {
    id: 'sh-3',
    lotNo: 'ORD-2026-003-L001',
    colorCode: 'NVY-003',
    rollA: { rollNo: 'R-2026-0020', hexColor: '#1b2a4a' },
    rollB: { rollNo: 'R-2026-0021', hexColor: '#2d4a7a' },
    riskLevel: 'danger',
    deltaE: 5.1,
  },
]

function getRiskBadge(riskLevel: RiskLevel, t: (key: string) => string) {
  const config: Record<RiskLevel, { bg: string; text: string; labelKey: string }> = {
    safe: { bg: 'bg-green-100', text: 'text-green-800', labelKey: 'cutting.shadingCheck.safe' },
    warning: { bg: 'bg-yellow-100', text: 'text-yellow-800', labelKey: 'cutting.shadingCheck.warning' },
    danger: { bg: 'bg-red-100', text: 'text-red-800', labelKey: 'cutting.shadingCheck.danger' },
  }
  const c = config[riskLevel]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {t(c.labelKey)}
    </span>
  )
}

function getRiskIcon(riskLevel: RiskLevel): string {
  const icons: Record<RiskLevel, string> = {
    safe: '\u2705',
    warning: '\u26A0\uFE0F',
    danger: '\u274C',
  }
  return icons[riskLevel]
}

export function SC12ShadingCheckPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('cutting.shadingCheck.title')}
        subtitle={t('cutting.shadingCheck.subtitle')}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {MOCK_SHADING_DATA.map((item) => (
          <div
            key={item.id}
            className={`card border-2 ${
              item.riskLevel === 'danger'
                ? 'border-red-300'
                : item.riskLevel === 'warning'
                  ? 'border-yellow-300'
                  : 'border-green-200'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-mono font-semibold text-gray-900">{item.lotNo}</p>
                <p className="text-xs text-gray-500">{item.colorCode}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{getRiskIcon(item.riskLevel)}</span>
                {getRiskBadge(item.riskLevel, t)}
              </div>
            </div>

            {/* Color Swatches side-by-side */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 text-center">
                <p className="text-xs text-gray-500 mb-1">{t('cutting.shadingCheck.rollA')}</p>
                <div
                  className="w-full h-20 rounded-lg border border-gray-300"
                  style={{ backgroundColor: item.rollA.hexColor }}
                />
                <p className="text-xs text-gray-500 mt-1">{item.rollA.rollNo}</p>
              </div>
              <div className="flex-1 text-center">
                <p className="text-xs text-gray-500 mb-1">{t('cutting.shadingCheck.rollB')}</p>
                <div
                  className="w-full h-20 rounded-lg border border-gray-300"
                  style={{ backgroundColor: item.rollB.hexColor }}
                />
                <p className="text-xs text-gray-500 mt-1">{item.rollB.rollNo}</p>
              </div>
            </div>

            {/* Delta E */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Delta E: <span className="font-semibold text-gray-900">{item.deltaE.toFixed(1)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="card">
        <h4 className="text-sm font-medium text-gray-700 mb-3">{t('cutting.shadingCheck.riskLevel')}</h4>
        <div className="flex items-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span>{t('cutting.shadingCheck.safe')} (Delta E &lt; 1.5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
            <span>{t('cutting.shadingCheck.warning')} (1.5 ~ 3.0)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span>{t('cutting.shadingCheck.danger')} (Delta E &gt; 3.0)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
