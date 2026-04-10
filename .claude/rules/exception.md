---
globs: packages/domain/src/errors/**/*.ts,apps/api/src/middleware/error*.ts
description: 에러/예외 처리 파일 작성/수정 시 자동 참조되는 규칙
---

# Error Handling 규칙

> 적용 대상: `packages/domain/src/errors/`, `apps/api/src/middleware/`
> 참고: CLAUDE.md §8 Error Handling

## 요약
`Result<T, DomainError>` 패턴으로 에러를 타입 안전하게 처리한다.
예상된 도메인 에러와 예상 외 예외를 명확히 구분한다.

## DomainError 정의
```typescript
// packages/domain/src/errors/index.ts
export type Result<T, E = DomainError> =
  | { ok: true; value: T }
  | { ok: false; error: E }

export interface DomainError {
  code: DomainErrorCode
  message: string
}

export type DomainErrorCode =
  | 'LOT_MFZ_HOLD'        // MFZ 미통과 LOT 출하 시도
  | 'SHADING_RISK'         // 동일 색상 다른 Roll 혼입
  | 'DUPLICATE_ORDER'      // 중복 오더번호
  | 'INVALID_STATUS'       // 허용되지 않는 상태 전이
  | 'ERP_ORDER_REQUIRED'   // ERP 오더 없이 LOT 생성
  | 'NOT_FOUND'            // 리소스 없음
  | 'VALIDATION_ERROR'     // 입력값 검증 실패
  | 'MFZ_DETECTED'         // 금속 검출 (CRITICAL 알림)
  | 'QUALITY_THRESHOLD'    // DHU/AQL 기준 초과
```

## Express 전역 에러 핸들러
```typescript
// apps/api/src/middleware/error-handler.ts
import type { ErrorRequestHandler } from 'express'

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // 예상 외 예외 (500) — 상세 내용 사용자에게 노출 금지
  console.error('Unexpected error', err)
  res.status(500).json({
    ok: false,
    error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다' }
  })
}
// app.use(errorHandler) — 모든 라우터 등록 후 마지막에 추가
```

## HTTP 상태코드 매핑
| DomainErrorCode | HTTP |
|----------------|------|
| NOT_FOUND | 404 |
| VALIDATION_ERROR | 400 |
| INVALID_STATUS, LOT_MFZ_HOLD, SHADING_RISK, DUPLICATE_ORDER | 422 |
| ERP_ORDER_REQUIRED | 400 |
| QUALITY_THRESHOLD, MFZ_DETECTED | 422 (+ WebSocket 알림) |

## 원칙
- Service에서 도메인 예외 → `Result.error` 반환
- Route에서 예상 외 예외 → `next(err)` 전달
- 에러 상세(stack trace)는 클라이언트에게 절대 노출 금지
