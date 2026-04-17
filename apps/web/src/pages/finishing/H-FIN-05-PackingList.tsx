import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { StatusBadge } from '../../components/common/StatusBadge'
import { exportToCsv } from '../../utils/excel'

interface PackingListRecord {
  id: string
  plNo: string
  poNo: string
  buyer: string
  portOfLoading: string
  portOfDischarge: string
  shipDate: string
  totalCartons: number
  totalQty: number
  totalWeight: number
  status: string
}

const MOCK_DATA: PackingListRecord[] = [
  { id: 'PL-001', plNo: 'PL-2026-001', poNo: 'PO-NK-2024-001', buyer: 'NIKE', portOfLoading: 'Ho Chi Minh', portOfDischarge: 'Los Angeles', shipDate: '2026-04-30', totalCartons: 120, totalQty: 1440, totalWeight: 864.0, status: 'FINALIZED' },
  { id: 'PL-002', plNo: 'PL-2026-002', poNo: 'PO-ZR-2024-010', buyer: 'ZARA', portOfLoading: 'Ho Chi Minh', portOfDischarge: 'Barcelona', shipDate: '2026-05-10', totalCartons: 85, totalQty: 850, totalWeight: 510.0, status: 'DRAFT' },
  { id: 'PL-003', plNo: 'PL-2026-003', poNo: 'PO-HM-2024-005', buyer: 'H&M', portOfLoading: 'Da Nang', portOfDischarge: 'Hamburg', shipDate: '2026-04-25', totalCartons: 60, totalQty: 480, totalWeight: 300.0, status: 'EXPORTED' },
  { id: 'PL-004', plNo: 'PL-2026-004', poNo: 'PO-NK-2024-002', buyer: 'NIKE', portOfLoading: 'Ho Chi Minh', portOfDischarge: 'New York', shipDate: '2026-05-20', totalCartons: 200, totalQty: 2400, totalWeight: 1440.0, status: 'DRAFT' },
]

export function HFin05Page() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ poNo: '', buyer: '', portOfLoading: '', portOfDischarge: '', shipDate: '' })

  const handleChange = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleCreate = () =>
    setForm({ poNo: '', buyer: '', portOfLoading: '', portOfDischarge: '', shipDate: '' })

  const handleExport = () => exportToCsv(MOCK_DATA, 'packing-list')

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv,.xlsx'
    input.click()
  }

  const columns: Column<PackingListRecord>[] = [
    { key: 'plNo', header: t('finishing.packingList.plNo'), width: 130 },
    { key: 'poNo', header: t('finishing.packingList.poNo'), width: 150 },
    { key: 'buyer', header: t('finishing.packingList.buyer'), width: 90 },
    { key: 'portOfLoading', header: t('finishing.packingList.portOfLoading'), width: 140 },
    { key: 'portOfDischarge', header: t('finishing.packingList.portOfDischarge'), width: 130 },
    { key: 'shipDate', header: t('finishing.packingList.shipDate'), width: 110 },
    { key: 'totalCartons', header: t('finishing.packingList.totalCartons'), width: 100 },
    { key: 'totalQty', header: t('finishing.packingList.totalQty'), width: 100 },
    { key: 'totalWeight', header: t('finishing.packingList.totalWeight'), width: 130 },
    {
      key: 'status', header: t('finishing.packingList.status'), width: 110,
      render: (row) => <StatusBadge status={row.status} label={row.status} />,
    },
  ]

  const formFields = [
    { label: t('finishing.packingList.poNo'), field: 'poNo' },
    { label: t('finishing.packingList.buyer'), field: 'buyer' },
    { label: t('finishing.packingList.portOfLoading'), field: 'portOfLoading' },
    { label: t('finishing.packingList.portOfDischarge'), field: 'portOfDischarge' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('finishing.packingList.title')} subtitle="H-FIN-05" />

      <div className="card space-y-4">
        <h3 className="text-base font-semibold text-gray-800">{t('finishing.packingList.create')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {formFields.map(({ label, field }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input type="text" value={form[field as keyof typeof form]} onChange={e => handleChange(field, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t('finishing.packingList.shipDate')}</label>
            <input type="date" value={form.shipDate} onChange={e => handleChange('shipDate', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleCreate} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            {t('finishing.packingList.create')}
          </button>
          <button onClick={handleExport} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            {t('common.exportExcel')}
          </button>
          <button onClick={handleImport} className="px-5 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors">
            {t('common.importExcel')}
          </button>
        </div>
      </div>

      <div className="card">
        <MesGrid columns={columns} data={MOCK_DATA} height={380} gridKey="H-FIN-05-grid" />
      </div>
    </div>
  )
}
