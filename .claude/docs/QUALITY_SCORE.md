# Quality Score — 도메인별 품질 등급

## 등급 기준

| 등급 | 의미 | 조건 |
|------|------|------|
| A | 완성 | 전 레이어 구현 + 테스트 커버리지 80%+ + 문서화 |
| B | 기능 완료 | 전 레이어 구현 + 기본 테스트 존재 |
| C | 부분 구현 | 일부 레이어만 존재, 테스트 미흡 |
| D | 미착수 | 모델만 있거나 미구현 |

## 현재 상태

| 도메인 | Model | Schema | Repo | Service | Controller | Test | 등급 |
|--------|-------|--------|------|---------|------------|------|------|
| production_order | O | O | O | O | O | O | **B** |
| work_order | O | - | - | - | - | - | **D** |
| equipment | - | - | - | - | - | - | **D** |
| material | - | - | - | - | - | - | **D** |
| quality | - | - | - | - | - | - | **D** |
| lot | - | - | - | - | - | - | **D** |
| user | - | - | - | - | - | - | **D** |

## 품질 체크리스트 (도메인 완성 시)

- [ ] 전 레이어 파일 존재 (model → controller)
- [ ] Schema에 Create/Update/Read/Filter 4종 정의
- [ ] Service에 비즈니스 규칙/상태 전이 정의
- [ ] API 통합 테스트: 정상 케이스 + 에러 케이스
- [ ] `core/dependencies.py`에 팩토리 등록
- [ ] `app.py`에 라우터 등록
- [ ] Alembic 마이그레이션 생성/적용
- [ ] ARCHITECTURE.md 도메인 맵 업데이트
