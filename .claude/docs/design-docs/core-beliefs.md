# Core Beliefs — 아키텍처 원칙

## 불변량 (절대 위반 불가)

### 1. 레이어 경계 엄수
- Controller → Service → Repository → Prisma 방향만 허용.
- Controller에서 Prisma 직접 호출 금지 (C-3).
- `packages/domain`은 `apps/api`를 import하지 않는다.

### 2. 트랜잭션 관리는 Service에서만
- Repository는 단일 Prisma 쿼리만 실행.
- 여러 Repository를 아우르는 트랜잭션은 Service에서 `prisma.$transaction()` 사용.
- Repository에서 `prisma.$transaction()` 호출 금지.

### 3. 모든 API 응답은 ApiResponse로 래핑
- `packages/domain/src/api-response.ts`의 `ApiResponse<T>` 사용.
- 에러 응답도 동일 형식: `{ success: false, data: null, message: "...", errorCode: "..." }`.

### 4. 데이터 생명주기 (Layer A~D) — ADR-012
- **Layer C (MES Permanent)**: DB 트리거로 DELETE 차단. 절대 물리 삭제 불가.
  - 대상: `quality_defect`, `production_actual`, `finishing_inspection`, `shipment_record`, `lot_event_log`
- **Layer A (ERP Origin)**: ERP 동기화 데이터. 보관 기간 후 ARCHIVED 상태로 전환.
- **Layer B (MES Structure)**: LOT, WorkOrder 등 구조 데이터. 물리 삭제 가능(단, 상태 전이 규칙 준수).
- **Layer D (ERP Queue)**: 90일 후 자동 아카이브.
- `is_deleted` soft delete 패턴 사용 금지 — Layer별 정책을 따른다.

### 5. 설정 하드코딩 금지
- DB URL, 시크릿, 외부 서비스 주소 등은 모두 `apps/api/src/config/env.ts` 경유.
- `.env` 파일 또는 환경변수로 주입.

### 6. 임금 계산 절대 금지 — ADR-005
- MES 어디에도 `hourlyRate`, `wage`, `salary` 필드/계산 로직 없음.
- 임금 관련 요청은 ERP로 리다이렉트.

## 설계 원칙

### Boring Technology 우선
- 검증된 라이브러리 사용 (Express, Prisma, Zod, TanStack Query).
- 새 프레임워크/패턴 도입 전 기존 도구로 해결 가능한지 먼저 확인.

### 명시적 > 암묵적
- 상태 전이는 허용 목록(`ALLOWED_TRANSITIONS`)으로 명시적 관리.
- TypeScript strict 모드 필수 — `any` 금지, 반환 타입 명시.
- 모든 Service 메서드는 `Result<T, DomainError>` 반환 (ADR-001).

### 도메인 단위 파일 분리
- 하나의 Service = 하나의 파일.
- 서비스 간 단방향 의존: Material → Cutting → Production → Quality → Finishing → Shipment.
- 파일이 300줄을 넘으면 분리를 검토.

## 금지 패턴

| 패턴 | 이유 | 대안 |
|------|------|------|
| Controller에서 `prisma.*` 직접 호출 | 레이어 우회 (C-3) | Service → Repository 경유 |
| Service에서 다른 Service import | 순환 의존 위험 (C-5) | 공통 로직은 Repository 또는 domain 패키지로 분리 |
| `any` 타입 사용 | 타입 안전성 파괴 | 명시적 타입 또는 `unknown` + 타입 가드 |
| `try/catch` in Controller | 중복 핸들링 | 전역 errorHandler 미들웨어에 위임 |
| Response에 Prisma 모델 직접 반환 | 내부 필드 노출 | DTO(Zod output type)로 변환 후 반환 |
| Layer C 레코드 DELETE | 법적 증거 파괴 | 상태를 VOID/CANCELLED로 변경 |
| AQL/DHU 임계값 숫자 하드코딩 | 변경 시 전수 수정 필요 (C-1) | `packages/domain/src/constants.ts` 상수 사용 |
