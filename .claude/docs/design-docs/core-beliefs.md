# Core Beliefs — 아키텍처 원칙

> 기준: CLAUDE.md v3.1 (2026-04-14)
> 변경 시 CLAUDE.md와 반드시 동기화할 것.

---

## 불변량 (절대 위반 불가)

### 1. 레이어 경계 엄수 (C-3, C-5)
- Route → Service → Repository → Prisma 방향만 허용.
- Service에서 `this.prisma.*` 직접 호출 금지 (C-3) — 반드시 Repository 경유.
- `packages/domain`은 `apps/api`를 import하지 않는다 (단방향).
- Service 간 순환 import 금지 (C-5).

### 2. 트랜잭션 관리는 Service에서만
- Repository는 단일 Prisma 쿼리만 실행.
- 여러 Repository를 아우르는 트랜잭션은 Service에서 `prisma.$transaction()` 사용.
- Repository에서 `prisma.$transaction()` 호출 금지.

### 3. 모든 API 응답 형식 (CLAUDE.md §6)
```typescript
// 성공
{ ok: true, data: T }

// 도메인 에러 (422)
{ ok: false, error: { code: DomainErrorCode, message: string } }

// 검증 에러 (400)
{ ok: false, error: ZodError.flatten() }
```
- `packages/domain/src/errors/index.ts`의 `Result<T, DomainError>` 사용 (ADR-001).
- `req.body.*` Zod 없이 직접 사용 금지 (C-4).

### 4. 데이터 생명주기 (Layer A~D) — ADR-012
| Layer | 테이블 | 삭제 정책 |
|-------|--------|---------|
| A (ERP Origin) | ERP_IF_ORDER, ERP_IF_STYLE, ERP_IF_MATERIAL | 완료+기간 후 ARCHIVED |
| B (MES 자체) | PRODUCTION_LINE, SEW_MACHINE, SMV_DATA, SKILL_MATRIX | 실적 없는 경우만 삭제 가능 |
| C (MES 영구) | **garment_lots, line_outputs, line_daily_summaries, qc_inspections, mfz_records** | **DB 트리거로 DELETE 영구 차단** |
| D (ERP 전송큐) | ERP_LINE_RESULT_QUEUE, ERP_SHIPMENT_QUEUE | 전송 후 90일 ARCHIVED |

- Layer C는 법적 증거 — `data_status = 'PERMANENT'` 행 삭제 시 DB 예외 발생.
- `is_deleted` soft delete 패턴 사용 금지 — Layer별 정책을 따른다.

### 5. 설정 하드코딩 금지
- DB URL, 시크릿, 외부 서비스 주소 → `apps/api/src/config/env.ts` 경유.
- 도메인 상수(DHU, AQL, 릴렉싱 시간 등) → `packages/domain/src/constants/index.ts` 경유 (C-1, M-2~M-4).

### 6. 임금 계산 절대 금지 — ADR-005 (C-2)
- MES 어디에도 `hourlyRate`, `wage`, `salary` 필드/계산 로직 없음.
- ERP 전송 payload에도 임금 관련 필드 포함 금지.

### 7. ERP 유일 마스터 원천
- 오더·스타일·자재 코드는 ERP에서만 생성 (C-6, C-8, ADR-011).
- MES Admin에서 자재 코드 직접 생성 금지 — ERP_IF_MATERIAL 드롭다운만.

### 8. MFZ Zero Policy (C-7)
- `FinishingService.recordMFZ()` 만이 LOT의 `MFZ_HOLD` 상태 설정 가능.
- 다른 Service에서 MFZ_HOLD 직접 변경 절대 금지.

---

## Service 단방향 의존 구조

```
ERPSyncService
MaterialService → CuttingService → ProductionService → QualityService → FinishingService → ShipmentService
OrderRepo (모든 Service 참조 가능)
OptimizationService (독립)
```

---

## 설계 원칙

### Boring Technology 우선
- 검증된 라이브러리 사용 (Express, Prisma, Zod, TanStack Query, i18next).
- 새 프레임워크/패턴 도입 전 기존 도구로 해결 가능한지 먼저 확인.

### 명시적 > 암묵적
- LOT 상태 전이는 `LOT_STATUS_TRANSITIONS` 맵으로 명시적 관리 (`packages/domain/src/models/lot.model.ts`).
- TypeScript strict 모드 필수 — `any` 금지, 반환 타입 명시.
- 모든 Service 메서드는 `Result<T, DomainError>` 반환 (ADR-001).

### 도메인 단위 파일 분리
- 하나의 Service = 하나의 파일.
- 파일이 300줄을 넘으면 분리를 검토.

---

## 금지 패턴 요약 (CLAUDE.md §4 전체 목록)

### CRITICAL (CI 자동 차단)
| 코드 | 패턴 | 대안 |
|------|------|------|
| C-1 | AQL/DHU 임계값 숫자 하드코딩 | `buyer_qc_config.dhuThreshold` DB 조회 |
| C-2 | MES 코드 내 임금 계산 로직 | ERP에서 계산 |
| C-3 | Service에서 `this.prisma.*` 직접 호출 | Repository 인터페이스 경유 |
| C-4 | `req.body.*` Zod 없이 직접 사용 | `Schema.safeParse(req.body)` 필수 |
| C-5 | Service 간 순환 import | 단방향 의존만 허용 |
| C-6 | MES Admin에서 자재 코드 직접 생성 | ERP_IF_MATERIAL 드롭다운만 |
| C-7 | `FinishingService.recordMFZ()` 외에서 LOT MFZ_HOLD 변경 | 유일 진입점 준수 |
| C-8 | ERP_IF_ORDER 없이 LOT 생성 | ERP 오더 존재 확인 필수 |

### HIGH
| 코드 | 규칙 |
|------|------|
| H-1 | MSW 핸들러 수동 작성 금지 — `bun run generate-msw`로만 생성 |
| H-2 | Testcontainers 없는 Service 배포 금지 |
| H-3 | `result.ok` 확인 없이 `result.value` 사용 금지 |
| H-4 | IoT Mock 미설정 개발 금지 |
| H-5 | FTP 없이 DHU만 보고 금지 (두 지표 동시 필수) |
