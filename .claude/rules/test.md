---
globs: tests/**/*.py
description: 테스트 파일 작성/수정 시 자동 참조되는 규칙
---

# Test 규칙

> 적용 대상: `tests/**/*.py`

## 요약
pytest + httpx(AsyncClient)로 각 레이어를 테스트한다.

## 규칙

### 1. 디렉토리 구조
```
tests/
├── conftest.py            # 공통 픽스처 (DB, 클라이언트, 팩토리)
├── test_models/           # 모델 단위 테스트
├── test_repositories/     # 리포지토리 통합 테스트
├── test_services/         # 서비스 단위 테스트 (리포 모킹)
├── test_controllers/      # API 통합 테스트
└── factories/             # 테스트 데이터 팩토리
```

### 2. 네이밍
- 파일: `test_{도메인}.py`
- 함수: `test_{동작}_{시나리오}` (예: `test_create_production_order_success`)
- 실패 케이스: `test_{동작}_{실패조건}` (예: `test_create_production_order_duplicate`)

### 3. 픽스처
- DB: 테스트용 SQLite async 또는 테스트 PostgreSQL.
- 각 테스트는 트랜잭션 롤백으로 격리.
- `conftest.py`에 `async_session`, `client`, `auth_headers` 픽스처.

### 4. 테스트 범위
- Model: 제약 조건, 기본값 검증.
- Repository: 실제 DB 쿼리 동작 검증.
- Service: 비즈니스 로직 검증, Repository는 mock 허용.
- Controller: HTTP 요청/응답, 상태 코드, 에러 형식 검증.

### 5. Assertion
- 단일 assert 원칙보다 관련 검증을 그룹화하는 것을 허용.
- 응답 검증 시 `success`, `data`, `message` 필드 모두 확인.
