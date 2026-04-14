import { http, HttpResponse } from 'msw'

type LotStatus =
  | 'CUTTING'
  | 'READY_FOR_SEW'
  | 'SEWN'
  | 'QC'
  | 'PASSED_QC'
  | 'MFZ_HOLD'
  | 'READY_PACK'
  | 'PACKED'
  | 'SHIPPED'

interface MockLot {
  id: string
  lotNo: string
  erpIfOrderId: string
  erpOrderNo: string
  buyerCode: string
  colorCode: string
  orderQty: number
  actualQty: number
  lotStatus: LotStatus
  mfzCheckCompleted: boolean
  dataStatus: string
  createdAt: string
  updatedAt: string
}

const mockLots: MockLot[] = [
  { id: 'l01', lotNo: 'ORD-2026-001-L001', erpIfOrderId: 'ord-001', erpOrderNo: 'ORD-2026-001', buyerCode: 'NIKE', colorCode: 'BLK-001', orderQty: 200, actualQty: 200, lotStatus: 'SHIPPED', mfzCheckCompleted: true, dataStatus: 'PERMANENT', createdAt: '2026-04-01T08:00:00Z', updatedAt: '2026-04-07T14:00:00Z' },
  { id: 'l02', lotNo: 'ORD-2026-001-L002', erpIfOrderId: 'ord-001', erpOrderNo: 'ORD-2026-001', buyerCode: 'NIKE', colorCode: 'WHT-002', orderQty: 150, actualQty: 150, lotStatus: 'PACKED', mfzCheckCompleted: true, dataStatus: 'PERMANENT', createdAt: '2026-04-01T09:00:00Z', updatedAt: '2026-04-06T10:00:00Z' },
  { id: 'l03', lotNo: 'ORD-2026-001-L003', erpIfOrderId: 'ord-001', erpOrderNo: 'ORD-2026-001', buyerCode: 'NIKE', colorCode: 'NVY-003', orderQty: 150, actualQty: 140, lotStatus: 'READY_PACK', mfzCheckCompleted: true, dataStatus: 'PERMANENT', createdAt: '2026-04-02T08:00:00Z', updatedAt: '2026-04-06T08:00:00Z' },
  { id: 'l04', lotNo: 'ORD-2026-002-L001', erpIfOrderId: 'ord-002', erpOrderNo: 'ORD-2026-002', buyerCode: 'ZARA', colorCode: 'RED-001', orderQty: 300, actualQty: 290, lotStatus: 'PASSED_QC', mfzCheckCompleted: false, dataStatus: 'PERMANENT', createdAt: '2026-04-02T10:00:00Z', updatedAt: '2026-04-05T16:30:00Z' },
  { id: 'l05', lotNo: 'ORD-2026-002-L002', erpIfOrderId: 'ord-002', erpOrderNo: 'ORD-2026-002', buyerCode: 'ZARA', colorCode: 'BLU-002', orderQty: 250, actualQty: 230, lotStatus: 'QC', mfzCheckCompleted: false, dataStatus: 'PERMANENT', createdAt: '2026-04-03T08:00:00Z', updatedAt: '2026-04-05T11:00:00Z' },
  { id: 'l06', lotNo: 'ORD-2026-002-L003', erpIfOrderId: 'ord-002', erpOrderNo: 'ORD-2026-002', buyerCode: 'ZARA', colorCode: 'GRN-003', orderQty: 250, actualQty: 250, lotStatus: 'MFZ_HOLD', mfzCheckCompleted: false, dataStatus: 'PERMANENT', createdAt: '2026-04-03T10:00:00Z', updatedAt: '2026-04-05T12:00:00Z' },
  { id: 'l07', lotNo: 'ORD-2026-003-L001', erpIfOrderId: 'ord-003', erpOrderNo: 'ORD-2026-003', buyerCode: 'H&M', colorCode: 'BLK-001', orderQty: 400, actualQty: 380, lotStatus: 'SEWN', mfzCheckCompleted: false, dataStatus: 'PERMANENT', createdAt: '2026-04-04T08:00:00Z', updatedAt: '2026-04-05T09:00:00Z' },
  { id: 'l08', lotNo: 'ORD-2026-003-L002', erpIfOrderId: 'ord-003', erpOrderNo: 'ORD-2026-003', buyerCode: 'H&M', colorCode: 'WHT-001', orderQty: 400, actualQty: 200, lotStatus: 'READY_FOR_SEW', mfzCheckCompleted: false, dataStatus: 'PERMANENT', createdAt: '2026-04-05T08:00:00Z', updatedAt: '2026-04-05T14:00:00Z' },
  { id: 'l09', lotNo: 'ORD-2026-003-L003', erpIfOrderId: 'ord-003', erpOrderNo: 'ORD-2026-003', buyerCode: 'H&M', colorCode: 'GRY-002', orderQty: 400, actualQty: 0, lotStatus: 'CUTTING', mfzCheckCompleted: false, dataStatus: 'PERMANENT', createdAt: '2026-04-06T08:00:00Z', updatedAt: '2026-04-06T08:00:00Z' },
  { id: 'l10', lotNo: 'ORD-2026-004-L001', erpIfOrderId: 'ord-004', erpOrderNo: 'ORD-2026-004', buyerCode: 'UNIQLO', colorCode: 'BLK-001', orderQty: 500, actualQty: 500, lotStatus: 'SHIPPED', mfzCheckCompleted: true, dataStatus: 'PERMANENT', createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-04-07T16:00:00Z' },
  { id: 'l11', lotNo: 'ORD-2026-004-L002', erpIfOrderId: 'ord-004', erpOrderNo: 'ORD-2026-004', buyerCode: 'UNIQLO', colorCode: 'NVY-001', orderQty: 500, actualQty: 480, lotStatus: 'PACKED', mfzCheckCompleted: true, dataStatus: 'PERMANENT', createdAt: '2026-04-02T10:00:00Z', updatedAt: '2026-04-07T10:00:00Z' },
  { id: 'l12', lotNo: 'ORD-2026-005-L001', erpIfOrderId: 'ord-005', erpOrderNo: 'ORD-2026-005', buyerCode: 'GAP', colorCode: 'KHK-001', orderQty: 300, actualQty: 100, lotStatus: 'SEWN', mfzCheckCompleted: false, dataStatus: 'PERMANENT', createdAt: '2026-04-07T08:00:00Z', updatedAt: '2026-04-08T10:00:00Z' },
  { id: 'l13', lotNo: 'ORD-2026-005-L002', erpIfOrderId: 'ord-005', erpOrderNo: 'ORD-2026-005', buyerCode: 'GAP', colorCode: 'OLV-002', orderQty: 300, actualQty: 0, lotStatus: 'CUTTING', mfzCheckCompleted: false, dataStatus: 'PERMANENT', createdAt: '2026-04-08T08:00:00Z', updatedAt: '2026-04-08T08:00:00Z' },
  { id: 'l14', lotNo: 'ORD-2026-006-L001', erpIfOrderId: 'ord-006', erpOrderNo: 'ORD-2026-006', buyerCode: 'PUMA', colorCode: 'RED-010', orderQty: 200, actualQty: 190, lotStatus: 'QC', mfzCheckCompleted: false, dataStatus: 'PERMANENT', createdAt: '2026-04-08T10:00:00Z', updatedAt: '2026-04-09T08:00:00Z' },
  { id: 'l15', lotNo: 'ORD-2026-006-L002', erpIfOrderId: 'ord-006', erpOrderNo: 'ORD-2026-006', buyerCode: 'PUMA', colorCode: 'BLK-010', orderQty: 200, actualQty: 50, lotStatus: 'READY_FOR_SEW', mfzCheckCompleted: false, dataStatus: 'PERMANENT', createdAt: '2026-04-09T08:00:00Z', updatedAt: '2026-04-09T14:00:00Z' },
]

const mockBundles = [
  { id: 'bnd-001', bundleNo: 'BND-001', lotId: 'l01', lotNo: 'ORD-2026-001-L001', rollId: 'R-2026-0001', qty: 100, shadingGroup: 'A', createdAt: '2026-04-01T09:00:00Z' },
  { id: 'bnd-002', bundleNo: 'BND-002', lotId: 'l01', lotNo: 'ORD-2026-001-L001', rollId: 'R-2026-0001', qty: 100, shadingGroup: 'A', createdAt: '2026-04-01T09:30:00Z' },
  { id: 'bnd-003', bundleNo: 'BND-003', lotId: 'l02', lotNo: 'ORD-2026-001-L002', rollId: 'R-2026-0003', qty: 80, shadingGroup: 'B', createdAt: '2026-04-01T10:00:00Z' },
  { id: 'bnd-004', bundleNo: 'BND-004', lotId: 'l02', lotNo: 'ORD-2026-001-L002', rollId: 'R-2026-0003', qty: 70, shadingGroup: 'B', createdAt: '2026-04-01T10:30:00Z' },
  { id: 'bnd-005', bundleNo: 'BND-005', lotId: 'l04', lotNo: 'ORD-2026-002-L001', rollId: 'R-2026-0010', qty: 150, shadingGroup: 'A', createdAt: '2026-04-02T11:00:00Z' },
  { id: 'bnd-006', bundleNo: 'BND-006', lotId: 'l04', lotNo: 'ORD-2026-002-L001', rollId: 'R-2026-0010', qty: 150, shadingGroup: 'A', createdAt: '2026-04-02T11:30:00Z' },
]

const mockMarkerEfficiency = [
  { id: 'mk-1', styleCode: 'NK-SS26-001', markerNo: 'MK-001', efficiency: 92.4, fabricUsed: 120.5, waste: 9.2 },
  { id: 'mk-2', styleCode: 'ZR-SS26-010', markerNo: 'MK-002', efficiency: 87.1, fabricUsed: 145.2, waste: 18.7 },
  { id: 'mk-3', styleCode: 'HM-FW26-005', markerNo: 'MK-003', efficiency: 78.5, fabricUsed: 200.0, waste: 43.0 },
  { id: 'mk-4', styleCode: 'NK-SS26-002', markerNo: 'MK-004', efficiency: 94.2, fabricUsed: 98.3, waste: 5.7 },
  { id: 'mk-5', styleCode: 'ZR-FW26-003', markerNo: 'MK-005', efficiency: 75.8, fabricUsed: 180.0, waste: 43.6 },
]

const mockShadingCheck = [
  {
    id: 'sh-1',
    lotNo: 'ORD-2026-001-L001',
    colorCode: 'BLK-001',
    rollA: { rollNo: 'R-2026-0001', hexColor: '#1a1a1a' },
    rollB: { rollNo: 'R-2026-0002', hexColor: '#1f1f1f' },
    riskLevel: 'safe',
    deltaE: 0.8,
  },
  {
    id: 'sh-2',
    lotNo: 'ORD-2026-002-L001',
    colorCode: 'RED-001',
    rollA: { rollNo: 'R-2026-0010', hexColor: '#c41e3a' },
    rollB: { rollNo: 'R-2026-0011', hexColor: '#b5172f' },
    riskLevel: 'warning',
    deltaE: 2.4,
  },
  {
    id: 'sh-3',
    lotNo: 'ORD-2026-003-L001',
    colorCode: 'NVY-003',
    rollA: { rollNo: 'R-2026-0020', hexColor: '#1b2a4a' },
    rollB: { rollNo: 'R-2026-0021', hexColor: '#2d4a7a' },
    riskLevel: 'danger',
    deltaE: 5.1,
  },
]

const statusSteps = ['CUTTING', 'READY_FOR_SEW', 'SEWN', 'QC', 'PASSED_QC', 'READY_PACK', 'SHIPPED'] as const

function buildTraceSteps(lotStatus: string) {
  const currentIdx = statusSteps.indexOf(lotStatus as typeof statusSteps[number])
  const effectiveIdx = currentIdx === -1 ? 0 : currentIdx

  return statusSteps.map((step, idx) => ({
    step,
    status: idx < effectiveIdx ? 'completed' : idx === effectiveIdx ? 'current' : 'pending',
    timestamp: idx <= effectiveIdx ? `2026-04-0${idx + 1}T08:00:00Z` : null,
  }))
}

const mockDashboard = {
  totalLots: 15,
  activeLots: 12,
  todayBundles: 24,
  avgMarkerEfficiency: 85.6,
  statusCounts: [
    { status: 'CUTTING', count: 3 },
    { status: 'READY_FOR_SEW', count: 2 },
    { status: 'SEWN', count: 2 },
    { status: 'QC', count: 2 },
    { status: 'PASSED_QC', count: 1 },
    { status: 'MFZ_HOLD', count: 1 },
    { status: 'READY_PACK', count: 1 },
    { status: 'PACKED', count: 1 },
    { status: 'SHIPPED', count: 2 },
  ],
}

export const cuttingHandlers = [
  // GET /api/cutting/lots — 15 lots with various statuses
  http.get('/api/cutting/lots', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const filtered = status
      ? mockLots.filter((l) => l.lotStatus === status)
      : mockLots
    return HttpResponse.json({ ok: true, data: filtered })
  }),

  // GET /api/lots/:lotNo/trace — full trace timeline
  http.get('/api/lots/:lotNo/trace', ({ params }) => {
    const lotNo = params['lotNo'] as string
    const lot = mockLots.find((l) => l.lotNo === lotNo)
    if (!lot) {
      return HttpResponse.json(
        { ok: false, error: { code: 'NOT_FOUND', message: `LOT ${lotNo} not found` } },
        { status: 404 },
      )
    }
    const steps = buildTraceSteps(lot.lotStatus)
    return HttpResponse.json({
      ok: true,
      data: { lotNo: lot.lotNo, lotStatus: lot.lotStatus, steps },
    })
  }),

  // GET /api/cutting/bundles
  http.get('/api/cutting/bundles', ({ request }) => {
    const url = new URL(request.url)
    const lotId = url.searchParams.get('lotId')
    const filtered = lotId
      ? mockBundles.filter((b) => b.lotId === lotId)
      : mockBundles
    return HttpResponse.json({ ok: true, data: filtered })
  }),

  // GET /api/cutting/marker-efficiency
  http.get('/api/cutting/marker-efficiency', () => {
    return HttpResponse.json({ ok: true, data: mockMarkerEfficiency })
  }),

  // GET /api/cutting/shading-check
  http.get('/api/cutting/shading-check', () => {
    return HttpResponse.json({ ok: true, data: mockShadingCheck })
  }),

  // GET /api/cutting/dashboard
  http.get('/api/cutting/dashboard', () => {
    return HttpResponse.json({ ok: true, data: mockDashboard })
  }),

  // POST /api/cutting/create-lot
  http.post('/api/cutting/create-lot', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newLot = {
      id: `l-new-${Date.now()}`,
      lotNo: `${String(body['erpOrderNo'] ?? 'ORD-0000')}-L001`,
      erpIfOrderId: String(body['erpIfOrderId'] ?? ''),
      colorCode: String(body['colorCode'] ?? ''),
      orderQty: Number(body['orderQty'] ?? 0),
      actualQty: 0,
      lotStatus: 'CUTTING' as const,
      dataStatus: 'PERMANENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json({ ok: true, data: newLot }, { status: 201 })
  }),

  // POST /api/cutting/create-bundle
  http.post('/api/cutting/create-bundle', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newBundle = {
      id: `bnd-new-${Date.now()}`,
      bundleNo: `BND-${String(Date.now()).slice(-4)}`,
      lotId: String(body['lotId'] ?? ''),
      rollId: String(body['rollId'] ?? ''),
      qty: Number(body['qty'] ?? 100),
      shadingGroup: String(body['shadingGroup'] ?? 'A'),
      createdAt: new Date().toISOString(),
    }
    return HttpResponse.json({ ok: true, data: newBundle }, { status: 201 })
  }),
]
