import { onMounted } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useEditorStore } from '@/stores/editor'
import { useHistoryStore } from '@/stores/history'

export function useHistoryAutosave() {
  const editorStore = useEditorStore()
  const historyStore = useHistoryStore()

  // ── Ctrl+S 수동 저장 ──────────────────────────────────────
  useEventListener(document, 'keydown', (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      historyStore.addHistory(editorStore.code)
    }
  })

  // ── 앱 시작 시 IndexedDB에서 히스토리 복원 ────────────────
  onMounted(async () => {
    await historyStore.init()
  })
}
