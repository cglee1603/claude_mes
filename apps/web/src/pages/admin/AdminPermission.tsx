import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader, StatusBadge } from '@/components/common'
import { Shield, ChevronDown, Save, Users, Building2, UserCog } from 'lucide-react'
import { UserDeptAssignment } from './AdminPermissionUserDept'

/* ── 목업 데이터 ─────────────────────────────────── */
const ROLES = ['factory_manager', 'line_manager', 'qc_inspector', 'warehouse', 'admin'] as const
type RoleCode = typeof ROLES[number]

const ROLE_LABEL: Record<RoleCode, string> = {
  factory_manager: '공장장',
  line_manager:    '라인장',
  qc_inspector:   'QC 검사원',
  warehouse:       '창고 담당',
  admin:           '관리자',
}

const ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT'] as const
type Action = typeof ACTIONS[number]

interface ScreenPerm {
  screenCode: string
  screenName: string
  group: string
  perms: Record<RoleCode, Record<Action, boolean>>
}

const SCREENS: ScreenPerm[] = [
  {
    screenCode: 'WH-01', screenName: '원단 입고',  group: '창고',
    perms: { factory_manager: { VIEW: true, CREATE: false, UPDATE: false, DELETE: false, EXPORT: true },
             line_manager:    { VIEW: true, CREATE: false, UPDATE: false, DELETE: false, EXPORT: false },
             qc_inspector:    { VIEW: true, CREATE: false, UPDATE: false, DELETE: false, EXPORT: false },
             warehouse:       { VIEW: true, CREATE: true,  UPDATE: true,  DELETE: false, EXPORT: true },
             admin:           { VIEW: true, CREATE: true,  UPDATE: true,  DELETE: true,  EXPORT: true } },
  },
  {
    screenCode: 'SW-17', screenName: '팀 실적 입력', group: '봉제',
    perms: { factory_manager: { VIEW: true, CREATE: false, UPDATE: false, DELETE: false, EXPORT: true },
             line_manager:    { VIEW: true, CREATE: true,  UPDATE: true,  DELETE: false, EXPORT: false },
             qc_inspector:    { VIEW: false, CREATE: false, UPDATE: false, DELETE: false, EXPORT: false },
             warehouse:       { VIEW: false, CREATE: false, UPDATE: false, DELETE: false, EXPORT: false },
             admin:           { VIEW: true, CREATE: true,  UPDATE: true,  DELETE: true,  EXPORT: true } },
  },
  {
    screenCode: 'QC-25', screenName: '인라인 검사', group: '품질',
    perms: { factory_manager: { VIEW: true, CREATE: false, UPDATE: false, DELETE: false, EXPORT: true },
             line_manager:    { VIEW: true, CREATE: false, UPDATE: false, DELETE: false, EXPORT: false },
             qc_inspector:    { VIEW: true, CREATE: true,  UPDATE: true,  DELETE: false, EXPORT: true },
             warehouse:       { VIEW: false, CREATE: false, UPDATE: false, DELETE: false, EXPORT: false },
             admin:           { VIEW: true, CREATE: true,  UPDATE: true,  DELETE: true,  EXPORT: true } },
  },
  {
    screenCode: 'AD-23', screenName: '공장장 대시보드', group: '분석',
    perms: { factory_manager: { VIEW: true, CREATE: false, UPDATE: false, DELETE: false, EXPORT: true },
             line_manager:    { VIEW: false, CREATE: false, UPDATE: false, DELETE: false, EXPORT: false },
             qc_inspector:    { VIEW: false, CREATE: false, UPDATE: false, DELETE: false, EXPORT: false },
             warehouse:       { VIEW: false, CREATE: false, UPDATE: false, DELETE: false, EXPORT: false },
             admin:           { VIEW: true, CREATE: true,  UPDATE: true,  DELETE: true,  EXPORT: true } },
  },
]

const MOCK_DEPARTMENTS = [
  { id: 'D001', code: 'PRODUCTION', name: '생산부', userCount: 42 },
  { id: 'D002', code: 'QC',         name: '품질관리부', userCount: 12 },
  { id: 'D003', code: 'WAREHOUSE',  name: '자재창고부', userCount: 8 },
  { id: 'D004', code: 'ADMIN',      name: '관리부', userCount: 5 },
]

type ViewMode = 'role' | 'department'

/* ── 역할별 권한 매트릭스 ─────────────────────────── */
function RolePermissionMatrix() {
  const { t } = useTranslation()
  const [screens, setScreens] = useState(SCREENS)
  const [saved, setSaved] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string>('전체')

  const groups = ['전체', ...Array.from(new Set(SCREENS.map(s => s.group)))]

  function togglePerm(screenCode: string, role: RoleCode, action: Action) {
    setScreens(prev => prev.map(s => {
      if (s.screenCode !== screenCode) return s
      return {
        ...s,
        perms: {
          ...s.perms,
          [role]: { ...s.perms[role], [action]: !s.perms[role][action] },
        },
      }
    }))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const filtered = selectedGroup === '전체' ? screens : screens.filter(s => s.group === selectedGroup)

  return (
    <div className="space-y-4">
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg">
          권한 설정이 저장되었습니다.
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {groups.map(g => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGroup(g)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                selectedGroup === g
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <button type="button" onClick={handleSave} className="btn-primary flex items-center gap-1.5 text-sm">
          <Save className="w-4 h-4" />
          {t('common.save')}
        </button>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-700 w-28">화면 코드</th>
              <th className="text-left px-3 py-3 font-semibold text-gray-700 w-36">화면명</th>
              {ROLES.map(r => (
                <th key={r} colSpan={ACTIONS.length} className="text-center px-2 py-3 font-semibold text-gray-700 border-l border-gray-200">
                  {ROLE_LABEL[r]}
                </th>
              ))}
            </tr>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th colSpan={2} />
              {ROLES.map(r =>
                ACTIONS.map(a => (
                  <th key={`${r}-${a}`} className="text-center py-1.5 text-gray-500 font-medium border-l first:border-l-gray-200 border-l-gray-100 w-10">
                    {a.slice(0, 1)}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(screen => (
              <tr key={screen.screenCode} className="hover:bg-gray-50">
                <td className="px-4 py-2.5">
                  <span className="font-mono text-gray-600 text-xs">{screen.screenCode}</span>
                </td>
                <td className="px-3 py-2.5 text-gray-800">{screen.screenName}</td>
                {ROLES.map(r =>
                  ACTIONS.map(a => (
                    <td key={`${r}-${a}`} className="text-center py-2.5 border-l border-gray-100">
                      <button
                        type="button"
                        onClick={() => togglePerm(screen.screenCode, r, a)}
                        className={`w-5 h-5 rounded transition-colors mx-auto block ${
                          screen.perms[r][a]
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        title={`${ROLE_LABEL[r]} — ${a}`}
                      />
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100 flex gap-4">
          <span>V=VIEW &nbsp;C=CREATE &nbsp;U=UPDATE &nbsp;D=DELETE &nbsp;E=EXPORT</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block" /> 허용</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200 inline-block" /> 거부</span>
        </div>
      </div>
    </div>
  )
}

/* ── 부서 관리 탭 ────────────────────────────────── */
function DepartmentManager() {
  const { t } = useTranslation()
  const [depts, setDepts] = useState(MOCK_DEPARTMENTS)
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="space-y-4 max-w-xl">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="btn-primary text-sm"
        >
          + {t('admin.permission.addDept')}
        </button>
      </div>

      <div className="card divide-y divide-gray-100 p-0">
        {depts.map(dept => (
          <div key={dept.id} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                <p className="text-xs text-gray-400 font-mono">{dept.code}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {dept.userCount}명
              </span>
              <StatusBadge status="ACTIVE" label="활성" />
              <button type="button" className="text-sm text-blue-600 hover:underline">
                {t('common.edit')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 부서 추가 모달 */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">{t('admin.permission.addDept')}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">부서 코드</label>
              <input type="text" className="input w-full" placeholder="예) CUTTING" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">부서명</label>
              <input type="text" className="input w-full" placeholder="예) 재단부" />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary text-sm">
                {t('common.cancel')}
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="btn-primary text-sm">
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── 메인 컴포넌트 ───────────────────────────────── */
type PermTabKey = 'role' | 'department' | 'userDept'

const TAB_META: { key: PermTabKey; icon: React.ReactNode; labelKey: string }[] = [
  { key: 'role',       icon: <Shield className="w-4 h-4" />,   labelKey: 'admin.permission.roleTab' },
  { key: 'department', icon: <Building2 className="w-4 h-4" />, labelKey: 'admin.permission.deptTab' },
  { key: 'userDept',   icon: <UserCog className="w-4 h-4" />,  labelKey: 'admin.permission.userDeptTab' },
]

export function AdminPermissionPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<PermTabKey>('role')

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.permission.title')}
        subtitle={t('admin.permission.subtitle')}
      />

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-sm text-amber-700 flex items-center gap-2">
        <Shield className="w-4 h-4 flex-shrink-0" />
        {t('admin.permission.notice')}
      </div>

      {/* 탭 */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 -mb-px">
          {TAB_META.map(({ key, icon, labelKey }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {icon}
              {t(labelKey)}
            </button>
          ))}
        </nav>
      </div>

      {tab === 'role'       && <RolePermissionMatrix />}
      {tab === 'department' && <DepartmentManager />}
      {tab === 'userDept'   && <UserDeptAssignment />}
    </div>
  )
}
