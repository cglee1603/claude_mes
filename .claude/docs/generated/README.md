# generated — 에이전트 자동 생성 산출물

> 작성 주체: `quality-guard`, `code-reviewer` 에이전트
> 읽기 주체: `orchestrator`, `notifier` (리포트/알림 생성 시 참조)

---

## 목적

에이전트가 작업 중 자동으로 생성하는 **검증 결과, 리뷰 보고서, 커버리지 스냅샷**을 저장한다.
사람이 직접 작성하지 않는다 — 에이전트 실행 결과물만 저장.

---

## 파일 네이밍 규칙

```
domain-validate-{YYYY-MM-DD}.md        # quality-guard: domain-validate.sh 결과
coverage-{service}-{YYYY-MM-DD}.md     # quality-guard: 서비스별 커버리지 리포트
review-{service}-{YYYY-MM-DD}.md       # code-reviewer: 코드 리뷰 결과
gate-{number}-checklist-{date}.md      # quality-guard: Gate 체크리스트 결과
```

---

## 저장 규칙

- **quality-guard**: `scripts/domain-validate.sh` 실행 후 결과를 `domain-validate-{date}.md`에 저장
- **quality-guard**: Gate 검증 완료 후 `gate-{n}-checklist-{date}.md`에 통과/실패 항목 저장
- **code-reviewer**: 서비스 리뷰 완료 후 `review-{service}-{date}.md`에 BLOCKING/NON-BLOCKING 항목 저장
- 파일이 30일 이상 경과하고 resolved 상태면 삭제 가능

---

## 현재 산출물 목록

| 파일 | 생성 에이전트 | 날짜 | 요약 |
|------|------------|------|------|
| (아직 없음 — 서비스 구현 착수 후 생성) | | | |
