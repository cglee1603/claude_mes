import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

type Color = 'blue' | 'green' | 'red' | 'yellow'

interface KpiCardProps {
  label: string
  value: number | string
  unit?: string
  /** 추세 표시 텍스트 (예: "+1.2%", "-0.3%") */
  trend?: string
  /** true = 상승(녹색), false = 하락(빨간), undefined = 중립(회색) */
  trendUp?: boolean
  color?: Color
}

const colorMap: Record<Color, string> = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600',
}

function TrendIndicator({ trend, trendUp }: { trend: string; trendUp?: boolean }) {
  if (trendUp === true)
    return (
      <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium">
        <TrendingUp className="w-3.5 h-3.5" />{trend}
      </span>
    )
  if (trendUp === false)
    return (
      <span className="flex items-center gap-0.5 text-xs text-red-500 font-medium">
        <TrendingDown className="w-3.5 h-3.5" />{trend}
      </span>
    )
  return (
    <span className="flex items-center gap-0.5 text-xs text-gray-400 font-medium">
      <Minus className="w-3.5 h-3.5" />{trend}
    </span>
  )
}

export function KpiCard({ label, value, unit, trend, trendUp, color = 'blue' }: KpiCardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {trend && <TrendIndicator trend={trend} trendUp={trendUp} />}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-bold ${colorMap[color]}`}>{value}</span>
        {unit && <span className="text-sm text-gray-400">{unit}</span>}
      </div>
    </div>
  )
}
