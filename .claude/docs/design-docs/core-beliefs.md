# Core Beliefs — 아키텍처 원칙

## 불변량 (절대 위반 불가)

### 1. 레이어 경계 엄수
- Controller → Service → Repository → Model 방향만 허용.
- Controller에서 Repository 직접 호출 금지.
- Core 모듈은 도메인 모듈을 import 하지 않는다.

### 2. 트랜잭션 관리는 Service에서만
- Repository는 `flush()`만 허용, `commit()` 금지.
- Service 메서드가 트랜잭션의 단위.

### 3. 모든 API 응답은 ApiResponse로 래핑
- `schemas/common.py`의 `ApiResponse[T]` 사용.
- 에러 응답도 동일 형식: `{"success": false, "data": null, "message": "...", "error_code": "..."}`.

### 4. Soft Delete 패턴
- 물리 삭제(DELETE)를 하지 않는다.
- `is_deleted=True`, `deleted_at=now()` 로 논리 삭제.
- 모든 조회 쿼리에 `is_deleted == False` 조건 포함.

### 5. 설정 하드코딩 금지
- DB URL, 시크릿, 외부 서비스 주소 등은 모두 `core/config.py` 경유.
- `.env` 파일 또는 환경변수로 주입.

## 설계 원칙

### Boring Technology 우선
- 검증된 라이브러리 사용 (FastAPI, SQLAlchemy, Pydantic).
- 새 프레임워크/패턴 도입 전 기존 도구로 해결 가능한지 먼저 확인.

### 명시적 > 암묵적
- 관계(relationship)는 양쪽 모두 `back_populates` 명시.
- 상태 전이는 허용 목록(`_ALLOWED_TRANSITIONS`)으로 명시적 관리.
- 타입 힌트 필수 (`Mapped[T]`, 함수 반환 타입).

### 도메인 단위 파일 분리
- 하나의 도메인 = 각 레이어에 하나의 파일.
- 파일명은 도메인명과 동일 (`production_order.py`).
- 한 파일이 300줄을 넘으면 분리를 검토.

## 금지 패턴

| 패턴 | 이유 | 대안 |
|------|------|------|
| Controller에서 `session.execute()` | 레이어 우회 | Service → Repository 경유 |
| 글로벌 세션 객체 | 동시성 문제 | `Depends(get_session)` 사용 |
| `try/except` in Controller | 중복 핸들링 | 전역 exception_handler에 위임 |
| `import *` | 네임스페이스 오염 | 명시적 import |
| ORM 모델을 API 응답으로 직접 반환 | 내부 필드 노출 | Schema(Read DTO)로 변환 |
