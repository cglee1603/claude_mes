/**
 * CSV 내보내기 유틸리티
 * 실제 구현은 별도 에이전트가 완성 예정 — 현재는 타입/기능 stub
 */
export function exportToCsv<T extends object>(
  rows: T[],
  filename: string
): void {
  if (rows.length === 0) return

  const rawRows = rows as Record<string, unknown>[]
  const headers = Object.keys(rawRows[0])
  const csvContent = [
    headers.join(','),
    ...rawRows.map((row) =>
      headers
        .map((h) => {
          const cell = String(row[h] ?? '')
          return cell.includes(',') ? `"${cell}"` : cell
        })
        .join(',')
    ),
  ].join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
