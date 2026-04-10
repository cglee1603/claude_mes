import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'ko', label: 'KO' },
  { code: 'en', label: 'EN' },
  { code: 'vi', label: 'VI' },
]

export function Header() {
  const { i18n } = useTranslation()

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
          목업 모드
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => i18n.changeLanguage(code)}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                i18n.language === code
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-600 font-medium">관리자</div>
      </div>
    </header>
  )
}
