---
globs: src/yic_mes/core/middleware.py,src/yic_mes/core/auth.py
description: 미들웨어/인증 파일 작성/수정 시 자동 참조되는 규칙
---

# Middleware / Auth 규칙

> 적용 대상: `src/yic_mes/core/middleware.py`, `src/yic_mes/core/auth.py`

## 요약
요청/응답 공통 처리(로깅, CORS, 인증)를 미들웨어와 의존성으로 구현한다.

## 미들웨어 구성

### 1. CORS
- `CORSMiddleware` — 허용 origin은 `config.CORS_ORIGINS`에서 로드.

### 2. 요청 로깅
- 요청 시작/종료 시 method, path, status_code, 소요시간 로깅.
- body는 로깅하지 않음 (개인정보 보호).

### 3. 요청 ID
- 각 요청에 UUID `X-Request-ID` 헤더 부여.
- 로그에 request_id를 포함하여 추적 가능하게 함.

## 인증/인가

### 1. 인증 방식
- JWT Bearer 토큰 기반.
- `Authorization: Bearer <token>` 헤더에서 추출.

### 2. 의존성 함수
```python
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """토큰 검증 후 현재 사용자 반환. 실패 시 AuthenticationError raise."""
```

### 3. 권한 검사
- 역할(role) 기반: `admin`, `operator`, `viewer`.
- 권한 의존성: `Depends(require_role("admin"))`.
- Controller 데코레이터가 아닌 Depends 패턴 사용.

### 4. 감사 필드 자동 기입
- `created_by`, `updated_by`에 `current_user.username` 자동 설정.
- Service에서 현재 사용자 정보를 받아 처리.
