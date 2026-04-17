import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/grid/MesGrid'
import { StatusBadge } from '../../components/common/StatusBadge'
import { exportToCsv } from '../../utils/excel'

type PlanStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED'

interface CuttingPlan {
  planNo: string
  orderNo: string
  styleCode: string
  colorCode: string
  plannedQty: number
  planDate: string
  status: PlanStatus
}

const MOCK_ORDERS = [
  { value: 'ORD-2026-001', label: 'ORD-2026-001 (NIKE)' },
  { value: 'ORD-2026-002', label: 'ORD-2026-002 (ZARA)' },
  { value: 'ORD-2026-003', label: 'ORD-2026-003 (H&M)' },
]

const MOCK_PLANS: CuttingPlan[] = [
  { planNo: 'CTP-2026-001', orderNo: 'ORD-2026-001', styleCode: 'NK-SS26-001', colorCode: 'BLK', plannedQty: 500, planDate: '2026-04-10', status: 'COMPLETED' },
  { planNo: 'CTP-2026-002', orderNo: 'ORD-2026-001', styleCode: 'NK-SS26-001', colorCode: 'WHT', plannedQty: 300, planDate: '2026-04-11', status: 'COMPLETED' },
  { planNo: 'CTP-2026-003', orderNo: 'ORD-2026-002', styleCode: 'ZR-SS26-010', colorCode: 'RED', plannedQty: 400, planDate: '2026-04-14', status: 'IN_PROGRESS' },
  { planNo: 'CTP-2026-004', orderNo: 'ORD-2026-002', styleCode: 'ZR-SS26-010', colorCode: 'BLU', plannedQty: 400, planDate: '2026-04-15', status: 'PLANNED' },
  { planNo: 'CTP-2026-005', orderNo: 'ORD-2026-003', styleCode: 'HM-FW26-005', colorCode: 'GRY', plannedQty: 600, planDate: '2026-04-17', status: 'PLANNED' },
]

export function HSC01Page() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list')
  const [orderNo, setOrderNo] = useState('')
  const [styleCode, setStyleCode] = useState('')
  const [colorCode, setColorCode] = useState('')
  const [plannedQty, setPlannedQty] = useState('')
  const [planDate, setPlanDate] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const columns: Column<CuttingPlan>[] = [
    { key: 'planNo', header: t('cutting.cuttingPlan.planNo'), width: 150 },
    { key: 'orderNo', header: t('cutting.cuttingPlan.orderNo'), width: 140 },
    { key: 'styleCode', header: t('cutting.cuttingPlan.styleCode'), width: 130 },
    { key: 'colorCode', header: t('cutting.cuttingPlan.colorCode'), width: 100 },
    { key: 'plannedQty', header: t('cutting.cuttingPlan.plannedQty'), width: 110 },
    { key: 'planDate', header: t('cutting.cuttingPlan.planDate'), width: 110 },
    {
      key: 'status',
      header: t('cutting.cuttingPlan.status'),
      width: 130,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ]

  function handleExport() {
    exportToCsv(
      MOCK_PLANS.map((p) => ({
        [t('cutting.cuttingPlan.planNo')]: p.planNo,
        [t('cutting.cuttingPlan.orderNo')]: p.orderNo,
        [t('cutting.cuttingPlan.styleCode')]: p.styleCode,
        [t('cutting.cuttingPlan.colorCode')]: p.colorCode,
        [t('cutting.cuttingPlan.plannedQty')]: p.plannedQty,
        [t('cutting.cuttingPlan.planDate')]: p.planDate,
        [t('cutting.cuttingPlan.status')]: p.status,
      })),
      'cutting-plan'
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setOrderNo('')
    setStyleCode('')
    setColorCode('')
    setPlannedQty('')
    setPlanDate('')
    setActiveTab('list')
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('cutting.cuttingPlan.title')} />

      <div className="flex gap-2 border-b border-gray-200">
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'list' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('list')}
        >
          {t('cutting.cuttingPlan.planList')}
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'new' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('new')}
        >
          {t('cutting.cuttingPlan.newPlan')}
        </button>
      </div>

      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="flex gap-2 justify-end">
            <button className="btn-secondary text-sm px-3 py-1.5" onClick={() => fileInputRef.current?.click()}>
              {t('common.importExcel')}
            </button>
            <input ref={fileInputRef} type="file" accept=".csv,.xlsx" className="hidden" />
            <button className="btn-primary text-sm px-3 py-1.5" onClick={handleExport}>
              {t('common.exportExcel')}
            </button>
          </div>
          <MesGrid columns={columns} data={MOCK_PLANS} gridKey="HSC01-grid" height={400} />
        </div>
      )}

      {activeTab === 'new' && (
        <form onSubmit={handleSubmit} className="card max-w-xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.cuttingPlan.orderNo')}</label>
            <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={orderNo} onChange={(e) => setOrderNo(e.target.value)} required>
              <option value="">--</option>
              {MOCK_ORDERS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.cuttingPlan.styleCode')}</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={styleCode} onChange={(e) => setStyleCode(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.cuttingPlan.colorCode')}</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={colorCode} onChange={(e) => setColorCode(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.cuttingPlan.plannedQty')}</label>
            <input type="number" min={1} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={plannedQty} onChange={(e) => setPlannedQty(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('cutting.cuttingPlan.planDate')}</label>
            <input type="date" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={planDate} onChange={(e) => setPlanDate(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary w-full">{t('cutting.cuttingPlan.createPlan')}</button>
        </form>
      )}
    </div>
  )
}
