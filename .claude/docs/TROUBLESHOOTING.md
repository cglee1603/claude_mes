# Troubleshooting — 문제 해결 가이드

## DB / SQLAlchemy

### 1. `asyncpg.exceptions.ConnectionDoesNotExistError`
- **원인**: PostgreSQL 미실행 또는 DATABASE_URL 잘못됨.
- **해결**: PostgreSQL 구동 확인. `.env`의 `DATABASE_URL` 검증.
```bash
# 연결 테스트
python -c "import asyncio, asyncpg; asyncio.run(asyncpg.connect('postgresql://...'))"
```

### 2. `sqlalchemy.exc.OperationalError: no such table`
- **원인**: 마이그레이션 미적용.
- **해결**:
```bash
alembic upgrade head
```

### 3. `sqlalchemy.exc.IntegrityError: duplicate key`
- **원인**: unique 제약 위반 (order_no 등).
- **해결**: Service에서 중복 체크 후 `DuplicateError` raise 확인.

### 4. `DetachedInstanceError` (lazy load 실패)
- **원인**: 세션 종료 후 relationship 접근.
- **해결**: Repository 쿼리에 `options(selectinload(...))` 추가.

### 5. Alembic autogenerate가 변경 감지 못함
- **원인**: `env.py`에서 모델 import 누락.
- **해결**: `alembic/env.py`에서 해당 모델 모듈 import 추가.

---

## FastAPI / API

### 6. `422 Unprocessable Entity` (Pydantic 검증 실패)
- **원인**: 요청 body가 Schema 필드와 불일치.
- **해결**: 에러 응답의 `detail` 필드에서 어떤 필드가 문제인지 확인.

### 7. CORS 에러 (브라우저 → API)
- **원인**: `CORS_ORIGINS`에 프론트엔드 주소 미등록.
- **해결**: `.env`에 `CORS_ORIGINS=["http://localhost:3000"]` 추가.

### 8. 새 라우터 등록했는데 404 반환
- **원인**: `app.py`에 `include_router()` 누락.
- **해결**: `app.py`의 `create_app()` 내에 라우터 추가. prefix 확인.

### 9. `Depends(get_session)` 에러
- **원인**: 의존성 주입 체인 끊김.
- **해결**: `core/dependencies.py`에서 session → repo → service 조립 확인.

---

## 테스트

### 10. 테스트에서 `ProgrammingError: table already exists`
- **원인**: `conftest.py`의 teardown이 동작하지 않음.
- **해결**: `setup_db` 픽스처에서 `drop_all` 정상 호출 확인.

### 11. `httpx.AsyncClient`에서 response.json() 실패
- **원인**: 500 에러 시 HTML 에러 페이지 반환.
- **해결**: `app.py`에 전역 예외 핸들러가 등록되었는지 확인.

### 12. 테스트 간 데이터 오염
- **원인**: 세션이 격리되지 않음.
- **해결**: 각 테스트마다 `create_all` / `drop_all` 실행하거나 트랜잭션 롤백.

---

## 프로젝트 구조

### 13. `ImportError: cannot import name '...'`
- **원인**: 순환 참조 또는 `__init__.py` 누락.
- **해결**: 레이어 의존성 방향 확인 (ARCHITECTURE.md 참조). 순환 시 TYPE_CHECKING 블록 활용.

### 14. 새 도메인 추가 후 동작하지 않음
- **체크리스트**:
  1. `models/{domain}.py` — 모델 존재?
  2. `schemas/{domain}.py` — DTO 존재?
  3. `repositories/{domain}.py` — 리포 존재?
  4. `services/{domain}.py` — 서비스 존재?
  5. `controllers/{domain}.py` — 라우터 존재?
  6. `core/dependencies.py` — 팩토리 함수 추가?
  7. `app.py` — `include_router()` 호출?
  8. Alembic 마이그레이션 생성 및 적용?

---

## 성능

### 15. N+1 쿼리 문제
- **증상**: 목록 조회 시 쿼리 수가 데이터 수에 비례해 증가.
- **원인**: lazy loading으로 relationship 접근.
- **해결**: Repository에서 `selectinload()` 또는 `joinedload()` 사용.

### 16. 대량 데이터 조회 시 메모리 폭발
- **원인**: `scalars().all()`로 전체 로드.
- **해결**: 페이지네이션 적용 (`offset/limit`). 필요 시 스트리밍.
