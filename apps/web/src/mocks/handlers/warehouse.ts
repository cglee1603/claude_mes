import { http, HttpResponse } from 'msw'

export const warehouseHandlers = [
  http.get('/api/warehouse/receipts', () => {
    return HttpResponse.json({ ok: true, data: [] })
  }),
  http.post('/api/warehouse/receive-fabric', () => {
    return HttpResponse.json({ ok: true, data: { id: 'mock-receipt-1' } })
  }),
  http.get('/api/warehouse/receipts/:id', () => {
    return HttpResponse.json({ ok: true, data: null })
  }),
]
