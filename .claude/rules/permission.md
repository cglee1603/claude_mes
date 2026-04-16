---
globs: apps/api/src/middleware/permission*.ts,apps/api/src/repositories/permission*.ts,apps/api/src/services/permission*.ts,packages/db/prisma/schema.prisma
description: 권한 관리(부서/사용자/화면 단위) 파일 작성/수정 시 자동 참조
---

# Permission (권한 관리) 규칙

> 적용 대상: `apps/api/src/middleware/permission.ts`, `apps/api/src/services/permission.service.ts`
> 참고: CLAUDE.md §5 Service Boundaries, middleware.md §4·§5

## 요약
화면(Screen) 단위 권한을 DB에서 동적으로 관리한다.
권한 결정 우선순위: **사용자 개별 오버라이드 > 부서 > 역할 > 기본(거부)**.
권한 기준(역할·부서 구조)은 차후 확정 예정이므로 권한 값은 코드에 하드코딩하지 않고
DB `screen_permissions` 테이블을 단일 진실 원천으로 사용한다.

---

## 1. 권한 계층 모델

```
User (사용자)
 ├── Role (역할)            — factory_manager, line_manager, qc_inspector, warehouse, admin + 추후 추가
 ├── Department (부서)      — Layer B 엔티티, 관리자 추가/수정 가능
 └── UserPermission         — 개별 오버라이드 (GRANT / DENY)
```

### 권한 결정 순서 (resolvePermission)
```
1. UserPermission.granted = false (DENY) → 즉시 거부
2. UserPermission.granted = true  (GRANT) → 즉시 허용
3. DepartmentPermission.granted   → 부서 설정 적용
4. RolePermission.granted         → 역할 설정 적용
5. 기본값                         → DENY (거부)
```

---

## 2. Prisma 스키마 (packages/db/prisma/schema.prisma 에 추가)

```prisma
// Layer B — 부서 (관리자 삭제 가능, 소속 사용자 없을 때만)
model Department {
  id          String              @id @default(uuid())
  code        String              @unique  // "PRODUCTION", "QC", "WAREHOUSE" 등
  name        String
  isActive    Boolean             @default(true)
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt
  users       UserDepartment[]
  permissions DepartmentPermission[]
  @@map("departments")
}

model UserDepartment {
  userId       String
  departmentId String
  isPrimary    Boolean    @default(true)   // 주 소속 부서
  department   Department @relation(fields: [departmentId], references: [id])
  @@id([userId, departmentId])
  @@map("user_departments")
}

// 화면 권한 정의 테이블 (관리자가 화면 등록)
model ScreenPermission {
  id          String   @id @default(uuid())
  screenCode  String   // "WH-01", "SC-07", "AD-23" 등 33개 화면 코드
  action      String   // "VIEW" | "CREATE" | "UPDATE" | "DELETE" | "EXPORT"
  description String?
  createdAt   DateTime @default(now())

  rolePerms   RolePermission[]
  deptPerms   DepartmentPermission[]
  userPerms   UserPermission[]

  @@unique([screenCode, action])
  @@map("screen_permissions")
}

// 역할 단위 권한
model RolePermission {
  roleCode          String
  screenPermissionId String
  granted           Boolean
  updatedAt         DateTime @updatedAt

  screenPermission  ScreenPermission @relation(fields: [screenPermissionId], references: [id])
  @@id([roleCode, screenPermissionId])
  @@map("role_permissions")
}

// 부서 단위 권한 (역할 설정 오버라이드 가능)
model DepartmentPermission {
  departmentId      String
  screenPermissionId String
  granted           Boolean
  updatedAt         DateTime @updatedAt

  department        Department       @relation(fields: [departmentId], references: [id])
  screenPermission  ScreenPermission @relation(fields: [screenPermissionId], references: [id])
  @@id([departmentId, screenPermissionId])
  @@map("department_permissions")
}

// 사용자 개별 오버라이드 (최우선)
model UserPermission {
  userId            String
  screenPermissionId String
  granted           Boolean   // true=GRANT, false=DENY
  reason            String?   // 관리자 메모
  updatedAt         DateTime  @updatedAt

  screenPermission  ScreenPermission @relation(fields: [screenPermissionId], references: [id])
  @@id([userId, screenPermissionId])
  @@map("user_permissions")
}
```

---

## 3. 권한 결정 미들웨어

```typescript
// apps/api/src/middleware/permission.ts
import type { RequestHandler } from 'express'
import { PermissionService } from '../services/permission.service'

export const requirePermission = (
  screenCode: string,
  action: 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT'
): RequestHandler => async (req, res, next) => {
  const userId    = req.user?.id
  const roleCode  = req.user?.role
  const deptIds   = req.user?.departmentIds ?? []

  const allowed = await PermissionService.resolve({ userId, roleCode, deptIds, screenCode, action })
  if (!allowed)
    return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: '접근 권한이 없습니다' } })
  next()
}
```

```typescript
// apps/api/src/services/permission.service.ts
export class PermissionService {
  static async resolve(params: {
    userId: string
    roleCode: string
    deptIds: string[]
    screenCode: string
    action: string
  }): Promise<boolean> {
    const sp = await prisma.screenPermission.findUnique({
      where: { screenCode_action: { screenCode: params.screenCode, action: params.action } },
      include: {
        userPerms: { where: { userId: params.userId } },
        deptPerms: { where: { departmentId: { in: params.deptIds } } },
        rolePerms: { where: { roleCode: params.roleCode } },
      }
    })
    if (!sp) return false  // 등록되지 않은 화면 → 기본 거부

    // 1. 사용자 개별 오버라이드 (DENY 우선)
    const userPerm = sp.userPerms[0]
    if (userPerm) return userPerm.granted

    // 2. 부서 권한 (DENY 있으면 우선)
    const denyDept = sp.deptPerms.find(p => !p.granted)
    if (denyDept) return false
    const grantDept = sp.deptPerms.find(p => p.granted)
    if (grantDept) return true

    // 3. 역할 권한
    const rolePerm = sp.rolePerms[0]
    if (rolePerm) return rolePerm.granted

    return false  // 기본 거부
  }
}
```

---

## 4. 라우터 적용 패턴

```typescript
// 기존 authenticate(인증) → requirePermission(권한) 순서로 적용
app.use('/api/production',
  authenticate,
  requirePermission('SW-17', 'CREATE'),
  productionRouter
)

app.get('/api/analytics/factory-kpi',
  authenticate,
  requirePermission('AD-23', 'VIEW'),
  analyticsController.getFactoryKpi
)
```

---

## 5. Admin 화면 — 권한 관리 (Admin-P)

| 기능 | 설명 |
|------|------|
| 화면 권한 매트릭스 | 33개 화면 × 5개 액션 × 역할/부서/사용자 Grid 표시 |
| 부서 관리 | 부서 CRUD, 소속 사용자 배정 |
| 역할 권한 설정 | roleCode별 screenCode·action 권한 토글 |
| 부서 권한 오버라이드 | 부서별 권한 설정 (역할 설정 우선 덮어쓰기) |
| 사용자 권한 오버라이드 | 사용자 개별 GRANT/DENY + 사유 기록 |
| 권한 감사 로그 | 권한 변경 이력 (변경자, 변경 시각, 변경 전/후) |

---

## 6. 시드 데이터 (초기 권한 설정)

```typescript
// packages/db/prisma/seed.ts — 초기 역할 권한 시드
const defaultRolePermissions = [
  // factory_manager: 전체 VIEW + 분석 화면
  { roleCode: 'factory_manager', screenCode: 'AD-23', action: 'VIEW', granted: true },
  { roleCode: 'factory_manager', screenCode: 'AD-24', action: 'VIEW', granted: true },
  // line_manager: 봉제 실적 입력
  { roleCode: 'line_manager', screenCode: 'SW-17', action: 'CREATE', granted: true },
  { roleCode: 'line_manager', screenCode: 'SW-18', action: 'CREATE', granted: true },
  // ... 33개 화면 × 역할 초기값 (차후 확정 시 이 시드 파일 업데이트)
]
// ⚠️ 권한 기준은 차후 확정 예정 — 시드값은 임시, 운영 전 Admin 화면에서 재설정 필수
```

---

## 7. 규칙 요약

- 권한 값 코드 하드코딩 금지 — DB `screen_permissions` 단일 진실 원천
- 모든 API 라우터: `authenticate` → `requirePermission` 순서 필수
- 권한 변경은 `Admin-P` 화면에서만 (직접 DB 수정 금지)
- 부서·역할 구조는 차후 확정 예정 — 스키마는 유연하게 설계됨
