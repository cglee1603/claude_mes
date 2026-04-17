import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'
import { exportToCsv } from '../../utils/excel'

type ToolStatus = 'RETURNED' | 'OUTSTANDING'
type ToolType = 'SCISSORS' | 'NEEDLE' | 'CUTTER'

interface SharpToolRecord {
  toolNo: string
  toolType: ToolType
  issuedTo: string
  line: string
  issuedAt: string
  returnedAt: string
  status: ToolStatus
}

const MOCK_TOOLS: SharpToolRecord[] = [
  { toolNo: 'SCR-001', toolType: 'SCISSORS', issuedTo: 'Nguyen Van An', line: 'LINE-A', issuedAt: '2026-04-17 08:00', returnedAt: '2026-04-17 17:00', status: 'RETURNED' },
  { toolNo: 'NDL-001', toolType: 'NEEDLE', issuedTo: 'Tran Thi Mai', line: 'LINE-A', issuedAt: '2026-04-17 08:05', returnedAt: '2026-04-17 17:00', status: 'RETURNED' },
  { toolNo: 'CTR-001', toolType: 'CUTTER', issuedTo: 'Le Van Duc', line: 'LINE-B', issuedAt: '2026-04-17 08:10', returnedAt: '2026-04-17 17:00', status: 'RETURNED' },
  { toolNo: 'SCR-002', toolType: 'SCISSORS', issuedTo: 'Pham Thi Huong', line: 'LINE-B', issuedAt: '2026-04-17 08:15', returnedAt: '2026-04-17 17:00', status: 'RETURNED' },
  { toolNo: 'NDL-002', toolType: 'NEEDLE', issuedTo: 'Nguyen Thi Lan', line: 'LINE-C', issuedAt: '2026-04-17 08:20', returnedAt: '', status: 'OUTSTANDING' },
  { toolNo: 'CTR-002', toolType: 'CUTTER', issuedTo: 'Vo Thi Tu', line: 'LINE-C', issuedAt: '2026-04-17 08:25', returnedAt: '', status: 'OUTSTANDING' },
]

const TOOL_TYPE_LABELS: Record<ToolType, string> = {
  SCISSORS: 'Scissors',
  NEEDLE: 'Needle',
  CUTTER: 'Cutter',
}

export function HSW04Page() {
  const { t } = useTranslation()
  const [tools] = useState<SharpToolRecord[]>(MOCK_TOOLS)
  const [form, setForm] = useState({
    toolNo: '',
    toolType: 'SCISSORS' as ToolType,
    issuedTo: '',
    line: '',
  })

  const outstandingCount = tools.filter(t => t.status === 'OUTSTANDING').length

  const columns: Column<SharpToolRecord>[] = [
    { key: 'toolNo', header: t('sewing.sharpTools.toolNo'), width: 100 },
    {
      key: 'toolType',
      header: t('sewing.sharpTools.toolType'),
      width: 90,
      render: (row) => <span>{TOOL_TYPE_LABELS[row.toolType]}</span>,
    },
    { key: 'issuedTo', header: t('sewing.sharpTools.issuedTo'), width: 120 },
    { key: 'line', header: t('sewing.sharpTools.line'), width: 90 },
    { key: 'issuedAt', header: t('sewing.sharpTools.issuedAt'), width: 140 },
    {
      key: 'returnedAt',
      header: t('sewing.sharpTools.returnedAt'),
      width: 140,
      render: (row) => (
        <span className={!row.returnedAt ? 'text-red-500 font-semibold' : 'text-gray-700'}>
          {row.returnedAt || '-'}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('sewing.sharpTools.status'),
      width: 110,
      render: (row) => {
        if (row.status === 'OUTSTANDING') {
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {t('sewing.sharpTools.outstanding')}
            </span>
          )
        }
        return <StatusBadge status="PASSED_QC" label={row.status} />
      },
    },
  ]

  function handleExport() {
    exportToCsv(
      tools.map(r => ({
        [t('sewing.sharpTools.toolNo')]: r.toolNo,
        [t('sewing.sharpTools.toolType')]: TOOL_TYPE_LABELS[r.toolType],
        [t('sewing.sharpTools.issuedTo')]: r.issuedTo,
        [t('sewing.sharpTools.line')]: r.line,
        [t('sewing.sharpTools.issuedAt')]: r.issuedAt,
        [t('sewing.sharpTools.returnedAt')]: r.returnedAt || '-',
        [t('sewing.sharpTools.status')]: r.status,
      })),
      'sharp-tools'
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('sewing.sharpTools.title')} />

      {outstandingCount > 0 && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-700 font-medium">
            {t('sewing.sharpTools.outstanding')}: {outstandingCount} items — Unreturned tools require attention
          </p>
        </div>
      )}

      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">{t('sewing.sharpTools.issue')}</h2>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.sharpTools.toolNo')}</label>
            <input
              className="input w-full"
              value={form.toolNo}
              onChange={e => setForm(p => ({ ...p, toolNo: e.target.value }))}
              placeholder="SCR-XXX"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.sharpTools.toolType')}</label>
            <select
              className="input w-full"
              value={form.toolType}
              onChange={e => setForm(p => ({ ...p, toolType: e.target.value as ToolType }))}
            >
              {Object.entries(TOOL_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.sharpTools.issuedTo')}</label>
            <input
              className="input w-full"
              value={form.issuedTo}
              onChange={e => setForm(p => ({ ...p, issuedTo: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.sharpTools.line')}</label>
            <select
              className="input w-full"
              value={form.line}
              onChange={e => setForm(p => ({ ...p, line: e.target.value }))}
            >
              <option value="">-- Select --</option>
              {['LINE-A', 'LINE-B', 'LINE-C', 'LINE-D'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 flex gap-2 justify-end">
          <button className="btn-secondary text-sm px-4 py-1.5">{t('sewing.sharpTools.returnTool')}</button>
          <button className="btn-primary text-sm px-4 py-1.5">{t('sewing.sharpTools.issue')}</button>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">{t('sewing.sharpTools.title')}</h2>
          <button className="btn-primary text-sm px-3 py-1.5" onClick={handleExport}>
            {t('common.exportExcel')}
          </button>
        </div>
        <MesGrid columns={columns} data={tools} height={300} gridKey="H-SW-04-grid" />
      </div>
    </div>
  )
}
