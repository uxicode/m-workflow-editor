import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage, usePreferredDark } from '@vueuse/core'
import type { Theme, MermaidTheme } from '@/types'
import { MERMAID_THEME } from '@/types'

const DEFAULT_CODE = `flowchart TD
    A[🚀 시작] --> B{조건 확인}
    B -->|Yes| C[✅ 성공 처리]
    B -->|No| D[❌ 실패 처리]
    C --> E[완료]
    D --> E`

export const useEditorStore = defineStore('editor', () => {
  const prefersDark = usePreferredDark()

  const code = useLocalStorage('mermaid-code', DEFAULT_CODE)
  const panelRatio = useLocalStorage('mermaid-panel-ratio', 50)
  const theme = useLocalStorage<Theme>(
    'mermaid-theme',
    prefersDark.value ? 'dark' : 'light',
  )
  const mermaidTheme = useLocalStorage<MermaidTheme>(
    'mermaid-diagram-theme',
    MERMAID_THEME.default,
  )

  const error = ref<string | null>(null)
  const isRendering = ref(false)

  const isDark = computed(() => theme.value === 'dark')

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function setCode(value: string) {
    code.value = value
  }

  function setError(value: string | null) {
    error.value = value
  }

  function setRendering(value: boolean) {
    isRendering.value = value
  }

  function setMermaidTheme(value: MermaidTheme) {
    mermaidTheme.value = value
  }

  function setPanelRatio(value: number) {
    panelRatio.value = Math.min(80, Math.max(20, value))
  }

  return {
    code,
    theme,
    mermaidTheme,
    error,
    isRendering,
    panelRatio,
    isDark,
    toggleTheme,
    setCode,
    setError,
    setRendering,
    setMermaidTheme,
    setPanelRatio,
  }
})
