---
globs: packages/db/prisma/migrations/**/*.sql
description: Prisma 마이그레이션 파일 작성/수정 시 자동 참조되는 규칙
---

# Prisma Migration 규칙

> 적용 대상: `packages/db/prisma/migrations/`
> 참고: CLAUDE.md §11 Data Lifecycle — Layer C 트리거 보호

## 요약
Prisma Migrate로 PostgreSQL 스키마 변경을 관리한다.
Layer C 테이블 변경 시 삭제 방지 트리거를 반드시 재적용한다.

## 규칙

### 1. 마이그레이션 생성
```bash
cd packages/db
bunx prisma migrate dev --name "설명"
# 설명 형식: add_garment_lot | add_mfz_column | update_lot_status_enum
```

### 2. Layer C 트리거 — 마이그레이션에 포함 필수
```sql
-- Layer C 테이블 생성/변경 후 트리거 적용
CREATE OR REPLACE FUNCTION prevent_delete_permanent() RETURNS TRIGGER AS $$
BEGIN
  IF OLD.data_status = 'PERMANENT' THEN
    RAISE EXCEPTION 'PERMANENT 레코드 삭제 불가: %', OLD.id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_garment_lot
  BEFORE DELETE ON garment_lots
  FOR EACH ROW EXECUTE FUNCTION prevent_delete_permanent();

-- 모든 Layer C 테이블에 동일 적용:
-- garment_lots, line_outputs, line_daily_summaries,
-- qc_inspections, mfz_records
```

### 3. 마이그레이션 검증 규칙
- autogenerate 후 `upgrade` 내용 반드시 리뷰
- `down` 마이그레이션 작성 (롤백 가능하도록)
- Layer C 컬럼 추가 시: NOT NULL + DEFAULT 필수 (기존 행 호환)
- Layer A 아카이브 cron: 새 테이블 추가 시 cron 로직 업데이트

### 4. M6 스키마 확정 (W15)
- W15 이후 스키마 변경은 마이그레이션 비용이 급증
- W4 ERD 리뷰 → W15 최종 확정 미팅에서 컨센서스 필수
- 확정 후 변경 시 PM 승인 필요

### 5. 시드 데이터
```bash
bunx prisma db seed
# 필수 시드: 바이어(NIKE, ZARA), QC기준(DHU, AQL), 라인, 기계
```
