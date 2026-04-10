# Garment OEM MES — AI Agent Guide (v3.1)

> 이 파일은 프로젝트의 두뇌다. 모든 결정의 기준이 되는 13개 섹션.
> 수정은 main 브랜치에서만 가능 (Hook 보호). 모든 줄은 실제 문제 해결 결과다.

## §1 Project Overview

YIC Garment OEM Manufacturing Execution System.
베트남 의류 OEM 공장의 생산 공정을 ERP와 연계하여 원단 입고부터 출하까지 실시간 추적·관리.

- **대상**: 제2공장 Phase 1, 제3공장 Phase 2
- **클라우드**: AWS ap-southeast-1
- **개발 기간**: Phase 1 20주 + Phase 2 8주
- **범위**: 33개 화면, 49개 API 엔드포인트

### 4대 설계 원칙 (모든 결정의 기준)

1. **ERP 유일 마스터 원천** — 오더·스타일·자재 코드는 ERP에서만 생성. MES는 드롭다운 선택만
2. **팀(라인) 단위 실적** — Phase 1은 라인장 중심 팀 실적. 개인 추적은 Phase 2 자발적 전환
3. **MFZ Zero Policy** — 금속 검출 시 즉시 LOT 격리, 출하 자동 차단
4. **데이터 영구성 보장** — Layer C(MES 실행 기록)는 법적 증거로 절대 삭제 불가

---

## §2 Architecture

### Monorepo 구조 (bun workspaces)
```
garment-oem-mes/
├── apps/
│   ├── web/          # React 18 (Stream A)
│   └── api/          # Node.js 20 LTS (Stream B)
├── packages/
│   ├── domain/       # 공유 타입·에러코드·도메인 규칙·상수
│   ├── openapi/      # spec.yaml (단일 진실 원천, 49개 endpoint)
│   └── db/           # Prisma Schema (Layer A~D 전체)
├── .claude/          # Agent·Rules·Memory
├── notes/            # ADR-001~013, handoff, defer
├── scripts/          # domain-validate.sh
└── CLAUDE.md         # 프로젝트 두뇌 (이 파일)
```

### 데이터베이스 레이어 (Layer A~D)
| Layer | 테이블 | 성격 |
|-------|--------|------|
| A (ERP Origin) | ERP_IF_ORDER, ERP_IF_STYLE, ERP_IF_MATERIAL | ERP 수신, 아카이브 가능 |
| B (MES 자체) | PRODUCTION_LINE, SEW_MACHINE, SMV_DATA, SKILL_MATRIX | 공장 구조, 관리자 삭제 가능 |
| C (MES 영구) | GARMENT_LOT, LINE_OUTPUT, LINE_DAILY_SUMMARY, QC_INSPECTION, MFZ_RECORD | **PERMANENT — 삭제 불가** |
| D (ERP 전송큐) | ERP_LINE_RESULT_QUEUE, ERP_SHIPMENT_QUEUE | 전송 후 90일 아카이브 |

### Service 단방향 의존 구조 (순환 금지 — C-5)
```
ERPSyncService
MaterialService → CuttingService → ProductionService → QualityService → FinishingService → ShipmentService
OrderRepo (모든 Service 참조 가능)
OptimizationService (독립)
```

---

## §3 Tech Stack

| 레이어 | 기술 |
|--------|------|
| Frontend | React 18, TanStack React Query, i18next (KO/EN/VI), MSW (자동생성), Vite, bun |
| Backend | Node.js 20 LTS, bun, Express |
| Database | PostgreSQL 15 (AWS RDS ap-southeast-1) |
| ORM | Prisma (타입 안전 스키마) |
| API 검증 | Zod (런타임 안전성, 모든 외부 입력 필수) |
| 에러 처리 | `Result<T, DomainError>` 패턴 (컴파일 타임 강제) |
| API 명세 | OpenAPI 3.0 spec.yaml (SSOT — W5 확정, 수정 시 generate-msw 즉시 재실행) |
| 타입 공유 | TypeScript strict 모드 + ISA-95 WorkOrder 상속 |
| 오프라인 | PWA, IndexedDB 큐잉, Background Sync (OFFLINE_MAX_HOURS=2h) |
| CI/CD | GitHub Actions: ci.yml, contract.yml, perf.yml, claude-review.yml |

---

## §4 Forbidden Patterns

> `bash scripts/domain-validate.sh` — PR마다 자동 실행. CRITICAL > 0 시 머지 자동 차단.

### CRITICAL (C-1~C-8) — 머지 자동 차단

| 코드 | 위반 패턴 | 올바른 방법 |
|------|---------|-----------|
| **C-1** | AQL/DHU 임계값 숫자 하드코딩 | `buyer_qc_config.dhuThreshold` DB 조회 |
| **C-2** | MES 코드 내 임금 계산 로직 | ERP에서 계산 (ADR-005) |
| **C-3** | Service에서 `this.prisma.*` 직접 호출 | Repository 인터페이스 경유 |
| **C-4** | `req.body.*` Zod 없이 직접 사용 | `Schema.safeParse(req.body)` 필수 |
| **C-5** | Service 간 순환 import | 단방향 의존만 허용 (§5 참조) |
| **C-6** | MES Admin에서 자재 코드 직접 생성 | ERP_IF_MATERIAL 드롭다운만 (ADR-011) |
| **C-7** | `FinishingService.recordMFZ()` 외에서 LOT MFZ_HOLD 변경 | 유일 진입점 준수 |
| **C-8** | ERP_IF_ORDER 없이 LOT 생성 | ERP 오더 존재 확인 필수 |

### HIGH (H-1~H-5)

| 코드 | 규칙 |
|------|------|
| **H-1** | MSW 핸들러 수동 작성 금지 — `bun run generate-msw`로만 생성 |
| **H-2** | Testcontainers 없는 Service 배포 금지 |
| **H-3** | `result.ok` 확인 없이 `result.value` 사용 금지 |
| **H-4** | IoT Mock 미설정 개발 금지 (Phase 1은 Mock, Phase 3 실 연동) |
| **H-5** | FTP 없이 DHU만 보고 금지 (두 지표 동시 필수) |

### MEDIUM (M-1~M-5)

| 코드 | 규칙 |
|------|------|
| **M-1** | Bundle 생성 시 Shading 검증 생략 금지 |
| **M-2** | SMV 값 숫자 하드코딩 금지 — `smv_data` 테이블 조회 |
| **M-3** | `28` 숫자 직접 사용 금지 — `FOUR_POINT_THRESHOLD` 상수 사용 |
| **M-4** | 릴렉싱 시간 숫자 하드코딩 금지 — `RELAXATION_HOURS[material]` 사용 |
| **M-5** | 자재 코드 텍스트 입력 필드 허용 금지 — 드롭다운만 |

---

## §5 Service Boundaries

> 9개 Service 책임과 금지 항목. C-5 위반 시 PR 차단.

| Service | 담당 | 허용 의존 | 금지 |
|---------|------|---------|------|
| MaterialService | 원단 입고·4점법·릴렉싱 | OrderRepo, MaterialRepo | CuttingService 직접 호출 |
| CuttingService | Bundle 생성·Shading 방지 | MaterialService, LotRepo | ProductionService, FinishingService 호출 |
| ProductionService | 라인 팀 실적 기록 | LotRepo (worker_id nullable) | 임금 계산, QualityService 직접 호출 |
| QualityService | 8단계 검사 (FTP+DHU) | LotRepo, QCConfigRepo | 결과 무시, FTP 없이 DHU만 |
| FinishingService | 태깅·Polybag·MFZ·Carton | LotRepo, MFZRepo | ShipmentService에서 MFZ_HOLD 직접 변경 |
| ShipmentService | 출하 계획·B/L 생성 | LotRepo | MFZ_HOLD LOT 출하 허용 |
| OrderRepo | ERP 오더 관리 | 모든 Service 참조 가능 | ERP_IF_ORDER 직접 생성 |
| OptimizationService | 라인밸런싱·SMV 배분 | WorkerRepo, SkillMatrixRepo | Phase 1 AI 모델 사용 |
| ERPSyncService | ERP 5종 양방향 연동 | 모든 Layer | ERP 필드 임의 변경 |

---

## §6 API Patterns

### Dual-Endpoint 패턴
- **POST /api/{process}/{action}** — 상태 변경
- **GET /api/{entity}/{id}/{aspect}** — 조회

### 필수 구현 패턴

```typescript
// Route handler: Zod 검증 (C-4) + Result 처리 (H-3)
app.post('/api/warehouse/receive-fabric', async (req, res) => {
  const parsed = ReceiveFabricSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error })

  const result = await service.receiveFabric(parsed.data)
  if (!result.ok) return res.status(422).json({ ok: false, error: result.error })
  res.json({ ok: true, data: result.value })
})
```

### 엔드포인트 분류 (49개)
- 창고 8개: /warehouse/receive-fabric, /inspect-4point, /move-to-relaxation 등
- 재단 10개: /cutting/create-lot, /create-bundle, GET /lots/{lotNo}/trace 등
- 봉제 10개: /production/record-line-output, GET /lines/{id}/efficiency 등
- 품질 12개: /quality/inline-inspect ~ /shipping-inspect, GET /quality/dhu-trend 등
- 완성·출하 7개: /finishing/apply-tag, /record-mfz, /shipment/confirm-shipment 등
- 분석 2개: GET /analytics/factory-kpi, /orders/{id}/status

---

## §7 Testing Rules

| 도구 | 용도 | 차단 조건 | 활성화 |
|------|------|---------|--------|
| Testcontainers | PostgreSQL Docker 통합 테스트 | TC 실패 | D-14~W1 |
| fast-check | 속성 기반 테스트 (1만 케이스) | 반례 발견 | Gate 1 조건 |
| Dredd | OpenAPI 계약 테스트 | failures > 0 | W5 spec.yaml 확정 후 |
| k6 | 성능 회귀 | p95 임계값 초과 | W9 PR 게이팅 활성화 |

### fast-check 6개 필수 속성
1. DHU 계산 정확성 (defectCount/inspectedQty×100)
2. Bundle Shading 유일성 (동일 LOT+색상에 단일 Roll)
3. CP 날짜 유효성 (shipDate ≥ today)
4. Marker 효율 (0~100% 범위)
5. OEE 계산 (Availability × Performance × Quality, 0~100)
6. 릴렉싱 시간 (RELAXATION_HOURS 맵 준수)

### k6 p95 임계값
| 엔드포인트 | 임계값 | 동시 사용자 |
|-----------|--------|-----------|
| POST /cutting/create-bundle | ≤200ms | 30 (라인장) |
| GET /orders/{id}/wip | ≤500ms | 10 (관리자) |
| GET /lots/{lotNo}/trace | ≤800ms | 5 |
| GET /analytics/factory-kpi | ≤800ms | 3 |

---

## §8 Error Handling

```typescript
// Result<T, DomainError> 패턴 — packages/domain/src/errors/에 정의 (ADR-001)
type Result<T, E = DomainError> = { ok: true; value: T } | { ok: false; error: E }

interface DomainError {
  code: DomainErrorCode
  message: string
}

// 에러 코드 목록 (packages/domain/src/errors/codes.ts)
type DomainErrorCode =
  | 'LOT_MFZ_HOLD'        // MFZ 미통과 LOT 출하 시도
  | 'SHADING_RISK'         // 동일 색상 다른 Roll 혼입
  | 'DUPLICATE_ORDER'      // 중복 오더번호
  | 'INVALID_STATUS'       // 허용되지 않는 상태 전이
  | 'ERP_ORDER_REQUIRED'   // ERP 오더 없이 LOT 생성 시도
  | 'NOT_FOUND'            // 리소스 없음
  | 'VALIDATION_ERROR'     // 입력값 검증 실패
```

---

## §9 ERP Integration

> ERP API 합의가 모든 것의 전제조건 (ADR-006). W1 Day1 오후에 협의 착수.

### 5종 IF 스테이징 (idempotent upsert)
| 방향 | 데이터 | Layer | 처리 |
|------|--------|-------|------|
| ERP→MES | 오더·납기·바이어기준 | A | upsert |
| ERP→MES | 스타일·BOM·공정순서 | A | upsert |
| ERP→MES | 자재코드·BOM수량 | A | upsert + 드롭다운 갱신 |
| MES→ERP | 라인별 팀 실적 | D | 매일 자정 SQS → ERP POST |
| MES→ERP | 출하 실적 | D | 출하 완료 즉시 SQS → ERP POST |

### 규칙
- 모든 ERP 수신 데이터: `ERPOrderSchema.safeParse()` 필수 (C-4)
- W3 전 ERP API 미수령: Mock ERP 구축 후 W13 실 연동 (ADR-006)
- ERP 필드 임의 변경 절대 금지 — 오직 수신·스테이징만

---

## §10 Domain Rules

> `packages/domain/src/constants/index.ts`에서만 정의. 하드코딩 절대 금지.

| 상수명 | 값 | 설명 |
|-------|----|------|
| FOUR_POINT_THRESHOLD | 28 pts/100m | 원단 4점법 합격 기준 |
| RELAXATION_HOURS | { COTTON:48, LINEN:48, POLY:24, WOOL:72 } | 소재별 릴렉싱 시간 (h) |
| BUNDLE_QTY_DEFAULT | 100 | 기본 Bundle 수량 |
| BUNDLE_QTY_MIN / MAX | 80 / 150 | Bundle 수량 허용 범위 |
| OFFLINE_MAX_HOURS | 2 | PWA 오프라인 허용 시간 |
| MFZ_MAINTENANCE_CYCLE | monthly | 금속 검출기 교정 주기 |
| SKILL_MATRIX_UPDATE_CYCLE | quarterly | 숙련도 평가 주기 |
| LOT_NO_FORMAT | `{order}-L{serial:03d}` | LOT 번호 형식 |
| ARCHIVE_ORDER_DAYS | 180 | 오더 완료 후 아카이브 기간 |
| ARCHIVE_MATERIAL_DAYS | 90 | 재고 0 후 아카이브 기간 |
| ERP_QUEUE_ARCHIVE_DAYS | 90 | ERP 전송큐 보관 기간 |

---

## §11 Data Lifecycle

> Layer C는 법적 증거. DB 트리거로 삭제 방지. Gate 1·3·4에서 동작 검증 필수.

```sql
-- Layer C 전체 테이블에 적용
CREATE TRIGGER trg_protect_permanent
  BEFORE DELETE ON {table}
  FOR EACH ROW EXECUTE FUNCTION prevent_delete_permanent();
-- data_status = 'PERMANENT' 행 삭제 시도 → RAISE EXCEPTION
```

### 아카이브 정책
- Layer A 오더: 완료 + 180일 → `ifStatus = 'ARCHIVED'` (cron)
- Layer A 자재: 재고 0 + 90일 → `ARCHIVED` (cron)
- Layer D 전송큐: 전송 완료 + 90일 → `ARCHIVED` (cron)
- Layer C: **변경 불가**. PERMANENT는 영원히 PERMANENT.

---

## §12 i18n Rules

- **지원 언어**: KO(한국어), EN(영어), VI(베트남어)
- **도구**: i18next
- **컴포넌트**: `t("key")` 필수. 한글/영어 문자열 하드코딩 금지
- **자동화**: `/add-i18n {screen}` 으로 텍스트 추출 + 3개 JSON 생성
- **베트남어**: 봉제 현장 용어는 현장 담당자 검수 필수
- **번역 키 형식**: `{screen}.{component}.{label}` (예: `warehouse.receive.materialCode`)

---

## §13 Commands

```bash
/session-start          # 매일 아침 필수: CLAUDE.md 로드, handoff.md 확인,
                        # @domain-validator 간이 스캔, 금일 목표 출력

/daily-check            # 매일 저녁 필수: 7개 Harness 종합 리포트,
                        # handoff.md 업데이트

/sync-friday            # 매주 금요일: Stream A/B 합류, MSW 드리프트 확인,
                        # CLAUDE.md Compounding Engineering, 주간 회고

/scaffold-service name  # Service 착수 전: interface·impl·repo·route·test
                        # 5개 파일 자동생성. Result<T,DomainError>·DI 적용

/techdebt               # W8·W12·W16: 구현 중 발견 패턴 → §4 추가 제안

/add-i18n screen        # W16: 화면 텍스트 자동 추출 → ko/en/vi.json 생성

/plan-mode              # Service 구현 전: 계획 제시 → 팀 승인 → Code Mode
```

---

## 부록: ADR 목록

| ADR | 결정 내용 |
|-----|---------|
| ADR-001 | Result<T,DomainError> 패턴 필수 |
| ADR-004 | IoT Phase 1 Mock, Phase 3 실 연동 |
| ADR-005 | 임금 계산 MES 절대 금지 |
| ADR-006 | ERP API W3 전 미수령 시 Mock ERP 구축 |
| ADR-007 | ISA-95 WorkOrder 상속 (TypeScript strict) |
| ADR-011 | 자재 코드 ERP SSOT (MES 생성 금지) |
| ADR-012 | Layer A~D 수명주기 엄격 구분 |
| ADR-013 | Phase 1 팀 실적 기본, Phase 2 자발적 개인 전환 |
