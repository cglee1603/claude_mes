# Garment OEM MES (v3.1)

베트남 의류 OEM 공장의 생산 실행 관리 시스템.
원단 입고부터 출하까지 전 공정을 ERP와 연계하여 실시간 추적·관리.

- **대상**: 제2공장 Phase 1 (20주) → 제3공장 Phase 2 (8주)
- **클라우드**: AWS ap-southeast-1
- **범위**: 33개 화면 · 49개 API · 9개 Service

---

## Tech Stack

| 영역 | 기술 |
|------|------|
| Frontend | React 18 · TanStack Query · i18next (KO/EN/VI) · MSW · Vite · bun · **AG Grid (ag-grid-community)** · **AG Charts (ag-charts-community)** |
| Backend | Node.js 20 LTS · Express · bun |
| Database | PostgreSQL 15 (AWS RDS) · Prisma ORM |
| 검증 | Zod (런타임) · TypeScript strict (컴파일타임) |
| API 명세 | OpenAPI 3.0 spec.yaml (단일 진실 원천) |
| 오프라인 | PWA · IndexedDB · Background Sync |
| CI/CD | GitHub Actions (ci · contract · perf · claude-review) |

---

## Project Structure

```
garment-oem-mes/
├── apps/
│   ├── web/                  # React 18 (Stream A)
│   └── api/                  # Node.js 20 LTS (Stream B)
├── packages/
│   ├── domain/               # 공유 타입·에러코드·도메인 상수
│   ├── openapi/              # spec.yaml (49개 endpoint 정의)
│   └── db/                   # Prisma Schema (Layer A~D)
├── .claude/
│   ├── agents/               # 7개 AI 에이전트
│   ├── rules/                # 13개 레이어별 코딩 규칙
│   └── agent-memory/         # plan.md (프로젝트 계획)
├── notes/                    # ADR-001~013 · handoff · defer
├── scripts/                  # domain-validate.sh
└── CLAUDE.md                 # 프로젝트 두뇌 (13개 섹션)
```

---

## AI Agents (`.claude/agents/`)

Claude Code 에이전트 7개가 역할을 분담하여 개발 전 주기를 자동화한다.

| 에이전트 | 모델 | 역할 |
|---------|------|------|
| **planner** | Opus | PRD·문서 분석 → Milestone/Epic/Task 분해, plan.md 생성, 모호한 요구사항 플래그 |
| **orchestrator** | Sonnet | 전체 에이전트 상태 수집 → 프로젝트 헬스 리포트(Green/Yellow/Red), 블로커 에스컬레이션 |
| **dev-deployer** | Sonnet | 코드 작성·Git 워크플로우(브랜치/커밋/PR)·CI/CD 트리거·롤백 관리 |
| **quality-guard** | Sonnet | 테스트 실행(TC·fast-check·Dredd·k6)·커버리지 ≥80%·배포 전 품질 게이트 |
| **task-tracker** | Sonnet | GitHub Issues 생성/연동·마일스톤 진척률 추적·PR 머지 시 이슈 자동 닫기 |
| **code-reviewer** | Opus | PR 코드 리뷰·보안 취약점 스캔·Forbidden Patterns 검출·심각도 분류(🔴🟡🟢) |
| **notifier** | Haiku | 배포 성공/실패 Slack 알림·일일/주간 리포트 이메일·CRITICAL 이벤트 즉시 에스컬레이션 |

### 에이전트 협업 흐름
```
planner → plan.md 생성
    ↓
orchestrator ← 모든 에이전트 상태 수집 → 헬스 리포트
    ↓
dev-deployer → 코드 작성/배포
    ↓          ↑ 승인
quality-guard → 품질 게이트
    ↓
code-reviewer → PR 리뷰
    ↓
task-tracker → 이슈 닫기
    ↓
notifier → 팀 알림
```

---

## Rules (`.claude/rules/`)

파일 편집 시 `globs` 패턴으로 관련 규칙이 자동 참조된다.

| 규칙 파일 | 적용 대상 | 핵심 내용 |
|---------|---------|---------|
| `model.md` | `packages/db/prisma/schema.prisma` | Layer A~D 분류, Layer C PERMANENT 필수, 트리거 보호 |
| `repository.md` | `apps/api/src/repositories/**` | IRepository 인터페이스+구현체, Prisma 직접 접근 금지(C-3) |
| `service.md` | `apps/api/src/services/**` | Result<T,DomainError> 패턴, MFZ 유일 진입점(C-7), 임금 계산 금지(C-2) |
| `controller.md` | `apps/api/src/routes/**` | Zod 검증 필수(C-4), Dual-Endpoint 패턴, 에러 핸들러 위임 |
| `schema.md` | `packages/domain/src/**` | Zod 스키마, ISA-95 WorkOrder 상속, TypeScript strict |
| `test.md` | `**/*.test.ts` | TC(PostgreSQL Docker), fast-check 6개, Dredd, k6 p95 임계값 |
| `frontend.md` | `apps/web/src/**` | AG Grid 표준, 컬럼/레이아웃 저장, MSW 자동생성(H-1), i18next, PWA |
| `permission.md` | `apps/api/src/middleware/permission*.ts` | 화면 권한 매트릭스, 부서/사용자 계층, DB 동적 관리 |
| `backup.md` | `apps/api/src/jobs/backup*.ts` | RDS 백업 3계층, 무결성 체크 Job, Admin-B 화면 |
| `erp.md` | `apps/api/src/erp/**` | 5종 IF 스테이징, 자재코드 드롭다운만(C-6), 임금 필드 금지 |
| `domain.md` | `packages/domain/src/**` | 도메인 상수 정의, LOT 상태 전이 맵, Forbidden Pattern 검사 |
| `data-lifecycle.md` | `apps/api/src/jobs/archive*` | Layer A/D 아카이브 cron, Layer C 삭제 방지 트리거 SQL |
| `middleware.md` | `apps/api/src/middleware/**` | Zod 미들웨어, JWT RBAC 5개 역할, 에러 핸들러 등록 순서 |
| `exception.md` | `packages/domain/src/errors/**` | DomainErrorCode 목록, HTTP 상태코드 매핑 |
| `migration.md` | `packages/db/prisma/migrations/**` | Prisma migrate 명령, Layer C 트리거 재적용, M6 확정 주의 |

### Forbidden Patterns (자동 차단)

`scripts/domain-validate.sh` — PR마다 실행. **CRITICAL > 0 시 머지 자동 차단.**

| 등급 | 코드 | 금지 내용 |
|------|------|---------|
| 🔴 CRITICAL | C-1 | AQL/DHU 임계값 하드코딩 |
| 🔴 CRITICAL | C-2 | MES 내 임금 계산 로직 |
| 🔴 CRITICAL | C-3 | Service에서 Prisma 직접 접근 |
| 🔴 CRITICAL | C-4 | Zod 없는 외부 입력 파싱 |
| 🔴 CRITICAL | C-5 | Service 순환 의존 |
| 🔴 CRITICAL | C-6 | MES에서 자재 코드 직접 생성 |
| 🔴 CRITICAL | C-7 | MFZ_HOLD를 여러 곳에서 변경 |
| 🔴 CRITICAL | C-8 | ERP 오더 없이 LOT 생성 |
| 🟡 HIGH | H-1~H-5 | MSW 수동 작성·TC 없는 배포·Result 무시 등 |
| 🟢 MEDIUM | M-1~M-5 | Shading 검증 생략·상수 하드코딩 등 |

---

## Claude Commands

```bash
/session-start          # 매일 아침: CLAUDE.md 로드, handoff 확인, validator 스캔
/daily-check            # 매일 저녁: 7개 Harness 종합 리포트
/sync-friday            # 매주 금요일: Stream A/B 합류, MSW 드리프트 확인
/scaffold-service name  # Service 착수: 5개 파일 자동생성
/techdebt               # W8·W12·W16: Forbidden Pattern → §4 업데이트 제안
/add-i18n screen        # W16: 화면 텍스트 추출 → ko/en/vi.json 생성
/plan-mode              # Service 구현 전: 계획 → 승인 → Code Mode
```

---

## Development Plan

전체 계획은 `.claude/agent-memory/plan.md` 참조.

| 단계 | 기간 | 목표 | Gate |
|------|------|------|------|
| D-14 사전구축 | 2주 | Monorepo · CLAUDE.md · Harness 7개 | 완료 스크립트 |
| W1~W4 Inception | 4주 | ERP API 협의 · 현장 인터뷰 · ERD · ADR | Gate 1 (36항목) |
| W5~W8 Foundation | 4주 | spec.yaml · MaterialService · CuttingService | — |
| W9~W12 Core | 4주 | 봉제 팀 실적 · QC 8단계 · k6 게이팅 | Gate 2 (31항목) |
| W13~W16 Advanced | 4주 | MFZ Zero Policy · ERP 5종 · 33개 화면 완성 | Gate 3 (20항목) |
| W17~W20 Launch | 4주 | SIT · UAT · 파일럿 7 KPI · 납품 | Gate 4 (15항목) |
| Phase 2 | 8주 | 제3공장 확산 · 개인 추적 자발적 전환 | — |

---

## Setup

```bash
# 의존성 설치
bun install

# DB 마이그레이션
cd packages/db && bunx prisma migrate dev

# 개발 서버 실행
bun run dev         # api + web 동시 실행

# 테스트
bun run test        # TC + fast-check
bun run test:e2e    # Dredd (spec.yaml 계약 테스트)
bun run perf        # k6 성능 테스트

# Forbidden Pattern 검사
bash scripts/domain-validate.sh
```
