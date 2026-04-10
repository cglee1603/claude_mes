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
  | 'ACTIVE'
  | 'ARCHIVED'

interface StatusBadgeProps {
  status: LotStatus | string
  label?: string
}

const statusColorMap: Record<string, string> = {
  CUTTING: 'bg-blue-100 text-blue-800',
  READY_FOR_SEW: 'bg-cyan-100 text-cyan-800',
  SEWN: 'bg-indigo-100 text-indigo-800',
  QC: 'bg-yellow-100 text-yellow-800',
  PASSED_QC: 'bg-green-100 text-green-800',
  MFZ_HOLD: 'bg-red-100 text-red-800',
  READY_PACK: 'bg-purple-100 text-purple-800',
  PACKED: 'bg-violet-100 text-violet-800',
  SHIPPED: 'bg-gray-100 text-gray-600',
  ACTIVE: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-100 text-gray-500',
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const colorClass = statusColorMap[status] ?? 'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label ?? status}
    </span>
  )
}
