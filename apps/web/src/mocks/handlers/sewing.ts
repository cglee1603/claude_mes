import { http, HttpResponse } from 'msw'

const LINES = [
  { id: 'line-1', code: 'LINE-A' },
  { id: 'line-2', code: 'LINE-B' },
  { id: 'line-3', code: 'LINE-C' },
  { id: 'line-4', code: 'LINE-D' },
]

const ORDER_COLORS: Record<string, string> = {
  'ORD-2024-001': 'blue',
  'ORD-2024-002': 'green',
  'ORD-2024-003': 'amber',
  'ORD-2024-004': 'purple',
  'ORD-2024-005': 'rose',
  'ORD-2024-006': 'cyan',
}

const INPUT_PLAN = [
  {
    lineId: 'line-1',
    lineCode: 'LINE-A',
    orders: [
      { id: 'ob-1', orderNo: 'ORD-2024-001', styleCode: 'ST-100', qty: 300, color: ORDER_COLORS['ORD-2024-001'], startCol: 1, spanCols: 4 },
      { id: 'ob-2', orderNo: 'ORD-2024-002', styleCode: 'ST-200', qty: 200, color: ORDER_COLORS['ORD-2024-002'], startCol: 5, spanCols: 3 },
    ],
  },
  {
    lineId: 'line-2',
    lineCode: 'LINE-B',
    orders: [
      { id: 'ob-3', orderNo: 'ORD-2024-003', styleCode: 'ST-300', qty: 500, color: ORDER_COLORS['ORD-2024-003'], startCol: 1, spanCols: 5 },
      { id: 'ob-4', orderNo: 'ORD-2024-001', styleCode: 'ST-100', qty: 150, color: ORDER_COLORS['ORD-2024-001'], startCol: 6, spanCols: 2 },
    ],
  },
  {
    lineId: 'line-3',
    lineCode: 'LINE-C',
    orders: [
      { id: 'ob-5', orderNo: 'ORD-2024-004', styleCode: 'ST-400', qty: 400, color: ORDER_COLORS['ORD-2024-004'], startCol: 1, spanCols: 3 },
      { id: 'ob-6', orderNo: 'ORD-2024-005', styleCode: 'ST-500', qty: 250, color: ORDER_COLORS['ORD-2024-005'], startCol: 4, spanCols: 2 },
    ],
  },
  {
    lineId: 'line-4',
    lineCode: 'LINE-D',
    orders: [
      { id: 'ob-8', orderNo: 'ORD-2024-006', styleCode: 'ST-600', qty: 350, color: ORDER_COLORS['ORD-2024-006'], startCol: 1, spanCols: 4 },
    ],
  },
]

type Utilization = 'high' | 'medium' | 'low' | 'idle'

function makeLayoutMachines(lineCode: string, count: number) {
  const ops = ['Collar', 'Sleeve', 'Body', 'Cuff', 'Pocket', 'Hem', 'Button', 'Side Seam', 'Shoulder', 'Label', 'Zip', 'Lining', 'Top Stitch', 'Bar Tack', 'Trim']
  const utils: Utilization[] = ['high', 'high', 'medium', 'high', 'low', 'high', 'idle', 'high', 'medium', 'high']
  return Array.from({ length: count }, (_, i) => ({
    machineCode: `${lineCode}-M${String(i + 1).padStart(2, '0')}`,
    operation: ops[i % ops.length],
    operators: i % 3 === 0 ? 2 : 1,
    utilization: utils[i % utils.length],
  }))
}

const LINE_LAYOUT = [
  { lineId: 'line-1', lineCode: 'LINE-A', machines: makeLayoutMachines('A', 12) },
  { lineId: 'line-2', lineCode: 'LINE-B', machines: makeLayoutMachines('B', 15) },
  { lineId: 'line-3', lineCode: 'LINE-C', machines: makeLayoutMachines('C', 10) },
  { lineId: 'line-4', lineCode: 'LINE-D', machines: makeLayoutMachines('D', 13) },
]

type MachineStatus = 'RUNNING' | 'IDLE' | 'BREAKDOWN'

function generateMachines(count: number) {
  const types = ['Lockstitch', 'Overlock', 'Coverstitch', 'Bartack', 'Buttonhole']
  const operators = ['Nguyen T.', 'Tran V.', 'Le H.', 'Pham M.', 'Vo A.', 'Hoang D.', '-']
  const statuses: MachineStatus[] = ['RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'IDLE', 'IDLE', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'IDLE', 'RUNNING', 'RUNNING', 'BREAKDOWN', 'BREAKDOWN', 'RUNNING']
  return Array.from({ length: count }, (_, i) => ({
    id: `machine-${i + 1}`,
    machineCode: `SM-${String(i + 1).padStart(3, '0')}`,
    machineType: types[i % types.length],
    lineCode: LINES[i % LINES.length].code,
    operator: operators[i % operators.length],
    status: statuses[i % statuses.length],
    lastMaintenance: `2026-0${3 + (i % 2)}-${String(10 + (i % 20)).padStart(2, '0')}`,
  }))
}

const MACHINES = generateMachines(20)

const LINE_OUTPUT_ENTRIES = [
  { id: 'out-1', lineCode: 'LINE-A', lotNo: 'ORD-2024-001-L001', periodStart: '2026-04-10T08:00', periodEnd: '2026-04-10T10:00', outputQty: 120, defectQty: 3, workerId: null, lineManagerName: 'Kim J.' },
  { id: 'out-2', lineCode: 'LINE-B', lotNo: 'ORD-2024-001-L002', periodStart: '2026-04-10T08:00', periodEnd: '2026-04-10T10:00', outputQty: 95, defectQty: 5, workerId: 'wk-01', lineManagerName: 'Park S.' },
  { id: 'out-3', lineCode: 'LINE-A', lotNo: 'ORD-2024-001-L001', periodStart: '2026-04-10T10:00', periodEnd: '2026-04-10T12:00', outputQty: 135, defectQty: 2, workerId: null, lineManagerName: 'Kim J.' },
]

const DAILY_SUMMARY = [
  { lineId: 'line-1', lineCode: 'LINE-A', totalOutput: 480, totalDefect: 12, dhuPercent: 2.5, efficiencyPercent: 88.5 },
  { lineId: 'line-2', lineCode: 'LINE-B', totalOutput: 420, totalDefect: 18, dhuPercent: 4.3, efficiencyPercent: 82.1 },
  { lineId: 'line-3', lineCode: 'LINE-C', totalOutput: 390, totalDefect: 8, dhuPercent: 2.1, efficiencyPercent: 76.3 },
  { lineId: 'line-4', lineCode: 'LINE-D', totalOutput: 510, totalDefect: 15, dhuPercent: 2.9, efficiencyPercent: 91.2 },
]

export const sewingHandlers = [
  // GET /api/sewing/input-plan
  http.get('/api/sewing/input-plan', () => {
    return HttpResponse.json({ ok: true, data: INPUT_PLAN })
  }),

  // GET /api/sewing/line-layout
  http.get('/api/sewing/line-layout', () => {
    return HttpResponse.json({ ok: true, data: LINE_LAYOUT })
  }),

  // GET /api/sewing/machines (20 machines)
  http.get('/api/sewing/machines', () => {
    return HttpResponse.json({ ok: true, data: MACHINES })
  }),

  // GET /api/sewing/line-output
  http.get('/api/sewing/line-output', () => {
    return HttpResponse.json({ ok: true, data: LINE_OUTPUT_ENTRIES })
  }),

  // GET /api/sewing/daily-summary
  http.get('/api/sewing/daily-summary', () => {
    return HttpResponse.json({ ok: true, data: DAILY_SUMMARY })
  }),

  // Existing endpoints
  http.get('/api/production/lines', () => {
    return HttpResponse.json({ ok: true, data: LINES })
  }),
  http.post('/api/production/record-line-output', () => {
    return HttpResponse.json({ ok: true, data: { id: `out-${Date.now()}` } })
  }),
  http.get('/api/lines/:lineId/efficiency', () => {
    return HttpResponse.json({
      ok: true,
      data: { efficiencyPercent: 84.5, targetPercent: 85.0 },
    })
  }),
]
