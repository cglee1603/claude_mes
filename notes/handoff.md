# Session Handoff

> /daily-check 실행 시 업데이트. 다음 세션 시작 시 /session-start로 확인.

## 최근 상태

- **날짜**: 2026-04-16
- **단계**: D-14 사전구축 진행 중
- **브랜치**: mockup

## 완료 항목

- [x] Monorepo 디렉토리 구조 생성
- [x] CLAUDE.md 13개 섹션 작성
- [x] rules/ 15개 파일 작성 (permission.md, backup.md 추가)
- [x] agent-memory/plan.md 7개 마일스톤 작성
- [x] notes/decisions.md ADR-001~013
- [x] scripts/domain-validate.sh 기본 골격
- [x] package.json workspaces 정의
- [x] AG Grid 표준 채택 결정 (ag-grid-community + ag-charts-community)
- [x] 권한 관리 시스템 설계 (User→Department→Role→ScreenPermission 계층)
- [x] DB 백업 3계층 전략 설계 (RDS PITR + 스냅샷 + pg_dump→S3)
- [x] 대시보드·마이페이지 기능 설계 (위젯 기반 레이아웃 저장)
- [x] 전체 .md 파일 현행화 완료

## 다음 작업

- [ ] apps/web/package.json에 ag-grid-community, ag-grid-react, ag-charts-community, ag-charts-react 패키지 추가
- [ ] tsconfig.json 각 패키지별 작성
- [ ] packages/db/prisma/schema.prisma 파일 생성 (TD-015)
- [ ] packages/domain/src 하위 소스 파일 구현 (TD-016)
- [ ] CI/CD 워크플로우 4개 작성
- [ ] W1 착수 전 ERP 담당자 협의 일정 확인

## 주요 결정사항 (2026-04-16)

- **그리드**: AG Grid (ag-grid-community) 표준 채택. 모든 시트형 화면 적용
- **차트**: ag-charts-community (무료) — KPI, 추세, 분석 차트. ag-charts-enterprise(유료)는 Gantt 차트용으로 Phase 2 검토
- **Gantt**: ag-charts-enterprise에 내장. Phase 2 착수 시 라이선스 구매 여부 결정 필요
- **대시보드 위젯 배치**: react-grid-layout 또는 AG Grid 커스텀 렌더링 (Phase 2 구체화)
- **권한**: DB 동적 관리. 역할/부서/사용자 3계층. 기준은 차후 확정
- **백업**: RDS PITR 30일 + 주간 스냅샷 + 월간 pg_dump→S3

## 블로커

- 없음
