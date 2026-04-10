import { http, HttpResponse } from 'msw'

export const cuttingHandlers = [
  http.get('/api/cutting/lots', () => {
    return HttpResponse.json({ ok: true, data: [] })
  }),
  http.post('/api/cutting/create-lot', () => {
    return HttpResponse.json({ ok: true, data: { id: 'mock-lot-1' } })
  }),
  http.post('/api/cutting/create-bundle', () => {
    return HttpResponse.json({ ok: true, data: { id: 'mock-bundle-1' } })
  }),
  http.get('/api/lots/:lotNo/trace', () => {
    return HttpResponse.json({ ok: true, data: null })
  }),
]
