# Tech Debt Tracker — 기술 부채 추적

## 사용법
- 기술 부채 발견 시 아래 테이블에 추가.
- 해결 시 상태를 `resolved`로 변경하고 날짜 기록.
- 월 1회 점검: 미해결 항목 우선순위 재평가.

## 현재 목록

| ID | 항목 | 영역 | 우선순위 | 상태 | 등록일 | 해결일 |
|----|------|------|---------|------|--------|--------|
| TD-001 | 9개 서비스 전 레이어 미구현 | 도메인 | 높음 | open | 2026-04-10 | |
| TD-002 | packages/domain 상수·타입 미구현 | 도메인 | 높음 | open | 2026-04-10 | |
| TD-003 | JWT 인증 미구현 (middleware/auth.ts) | 인증 | 높음 | open | 2026-04-10 | |
| TD-004 | Prisma 초기 마이그레이션 미생성 | 마이그레이션 | 높음 | open | 2026-04-10 | |
| TD-005 | CI/CD 워크플로우 4개 미작성 | 인프라 | 중간 | open | 2026-04-10 | |
| TD-006 | ESLint + Prettier 규칙 미설정 | 품질 | 낮음 | open | 2026-04-10 | |
| TD-007 | Layer C 테이블 트리거 마이그레이션 미생성 | 데이터 보호 | 높음 | open | 2026-04-10 | |
| TD-008 | tsconfig.json 패키지별 미작성 | 빌드 | 중간 | open | 2026-04-10 | |
| TD-009 | openapi.yaml 초기 스펙 미생성 | API 문서 | 중간 | open | 2026-04-10 | |
| TD-010 | AG Grid 패키지 미설치 (ag-grid-community, ag-charts-community) | 프론트엔드 | 높음 | open | 2026-04-16 | |
| TD-011 | 권한 관리 시스템 미구현 (PermissionService, screen_permissions) | 인증/인가 | 높음 | open | 2026-04-16 | |
| TD-012 | DB 백업 Job 미구현 (rds-snapshot, logical-backup, integrity-check) | 인프라 | 높음 | open | 2026-04-16 | |
| TD-013 | 사용자 레이아웃 저장 API 미구현 (user_layout_preferences) | 프론트엔드 | 중간 | open | 2026-04-16 | |
| TD-014 | 대시보드·마이페이지 화면 미구현 | 프론트엔드 | 중간 | open | 2026-04-16 | |
| TD-015 | packages/db/prisma/schema.prisma 파일 없음 (디렉토리만 존재) | 데이터 보호 | 높음 | open | 2026-04-16 | |
| TD-016 | packages/domain/src 하위 디렉토리 존재하나 소스 파일 없음 | 도메인 | 높음 | open | 2026-04-16 | |

## 우선순위 기준
- **높음**: 기능 누락 또는 보안 위험. 다음 스프린트에 반드시 해결.
- **중간**: 없어도 동작하지만 확장성/유지보수에 영향. 2주 내 해결 권장.
- **낮음**: 개선 사항. 여유 있을 때 처리.
