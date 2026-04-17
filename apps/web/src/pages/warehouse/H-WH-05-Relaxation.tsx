import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'
import { exportToCsv } from '../../utils/excel'

type MaterialType = 'COTTON' | 'LINEN' | 'POLY' | 'WOOL'

const RELAXATION_HOURS: Record<MaterialType, number> = {
  COTTON: 48,
  LINEN: 48,
  POLY: 24,
  WOOL: 72,
}

interface RelaxationForm {
  rollNo: string
  materialType: MaterialType | ''
  startTime: string
}

interface RelaxationRow {
  id: string
  rollNo: string
  materialType: string
  startTime: string
  targetTime: string
  progress: number
  status: string
}

const MOCK_IN_PROGRESS: RelaxationRow[] = [
  { id: '1', rollNo: 'ROLL-2026-003', materialType: 'COTTON', startTime: '2026-04-13 08:00', targetTime: '2026-04-15 08:00', progress: 95, status: 'IN_PROGRESS' },
  { id: '2', rollNo: 'ROLL-2026-004', materialType: 'WOOL', startTime: '2026-04-13 10:00', targetTime: '2026-04-16 10:00', progress: 60, status: 'IN_PROGRESS' },
  { id: '3', rollNo: 'ROLL-2026-006', materialType: 'POLY', startTime: '2026-04-14 14:00', targetTime: '2026-04-15 14:00', progress: 50, status: 'IN_PROGRESS' },
  { id: '4', rollNo: 'ROLL-2026-007', materialType: 'COTTON', startTime: '2026-04-14 09:00', targetTime: '2026-04-16 09:00', progress: 30, status: 'IN_PROGRESS' },
]

const MOCK_COMPLETED: RelaxationRow[] = [
  { id: '5', rollNo: 'ROLL-2026-001', materialType: 'COTTON', startTime: '2026-04-11 08:00', targetTime: '2026-04-13 08:00', progress: 100, status: 'COMPLETED' },
  { id: '6', rollNo: 'ROLL-2026-002', materialType: 'POLY', startTime: '2026-04-12 10:00', targetTime: '2026-04-13 10:00', progress: 100, status: 'COMPLETED' },
]

const INITIAL_FORM: RelaxationForm = { rollNo: '', materialType: '', startTime: '' }

const MATERIAL_OPTIONS: MaterialType[] = ['COTTON', 'LINEN', 'POLY', 'WOOL']

export function HWH05Page() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'inProgress' | 'completed'>('inProgress')
  const [form, setForm] = useState<RelaxationForm>(INITIAL_FORM)

  const handleChange = (field: keyof RelaxationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setForm(INITIAL_FORM)
  }

  const tableData = tab === 'inProgress' ? MOCK_IN_PROGRESS : MOCK_COMPLETED

  const columns: Column<RelaxationRow>[] = [
    { key: 'rollNo', header: t('warehouse.relaxation.rollNo'), width: 140 },
    { key: 'materialType', header: t('warehouse.relaxation.materialType'), width: 110 },
    { key: 'startTime', header: t('warehouse.relaxation.startTime'), width: 150 },
    { key: 'targetTime', header: t('warehouse.relaxation.targetTime'), width: 150 },
    {
      key: 'progress',
      header: t('warehouse.relaxation.progress'),
      width: 130,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${row.progress >= 95 && row.status !== 'COMPLETED' ? 'bg-yellow-400' : row.status === 'COMPLETED' ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${row.progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-600 w-8">{row.progress}%</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: t('warehouse.relaxation.status'),
      width: 110,
      render: (row) => (
        <StatusBadge
          status={row.status === 'COMPLETED' ? 'PASSED_QC' : 'QC'}
          label={row.status === 'COMPLETED' ? t('warehouse.relaxation.completed') : t('warehouse.relaxation.inProgress')}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('warehouse.relaxation.title')} subtitle="" />

      <div className="card">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">{t('warehouse.relaxation.rollNo')}</label>
            <input type="text" className="input-field" value={form.rollNo} onChange={(e) => handleChange('rollNo', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('warehouse.relaxation.materialType')}</label>
            <select className="input-field" value={form.materialType} onChange={(e) => handleChange('materialType', e.target.value)}>
              <option value="">{t('common.select')}</option>
              {MATERIAL_OPTIONS.map((m) => (
                <option key={m} value={m}>{m} ({RELAXATION_HOURS[m]}h)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t('warehouse.relaxation.startTime')}</label>
            <input type="datetime-local" className="input-field" value={form.startTime} onChange={(e) => handleChange('startTime', e.target.value)} />
          </div>
          <div className="md:col-span-3 flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setForm(INITIAL_FORM)}>{t('common.reset')}</button>
            <button type="submit" className="btn-primary">{t('warehouse.relaxation.startRelaxation')}</button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              className={`px-4 py-1.5 rounded text-sm font-medium ${tab === 'inProgress' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setTab('inProgress')}
            >
              {t('warehouse.relaxation.inProgress')}
            </button>
            <button
              className={`px-4 py-1.5 rounded text-sm font-medium ${tab === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setTab('completed')}
            >
              {t('warehouse.relaxation.completed')}
            </button>
          </div>
          <button className="btn-secondary text-sm" onClick={() => exportToCsv(tableData, 'relaxation')}>
            {t('common.exportExcel')}
          </button>
        </div>
        <MesGrid<RelaxationRow> columns={columns} data={tableData} gridKey="HWH05-grid" />
      </div>
    </div>
  )
}
