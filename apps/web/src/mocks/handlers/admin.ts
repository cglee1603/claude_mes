import { http, HttpResponse } from 'msw'

export const adminHandlers = [
  http.get('/api/admin/lines', () => {
    return HttpResponse.json({ ok: true, data: [] })
  }),
  http.get('/api/admin/machines', () => {
    return HttpResponse.json({ ok: true, data: [] })
  }),
  http.get('/api/admin/smv', () => {
    return HttpResponse.json({ ok: true, data: [] })
  }),
  http.get('/api/admin/erp-sync', () => {
    return HttpResponse.json({ ok: true, data: { lastSync: null, pendingItems: 0 } })
  }),
  http.get('/api/admin/lifecycle', () => {
    return HttpResponse.json({ ok: true, data: [] })
  }),
  http.get('/api/admin/qc-config', () => {
    return HttpResponse.json({ ok: true, data: [] })
  }),
]
