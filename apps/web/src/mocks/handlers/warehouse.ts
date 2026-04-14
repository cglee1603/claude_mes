import { http, HttpResponse } from 'msw'

export const warehouseHandlers = [
  // --- Warehouse ---

  http.get('/api/warehouse/receipts', () => {
    return HttpResponse.json({
      ok: true,
      data: [
        { id: '1', rollNo: 'ROLL-2026-0401', supplier: 'Viet Textile Co.', materialCode: 'MAT-CTN-001', colorCode: 'NVY-001', weight: 45.2, width: 150, receivedDate: '2026-04-10', inspectionResult: 'PASS', status: 'ACTIVE' },
        { id: '2', rollNo: 'ROLL-2026-0402', supplier: 'Saigon Fabric', materialCode: 'MAT-PLY-002', colorCode: 'BLK-002', weight: 52.8, width: 145, receivedDate: '2026-04-10', inspectionResult: 'PASS', status: 'ACTIVE' },
        { id: '3', rollNo: 'ROLL-2026-0403', supplier: 'Hanoi Weaving', materialCode: 'MAT-LIN-003', colorCode: 'WHT-001', weight: 38.5, width: 140, receivedDate: '2026-04-09', inspectionResult: 'FAIL', status: 'ACTIVE' },
        { id: '4', rollNo: 'ROLL-2026-0404', supplier: 'Viet Textile Co.', materialCode: 'MAT-WOL-004', colorCode: 'GRY-003', weight: 60.1, width: 155, receivedDate: '2026-04-09', inspectionResult: 'PASS', status: 'ARCHIVED' },
        { id: '5', rollNo: 'ROLL-2026-0405', supplier: 'Saigon Fabric', materialCode: 'MAT-CTN-005', colorCode: 'RED-001', weight: 42.0, width: 150, receivedDate: '2026-04-08', inspectionResult: 'PASS', status: 'ACTIVE' },
        { id: '6', rollNo: 'ROLL-2026-0406', supplier: 'Dong Nai Mills', materialCode: 'MAT-CTN-001', colorCode: 'BLU-004', weight: 47.3, width: 150, receivedDate: '2026-04-08', inspectionResult: 'PASS', status: 'ACTIVE' },
        { id: '7', rollNo: 'ROLL-2026-0407', supplier: 'Saigon Fabric', materialCode: 'MAT-PLY-002', colorCode: 'KHK-001', weight: 55.0, width: 145, receivedDate: '2026-04-07', inspectionResult: 'FAIL', status: 'ACTIVE' },
        { id: '8', rollNo: 'ROLL-2026-0408', supplier: 'Hanoi Weaving', materialCode: 'MAT-LIN-003', colorCode: 'CRM-002', weight: 36.9, width: 140, receivedDate: '2026-04-07', inspectionResult: 'PASS', status: 'ACTIVE' },
        { id: '9', rollNo: 'ROLL-2026-0409', supplier: 'Viet Textile Co.', materialCode: 'MAT-CTN-001', colorCode: 'NVY-001', weight: 44.8, width: 150, receivedDate: '2026-04-06', inspectionResult: 'PASS', status: 'ACTIVE' },
        { id: '10', rollNo: 'ROLL-2026-0410', supplier: 'Dong Nai Mills', materialCode: 'MAT-WOL-004', colorCode: 'BLK-002', weight: 62.4, width: 155, receivedDate: '2026-04-06', inspectionResult: 'PASS', status: 'ARCHIVED' },
      ],
    })
  }),

  http.post('/api/warehouse/receive-fabric', () => {
    return HttpResponse.json({ ok: true, data: { id: 'mock-receipt-new' } })
  }),

  http.get('/api/warehouse/receipts/:id', () => {
    return HttpResponse.json({
      ok: true,
      data: { id: '1', rollNo: 'ROLL-2026-0401', supplier: 'Viet Textile Co.', materialCode: 'MAT-CTN-001', colorCode: 'NVY-001', weight: 45.2, width: 150, receivedDate: '2026-04-10', inspectionResult: 'PASS', status: 'ACTIVE' },
    })
  }),

  http.get('/api/warehouse/dashboard', () => {
    return HttpResponse.json({
      ok: true,
      data: {
        todayReceived: 12,
        relaxationPending: 15,
        totalStock: 77,
        fourPointFailRate: 4.2,
        stockByMaterial: [
          { materialCode: 'MAT-CTN-001', materialName: 'Cotton Jersey 180gsm', totalRolls: 24, totalWeight: 1080.5, relaxing: 5, readyForCutting: 12 },
          { materialCode: 'MAT-PLY-002', materialName: 'Poly Twill 220gsm', totalRolls: 18, totalWeight: 950.2, relaxing: 3, readyForCutting: 10 },
          { materialCode: 'MAT-LIN-003', materialName: 'Linen Blend 160gsm', totalRolls: 12, totalWeight: 462.0, relaxing: 4, readyForCutting: 5 },
          { materialCode: 'MAT-WOL-004', materialName: 'Wool Flannel 300gsm', totalRolls: 8, totalWeight: 480.8, relaxing: 2, readyForCutting: 3 },
          { materialCode: 'MAT-CTN-005', materialName: 'Cotton Poplin 120gsm', totalRolls: 15, totalWeight: 630.0, relaxing: 1, readyForCutting: 9 },
        ],
      },
    })
  }),

  // --- Relaxation ---

  http.get('/api/relaxation/plans', () => {
    return HttpResponse.json({
      ok: true,
      data: [
        { id: '1', rollNo: 'ROLL-2026-0401', materialType: 'COTTON', requiredHours: 48, startTime: '2026-04-09T08:00:00', expectedEnd: '2026-04-11T08:00:00', status: 'IN_PROGRESS' },
        { id: '2', rollNo: 'ROLL-2026-0402', materialType: 'POLY', requiredHours: 24, startTime: '2026-04-10T06:00:00', expectedEnd: '2026-04-11T06:00:00', status: 'IN_PROGRESS' },
        { id: '3', rollNo: 'ROLL-2026-0403', materialType: 'LINEN', requiredHours: 48, startTime: '2026-04-08T14:00:00', expectedEnd: '2026-04-10T14:00:00', status: 'COMPLETED' },
        { id: '4', rollNo: 'ROLL-2026-0404', materialType: 'WOOL', requiredHours: 72, startTime: '2026-04-08T10:00:00', expectedEnd: '2026-04-11T10:00:00', status: 'IN_PROGRESS' },
        { id: '5', rollNo: 'ROLL-2026-0405', materialType: 'COTTON', requiredHours: 48, startTime: '2026-04-10T09:00:00', expectedEnd: '2026-04-12T09:00:00', status: 'PENDING' },
      ],
    })
  }),

  http.get('/api/relaxation/materials', () => {
    return HttpResponse.json({
      ok: true,
      data: [
        { code: 'COTTON', requiredHours: 48 },
        { code: 'LINEN', requiredHours: 48 },
        { code: 'POLY', requiredHours: 24 },
        { code: 'WOOL', requiredHours: 72 },
      ],
    })
  }),

  http.get('/api/relaxation/alerts', () => {
    return HttpResponse.json({
      ok: true,
      data: [
        { id: '1', rollNo: 'ROLL-2026-0301', materialType: 'COTTON', completedAt: '2026-04-10T08:15:00', notificationStatus: 'SENT' },
        { id: '2', rollNo: 'ROLL-2026-0302', materialType: 'POLY', completedAt: '2026-04-10T06:30:00', notificationStatus: 'SENT' },
        { id: '3', rollNo: 'ROLL-2026-0303', materialType: 'LINEN', completedAt: '2026-04-10T14:00:00', notificationStatus: 'PENDING' },
        { id: '4', rollNo: 'ROLL-2026-0304', materialType: 'WOOL', completedAt: '2026-04-09T22:00:00', notificationStatus: 'SENT' },
        { id: '5', rollNo: 'ROLL-2026-0305', materialType: 'COTTON', completedAt: '2026-04-09T18:45:00', notificationStatus: 'FAILED' },
        { id: '6', rollNo: 'ROLL-2026-0306', materialType: 'POLY', completedAt: '2026-04-09T12:00:00', notificationStatus: 'SENT' },
        { id: '7', rollNo: 'ROLL-2026-0307', materialType: 'LINEN', completedAt: '2026-04-08T20:30:00', notificationStatus: 'SENT' },
        { id: '8', rollNo: 'ROLL-2026-0308', materialType: 'WOOL', completedAt: '2026-04-08T16:00:00', notificationStatus: 'PENDING' },
      ],
    })
  }),
]
