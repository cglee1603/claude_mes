# Garment OEM MES — Project Plan (v3.1)

> 작성일: 2026-04-10
> 기준: etc_doc/garment_mes_dev_plan.html, MES_DevPlan_Part1~3.docx
> 이 파일은 planner 에이전트가 관리한다. 변경 시 버전 및 날짜 업데이트.

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | Garment OEM MES v3.1 |
| 대상 | 베트남 의류 OEM 공장 (제2공장 Phase1, 제3공장 Phase2) |
| 클라우드 | AWS ap-southeast-1 |
| 기간 | Phase1 20주 + Phase2 8주 |
| 범위 | 33개 화면, 49개 API 엔드포인트, 9개 Service |

---

## Milestone 1: D-14 사전구축

**목표**: 코드 작성 전 Monorepo·CLAUDE.md·Harness·CI/CD 완성  
**기간**: D-14 ~ D-1 (2주)  
**담당**: 풀스택 리드, PM  
**Gate**: D-14 완료 검증 스크립트 통과

### Epic 1-A: Monorepo 초기화
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| bun workspaces 구조 생성 (apps/web, apps/api, packages/domain, openapi, db) | dev-deployer | critical | — |
| tsconfig.json strict 모드 설정 | dev-deployer | critical | 1-A-1 |
| Root package.json workspaces 정의 | dev-deployer | critical | 1-A-1 |

### Epic 1-B: CLAUDE.md 13개 섹션 작성
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| §1~§3 개요·아키텍처·기술스택 | planner | critical | 1-A 완료 |
| §4 Forbidden Patterns 18개 (C-1~8, H-1~5, M-1~5) | planner | critical | — |
| §5 Service Boundaries 9개 정의 | planner | critical | — |
| §6~§9 API·테스트·에러·ERP 패턴 | planner | high | 1-B-2 |
| §10~§13 도메인규칙·수명주기·i18n·커맨드 | planner | high | 1-B-3 |

### Epic 1-C: .claude/ 에이전트·커맨드 설정
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| 7개 커맨드 정의 (/session-start, /daily-check 등) | planner | high | 1-B 완료 |
| domain-validate.sh 스크립트 작성 | dev-deployer | critical | 1-B-2 |
| CLAUDE.md 불변 Hook 설정 | dev-deployer | high | 1-C-1 |

### Epic 1-D: Harness 7개 도구 설치
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| Testcontainers 설치 및 기본 테스트 | quality-guard | critical | 1-A 완료 |
| fast-check 6개 속성 기본 골격 | quality-guard | critical | packages/domain 구조 |
| @domain-validator 스크립트 | dev-deployer | critical | 1-C-2 |
| CI/CD 4개 워크플로우 (ci, contract, perf, claude-review) | dev-deployer | critical | 1-D-1 |
| Dredd, k6, openapi-msw 설치 (W5·W9 활성화 준비) | dev-deployer | medium | 1-D-4 |

---

## Milestone 2: W1~W4 Inception

**목표**: 코드 없이 설계·ERD·ADR·Domain Rules 완성  
**기간**: W1~W4 (4주)  
**담당**: 전체팀  
**Gate**: Gate 1 (36개 항목) 통과

### Epic 2-A: ERP API 협의 (0번 우선순위)
| Task | 담당 | 우선순위 | 의존 | 마감 |
|------|------|---------|------|------|
| W1 Day1 오후 ERP 담당자 협의 착수 | planner | critical | — | W1 Day1 |
| ERP ORDER·STYLE·MATERIAL 샘플 10건 수령 | task-tracker | critical | 협의 | W3 전 |
| ERP API 방식 확정 (REST/SOAP/File) | planner | critical | 협의 | W3 |
| 미수령 시: Mock ERP 구축 계획 (ADR-006) | dev-deployer | critical | W3 미수령 | W3 |

### Epic 2-B: 현장 인터뷰 18개 항목
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| W2 현장 방문 일정 확보 | task-tracker | critical | — |
| 인터뷰 진행: 라인장·QC·창고·인사팀 | planner | critical | 방문 |
| §10 Domain Rules 18개 확정 (DHU, AQL, 릴렉싱 시간 등) | planner | critical | 인터뷰 |
| TBD 항목 마감일 설정 (미싱기 벤더 등) | task-tracker | medium | 인터뷰 |

### Epic 2-C: 아키텍처 설계
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| SERVICE_BOUNDARIES.md 작성 (워크숍 2~3시간) | planner | critical | 2-B |
| 49개 API 명세 초안 | planner | high | 2-B |
| ERD 작성 (Layer A~D 분류) | planner | critical | 2-B |
| ADR-001~013 작성 및 팀 서명 | planner | critical | 2-C-1 |

### Epic 2-D: Prisma Schema + Gate 1
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| ERP ORDER Zod 스키마 작성 및 파싱 검증 | dev-deployer | critical | 샘플 수령 |
| Prisma Schema 전체 작성 (Layer A~D) | dev-deployer | critical | ERD |
| Layer C 삭제 방지 트리거 5개 구현 | dev-deployer | critical | Prisma |
| fast-check 6개 속성 완성 | quality-guard | critical | 2-D-2 |
| Gate 1 (36항목) 체크리스트 검증 | planner | critical | 2-D 전체 |

---

## Milestone 3: W5~W8 Foundation

**목표**: spec.yaml 확정 → Stream A/B 병렬 → MaterialService·CuttingService 완성  
**기간**: W5~W8 (4주)  
**담당**: Stream A (dev-deployer 프론트), Stream B (dev-deployer 백엔드)

### Epic 3-A: spec.yaml 확정 (W5)
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| 49개 엔드포인트 spec.yaml 최종 확정 | planner | critical | Gate 1 |
| generate-msw 실행 → 49개 MSW 핸들러 자동생성 | dev-deployer | critical | spec.yaml |
| TypeScript 타입 자동생성 | dev-deployer | critical | spec.yaml |
| Dredd 계약 테스트 기준점 설정 | quality-guard | critical | spec.yaml |
| Stream A/B 브랜치 분기 | dev-deployer | critical | 위 완료 |

### Epic 3-B: ERP Sync 기본 골격 (화면보다 먼저)
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| ERPSyncService 골격 (receiveOrder, 스테이징 저장) | dev-deployer | critical | spec.yaml |
| 자재 코드 드롭다운 데이터 준비 | dev-deployer | critical | 3-B-1 |

### Epic 3-C: MaterialService + 창고 화면 (W6)
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| /scaffold-service material 실행 | dev-deployer | critical | 3-B |
| inspect4Point() — FOUR_POINT_THRESHOLD=28 적용 | dev-deployer | critical | scaffold |
| moveToRelaxation() — RELAXATION_HOURS 맵 사용 | dev-deployer | critical | scaffold |
| WH-01(원단입고), WH-02(이력), WH-03(대시보드) 화면 | dev-deployer | high | MSW |
| Dredd 창고 8개 엔드포인트 첫 통과 | quality-guard | critical | 3-C-3 |

### Epic 3-D: RelaxationService + RX 화면 (W7)
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| RelaxationService — 소재별 시간 자동, 30분 전 알림 | dev-deployer | high | 3-C |
| RX-04(릴렉싱계획), RX-05(소재별시간), RX-06(완료알림) | dev-deployer | high | MSW |
| @domain-validator C-5 순환의존 0건 확인 | quality-guard | critical | 3-D-1 |

### Epic 3-E: CuttingService + SC 화면 (W8)
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| /scaffold-service cutting 실행 | dev-deployer | critical | 3-D |
| createBundle() — Shading 방지 (동일 색상 단일 Roll) | dev-deployer | critical | scaffold |
| createLot() — ERP 오더 참조 필수 (C-8) | dev-deployer | critical | scaffold |
| SC-07~13 재단 화면 | dev-deployer | high | MSW |
| /techdebt 실행 → §4 업데이트 | planner | medium | W8 |
| /sync-friday Stream A/B 합류, MSW 드리프트 확인 | dev-deployer | high | 매주 금요일 |

---

## Milestone 4: W9~W12 Core Build

**목표**: LOT 완전 추적·봉제 팀 실적·QC 8단계·k6 게이팅  
**기간**: W9~W12 (4주)  
**Gate**: Gate 2 (31개 항목)

### Epic 4-A: LOT 완전 추적 + k6 게이팅 (W9)
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| GET /lots/{lotNo}/trace — Roll→Bundle→Carton→B/L (N+1 방지) | dev-deployer | critical | Milestone 3 |
| k6 PR 게이팅 활성화 (4개 임계값) | quality-guard | critical | W9 |
| 공장장 데모 — LOT 추적 3초 이내 실연 | planner | high | 4-A-1 |

### Epic 4-B: ProductionService — 팀 실적 (W10, ADR-013)
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| /scaffold-service production 실행 | dev-deployer | critical | Milestone 3 |
| recordLineOutput() — workerId nullable, recordedBy 필수 | dev-deployer | critical | scaffold |
| SW-14(투입계획), SW-15(Layout), SW-17~18(팀실적) 화면 | dev-deployer | high | MSW |
| 임금 계산 로직 포함 여부 검증 (C-2) | quality-guard | critical | 4-B-2 |

### Epic 4-C: LINE_DAILY_SUMMARY + ERP 전송 (W11)
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| 자정 cron — 라인별 팀 실적 집계 | dev-deployer | critical | 4-B |
| LINE_DAILY_SUMMARY 저장 (Layer C) | dev-deployer | critical | 4-C-1 |
| ERP 전송 큐 등록 (임금 필드 없음 확인) | dev-deployer | critical | 4-C-1 |
| PWA 오프라인 IndexedDB 큐잉 (2시간 제한) | dev-deployer | high | — |

### Epic 4-D: QualityService 8단계 + Gate 2 (W12)
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| /scaffold-service quality 실행 | dev-deployer | critical | Milestone 3 |
| 8단계 검사 구현 (Inline→Final→Packing→Shipping QC) | dev-deployer | critical | scaffold |
| DHU + FTP 동시 계산 (H-5) | dev-deployer | critical | 4-D-2 |
| WebSocket QUALITY_ALERT (DHU > 기준 초과 시) | dev-deployer | high | 4-D-3 |
| QC-25~32 화면 | dev-deployer | high | MSW |
| Gate 2 (31항목) 체크리스트 | planner | critical | W12 전체 |

---

## Milestone 5: W13~W16 Advanced

**목표**: MFZ Zero Policy·ERP 5종 완성·대시보드·33개 화면 완성  
**기간**: W13~W16 (4주)  
**Gate**: Gate 3 (16+20개 항목)

### Epic 5-A: FinishingService + MFZ Zero Policy (W13)
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| /scaffold-service finishing 실행 | dev-deployer | critical | Milestone 4 |
| recordMFZ() — 검출 시 즉시 MFZ_HOLD (C-7 유일 진입점) | dev-deployer | critical | scaffold |
| Ply 역추적 (어느 Bundle 몇 번째 Ply) | dev-deployer | critical | 5-A-2 |
| MFZ_HOLD 출하 차단 (ShipmentService) | dev-deployer | critical | 5-A-2 |
| FP-21(MFZ검사) 화면 | dev-deployer | high | MSW |
| 공장장 MFZ Zero Policy 서명 | task-tracker | critical | 5-A-3 |

### Epic 5-B: ShipmentService + 5종 ERP 완성 (W14)
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| ShipmentService — confirmShipment, MFZ_HOLD 차단 | dev-deployer | critical | 5-A |
| ERP 5종 양방향 연동 완성 (W13 미확정 시 파일 기반 폴백) | dev-deployer | critical | 5-B-1 |
| FP-19(태깅), FP-20(Polybag), FP-22(Carton) 화면 | dev-deployer | high | MSW |
| ERP 5종 IF 필드 매핑 ERP 담당자 서명 | task-tracker | critical | 5-B-2 |

### Epic 5-C: OptimizationService + 대시보드 (W15~W16)
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| OptimizationService — SMV 균등 배분 (AI 없음, Phase 1) | dev-deployer | medium | Milestone 4 |
| kpi_snapshots 사전 집계 (매 시간 cron, p95 ≤800ms) | dev-deployer | critical | 5-B |
| AD-23(공장장대시보드), AD-24(WIP조회) 화면 | dev-deployer | high | MSW |
| Admin 6개 화면 (라인·기계·SMV·ERP동기화·수명주기·QC기준) | dev-deployer | high | MSW |
| M6 Schema 최종 확정 미팅 (W15) | planner | critical | W15 |
| /add-i18n 전체 화면 (KO/EN/VI, 현장 담당자 검수) | dev-deployer | high | W16 |
| Gate 3 사전 점검 (20항목) | planner | critical | W16 |

---

## Milestone 6: W17~W20 Launch

**목표**: SIT E2E 4개·UAT·파일럿 7개 KPI·납품  
**기간**: W17~W20 (4주)  
**Gate**: Gate 3 → Gate 4

### Epic 6-A: SIT — E2E 4개 시나리오 (W17)
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| SIT 환경 시드 데이터 준비 (바이어2, 스타일3, 오더5, Roll20) | dev-deployer | critical | Milestone 5 |
| E2E-1: 정상 생산 (창고→봉제→출하, LOT 추적) | quality-guard | critical | 6-A-1 |
| E2E-2: QC 불합격 → 재작업 → 재검사 → 출하 | quality-guard | critical | 6-A-1 |
| E2E-3: MFZ 검출 → LOT_MFZ_HOLD → Ply 역추적 → 재검 → 출하 | quality-guard | critical | 6-A-1 |
| E2E-4: 라인 실적 → 자정 cron → ERP 전송 → Layer C 삭제 차단 | quality-guard | critical | 6-A-1 |
| Gate 3 (20항목) 통과 | planner | critical | E2E 4개 |

### Epic 6-B: UAT — 현장 담당자 검증 (W18)
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| UAT 참가자 섭외 (공장장·라인장3·QC2·창고·재단·포장) | task-tracker | critical | Gate 3 |
| UAT 진행 및 결함 분류 (P1~P4) | quality-guard | critical | 6-B-1 |
| P1(24h) P2(48h) 결함 수정 | dev-deployer | critical | 6-B-2 |
| W18 Day9 PM 파일럿 착수 여부 최종 결정 | planner | critical | 6-B-3 |

### Epic 6-C: 파일럿 + 7개 KPI (W19)
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| 파일럿 오더 선정 (100~200pcs 실제 오더) | task-tracker | critical | UAT 완료 |
| 현장 기기 세팅 (태블릿·PDA·바코드, WiFi 확인) | dev-deployer | critical | 6-C-1 |
| 현장 교육 3회 (공장장·QC창고재단·봉제 작업자) | notifier | high | 6-C-2 |
| 파일럿 7개 KPI 측정 (실적입력률≥95%, 시간≤3분 등) | quality-guard | critical | 파일럿 |

### Epic 6-D: Gate 4 + 납품 (W20)
| Task | 담당 | 우선순위 | 의존 |
|------|------|---------|------|
| Gate 4 (15항목) 체크리스트 | planner | critical | 6-C |
| 운영 매뉴얼 KO·VI 작성 | dev-deployer | high | Gate 4 |
| Phase 2 로드맵 문서화 (이월 7개 항목) | planner | high | Gate 4 |
| 납품 패키지 (코드 v1.0.0 태그, DB, 시드, 교육) | dev-deployer | critical | Gate 4 |
| 발주사 최종 검수 서명 | task-tracker | critical | 납품 |

---

## Milestone 7: Phase 2 — 제3공장 (8주)

**착수 조건**: Gate 4 15항목 전체 통과 + 파일럿 KPI 6/7 + ERP 전송 2개월 ≥99%

### Epic 7-A: 제3공장 마스터 데이터 (1~2주)
| Task | 담당 | 우선순위 |
|------|------|---------|
| 제3공장 Layer B 마스터 데이터 설정 | dev-deployer | critical |
| Row-Level Security 활성화 (제2·3공장 데이터 분리) | dev-deployer | critical |

### Epic 7-B: 제3공장 ERP 연동 + 교육 + 파일럿 (3~8주)
| Task | 담당 | 우선순위 |
|------|------|---------|
| 제3공장 ERP 설정 (별도 ERP_CONN_CONFIG 가능) | dev-deployer | critical |
| 제2공장 개선사항 반영 | dev-deployer | medium |
| 제3공장 현장 교육 (제2공장 라인장 강사 역할) | notifier | high |
| 제3공장 파일럿 100~200pcs | quality-guard | critical |

### Epic 7-C: 개인 추적 자발적 전환 (ADR-013)
| Task | 담당 | 우선순위 | 조건 |
|------|------|---------|------|
| Step 1: worker_id 선택 입력 활성화 | dev-deployer | medium | 운영 6개월 |
| Step 2: 라인장 담당자 현황 리포트 | dev-deployer | medium | Step 1 + 3개월 |
| Step 3: 개인 생산성 ERP 전송 | dev-deployer | low | 공장장 자발적 요청 |

---

## Phase 2 이월 항목 (7개)

| 항목 | 이월 이유 | 착수 조건 |
|------|---------|---------|
| 미싱기 MQTT 실 연동 | 브로커 미확보 | 브로커 설치 완료 |
| 온습도 센서 실 연동 | 설치 확인 중 | 설치 완료 |
| 납기 예측 ML | 데이터 3개월 미만 | 데이터 3개월+ |
| AI 라인밸런싱 | SkillMatrix 6개월 미만 | 데이터 6개월+ |
| CAD Marker 파일 연동 | 별도 예산 미반영 | API 문서 확보 |
| 개인 생산성 ERP 연동 | 현장 저항 방지 | 공장장 자발적 요청 |
| ERP 필드 매핑 고도화 | 수동 운영 중 | ERP 업그레이드 후 |

---

## 리스크 관리

| 리스크 | 영향 | 완화 전략 |
|--------|------|---------|
| ERP API W3 미수령 | W5 착수 불가 | Mock ERP 구축 (ADR-006) |
| Gate 1 미통과 | W5 착수 1주 연기 | Inception 기간 충분히 |
| k6 임계값 합의 지연 | W9 게이팅 지연 | W8 완료 후 팀 합의 |
| MSW 드리프트 | Stream A 중단 | /sync-friday 필수 실행 |
| P1/P2 UAT 결함 | 파일럿 1주 연기 | W18 Day9 PM 최종 결정 |
| Layer C 삭제 시도 | 법적 증거 상실 | 트리거 Gate 1·3·4 검증 |

---

## Gate 체크리스트 요약

| Gate | 주요 조건 |
|------|---------|
| Gate 1 (W4) | ADR 13개 서명, Domain Rules 18개, Prisma validate 0, fast-check 6개, Layer C 트리거 |
| Gate 2 (W12) | k6 4개 통과, TC ≥80%, Dredd 100%, @domain-validator CRITICAL 0 |
| Gate 3 (W17) | E2E 4개, Dredd 49개 100%, k6 전체, MFZ_HOLD 차단, 33개 화면 완성 |
| Gate 4 (W20) | 파일럿 KPI 6/7, MFZ Zero Policy 100%, ERP 전송 ≥99%, 라인장 만족도 ≥3점 |
