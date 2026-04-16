import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Save, UserCircle2, ChevronDown, Plus, X } from 'lucide-react'

/* ── 목업 데이터 ─────────────────────────────────── */
export const INITIAL_DEPARTMENTS = [
  { id: 'D001', code: 'PRODUCTION', name: '생산부' },
  { id: 'D002', code: 'QC',         name: '품질관리부' },
  { id: 'D003', code: 'WAREHOUSE',  name: '자재창고부' },
  { id: 'D004', code: 'ADMIN',      name: '관리부' },
  { id: 'D005', code: 'FEATURE_TEST', name: '신규 기능 테스트' },  // 테스트용 부서
]

export const ROLE_LABEL: Record<string, string> = {
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
  deptIds: string[]   // 복수 부서 허용
}

const MOCK_USERS: MockUser[] = [
  { id: 'U001', name: '김철수',      email: 'cskim@factory.com',   role: 'factory_manager', deptIds: ['D004'] },
  { id: 'U002', name: '이영희',      email: 'yhlee@factory.com',   role: 'line_manager',    deptIds: ['D001'] },
  { id: 'U003', name: '박민준',      email: 'mjpark@factory.com',  role: 'line_manager',    deptIds: ['D001'] },
  { id: 'U004', name: '최수진',      email: 'sjchoi@factory.com',  role: 'qc_inspector',    deptIds: ['D002'] },
  { id: 'U005', name: '정대호',      email: 'dhjeong@factory.com', role: 'qc_inspector',    deptIds: ['D002'] },
  { id: 'U006', name: 'Nguyen Van A', email: 'nva@factory.com',    role: 'warehouse',       deptIds: ['D003'] },
  { id: 'U007', name: 'Tran Thi B',   email: 'ttb@factory.com',    role: 'warehouse',       deptIds: ['D003'] },
  { id: 'U008', name: '홍길동',      email: 'gdhong@factory.com',  role: 'admin',           deptIds: ['D004', 'D005'] },
]

const ROLE_FILTER_OPTIONS = ['전체', ...Object.keys(ROLE_LABEL)]

/* ── 부서 추가 팝오버 ─────────────────────────────── */
function DeptPopover({
  depts, assigned, onToggle, onClose,
}: {
  depts: typeof INITIAL_DEPARTMENTS
  assigned: string[]
  onToggle: (id: string) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div ref={ref} className="absolute right-0 top-8 z-30 bg-white border border-gray-200 rounded-lg shadow-lg w-44 py-1">
      {depts.map(d => (
        <button
          key={d.id}
          type="button"
          onClick={() => onToggle(d.id)}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-left"
        >
          <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
            assigned.includes(d.id) ? 'bg-primary-500 border-primary-500' : 'border-gray-300'
          }`}>
            {assigned.includes(d.id) && <X className="w-2.5 h-2.5 text-white" />}
          </span>
          <span className="truncate text-gray-700">{d.name}</span>
        </button>
      ))}
    </div>
  )
}

/* ── 사용자별 부서 설정 컴포넌트 ─────────────────── */
export function UserDeptAssignment({
  departments = INITIAL_DEPARTMENTS,
}: {
  departments?: typeof INITIAL_DEPARTMENTS
}) {
  const { t } = useTranslation()
  const [users, setUsers]       = useState<MockUser[]>(MOCK_USERS)
  const [filterRole, setFilterRole] = useState('전체')
  const [filterDept, setFilterDept] = useState('전체')
  const [saved, setSaved]       = useState(false)
  const [changed, setChanged]   = useState<Set<string>>(new Set())
  const [openPopover, setOpenPopover] = useState<string | null>(null)

  function toggleDept(userId: string, deptId: string) {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u
      const next = u.deptIds.includes(deptId)
        ? u.deptIds.filter(d => d !== deptId)
        : [...u.deptIds, deptId]
      return { ...u, deptIds: next }
    }))
    setChanged(prev => new Set(prev).add(userId))
  }

  function handleSave() {
    setSaved(true)
    setChanged(new Set())
    setTimeout(() => setSaved(false), 3000)
  }

  const filtered = users.filter(u => {
    const roleMatch = filterRole === '전체' || u.role === filterRole
    const deptMatch = filterDept === '전체' || u.deptIds.includes(filterDept)
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
          <div className="relative">
            <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
              className="input text-sm pr-8 appearance-none">
              {ROLE_FILTER_OPTIONS.map(r => (
                <option key={r} value={r}>{r === '전체' ? t('admin.permission.allRoles') : ROLE_LABEL[r]}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          </div>
          <div className="relative">
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
              className="input text-sm pr-8 appearance-none">
              <option value="전체">{t('admin.permission.allDepts')}</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>
        <button type="button" onClick={handleSave} disabled={changed.size === 0}
          className="btn-primary flex items-center gap-1.5 text-sm disabled:opacity-50">
          <Save className="w-4 h-4" />
          {t('common.save')}{changed.size > 0 && ` (${changed.size})`}
        </button>
      </div>

      {/* 사용자 목록 */}
      <div className="card p-0 divide-y divide-gray-100">
        {filtered.length === 0
          ? <div className="py-12 text-center text-sm text-gray-400">{t('common.noData')}</div>
          : filtered.map(user => (
          <div key={user.id}
            className={`flex items-center justify-between px-4 py-3 gap-4 ${changed.has(user.id) ? 'bg-blue-50' : ''}`}>

            {/* 사용자 정보 */}
            <div className="flex items-center gap-3 min-w-0 flex-shrink-0 w-56">
              <UserCircle2 className="w-8 h-8 text-gray-300 flex-shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                    {ROLE_LABEL[user.role] ?? user.role}
                  </span>
                  {changed.has(user.id) && (
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                      {t('admin.permission.unsaved')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>

            {/* 부서 칩 목록 + 추가 버튼 */}
            <div className="flex items-center gap-1.5 flex-wrap flex-1">
              {user.deptIds.length === 0 && (
                <span className="text-xs text-gray-400">{t('admin.permission.noDept')}</span>
              )}
              {user.deptIds.map(dId => {
                const dept = departments.find(d => d.id === dId)
                if (!dept) return null
                return (
                  <span key={dId}
                    className="flex items-center gap-1 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                    {dept.name}
                    <button type="button" onClick={() => toggleDept(user.id, dId)}
                      className="hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )
              })}

              {/* + 부서 추가 팝오버 */}
              <div className="relative">
                <button type="button" onClick={() => setOpenPopover(openPopover === user.id ? null : user.id)}
                  className="w-6 h-6 flex items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
                {openPopover === user.id && (
                  <DeptPopover
                    depts={departments}
                    assigned={user.deptIds}
                    onToggle={dId => toggleDept(user.id, dId)}
                    onClose={() => setOpenPopover(null)}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400">{t('admin.permission.userDeptHint')}</p>
    </div>
  )
}
