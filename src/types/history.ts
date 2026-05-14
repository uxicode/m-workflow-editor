export interface HistoryItem {
  id: number
  title: string | null
  diagramType: string
  code: string
  createdAt: number
}

export const DIAGRAM_TYPE_KEYWORDS: Record<string, string> = {
  flowchart: 'flowchart',
  graph: 'flowchart',
  sequenceDiagram: 'sequence',
  classDiagram: 'class',
  'stateDiagram-v2': 'state',
  stateDiagram: 'state',
  erDiagram: 'er',
  gantt: 'gantt',
  pie: 'pie',
  gitGraph: 'gitgraph',
  mindmap: 'mindmap',
  timeline: 'timeline',
  journey: 'journey',
  quadrantChart: 'quadrant',
  'xychart-beta': 'xychart',
  'sankey-beta': 'sankey',
  'architecture-beta': 'architecture',
}

export function detectDiagramType(code: string): string {
  const firstWord = code.trimStart().split(/[\s\n({]/)[0].toLowerCase()
  for (const [keyword, type] of Object.entries(DIAGRAM_TYPE_KEYWORDS)) {
    if (firstWord === keyword.toLowerCase()) return type
  }
  return 'unknown'
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 7) return `${days}일 전`
  return new Date(timestamp).toLocaleDateString('ko-KR')
}
