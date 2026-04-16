import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common'
import { useMyMenu } from '@/context/MyMenuContext'
import { LayoutDashboard, Plus, Trash2, Edit2, ExternalLink, Check, X } from 'lucide-react'

export function MyMenuPage() {
  const { t } = useTranslation()
  const { workspaces, addWorkspace, renameWorkspace, deleteWorkspace } = useMyMenu()
  const navigate = useNavigate()
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  function handleCreate() {
    const name = newName.trim() || `${t('myMenu.title')} ${workspaces.length + 1}`
    const ws = addWorkspace(name)
    setNewName('')
    navigate(`/my-menu/${ws.id}`)
  }

  function handleRename(id: string) {
    if (editingName.trim()) renameWorkspace(id, editingName.trim())
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('myMenu.title')}
        subtitle={t('myMenu.subtitle')}
      />

      {/* 새 레이아웃 만들기 */}
      <div className="card flex items-center gap-3">
        <input
          type="text"
          placeholder={t('myMenu.namePlaceholder')}
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          className="input flex-1 text-sm"
        />
        <button
          type="button"
          onClick={handleCreate}
          className="btn-primary flex items-center gap-2 text-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          {t('myMenu.createBtn')}
        </button>
      </div>

      {/* 저장된 레이아웃 목록 */}
      {workspaces.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl py-16 text-center">
          <LayoutDashboard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400 mb-1">{t('myMenu.emptyTitle')}</p>
          <p className="text-xs text-gray-300">{t('myMenu.emptyHint')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map(ws => (
            <div key={ws.id} className="card border border-gray-200 hover:border-primary-300 transition-colors group">
              {/* 이름 영역 */}
              <div className="flex items-start justify-between mb-3">
                {editingId === ws.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      autoFocus
                      type="text"
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleRename(ws.id)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      className="input text-sm flex-1 py-1"
                    />
                    <button type="button" onClick={() => handleRename(ws.id)} className="text-green-600 hover:text-green-700">
                      <Check className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <h3 className="text-sm font-semibold text-gray-800 truncate flex-1">{ws.name}</h3>
                )}
                {editingId !== ws.id && (
                  <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => { setEditingId(ws.id); setEditingName(ws.name) }}
                      className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                      title={t('common.edit')}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteWorkspace(ws.id)}
                      className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500"
                      title={t('common.delete')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* 패널 미리보기 */}
              <div className="mb-3 min-h-[48px]">
                {ws.panels.length === 0 ? (
                  <p className="text-xs text-gray-400">{t('myMenu.noPanels')}</p>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {ws.panels.map(p => (
                      <span key={p.id} className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded font-mono">
                        {p.screenCode}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/my-menu/${ws.id}`)}
                  className="flex-1 btn-primary text-xs flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {t('myMenu.openEdit')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
