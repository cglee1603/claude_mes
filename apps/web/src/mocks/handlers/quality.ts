import { http, HttpResponse } from 'msw'

export const qualityHandlers = [
  http.get('/api/quality/inspections', () => {
    return HttpResponse.json({ ok: true, data: [] })
  }),
  http.post('/api/quality/inline-inspect', () => {
    return HttpResponse.json({ ok: true, data: { id: 'mock-qc-1' } })
  }),
  http.get('/api/quality/dhu-trend', () => {
    return HttpResponse.json({ ok: true, data: [] })
  }),
]
