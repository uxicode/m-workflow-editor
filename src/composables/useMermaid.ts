import { ref, watch, nextTick } from 'vue'
import mermaid from 'mermaid'
import { useDebounceFn } from '@vueuse/core'
import { useEditorStore } from '@/stores/editor'
import type { MermaidTheme } from '@/types'

let idCounter = 0

function generateId(): string {
  return `mermaid-svg-${++idCounter}-${Date.now()}`
}

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return '알 수 없는 렌더링 오류가 발생했습니다.'
}

function initMermaid(theme: MermaidTheme) {
  mermaid.initialize({
    startOnLoad: false,
    theme,
    securityLevel: 'loose',
    fontFamily: 'var(--font-mono)',
    flowchart: { useMaxWidth: false, htmlLabels: true },
    sequence: { useMaxWidth: false },
    gantt: { useMaxWidth: false },
  })
}

export function useMermaid(
  containerRef: Readonly<{ value: HTMLElement | null }>,
  onRenderComplete?: () => void,
) {
  const store = useEditorStore()
  const svgContent = ref<string>('')

  initMermaid(store.mermaidTheme)

  async function render(code: string) {
    if (!containerRef.value) return
    if (!code.trim()) {
      svgContent.value = ''
      store.setError(null)
      containerRef.value.innerHTML = ''
      return
    }

    store.setRendering(true)
    store.setError(null)

    try {
      const id = generateId()
      const { svg } = await mermaid.render(id, code)
      svgContent.value = svg

      if (containerRef.value) {
        containerRef.value.innerHTML = svg

        // SVG 크기를 유지하되 inline 렌더링을 block으로 정렬
        const svgEl = containerRef.value.querySelector('svg')
        if (svgEl) {
          svgEl.style.display = 'block'
          svgEl.style.maxWidth = 'none'
        }

        await nextTick()
        onRenderComplete?.()
      }
    } catch (err) {
      store.setError(extractErrorMessage(err))
    } finally {
      store.setRendering(false)
    }
  }

  const debouncedRender = useDebounceFn(render, 400)

  watch(
    () => store.code,
    (code) => debouncedRender(code),
    { immediate: true },
  )

  watch(
    () => store.mermaidTheme,
    (theme) => {
      initMermaid(theme)
      render(store.code)
    },
  )

  return { svgContent, render }
}
