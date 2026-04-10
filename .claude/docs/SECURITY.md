# Security — 보안 체크리스트

## 인증/인가

- [ ] JWT 토큰 만료 시간 적정 설정 (`ACCESS_TOKEN_EXPIRE_MINUTES`)
- [ ] SECRET_KEY는 `.env`에만 존재, 코드에 하드코딩 금지
- [ ] 비밀번호 해싱: `bcrypt` 또는 `argon2` 사용 (평문 저장 금지)
- [ ] 역할 기반 접근 제어 (RBAC): admin, operator, viewer
- [ ] 인증 실패 시 구체적 원인 미노출 ("Invalid credentials"로 통일)

## API 보안

- [ ] CORS 허용 origin 최소화 (와일드카드 `*` 금지, 운영 환경)
- [ ] 요청 body 크기 제한
- [ ] Rate limiting 적용 (로그인, 데이터 생성 등)
- [ ] SQL Injection 방지: ORM 사용, raw SQL 금지 (불가피 시 바인드 파라미터)
- [ ] XSS 방지: 응답 Content-Type 명시, 사용자 입력 이스케이프

## 데이터 보호

- [ ] `.env`, 인증서, 비밀키 → `.gitignore`에 등록
- [ ] 로그에 비밀번호, 토큰, 개인정보 미기록
- [ ] DB 백업 암호화
- [ ] 감사 필드(`created_by`, `updated_by`)로 변경 추적

## 의존성 관리

- [ ] 정기적 `pip audit` 또는 `safety check` 실행
- [ ] 알려진 취약점 있는 패키지 업데이트
- [ ] 의존성 버전 고정 (`pip freeze > requirements.txt` 또는 lock 파일)

## 운영 환경

- [ ] DEBUG=False 확인
- [ ] 에러 상세 메시지 비노출 (500 에러 시 "Internal server error"만)
- [ ] HTTPS 강제 (리버스 프록시 레벨)
- [ ] DB 접속 계정 최소 권한 원칙
