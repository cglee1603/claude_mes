import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common'
import { exportToCsv } from '@/utils/excel'

/* ── M-Grade System ──────────────────────────────
   M5 = baseline. M1-M4 = cost deduction. M6-M11 = cost bonus.
   Achievement % auto-maps to grade.
──────────────────────────────────────────────── */
const M_GRADES = ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11'] as const
type MGrade = typeof M_GRADES[number]

const GRADE_COST: Record<MGrade, number> = {
  M1: -4.00, M2: -3.00, M3: -2.00, M4: -1.00, M5: 0.00,
  M6:  1.00, M7:  2.00, M8:  3.00, M9:  4.00, M10: 5.00, M11: 6.00,
}

function achToGrade(ach: number): MGrade {
  if (ach < 55)  return 'M1'
  if (ach < 65)  return 'M2'
  if (ach < 75)  return 'M3'
  if (ach < 85)  return 'M4'
  if (ach < 95)  return 'M5'
  if (ach < 105) return 'M6'
  if (ach < 115) return 'M7'
  if (ach < 125) return 'M8'
  if (ach < 135) return 'M9'
  if (ach < 145) return 'M10'
  return 'M11'
}

function gradeColor(grade: MGrade) {
  const idx = M_GRADES.indexOf(grade)
  if (idx < 4)   return 'bg-red-100 text-red-800 border-red-300'
  if (idx === 4) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
  return 'bg-green-100 text-green-800 border-green-300'
}

const HOURS = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00']

const TEAM_PLANS = [
  { team: 'LINE-1', planPerHour: 48 },
  { team: 'LINE-2', planPerHour: 45 },
  { team: 'LINE-3', planPerHour: 50 },
  { team: 'LINE-4', planPerHour: 44 },
  { team: 'LINE-5', planPerHour: 47 },
  { team: 'LINE-6', planPerHour: 46 },
  { team: 'LINE-7', planPerHour: 49 },
  { team: 'LINE-8', planPerHour: 43 },
]
const TEAMS = TEAM_PLANS.map(p => p.team)

type ActualMap = Record<string, Record<number, string>>

function teamStats(team: string, actual: ActualMap) {
  const plan = TEAM_PLANS.find(p => p.team === team)!
  const totalPlan = HOURS.length * plan.planPerHour
  const totalActual = HOURS.reduce((sum, _, i) => {
    const v = parseInt(actual[team]?.[i] ?? '0', 10)
    return sum + (isNaN(v) ? 0 : v)
  }, 0)
  const ach = totalPlan > 0 ? (totalActual / totalPlan) * 100 : 0
  const grade = achToGrade(ach)
  return { totalPlan, totalActual, ach, grade, cost: GRADE_COST[grade] }
}

export function HRT01Page() {
  const { t } = useTranslation()
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [actual, setActual] = useState<ActualMap>(() =>
    Object.fromEntries(TEAMS.map(tm => [tm, {}]))
  )

  function setCell(team: string, hIdx: number, val: string) {
    setActual(prev => ({ ...prev, [team]: { ...prev[team], [hIdx]: val } }))
  }

  function handleExport() {
    const rows = TEAMS.map(team => {
      const s = teamStats(team, actual)
      return { Team: team, Plan: s.totalPlan, Actual: s.totalActual,
               'Ach%': s.ach.toFixed(1), Grade: s.grade,
               'Cost Adj': s.cost >= 0 ? `+$${s.cost.toFixed(2)}` : `-$${Math.abs(s.cost).toFixed(2)}` }
    })
    exportToCsv(rows, `team-output-${date}.csv`)
  }

  return (
    <div className="p-4 space-y-4">
      <PageHeader title={t('sewing.output.title')} subtitle={t('sewing.output.subtitle')}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input text-sm" />
        <button onClick={handleExport} className="btn-secondary text-sm">{t('common.exportExcel')}</button>
      </PageHeader>

      {/* Team grade summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {TEAMS.map(team => {
          const { ach, grade, cost } = teamStats(team, actual)
          return (
            <div key={team} className={`rounded-lg border p-3 ${gradeColor(grade)}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm">{team}</span>
                <span className="text-xl font-extrabold">{grade}</span>
              </div>
              <div className="text-xs">Achievement: {ach.toFixed(1)}%</div>
              <div className="text-sm font-bold mt-0.5">
                {cost === 0
                  ? 'Baseline'
                  : cost > 0
                    ? <span className="text-green-800">+${cost.toFixed(2)} Bonus</span>
                    : <span className="text-red-800">-${Math.abs(cost).toFixed(2)} Deduction</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Hourly entry grid */}
      <div className="card overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-3 py-2 text-left sticky left-0 bg-gray-100 z-10">Team</th>
              <th className="border border-gray-200 px-2 py-2 text-gray-500">Plan/h</th>
              {HOURS.map(h => (
                <th key={h} className="border border-gray-200 px-2 py-2 whitespace-nowrap">{h}</th>
              ))}
              <th className="border border-gray-200 px-2 py-2">Total</th>
              <th className="border border-gray-200 px-2 py-2">Ach%</th>
              <th className="border border-gray-200 px-2 py-2">Grade</th>
            </tr>
          </thead>
          <tbody>
            {TEAMS.map(team => {
              const planRow = TEAM_PLANS.find(p => p.team === team)!
              const { totalActual, ach, grade } = teamStats(team, actual)
              const achColor = ach >= 95 ? 'text-green-700' : ach >= 85 ? 'text-yellow-700' : 'text-red-700'
              return (
                <tr key={team} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-1 font-semibold sticky left-0 bg-white z-10">{team}</td>
                  <td className="border border-gray-200 px-2 py-1 text-center text-gray-400">{planRow.planPerHour}</td>
                  {HOURS.map((_, hIdx) => (
                    <td key={hIdx} className="border border-gray-200 p-0">
                      <input
                        type="number" min="0"
                        value={actual[team]?.[hIdx] ?? ''}
                        onChange={e => setCell(team, hIdx, e.target.value)}
                        className="w-14 text-center text-xs py-1.5 outline-none focus:bg-blue-50"
                        placeholder="—"
                      />
                    </td>
                  ))}
                  <td className="border border-gray-200 px-2 py-1 text-center font-bold">{totalActual}</td>
                  <td className={`border border-gray-200 px-2 py-1 text-center font-semibold ${achColor}`}>
                    {ach.toFixed(1)}%
                  </td>
                  <td className="border border-gray-200 px-2 py-1 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${gradeColor(grade)}`}>{grade}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
