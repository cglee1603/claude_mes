# YIC MES — Architecture & File Map

## 전체 프로젝트 구조

```
claude_mes/   (프로젝트 루트)
├── CLAUDE.md                    # AI 에이전트 작업 목차 (진입점)
├── pyproject.toml               # 패키지 설정, 의존성 목록
├── .env                         # 환경 변수 (git 미추적)
├── .gitignore
│
├── .claude/                     # Claude 참조 문서 전체 (규칙 + 문서)
│   ├── ARCHITECTURE.md          # <- 현재 문서. 구조/파일 역할/의존성
│   ├── rules/                   # 레이어별 자동 참조 규칙
│   │   ├── model.md             # models/ 편집 시 로드
│   │   ├── schema.md            # schemas/ 편집 시 로드
│   │   ├── repository.md        # repositories/ 편집 시 로드
│   │   ├── service.md           # services/ 편집 시 로드
│   │   ├── controller.md        # controllers/ 편집 시 로드
│   │   ├── core.md              # core/ 편집 시 로드
│   │   ├── exception.md         # core/exception* 편집 시 로드
│   │   ├── middleware.md        # core/middleware,auth 편집 시 로드
│   │   ├── migration.md         # alembic/ 편집 시 로드
│   │   └── test.md              # tests/ 편집 시 로드
│   └── docs/                    # 프로젝트 문서
│       ├── design-docs/
│       │   ├── index.md         # 설계 문서 목록
│       │   └── core-beliefs.md  # 아키텍처 원칙, 금지 패턴
│       ├── exec-plans/
│       │   ├── active/          # 현재 진행 중인 작업 계획
│       │   └── completed/       # 완료된 작업 계획
│       ├── generated/           # 자동 생성 문서 (DB 스키마 등)
│       ├── references/          # 외부 참조 자료
│       ├── QUALITY_SCORE.md     # 도메인별 품질 등급
│       ├── TROUBLESHOOTING.md   # 문제 해결 가이드
│       ├── SECURITY.md          # 보안 체크리스트
│       └── tech-debt-tracker.md # 기술 부채 추적
│
├── src/yic_mes/                 # 메인 소스 코드
│   ├── __init__.py              # 패키지 버전 (__version__)
│   ├── __main__.py              # 진입점: uvicorn 서버 시작
│   ├── app.py                   # FastAPI 앱 팩토리 (미들웨어, 핸들러, 라우터 조립)
│   │
│   ├── core/                    # 프로젝트 공통 인프라 (도메인 로직 없음)
│   │   ├── config.py            # pydantic-settings 환경 설정 로드
│   │   ├── database.py          # AsyncEngine, session factory, get_session()
│   │   ├── base_model.py        # ORM 베이스: id, 감사필드, soft delete
│   │   ├── base_repository.py   # 제네릭 CRUD: get/list/count/create/update/soft_delete
│   │   ├── dependencies.py      # FastAPI Depends 팩토리 (session->repo->service 조립)
│   │   ├── exceptions.py        # 커스텀 예외 계층 (AppError -> NotFound/Business/Duplicate/Auth)
│   │   └── exception_handlers.py# 전역 에러 핸들러 (예외->HTTP 상태코드 매핑)
│   │
│   ├── models/                  # SQLAlchemy ORM 모델 (DB 테이블 1:1)
│   │   ├── production_order.py  # 생산 오더 -- MES 핵심. order_no, qty_plan, status
│   │   └── work_order.py        # 작업 지시 -- 생산 오더 하위 작업 단위
│   │
│   ├── schemas/                 # Pydantic v2 DTO (API 요청/응답 데이터)
│   │   ├── common.py            # ApiResponse[T], PaginatedResponse[T] 공통 래퍼
│   │   └── production_order.py  # Create/Update/Read/Filter 4종 DTO
│   │
│   ├── repositories/            # 데이터 접근 계층 (SQL 쿼리 캡슐화)
│   │   └── production_order.py  # BaseRepository 상속 + get_by_order_no, find_by_status
│   │
│   ├── services/                # 비즈니스 로직 (트랜잭션, 상태 전이, 유효성 검증)
│   │   └── production_order.py  # CRUD + start_production, complete_production, 상태 전이 규칙
│   │
│   └── controllers/             # FastAPI 라우터 (HTTP <-> Service 연결)
│       └── production_order.py  # GET/POST/PATCH/DELETE + /start, /complete 액션
│
├── frontend/                    # React + TypeScript 프론트엔드
│   ├── public/                  # 정적 파일 (index.html, favicon 등)
│   ├── src/
│   │   ├── components/          # 재사용 UI 컴포넌트
│   │   │   ├── common/          # Button, Table, Modal, Form 등
│   │   │   └── layout/          # Header, Sidebar, MainLayout
│   │   ├── pages/               # 라우트 단위 페이지 컴포넌트
│   │   ├── hooks/               # 커스텀 React 훅 (useProductionOrders 등)
│   │   ├── services/            # API 호출 함수
│   │   │   ├── api.ts           # fetch 래퍼 (BASE_URL, 에러 처리)
│   │   │   └── productionOrder.ts # 생산 오더 API 함수
│   │   ├── types/               # TypeScript 타입 정의
│   │   │   ├── common.ts        # ApiResponse<T>, PaginatedResponse<T>
│   │   │   └── productionOrder.ts # 백엔드 Schema와 1:1 대응
│   │   ├── utils/               # 유틸리티 (날짜 포맷 등)
│   │   ├── styles/              # 글로벌 스타일, 테마
│   │   └── assets/              # 이미지, 아이콘
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── alembic/                     # DB 마이그레이션
│   ├── env.py
│   └── versions/                # 마이그레이션 리비전 파일
│
└── tests/                       # 테스트
    ├── conftest.py              # SQLite in-memory, session/client 픽스처
    └── test_controllers/
        └── test_production_order.py  # API 통합 테스트 4개
```

---

## 레이어 아키텍처 & 의존성 방향

```
Controller  ->  Service  ->  Repository  ->  Model
    |             |            |
  Schema        Schema      Database
  (요청/응답)   (검증)      (SQLAlchemy)
```

**의존성은 반드시 위->아래 방향만 허용한다.**

| 레이어 | 역할 | import 가능 대상 |
|--------|------|-----------------|
| **Controller** | HTTP 엔드포인트, 요청 라우팅 | Service, Schema |
| **Service** | 비즈니스 로직, 트랜잭션 관리 | Repository, Schema, Model, Exception |
| **Repository** | DB 쿼리 캡슐화, CRUD | Model, Database |
| **Schema** | 데이터 검증/변환 | (독립, 다른 레이어 import 없음) |
| **Model** | DB 테이블 정의 | BaseModel |
| **Core** | 공통 인프라 | (독립, 도메인 레이어 import 금지) |

### 금지되는 의존성
- Controller -> Repository (Service를 건너뜀)
- Repository -> Service (역방향)
- Core -> 도메인 모듈 (역방향)
- Model -> Schema (역방향)

---

## 파일별 상세 역할

### core/config.py
- `pydantic-settings` 기반. `.env` 파일 또는 환경변수에서 설정 로드.
- `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS` 등 관리.
- 다른 모듈에서 `from yic_mes.core.config import settings` 로 사용.

### core/database.py
- `create_async_engine()` -- 비동기 DB 엔진 (connection pool 포함).
- `async_session_factory` -- 세션 팩토리.
- `get_session()` -- FastAPI Depends용 async generator.

### core/base_model.py
- 모든 ORM 모델의 부모 클래스.
- 공통 컬럼: `id`, `created_at`, `updated_at`, `created_by`, `updated_by`, `is_deleted`, `deleted_at`.
- 새 모델은 반드시 이 클래스를 상속해야 한다.

### core/base_repository.py
- `BaseRepository[T]` -- 제네릭 CRUD 메서드 제공.
- `get_by_id`, `get_list`, `count`, `create`, `update`, `soft_delete`.
- 모든 쿼리에 `is_deleted == False` 조건 자동 포함.
- `commit()`하지 않음 -- Service에서 트랜잭션 관리.

### core/dependencies.py
- FastAPI `Depends` 팩토리 함수 모음.
- `get_{domain}_service()`: session -> Repository -> Service 조립 패턴.
- 새 도메인 추가 시 여기에 팩토리 함수 추가.

### core/exceptions.py
- `AppError` 기본 예외 (message, code 속성).
- `NotFoundError(404)`, `BusinessError(422)`, `DuplicateError(409)`, `AuthenticationError(401)`, `AuthorizationError(403)`.

### core/exception_handlers.py
- `AppError` -> HTTP 상태코드 매핑하여 JSON 응답 반환.
- 예상치 못한 `Exception` -> 500 + 로그 기록 (상세 미노출).

### schemas/common.py
- `ApiResponse[T]` -- 모든 API 응답의 공통 래퍼 (`success`, `data`, `message`).
- `PaginatedResponse[T]` -- 목록 응답 (`items`, `total`, `page`, `size`).

### app.py
- `create_app()` 팩토리 -- 미들웨어, 예외 핸들러, 라우터를 조립.
- 새 도메인 라우터는 여기서 `include_router()` 호출.

---

## 새 도메인 추가 절차

예시: `equipment` (설비 관리) 도메인을 추가한다고 가정.

### 1단계: Model
`src/yic_mes/models/equipment.py` 생성
- `BaseModel` 상속, `__tablename__ = "equipments"`
- 컬럼 정의 (`.claude/rules/model.md` 자동 참조)

### 2단계: Schema
`src/yic_mes/schemas/equipment.py` 생성
- `EquipmentCreate`, `EquipmentUpdate`, `EquipmentRead`, `EquipmentFilter`

### 3단계: Repository
`src/yic_mes/repositories/equipment.py` 생성
- `BaseRepository[Equipment]` 상속, 커스텀 쿼리 추가

### 4단계: Service
`src/yic_mes/services/equipment.py` 생성
- `EquipmentService` -- Repository 주입, 비즈니스 로직

### 5단계: Controller
`src/yic_mes/controllers/equipment.py` 생성
- `router = APIRouter(prefix="/equipments")`, REST 엔드포인트

### 6단계: 연결
- `core/dependencies.py`에 `get_equipment_service()` 추가
- `app.py`에 `include_router(equipment_router, prefix="/api/v1")` 추가

### 7단계: Migration
```bash
alembic revision --autogenerate -m "add equipments table"
alembic upgrade head
```

### 8단계: Test
`tests/test_controllers/test_equipment.py` -- API 통합 테스트 작성

### 9단계: Frontend
- `frontend/src/types/equipment.ts` -- 타입 정의 (백엔드 Schema 대응)
- `frontend/src/services/equipment.ts` -- API 호출 함수
- `frontend/src/hooks/useEquipments.ts` -- 데이터 조회/변경 훅
- `frontend/src/pages/EquipmentListPage.tsx` -- 목록 페이지
- `frontend/src/pages/EquipmentDetailPage.tsx` -- 상세/편집 페이지

---

## 프론트엔드 레이어 구조

```
Page (페이지)  ->  Hook (데이터)  ->  Service (API 호출)  ->  Backend API
  |                  |
Component          types/
(UI 렌더링)        (타입 정의)
```

| 레이어 | 역할 | import 가능 대상 |
|--------|------|-----------------|
| **Page** | 라우트 진입점, 레이아웃 조합 | Component, Hook |
| **Component** | UI 렌더링, 사용자 인터랙션 | types, utils |
| **Hook** | 서버 상태 관리, API 연동 | Service, types |
| **Service** | HTTP 요청 캡슐화 | types, api.ts |
| **types** | 타입 정의 | (독립) |
| **utils** | 순수 유틸리티 함수 | (독립) |

### 프론트엔드 파일별 역할

#### services/api.ts
- `apiFetch<T>()` -- 공통 fetch 래퍼. BASE_URL, 헤더, 에러 처리 통합.
- 환경변수 `VITE_API_BASE_URL`에서 API 주소 로드.

#### types/common.ts
- `ApiResponse<T>`, `PaginatedResponse<T>` -- 백엔드 공통 응답과 1:1 대응.

#### types/{domain}.ts
- 백엔드 Schema(Create/Update/Read/Filter)와 동일 구조의 TypeScript 인터페이스.

---

## MES 도메인 맵

| 도메인 | 설명 | 상태 | 주요 관계 |
|--------|------|------|----------|
| `production_order` | 생산 오더 (계획 단위) | 구현됨 | -> work_order (1:N) |
| `work_order` | 작업 지시 (실행 단위) | 모델만 | <- production_order |
| `equipment` | 설비/기계 관리 | 미구현 | -> work_order |
| `material` | 자재/BOM | 미구현 | -> production_order |
| `quality` | 품질 검사/판정 | 미구현 | -> work_order, lot |
| `lot` | LOT 추적/이력 | 미구현 | -> material, work_order |
| `user` | 사용자/인증/권한 | 미구현 | 전체 감사 필드 |
