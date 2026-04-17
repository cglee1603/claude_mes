import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/* ── M-Grade Cost System (M5 = baseline) ────────── */
const GRADE_COST: Record<string, number> = {
  M1: -4, M2: -3, M3: -2, M4: -1, M5: 0,
  M6:  1, M7:  2, M8:  3, M9:  4, M10: 5, M11: 6,
}

function cardBg(grade: string) {
  const c = GRADE_COST[grade] ?? 0
  if (c < 0)   return 'bg-red-600    border-red-500'
  if (c === 0) return 'bg-yellow-500 border-yellow-400'
  return              'bg-green-600  border-green-500'
}

function costDisplay(grade: string) {
  const c = GRADE_COST[grade] ?? 0
  if (c > 0) return { sign: '+', color: 'text-green-200',  value: `$${c.toFixed(2)}` }
  if (c < 0) return { sign: '−', color: 'text-red-200',    value: `$${Math.abs(c).toFixed(2)}` }
  return           { sign: '',   color: 'text-yellow-100', value: 'Baseline' }
}

const INIT_DATA = [
  { team: 'LINE-1', grade: 'M6',  ach: 102 },
  { team: 'LINE-2', grade: 'M4',  ach: 83  },
  { team: 'LINE-3', grade: 'M7',  ach: 112 },
  { team: 'LINE-4', grade: 'M5',  ach: 94  },
  { team: 'LINE-5', grade: 'M3',  ach: 71  },
  { team: 'LINE-6', grade: 'M8',  ach: 121 },
  { team: 'LINE-7', grade: 'M5',  ach: 92  },
  { team: 'LINE-8', grade: 'M2',  ach: 62  },
]

export function HBoard01Page() {
  const { t } = useTranslation()
  const [time, setTime] = useState(new Date())
  const [data] = useState(INIT_DATA)

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const aboveCount = data.filter(d => (GRADE_COST[d.grade] ?? 0) > 0).length
  const belowCount = data.filter(d => (GRADE_COST[d.grade] ?? 0) < 0).length
  const baseCount  = data.length - aboveCount - belowCount

  return (
    <div className="min-h-screen bg-gray-950 p-6 flex flex-col select-none">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-3xl font-black tracking-wide">
            {t('sewing.scoreboard.title')}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            M5 = Baseline &nbsp;·&nbsp;
            <span className="text-green-400">▲ Above M5 = Cost +</span>
            &nbsp;·&nbsp;
            <span className="text-red-400">▼ Below M5 = Cost −</span>
          </p>
        </div>
        <div className="text-right">
          <div className="text-white text-3xl font-mono font-bold tabular-nums">
            {time.toLocaleTimeString('en-GB')}
          </div>
          <div className="text-gray-400 text-sm mt-0.5">
            {time.toLocaleDateString('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Team cards */}
      <div className="grid grid-cols-4 gap-5 flex-1">
        {data.map(({ team, grade, ach }) => {
          const { sign, color, value } = costDisplay(grade)
          const current = parseInt(grade.replace('M', ''), 10)
          return (
            <div key={team} className={`rounded-2xl border-2 p-6 flex flex-col items-center justify-center gap-2 shadow-lg ${cardBg(grade)}`}>
              <div className="text-white/80 text-base font-semibold tracking-widest uppercase">{team}</div>
              <div className="text-white text-7xl font-black leading-none">{grade}</div>
              <div className={`text-3xl font-extrabold ${color}`}>{sign}{value}</div>
              <div className="text-white/60 text-sm">
                Ach: <span className="font-bold text-white/90">{ach}%</span>
              </div>
              {/* Grade bar: M1 → M11, M5 marker */}
              <div className="w-full mt-2 flex gap-0.5">
                {Array.from({ length: 11 }, (_, i) => (
                  <div key={i} className={`flex-1 h-2 rounded-sm ${
                    i + 1 === current ? 'bg-white' : i + 1 === 5 ? 'bg-white/40' : 'bg-white/15'
                  }`} />
                ))}
              </div>
              <div className="w-full flex justify-between text-[9px] text-white/40 px-0.5">
                <span>M1</span><span>M5</span><span>M11</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer summary */}
      <div className="mt-6 flex items-center justify-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-300">Above baseline: <strong className="text-white">{aboveCount}</strong> teams</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="text-gray-300">At M5 baseline: <strong className="text-white">{baseCount}</strong> teams</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-300">Below baseline: <strong className="text-white">{belowCount}</strong> teams</span>
        </div>
      </div>
    </div>
  )
}
