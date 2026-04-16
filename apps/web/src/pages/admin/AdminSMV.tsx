import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader, MesGrid } from '@/components/common'
import type { Column } from '@/components/common'

interface SmvEntry {
  id: string
  styleCode: string
  operationName: string
  smvValue: number
  updatedBy: string
  updatedAt: string
}

const mockSmv: SmvEntry[] = [
  { id: 'S001', styleCode: 'NK-SS26-001', operationName: 'Collar Attach', smvValue: 1.25, updatedBy: 'IE-Kim', updatedAt: '2026-03-01' },
  { id: 'S002', styleCode: 'NK-SS26-001', operationName: 'Side Seam', smvValue: 0.85, updatedBy: 'IE-Kim', updatedAt: '2026-03-01' },
  { id: 'S003', styleCode: 'NK-SS26-001', operationName: 'Hem Bottom', smvValue: 0.65, updatedBy: 'IE-Kim', updatedAt: '2026-03-01' },
  { id: 'S004', styleCode: 'ZR-FW26-010', operationName: 'Pocket Set', smvValue: 1.80, updatedBy: 'IE-Park', updatedAt: '2026-03-05' },
  { id: 'S005', styleCode: 'ZR-FW26-010', operationName: 'Zip Attach', smvValue: 2.10, updatedBy: 'IE-Park', updatedAt: '2026-03-05' },
  { id: 'S006', styleCode: 'HM-BS26-005', operationName: 'Sleeve Set', smvValue: 1.45, updatedBy: 'IE-Lee', updatedAt: '2026-03-10' },
  { id: 'S007', styleCode: 'HM-BS26-005', operationName: 'Cuff Attach', smvValue: 0.95, updatedBy: 'IE-Lee', updatedAt: '2026-03-10' },
  { id: 'S008', styleCode: 'UQ-UT26-003', operationName: 'Neck Bind', smvValue: 0.70, updatedBy: 'IE-Kim', updatedAt: '2026-03-15' },
  { id: 'S009', styleCode: 'UQ-UT26-003', operationName: 'Label Attach', smvValue: 0.35, updatedBy: 'IE-Kim', updatedAt: '2026-03-15' },
  { id: 'S010', styleCode: 'NK-SS26-008', operationName: 'Shoulder Seam', smvValue: 0.90, updatedBy: 'IE-Park', updatedAt: '2026-03-20' },
]

interface ModalState {
  open: boolean
  mode: 'add' | 'edit'
  entry: SmvEntry | null
}

export function AdminSMVPage() {
  const { t } = useTranslation()
  const [modal, setModal] = useState<ModalState>({ open: false, mode: 'add', entry: null })

  const columns: Column<SmvEntry>[] = [
    { key: 'styleCode', header: t('admin.smv.styleCode') },
    { key: 'operationName', header: t('admin.smv.operation') },
    {
      key: 'smvValue',
      header: t('admin.smv.smvValue'),
      render: (row) => (
        <span className="font-mono font-semibold">{row.smvValue.toFixed(2)}</span>
      ),
    },
    { key: 'updatedBy', header: t('admin.smv.updatedBy') },
    { key: 'updatedAt', header: t('admin.smv.updatedAt') },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setModal({ open: true, mode: 'edit', entry: row })}
            className="text-blue-600 hover:underline text-sm"
          >
            {t('common.edit')}
          </button>
          <button type="button" className="text-red-600 hover:underline text-sm">
            {t('common.delete')}
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.smv.title')}
        subtitle={t('admin.smv.subtitle')}
        actions={
          <button
            type="button"
            onClick={() => setModal({ open: true, mode: 'add', entry: null })}
            className="btn-primary"
          >
            {t('admin.smv.addSmv')}
          </button>
        }
      />

      <div className="card">
        <MesGrid<SmvEntry>
          columns={columns}
          data={mockSmv}
        />
      </div>

      {/* Add/Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {modal.mode === 'add' ? t('admin.smv.addSmv') : t('admin.smv.editSmv')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.smv.styleCode')}
                </label>
                <input type="text" className="input w-full" defaultValue={modal.entry?.styleCode ?? ''} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.smv.operation')}
                </label>
                <input type="text" className="input w-full" defaultValue={modal.entry?.operationName ?? ''} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.smv.smvValue')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="input w-full"
                  defaultValue={modal.entry?.smvValue ?? 0}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setModal({ open: false, mode: 'add', entry: null })}
                className="btn-secondary"
              >
                {t('common.cancel')}
              </button>
              <button type="button" className="btn-primary">
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
