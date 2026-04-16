import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader, StatusBadge } from '@/components/common'
import { Shield, ChevronDown, Save, Users, Building2, UserCog } from 'lucide-react'
import { UserDeptAssignment, INITIAL_DEPARTMENTS } from './AdminPermissionUserDept'

/* ── 목업 데이터 ─────────────────────────────────── */
const ROLES = ['factory_manager', 'line_manager', 'qc_inspector', 'warehouse', 'admin'] as const
type RoleCode = typeof ROLES[number]

const ROLE_I18N_KEY: Record<RoleCode, string> = {
  factory_manager: 'admin.permission.role.factory_manager',
  line_manager:    'admin.permission.role.line_manager',
  qc_inspector:    'admin.permission.role.qc_inspector',
  warehouse:       'admin.permission.role.warehouse',
  admin:           'admin.permission.role.admin',
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

type Dept = { id: string; code: string; name: string; userCount?: number }

const MOCK_DEPARTMENTS: Dept[] = [
  ...INITIAL_DEPARTMENTS.map((d, i) => ({
    ...d,
    userCount: [42, 12, 8, 5, 1][i] ?? 0,
  })),
]

type ViewMode = 'role' | 'department'

const ALL_GROUPS = '_ALL_'

/* ── 역할별 권한 매트릭스 ─────────────────────────── */
function RolePermissionMatrix() {
  const { t } = useTranslation()
  const [screens, setScreens] = useState(SCREENS)
  const [saved, setSaved] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(ALL_GROUPS)

  const groups = [ALL_GROUPS, ...Array.from(new Set(SCREENS.map(s => s.group)))]

  function togglePerm(screenCode: string, role: RoleCode, action: Action) {
    setScreens(prev => prev.map(s => {
      if (s.screenCode !== screenCode) return s
      return { ...s, perms: { ...s.perms, [role]: { ...s.perms[role], [action]: !s.perms[role][action] } } }
    }))
  }

  // 현재 필터된 화면 기준으로 해당 컬럼 전체 토글
  // 모두 체크 → 전체 해제 / 하나라도 미체크 → 전체 체크
  function toggleColumn(role: RoleCode, action: Action) {
    const target = selectedGroup === ALL_GROUPS ? screens : screens.filter(s => s.group === selectedGroup)
    const allChecked = target.every(s => s.perms[role][action])
    const targetCodes = new Set(target.map(s => s.screenCode))
    setScreens(prev => prev.map(s => {
      if (!targetCodes.has(s.screenCode)) return s
      return { ...s, perms: { ...s.perms, [role]: { ...s.perms[role], [action]: !allChecked } } }
    }))
  }

  function isColumnAllChecked(role: RoleCode, action: Action) {
    const target = selectedGroup === ALL_GROUPS ? screens : screens.filter(s => s.group === selectedGroup)
    return target.length > 0 && target.every(s => s.perms[role][action])
  }

  function isColumnPartialChecked(role: RoleCode, action: Action) {
    const target = selectedGroup === ALL_GROUPS ? screens : screens.filter(s => s.group === selectedGroup)
    return target.some(s => s.perms[role][action]) && !target.every(s => s.perms[role][action])
  }

  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 3000) }

  const filtered = selectedGroup === ALL_GROUPS ? screens : screens.filter(s => s.group === selectedGroup)

  return (
    <div className="space-y-4">
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg">
          {t('admin.permission.roleSaved')}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {groups.map(g => (
            <button key={g} type="button" onClick={() => setSelectedGroup(g)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                selectedGroup === g ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-500 hover:bg-gray-100'
              }`}>
              {g === ALL_GROUPS ? t('common.all') : g}
            </button>
          ))}
        </div>
        <button type="button" onClick={handleSave} className="btn-primary flex items-center gap-1.5 text-sm">
          <Save className="w-4 h-4" />{t('common.save')}
        </button>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-700 w-28">{t('admin.permission.screenCode')}</th>
              <th className="text-left px-3 py-3 font-semibold text-gray-700 w-36">{t('admin.permission.screenName')}</th>
              {ROLES.map(r => (
                <th key={r} colSpan={ACTIONS.length} className="text-center px-2 py-3 font-semibold text-gray-700 border-l border-gray-200">
                  {t(ROLE_I18N_KEY[r])}
                </th>
              ))}
            </tr>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th colSpan={2} />
              {ROLES.map(r => ACTIONS.map(a => {
                const allChecked     = isColumnAllChecked(r, a)
                const partialChecked = isColumnPartialChecked(r, a)
                return (
                  <th key={`${r}-${a}`} className="text-center py-1.5 border-l first:border-l-gray-200 border-l-gray-100 w-10">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-gray-500 font-medium text-[10px]">{a.slice(0, 1)}</span>
                      <button
                        type="button"
                        onClick={() => toggleColumn(r, a)}
                        title={t('admin.permission.toggleColumn', { role: t(ROLE_I18N_KEY[r]), action: a })}
                        className={`w-4 h-4 rounded transition-colors border ${
                          allChecked
                            ? 'bg-green-500 border-green-500 hover:bg-green-600'
                            : partialChecked
                            ? 'bg-yellow-400 border-yellow-400 hover:bg-yellow-500'
                            : 'bg-white border-gray-300 hover:border-primary-400 hover:bg-primary-50'
                        }`}
                      />
                    </div>
                  </th>
                )
              }))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(screen => (
              <tr key={screen.screenCode} className="hover:bg-gray-50">
                <td className="px-4 py-2.5"><span className="font-mono text-gray-600 text-xs">{screen.screenCode}</span></td>
                <td className="px-3 py-2.5 text-gray-800">{screen.screenName}</td>
                {ROLES.map(r => ACTIONS.map(a => (
                  <td key={`${r}-${a}`} className="text-center py-2.5 border-l border-gray-100">
                    <button type="button" onClick={() => togglePerm(screen.screenCode, r, a)}
                      className={`w-5 h-5 rounded transition-colors mx-auto block ${
                        screen.perms[r][a] ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      title={`${t(ROLE_I18N_KEY[r])} — ${a}`}
                    />
                  </td>
                )))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100 flex gap-4">
          <span>V=VIEW &nbsp;C=CREATE &nbsp;U=UPDATE &nbsp;D=DELETE &nbsp;E=EXPORT</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block" /> {t('admin.permission.allowed')}</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200 inline-block" /> {t('admin.permission.denied')}</span>
        </div>
      </div>
    </div>
  )
}

/* ── 부서 관리 탭 ────────────────────────────────── */
function DepartmentManager({ depts, setDepts }: {
  depts: Dept[]
  setDepts: React.Dispatch<React.SetStateAction<Dept[]>>
}) {
  const { t } = useTranslation()
  const [showAdd, setShowAdd] = useState(false)
  const [newCode, setNewCode] = useState('')
  const [newName, setNewName] = useState('')

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
                {t('admin.permission.userCount', { count: dept.userCount ?? 0 })}
              </span>
              <StatusBadge status="ACTIVE" label={t('admin.permission.active')} />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.permission.deptCode')}</label>
              <input type="text" value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())}
                className="input w-full" placeholder={t('admin.permission.deptCodePlaceholder')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.permission.deptName')}</label>
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
                className="input w-full" placeholder={t('admin.permission.deptNamePlaceholder')} />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setShowAdd(false); setNewCode(''); setNewName('') }}
                className="btn-secondary text-sm">{t('common.cancel')}</button>
              <button type="button"
                disabled={!newCode.trim() || !newName.trim()}
                onClick={() => {
                  setDepts(prev => [...prev, {
                    id: `D${String(Date.now()).slice(-4)}`,
                    code: newCode.trim(),
                    name: newName.trim(),
                    userCount: 0,
                  }])
                  setShowAdd(false); setNewCode(''); setNewName('')
                }}
                className="btn-primary text-sm disabled:opacity-50">{t('common.save')}</button>
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
  const [depts, setDepts] = useState(MOCK_DEPARTMENTS)

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
      {tab === 'department' && <DepartmentManager depts={depts} setDepts={setDepts} />}
      {tab === 'userDept'   && <UserDeptAssignment departments={depts} />}
    </div>
  )
}
