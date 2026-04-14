import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common'

interface ERPOrder {
  id: string
  erpOrderNo: string
  buyerCode: string
  styleCode: string
  orderedQty: number
}

const MOCK_ORDERS: ERPOrder[] = [
  { id: 'ord-001', erpOrderNo: 'ORD-2026-001', buyerCode: 'NIKE', styleCode: 'NK-SS26-001', orderedQty: 500 },
  { id: 'ord-002', erpOrderNo: 'ORD-2026-002', buyerCode: 'ZARA', styleCode: 'ZR-SS26-010', orderedQty: 800 },
  { id: 'ord-003', erpOrderNo: 'ORD-2026-003', buyerCode: 'H&M', styleCode: 'HM-FW26-005', orderedQty: 1200 },
]

function generateLotPreview(orderNo: string, serial: number): string {
  const paddedSerial = String(serial).padStart(3, '0')
  return `${orderNo}-L${paddedSerial}`
}

export function SC07LotCreatePage() {
  const { t } = useTranslation()
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [colorCode, setColorCode] = useState('')
  const [orderQty, setOrderQty] = useState('')

  const selectedOrder = MOCK_ORDERS.find((o) => o.id === selectedOrderId)
  const lotPreview = selectedOrder ? generateLotPreview(selectedOrder.erpOrderNo, 1) : ''

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('cutting.createLot.title')}
        subtitle={t('cutting.createLot.subtitle')}
      />

      <div className="card max-w-xl">
        <div className="space-y-4">
          {/* ERP Order Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('cutting.createLot.erpOrderId')}
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
            >
              <option value="">{t('cutting.createLot.selectOrder')}</option>
              {MOCK_ORDERS.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.erpOrderNo} - {order.buyerCode} / {order.styleCode}
                </option>
              ))}
            </select>
          </div>

          {/* Selected order info */}
          {selectedOrder && (
            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
              <div className="flex gap-6">
                <span>{t('cutting.createLot.erpOrderNo')}: <strong>{selectedOrder.erpOrderNo}</strong></span>
                <span>{t('cutting.createLot.styleCode')}: <strong>{selectedOrder.styleCode}</strong></span>
                <span>{t('cutting.createLot.orderQty')}: <strong>{selectedOrder.orderedQty}</strong></span>
              </div>
            </div>
          )}

          {/* Color Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('cutting.createLot.colorCode')}
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={colorCode}
              onChange={(e) => setColorCode(e.target.value)}
              placeholder="BLK-001"
            />
          </div>

          {/* Order Qty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('cutting.createLot.lotQty')}
            </label>
            <input
              type="number"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={orderQty}
              onChange={(e) => setOrderQty(e.target.value)}
              placeholder="100"
              min={1}
            />
          </div>

          {/* LOT Preview */}
          {lotPreview && (
            <div className="rounded-md bg-gray-50 border border-gray-200 p-4">
              <p className="text-xs font-medium text-gray-500 mb-1">
                {t('cutting.createLot.lotPreview')}
              </p>
              <p className="text-lg font-mono font-bold text-gray-900">{lotPreview}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="button"
            disabled={!selectedOrderId || !colorCode || !orderQty}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t('cutting.createLot.create')}
          </button>
        </div>
      </div>
    </div>
  )
}
