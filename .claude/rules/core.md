---
globs: apps/api/src/config/**/*.ts,apps/api/src/lib/**/*.ts,packages/domain/src/**/*.ts
description: Core 인프라(설정·DB·공통 타입) 파일 작성/수정 시 자동 참조되는 규칙
---

# Core 인프라 규칙

> 적용 대상: `apps/api/src/config/`, `apps/api/src/lib/`, `packages/domain/src/`

## 요약
프로젝트 전반에서 사용하는 환경 설정, Prisma 클라이언트, 공통 Result 타입, 로거를 정의한다.
도메인 로직은 포함하지 않는다.

## 파일 구성

### apps/api/src/config/env.ts
- `zod` 기반 환경변수 스키마 검증.
- `DATABASE_URL`, `JWT_SECRET`, `PORT`, `NODE_ENV`, `CORS_ORIGINS` 필수.
- 앱 시작 시 파싱 실패 → 즉시 종료 (fail-fast).

```ts
import { z } from 'zod';
const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET:   z.string().min(32),
  PORT:         z.coerce.number().default(3000),
  NODE_ENV:     z.enum(['development', 'test', 'production']).default('development'),
});
export const env = EnvSchema.parse(process.env);
```

### apps/api/src/lib/prisma.ts
- Prisma 클라이언트 싱글턴.
- `NODE_ENV=test` 시 별도 TEST_DATABASE_URL 사용.
- 트랜잭션은 `prisma.$transaction([...])` 또는 인터랙티브 트랜잭션 패턴.

```ts
import { PrismaClient } from '@prisma/client';
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### packages/domain/src/result.ts
- `Result<T, E>` 타입 — 모든 Service 메서드의 반환 타입 (ADR-001).
- `ok(value)` / `err(error)` 헬퍼 export.

```ts
export type Result<T, E = DomainError> =
  | { success: true;  value: T }
  | { success: false; error: E };
export const ok  = <T>(value: T): Result<T, never> => ({ success: true, value });
export const err = <E>(error: E): Result<never, E> => ({ success: false, error });
```

### apps/api/src/lib/logger.ts
- `pino` 기반 구조화 로거.
- 로그에 비밀번호·토큰·worker_id 개인식별 정보 포함 금지.

## 규칙

1. **core는 도메인 로직 불포함** — 도메인 모듈이 core를 import하되, core가 도메인을 import하지 않는다.
2. **설정 하드코딩 금지** — 모든 외부 주소·시크릿은 `env.ts` 경유.
3. **Prisma 클라이언트 직접 생성 금지** — `lib/prisma.ts` 싱글턴만 사용.
4. **Result 타입 필수** — Service 메서드는 반드시 `Result<T, DomainError>` 반환 (ADR-001).
