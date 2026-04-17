import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/common'
import { useMyMenu } from '@/context/MyMenuContext'
import type { Workspace, WorkspaceExportFile } from '@/context/MyMenuContext'
import {
  LayoutDashboard, Plus, Trash2, Edit2, ExternalLink,
  Check, X, Download, Upload, FolderDown,
} from 'lucide-react'

/* ── Export 유틸 ─────────────────────────────────── */
function buildExportFile(workspaces: Workspace[]): WorkspaceExportFile {
  return { version: '1.0', exportedAt: new Date().toISOString(), workspaces }
}

function downloadJson(data: WorkspaceExportFile, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/* ── 메인 컴포넌트 ───────────────────────────────── */
export function MyMenuPage() {
  const { t } = useTranslation()
  const { workspaces, addWorkspace, renameWorkspace, deleteWorkspace, importWorkspaces } = useMyMenu()
  const navigate = useNavigate()
  const importRef = useRef<HTMLInputElement>(null)

  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null)

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

  function handleExportOne(ws: Workspace) {
    const filename = `workspace-${ws.name.replace(/\s+/g, '_')}.json`
    downloadJson(buildExportFile([ws]), filename)
  }

  function handleExportAll() {
    const filename = `my-workspaces-${new Date().toISOString().slice(0, 10)}.json`
    downloadJson(buildExportFile(workspaces), filename)
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const raw = JSON.parse(ev.target?.result as string) as WorkspaceExportFile
        if (!Array.isArray(raw.workspaces)) throw new Error('invalid')
        const added = importWorkspaces(raw.workspaces)
        setImportMsg({ ok: true, text: t('myMenu.importSuccess', { n: added }) })
      } catch {
        setImportMsg({ ok: false, text: t('myMenu.importError') })
      }
      setTimeout(() => setImportMsg(null), 4000)
      e.target.value = ''
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('myMenu.title')}
        subtitle={t('myMenu.subtitle')}
        actions={
          <div className="flex items-center gap-2">
            {workspaces.length > 0 && (
              <button
                type="button"
                onClick={handleExportAll}
                className="btn-secondary flex items-center gap-1.5 text-sm"
              >
                <FolderDown className="w-4 h-4" />
                {t('myMenu.exportAll')}
              </button>
            )}
            <button
              type="button"
              onClick={() => importRef.current?.click()}
              className="btn-secondary flex items-center gap-1.5 text-sm"
            >
              <Upload className="w-4 h-4" />
              {t('myMenu.importBtn')}
            </button>
            <input
              ref={importRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>
        }
      />

      {/* Import 결과 메시지 */}
      {importMsg && (
        <div className={`rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 ${
          importMsg.ok
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {importMsg.ok ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {importMsg.text}
        </div>
      )}

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
                      onClick={() => handleExportOne(ws)}
                      className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-blue-500"
                      title={t('myMenu.exportBtn')}
                    >
                      <Download className="w-3.5 h-3.5" />
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
