import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'

interface MaterialHoursRow {
  id: string
  materialName: string
  code: string
  requiredHours: number
}

const MATERIAL_HOURS: MaterialHoursRow[] = [
  { id: '1', materialName: 'relaxation.material.cotton', code: 'COTTON', requiredHours: 48 },
  { id: '2', materialName: 'relaxation.material.linen', code: 'LINEN', requiredHours: 48 },
  { id: '3', materialName: 'relaxation.material.poly', code: 'POLY', requiredHours: 24 },
  { id: '4', materialName: 'relaxation.material.wool', code: 'WOOL', requiredHours: 72 },
]

export function RX05MaterialPage() {
  const { t } = useTranslation()

  const columns: Column<MaterialHoursRow>[] = [
    {
      key: 'materialName',
      header: t('relaxation.material.materialName'),
      render: (row) => <span className="font-medium">{t(row.materialName)}</span>,
    },
    { key: 'code', header: t('relaxation.material.code') },
    {
      key: 'requiredHours',
      header: t('relaxation.material.requiredHours'),
      render: (row) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
          {row.requiredHours}h
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('relaxation.material.title')}
        subtitle={t('relaxation.material.subtitle')}
      />

      <div className="card">
        <MesGrid<MaterialHoursRow> columns={columns} data={MATERIAL_HOURS} />
      </div>
    </div>
  )
}
