import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common'
import {
  User, Layout, Shield, Bell, Key,
  Trash2, Star, StarOff, Edit3, Check,
} from 'lucide-react'

/* ── Mock 데이터 ─────────────────────────────────── */
const mockUser = {
  name: 'Nguyen Van A',
  email: 'nguyenvana@factory.vn',
  role: 'line_manager',
  department: 'Sewing Team 1',
  language: 'en',
}

const mockLayouts = [
  { key: 'dashboard-main',    name: 'Default Dashboard',        type: 'dashboard', updatedAt: '2026-04-16', isDefault: true },
  { key: 'dashboard-quality', name: 'Quality Focus View',       type: 'dashboard', updatedAt: '2026-04-15', isDefault: false },
  { key: 'H-RT-01-grid',     name: 'H-RT-01 Production Output Grid', type: 'grid', updatedAt: '2026-04-14', isDefault: false },
  { key: 'H-SC-01-grid',     name: 'H-SC-01 Cutting Plan Grid', type: 'grid',     updatedAt: '2026-04-12', isDefault: false },
]

const mockPermissions = [
  { screenCode: 'H-RT-01', screenKey: 'admin.permission.screen.H-RT-01', view: true,  create: true,  update: true,  delete: false },
  { screenCode: 'H-SW-01', screenKey: 'admin.permission.screen.H-SW-01', view: true,  create: false, update: false, delete: false },
  { screenCode: 'H-SC-01', screenKey: 'admin.permission.screen.H-SC-01', view: true,  create: false, update: false, delete: false },
  { screenCode: 'H-QC-01', screenKey: 'admin.permission.screen.H-QC-01', view: true,  create: false, update: false, delete: false },
  { screenCode: 'Dashboard', screenKey: 'admin.permission.screen.Dashboard', view: false, create: false, update: false, delete: false },
  { screenCode: 'Admin',    screenKey: 'admin.permission.screen.Admin',   view: false, create: false, update: false, delete: false },
]

type TabKey = 'profile' | 'layout' | 'permission' | 'notification'

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'profile',      label: 'mypage.tab.profile',      icon: User },
  { key: 'layout',       label: 'mypage.tab.layout',       icon: Layout },
  { key: 'permission',   label: 'mypage.tab.permission',   icon: Shield },
  { key: 'notification', label: 'mypage.tab.notification', icon: Bell },
]

const ROLE_I18N_KEY: Record<string, string> = {
  admin:           'admin.permission.role.admin',
  factory_manager: 'admin.permission.role.factory_manager',
  line_manager:    'admin.permission.role.line_manager',
  qc_inspector:    'admin.permission.role.qc_inspector',
  warehouse:       'admin.permission.role.warehouse',
}

/* ── 프로필 탭 ───────────────────────────────────── */
function ProfileTab() {
  const { t } = useTranslation()
  const [editMode, setEditMode] = useState(false)
  const [lang, setLang] = useState(mockUser.language)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setEditMode(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-lg">
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" />
          {t('mypage.profile.saved')}
        </div>
      )}

      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{t('mypage.profile.info')}</h3>
          <button
            type="button"
            onClick={() => setEditMode(!editMode)}
            className="text-sm text-primary-600 hover:underline flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            {editMode ? t('common.cancel') : t('common.edit')}
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{t('mypage.profile.name')}</label>
            {editMode
              ? <input className="input w-full" defaultValue={mockUser.name} />
              : <p className="text-sm text-gray-900">{mockUser.name}</p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{t('mypage.profile.email')}</label>
            <p className="text-sm text-gray-900">{mockUser.email}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{t('mypage.profile.role')}</label>
            <p className="text-sm text-gray-900">{t(ROLE_I18N_KEY[mockUser.role] ?? mockUser.role)}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{t('mypage.profile.department')}</label>
            <p className="text-sm text-gray-900">{mockUser.department}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{t('mypage.profile.language')}</label>
            {editMode
              ? (
                <select
                  value={lang}
                  onChange={e => setLang(e.target.value)}
                  className="input w-full"
                >
                  <option value="en">English</option>
                  <option value="vi">Tiếng Việt (Vietnamese)</option>
                  <option value="ko">한국어 (Korean)</option>
                </select>
              )
              : <p className="text-sm text-gray-900">{{ ko: '한국어', en: 'English', vi: 'Tiếng Việt' }[lang] ?? lang}</p>
            }
          </div>
        </div>

        {editMode && (
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setEditMode(false)} className="btn-secondary text-sm">
              {t('common.cancel')}
            </button>
            <button type="button" onClick={handleSave} className="btn-primary text-sm">
              {t('common.save')}
            </button>
          </div>
        )}
      </div>

      {/* 비밀번호 변경 */}
      <div className="card space-y-3">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-gray-500" />
          <h3 className="font-semibold text-gray-900">{t('mypage.profile.changePassword')}</h3>
        </div>
        <div className="space-y-2">
          <input type="password" className="input w-full" placeholder={t('mypage.profile.currentPassword')} />
          <input type="password" className="input w-full" placeholder={t('mypage.profile.newPassword')} />
          <input type="password" className="input w-full" placeholder={t('mypage.profile.confirmPassword')} />
        </div>
        <div className="flex justify-end">
          <button type="button" className="btn-primary text-sm">{t('mypage.profile.changePassword')}</button>
        </div>
      </div>
    </div>
  )
}

/* ── 레이아웃 탭 ─────────────────────────────────── */
function LayoutTab() {
  const { t } = useTranslation()
  const [layouts, setLayouts] = useState(mockLayouts)

  function toggleDefault(key: string) {
    setLayouts(prev => prev.map(l => ({ ...l, isDefault: l.key === key })))
  }

  function deleteLayout(key: string) {
    setLayouts(prev => prev.filter(l => l.key !== key))
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <p className="text-sm text-gray-500">{t('mypage.layout.hint')}</p>
      <div className="card divide-y divide-gray-100">
        {layouts.map(layout => (
          <div key={layout.key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                layout.type === 'dashboard'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {layout.type === 'dashboard' ? t('mypage.layout.typeDashboard') : t('mypage.layout.typeGrid')}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  {layout.name}
                  {layout.isDefault && (
                    <span className="text-xs text-yellow-600 font-normal ml-1">★ {t('mypage.layout.default')}</span>
                  )}
                </p>
                <p className="text-xs text-gray-400">{t('common.updatedAt', { date: layout.updatedAt })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleDefault(layout.key)}
                title={layout.isDefault ? t('mypage.layout.unsetDefault') : t('mypage.layout.setDefault')}
                className={`p-1.5 rounded-md transition-colors ${
                  layout.isDefault
                    ? 'text-yellow-500 hover:text-yellow-600'
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                {layout.isDefault ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => deleteLayout(layout.key)}
                className="p-1.5 text-gray-300 hover:text-red-500 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {layouts.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">{t('mypage.layout.empty')}</p>
        )}
      </div>
    </div>
  )
}

/* ── 권한 조회 탭 ────────────────────────────────── */
function PermissionTab() {
  const { t } = useTranslation()

  const actionCols = ['view', 'create', 'update', 'delete'] as const

  return (
    <div className="space-y-4 max-w-2xl">
      <p className="text-sm text-gray-500">{t('mypage.permission.hint')}</p>
      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-700">{t('mypage.permission.screen')}</th>
              {actionCols.map(a => (
                <th key={a} className="text-center px-3 py-3 font-semibold text-gray-700 w-16">
                  {t(`mypage.permission.${a}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockPermissions.map(p => (
              <tr key={p.screenCode} className="hover:bg-gray-50">
                <td className="px-4 py-2.5 text-gray-800">
                  <span className="font-mono text-xs text-gray-500 mr-2">{p.screenCode}</span>
                  {t(p.screenKey)}
                </td>
                {actionCols.map(a => (
                  <td key={a} className="text-center px-3 py-2.5">
                    {p[a]
                      ? <span className="inline-block w-5 h-5 rounded-full bg-green-100 text-green-600 text-xs leading-5">✓</span>
                      : <span className="inline-block w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-xs leading-5">—</span>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400">{t('mypage.permission.adminNote')}</p>
    </div>
  )
}

/* ── 알림 탭 ─────────────────────────────────────── */
function NotificationTab() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState({
    mfzAlert: true,
    dhuThreshold: true,
    erpSync: false,
    backupResult: false,
  })

  return (
    <div className="space-y-4 max-w-lg">
      <div className="card space-y-4">
        <h3 className="font-semibold text-gray-900">{t('mypage.notification.settings')}</h3>
        {Object.entries({
          mfzAlert:      t('mypage.notification.mfzAlert'),
          dhuThreshold:  t('mypage.notification.dhuThreshold'),
          erpSync:       t('mypage.notification.erpSync'),
          backupResult:  t('mypage.notification.backupResult'),
        }).map(([key, label]) => (
          <label key={key} className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-700">{label}</span>
            <div
              onClick={() => setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                settings[key as keyof typeof settings] ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                settings[key as keyof typeof settings] ? 'translate-x-5' : ''
              }`} />
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

/* ── 메인 컴포넌트 ───────────────────────────────── */
export function MyPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabKey>('profile')

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('mypage.title')}
        subtitle={`${mockUser.name} · ${t(ROLE_I18N_KEY[mockUser.role] ?? mockUser.role)}`}
      />

      {/* 탭 바 */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 -mb-px">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t(label)}
            </button>
          ))}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div>
        {activeTab === 'profile'      && <ProfileTab />}
        {activeTab === 'layout'       && <LayoutTab />}
        {activeTab === 'permission'   && <PermissionTab />}
        {activeTab === 'notification' && <NotificationTab />}
      </div>
    </div>
  )
}
