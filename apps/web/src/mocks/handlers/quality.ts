import { http, HttpResponse } from 'msw'

const inlineResults = Array.from({ length: 10 }, (_, i) => ({
  id: `inline-${i + 1}`,
  lotNo: `ORD-2024-${String(Math.floor(i / 3) + 1).padStart(3, '0')}-L${String((i % 3) + 1).padStart(3, '0')}`,
  lineNo: ['Line A', 'Line B', 'Line C', 'Line D'][i % 4],
  inspectedQty: 80 + Math.floor(Math.random() * 120),
  defectCount: Math.floor(Math.random() * 7),
  dhu: Number((Math.random() * 6).toFixed(2)),
  ftp: i % 3 === 1 ? 'FAIL' : 'PASS',
  inspectedAt: `2026-04-${String(10 - Math.floor(i / 3)).padStart(2, '0')} ${String(8 + i).padStart(2, '0')}:${String(i * 5).padStart(2, '0')}`,
}))

const finalResults = Array.from({ length: 8 }, (_, i) => ({
  id: `final-${i + 1}`,
  lotNo: `ORD-2024-${String(Math.floor(i / 3) + 1).padStart(3, '0')}-L${String((i % 3) + 1).padStart(3, '0')}`,
  sampleSize: [50, 80][i % 2],
  majorDefects: Math.floor(Math.random() * 5),
  minorDefects: Math.floor(Math.random() * 8),
  aqlLevel: ['2.5', '4.0'][i % 2],
  verdict: i % 4 === 1 ? 'FAIL' : 'PASS',
  inspectedAt: `2026-04-${String(10 - Math.floor(i / 2)).padStart(2, '0')} ${String(8 + i).padStart(2, '0')}:00`,
}))

const lineNames = ['Line A', 'Line B', 'Line C', 'Line D'] as const

const dhuTrend = Array.from({ length: 14 }, (_, i) => {
  const d = new Date('2026-03-28')
  d.setDate(d.getDate() + i)
  return {
    date: d.toISOString().slice(0, 10),
    lines: lineNames.map((name) => ({
      name,
      dhu: Number((1.0 + Math.sin(i * 0.5) * 1.5 + Math.random()).toFixed(2)),
    })),
  }
})

const dashboardData = {
  kpi: {
    totalInspections: 156,
    passRate: 87.2,
    avgDhu: 2.14,
    mfzHoldCount: 2,
  },
  defectDistribution: [
    { defectType: 'BROKEN_STITCH', count: 42, percentage: 28.0 },
    { defectType: 'SKIP_STITCH', count: 31, percentage: 20.7 },
    { defectType: 'UNEVEN_SEAM', count: 25, percentage: 16.7 },
    { defectType: 'FABRIC_DAMAGE', count: 18, percentage: 12.0 },
    { defectType: 'STAIN', count: 14, percentage: 9.3 },
    { defectType: 'MEASUREMENT_ERROR', count: 11, percentage: 7.3 },
    { defectType: 'PUCKERING', count: 6, percentage: 4.0 },
    { defectType: 'OTHER', count: 3, percentage: 2.0 },
  ],
  recentResults: [
    { id: '1', lotNo: 'ORD-2024-001-L001', inspectionType: 'INLINE', verdict: 'PASS', dhu: 1.67, inspectedAt: '2026-04-10 14:00' },
    { id: '2', lotNo: 'ORD-2024-001-L002', inspectionType: 'FINAL', verdict: 'FAIL', dhu: 5.0, inspectedAt: '2026-04-10 13:30' },
    { id: '3', lotNo: 'ORD-2024-002-L001', inspectionType: 'INLINE', verdict: 'PASS', dhu: 0.67, inspectedAt: '2026-04-10 13:00' },
    { id: '4', lotNo: 'ORD-2024-002-L002', inspectionType: 'PACKING', verdict: 'PASS', dhu: 1.2, inspectedAt: '2026-04-10 12:00' },
    { id: '5', lotNo: 'ORD-2024-003-L001', inspectionType: 'SHIPPING', verdict: 'PASS', dhu: 0.0, inspectedAt: '2026-04-10 11:30' },
  ],
}

export const qualityHandlers = [
  // Inline inspection results (10 rows)
  http.get('/api/quality/inline-results', () => {
    return HttpResponse.json({ ok: true, data: inlineResults })
  }),

  // Final inspection results (8 rows)
  http.get('/api/quality/final-results', () => {
    return HttpResponse.json({ ok: true, data: finalResults })
  }),

  // DHU trend (14 days x 4 lines)
  http.get('/api/quality/dhu-trend', () => {
    return HttpResponse.json({ ok: true, data: dhuTrend })
  }),

  // QC Dashboard
  http.get('/api/quality/dashboard', () => {
    return HttpResponse.json({ ok: true, data: dashboardData })
  }),

  // Submit inline inspection
  http.post('/api/quality/inline-inspect', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      ok: true,
      data: {
        id: crypto.randomUUID(),
        ...body as Record<string, unknown>,
        inspectedAt: new Date().toISOString(),
      },
    })
  }),

  // Submit final inspection
  http.post('/api/quality/final-inspect', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      ok: true,
      data: {
        id: crypto.randomUUID(),
        ...body as Record<string, unknown>,
        inspectedAt: new Date().toISOString(),
      },
    })
  }),

  // Submit packing inspection
  http.post('/api/quality/packing-inspect', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      ok: true,
      data: {
        id: crypto.randomUUID(),
        ...body as Record<string, unknown>,
        completedAt: new Date().toISOString(),
      },
    })
  }),

  // Submit shipping inspection
  http.post('/api/quality/shipping-inspect', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      ok: true,
      data: {
        id: crypto.randomUUID(),
        ...body as Record<string, unknown>,
        completedAt: new Date().toISOString(),
      },
    })
  }),
]
