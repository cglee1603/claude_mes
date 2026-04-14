import { http, HttpResponse } from 'msw'

interface KpiData {
  oee: number
  dailyOutput: number
  productionAchievement: number
  avgDhu: number
  mfzDetections: number
  lineUtilization: number
  lines: LineEfficiency[]
}

interface LineEfficiency {
  lineId: string
  lineCode: string
  lineName: string
  targetQty: number
  actualQty: number
  efficiency: number
  oee: number
  defectRate: number
}

interface WipLot {
  id: string
  lotNo: string
  erpOrderNo: string
  buyerCode: string
  styleCode: string
  colorCode: string
  orderQty: number
  actualQty: number
  lotStatus: string
  updatedAt: string
}

const mockKpi: KpiData = {
  oee: 82.3,
  dailyOutput: 3450,
  productionAchievement: 91.2,
  avgDhu: 2.8,
  mfzDetections: 3,
  lineUtilization: 87.5,
  lines: [
    { lineId: 'L001', lineCode: 'LINE-A', lineName: 'A Line', targetQty: 1000, actualQty: 920, efficiency: 92.0, oee: 85.1, defectRate: 2.1 },
    { lineId: 'L002', lineCode: 'LINE-B', lineName: 'B Line', targetQty: 800, actualQty: 710, efficiency: 88.8, oee: 80.5, defectRate: 3.2 },
    { lineId: 'L003', lineCode: 'LINE-C', lineName: 'C Line', targetQty: 1200, actualQty: 1080, efficiency: 90.0, oee: 83.7, defectRate: 2.5 },
    { lineId: 'L004', lineCode: 'LINE-D', lineName: 'D Line', targetQty: 900, actualQty: 740, efficiency: 82.2, oee: 76.4, defectRate: 4.1 },
  ],
}

const mockWipLots: WipLot[] = [
  { id: '1', lotNo: 'ORD-2026-001-L001', erpOrderNo: 'ORD-2026-001', buyerCode: 'NIKE', styleCode: 'NK-SS26-001', colorCode: 'BLK', orderQty: 500, actualQty: 320, lotStatus: 'SEWN', updatedAt: '2026-04-10T08:30:00Z' },
  { id: '2', lotNo: 'ORD-2026-001-L002', erpOrderNo: 'ORD-2026-001', buyerCode: 'NIKE', styleCode: 'NK-SS26-001', colorCode: 'WHT', orderQty: 500, actualQty: 500, lotStatus: 'QC', updatedAt: '2026-04-10T09:15:00Z' },
  { id: '3', lotNo: 'ORD-2026-002-L001', erpOrderNo: 'ORD-2026-002', buyerCode: 'ZARA', styleCode: 'ZR-FW26-010', colorCode: 'NVY', orderQty: 800, actualQty: 0, lotStatus: 'CUTTING', updatedAt: '2026-04-10T07:00:00Z' },
  { id: '4', lotNo: 'ORD-2026-002-L002', erpOrderNo: 'ORD-2026-002', buyerCode: 'ZARA', styleCode: 'ZR-FW26-010', colorCode: 'GRY', orderQty: 600, actualQty: 450, lotStatus: 'PASSED_QC', updatedAt: '2026-04-09T16:00:00Z' },
  { id: '5', lotNo: 'ORD-2026-003-L001', erpOrderNo: 'ORD-2026-003', buyerCode: 'H&M', styleCode: 'HM-BS26-005', colorCode: 'RED', orderQty: 1000, actualQty: 1000, lotStatus: 'PACKED', updatedAt: '2026-04-09T14:00:00Z' },
  { id: '6', lotNo: 'ORD-2026-003-L002', erpOrderNo: 'ORD-2026-003', buyerCode: 'H&M', styleCode: 'HM-BS26-005', colorCode: 'BLU', orderQty: 700, actualQty: 700, lotStatus: 'SHIPPED', updatedAt: '2026-04-08T10:00:00Z' },
  { id: '7', lotNo: 'ORD-2026-004-L001', erpOrderNo: 'ORD-2026-004', buyerCode: 'UNIQLO', styleCode: 'UQ-UT26-003', colorCode: 'BLK', orderQty: 400, actualQty: 250, lotStatus: 'MFZ_HOLD', updatedAt: '2026-04-10T10:00:00Z' },
  { id: '8', lotNo: 'ORD-2026-004-L002', erpOrderNo: 'ORD-2026-004', buyerCode: 'UNIQLO', styleCode: 'UQ-UT26-003', colorCode: 'WHT', orderQty: 400, actualQty: 400, lotStatus: 'READY_PACK', updatedAt: '2026-04-10T06:00:00Z' },
  { id: '9', lotNo: 'ORD-2026-005-L001', erpOrderNo: 'ORD-2026-005', buyerCode: 'NIKE', styleCode: 'NK-SS26-008', colorCode: 'GRN', orderQty: 300, actualQty: 150, lotStatus: 'READY_FOR_SEW', updatedAt: '2026-04-10T11:00:00Z' },
  { id: '10', lotNo: 'ORD-2026-005-L002', erpOrderNo: 'ORD-2026-005', buyerCode: 'NIKE', styleCode: 'NK-SS26-008', colorCode: 'BLK', orderQty: 300, actualQty: 300, lotStatus: 'SEWN', updatedAt: '2026-04-09T18:00:00Z' },
  { id: '11', lotNo: 'ORD-2026-006-L001', erpOrderNo: 'ORD-2026-006', buyerCode: 'ZARA', styleCode: 'ZR-FW26-022', colorCode: 'BRN', orderQty: 600, actualQty: 0, lotStatus: 'CUTTING', updatedAt: '2026-04-10T07:30:00Z' },
  { id: '12', lotNo: 'ORD-2026-006-L002', erpOrderNo: 'ORD-2026-006', buyerCode: 'ZARA', styleCode: 'ZR-FW26-022', colorCode: 'BLK', orderQty: 600, actualQty: 350, lotStatus: 'QC', updatedAt: '2026-04-10T09:45:00Z' },
  { id: '13', lotNo: 'ORD-2026-007-L001', erpOrderNo: 'ORD-2026-007', buyerCode: 'H&M', styleCode: 'HM-BS26-011', colorCode: 'PNK', orderQty: 900, actualQty: 900, lotStatus: 'PASSED_QC', updatedAt: '2026-04-09T15:00:00Z' },
  { id: '14', lotNo: 'ORD-2026-007-L002', erpOrderNo: 'ORD-2026-007', buyerCode: 'H&M', styleCode: 'HM-BS26-011', colorCode: 'YEL', orderQty: 500, actualQty: 200, lotStatus: 'SEWN', updatedAt: '2026-04-10T08:00:00Z' },
  { id: '15', lotNo: 'ORD-2026-008-L001', erpOrderNo: 'ORD-2026-008', buyerCode: 'UNIQLO', styleCode: 'UQ-UT26-009', colorCode: 'NVY', orderQty: 450, actualQty: 450, lotStatus: 'PACKED', updatedAt: '2026-04-09T12:00:00Z' },
  { id: '16', lotNo: 'ORD-2026-008-L002', erpOrderNo: 'ORD-2026-008', buyerCode: 'UNIQLO', styleCode: 'UQ-UT26-009', colorCode: 'GRY', orderQty: 450, actualQty: 300, lotStatus: 'READY_PACK', updatedAt: '2026-04-10T05:00:00Z' },
  { id: '17', lotNo: 'ORD-2026-009-L001', erpOrderNo: 'ORD-2026-009', buyerCode: 'NIKE', styleCode: 'NK-SS26-015', colorCode: 'ORG', orderQty: 350, actualQty: 0, lotStatus: 'CUTTING', updatedAt: '2026-04-10T06:30:00Z' },
  { id: '18', lotNo: 'ORD-2026-009-L002', erpOrderNo: 'ORD-2026-009', buyerCode: 'NIKE', styleCode: 'NK-SS26-015', colorCode: 'BLK', orderQty: 350, actualQty: 180, lotStatus: 'READY_FOR_SEW', updatedAt: '2026-04-10T10:30:00Z' },
  { id: '19', lotNo: 'ORD-2026-010-L001', erpOrderNo: 'ORD-2026-010', buyerCode: 'ZARA', styleCode: 'ZR-FW26-035', colorCode: 'WHT', orderQty: 700, actualQty: 700, lotStatus: 'SHIPPED', updatedAt: '2026-04-07T16:00:00Z' },
  { id: '20', lotNo: 'ORD-2026-010-L002', erpOrderNo: 'ORD-2026-010', buyerCode: 'ZARA', styleCode: 'ZR-FW26-035', colorCode: 'BLK', orderQty: 700, actualQty: 550, lotStatus: 'QC', updatedAt: '2026-04-10T11:30:00Z' },
]

export const analyticsHandlers = [
  http.get('/api/analytics/factory-kpi', () => {
    return HttpResponse.json({ ok: true, data: mockKpi })
  }),

  http.get('/api/analytics/wip', () => {
    return HttpResponse.json({ ok: true, data: mockWipLots })
  }),

  http.get('/api/orders/:orderId/status', () => {
    return HttpResponse.json({ ok: true, data: null })
  }),
]
