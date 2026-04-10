import { http, HttpResponse } from 'msw'

export const sewingHandlers = [
  http.get('/api/production/lines', () => {
    return HttpResponse.json({ ok: true, data: [] })
  }),
  http.post('/api/production/record-line-output', () => {
    return HttpResponse.json({ ok: true, data: { id: 'mock-output-1' } })
  }),
  http.get('/api/lines/:lineId/efficiency', () => {
    return HttpResponse.json({ ok: true, data: null })
  }),
]
