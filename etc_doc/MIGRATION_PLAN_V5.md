# GarmentOS v5 화면 재편 마이그레이션 계획

> 생성일: 2026-04-17 | v4.6 → v5.0 전환 | ERD v4 기반

## 1. 변경 개요

| 항목 | v4.6 (기존) | v5.0 (신규) |
|------|-------------|-------------|
| 화면 수 | 33개 | 34개 (33개 공정 + 1개 대시보드) |
| 화면 코드 형식 | WH-01, SC-07 | H-WH-01, H-SC-01 |
| 릴렉싱 공정 | 별도 모듈 (RX-04~06) | WH 모듈에 통합 (H-WH-05) |
| DB 테이블 | ~38개 | 72개 (ERD v4) |
| 공정 모듈 | WH/RELAX/CUT/SEW/QC/FIN/ANA | WH / CUT / SEW / FIN |

## 2. 34개 화면 전체 목록

### WAREHOUSE (7개)

| 코드 | 화면명 (KO) | 기존 대응 | 경로 | i18n NS | Excel출력 | Excel입력 |
|------|------------|----------|------|---------|----------|----------|
| H-WH-01 | 원단 입고·4점법 검사 | WH-01 | /warehouse/fabric-receive | warehouse.fabricReceive | O | X |
| H-WH-02 | 부자재 입고·검사 | 신규 | /warehouse/trim-receive | warehouse.trimReceive | O | X |
| H-WH-03 | 출고 전표 | 신규 | /warehouse/issue-voucher | warehouse.issueVoucher | O | X |
| H-WH-04 | 재고 현황 | WH-02(부분) | /warehouse/inventory | warehouse.inventory | O | X |
| H-WH-05 | 릴렉싱 관리 | RX-04~06 | /warehouse/relaxation | warehouse.relaxation | O | X |
| H-PRINT-01 | 롤 라벨 출력 | 신규 | /warehouse/roll-label | print.rollLabel | X | X |
| H-PRINT-02 | 번들 라벨 출력 | 신규 | /warehouse/bundle-label | print.bundleLabel | X | X |

### CUT (8개)

| 코드 | 화면명 (KO) | 기존 대응 | 경로 | i18n NS | Excel출력 | Excel입력 |
|------|------------|----------|------|---------|----------|----------|
| H-SC-01 | 재단 계획 | SC-07(부분) | /cutting/cutting-plan | cutting.cuttingPlan | O | O |
| H-SC-02 | 연신 보고서 | 신규 | /cutting/spreading | cutting.spreading | O | X |
| H-SC-03 | 마커 효율 | SC-09 | /cutting/marker | cutting.marker | O | X |
| H-LOT-01 | LOT 색상 그룹 편성 | SC-07, SC-10 | /cutting/color-group | cutting.colorGroup | O | X |
| H-LOT-02 | 봉제라인 인도서 | SC-11(부분) | /cutting/line-delivery | cutting.lineDelivery | O | X |
| H-SCAN-01 | 번들 바코드 스캔 | 신규 | /cutting/bundle-scan | cutting.scan | X | X |
| H-CUT-04 | 외주 자수·프린팅 추적 | 신규 | /cutting/outsource | cutting.outsource | O | X |
| H-CUT-05 | 일일 재단 실적 | SC-13(부분) | /cutting/daily-report | cutting.dailyReport | O | X |

### SEWING (12개)

| 코드 | 화면명 (KO) | 기존 대응 | 경로 | i18n NS | Excel출력 | Excel입력 |
|------|------------|----------|------|---------|----------|----------|
| H-SW-01 | 생산 계획·런데이 목표 | SW-14 | /sewing/production-plan | sewing.productionPlan | O | O |
| H-SW-02 | PP 체크리스트·공정 배치 | SW-15 | /sewing/pp-checklist | sewing.ppChecklist | O | X |
| H-SW-03 | 자재 수령 (BTP·부자재) | SW-16(부분) | /sewing/material-receiving | sewing.materialReceiving | O | X |
| H-RT-01 | 봉제 실적·SAM 추정 | SW-17, SW-18 | /sewing/output | sewing.output | O | X |
| H-QC-01 | Bundle QC 검사 | QC-25, QC-26 | /sewing/bundle-qc | sewing.bundleQC | O | X |
| H-QC-02 | Endline QC 보고서 | QC-27, QC-28 | /sewing/endline-qc | sewing.endlineQC | O | X |
| H-QC-03 | QC 대시보드 | QC-31, QC-32 | /sewing/qc-dashboard | sewing.qcDashboard | O | X |
| H-MFZ-01 | 금속 탐지 검사 | FP-21 | /sewing/metal-detection | sewing.metalDetection | O | X |
| H-SW-04 | 날카로운 도구 관리 | 신규 | /sewing/sharp-tools | sewing.sharpTools | O | X |
| H-SW-05 | 합격 수량 기록 | 신규 | /sewing/passed-garments | sewing.passedGarments | O | X |
| H-SW-06 | 내부 이관 | 신규 | /sewing/internal-transfer | sewing.internalTransfer | O | X |
| H-SW-07 | 시간별 생산량 입력 | SW-17(부분) | /sewing/hourly-entry | sewing.hourlyEntry | X | X |

### FINISHING (10개)

| 코드 | 화면명 (KO) | 기존 대응 | 경로 | i18n NS | Excel출력 | Excel입력 |
|------|------------|----------|------|---------|----------|----------|
| H-FIN-01 | 행택·라벨 검사 | FP-19 | /finishing/hangtag-inspect | finishing.hangtagInspect | O | X |
| H-FIN-02 | 금속탐지기 교정 | 신규 | /finishing/mfz-calibration | finishing.mfzCalibration | O | X |
| H-FIN-03 | 중량·수량 검사 | 신규 | /finishing/weight-inspect | finishing.weightInspect | O | X |
| H-FIN-04 | 박스 포장 검사 | FP-22, QC-29 | /finishing/carton-inspect | finishing.cartonInspect | O | X |
| H-FIN-05 | 패킹리스트 | FP-20 | /finishing/packing-list | finishing.packingList | O | O |
| H-PERF-01 | 완성 실적·월보 | 신규 | /finishing/performance | finishing.performance | O | X |
| H-FIN-06 | 출하 관리 | QC-30 | /finishing/shipment | finishing.shipment | O | X |
| H-FIN-07 | 건조실 점검 | 신규 | /finishing/dry-room | finishing.dryRoom | O | X |
| H-FIN-08 | 금속 검사 일별 요약 | 신규 | /finishing/mfz-summary | finishing.mfzSummary | O | X |
| H-FIN-09 | 완성부 월별 실적 | 신규 | /finishing/monthly-report | finishing.monthlyReport | O | X |

### Dashboard (1개 - Screen 0)

| 코드 | 화면명 | 기존 대응 | 경로 | i18n NS |
|------|--------|----------|------|---------|
| Screen-0 | 공장 통합 대시보드 | AD-23 + AD-24 통합 | /dashboard | dashboard |

## 3. 삭제 대상 파일

```
apps/web/src/pages/relaxation/RX04-Plan.tsx
apps/web/src/pages/relaxation/RX05-Material.tsx
apps/web/src/pages/relaxation/RX06-Alert.tsx
apps/web/src/pages/cutting/SC07-LotCreate.tsx
apps/web/src/pages/cutting/SC08-BundleCreate.tsx
apps/web/src/pages/cutting/SC09-MarkerEfficiency.tsx
apps/web/src/pages/cutting/SC10-LotList.tsx
apps/web/src/pages/cutting/SC11-LotTrace.tsx
apps/web/src/pages/cutting/SC12-ShadingCheck.tsx
apps/web/src/pages/cutting/SC13-CuttingDashboard.tsx
apps/web/src/pages/sewing/SW14-InputPlan.tsx
apps/web/src/pages/sewing/SW15-LineLayout.tsx
apps/web/src/pages/sewing/SW16-MachineStatus.tsx
apps/web/src/pages/sewing/SW17-OutputEntry.tsx
apps/web/src/pages/sewing/SW18-OutputSummary.tsx
apps/web/src/pages/quality/QC25-InlineInspect.tsx
apps/web/src/pages/quality/QC26-InlineResult.tsx
apps/web/src/pages/quality/QC27-FinalInspect.tsx
apps/web/src/pages/quality/QC28-FinalResult.tsx
apps/web/src/pages/quality/QC29-PackingInspect.tsx
apps/web/src/pages/quality/QC30-ShippingInspect.tsx
apps/web/src/pages/quality/QC31-DHUTrend.tsx
apps/web/src/pages/quality/QC32-QCDashboard.tsx
apps/web/src/pages/finishing/FP19-Tagging.tsx
apps/web/src/pages/finishing/FP20-Polybag.tsx
apps/web/src/pages/finishing/FP21-MFZ.tsx
apps/web/src/pages/finishing/FP22-Carton.tsx
apps/web/src/pages/analytics/AD23-KPI.tsx
apps/web/src/pages/analytics/AD24-WIP.tsx
apps/web/src/pages/warehouse/WH02-History.tsx
apps/web/src/pages/warehouse/WH03-Dashboard.tsx
```

## 4. Harness 규칙 (방어 로직) 연결

| 화면 코드 | 방어 규칙 |
|-----------|----------|
| H-WH-01 | inspection_status=FAILED 롤 → lot_transfers 진입 차단 |
| H-PRINT-01 | 동일 roll_id/bundle_id 중복 라벨 출력 차단 |
| H-PRINT-02 | 동일 bundle_id 중복 라벨 출력 차단 |
| H-SC-01 | Bundle global_seq GENERATED ALWAYS (Race Condition 방지) |
| H-SC-03 | fabric_width_cm 없으면 효율 계산 차단 |
| H-LOT-01 | 동일 Roll이 복수 Bundle에 분산 시 경고·차단 |
| H-LOT-02 | 인도 수량 ≠ 번들 수량 → 차단 |
| H-SCAN-01 | 300ms 내 중복 스캔 차단 (디바운싱) |
| H-SW-01 | plan_qty=0이면 효율 표시 "-" (NaN 방지) |
| H-SW-02 | 동일 번들 300ms 내 중복 스캔 차단 |
| H-RT-01 | [추정] 뱃지 필수 표시 (data_source=ESTIMATED) |
| H-QC-01 | inspect_qty=0이면 DHU=null, "입력 대기" 표시 |
| H-QC-02 | buyer_qc_standards 미설정 시 업계 기본값 3% + 알림 |
| H-QC-03 | AQL 샘플 사이즈 단위 테스트 100% 커버리지 필요 |
| H-MFZ-01 | all_passed=false이면 출하 API 403 반환 |

## 5. ERD v4 주요 테이블-화면 연결

| 모듈 | 주요 테이블 | 연결 화면 |
|------|------------|----------|
| WH | rolls, trims, issue_vouchers, inventory_period_snapshots | H-WH-01~04 |
| WH | trims_inspections, trims_inspection_lines | H-WH-02 |
| PRINT | print_log | H-PRINT-01, H-PRINT-02 |
| CUT | cutting_plans, cutting_plan_bands, lot_color_groups | H-SC-01, H-LOT-01 |
| CUT | spreading_reports, spreading_report_rolls | H-SC-02 |
| CUT | cut_to_line_deliveries, cut_to_line_delivery_lines | H-LOT-02 |
| CUT | lot_transfers (bundle scan) | H-SCAN-01 |
| CUT | print_emb_shipments | H-CUT-04 |
| CUT | daily_cutting_reports | H-CUT-05 |
| SEW | line_production_plans, plan_po_allocations | H-SW-01 |
| SEW | pp_checklists, process_layouts | H-SW-02 |
| SEW | btp_receiving_log, accessories_to_line_deliveries | H-SW-03 |
| SEW | sewing_outputs, hourly_production_entries | H-RT-01 |
| SEW | qc_inspections, defects | H-QC-01 |
| SEW | endline_qc_reports, endline_defect_workers | H-QC-02 |
| SEW | passed_garment_records | H-SW-05 |
| SEW | sharp_tools_log | H-SW-04 |
| SEW | internal_line_deliveries | H-SW-06 |
| SEW | metal_detection_logs | H-MFZ-01 |
| FIN | hangtag_inspections, hangtag_defects | H-FIN-01 |
| FIN | metal_detector_calibrations | H-FIN-02 |
| FIN | weight_qty_inspections | H-FIN-03 |
| FIN | carton_records, carton_packing_inspections | H-FIN-04 |
| FIN | packing_lists, packing_list_lines | H-FIN-05 |
| FIN | finishing_daily_reports, worker_daily_finishing_output | H-PERF-01 |
| FIN | shipment_lots | H-FIN-06 |
| FIN | dry_room_checks | H-FIN-07 |
| FIN | metal_detection_summaries | H-FIN-08 |
| FIN | finishing_monthly_reports | H-FIN-09 |

## 6. 화면 개발 규칙

### 코딩 패턴
- 파일명: `{SCREEN-CODE}-{EnglishName}.tsx` (예: `H-WH-01-FabricReceive.tsx`)
- 컴포넌트명: `H{CODE}Page` (예: `HWH01Page`, `HSC01Page`, `HRT01Page`)
- 라인 제한: 파일당 ≤200줄
- 모든 텍스트: `t('namespace.screen.key')` 사용 (하드코딩 절대 금지)
- 그리드: `MesGrid` 컴포넌트 사용 (DataTable 사용 금지)
- Excel 내보내기: `exportToCsv(data, filename)` from `utils/excel`
- Excel 가져오기: `<input type="file" accept=".csv,.xlsx">` (해당 화면만)

### i18n 키 형식
`{module}.{camelCaseScreenName}.{fieldName}`

예시:
- `warehouse.fabricReceive.title` = "원단 입고·4점법 검사"
- `cutting.cuttingPlan.planNo` = "계획번호"
- `sewing.bundleQC.dhuRate` = "DHU율"
- `finishing.packingList.poNo` = "PO 번호"

### Excel 유틸리티
```typescript
// utils/excel.ts
export function exportToCsv(data: Record<string, unknown>[], filename: string): void
export function readCsvFile(file: File): Promise<Record<string, string>[]>
```

## 7. .claude 업데이트 대상

| 파일 | 업데이트 내용 |
|------|------------|
| CLAUDE.md §1 | 화면 목록 34개로 업데이트, H-prefix |
| CLAUDE.md §4 | Forbidden Patterns - 화면 코드 예시 업데이트 |
| .claude/rules/frontend.md §14 | 전체 화면 목록 교체 |
| .claude/rules/frontend.md §11 | SCREEN_COMPONENTS 맵 업데이트 |
| .claude/rules/permission.md | 화면 코드 예시 업데이트 |
| .claude/rules/backup.md | Layer C 테이블 업데이트 (ERD v4 기준) |

## 8. Admin 화면 변경사항

Admin 화면은 구조 유지, 아래 항목 추가:
- AdminMasters (신규): buyers, factories, defect_codes, suppliers 마스터 관리
- 기존 AdminSMV → sam_master 테이블 연동으로 업데이트
- AdminQCConfig → buyer_qc_standards 테이블 연동으로 업데이트

## 9. Feature Flags (v5 신규)

| Flag 이름 | 기본값 | 적용 화면 |
|-----------|--------|----------|
| qc-dhu-by-buyer | false | H-QC-01~03 |
| inspection-4pt-per-yard | false | H-WH-01 |
| sewing-output-by-bundle | false | H-RT-01 |
| cad-marker-import | false | H-SC-03 |
| sewing-iot-input | false | H-RT-01 |
| qc-photo-attach | false | H-QC-01~02 |
| erp-csv-import | false | H-SW-01 |
| smv-efficiency | false | H-SW-01~02 |
| sewing-sam-estimation | true | H-RT-01, Dashboard |
| sewing-hourly-entry | true | H-SW-07, Dashboard |
