import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'
import { exportToCsv } from '../../utils/excel'

interface ChecklistItem {
  id: string
  checkItem: string
  completed: boolean
  responsible: string
  completedDate: string
}

interface ProcessRow {
  processName: string
  responsible: string
  smv: number
  sequence: number
}

const MOCK_CHECKLIST: ChecklistItem[] = [
  { id: 'CK-001', checkItem: 'Sample Approval', completed: true, responsible: 'Kim Jun-ho', completedDate: '2026-04-10' },
  { id: 'CK-002', checkItem: 'BOM Verification', completed: true, responsible: 'Lee Min-su', completedDate: '2026-04-11' },
  { id: 'CK-003', checkItem: 'Material Receipt Confirmation', completed: true, responsible: 'Park Joo-im', completedDate: '2026-04-12' },
  { id: 'CK-004', checkItem: 'Machine Layout Verification', completed: true, responsible: 'Choi Team Lead', completedDate: '2026-04-12' },
  { id: 'CK-005', checkItem: 'Work Order Issuance', completed: false, responsible: 'Kim Jun-ho', completedDate: '' },
  { id: 'CK-006', checkItem: 'Size Set Review', completed: false, responsible: 'Lee Min-su', completedDate: '' },
  { id: 'CK-007', checkItem: 'Buyer Standard Briefing', completed: true, responsible: 'Park Joo-im', completedDate: '2026-04-13' },
  { id: 'CK-008', checkItem: 'Safety Training Completed', completed: true, responsible: 'Choi Team Lead', completedDate: '2026-04-13' },
  { id: 'CK-009', checkItem: 'First Pilot Inspection', completed: false, responsible: 'Kim Jun-ho', completedDate: '' },
  { id: 'CK-010', checkItem: 'Line Balance Verification', completed: false, responsible: 'Lee Min-su', completedDate: '' },
]

const MOCK_PROCESS: ProcessRow[] = [
  { sequence: 1, processName: 'Front Panel Sewing', responsible: 'Nguyen Van An', smv: 2.5 },
  { sequence: 2, processName: 'Back Panel Sewing', responsible: 'Tran Thi Mai', smv: 2.8 },
  { sequence: 3, processName: 'Side Seam', responsible: 'Le Van Duc', smv: 1.9 },
  { sequence: 4, processName: 'Sleeve Attaching', responsible: 'Pham Thi Huong', smv: 3.2 },
  { sequence: 5, processName: 'Collar Attaching', responsible: 'Nguyen Thi Lan', smv: 4.1 },
  { sequence: 6, processName: 'Buttonhole Operation', responsible: 'Vo Thi Tu', smv: 1.5 },
  { sequence: 7, processName: 'Button Attaching', responsible: 'Do Van Kim', smv: 1.2 },
  { sequence: 8, processName: 'Ironing', responsible: 'Ho Thi Hong', smv: 2.0 },
]

type TabType = 'checklist' | 'processLayout'

export function HSW02Page() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabType>('checklist')
  const [checklist] = useState<ChecklistItem[]>(MOCK_CHECKLIST)
  const [process] = useState<ProcessRow[]>(MOCK_PROCESS)

  const completedCount = checklist.filter(c => c.completed).length

  const checklistColumns: Column<ChecklistItem>[] = [
    { key: 'id', header: 'ID', width: 80 },
    { key: 'checkItem', header: t('sewing.ppChecklist.checkItem'), width: 180 },
    {
      key: 'completed',
      header: t('sewing.ppChecklist.completed'),
      width: 80,
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${row.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
          {row.completed ? 'Y' : 'N'}
        </span>
      ),
    },
    { key: 'responsible', header: t('sewing.ppChecklist.responsible'), width: 100 },
    { key: 'completedDate', header: t('sewing.ppChecklist.completedDate'), width: 110 },
  ]

  const processColumns: Column<ProcessRow>[] = [
    { key: 'sequence', header: '#', width: 60 },
    { key: 'processName', header: t('sewing.ppChecklist.processName'), width: 160 },
    { key: 'responsible', header: t('sewing.ppChecklist.responsible'), width: 130 },
    { key: 'smv', header: t('sewing.ppChecklist.smv'), width: 80 },
  ]

  function handleExport() {
    if (activeTab === 'checklist') {
      exportToCsv(
        checklist.map(c => ({
          [t('sewing.ppChecklist.checkItem')]: c.checkItem,
          [t('sewing.ppChecklist.completed')]: c.completed ? 'Y' : 'N',
          [t('sewing.ppChecklist.responsible')]: c.responsible,
          [t('sewing.ppChecklist.completedDate')]: c.completedDate,
        })),
        'pp-checklist'
      )
    } else {
      exportToCsv(
        process.map(p => ({
          '#': p.sequence,
          [t('sewing.ppChecklist.processName')]: p.processName,
          [t('sewing.ppChecklist.responsible')]: p.responsible,
          [t('sewing.ppChecklist.smv')]: p.smv,
        })),
        'process-layout'
      )
    }
  }

  const tabs: { key: TabType; label: string }[] = [
    { key: 'checklist', label: t('sewing.ppChecklist.ppChecklist') },
    { key: 'processLayout', label: t('sewing.ppChecklist.processLayout') },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('sewing.ppChecklist.title')} />

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

        {activeTab === 'checklist' && (
          <>
            <p className="text-sm text-gray-500 mb-3">
              {t('sewing.ppChecklist.completed')}: {completedCount} / {checklist.length}
            </p>
            <MesGrid columns={checklistColumns} data={checklist} height={340} gridKey="H-SW-02-checklist-grid" />
          </>
        )}

        {activeTab === 'processLayout' && (
          <MesGrid columns={processColumns} data={process} height={340} gridKey="H-SW-02-process-grid" />
        )}
      </div>
    </div>
  )
}
