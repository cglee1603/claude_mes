import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Save, UserCircle2, ChevronDown } from 'lucide-react'

/* ── 목업 데이터 ─────────────────────────────────── */
const MOCK_DEPARTMENTS = [
  { id: 'D001', code: 'PRODUCTION', name: '생산부' },
  { id: 'D002', code: 'QC',         name: '품질관리부' },
  { id: 'D003', code: 'WAREHOUSE',  name: '자재창고부' },
  { id: 'D004', code: 'ADMIN',      name: '관리부' },
]

const ROLE_LABEL: Record<string, string> = {
  factory_manager: '공장장',
  line_manager:    '라인장',
  qc_inspector:    'QC 검사원',
  warehouse:       '창고 담당',
  admin:           '관리자',
}

interface MockUser {
  id: string
  name: string
  email: string
  role: string
  deptId: string | null
}

const MOCK_USERS: MockUser[] = [
  { id: 'U001', name: '김철수', email: 'cskim@factory.com',   role: 'factory_manager', deptId: 'D004' },
  { id: 'U002', name: '이영희', email: 'yhlee@factory.com',   role: 'line_manager',    deptId: 'D001' },
  { id: 'U003', name: '박민준', email: 'mjpark@factory.com',  role: 'line_manager',    deptId: 'D001' },
  { id: 'U004', name: '최수진', email: 'sjchoi@factory.com',  role: 'qc_inspector',    deptId: 'D002' },
  { id: 'U005', name: '정대호', email: 'dhjeong@factory.com', role: 'qc_inspector',    deptId: 'D002' },
  { id: 'U006', name: 'Nguyen Van A', email: 'nva@factory.com', role: 'warehouse',     deptId: 'D003' },
  { id: 'U007', name: 'Tran Thi B',   email: 'ttb@factory.com', role: 'warehouse',     deptId: 'D003' },
  { id: 'U008', name: '홍길동', email: 'gdhong@factory.com',  role: 'admin',           deptId: 'D004' },
]

const ROLE_FILTER_OPTIONS = ['전체', ...Object.keys(ROLE_LABEL)]

/* ── 사용자별 부서 설정 컴포넌트 ─────────────────── */
export function UserDeptAssignment() {
  const { t } = useTranslation()
  const [users, setUsers] = useState<MockUser[]>(MOCK_USERS)
  const [filterRole, setFilterRole] = useState('전체')
  const [filterDept, setFilterDept] = useState('전체')
  const [saved, setSaved] = useState(false)
  const [changed, setChanged] = useState<Set<string>>(new Set())

  function handleDeptChange(userId: string, deptId: string | null) {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, deptId } : u))
    setChanged(prev => new Set(prev).add(userId))
  }

  function handleSave() {
    setSaved(true)
    setChanged(new Set())
    setTimeout(() => setSaved(false), 3000)
  }

  const deptFilterOptions = ['전체', ...MOCK_DEPARTMENTS.map(d => d.id)]

  const filtered = users.filter(u => {
    const roleMatch = filterRole === '전체' || u.role === filterRole
    const deptMatch = filterDept === '전체' || u.deptId === filterDept
    return roleMatch && deptMatch
  })

  return (
    <div className="space-y-4">
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg">
          {t('admin.permission.userDeptSaved')}
        </div>
      )}

      {/* 필터 + 저장 */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {/* 역할 필터 */}
          <div className="relative">
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className="input text-sm pr-8 appearance-none"
            >
              {ROLE_FILTER_OPTIONS.map(r => (
                <option key={r} value={r}>
                  {r === '전체' ? t('admin.permission.allRoles') : ROLE_LABEL[r]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          </div>
          {/* 부서 필터 */}
          <div className="relative">
            <select
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
              className="input text-sm pr-8 appearance-none"
            >
              {deptFilterOptions.map(d => (
                <option key={d} value={d}>
                  {d === '전체' ? t('admin.permission.allDepts') : MOCK_DEPARTMENTS.find(dept => dept.id === d)?.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={changed.size === 0}
          className="btn-primary flex items-center gap-1.5 text-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {t('common.save')} {changed.size > 0 && `(${changed.size})`}
        </button>
      </div>

      {/* 사용자 목록 */}
      <div className="card p-0 divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">{t('common.noData')}</div>
        ) : (
          filtered.map(user => (
            <div key={user.id} className={`flex items-center justify-between px-4 py-3 ${changed.has(user.id) ? 'bg-blue-50' : ''}`}>
              {/* 사용자 정보 */}
              <div className="flex items-center gap-3 min-w-0">
                <UserCircle2 className="w-8 h-8 text-gray-300 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                      {ROLE_LABEL[user.role] ?? user.role}
                    </span>
                    {changed.has(user.id) && (
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded flex-shrink-0">
                        {t('admin.permission.unsaved')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>

              {/* 부서 선택 드롭다운 */}
              <div className="relative flex-shrink-0 ml-4">
                <select
                  value={user.deptId ?? ''}
                  onChange={e => handleDeptChange(user.id, e.target.value || null)}
                  className="input text-sm pr-8 appearance-none min-w-[140px]"
                >
                  <option value="">{t('admin.permission.noDept')}</option>
                  {MOCK_DEPARTMENTS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-gray-400">{t('admin.permission.userDeptHint')}</p>
    </div>
  )
}
