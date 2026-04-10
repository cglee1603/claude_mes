import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

type Trend = 'up' | 'down' | 'neutral'
type Color = 'blue' | 'green' | 'red' | 'yellow'

interface KpiCardProps {
  label: string
  value: number | string
  unit?: string
  trend?: Trend
  color?: Color
}

const colorMap: Record<Color, string> = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600',
}

const trendIconMap: Record<Trend, React.ReactNode> = {
  up: <TrendingUp className="w-4 h-4 text-green-500" />,
  down: <TrendingDown className="w-4 h-4 text-red-500" />,
  neutral: <Minus className="w-4 h-4 text-gray-400" />,
}

export function KpiCard({ label, value, unit, trend, color = 'blue' }: KpiCardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {trend && <span>{trendIconMap[trend]}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-bold ${colorMap[color]}`}>{value}</span>
        {unit && <span className="text-sm text-gray-400">{unit}</span>}
      </div>
    </div>
  )
}
