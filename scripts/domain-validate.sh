#!/bin/bash
# Forbidden Pattern 자동 검사 — PR마다 실행
# CRITICAL > 0 시 exit 1 (CI 차단)

CRITICAL=0
HIGH=0
MEDIUM=0

echo "=== @domain-validator ==="

# C-1: AQL/DHU 임계값 하드코딩
COUNT=$(grep -rn "dhu > [0-9]\|aql.*[0-9]\." apps/ packages/ --include="*.ts" | grep -v "\.test\.\|mock\|spec" | wc -l)
[ "$COUNT" -gt 0 ] && echo "[C-1] CRITICAL: AQL/DHU 하드코딩 $COUNT건" && CRITICAL=$((CRITICAL+COUNT))

# C-2: 임금 계산 금지
COUNT=$(grep -rn "hourlyRate\|\.wage\b\|\.salary\b" apps/api/src/services/ --include="*.ts" | wc -l)
[ "$COUNT" -gt 0 ] && echo "[C-2] CRITICAL: 임금 계산 로직 $COUNT건" && CRITICAL=$((CRITICAL+COUNT))

# C-3: Service에서 Prisma 직접 접근
COUNT=$(grep -rn "this\.prisma\." apps/api/src/services/ --include="*.ts" | grep -v "\.test\." | wc -l)
[ "$COUNT" -gt 0 ] && echo "[C-3] CRITICAL: Service Prisma 직접 접근 $COUNT건" && CRITICAL=$((CRITICAL+COUNT))

# C-5: Service 순환 의존 (간이 검사)
COUNT=$(grep -rn "import.*CuttingService" apps/api/src/services/material* --include="*.ts" 2>/dev/null | wc -l)
[ "$COUNT" -gt 0 ] && echo "[C-5] CRITICAL: Service 순환 의존 의심 $COUNT건" && CRITICAL=$((CRITICAL+COUNT))

# C-7: MFZ_HOLD 여러 곳 변경
COUNT=$(grep -rn "MFZ_HOLD" apps/api/src/services/ --include="*.ts" | grep -v "finishing\|\.test\." | wc -l)
[ "$COUNT" -gt 0 ] && echo "[C-7] CRITICAL: MFZ_HOLD 유일 진입점 위반 의심 $COUNT건" && CRITICAL=$((CRITICAL+COUNT))

# M-3: FOUR_POINT_THRESHOLD 대신 28 직접 사용
COUNT=$(grep -rn "\b28\b" apps/api/src/ --include="*.ts" | grep -i "point\|inspect\|fabric" | grep -v "THRESHOLD\|test\|mock" | wc -l)
[ "$COUNT" -gt 0 ] && echo "[M-3] MEDIUM: 4점법 28 하드코딩 의심 $COUNT건" && MEDIUM=$((MEDIUM+COUNT))

# M-4: 릴렉싱 시간 하드코딩
COUNT=$(grep -rn "\b48\b\|\b72\b\|\b24\b" apps/api/src/ --include="*.ts" | grep -i "relax" | grep -v "HOURS\|test\|mock" | wc -l)
[ "$COUNT" -gt 0 ] && echo "[M-4] MEDIUM: 릴렉싱 시간 하드코딩 의심 $COUNT건" && MEDIUM=$((MEDIUM+COUNT))

echo ""
echo "결과: CRITICAL=$CRITICAL HIGH=$HIGH MEDIUM=$MEDIUM"

if [ "$CRITICAL" -gt 0 ]; then
  echo "FAIL: CRITICAL 패턴 발견 — 머지 차단"
  exit 1
fi

echo "PASS"
exit 0
