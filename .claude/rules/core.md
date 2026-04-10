---
globs: src/yic_mes/core/**/*.py
description: Core(설정/DB/공통) 파일 작성/수정 시 자동 참조되는 규칙
---

# Core 레이어 규칙

> 적용 대상: `src/yic_mes/core/*.py`

## 요약
프로젝트 전반에서 사용하는 설정, DB 연결, 공통 베이스 클래스, 의존성 주입 헬퍼를 정의한다.

## 파일 구성

### config.py
- `pydantic-settings` 기반 설정 클래스.
- 환경변수 또는 `.env` 파일에서 로드.
- 주요 설정: `DATABASE_URL`, `SECRET_KEY`, `DEBUG`, `CORS_ORIGINS`.

### database.py
- `AsyncEngine`, `async_sessionmaker` 생성.
- `get_session()` — FastAPI 의존성용 async generator.
- 연결 풀 설정: `pool_size=10`, `max_overflow=20`.

### base_model.py
- 모든 ORM 모델이 상속하는 `BaseModel(DeclarativeBase)`.
- 공통 컬럼: `id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `is_deleted`, `deleted_at`.

### base_repository.py
- 제네릭 CRUD 리포지토리 `BaseRepository[T]`.
- `get_by_id`, `get_list`, `count`, `create`, `update`, `soft_delete` 제공.

### dependencies.py
- FastAPI `Depends` 팩토리 함수 모음.
- `get_{domain}_service()` 패턴으로 세션 → 리포 → 서비스 조립.

### exceptions.py
- 커스텀 예외 클래스 정의 (→ `.claude/rules/exception.md` 참고).

## 규칙
- core 모듈은 도메인 로직을 포함하지 않는다.
- 도메인 모듈이 core를 import하되, core가 도메인을 import하지 않는다.
- 설정 변경 시 `config.py`만 수정. 하드코딩 금지.
