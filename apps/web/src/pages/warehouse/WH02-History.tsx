import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { DataTable, type Column } from '../../components/common/DataTable'
import { StatusBadge } from '../../components/common/StatusBadge'

interface HistoryRow {
  id: string
  receiptNo: string
  rollNo: string
  materialCode: string
  supplier: string
  colorCode: string
  weight: number
  width: number
  receivedDate: string
  inspectionResult: string
  status: string
}

const MOCK_HISTORY: HistoryRow[] = [
  { id: '1', receiptNo: 'RCV-2026-001', rollNo: 'ROLL-2026-0401', materialCode: 'MAT-CTN-001', supplier: 'Viet Textile Co.', colorCode: 'NVY-001', weight: 45.2, width: 150, receivedDate: '2026-04-10', inspectionResult: 'PASS', status: 'ACTIVE' },
  { id: '2', receiptNo: 'RCV-2026-002', rollNo: 'ROLL-2026-0402', materialCode: 'MAT-PLY-002', supplier: 'Saigon Fabric', colorCode: 'BLK-002', weight: 52.8, width: 145, receivedDate: '2026-04-10', inspectionResult: 'PASS', status: 'ACTIVE' },
  { id: '3', receiptNo: 'RCV-2026-003', rollNo: 'ROLL-2026-0403', materialCode: 'MAT-LIN-003', supplier: 'Hanoi Weaving', colorCode: 'WHT-001', weight: 38.5, width: 140, receivedDate: '2026-04-09', inspectionResult: 'FAIL', status: 'ACTIVE' },
  { id: '4', receiptNo: 'RCV-2026-004', rollNo: 'ROLL-2026-0404', materialCode: 'MAT-WOL-004', supplier: 'Viet Textile Co.', colorCode: 'GRY-003', weight: 60.1, width: 155, receivedDate: '2026-04-09', inspectionResult: 'PASS', status: 'ARCHIVED' },
  { id: '5', receiptNo: 'RCV-2026-005', rollNo: 'ROLL-2026-0405', materialCode: 'MAT-CTN-005', supplier: 'Saigon Fabric', colorCode: 'RED-001', weight: 42.0, width: 150, receivedDate: '2026-04-08', inspectionResult: 'PASS', status: 'ACTIVE' },
  { id: '6', receiptNo: 'RCV-2026-006', rollNo: 'ROLL-2026-0406', materialCode: 'MAT-CTN-001', supplier: 'Dong Nai Mills', colorCode: 'BLU-004', weight: 47.3, width: 150, receivedDate: '2026-04-08', inspectionResult: 'PASS', status: 'ACTIVE' },
  { id: '7', receiptNo: 'RCV-2026-007', rollNo: 'ROLL-2026-0407', materialCode: 'MAT-PLY-002', supplier: 'Saigon Fabric', colorCode: 'KHK-001', weight: 55.0, width: 145, receivedDate: '2026-04-07', inspectionResult: 'FAIL', status: 'ACTIVE' },
  { id: '8', receiptNo: 'RCV-2026-008', rollNo: 'ROLL-2026-0408', materialCode: 'MAT-LIN-003', supplier: 'Hanoi Weaving', colorCode: 'CRM-002', weight: 36.9, width: 140, receivedDate: '2026-04-07', inspectionResult: 'PASS', status: 'ACTIVE' },
  { id: '9', receiptNo: 'RCV-2026-009', rollNo: 'ROLL-2026-0409', materialCode: 'MAT-CTN-001', supplier: 'Viet Textile Co.', colorCode: 'NVY-001', weight: 44.8, width: 150, receivedDate: '2026-04-06', inspectionResult: 'PASS', status: 'ACTIVE' },
  { id: '10', receiptNo: 'RCV-2026-010', rollNo: 'ROLL-2026-0410', materialCode: 'MAT-WOL-004', supplier: 'Dong Nai Mills', colorCode: 'BLK-002', weight: 62.4, width: 155, receivedDate: '2026-04-06', inspectionResult: 'PASS', status: 'ARCHIVED' },
]

export function WH02HistoryPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = MOCK_HISTORY.filter((row) => {
    const matchSearch =
      search === '' ||
      row.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      row.materialCode.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === '' || row.status === statusFilter
    return matchSearch && matchStatus
  })

  const columns: Column<HistoryRow>[] = [
    { key: 'receiptNo', header: t('warehouse.history.receiptNo') },
    { key: 'rollNo', header: t('warehouse.history.rollNo') },
    { key: 'materialCode', header: t('warehouse.history.materialCode') },
    { key: 'supplier', header: t('warehouse.history.supplier') },
    { key: 'colorCode', header: t('warehouse.history.colorCode') },
    { key: 'weight', header: t('warehouse.history.weight') },
    { key: 'width', header: t('warehouse.history.width') },
    { key: 'receivedDate', header: t('warehouse.history.receivedDate') },
    {
      key: 'inspectionResult',
      header: t('warehouse.history.inspectionResult'),
      render: (row) => (
        <StatusBadge
          status={row.inspectionResult === 'PASS' ? 'PASSED_QC' : 'MFZ_HOLD'}
          label={
            row.inspectionResult === 'PASS'
              ? t('warehouse.receive.pass')
              : t('warehouse.receive.fail')
          }
        />
      ),
    },
    {
      key: 'status',
      header: t('common.status'),
      render: (row) => <StatusBadge status={row.status} label={t(`status.${row.status}`)} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('warehouse.history.title')}
        subtitle={t('warehouse.history.subtitle')}
      />

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              className="input-field w-full"
              placeholder={t('warehouse.history.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">{t('common.all')}</option>
              <option value="ACTIVE">{t('status.ACTIVE')}</option>
              <option value="ARCHIVED">{t('status.ARCHIVED')}</option>
            </select>
          </div>
        </div>
        <DataTable<HistoryRow> columns={columns} data={filtered} keyField="id" />
      </div>
    </div>
  )
}
