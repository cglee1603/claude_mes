import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, Column } from '@/components/common/DataTable'
import { KpiCard } from '@/components/common/KpiCard'

interface CartonRecord {
  id: string
  cartonNo: string
  lotNo: string
  orderNo: string
  qty: number
  grossWeight: number
  netWeight: number
  length: number
  width: number
  height: number
  createdAt: string
  createdBy: string
}

const MOCK_CARTONS: CartonRecord[] = [
  { id: '1', cartonNo: 'CTN-001', lotNo: 'ORD-2024-001-L001', orderNo: 'ORD-2024-001', qty: 50, grossWeight: 12.5, netWeight: 11.8, length: 60, width: 40, height: 35, createdAt: '2026-04-10 09:00', createdBy: 'Nguyen A' },
  { id: '2', cartonNo: 'CTN-002', lotNo: 'ORD-2024-001-L001', orderNo: 'ORD-2024-001', qty: 50, grossWeight: 12.3, netWeight: 11.6, length: 60, width: 40, height: 35, createdAt: '2026-04-10 09:20', createdBy: 'Nguyen A' },
  { id: '3', cartonNo: 'CTN-003', lotNo: 'ORD-2024-001-L002', orderNo: 'ORD-2024-001', qty: 60, grossWeight: 14.2, netWeight: 13.5, length: 65, width: 40, height: 35, createdAt: '2026-04-10 09:45', createdBy: 'Tran B' },
  { id: '4', cartonNo: 'CTN-004', lotNo: 'ORD-2024-002-L001', orderNo: 'ORD-2024-002', qty: 40, grossWeight: 10.1, netWeight: 9.5, length: 55, width: 38, height: 32, createdAt: '2026-04-10 10:10', createdBy: 'Tran B' },
  { id: '5', cartonNo: 'CTN-005', lotNo: 'ORD-2024-003-L001', orderNo: 'ORD-2024-003', qty: 75, grossWeight: 18.0, netWeight: 17.2, length: 70, width: 45, height: 38, createdAt: '2026-04-10 10:30', createdBy: 'Le C' },
]

export function FP22CartonPage() {
  const { t } = useTranslation()
  const [formCartonNo, setFormCartonNo] = useState('')
  const [formLotId, setFormLotId] = useState('')
  const [formQty, setFormQty] = useState(0)
  const [formGrossWeight, setFormGrossWeight] = useState(0)
  const [formNetWeight, setFormNetWeight] = useState(0)
  const [formLength, setFormLength] = useState(0)
  const [formWidth, setFormWidth] = useState(0)
  const [formHeight, setFormHeight] = useState(0)

  const totalQty = MOCK_CARTONS.reduce((sum, c) => sum + c.qty, 0)
  const totalWeight = MOCK_CARTONS.reduce((sum, c) => sum + c.grossWeight, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock submit
  }

  const handleExport = () => {
    // Mock export
  }

  const columns: Column<CartonRecord>[] = [
    { key: 'cartonNo', header: t('finishing.carton.cartonNo') },
    { key: 'lotNo', header: t('common.lotNo') },
    { key: 'orderNo', header: t('common.orderNo') },
    { key: 'qty', header: t('finishing.carton.qtyPerCarton') },
    {
      key: 'grossWeight',
      header: t('finishing.carton.grossWeight'),
      render: (row) => <span>{row.grossWeight} kg</span>,
    },
    {
      key: 'netWeight',
      header: t('finishing.carton.netWeight'),
      render: (row) => <span>{row.netWeight} kg</span>,
    },
    {
      key: 'dimensions',
      header: 'Dimensions (cm)',
      render: (row) => <span>{row.length} x {row.width} x {row.height}</span>,
    },
    { key: 'createdAt', header: t('common.date') },
    { key: 'createdBy', header: 'Operator' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('finishing.carton.title')}
        subtitle="FP-22"
        actions={
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('common.export')}
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard label={t('finishing.carton.totalCartons')} value={MOCK_CARTONS.length} unit="ctns" color="blue" trend="up" />
        <KpiCard label={t('common.qty')} value={totalQty} unit="pcs" color="green" />
        <KpiCard label={t('finishing.carton.grossWeight')} value={totalWeight.toFixed(1)} unit="kg" color="yellow" />
        <KpiCard label="Orders" value={3} unit="orders" color="blue" />
      </div>

      {/* Carton Form */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('common.register')} Carton</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('finishing.carton.cartonNo')}
              </label>
              <input
                type="text"
                value={formCartonNo}
                onChange={(e) => setFormCartonNo(e.target.value)}
                placeholder="CTN-XXX"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.lotNo')}
              </label>
              <input
                type="text"
                value={formLotId}
                onChange={(e) => setFormLotId(e.target.value)}
                placeholder="ORD-2024-XXX-LXXX"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('finishing.carton.qtyPerCarton')}
              </label>
              <input
                type="number"
                min={1}
                value={formQty}
                onChange={(e) => setFormQty(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('finishing.carton.grossWeight')}
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={formGrossWeight}
                  onChange={(e) => setFormGrossWeight(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('finishing.carton.netWeight')}
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={formNetWeight}
                  onChange={(e) => setFormNetWeight(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Length (cm)
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={formLength}
                onChange={(e) => setFormLength(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (cm)
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={formWidth}
                onChange={(e) => setFormWidth(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={formHeight}
                onChange={(e) => setFormHeight(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {t('common.register')}
            </button>
          </div>
        </form>
      </div>

      {/* Carton List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Carton List</h3>
        <DataTable columns={columns} data={MOCK_CARTONS} keyField="id" />
      </div>
    </div>
  )
}
