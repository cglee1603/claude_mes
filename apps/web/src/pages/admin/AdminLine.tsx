import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader, MesGrid, StatusBadge } from '@/components/common'
import type { Column } from '@/components/common'

interface ProductionLine {
  id: string
  lineCode: string
  lineName: string
  factory: string
  capacity: number
  workerCount: number
  isActive: boolean
}

const mockLines: ProductionLine[] = [
  { id: 'L001', lineCode: 'LINE-A', lineName: 'A Line (T-Shirt)', factory: 'Factory 2', capacity: 1200, workerCount: 32, isActive: true },
  { id: 'L002', lineCode: 'LINE-B', lineName: 'B Line (Polo)', factory: 'Factory 2', capacity: 1000, workerCount: 28, isActive: true },
  { id: 'L003', lineCode: 'LINE-C', lineName: 'C Line (Jacket)', factory: 'Factory 2', capacity: 800, workerCount: 35, isActive: true },
  { id: 'L004', lineCode: 'LINE-D', lineName: 'D Line (Pants)', factory: 'Factory 2', capacity: 900, workerCount: 30, isActive: true },
  { id: 'L005', lineCode: 'LINE-E', lineName: 'E Line (Dress)', factory: 'Factory 3', capacity: 700, workerCount: 25, isActive: true },
  { id: 'L006', lineCode: 'LINE-F', lineName: 'F Line (Sample)', factory: 'Factory 3', capacity: 300, workerCount: 12, isActive: false },
]

interface ModalState {
  open: boolean
  mode: 'add' | 'edit'
  line: ProductionLine | null
}

export function AdminLinePage() {
  const { t } = useTranslation()
  const [modal, setModal] = useState<ModalState>({ open: false, mode: 'add', line: null })

  const columns: Column<ProductionLine>[] = [
    { key: 'lineCode', header: t('admin.line.lineCode') },
    { key: 'lineName', header: t('admin.line.lineName') },
    { key: 'factory', header: t('admin.line.factory') },
    {
      key: 'capacity',
      header: t('admin.line.capacity'),
      render: (row) => <span>{row.capacity.toLocaleString()}</span>,
    },
    {
      key: 'workerCount',
      header: t('admin.line.workerCount'),
      render: (row) => <span>{row.workerCount}</span>,
    },
    {
      key: 'isActive',
      header: t('admin.line.isActive'),
      render: (row) => (
        <StatusBadge
          status={row.isActive ? 'ACTIVE' : 'ARCHIVED'}
          label={row.isActive ? t('status.ACTIVE') : t('admin.line.inactive')}
        />
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setModal({ open: true, mode: 'edit', line: row })}
            className="text-blue-600 hover:underline text-sm"
          >
            {t('common.edit')}
          </button>
          <button
            type="button"
            className="text-red-600 hover:underline text-sm"
          >
            {t('common.delete')}
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.line.title')}
        subtitle={t('admin.line.subtitle')}
        actions={
          <button
            type="button"
            onClick={() => setModal({ open: true, mode: 'add', line: null })}
            className="btn-primary"
          >
            {t('admin.line.addLine')}
          </button>
        }
      />

      <div className="card">
        <MesGrid<ProductionLine>
          columns={columns}
          data={mockLines}
        />
      </div>

      {/* Add/Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {modal.mode === 'add' ? t('admin.line.addLine') : t('admin.line.editLine')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.line.lineCode')}
                </label>
                <input
                  type="text"
                  className="input w-full"
                  defaultValue={modal.line?.lineCode ?? ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.line.lineName')}
                </label>
                <input
                  type="text"
                  className="input w-full"
                  defaultValue={modal.line?.lineName ?? ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.line.factory')}
                </label>
                <select className="input w-full" defaultValue={modal.line?.factory ?? 'Factory 2'}>
                  <option value="Factory 2">Factory 2</option>
                  <option value="Factory 3">Factory 3</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.line.capacity')}
                  </label>
                  <input
                    type="number"
                    className="input w-full"
                    defaultValue={modal.line?.capacity ?? 0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.line.workerCount')}
                  </label>
                  <input
                    type="number"
                    className="input w-full"
                    defaultValue={modal.line?.workerCount ?? 0}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  defaultChecked={modal.line?.isActive ?? true}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  {t('admin.line.isActive')}
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setModal({ open: false, mode: 'add', line: null })}
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
