import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/common'
import { useMyMenu, ALL_SCREENS } from '@/context/MyMenuContext'
import {
  Star, ExternalLink, Search, BookmarkX, ChevronDown, ChevronRight,
} from 'lucide-react'

const GROUPS = [...new Set(ALL_SCREENS.map(s => s.group))]

export function MyMenuPage() {
  const { isPinned, togglePin, pinnedScreens } = useMyMenu()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})

  function toggleGroup(group: string) {
    setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }))
  }

  const filtered = query.trim()
    ? ALL_SCREENS.filter(s =>
        s.title.includes(query) || s.code.toLowerCase().includes(query.toLowerCase())
      )
    : null

  return (
    <div className="space-y-6">
      <PageHeader
        title="내 메뉴"
        subtitle="자주 사용하는 화면을 즐겨찾기에 추가하면 사이드바에서 바로 접근할 수 있습니다."
      />

      {/* 즐겨찾기 등록된 화면 */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          즐겨찾기 ({pinnedScreens.length})
        </h2>
        {pinnedScreens.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl py-10 text-center text-sm text-gray-400">
            아래 전체 화면 목록에서 ☆ 버튼을 눌러 즐겨찾기를 추가하세요.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {pinnedScreens.map(s => (
              <div
                key={s.code}
                className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="min-w-0">
                  <p className="text-xs text-yellow-700 font-mono font-semibold">{s.code}</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{s.title}</p>
                </div>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate(s.path)}
                    title="화면 열기"
                    className="p-1.5 rounded hover:bg-yellow-100 text-yellow-600"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePin(s.code)}
                    title="즐겨찾기 해제"
                    className="p-1.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-500"
                  >
                    <BookmarkX className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 전체 화면 목록 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">전체 화면 (33개)</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="화면 검색..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="input pl-8 text-sm py-1.5 w-48"
            />
          </div>
        </div>

        {/* 검색 결과 */}
        {filtered !== null ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {filtered.length === 0 ? (
              <p className="col-span-full text-sm text-gray-400 py-6 text-center">검색 결과 없음</p>
            ) : (
              filtered.map(s => (
                <ScreenCard key={s.code} screen={s} pinned={isPinned(s.code)} onToggle={togglePin} onOpen={() => navigate(s.path)} />
              ))
            )}
          </div>
        ) : (
          /* 그룹별 목록 */
          <div className="space-y-4">
            {GROUPS.map(group => {
              const screens = ALL_SCREENS.filter(s => s.group === group)
              const collapsed = collapsedGroups[group]
              return (
                <div key={group} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm font-semibold text-gray-700">{group}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {screens.filter(s => isPinned(s.code)).length}/{screens.length} 즐겨찾기
                      </span>
                      {collapsed
                        ? <ChevronRight className="w-4 h-4 text-gray-400" />
                        : <ChevronDown className="w-4 h-4 text-gray-400" />
                      }
                    </div>
                  </button>
                  {!collapsed && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 p-3 bg-white">
                      {screens.map(s => (
                        <ScreenCard
                          key={s.code}
                          screen={s}
                          pinned={isPinned(s.code)}
                          onToggle={togglePin}
                          onOpen={() => navigate(s.path)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

/* ── 화면 카드 ───────────────────────────────────────── */
function ScreenCard({
  screen,
  pinned,
  onToggle,
  onOpen,
}: {
  screen: { code: string; title: string }
  pinned: boolean
  onToggle: (code: string) => void
  onOpen: () => void
}) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
        pinned ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 font-mono">{screen.code}</p>
        <p className="text-sm font-medium text-gray-800 truncate">{screen.title}</p>
      </div>
      <div className="flex items-center gap-0.5 ml-1 flex-shrink-0">
        <button
          type="button"
          onClick={onOpen}
          title="화면 열기"
          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-primary-600"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onToggle(screen.code)}
          title={pinned ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          className={`p-1.5 rounded transition-colors ${
            pinned ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-300 hover:text-yellow-500'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${pinned ? 'fill-yellow-400' : ''}`} />
        </button>
      </div>
    </div>
  )
}
