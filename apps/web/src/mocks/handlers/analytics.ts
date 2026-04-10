import { http, HttpResponse } from 'msw'

export const analyticsHandlers = [
  http.get('/api/analytics/factory-kpi', () => {
    return HttpResponse.json({
      ok: true,
      data: {
        todayOutput: 1250,
        weeklyOutput: 6800,
        overallEfficiency: 78.5,
        onTimeDelivery: 94.2,
        qualityRate: 96.8,
        activeOrders: 12,
        wipLots: 47,
      },
    })
  }),
  http.get('/api/orders/:orderId/status', () => {
    return HttpResponse.json({ ok: true, data: null })
  }),
]
