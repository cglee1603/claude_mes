# YIC MES

Manufacturing Execution System (MES) — 생산 실행 관리 시스템.

## Tech Stack

| 영역 | 기술 |
|------|------|
| Backend | Python 3.10+ / FastAPI / SQLAlchemy 2.0 (async) / Pydantic v2 |
| Frontend | React + TypeScript / Vite |
| Database | PostgreSQL / Alembic (migration) |

## Project Structure

```
yic_mes/
├── src/yic_mes/           # Backend (Python)
│   ├── app.py             # FastAPI 앱 팩토리
│   ├── core/              # 설정, DB, 공통 베이스
│   ├── models/            # ORM 모델
│   ├── schemas/           # Pydantic DTO
│   ├── repositories/      # 데이터 접근 계층
│   ├── services/          # 비즈니스 로직
│   └── controllers/       # API 라우터
├── frontend/src/          # Frontend (React + TS)
│   ├── components/        # UI 컴포넌트
│   ├── pages/             # 페이지
│   ├── hooks/             # 커스텀 훅
│   ├── services/          # API 호출
│   └── types/             # TypeScript 타입
├── tests/                 # 테스트
├── alembic/               # DB 마이그레이션
└── .claude/               # AI 에이전트 규칙 및 문서
    ├── rules/             # 레이어별 코딩 규칙 (자동 참조)
    └── docs/              # 아키텍처, 트러블슈팅, 보안 등
```

## Setup

### Backend

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -e .
```

### Frontend

```bash
cd frontend
npm install
```

### Database

```bash
# PostgreSQL 실행 후
cp .env.example .env       # DATABASE_URL 등 설정
alembic upgrade head
```

## Run

```bash
# Backend (http://localhost:8000)
python -m yic_mes

# Frontend (http://localhost:5173)
cd frontend && npm run dev
```

## Test

```bash
pytest tests/
```

## API Docs

서버 실행 후 접속:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
