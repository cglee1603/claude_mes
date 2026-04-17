import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader, MesGrid } from '@/components/common'
import type { Column } from '@/components/common'

interface QCConfig {
  id: string
  buyerCode: string
  dhuThreshold: number
  aqlLevel: string
  inspectionLevel: string
  ftpThreshold: number
  updatedAt: string
}

const MOCK_QC_CONFIGS: QCConfig[] = [
  { id: 'c1', buyerCode: 'NIKE', dhuThreshold: 3.0, aqlLevel: '2.5', inspectionLevel: 'Level II', ftpThreshold: 2.5, updatedAt: '2026-03-15' },
  { id: 'c2', buyerCode: 'ZARA', dhuThreshold: 4.0, aqlLevel: '4.0', inspectionLevel: 'Level I', ftpThreshold: 3.0, updatedAt: '2026-03-10' },
  { id: 'c3', buyerCode: 'H&M', dhuThreshold: 3.5, aqlLevel: '2.5', inspectionLevel: 'Level II', ftpThreshold: 3.0, updatedAt: '2026-02-28' },
  { id: 'c4', buyerCode: 'GAP', dhuThreshold: 2.5, aqlLevel: '1.5', inspectionLevel: 'Level III', ftpThreshold: 2.0, updatedAt: '2026-02-20' },
]

interface ModalState {
  open: boolean
  config: QCConfig | null
}

export function AdminQCConfigPage() {
  const { t } = useTranslation()
  const [modal, setModal] = useState<ModalState>({ open: false, config: null })
  const [form, setForm] = useState<Partial<QCConfig>>({})

  function openEdit(config: QCConfig) {
    setForm({ ...config })
    setModal({ open: true, config })
  }

  const columns: Column<QCConfig>[] = [
    { key: 'buyerCode', header: t('admin.qcConfig.buyerCode') },
    {
      key: 'dhuThreshold',
      header: t('admin.qcConfig.dhuThreshold'),
      render: (row) => (
        <span className="font-semibold text-blue-700">{row.dhuThreshold.toFixed(1)}%</span>
      ),
    },
    {
      key: 'ftpThreshold',
      header: t('admin.qcConfig.ftpThreshold'),
      render: (row) => <span>{row.ftpThreshold.toFixed(1)}%</span>,
    },
    { key: 'aqlLevel', header: t('admin.qcConfig.aqlLevel'), render: (row) => <span>AQL {row.aqlLevel}</span> },
    { key: 'inspectionLevel', header: t('admin.qcConfig.inspectionLevel') },
    { key: 'updatedAt', header: t('admin.qcConfig.updatedAt') },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          type="button"
          onClick={() => openEdit(row)}
          className="text-blue-600 hover:underline text-sm"
        >
          {t('common.edit')}
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.qcConfig.title')}
        subtitle={t('admin.qcConfig.subtitle')}
      />

      {/* Note about C-1 */}
      <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        {t('admin.qcConfig.c1Note')}
      </div>

      <div className="card">
        <MesGrid<QCConfig>
          columns={columns}
          data={MOCK_QC_CONFIGS}
        />
      </div>

      {/* Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('admin.qcConfig.editTitle', { buyer: modal.config?.buyerCode })}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.qcConfig.dhuThreshold')} (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  className="input w-full"
                  value={form.dhuThreshold ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, dhuThreshold: Number(e.target.value) }))}
                />
                <p className="text-xs text-gray-500 mt-1">{t('admin.qcConfig.c1FieldNote')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.qcConfig.ftpThreshold')} (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  className="input w-full"
                  value={form.ftpThreshold ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, ftpThreshold: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.qcConfig.aqlLevel')}
                </label>
                <select
                  className="input w-full"
                  value={form.aqlLevel ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, aqlLevel: e.target.value }))}
                >
                  <option value="1.5">AQL 1.5</option>
                  <option value="2.5">AQL 2.5</option>
                  <option value="4.0">AQL 4.0</option>
                  <option value="6.5">AQL 6.5</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.qcConfig.inspectionLevel')}
                </label>
                <select
                  className="input w-full"
                  value={form.inspectionLevel ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, inspectionLevel: e.target.value }))}
                >
                  <option value="Level I">{t('admin.qcConfig.levelSimple')}</option>
                  <option value="Level II">{t('admin.qcConfig.levelStandard')}</option>
                  <option value="Level III">{t('admin.qcConfig.levelStrict')}</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setModal({ open: false, config: null })}
                className="btn-secondary"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() => setModal({ open: false, config: null })}
                className="btn-primary"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
