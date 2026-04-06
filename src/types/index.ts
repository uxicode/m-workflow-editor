export type Theme = 'light' | 'dark'

export type ExportFormat = 'svg' | 'png' | 'jpg' | 'pdf'

export interface EditorState {
  code: string
  theme: Theme
  mermaidTheme: MermaidTheme
  error: string | null
  isRendering: boolean
  panelRatio: number
}

export const MERMAID_THEME = {
  default: 'default',
  dark: 'dark',
  forest: 'forest',
  neutral: 'neutral',
  base: 'base',
} as const

export type MermaidTheme = (typeof MERMAID_THEME)[keyof typeof MERMAID_THEME]

export const EXPORT_FORMAT = {
  svg: 'svg',
  png: 'png',
  jpg: 'jpg',
  pdf: 'pdf',
} as const
