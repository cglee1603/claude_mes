import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../components/common/PageHeader'
import { MesGrid } from '../../components/common'
import type { Column } from '../../components/common'

interface HourlySlot {
  hour: string
  entered: boolean
  outputQty: number | null
  defectQty: number | null
}

interface RecentEntry {
  id: string
  line: string
  timePeriod: string
  outputQty: number
  defectQty: number
  enteredAt: string
}

const HOURLY_SLOTS: HourlySlot[] = [
  { hour: '08:00', entered: true, outputQty: 95, defectQty: 2 },
  { hour: '09:00', entered: true, outputQty: 102, defectQty: 3 },
  { hour: '10:00', entered: true, outputQty: 98, defectQty: 1 },
  { hour: '11:00', entered: true, outputQty: 105, defectQty: 2 },
  { hour: '12:00', entered: false, outputQty: null, defectQty: null },
  { hour: '13:00', entered: false, outputQty: null, defectQty: null },
  { hour: '14:00', entered: false, outputQty: null, defectQty: null },
  { hour: '15:00', entered: false, outputQty: null, defectQty: null },
  { hour: '16:00', entered: false, outputQty: null, defectQty: null },
]

const MOCK_RECENT: RecentEntry[] = [
  { id: 'HE-001', line: 'LINE-A', timePeriod: '11:00-12:00', outputQty: 105, defectQty: 2, enteredAt: '2026-04-17 11:05' },
  { id: 'HE-002', line: 'LINE-A', timePeriod: '10:00-11:00', outputQty: 98, defectQty: 1, enteredAt: '2026-04-17 10:04' },
  { id: 'HE-003', line: 'LINE-A', timePeriod: '09:00-10:00', outputQty: 102, defectQty: 3, enteredAt: '2026-04-17 09:03' },
  { id: 'HE-004', line: 'LINE-A', timePeriod: '08:00-09:00', outputQty: 95, defectQty: 2, enteredAt: '2026-04-17 08:06' },
  { id: 'HE-005', line: 'LINE-B', timePeriod: '11:00-12:00', outputQty: 110, defectQty: 1, enteredAt: '2026-04-17 11:08' },
]

const LINES = ['LINE-A', 'LINE-B', 'LINE-C', 'LINE-D']

export function HSW07Page() {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    line: 'LINE-A',
    timePeriod: '12:00',
    outputQty: '',
    defectQty: '',
  })

  const currentHour = 12
  const deadlineMinutes = 10
  const minutesLeft = deadlineMinutes

  const isLate = minutesLeft <= 0

  const recentColumns: Column<RecentEntry>[] = [
    { key: 'line', header: t('sewing.hourlyEntry.line'), width: 90 },
    { key: 'timePeriod', header: t('sewing.hourlyEntry.timePeriod'), width: 120 },
    { key: 'outputQty', header: t('sewing.hourlyEntry.outputQty'), width: 100 },
    { key: 'defectQty', header: t('sewing.hourlyEntry.defectQty'), width: 100 },
    { key: 'enteredAt', header: t('sewing.hourlyEntry.enteredAt'), width: 130 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('sewing.hourlyEntry.title')} />

      <div className="flex gap-4 items-start">
        <div className="card flex-1">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-gray-700">{t('sewing.hourlyEntry.deadline')}</h2>
            <span className={`text-lg font-bold ${isLate ? 'text-red-600' : 'text-blue-600'}`}>
              {currentHour}:{String(60 - minutesLeft).padStart(2, '0')} {t('sewing.hourlyEntry.deadline')}
            </span>
          </div>
          {isLate && (
            <p className="text-xs text-red-600 font-medium mt-1">{t('sewing.hourlyEntry.lateWarning')}</p>
          )}
        </div>

        <div className="card flex-1">
          <div className="text-sm text-gray-500">{t('sewing.hourlyEntry.currentTime')}</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">
            2026-04-17 12:00
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">{t('sewing.hourlyEntry.submit')}</h2>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.hourlyEntry.line')}</label>
            <select
              className="input w-full"
              value={form.line}
              onChange={e => setForm(p => ({ ...p, line: e.target.value }))}
            >
              {LINES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.hourlyEntry.timePeriod')}</label>
            <select
              className="input w-full"
              value={form.timePeriod}
              onChange={e => setForm(p => ({ ...p, timePeriod: e.target.value }))}
            >
              {HOURLY_SLOTS.map(s => <option key={s.hour} value={s.hour}>{s.hour}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.hourlyEntry.outputQty')}</label>
            <input
              type="number"
              className="input w-full"
              value={form.outputQty}
              onChange={e => setForm(p => ({ ...p, outputQty: e.target.value }))}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('sewing.hourlyEntry.defectQty')}</label>
            <input
              type="number"
              className="input w-full"
              value={form.defectQty}
              onChange={e => setForm(p => ({ ...p, defectQty: e.target.value }))}
              placeholder="0"
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button className="btn-primary text-sm px-4 py-1.5">{t('sewing.hourlyEntry.submit')}</button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-base font-semibold text-gray-800 mb-4">{t('sewing.hourlyEntry.todaySummary')}</h2>
        <div className="grid grid-cols-9 gap-1">
          {HOURLY_SLOTS.map(slot => (
            <div
              key={slot.hour}
              className={`rounded p-2 text-center border ${slot.entered ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
            >
              <div className="text-xs font-medium text-gray-600">{slot.hour}</div>
              {slot.entered ? (
                <>
                  <div className="text-sm font-bold text-green-700 mt-0.5">{slot.outputQty}</div>
                  <div className="text-xs text-green-600">{t('sewing.hourlyEntry.entered')}</div>
                </>
              ) : (
                <>
                  <div className="text-sm font-bold text-red-500 mt-0.5">-</div>
                  <div className="text-xs text-red-500">{t('sewing.hourlyEntry.notEntered')}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-base font-semibold text-gray-800 mb-4">{t('sewing.hourlyEntry.recentHistory')}</h2>
        <MesGrid columns={recentColumns} data={MOCK_RECENT} height={220} gridKey="H-SW-07-grid" />
      </div>
    </div>
  )
}
