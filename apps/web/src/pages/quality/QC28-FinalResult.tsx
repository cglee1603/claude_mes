import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, type Column } from '@/components/common/DataTable'

type Verdict = 'PASS' | 'FAIL'

interface FinalResult {
  id: string
  lotNo: string
  sampleSize: number
  majorDefects: number
  minorDefects: number
  aqlLevel: string
  verdict: Verdict
  inspectedAt: string
}

const MOCK_RESULTS: FinalResult[] = [
  { id: '1', lotNo: 'ORD-2024-001-L001', sampleSize: 50, majorDefects: 1, minorDefects: 2, aqlLevel: '2.5', verdict: 'PASS', inspectedAt: '2026-04-10 08:30' },
  { id: '2', lotNo: 'ORD-2024-001-L002', sampleSize: 50, majorDefects: 4, minorDefects: 3, aqlLevel: '2.5', verdict: 'FAIL', inspectedAt: '2026-04-10 09:00' },
  { id: '3', lotNo: 'ORD-2024-001-L003', sampleSize: 80, majorDefects: 0, minorDefects: 1, aqlLevel: '2.5', verdict: 'PASS', inspectedAt: '2026-04-10 09:30' },
  { id: '4', lotNo: 'ORD-2024-002-L001', sampleSize: 50, majorDefects: 2, minorDefects: 6, aqlLevel: '4.0', verdict: 'PASS', inspectedAt: '2026-04-10 10:00' },
  { id: '5', lotNo: 'ORD-2024-002-L002', sampleSize: 80, majorDefects: 3, minorDefects: 9, aqlLevel: '2.5', verdict: 'FAIL', inspectedAt: '2026-04-10 10:30' },
  { id: '6', lotNo: 'ORD-2024-002-L003', sampleSize: 50, majorDefects: 0, minorDefects: 4, aqlLevel: '4.0', verdict: 'PASS', inspectedAt: '2026-04-10 11:00' },
  { id: '7', lotNo: 'ORD-2024-003-L001', sampleSize: 80, majorDefects: 1, minorDefects: 3, aqlLevel: '2.5', verdict: 'PASS', inspectedAt: '2026-04-10 13:00' },
  { id: '8', lotNo: 'ORD-2024-003-L002', sampleSize: 50, majorDefects: 5, minorDefects: 8, aqlLevel: '2.5', verdict: 'FAIL', inspectedAt: '2026-04-10 14:00' },
]

export function QC28FinalResultPage() {
  const { t } = useTranslation()

  const passCount = MOCK_RESULTS.filter((r) => r.verdict === 'PASS').length
  const failCount = MOCK_RESULTS.filter((r) => r.verdict === 'FAIL').length
  const overallVerdict: Verdict = failCount === 0 ? 'PASS' : 'FAIL'

  const columns: Column<FinalResult>[] = [
    { key: 'lotNo', header: t('quality.finalResult.lotNo') },
    {
      key: 'sampleSize',
      header: t('quality.finalResult.sampleSize'),
      className: 'text-right',
    },
    {
      key: 'majorDefects',
      header: t('quality.finalResult.majorDefects'),
      className: 'text-right',
      render: (row) => (
        <span className={row.verdict === 'FAIL' ? 'text-red-600 font-medium' : ''}>
          {row.majorDefects}
        </span>
      ),
    },
    {
      key: 'minorDefects',
      header: t('quality.finalResult.minorDefects'),
      className: 'text-right',
      render: (row) => (
        <span className={row.verdict === 'FAIL' ? 'text-red-600 font-medium' : ''}>
          {row.minorDefects}
        </span>
      ),
    },
    { key: 'aqlLevel', header: t('quality.finalResult.aqlLevel'), className: 'text-center' },
    {
      key: 'verdict',
      header: t('quality.finalResult.verdict'),
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.verdict === 'PASS'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.verdict}
        </span>
      ),
    },
    { key: 'inspectedAt', header: t('quality.finalResult.inspectedAt') },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('quality.finalResult.title')}
        subtitle={t('quality.finalResult.subtitle')}
      />

      {/* Large verdict badge */}
      <div
        className={`rounded-xl p-8 text-center ${
          overallVerdict === 'PASS'
            ? 'bg-green-50 border-2 border-green-300'
            : 'bg-red-50 border-2 border-red-300'
        }`}
      >
        <p
          className={`text-4xl font-extrabold ${
            overallVerdict === 'PASS' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {overallVerdict}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {t('quality.finalResult.summary', { pass: passCount, fail: failCount })}
        </p>
      </div>

      {/* Summary table */}
      <div className="card">
        <DataTable<FinalResult>
          columns={columns}
          data={MOCK_RESULTS}
          keyField="id"
        />
      </div>
    </div>
  )
}
