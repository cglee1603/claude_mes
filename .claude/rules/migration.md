---
globs: alembic/**/*.py,alembic.ini
description: Alembic 마이그레이션 파일 작성/수정 시 자동 참조되는 규칙
---

# Migration 규칙

> 적용 대상: `alembic/versions/*.py`, `alembic.ini`, `alembic/env.py`

## 요약
Alembic으로 DB 스키마 변경을 관리한다. 모델 변경 후 반드시 마이그레이션을 생성한다.

## 규칙

### 1. 마이그레이션 생성
```bash
alembic revision --autogenerate -m "설명"
```
- 메시지는 영문, 간결하게: `add production_orders table`, `add status column to work_orders`.

### 2. 파일 검증
- 자동 생성 후 반드시 `upgrade()`와 `downgrade()` 내용을 리뷰한다.
- autogenerate가 놓치는 것: 인덱스 이름 변경, 데이터 마이그레이션, Enum 타입 변경.

### 3. 데이터 마이그레이션
- 스키마 변경과 데이터 변경을 별도 리비전으로 분리.
- 대량 데이터 업데이트는 배치 처리.

### 4. 네이밍
- revision ID: Alembic 자동 생성 사용.
- 테이블/컬럼명은 모델의 `__tablename__`, `mapped_column` 이름과 일치해야 함.

### 5. 롤백 안전성
- 모든 `upgrade()`에 대응하는 `downgrade()`가 있어야 한다.
- 컬럼 삭제 시 downgrade에서 복원 가능하도록 타입 정보 명시.
