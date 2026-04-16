# references — 외부 참조 자료

> 작성 주체: PM/리드 (수동), ERP 담당자 제공 자료
> 읽기 주체: `code-reviewer`, `task-tracker`, `orchestrator`

---

## 목적

ERP API 샘플, 현장 인터뷰 정리, 바이어 기준값 등 **외부에서 수령한 자료**와
**프로젝트 의사결정의 배경이 되는 참조 문서**를 저장한다.

---

## 파일 목록

| 파일 | 내용 | 상태 |
|------|------|------|
| `erp-if-spec.md` | ERP 5종 IF 명세 및 필드 매핑 | 초안 (W3 수령 전) |
| `domain-constants-ref.md` | 도메인 상수 출처 및 현장 확인 근거 | 작성됨 |
| `buyer-qc-standards.md` | 바이어별 DHU/AQL 기준값 원본 | 미수령 |
| `field-interview-notes.md` | W2 현장 인터뷰 결과 정리 | 미완료 |

---

## 사용 규칙

- ERP API 샘플 수령 시 → `erp-if-spec.md` 업데이트 후 `task-tracker`에 알림
- 바이어 기준값 변경 시 → `buyer-qc-standards.md` 업데이트 + `AdminQCConfig` 화면 반영
- 현장 인터뷰 완료 시 → `field-interview-notes.md` 작성 후 `domain-constants-ref.md` 검증
