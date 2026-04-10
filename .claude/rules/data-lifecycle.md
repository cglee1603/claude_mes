---
globs: apps/api/src/jobs/archive*.ts,packages/db/prisma/migrations/**/*.sql
description: 데이터 수명주기(아카이브·삭제 정책) 관련 파일 작성 시 자동 참조
---

# Data Lifecycle 규칙

> 적용 대상: 아카이브 cron, DB 트리거, 마이그레이션
> 참고: CLAUDE.md §11 Data Lifecycle, ADR-012

## 요약
Layer A~D의 수명주기를 엄격히 구분한다.
Layer C는 법적 증거로 DB 트리거가 삭제를 차단한다.
아카이브는 `dataStatus` 변경이며 물리 삭제가 아니다.

## Layer별 정책

### Layer A — ERP Origin (아카이브 가능)
```typescript
// jobs/erp-archive.job.ts — 매일 자정 cron
export async function archiveExpiredOrders() {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - ARCHIVE_ORDER_DAYS)  // 180일

  await prisma.erpIfOrder.updateMany({
    where: {
      ifStatus: 'COMPLETED',
      updatedAt: { lt: cutoff },
      dataStatus: 'ACTIVE'
    },
    data: { dataStatus: 'ARCHIVED' }
  })
}

export async function archiveExpiredMaterials() {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - ARCHIVE_MATERIAL_DAYS)  // 90일

  await prisma.erpIfMaterial.updateMany({
    where: {
      currentStock: 0,
      updatedAt: { lt: cutoff },
      dataStatus: 'ACTIVE'
    },
    data: { dataStatus: 'ARCHIVED' }
  })
}
```

### Layer B — MES 자체 (관리자 삭제 가능)
```typescript
// 실적이 없는 경우만 삭제 허용
async function deleteProductionLine(lineId: string) {
  const hasOutputs = await prisma.lineOutput.count({ where: { lineId } })
  if (hasOutputs > 0)
    return { ok: false, error: { code: 'HAS_RECORDS', message: '실적 있는 라인 삭제 불가' } }

  await prisma.productionLine.delete({ where: { id: lineId } })
  return { ok: true }
}
```

### Layer C — 영구 보관 (트리거 보호)
```sql
-- 삭제 방지 트리거 (마이그레이션에 포함)
CREATE OR REPLACE FUNCTION prevent_delete_permanent()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.data_status = 'PERMANENT' THEN
    RAISE EXCEPTION 'PERMANENT 레코드 삭제 불가: id=%, table=%', OLD.id, TG_TABLE_NAME;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 5개 테이블 모두 적용
CREATE TRIGGER trg_protect_garment_lots
  BEFORE DELETE ON garment_lots FOR EACH ROW EXECUTE FUNCTION prevent_delete_permanent();
CREATE TRIGGER trg_protect_line_outputs
  BEFORE DELETE ON line_outputs FOR EACH ROW EXECUTE FUNCTION prevent_delete_permanent();
CREATE TRIGGER trg_protect_line_daily_summaries
  BEFORE DELETE ON line_daily_summaries FOR EACH ROW EXECUTE FUNCTION prevent_delete_permanent();
CREATE TRIGGER trg_protect_qc_inspections
  BEFORE DELETE ON qc_inspections FOR EACH ROW EXECUTE FUNCTION prevent_delete_permanent();
CREATE TRIGGER trg_protect_mfz_records
  BEFORE DELETE ON mfz_records FOR EACH ROW EXECUTE FUNCTION prevent_delete_permanent();
```

### Layer D — ERP 전송큐 (전송 후 90일 아카이브)
```typescript
export async function archiveExpiredQueue() {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - ERP_QUEUE_ARCHIVE_DAYS)  // 90일

  await prisma.erpLineResultQueue.updateMany({
    where: { sentStatus: 'SENT', sentAt: { lt: cutoff } },
    data: { sentStatus: 'ARCHIVED' }
  })
}
```

## Gate 검증 체크리스트
| Gate | 검증 항목 |
|------|---------|
| Gate 1 | Layer A~D 분류 서명, 트리거 5개 생성 확인 |
| Gate 3 | 트리거 동작 검증 (DELETE 시도 → 예외), 오더 완료→ARCHIVED 자동 |
| Gate 4 | 프로덕션 환경 트리거 동작 확인, 백업·복구 절차 검증 |

## Admin 화면 — 데이터 수명주기 (Admin-5)
- Layer A ACTIVE→ARCHIVED 전환 현황 표시
- 예정 아카이브 목록 (30일 이내)
- 트리거 마지막 동작 시간 표시
