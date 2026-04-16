---
globs: apps/api/src/middleware/**/*.ts
description: Express 미들웨어/인증 파일 작성/수정 시 자동 참조되는 규칙
---

# Middleware / Auth 규칙

> 적용 대상: `apps/api/src/middleware/`

## 요약
Express 미들웨어로 요청/응답 공통 처리(Zod 검증, CORS, 인증, 로깅)를 구현한다.

## 미들웨어 구성

### 1. Zod 검증 미들웨어 (C-4 보조)
```typescript
// middleware/validate.ts
import { z, ZodSchema } from 'zod'
import type { RequestHandler } from 'express'

export const validate = (schema: ZodSchema): RequestHandler => (req, res, next) => {
  const parsed = schema.safeParse(req.body)
  if (!parsed.success)
    return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  req.body = parsed.data
  next()
}
```

### 2. CORS
```typescript
// cors 허용 origin은 환경변수에서 로드
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(',') }))
```

### 3. 요청 로깅
- 요청 시작/종료: method, path, statusCode, 소요시간
- request body는 로깅하지 않음 (개인정보 보호)
- `X-Request-ID` 헤더 부여 (추적용)

### 4. 인증 — JWT Bearer
```typescript
// middleware/auth.ts
export const authenticate: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED' } })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as User
    next()
  } catch {
    res.status(401).json({ ok: false, error: { code: 'INVALID_TOKEN' } })
  }
}
```

### 5. 역할(Role) 정의 — 확장 가능 구조

초기 5개 역할은 시드 데이터로 제공하며, 역할별 화면 권한은 DB에서 동적 관리 (permission.md 참조).

| roleCode | 초기 용도 |
|----------|---------|
| `factory_manager` | 공장장 대시보드, 전체 조회 |
| `line_manager` | 팀 실적 입력, 라인 관리 |
| `qc_inspector` | QC 검사 입력 |
| `warehouse` | 창고·릴렉싱 입력 |
| `admin` | 마스터 데이터·권한·백업 관리 |

> ⚠️ 역할·부서 기준은 차후 확정 예정. 화면 권한은 코드가 아닌 DB `screen_permissions` 테이블에서 관리 (permission.md §2).

### 6. 권한 체크 미들웨어 연동

`authenticate`(인증) 이후 `requirePermission`(권한)을 반드시 순서대로 적용.

```typescript
// permission.md §3·§4 참조
import { requirePermission } from './permission'

app.use('/api/production',
  authenticate,
  requirePermission('SW-17', 'CREATE'),  // 화면코드, 액션
  productionRouter
)
```

- 권한 결정 로직은 `permission.service.ts` 집중 관리 (permission.md §3)
- 사용자 JWT에 `role`, `departmentIds` 포함 필수

### 7. JWT 페이로드 구조

```typescript
interface JwtPayload {
  id:            string     // 사용자 UUID
  role:          string     // roleCode (factory_manager 등)
  departmentIds: string[]   // 소속 부서 UUID 목록
  name:          string
  iat:           number
  exp:           number
}
```

### 8. 미들웨어 등록 순서

```typescript
app.use(cors(...))
app.use(express.json())
app.use(requestLogger)
app.use(requestId)
// 라우터 등록 — authenticate → requirePermission 순서 필수
app.use('/api/production',
  authenticate,
  requirePermission('SW-17', 'CREATE'),
  require('./routes/production')
)
// 마지막에 에러 핸들러
app.use(errorHandler)
```
