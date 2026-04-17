# v5 화면 재편 상태 (2026-04-17)

## 완료
- [x] CLAUDE.md 화면 수 업데이트 (33→34, 49 API→44 API)
- [x] frontend.md §14 화면 목록 교체 (H-prefix 체계)
- [x] frontend.md §13-2 저장 키 예시 업데이트
- [x] frontend.md §15 Excel 내보내기·가져오기 정책 추가
- [x] permission.md §4 라우터 패턴 화면 코드 업데이트
- [x] permission.md §5 화면 수 업데이트 (33→34)
- [x] permission.md §6 시드 데이터 화면 코드 업데이트

## 진행 중 (병렬 에이전트)
- [ ] WH 모듈 7개 화면 신규 생성
- [ ] CUT 모듈 8개 화면 신규 생성
- [ ] SEW 모듈 12개 화면 신규 생성
- [ ] FIN 모듈 10개 화면 신규 생성
- [ ] App.tsx 라우팅 업데이트
- [ ] Sidebar.tsx 네비게이션 업데이트
- [ ] i18n (ko/en/vi.json) 전면 업데이트
- [ ] utils/excel.ts 유틸리티 생성
- [ ] 구 화면 파일 31개 삭제

## 스크린 코드 매핑
H-WH-01→/warehouse/fabric-receive, H-WH-02→/warehouse/trim-receive,
H-WH-03→/warehouse/issue-voucher, H-WH-04→/warehouse/inventory,
H-WH-05→/warehouse/relaxation, H-PRINT-01→/warehouse/roll-label,
H-PRINT-02→/warehouse/bundle-label, H-SC-01→/cutting/cutting-plan,
H-SC-02→/cutting/spreading, H-SC-03→/cutting/marker,
H-LOT-01→/cutting/color-group, H-LOT-02→/cutting/line-delivery,
H-SCAN-01→/cutting/bundle-scan, H-CUT-04→/cutting/outsource,
H-CUT-05→/cutting/daily-report, H-SW-01→/sewing/production-plan,
H-SW-02→/sewing/pp-checklist, H-SW-03→/sewing/material-receiving,
H-RT-01→/sewing/output, H-QC-01→/sewing/bundle-qc,
H-QC-02→/sewing/endline-qc, H-QC-03→/sewing/qc-dashboard,
H-MFZ-01→/sewing/metal-detection, H-SW-04→/sewing/sharp-tools,
H-SW-05→/sewing/passed-garments, H-SW-06→/sewing/internal-transfer,
H-SW-07→/sewing/hourly-entry, H-FIN-01→/finishing/hangtag-inspect,
H-FIN-02→/finishing/mfz-calibration, H-FIN-03→/finishing/weight-inspect,
H-FIN-04→/finishing/carton-inspect, H-FIN-05→/finishing/packing-list,
H-PERF-01→/finishing/performance, H-FIN-06→/finishing/shipment,
H-FIN-07→/finishing/dry-room, H-FIN-08→/finishing/mfz-summary,
H-FIN-09→/finishing/monthly-report
