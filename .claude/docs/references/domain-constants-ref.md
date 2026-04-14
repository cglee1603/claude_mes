# 도메인 상수 참조 — 출처 및 현장 확인 근거

> 기준: CLAUDE.md §10
> 코드 위치: `packages/domain/src/constants/index.ts`
> 하드코딩 금지 — 모든 상수는 이 파일에서 관리

---

## 상수 목록

| 상수명 | 값 | 설명 | 출처 | 현장 확인 |
|-------|----|------|------|---------|
| `FOUR_POINT_THRESHOLD` | 28 pts/100m | 원단 4점법 합격 기준 | 업계 표준 | W2 현장 확인 필요 |
| `RELAXATION_HOURS.COTTON` | 48h | 면 릴렉싱 시간 | 현장 경험치 | W2 현장 확인 필요 |
| `RELAXATION_HOURS.LINEN` | 48h | 린넨 릴렉싱 시간 | 현장 경험치 | W2 현장 확인 필요 |
| `RELAXATION_HOURS.POLY` | 24h | 폴리 릴렉싱 시간 | 현장 경험치 | W2 현장 확인 필요 |
| `RELAXATION_HOURS.WOOL` | 72h | 울 릴렉싱 시간 | 현장 경험치 | W2 현장 확인 필요 |
| `BUNDLE_QTY_DEFAULT` | 100 | 기본 Bundle 수량 | 현장 운영 기준 | W2 현장 확인 필요 |
| `BUNDLE_QTY_MIN` | 80 | Bundle 최소 수량 | 현장 운영 기준 | W2 현장 확인 필요 |
| `BUNDLE_QTY_MAX` | 150 | Bundle 최대 수량 | 현장 운영 기준 | W2 현장 확인 필요 |
| `OFFLINE_MAX_HOURS` | 2h | PWA 오프라인 허용 시간 | 현장 WiFi 환경 | W2 현장 확인 필요 |
| `MFZ_MAINTENANCE_CYCLE` | monthly | 금속 검출기 교정 주기 | 장비 사양서 | 미수령 |
| `SKILL_MATRIX_UPDATE_CYCLE` | quarterly | 숙련도 평가 주기 | HR 정책 | W2 인터뷰 필요 |
| `ARCHIVE_ORDER_DAYS` | 180일 | 오더 완료 후 아카이브 기간 | 법적 요건 | 확인됨 |
| `ARCHIVE_MATERIAL_DAYS` | 90일 | 재고 0 후 아카이브 기간 | 운영 기준 | 확인됨 |
| `ERP_QUEUE_ARCHIVE_DAYS` | 90일 | ERP 전송큐 보관 기간 | ERP 요건 | ERP 협의 필요 |

---

## 현장 확인이 필요한 항목 (W2 인터뷰 시 확인)

1. **FOUR_POINT_THRESHOLD = 28** — 바이어별로 다를 수 있음. NIKE/ZARA 기준 확인 필요.
2. **RELAXATION_HOURS** — 소재별 시간이 공장 환경(온습도)에 따라 다를 수 있음.
3. **BUNDLE_QTY** — 라인별 SMV에 따라 최적 Bundle 수량이 달라질 수 있음.
4. **OFFLINE_MAX_HOURS = 2** — 현장 WiFi 불안정 구간이 2시간을 초과하는지 확인.

---

## 바이어별 QC 기준 (C-1: 하드코딩 금지, DB 조회)

> `AdminQCConfig` 화면에서 관리. 이 파일은 참조용.

| 바이어 | DHU 임계값 | AQL 수준 | 검사 수준 | 출처 |
|--------|----------|---------|---------|------|
| NIKE | 3.0% | AQL 2.5 | Level II | 미수령 (W2 협의) |
| ZARA | 4.0% | AQL 4.0 | Level I | 미수령 (W2 협의) |

> 실제 바이어 기준은 수령 후 `buyer-qc-standards.md`에 원본 보관, DB에 등록.
