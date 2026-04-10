---
globs: src/yic_mes/core/exception*.py
description: 예외/에러 처리 파일 작성/수정 시 자동 참조되는 규칙
---

# Exception/Error 처리 규칙

> 적용 대상: `src/yic_mes/core/exceptions.py`, `src/yic_mes/core/exception_handlers.py`

## 요약
커스텀 예외 클래스를 정의하고, FastAPI 전역 핸들러로 일관된 에러 응답을 반환한다.

## 예외 클래스 계층

```
AppError (base)
├── NotFoundError          # 404 — 리소스 없음
├── BusinessError          # 422 — 비즈니스 규칙 위반
├── DuplicateError         # 409 — 중복 데이터
├── AuthenticationError    # 401 — 인증 실패
├── AuthorizationError     # 403 — 권한 없음
└── ValidationError        # 400 — 입력값 검증 실패
```

## 규칙

### 1. 예외 정의
```python
class AppError(Exception):
    def __init__(self, message: str, code: str = "APP_ERROR"):
        self.message = message
        self.code = code

class NotFoundError(AppError):
    def __init__(self, resource: str, resource_id: int | str):
        super().__init__(f"{resource} #{resource_id} not found", "NOT_FOUND")
```

### 2. 에러 응답 형식
```json
{
  "success": false,
  "data": null,
  "message": "ProductionOrder #123 not found",
  "error_code": "NOT_FOUND"
}
```

### 3. 전역 핸들러 등록
- `exception_handlers.py`에서 `AppError` 서브클래스 → HTTP 상태코드 매핑.
- FastAPI `app.add_exception_handler()`로 등록.
- 예상치 못한 예외: 500 반환 + 로그 기록 (사용자에게 상세 노출 금지).

### 4. 사용 원칙
- Service에서 비즈니스 예외를 raise.
- Controller에서 try/except 하지 않음 (전역 핸들러에 위임).
- Repository는 예외를 raise하지 않음 (None 반환 → Service에서 판단).
