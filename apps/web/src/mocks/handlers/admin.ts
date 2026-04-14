import { http, HttpResponse } from 'msw'

interface ProductionLine {
  id: string
  lineCode: string
  lineName: string
  factory: string
  capacity: number
  workerCount: number
  isActive: boolean
}

interface SewMachine {
  id: string
  machineCode: string
  machineType: string
  brand: string
  lineId: string
  lineCode: string
  serialNo: string
  status: string
  lastMaintenance: string
  isActive: boolean
}

interface SmvEntry {
  id: string
  styleCode: string
  operationName: string
  smvValue: number
  updatedBy: string
  updatedAt: string
}

interface ErpSyncHistory {
  id: string
  syncType: string
  direction: string
  recordCount: number
  status: string
  syncedAt: string
  errorMessage: string | null
}

interface LifecycleLayer {
  layer: string
  label: string
  tableCount: number
  activeCount: number
  archivedCount: number
  permanentCount: number
  pendingArchive: number
  policy: string
}

interface QcConfig {
  id: string
  buyerCode: string
  buyerName: string
  dhuThreshold: number
  aqlLevel: string
  inspectionLevel: string
  ftpRequired: boolean
  updatedAt: string
}

const mockLines: ProductionLine[] = [
  { id: 'L001', lineCode: 'LINE-A', lineName: 'A Line (T-Shirt)', factory: 'Factory 2', capacity: 1200, workerCount: 32, isActive: true },
  { id: 'L002', lineCode: 'LINE-B', lineName: 'B Line (Polo)', factory: 'Factory 2', capacity: 1000, workerCount: 28, isActive: true },
  { id: 'L003', lineCode: 'LINE-C', lineName: 'C Line (Jacket)', factory: 'Factory 2', capacity: 800, workerCount: 35, isActive: true },
  { id: 'L004', lineCode: 'LINE-D', lineName: 'D Line (Pants)', factory: 'Factory 2', capacity: 900, workerCount: 30, isActive: true },
  { id: 'L005', lineCode: 'LINE-E', lineName: 'E Line (Dress)', factory: 'Factory 3', capacity: 700, workerCount: 25, isActive: true },
  { id: 'L006', lineCode: 'LINE-F', lineName: 'F Line (Sample)', factory: 'Factory 3', capacity: 300, workerCount: 12, isActive: false },
]

const mockMachines: SewMachine[] = [
  { id: 'M001', machineCode: 'JK-001', machineType: 'Lockstitch', brand: 'JUKI', lineId: 'L001', lineCode: 'LINE-A', serialNo: 'JK-DDL-8700-001', status: 'RUNNING', lastMaintenance: '2026-03-15', isActive: true },
  { id: 'M002', machineCode: 'JK-002', machineType: 'Lockstitch', brand: 'JUKI', lineId: 'L001', lineCode: 'LINE-A', serialNo: 'JK-DDL-8700-002', status: 'RUNNING', lastMaintenance: '2026-03-15', isActive: true },
  { id: 'M003', machineCode: 'BR-001', machineType: 'Overlock', brand: 'BROTHER', lineId: 'L001', lineCode: 'LINE-A', serialNo: 'BR-N31-001', status: 'IDLE', lastMaintenance: '2026-03-20', isActive: true },
  { id: 'M004', machineCode: 'JK-003', machineType: 'Coverstitch', brand: 'JUKI', lineId: 'L002', lineCode: 'LINE-B', serialNo: 'JK-MF-7523-001', status: 'RUNNING', lastMaintenance: '2026-03-10', isActive: true },
  { id: 'M005', machineCode: 'BR-002', machineType: 'Lockstitch', brand: 'BROTHER', lineId: 'L002', lineCode: 'LINE-B', serialNo: 'BR-S7200C-001', status: 'MAINTENANCE', lastMaintenance: '2026-04-08', isActive: true },
  { id: 'M006', machineCode: 'JK-004', machineType: 'Bartack', brand: 'JUKI', lineId: 'L002', lineCode: 'LINE-B', serialNo: 'JK-LK-1900B-001', status: 'RUNNING', lastMaintenance: '2026-02-28', isActive: true },
  { id: 'M007', machineCode: 'PG-001', machineType: 'Flatlock', brand: 'PEGASUS', lineId: 'L003', lineCode: 'LINE-C', serialNo: 'PG-W664-001', status: 'RUNNING', lastMaintenance: '2026-03-25', isActive: true },
  { id: 'M008', machineCode: 'JK-005', machineType: 'Lockstitch', brand: 'JUKI', lineId: 'L003', lineCode: 'LINE-C', serialNo: 'JK-DDL-8700-003', status: 'RUNNING', lastMaintenance: '2026-03-18', isActive: true },
  { id: 'M009', machineCode: 'BR-003', machineType: 'Overlock', brand: 'BROTHER', lineId: 'L003', lineCode: 'LINE-C', serialNo: 'BR-N31-002', status: 'IDLE', lastMaintenance: '2026-03-22', isActive: true },
  { id: 'M010', machineCode: 'JK-006', machineType: 'Buttonhole', brand: 'JUKI', lineId: 'L004', lineCode: 'LINE-D', serialNo: 'JK-LBH-1790-001', status: 'RUNNING', lastMaintenance: '2026-03-12', isActive: true },
  { id: 'M011', machineCode: 'JK-007', machineType: 'Lockstitch', brand: 'JUKI', lineId: 'L004', lineCode: 'LINE-D', serialNo: 'JK-DDL-8700-004', status: 'RUNNING', lastMaintenance: '2026-03-14', isActive: true },
  { id: 'M012', machineCode: 'PG-002', machineType: 'Interlock', brand: 'PEGASUS', lineId: 'L004', lineCode: 'LINE-D', serialNo: 'PG-W562-001', status: 'IDLE', lastMaintenance: '2026-04-01', isActive: true },
  { id: 'M013', machineCode: 'BR-004', machineType: 'Coverstitch', brand: 'BROTHER', lineId: 'L005', lineCode: 'LINE-E', serialNo: 'BR-CV3550-001', status: 'RUNNING', lastMaintenance: '2026-03-28', isActive: true },
  { id: 'M014', machineCode: 'JK-008', machineType: 'Lockstitch', brand: 'JUKI', lineId: 'L005', lineCode: 'LINE-E', serialNo: 'JK-DDL-8700-005', status: 'RUNNING', lastMaintenance: '2026-03-30', isActive: true },
  { id: 'M015', machineCode: 'JK-009', machineType: 'Lockstitch', brand: 'JUKI', lineId: 'L006', lineCode: 'LINE-F', serialNo: 'JK-DDL-8700-006', status: 'STOPPED', lastMaintenance: '2026-02-15', isActive: false },
]

const mockSmv: SmvEntry[] = [
  { id: 'S001', styleCode: 'NK-SS26-001', operationName: 'Collar Attach', smvValue: 1.25, updatedBy: 'IE-Kim', updatedAt: '2026-03-01' },
  { id: 'S002', styleCode: 'NK-SS26-001', operationName: 'Side Seam', smvValue: 0.85, updatedBy: 'IE-Kim', updatedAt: '2026-03-01' },
  { id: 'S003', styleCode: 'NK-SS26-001', operationName: 'Hem Bottom', smvValue: 0.65, updatedBy: 'IE-Kim', updatedAt: '2026-03-01' },
  { id: 'S004', styleCode: 'ZR-FW26-010', operationName: 'Pocket Set', smvValue: 1.80, updatedBy: 'IE-Park', updatedAt: '2026-03-05' },
  { id: 'S005', styleCode: 'ZR-FW26-010', operationName: 'Zip Attach', smvValue: 2.10, updatedBy: 'IE-Park', updatedAt: '2026-03-05' },
  { id: 'S006', styleCode: 'HM-BS26-005', operationName: 'Sleeve Set', smvValue: 1.45, updatedBy: 'IE-Lee', updatedAt: '2026-03-10' },
  { id: 'S007', styleCode: 'HM-BS26-005', operationName: 'Cuff Attach', smvValue: 0.95, updatedBy: 'IE-Lee', updatedAt: '2026-03-10' },
  { id: 'S008', styleCode: 'UQ-UT26-003', operationName: 'Neck Bind', smvValue: 0.70, updatedBy: 'IE-Kim', updatedAt: '2026-03-15' },
  { id: 'S009', styleCode: 'UQ-UT26-003', operationName: 'Label Attach', smvValue: 0.35, updatedBy: 'IE-Kim', updatedAt: '2026-03-15' },
  { id: 'S010', styleCode: 'NK-SS26-008', operationName: 'Shoulder Seam', smvValue: 0.90, updatedBy: 'IE-Park', updatedAt: '2026-03-20' },
]

const mockErpSync: { orders: ErpSyncHistory[]; styles: ErpSyncHistory[]; materials: ErpSyncHistory[] } = {
  orders: [
    { id: 'ES001', syncType: 'ORDER', direction: 'ERP_TO_MES', recordCount: 5, status: 'SUCCESS', syncedAt: '2026-04-10T06:00:00Z', errorMessage: null },
    { id: 'ES002', syncType: 'ORDER', direction: 'ERP_TO_MES', recordCount: 3, status: 'SUCCESS', syncedAt: '2026-04-09T06:00:00Z', errorMessage: null },
    { id: 'ES003', syncType: 'ORDER', direction: 'ERP_TO_MES', recordCount: 8, status: 'PARTIAL', syncedAt: '2026-04-08T06:00:00Z', errorMessage: '2 records skipped: duplicate ORDER_NO' },
    { id: 'ES010', syncType: 'ORDER', direction: 'MES_TO_ERP', recordCount: 12, status: 'SUCCESS', syncedAt: '2026-04-10T00:00:00Z', errorMessage: null },
  ],
  styles: [
    { id: 'ES004', syncType: 'STYLE', direction: 'ERP_TO_MES', recordCount: 4, status: 'SUCCESS', syncedAt: '2026-04-10T06:05:00Z', errorMessage: null },
    { id: 'ES005', syncType: 'STYLE', direction: 'ERP_TO_MES', recordCount: 2, status: 'SUCCESS', syncedAt: '2026-04-09T06:05:00Z', errorMessage: null },
    { id: 'ES006', syncType: 'STYLE', direction: 'ERP_TO_MES', recordCount: 6, status: 'FAILED', syncedAt: '2026-04-07T06:05:00Z', errorMessage: 'ERP API timeout' },
  ],
  materials: [
    { id: 'ES007', syncType: 'MATERIAL', direction: 'ERP_TO_MES', recordCount: 15, status: 'SUCCESS', syncedAt: '2026-04-10T06:10:00Z', errorMessage: null },
    { id: 'ES008', syncType: 'MATERIAL', direction: 'ERP_TO_MES', recordCount: 10, status: 'SUCCESS', syncedAt: '2026-04-09T06:10:00Z', errorMessage: null },
    { id: 'ES009', syncType: 'MATERIAL', direction: 'ERP_TO_MES', recordCount: 7, status: 'SUCCESS', syncedAt: '2026-04-08T06:10:00Z', errorMessage: null },
  ],
}

const mockLifecycle: LifecycleLayer[] = [
  { layer: 'A', label: 'ERP Origin', tableCount: 3, activeCount: 245, archivedCount: 82, permanentCount: 0, pendingArchive: 12, policy: 'ARCHIVE after 180 days (Order) / 90 days (Material)' },
  { layer: 'B', label: 'MES Config', tableCount: 4, activeCount: 56, archivedCount: 3, permanentCount: 0, pendingArchive: 0, policy: 'Admin deletable (no linked records)' },
  { layer: 'C', label: 'MES Permanent', tableCount: 5, activeCount: 0, archivedCount: 0, permanentCount: 4832, pendingArchive: 0, policy: 'PERMANENT - never delete (DB trigger protected)' },
  { layer: 'D', label: 'ERP Queue', tableCount: 2, activeCount: 18, archivedCount: 156, permanentCount: 0, pendingArchive: 5, policy: 'ARCHIVE after 90 days post-send' },
]

const mockQcConfig: QcConfig[] = [
  { id: 'QC001', buyerCode: 'NIKE', buyerName: 'Nike Inc.', dhuThreshold: 2.0, aqlLevel: '2.5', inspectionLevel: 'II', ftpRequired: true, updatedAt: '2026-03-01' },
  { id: 'QC002', buyerCode: 'ZARA', buyerName: 'Inditex (Zara)', dhuThreshold: 3.0, aqlLevel: '4.0', inspectionLevel: 'II', ftpRequired: true, updatedAt: '2026-03-05' },
  { id: 'QC003', buyerCode: 'H&M', buyerName: 'H&M Group', dhuThreshold: 2.5, aqlLevel: '2.5', inspectionLevel: 'I', ftpRequired: true, updatedAt: '2026-03-10' },
  { id: 'QC004', buyerCode: 'UNIQLO', buyerName: 'Fast Retailing (UNIQLO)', dhuThreshold: 1.5, aqlLevel: '1.5', inspectionLevel: 'S-3', ftpRequired: true, updatedAt: '2026-02-20' },
]

export const adminHandlers = [
  http.get('/api/admin/lines', () => {
    return HttpResponse.json({ ok: true, data: mockLines })
  }),

  http.get('/api/admin/machines', () => {
    return HttpResponse.json({ ok: true, data: mockMachines })
  }),

  http.get('/api/admin/smv', () => {
    return HttpResponse.json({ ok: true, data: mockSmv })
  }),

  http.get('/api/admin/erp-sync', () => {
    return HttpResponse.json({ ok: true, data: mockErpSync })
  }),

  http.get('/api/admin/data-lifecycle', () => {
    return HttpResponse.json({ ok: true, data: mockLifecycle })
  }),

  http.get('/api/admin/qc-config', () => {
    return HttpResponse.json({ ok: true, data: mockQcConfig })
  }),
]
