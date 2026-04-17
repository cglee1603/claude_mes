import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { exportToCsv } from '../../utils/excel'

interface BtpRecord {
  deliveryNo: string
  bundleCount: number
  receivedQty: number
  receivedDate: string
  confirmedBy: string
}

interface AccessoryRecord {
  accessoryCode: string
  itemName: string
  qty: number
  unit: string
  receivedDate: string
}

type TabType = 'btp' | 'accessories'

const MOCK_BTP: BtpRecord[] = [
  { deliveryNo: 'DEL-001', bundleCount: 25, receivedQty: 500, receivedDate: '2026-04-10', confirmedBy: 'Park Joo-im' },
  { deliveryNo: 'DEL-002', bundleCount: 18, receivedQty: 360, receivedDate: '2026-04-11', confirmedBy: 'Kim Jun-ho' },
  { deliveryNo: 'DEL-003', bundleCount: 30, receivedQty: 600, receivedDate: '2026-04-12', confirmedBy: 'Lee Min-su' },
  { deliveryNo: 'DEL-004', bundleCount: 22, receivedQty: 440, receivedDate: '2026-04-13', confirmedBy: 'Park Joo-im' },
]

const MOCK_ACCESSORIES: AccessoryRecord[] = [
  { accessoryCode: 'ACC-B001', itemName: 'Button (12mm)', qty: 2000, unit: 'pcs', receivedDate: '2026-04-10' },
  { accessoryCode: 'ACC-Z001', itemName: 'Zipper (20cm)', qty: 500, unit: 'pcs', receivedDate: '2026-04-10' },
  { accessoryCode: 'ACC-T001', itemName: 'Brand Label', qty: 1500, unit: 'pcs', receivedDate: '2026-04-11' },
  { accessoryCode: 'ACC-T002', itemName: 'Size Tag', qty: 1500, unit: 'pcs', receivedDate: '2026-04-11' },
  { accessoryCode: 'ACC-S001', itemName: 'Thread (White)', qty: 30, unit: 'rolls', receivedDate: '2026-04-12' },
]

export function HSW03Page() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabType>('btp')
  const [btp] = useState<BtpRecord[]>(MOCK_BTP)
  const [accessories] = useState<AccessoryRecord[]>(MOCK_ACCESSORIES)

  const btpColumns: Column<BtpRecord>[] = [
    { key: 'deliveryNo', header: t('sewing.materialReceiving.deliveryNo'), width: 110 },
    { key: 'bundleCount', header: t('sewing.materialReceiving.bundleCount'), width: 90 },
    { key: 'receivedQty', header: t('sewing.materialReceiving.receivedQty'), width: 100 },
    { key: 'receivedDate', header: t('sewing.materialReceiving.receivedDate'), width: 110 },
    { key: 'confirmedBy', header: t('sewing.materialReceiving.confirmedBy'), width: 100 },
  ]

  const accessoryColumns: Column<AccessoryRecord>[] = [
    { key: 'accessoryCode', header: 'Code', width: 110 },
    { key: 'itemName', header: 'Item Name', width: 160 },
    { key: 'qty', header: t('sewing.materialReceiving.receivedQty'), width: 90 },
    { key: 'unit', header: 'Unit', width: 70 },
    { key: 'receivedDate', header: t('sewing.materialReceiving.receivedDate'), width: 110 },
  ]

  function handleExport() {
    if (activeTab === 'btp') {
      exportToCsv(
        btp.map(r => ({
          [t('sewing.materialReceiving.deliveryNo')]: r.deliveryNo,
          [t('sewing.materialReceiving.bundleCount')]: r.bundleCount,
          [t('sewing.materialReceiving.receivedQty')]: r.receivedQty,
          [t('sewing.materialReceiving.receivedDate')]: r.receivedDate,
          [t('sewing.materialReceiving.confirmedBy')]: r.confirmedBy,
        })),
        'btp-receiving'
      )
    } else {
      exportToCsv(
        accessories.map(r => ({
          Code: r.accessoryCode,
          'Item Name': r.itemName,
          [t('sewing.materialReceiving.receivedQty')]: r.qty,
          Unit: r.unit,
          [t('sewing.materialReceiving.receivedDate')]: r.receivedDate,
        })),
        'accessories-receiving'
      )
    }
  }

  const tabs: { key: TabType; label: string }[] = [
    { key: 'btp', label: t('sewing.materialReceiving.btpReceiving') },
    { key: 'accessories', label: t('sewing.materialReceiving.accessoriesReceiving') },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('sewing.materialReceiving.title')} />

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button className="btn-primary text-sm px-3 py-1.5" onClick={handleExport}>
            {t('common.exportExcel')}
          </button>
        </div>

        {activeTab === 'btp' && (
          <MesGrid columns={btpColumns} data={btp} height={300} gridKey="H-SW-03-btp-grid" />
        )}
        {activeTab === 'accessories' && (
          <MesGrid columns={accessoryColumns} data={accessories} height={300} gridKey="H-SW-03-acc-grid" />
        )}
      </div>
    </div>
  )
}
