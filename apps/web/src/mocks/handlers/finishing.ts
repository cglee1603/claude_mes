import { http, HttpResponse } from 'msw'

export const finishingHandlers = [
  http.post('/api/finishing/apply-tag', () => {
    return HttpResponse.json({ ok: true, data: { id: 'mock-tag-1' } })
  }),
  http.post('/api/finishing/record-mfz', () => {
    return HttpResponse.json({ ok: true, data: { id: 'mock-mfz-1' } })
  }),
  http.post('/api/shipment/confirm-shipment', () => {
    return HttpResponse.json({ ok: true, data: { id: 'mock-shipment-1' } })
  }),
]
