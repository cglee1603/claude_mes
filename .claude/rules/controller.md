---
globs: apps/api/src/routes/**/*.ts
description: API Route(Controller) 파일 작성/수정 시 자동 참조되는 규칙
---

# API Route 레이어 규칙

> 적용 대상: `apps/api/src/routes/*.ts`
> 참고: CLAUDE.md §6 API Patterns

## 요약
Express 라우터로 HTTP 엔드포인트를 정의한다.
Zod로 요청을 검증하고 Service에 위임한 뒤 Result를 HTTP 응답으로 변환한다.
비즈니스 로직이나 DB 접근을 직접 수행하지 않는다.

## 규칙

### 1. Dual-Endpoint 패턴
- POST: 상태 변경
- GET: 조회
- 모든 엔드포인트는 `spec.yaml` 에 먼저 정의 (W5 이후)

### 2. 필수 구현 패턴 (C-4 + H-3)
```typescript
import { Router } from 'express'
import { z } from 'zod'
import type { ProductionService } from '../services/production.service'

const router = Router()

// POST — Zod 검증 필수 (C-4) + Result 처리 필수 (H-3)
router.post('/record-line-output', async (req, res) => {
  const schema = z.object({
    lotId: z.string().uuid(),
    lineId: z.string().uuid(),
    periodStart: z.string().datetime(),
    periodEnd: z.string().datetime(),
    outputQty: z.number().int().positive(),
    defectQty: z.number().int().min(0),
    workerId: z.string().uuid().nullable().optional(),  // ADR-013 선택
    lineManagerId: z.string().uuid(),
  })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success)
    return res.status(400).json({ ok: false, error: parsed.error.flatten() })

  const result = await service.recordLineOutput(parsed.data)
  if (!result.ok)
    return res.status(422).json({ ok: false, error: result.error })

  res.json({ ok: true, data: result.value })
})

// GET — 조회
router.get('/:lineId/efficiency', async (req, res) => {
  const { lineId } = req.params
  const result = await service.getLineEfficiency(lineId)
  if (!result.ok)
    return res.status(404).json({ ok: false, error: result.error })
  res.json({ ok: true, data: result.value })
})

export default router
```

### 3. 엔드포인트 패턴
| 동작 | HTTP | URL | 서비스 메서드 |
|------|------|-----|------------|
| 목록 조회 | GET | `/` | `get{Domain}List` |
| 단건 조회 | GET | `/:id` | `get{Domain}` |
| 생성 | POST | `/` | `create{Domain}` |
| 상태 변경 | POST | `/:id/{action}` | `{action}{Domain}` |
| 완전 추적 | GET | `/:lotNo/trace` | `getLotTrace` |

### 4. 에러 처리 규칙
- try/catch를 직접 작성하지 않는다 — Express 전역 에러 핸들러에 위임
- `result.ok === false`는 예상된 도메인 에러 (422)
- 예상 외 예외는 `next(err)`로 전달

### 5. 응답 형식 통일
```typescript
// 성공
{ ok: true, data: T }

// 도메인 에러
{ ok: false, error: { code: string, message: string } }

// 검증 에러
{ ok: false, error: ZodError.flatten() }
```
