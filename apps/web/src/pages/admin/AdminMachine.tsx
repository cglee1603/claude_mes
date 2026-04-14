import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader, DataTable, StatusBadge } from '@/components/common'
import type { Column } from '@/components/common'

interface SewMachine {
  id: string
  machineCode: string
  machineType: string
  brand: string
  lineId: string
  lineCode: string
  serialNo: string
  status: string
  lastMaintenance: string
  isActive: boolean
}

const mockMachines: SewMachine[] = [
  { id: 'M001', machineCode: 'JK-001', machineType: 'Lockstitch', brand: 'JUKI', lineId: 'L001', lineCode: 'LINE-A', serialNo: 'JK-DDL-8700-001', status: 'RUNNING', lastMaintenance: '2026-03-15', isActive: true },
  { id: 'M002', machineCode: 'JK-002', machineType: 'Lockstitch', brand: 'JUKI', lineId: 'L001', lineCode: 'LINE-A', serialNo: 'JK-DDL-8700-002', status: 'RUNNING', lastMaintenance: '2026-03-15', isActive: true },
  { id: 'M003', machineCode: 'BR-001', machineType: 'Overlock', brand: 'BROTHER', lineId: 'L001', lineCode: 'LINE-A', serialNo: 'BR-N31-001', status: 'IDLE', lastMaintenance: '2026-03-20', isActive: true },
  { id: 'M004', machineCode: 'JK-003', machineType: 'Coverstitch', brand: 'JUKI', lineId: 'L002', lineCode: 'LINE-B', serialNo: 'JK-MF-7523-001', status: 'RUNNING', lastMaintenance: '2026-03-10', isActive: true },
  { id: 'M005', machineCode: 'BR-002', machineType: 'Lockstitch', brand: 'BROTHER', lineId: 'L002', lineCode: 'LINE-B', serialNo: 'BR-S7200C-001', status: 'MAINTENANCE', lastMaintenance: '2026-04-08', isActive: true },
  { id: 'M006', machineCode: 'JK-004', machineType: 'Bartack', brand: 'JUKI', lineId: 'L002', lineCode: 'LINE-B', serialNo: 'JK-LK-1900B-001', status: 'RUNNING', lastMaintenance: '2026-02-28', isActive: true },
  { id: 'M007', machineCode: 'PG-001', machineType: 'Flatlock', brand: 'PEGASUS', lineId: 'L003', lineCode: 'LINE-C', serialNo: 'PG-W664-001', status: 'RUNNING', lastMaintenance: '2026-03-25', isActive: true },
  { id: 'M008', machineCode: 'JK-005', machineType: 'Lockstitch', brand: 'JUKI', lineId: 'L003', lineCode: 'LINE-C', serialNo: 'JK-DDL-8700-003', status: 'RUNNING', lastMaintenance: '2026-03-18', isActive: true },
  { id: 'M009', machineCode: 'BR-003', machineType: 'Overlock', brand: 'BROTHER', lineId: 'L003', lineCode: 'LINE-C', serialNo: 'BR-N31-002', status: 'IDLE', lastMaintenance: '2026-03-22', isActive: true },
  { id: 'M010', machineCode: 'JK-006', machineType: 'Buttonhole', brand: 'JUKI', lineId: 'L004', lineCode: 'LINE-D', serialNo: 'JK-LBH-1790-001', status: 'RUNNING', lastMaintenance: '2026-03-12', isActive: true },
  { id: 'M011', machineCode: 'JK-007', machineType: 'Lockstitch', brand: 'JUKI', lineId: 'L004', lineCode: 'LINE-D', serialNo: 'JK-DDL-8700-004', status: 'RUNNING', lastMaintenance: '2026-03-14', isActive: true },
  { id: 'M012', machineCode: 'PG-002', machineType: 'Interlock', brand: 'PEGASUS', lineId: 'L004', lineCode: 'LINE-D', serialNo: 'PG-W562-001', status: 'IDLE', lastMaintenance: '2026-04-01', isActive: true },
  { id: 'M013', machineCode: 'BR-004', machineType: 'Coverstitch', brand: 'BROTHER', lineId: 'L005', lineCode: 'LINE-E', serialNo: 'BR-CV3550-001', status: 'RUNNING', lastMaintenance: '2026-03-28', isActive: true },
  { id: 'M014', machineCode: 'JK-008', machineType: 'Lockstitch', brand: 'JUKI', lineId: 'L005', lineCode: 'LINE-E', serialNo: 'JK-DDL-8700-005', status: 'RUNNING', lastMaintenance: '2026-03-30', isActive: true },
  { id: 'M015', machineCode: 'JK-009', machineType: 'Lockstitch', brand: 'JUKI', lineId: 'L006', lineCode: 'LINE-F', serialNo: 'JK-DDL-8700-006', status: 'STOPPED', lastMaintenance: '2026-02-15', isActive: false },
]

const machineStatusMap: Record<string, string> = {
  RUNNING: 'ACTIVE',
  IDLE: 'READY_FOR_SEW',
  MAINTENANCE: 'QC',
  STOPPED: 'ARCHIVED',
}

interface ModalState {
  open: boolean
  mode: 'add' | 'edit'
  machine: SewMachine | null
}

export function AdminMachinePage() {
  const { t } = useTranslation()
  const [modal, setModal] = useState<ModalState>({ open: false, mode: 'add', machine: null })

  const columns: Column<SewMachine>[] = [
    { key: 'machineCode', header: t('admin.machine.machineCode') },
    { key: 'machineType', header: t('admin.machine.machineType') },
    { key: 'brand', header: t('admin.machine.brand') },
    { key: 'lineCode', header: t('admin.machine.lineAssigned') },
    { key: 'serialNo', header: t('admin.machine.serialNo') },
    {
      key: 'status',
      header: t('common.status'),
      render: (row) => (
        <StatusBadge
          status={machineStatusMap[row.status] ?? row.status}
          label={t(`admin.machine.status_${row.status}`)}
        />
      ),
    },
    {
      key: 'lastMaintenance',
      header: t('sewing.machine.lastMaintenance'),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setModal({ open: true, mode: 'edit', machine: row })}
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
        title={t('admin.machine.title')}
        subtitle={t('admin.machine.subtitle')}
        actions={
          <button
            type="button"
            onClick={() => setModal({ open: true, mode: 'add', machine: null })}
            className="btn-primary"
          >
            {t('admin.machine.addMachine')}
          </button>
        }
      />

      <div className="card">
        <DataTable<SewMachine>
          columns={columns}
          data={mockMachines}
          keyField="id"
        />
      </div>

      {/* Add/Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {modal.mode === 'add' ? t('admin.machine.addMachine') : t('admin.machine.editMachine')}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.machine.machineCode')}
                  </label>
                  <input type="text" className="input w-full" defaultValue={modal.machine?.machineCode ?? ''} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.machine.machineType')}
                  </label>
                  <select className="input w-full" defaultValue={modal.machine?.machineType ?? ''}>
                    <option value="Lockstitch">Lockstitch</option>
                    <option value="Overlock">Overlock</option>
                    <option value="Coverstitch">Coverstitch</option>
                    <option value="Flatlock">Flatlock</option>
                    <option value="Bartack">Bartack</option>
                    <option value="Buttonhole">Buttonhole</option>
                    <option value="Interlock">Interlock</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.machine.brand')}
                  </label>
                  <select className="input w-full" defaultValue={modal.machine?.brand ?? ''}>
                    <option value="JUKI">JUKI</option>
                    <option value="BROTHER">BROTHER</option>
                    <option value="PEGASUS">PEGASUS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.machine.lineAssigned')}
                  </label>
                  <select className="input w-full" defaultValue={modal.machine?.lineCode ?? ''}>
                    <option value="LINE-A">LINE-A</option>
                    <option value="LINE-B">LINE-B</option>
                    <option value="LINE-C">LINE-C</option>
                    <option value="LINE-D">LINE-D</option>
                    <option value="LINE-E">LINE-E</option>
                    <option value="LINE-F">LINE-F</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.machine.serialNo')}
                </label>
                <input type="text" className="input w-full" defaultValue={modal.machine?.serialNo ?? ''} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="machineActive"
                  defaultChecked={modal.machine?.isActive ?? true}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="machineActive" className="text-sm text-gray-700">
                  {t('admin.machine.isActive')}
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setModal({ open: false, mode: 'add', machine: null })}
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
