# Garment OEM MES — Architecture & File Map (v3.1)

> 기준: etc_doc/garment_mes_dev_plan.html, MES_DevPlan_Part1~3.docx
> 상세 비즈니스 규칙 → CLAUDE.md, 프로젝트 계획 → agent-memory/plan.md

---

## 전체 프로젝트 구조

```
garment-oem-mes/   (프로젝트 루트)
├── CLAUDE.md                        # 프로젝트 두뇌 (13개 섹션, AI 규칙 진입점)
├── README.md                        # 프로젝트 개요·에이전트·규칙 요약
├── .gitignore
├── package.json                     # bun workspaces 루트 정의
│
├── apps/
│   ├── web/                         # Stream A — React 18 프론트엔드
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── common/          # Button, Table, Modal, StatusBadge 등
│   │   │   │   └── layout/          # Header, Sidebar, MainLayout
│   │   │   ├── pages/               # 33개 화면 (WH/RX/SC/SW/QC/FP/AD/Admin)
│   │   │   ├── hooks/               # TanStack Query 커스텀 훅
│   │   │   ├── mocks/               # MSW 핸들러 (spec.yaml 자동생성 — 수동작성 금지)
│   │   │   ├── services/            # API 호출 함수 (fetch 래퍼)
│   │   │   ├── i18n/                # ko.json · en.json · vi.json
│   │   │   ├── sw/                  # PWA Service Worker, IndexedDB 오프라인 큐
│   │   │   └── styles/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api/                         # Stream B — Node.js 20 LTS 백엔드
│       ├── src/
│       │   ├── routes/              # Express 라우터 (49개 엔드포인트)
│       │   ├── services/            # 9개 Service (비즈니스 로직)
│       │   │   ├── material.service.ts
│       │   │   ├── cutting.service.ts
│       │   │   ├── production.service.ts
│       │   │   ├── quality.service.ts
│       │   │   ├── finishing.service.ts
│       │   │   ├── shipment.service.ts
│       │   │   ├── order.repo.ts
│       │   │   ├── optimization.service.ts
│       │   │   └── erp-sync.service.ts
│       │   ├── repositories/        # Prisma 접근 캡슐화 (Interface + 구현체)
│       │   ├── erp/                 # ERP 5종 양방향 연동 (수신·스테이징)
│       │   ├── jobs/                # cron 작업 (자정 집계, 아카이브, ERP 전송)
│       │   ├── middleware/          # Zod 검증, JWT 인증, CORS, 로깅, 에러 핸들러
│       │   └── app.ts               # Express 앱 팩토리
│       └── package.json
│
├── packages/
│   ├── domain/                      # 공유 패키지 — 프론트·백 공통
│   │   ├── src/
│   │   │   ├── constants/index.ts   # 도메인 상수 (FOUR_POINT_THRESHOLD 등 18개)
│   │   │   ├── models/              # ISA-95 WorkOrder 상속 타입, LotStatus 전이 맵
│   │   │   ├── schemas/             # Zod 스키마 (ERP 수신·LOT·QC 등)
│   │   │   └── errors/              # Result<T,E>, DomainError, DomainErrorCode
│   │   └── package.json
│   │
│   ├── openapi/                     # API 명세 (단일 진실 원천)
│   │   ├── spec.yaml                # 49개 엔드포인트 OpenAPI 3.0 정의 (W5 확정)
│   │   └── src/generated/           # TypeScript 타입 자동생성
│   │
│   └── db/                          # 데이터베이스
│       ├── prisma/
│       │   ├── schema.prisma        # Layer A~D 전체 테이블 정의
│       │   ├── migrations/          # Prisma 마이그레이션 + Layer C 트리거 SQL
│       │   └── seed/                # 시드 데이터 (바이어·QC기준·라인·기계)
│       └── package.json
│
├── .claude/
│   ├── ARCHITECTURE.md              # <- 현재 문서
│   ├── agents/                      # 7개 AI 에이전트 정의
│   ├── rules/                       # 13개 레이어별 코딩 규칙 (globs 자동 참조)
│   ├── agent-memory/
│   │   └── plan.md                  # 7개 마일스톤 프로젝트 계획
│   └── docs/
│       ├── design-docs/             # 아키텍처 원칙, 설계 문서
│       ├── QUALITY_SCORE.md
│       ├── SECURITY.md
│       ├── TROUBLESHOOTING.md
│       └── tech-debt-tracker.md
│
├── notes/
│   ├── decisions.md                 # ADR-001~013
│   ├── handoff.md                   # 세션 간 인계 (daily-check 업데이트)
│   └── defer.md                     # Phase 2 이월 7개 항목
│
└── scripts/
    └── domain-validate.sh           # Forbidden Pattern 자동 검사 (PR마다 실행)
```

---

## 레이어 아키텍처 & 의존성 방향

### 백엔드 (apps/api)
```
Route → Service → Repository → Prisma → PostgreSQL
          ↑           ↑
        Domain      Domain
       (타입·Zod)  (타입·Zod)
```

| 레이어 | 역할 | 의존 가능 대상 |
|--------|------|--------------|
| **Route** | HTTP 엔드포인트, Zod 검증, Result→HTTP 변환 | Service, packages/domain |
| **Service** | 비즈니스 로직, 트랜잭션 관리, 상태 전이 | Repository, packages/domain |
| **Repository** | Prisma 접근 캡슐화, 쿼리 | packages/db (Prisma) |
| **packages/domain** | 공유 타입·상수·에러 | 독립 (다른 레이어 import 금지) |

**금지 의존성:**
- Service에서 Prisma 직접 접근 (C-3) → Repository 경유 필수
- Service 순환 의존 (C-5) → MaterialService → CuttingService → ... 단방향만

### 프론트엔드 (apps/web)
```
Page → Hook (TanStack Query) → Service (fetch) → Backend API
  ↓
Component
```

---

## 데이터베이스 레이어 (Layer A~D)

| Layer | 테이블 | 삭제 정책 | 역할 |
|-------|--------|---------|------|
| **A** (ERP Origin) | erp_if_orders · erp_if_styles · erp_if_materials | 오더 완료+180일 ARCHIVED | ERP 수신 데이터 스테이징 |
| **B** (MES 자체) | production_lines · sew_machines · smv_data · skill_matrix | 실적 없는 경우 삭제 가능 | 공장 물리 구조 |
| **C** (MES 영구) | garment_lots · line_outputs · line_daily_summaries · qc_inspections · mfz_records | **DB 트리거 보호 — 절대 삭제 불가** | 법적 증거 기록 |
| **D** (ERP 전송큐) | erp_line_result_queue · erp_shipment_queue | 전송 완료+90일 ARCHIVED | ERP 전송 버퍼 |

---

## Service 의존 구조 (9개)

```
ERPSyncService (ERP 5종 양방향)
      ↓
MaterialService → CuttingService → ProductionService → QualityService → FinishingService → ShipmentService
                                                                              ↑
                                                                     (MFZ_HOLD 유일 진입점 C-7)
OrderRepo ── 모든 Service에서 참조 가능
OptimizationService ── 독립 (라인밸런싱)
```

---

## 새 도메인 추가 절차

`/scaffold-service {name}` 커맨드로 5개 파일 자동생성.

```bash
/scaffold-service equipment
# 생성: interface · impl · repository · route · test
```

수동 추가 시 순서:
1. `packages/domain/src/schemas/{name}.schema.ts` — Zod 스키마
2. `packages/db/prisma/schema.prisma` — Prisma 모델 추가 (Layer 분류 필수)
3. `packages/db/prisma/migrations/` — `bunx prisma migrate dev`
4. `apps/api/src/repositories/{name}.repository.ts` — IRepository + 구현체
5. `apps/api/src/services/{name}.service.ts` — Result<T,DomainError> 패턴
6. `apps/api/src/routes/{name}.route.ts` — Zod 검증 + Dual-Endpoint
7. `apps/web/src/services/{name}.ts` — fetch 함수
8. `apps/web/src/hooks/use{Name}.ts` — TanStack Query 훅
9. `apps/web/src/pages/{Name}Page.tsx` — 화면 (i18next 필수)

---

## Rules 파일 → 적용 대상 매핑

| 규칙 파일 | globs |
|---------|-------|
| `model.md` | `packages/db/prisma/schema.prisma` |
| `repository.md` | `apps/api/src/repositories/**` |
| `service.md` | `apps/api/src/services/**` |
| `controller.md` | `apps/api/src/routes/**` |
| `schema.md` | `packages/domain/src/**` |
| `test.md` | `**/*.test.ts` |
| `frontend.md` | `apps/web/src/**` |
| `erp.md` | `apps/api/src/erp/**`, `apps/api/src/jobs/**` |
| `domain.md` | `packages/domain/src/**` |
| `data-lifecycle.md` | `apps/api/src/jobs/archive*`, `packages/db/prisma/migrations/**` |
| `middleware.md` | `apps/api/src/middleware/**` |
| `exception.md` | `packages/domain/src/errors/**` |
| `migration.md` | `packages/db/prisma/migrations/**` |

---

## 33개 화면 목록

| 그룹 | 화면 ID | 화면명 |
|------|--------|--------|
| 창고 | WH-01~03 | 원단 입고 · 입고 이력 · 창고 현황 |
| 릴렉싱 | RX-04~06 | 릴렉싱 계획 · 소재별 시간 · 완료 알림 |
| 재단 | SC-07~13 | Bundle 생성 · Shading 방지 · LOT 추적 등 |
| 봉제 | SW-14~18 | 투입 계획 · Layout · 기계 상태 · 팀 실적 입력 |
| 품질 | QC-25~32 | Inline/Final/Packing/Shipping QC (8단계) |
| 완성·포장 | FP-19~22 | 태깅 · Polybag · MFZ 검사 · Carton |
| 분석 | AD-23~24 | 공장장 대시보드 · WIP 조회 |
| Admin | Admin 1~6 | 라인 · 기계 · SMV · ERP동기화 · 수명주기 · QC기준 |
