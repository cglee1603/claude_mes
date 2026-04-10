# YIC MES — AI Agent Guide

> 이 파일은 목차(지도)이다. 상세 내용은 링크된 문서를 참조할 것.
> 모든 참조 문서는 `.claude/` 폴더 내부에 존재한다.

## 프로젝트 개요
YIC Manufacturing Execution System. Python + FastAPI, 레이어드 아키텍처.

## 핵심 문서 (먼저 읽을 것)
- [.claude/ARCHITECTURE.md](.claude/ARCHITECTURE.md) — 전체 구조, 파일별 역할, 레이어 의존성 방향
- [.claude/docs/design-docs/core-beliefs.md](.claude/docs/design-docs/core-beliefs.md) — 아키텍처 원칙/금지 패턴
- [.claude/docs/QUALITY_SCORE.md](.claude/docs/QUALITY_SCORE.md) — 도메인별 품질 기준

## 문제 해결
- [.claude/docs/TROUBLESHOOTING.md](.claude/docs/TROUBLESHOOTING.md) — 자주 발생하는 문제와 해결법
- [.claude/docs/SECURITY.md](.claude/docs/SECURITY.md) — 보안 체크리스트
- [.claude/docs/tech-debt-tracker.md](.claude/docs/tech-debt-tracker.md) — 기술 부채 추적

## 기술 스택
- **Backend**: Python 3.10+ / FastAPI / SQLAlchemy 2.0 async / Pydantic v2 / Alembic / PostgreSQL
- **Frontend**: React + TypeScript / Vite

## 레이어 규칙 — 자동 참조
`.claude/rules/` 의 각 파일에 `globs` 설정됨. 해당 경로 파일 편집 시 규칙 자동 로드.

| 대상 경로 | 규칙 | 요약 |
|-----------|------|------|
| `models/**` | `rules/model.md` | ORM 모델 |
| `schemas/**` | `rules/schema.md` | Pydantic DTO |
| `repositories/**` | `rules/repository.md` | 데이터 접근 |
| `services/**` | `rules/service.md` | 비즈니스 로직 |
| `controllers/**` | `rules/controller.md` | API 라우터 |
| `core/**` | `rules/core.md` | 설정/DB/공통 |
| `core/exception*` | `rules/exception.md` | 예외 처리 |
| `core/middleware,auth` | `rules/middleware.md` | 인증/미들웨어 |
| `alembic/**` | `rules/migration.md` | DB 마이그레이션 |
| `tests/**` | `rules/test.md` | 테스트 |
| `frontend/src/**` | `rules/frontend.md` | React 프론트엔드 |

## 코드 작성 흐름
새 도메인 추가: Model → Schema → Repository → Service → Controller 순서.
상세: [.claude/ARCHITECTURE.md](.claude/ARCHITECTURE.md) 의 "새 도메인 추가 절차" 참조.

## 도구
```bash
# Backend
pip install -e .                  # 설치
python -m yic_mes                 # 서버 실행 (uvicorn :8000)
pytest tests/                     # 테스트
alembic upgrade head              # DB 마이그레이션

# Frontend
cd frontend && npm install        # 의존성 설치
cd frontend && npm run dev        # 개발 서버 (Vite)
cd frontend && npm run build      # 프로덕션 빌드
```

## 금지 패턴
- Controller에서 Repository 직접 호출 금지 (반드시 Service 경유)
- Repository에서 commit() 금지 (Service에서 트랜잭션 관리)
- 하드코딩 설정값 금지 (`core/config.py` 사용)
- 상세: [.claude/docs/design-docs/core-beliefs.md](.claude/docs/design-docs/core-beliefs.md)
