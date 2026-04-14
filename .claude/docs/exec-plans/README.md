# exec-plans — 실행 계획 저장소

> 작성 주체: `planner` 에이전트 (`/plan-mode` 실행 시)
> 읽기 주체: `orchestrator`, `dev-deployer`, `code-reviewer`, `quality-guard` (작업 착수 전 해당 서비스 계획서 확인)

---

## 목적

`/plan-mode`로 서비스 구현을 시작하기 전, orchestrator가 팀과 합의한 **구체적 실행 계획**을 저장한다.
계획서는 작업 중 변경 사항을 추적하는 살아있는 문서다.

---

## 파일 네이밍 규칙

```
{service-name}-plan.md
예) material-service-plan.md
    cutting-service-plan.md
    erp-sync-plan.md
```

---

## 계획서 표준 포맷

```markdown
# {ServiceName} 구현 계획

> 작성일: YYYY-MM-DD
> 담당: dev-deployer
> 상태: DRAFT | APPROVED | IN_PROGRESS | DONE

## 범위
- 구현할 기능 목록

## 파일 목록
| 파일 | 역할 | 상태 |
|------|------|------|
| apps/api/src/repositories/xxx.repository.ts | Repository | TODO |
| apps/api/src/services/xxx.service.ts | Service | TODO |
| apps/api/src/routes/xxx.ts | Route | TODO |
| packages/db/prisma/schema.prisma | Schema 수정 | TODO |

## 의존 서비스
- 상위: (없음 또는 서비스명)
- 하위: (없음 또는 서비스명)

## 금지 패턴 체크 (CLAUDE.md §4)
- [ ] C-1: AQL/DHU 하드코딩 없음
- [ ] C-3: Service에서 prisma 직접 호출 없음
- [ ] C-4: 모든 입력 Zod 검증
- [ ] C-5: 순환 의존 없음

## 완료 기준
- [ ] domain-validate.sh CRITICAL=0
- [ ] Testcontainers 테스트 통과
- [ ] QUALITY_SCORE.md 등급 B 이상
```

---

## 현재 계획서 목록

| 파일 | 서비스 | 상태 | 작성일 |
|------|--------|------|--------|
| (아직 없음 — W5 착수 시 생성 예정) | | | |
