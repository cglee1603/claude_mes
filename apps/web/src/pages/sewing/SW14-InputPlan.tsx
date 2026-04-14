import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common/PageHeader'

interface OrderBlock {
  id: string
  orderNo: string
  styleCode: string
  qty: number
  color: string
  startCol: number
  spanCols: number
}

interface LinePlan {
  lineId: string
  lineCode: string
  orders: OrderBlock[]
}

const ORDER_COLORS: Record<string, string> = {
  'ORD-2024-001': 'bg-blue-200 border-blue-400 text-blue-900',
  'ORD-2024-002': 'bg-emerald-200 border-emerald-400 text-emerald-900',
  'ORD-2024-003': 'bg-amber-200 border-amber-400 text-amber-900',
  'ORD-2024-004': 'bg-purple-200 border-purple-400 text-purple-900',
  'ORD-2024-005': 'bg-rose-200 border-rose-400 text-rose-900',
  'ORD-2024-006': 'bg-cyan-200 border-cyan-400 text-cyan-900',
}

const MOCK_PLANS: LinePlan[] = [
  {
    lineId: 'line-1',
    lineCode: 'LINE-A',
    orders: [
      { id: 'ob-1', orderNo: 'ORD-2024-001', styleCode: 'ST-100', qty: 300, color: 'ORD-2024-001', startCol: 1, spanCols: 4 },
      { id: 'ob-2', orderNo: 'ORD-2024-002', styleCode: 'ST-200', qty: 200, color: 'ORD-2024-002', startCol: 5, spanCols: 3 },
    ],
  },
  {
    lineId: 'line-2',
    lineCode: 'LINE-B',
    orders: [
      { id: 'ob-3', orderNo: 'ORD-2024-003', styleCode: 'ST-300', qty: 500, color: 'ORD-2024-003', startCol: 1, spanCols: 5 },
      { id: 'ob-4', orderNo: 'ORD-2024-001', styleCode: 'ST-100', qty: 150, color: 'ORD-2024-001', startCol: 6, spanCols: 2 },
    ],
  },
  {
    lineId: 'line-3',
    lineCode: 'LINE-C',
    orders: [
      { id: 'ob-5', orderNo: 'ORD-2024-004', styleCode: 'ST-400', qty: 400, color: 'ORD-2024-004', startCol: 1, spanCols: 3 },
      { id: 'ob-6', orderNo: 'ORD-2024-005', styleCode: 'ST-500', qty: 250, color: 'ORD-2024-005', startCol: 4, spanCols: 2 },
      { id: 'ob-7', orderNo: 'ORD-2024-002', styleCode: 'ST-200', qty: 180, color: 'ORD-2024-002', startCol: 6, spanCols: 2 },
    ],
  },
  {
    lineId: 'line-4',
    lineCode: 'LINE-D',
    orders: [
      { id: 'ob-8', orderNo: 'ORD-2024-006', styleCode: 'ST-600', qty: 350, color: 'ORD-2024-006', startCol: 1, spanCols: 4 },
      { id: 'ob-9', orderNo: 'ORD-2024-003', styleCode: 'ST-300', qty: 200, color: 'ORD-2024-003', startCol: 5, spanCols: 3 },
    ],
  },
]

const TOTAL_COLS = 8
const DAY_LABELS = ['04/10', '04/11', '04/12', '04/13', '04/14', '04/15', '04/16', '04/17']

export function SW14InputPlanPage() {
  const { t } = useTranslation()
  const [plans] = useState<LinePlan[]>(MOCK_PLANS)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('sewing.plan.title')}
        subtitle={t('sewing.plan.inputDate') + ': 2026-04-10 ~ 2026-04-17'}
      />

      {/* Gantt-style CSS Grid */}
      <div className="card overflow-x-auto">
        <div
          className="grid gap-px bg-gray-200 min-w-[700px]"
          style={{ gridTemplateColumns: `120px repeat(${TOTAL_COLS}, 1fr)` }}
        >
          {/* Header row */}
          <div className="bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500 uppercase">
            {t('sewing.plan.line')}
          </div>
          {DAY_LABELS.map((label) => (
            <div key={label} className="bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500 text-center">
              {label}
            </div>
          ))}

          {/* Line rows */}
          {plans.map((line) => (
            <div
              key={line.lineId}
              className="contents"
            >
              {/* Line label */}
              <div className="bg-white px-3 py-4 text-sm font-semibold text-gray-900 flex items-center">
                {line.lineCode}
              </div>

              {/* Order blocks overlay area */}
              <div
                className="col-span-8 bg-white relative"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${TOTAL_COLS}, 1fr)`,
                  minHeight: '56px',
                  gap: '2px',
                  padding: '4px',
                }}
              >
                {line.orders.map((order) => (
                  <div
                    key={order.id}
                    className={`rounded border px-2 py-1 text-xs font-medium flex flex-col justify-center ${ORDER_COLORS[order.color] ?? 'bg-gray-200 border-gray-400 text-gray-900'}`}
                    style={{
                      gridColumn: `${order.startCol} / span ${order.spanCols}`,
                    }}
                  >
                    <span className="font-semibold truncate">{order.orderNo}</span>
                    <span className="text-[10px] opacity-75">
                      {order.styleCode} / {order.qty} {t('common.qty')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-700 mb-3">{t('common.orderNo')}</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(ORDER_COLORS).map(([orderNo, cls]) => (
            <div key={orderNo} className="flex items-center gap-2">
              <span className={`inline-block w-4 h-4 rounded border ${cls}`} />
              <span className="text-xs text-gray-600">{orderNo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
