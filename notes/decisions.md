# ADR (Architecture Decision Records)

> 모든 ADR은 팀 전체 서명 후 main 브랜치에 커밋.

## ADR-001: Result<T, DomainError> 패턴 필수
- **결정**: 모든 Service 메서드는 `Result<T, DomainError>` 반환
- **이유**: 에러 무시 방지, 컴파일 타임 강제
- **상태**: 확정

## ADR-004: IoT Phase 1 Mock, Phase 3 실 연동
- **결정**: Phase 1은 Mock IoT 사용, Phase 3에서 MQTT/OPC-UA 실 연동
- **이유**: 브로커 미확보, 벤더 문서 미수령
- **상태**: 확정

## ADR-005: 임금 계산 MES 절대 금지
- **결정**: MES에서 임금 계산 로직 완전 제외
- **이유**: 노동법 오류 시 법적 분쟁 위험
- **상태**: 확정

## ADR-006: ERP API W3 전 미수령 시 Mock ERP
- **결정**: W3까지 ERP API 미수령 시 Mock ERP 자체 구축, 실 연동 W13으로 이동
- **이유**: ERP 의존성이 전체 일정 블로커가 되지 않도록
- **상태**: 확정

## ADR-007: ISA-95 WorkOrder 상속
- **결정**: TypeScript strict 모드 + ISA-95(IEC 62264) WorkOrder 인터페이스 상속
- **이유**: ERP와 MES 간 공통 언어, 타입 안전성 확보
- **상태**: 확정

## ADR-011: 자재 코드 ERP SSOT
- **결정**: 자재 코드는 ERP_IF_MATERIAL에서만 생성. MES Admin 직접 생성 금지
- **이유**: ERP 마스터 데이터 정합성 유지
- **상태**: 확정

## ADR-012: Layer A~D 수명주기 엄격 구분
- **결정**: Layer C는 PERMANENT 트리거로 삭제 불가, Layer A는 기간 후 ARCHIVED
- **이유**: 법적 증거 보존, 스토리지 최적화
- **상태**: 확정

## ADR-013: Phase 1 팀 실적, Phase 2 자발적 개인 전환
- **결정**: Phase 1은 라인(팀) 단위 실적만. worker_id nullable. 개인 추적 강제 금지
- **이유**: 현장 저항 방지, 데이터 신뢰성 확보
- **상태**: 확정
