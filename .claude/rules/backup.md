---
globs: apps/api/src/jobs/backup*.ts,apps/api/src/jobs/integrity*.ts,apps/api/src/routes/admin/backup*.ts
description: DB 백업·복구·무결성 체크 파일 작성/수정 시 자동 참조
---

# DB 백업 & 무결성 체크 규칙

> 적용 대상: `apps/api/src/jobs/`, `apps/api/src/services/backup.service.ts`
> 참고: CLAUDE.md §11 Data Lifecycle, data-lifecycle.md, ADR-012

## 요약
임의 데이터 삭제·손상에 대비한 3계층 백업 체계와 주간 무결성 체크를 운영한다.
Layer C(영구 기록)는 DB 트리거로 1차 보호, 백업은 2·3차 안전망이다.
Admin 화면에서 백업 상태 조회 및 수동 스냅샷 실행이 가능하다.

---

## 1. 3계층 백업 전략 (AWS RDS 기준)

| 계층 | 방식 | 주기 | 보존 기간 | 특징 |
|------|------|------|---------|------|
| **1계층** | RDS 자동 백업 (PITR) | 매일 자동 | 30일 | 5분 단위 시점 복구 가능 |
| **2계층** | RDS 수동 스냅샷 | 배포·마이그 전, 주 1회 | 무기한 | 관리자 수동 실행 가능 |
| **3계층** | pg_dump → S3 논리 백업 | 매월 1일 | 1년 | RDS 독립, 이식성 확보 |

### 1계층 — RDS 자동 백업 설정 (Terraform / CDK)
```hcl
# AWS RDS 설정 (infrastructure/)
resource "aws_db_instance" "mes_db" {
  backup_retention_period = 30          # 30일 보존 (기본값 7일에서 상향)
  backup_window           = "18:00-19:00"  # UTC (새벽 1시 KST, 비업무 시간)
  delete_automated_backups = false      # 인스턴스 삭제 시 백업 보존
}
```

### 2계층 — RDS 수동 스냅샷 Job
```typescript
// apps/api/src/jobs/rds-snapshot.job.ts
import { RDSClient, CreateDBSnapshotCommand } from '@aws-sdk/client-rds'

// 매주 일요일 02:00 KST (cron: 0 17 * * 0 UTC) + 배포 전 수동 실행 가능
export async function createWeeklySnapshot() {
  const rds = new RDSClient({ region: 'ap-southeast-1' })
  const snapshotId = `mes-weekly-${new Date().toISOString().slice(0, 10)}`

  await rds.send(new CreateDBSnapshotCommand({
    DBInstanceIdentifier: process.env.RDS_INSTANCE_ID!,
    DBSnapshotIdentifier: snapshotId,
  }))

  await prisma.backupLog.create({
    data: {
      backupType: 'RDS_SNAPSHOT',
      snapshotId,
      status: 'COMPLETED',
      triggeredBy: 'CRON',
      createdAt: new Date(),
    }
  })
}
```

### 3계층 — pg_dump → S3 논리 백업
```typescript
// apps/api/src/jobs/logical-backup.job.ts
import { execSync } from 'child_process'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { createReadStream } from 'fs'

// 매월 1일 03:00 KST (cron: 0 18 1 * * UTC)
export async function createMonthlyLogicalBackup() {
  const date = new Date().toISOString().slice(0, 7)  // "2026-04"
  const filename = `/tmp/mes-backup-${date}.sql.gz`

  // pg_dump 실행 (gzip 압축)
  execSync(
    `pg_dump ${process.env.DATABASE_URL} | gzip > ${filename}`,
    { timeout: 30 * 60 * 1000 }  // 30분 타임아웃
  )

  // S3 업로드
  const s3 = new S3Client({ region: 'ap-southeast-1' })
  await s3.send(new PutObjectCommand({
    Bucket: process.env.BACKUP_S3_BUCKET!,
    Key: `logical/${date}/mes-backup.sql.gz`,
    Body: createReadStream(filename),
    ServerSideEncryption: 'AES256',
  }))

  await prisma.backupLog.create({
    data: { backupType: 'LOGICAL_DUMP', status: 'COMPLETED', triggeredBy: 'CRON' }
  })
}
```

---

## 2. 무결성 체크 Job

```typescript
// apps/api/src/jobs/integrity-check.job.ts
// 매주 월요일 04:00 KST (cron: 0 19 * * 0 UTC)

export async function runIntegrityCheck(): Promise<IntegrityReport> {
  const issues: IntegrityIssue[] = []

  // ① Layer C 레코드 수 변동 감지 (전주 대비 감소 시 경고)
  const counts = {
    garmentLots:      await prisma.garmentLot.count({ where: { dataStatus: 'PERMANENT' } }),
    lineOutputs:      await prisma.lineOutput.count({ where: { dataStatus: 'PERMANENT' } }),
    qcInspections:    await prisma.qcInspection.count({ where: { dataStatus: 'PERMANENT' } }),
    mfzRecords:       await prisma.mfzRecord.count({ where: { dataStatus: 'PERMANENT' } }),
  }

  const prev = await prisma.integrityCheckResult.findFirst({ orderBy: { createdAt: 'desc' } })
  if (prev) {
    for (const [table, count] of Object.entries(counts)) {
      const prevCount = prev.recordCounts[table] ?? 0
      if (count < prevCount) {
        issues.push({
          severity: 'CRITICAL',
          table,
          message: `PERMANENT 레코드 감소 감지: ${prevCount} → ${count} (${prevCount - count}건 누락)`,
        })
      }
    }
  }

  // ② 고아(orphan) 레코드 감지
  const orphanOutputs = await prisma.$queryRaw<{ count: number }[]>`
    SELECT COUNT(*) as count FROM line_outputs lo
    WHERE NOT EXISTS (SELECT 1 FROM garment_lots gl WHERE gl.id = lo.lot_id)
  `
  if (orphanOutputs[0].count > 0) {
    issues.push({ severity: 'HIGH', table: 'line_outputs', message: `고아 레코드 ${orphanOutputs[0].count}건` })
  }

  // ③ MFZ_HOLD LOT 중 mfz_records 없는 케이스
  const mfzHoldNoRecord = await prisma.$queryRaw<{ count: number }[]>`
    SELECT COUNT(*) as count FROM garment_lots gl
    WHERE gl.lot_status = 'MFZ_HOLD'
    AND NOT EXISTS (SELECT 1 FROM mfz_records mr WHERE mr.lot_id = gl.id)
  `
  if (mfzHoldNoRecord[0].count > 0) {
    issues.push({ severity: 'CRITICAL', table: 'garment_lots', message: `MFZ_HOLD LOT 중 기록 없음: ${mfzHoldNoRecord[0].count}건` })
  }

  const report: IntegrityReport = {
    checkedAt: new Date(),
    recordCounts: counts,
    issues,
    status: issues.some(i => i.severity === 'CRITICAL') ? 'CRITICAL'
           : issues.some(i => i.severity === 'HIGH')    ? 'WARNING'
           : 'OK',
  }

  await prisma.integrityCheckResult.create({ data: report })

  // CRITICAL 발생 시 Slack/이메일 알림 (알림 서비스 연동)
  if (report.status === 'CRITICAL') {
    await notifyAdmin('DB 무결성 체크 CRITICAL', issues)
  }

  return report
}
```

---

## 3. Prisma 스키마 추가 (packages/db/prisma/schema.prisma)

```prisma
// Layer B — 백업 로그 (관리자 조회용)
model BackupLog {
  id          String   @id @default(uuid())
  backupType  String   // 'RDS_SNAPSHOT' | 'LOGICAL_DUMP' | 'MANUAL_SNAPSHOT'
  snapshotId  String?
  status      String   // 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  triggeredBy String   // 'CRON' | 'ADMIN:{userId}'
  fileSize    BigInt?  // bytes
  errorMessage String?
  createdAt   DateTime @default(now())
  @@map("backup_logs")
}

model IntegrityCheckResult {
  id           String   @id @default(uuid())
  checkedAt    DateTime
  recordCounts Json     // { garmentLots: N, lineOutputs: N, ... }
  issues       Json     // IntegrityIssue[]
  status       String   // 'OK' | 'WARNING' | 'CRITICAL'
  @@map("integrity_check_results")
}
```

---

## 4. 환경변수 추가 (apps/api/src/config/env.ts)

```typescript
const EnvSchema = z.object({
  // ... 기존 항목 ...
  RDS_INSTANCE_ID:  z.string().optional(),   // RDS 스냅샷용
  BACKUP_S3_BUCKET: z.string().optional(),   // S3 논리 백업 버킷
  ADMIN_ALERT_EMAIL: z.string().email().optional(),  // CRITICAL 알림
})
```

---

## 5. Admin 화면 — 백업 관리 (Admin-B)

| 기능 | 설명 |
|------|------|
| 백업 현황 조회 | 최근 백업 이력 (계층별, 상태, 크기) |
| 수동 스냅샷 실행 | 배포 전 관리자가 즉시 RDS 스냅샷 트리거 |
| 무결성 체크 결과 | 최근 체크 결과, CRITICAL/WARNING 항목 강조 |
| 복구 가이드 | 계층별 복구 절차 문서 링크 (운영 매뉴얼) |

---

## 6. 규칙 요약

- 배포·마이그레이션 전 수동 스냅샷 필수 (`triggeredBy: 'ADMIN:{userId}'` 기록)
- 무결성 체크 CRITICAL 발생 시 즉시 관리자 알림 후 배포 중단
- pg_dump 실행 시 `DATABASE_URL` 직접 노출 금지 — 환경변수 경유
- 백업 파일 S3 업로드 시 서버사이드 암호화 (`AES256`) 필수
- Layer C 레코드 수 감소는 항상 CRITICAL (트리거 우회 가능성)
