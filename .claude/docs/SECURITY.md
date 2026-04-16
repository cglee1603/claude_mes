# Security — 보안 체크리스트

## 인증/인가

- [ ] JWT 토큰 만료 시간 적정 설정 (`ACCESS_TOKEN_EXPIRE_MINUTES` — env.ts 경유)
- [ ] `JWT_SECRET`은 `.env`에만 존재, 코드 하드코딩 금지 (32자 이상 랜덤값)
- [ ] 비밀번호 해싱: `bcrypt` 또는 `argon2` 사용 (평문 저장 금지)
- [ ] RBAC 5개 역할 구현: `admin`, `factory_manager`, `line_manager`, `qc_inspector`, `warehouse` (permission.md §5 기준)
- [ ] 인증 실패 시 구체적 원인 미노출 ("Invalid credentials"로 통일)
- [ ] Dual-Endpoint 패턴: `/api/v1/...` (일반) + `/api/v1/display/...` (대형화면 읽기전용)

## API 보안

- [ ] CORS 허용 origin 최소화 (와일드카드 `*` 금지, 운영 환경)
- [ ] 요청 body 크기 제한 (`express.json({ limit: '1mb' })`)
- [ ] Rate limiting 적용 (로그인, 데이터 생성 등) — `express-rate-limit`
- [ ] SQL Injection 방지: Prisma ORM 사용, raw SQL 금지 (불가피 시 `prisma.$queryRaw` + 파라미터 바인딩)
- [ ] Zod 스키마 검증 필수 — 모든 입력은 Controller에서 파싱 후 Service 전달 (C-4)
- [ ] XSS 방지: `helmet` 미들웨어 적용, Content-Type 명시

## 데이터 보호

- [ ] `.env`, 인증서, 비밀키 → `.gitignore`에 등록 (현재 적용됨)
- [ ] 로그에 비밀번호, 토큰, `worker_id` 개인식별 정보 미기록 (ADR-013)
- [ ] DB 백업 암호화
- [ ] 감사 필드(`created_by`, `updated_by`)로 변경 추적
- [ ] Layer C 테이블 물리 삭제 불가 — DB 트리거로 강제 (ADR-012)

## 의존성 관리

- [ ] 정기적 `bun audit` 실행 (CI 파이프라인에 포함)
- [ ] CRITICAL 취약점 0건 유지 (Gate 4 조건)
- [ ] 알려진 취약점 있는 패키지 업데이트
- [ ] 의존성 버전 고정 (`bun.lock` 커밋)

## 운영 환경

- [ ] `NODE_ENV=production` 확인
- [ ] 에러 상세 메시지 비노출 (500 에러 시 "Internal server error"만 — `errorHandler` 미들웨어)
- [ ] HTTPS 강제 (리버스 프록시 레벨)
- [ ] DB 접속 계정 최소 권한 원칙

## MES 특화 보안

- [ ] 임금 계산 필드 접근 차단 (ADR-005) — `hourlyRate`, `wage`, `salary` ERP 전달 금지
- [ ] 자재 코드 직접 생성 API 미노출 (ADR-011) — ERP IF를 통해서만 생성
- [ ] 개인 생산성 데이터 Phase 1에서 수집 금지 (ADR-013) — `worker_id` nullable 유지
- [ ] MFZ_HOLD 상태 변경은 FinishingService 단일 진입점만 허용 (C-7)
