# Troubleshooting — 문제 해결 가이드

## DB / Prisma

### 1. `PrismaClientInitializationError: Can't reach database server`
- **원인**: PostgreSQL 미실행 또는 DATABASE_URL 잘못됨.
- **해결**: PostgreSQL 구동 확인. `.env`의 `DATABASE_URL` 검증.
```bash
# 연결 테스트
bunx prisma db pull
```

### 2. `Table does not exist` 또는 마이그레이션 미적용
- **원인**: `prisma migrate deploy` 미실행.
- **해결**:
```bash
bunx prisma migrate deploy        # 운영/스테이징
bunx prisma migrate dev           # 개발 환경
```

### 3. `UniqueConstraintViolationError` (P2002)
- **원인**: unique 제약 위반 (lot_no, order_no 등).
- **해결**: Service에서 중복 체크 후 `DomainError('DUPLICATE_LOT_NO')` 반환 확인.

### 4. Layer C 테이블 DELETE 시도 시 트리거 오류
- **원인**: `quality_defect` 등 5개 테이블에 BEFORE DELETE 트리거가 설정됨 (ADR-012).
- **해결**: 물리 삭제 대신 상태를 `VOID` 또는 `CANCELLED`로 업데이트. 트리거 제거 금지.

### 5. Prisma 스키마 변경 후 타입 에러
- **원인**: `bunx prisma generate` 미실행.
- **해결**:
```bash
bunx prisma generate
```

---

## Express / API

### 6. `400 Bad Request` (Zod 검증 실패)
- **원인**: 요청 body가 Zod 스키마와 불일치.
- **해결**: 응답의 `errors` 배열에서 어떤 필드가 문제인지 확인. 스키마 파일 `packages/openapi/src/schemas/` 점검.

### 7. CORS 에러 (브라우저 → API)
- **원인**: `CORS_ORIGINS`에 프론트엔드 주소 미등록.
- **해결**: `.env`에 `CORS_ORIGINS=http://localhost:5173` 추가.

### 8. 새 라우터 등록했는데 404 반환
- **원인**: `apps/api/src/app.ts`에 `router` 등록 누락.
- **해결**: `app.use('/api/v1/...', router)` 추가. prefix 확인.

### 9. JWT 인증 401 반환
- **원인**: 토큰 만료 또는 `JWT_SECRET` 불일치.
- **해결**: `.env`의 `JWT_SECRET` 확인. 토큰 재발급. RBAC 역할 매핑 점검 (`middleware/auth.ts`).
- RBAC 역할명: `admin`, `factory_manager`, `line_manager`, `qc_inspector`, `warehouse` (구버전 ADMIN/MANAGER 금지)

### 20. AG Grid 컬럼 레이아웃이 저장되지 않음
- **원인**: `layoutKey`가 화면 코드 형식 (`{screenCode}-grid`)이 아닌 경우, 또는 `/api/user/layout` API 미등록.
- **해결**: MesGrid 컴포넌트의 `gridKey` prop이 `WH-01-grid` 형식인지 확인. `useGridLayout` 훅의 API 엔드포인트 확인.

### 21. AG Grid 라이선스 오류 (`AG Grid Enterprise license key not found`)
- **원인**: `ag-grid-enterprise` 사용 시 라이선스 키 미설정.
- **해결**: Community 패키지 (`ag-grid-community`, `ag-charts-community`)만 사용하거나, 라이선스 키를 `LicenseManager.setLicenseKey(key)` 로 설정. Gantt 차트는 `ag-charts-enterprise` 라이선스 필요.

### 22. AG Charts Gantt 차트 미표시
- **원인**: `ag-charts-enterprise` 패키지 미설치 또는 라이선스 미설정.
- **해결**: Phase 2에서 처리 예정. Phase 1은 `ag-charts-community` 기본 차트만 사용.

### 23. 권한 거부 (403 FORBIDDEN)
- **원인**: `screen_permissions` 테이블에 해당 screenCode+action 미등록, 또는 사용자 역할에 권한 미부여.
- **해결**: Admin-P 화면에서 해당 화면의 역할 권한 확인. DB에서 `screen_permissions` → `role_permissions` 조회.

### 24. DB 백업 Job 실패 (`pg_dump: error`)
- **원인**: `DATABASE_URL` 미설정 또는 pg_dump 미설치.
- **해결**: `BACKUP_S3_BUCKET`, `RDS_INSTANCE_ID` 환경변수 확인. ECS Task에 `postgresql-client` 패키지 포함 여부 확인.

---

## 테스트

### 10. Testcontainers 시작 실패
- **원인**: Docker 미실행 또는 포트 충돌.
- **해결**: Docker Desktop 구동 확인. 다른 PostgreSQL 컨테이너가 5432 점유 중인지 확인.
```bash
docker ps | grep postgres
```

### 11. 테스트 간 데이터 오염
- **원인**: 테스트 종료 후 DB 초기화 미실행.
- **해결**: `afterEach`에서 `prisma.$transaction([prisma.table.deleteMany()])` 또는 컨테이너 재시작.

### 12. fast-check property 테스트 실패 (shrinking 중)
- **원인**: 엣지 케이스 입력에서 불변량 위반.
- **해결**: fast-check가 출력하는 최소 재현 케이스로 재현 후 도메인 로직 수정.
```ts
// 재현: seed 값으로 동일 케이스 재실행
fc.assert(fc.property(...), { seed: <출력된 seed 값> });
```

### 13. Dredd API 계약 테스트 실패
- **원인**: OpenAPI 스펙과 실제 응답 불일치.
- **해결**: `packages/openapi/src/openapi.yaml` 업데이트 또는 Controller 응답 형식 수정.

---

## 프로젝트 구조

### 14. `Cannot find module '@mes/domain'`
- **원인**: bun workspaces 링크 미설정 또는 `packages/domain/src/index.ts` export 누락.
- **해결**:
```bash
bun install          # workspaces 재링크
# packages/domain/src/index.ts에 해당 타입/상수 export 추가
```

### 15. 새 Service 추가 후 동작하지 않음
- **체크리스트**:
  1. `apps/api/src/services/{domain}.service.ts` — Service 파일 존재?
  2. `apps/api/src/repositories/{domain}.repository.ts` — Repository 존재?
  3. `apps/api/src/controllers/{domain}.controller.ts` — Controller 존재?
  4. `packages/openapi/src/schemas/{domain}.ts` — Zod 스키마 존재?
  5. `apps/api/src/app.ts` — 라우터 등록?
  6. `packages/db/prisma/schema.prisma` — 모델 정의?
  7. `bunx prisma migrate dev` — 마이그레이션 적용?
  8. `bunx prisma generate` — 타입 재생성?

---

## 성능

### 16. N+1 쿼리 문제
- **증상**: 목록 조회 시 쿼리 수가 데이터 수에 비례해 증가.
- **원인**: Prisma relation 미리 로드 누락.
- **해결**: Repository에서 `include` 또는 `select`로 필요한 관계만 명시적 로드.

### 17. k6 p95 응답시간 초과 (임계값: 500ms)
- **증상**: `p(95)<500` 조건 실패.
- **해결**: slow query 로그 확인 (`prisma.$on('query', ...)`). 누락 인덱스 추가. 페이지네이션 적용.

---

## ERP 연동

### 18. ERP IF 스테이징 데이터 미처리
- **원인**: `erp_sync` 워커 미실행 또는 크론 오류.
- **해결**: `apps/api/src/workers/erp-sync.ts` 수동 실행 또는 로그 확인.
  - `ERP_IF_MATERIAL` → MaterialService.syncFromERP()
  - `ERP_IF_ORDER` → OrderService.syncFromERP()

### 19. 자재 코드 드롭다운이 비어있음
- **원인**: `ERP_IF_MATERIAL` 미동기화.
- **해결**: ERP 동기화 워커 실행. 자재 코드는 MES에서 직접 생성 불가 (ADR-011).
