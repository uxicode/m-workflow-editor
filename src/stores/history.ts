import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDb, exportDb, importDb } from '@/composables/useHistoryDb'
import { saveSnapshot, loadSnapshot } from '@/utils/indexedDb'
import { detectDiagramType } from '@/types/history'
import type { HistoryItem } from '@/types/history'

const MAX_HISTORY = 100

export const useHistoryStore = defineStore('history', () => {
  const items = ref<HistoryItem[]>([])
  const isLoading = ref(false)
  const isPanelOpen = ref(false)
  let lastSavedCode = ''

  // ── DB 초기화 (IndexedDB 스냅샷 복원) ──────────────────────
  async function init() {
    isLoading.value = true
    try {
      const snapshot = await loadSnapshot()
      if (snapshot) importDb(snapshot)
      await loadItems()
    } catch (e) {
      console.warn('[history] init 실패:', e)
    } finally {
      isLoading.value = false
    }
  }

  // ── 전체 목록 조회 ─────────────────────────────────────────
  async function loadItems() {
    const db = await getDb()
    const result = db.exec(
      'SELECT id, title, diagram_type, code, created_at FROM history ORDER BY created_at DESC LIMIT ?',
      [MAX_HISTORY],
    )
    if (!result.length) { items.value = []; return }
    const [{ columns, values }] = result
    items.value = values.map((row) => {
      const obj: Record<string, unknown> = {}
      columns.forEach((col, i) => (obj[col] = row[i]))
      return {
        id: obj.id as number,
        title: obj.title as string | null,
        diagramType: obj.diagram_type as string,
        code: obj.code as string,
        createdAt: obj.created_at as number,
      }
    })
  }

  // ── 저장 ───────────────────────────────────────────────────
  async function addHistory(code: string) {
    const trimmed = code.trim()
    if (!trimmed || trimmed === lastSavedCode.trim()) return

    const db = await getDb()
    const diagramType = detectDiagramType(trimmed)
    const createdAt = Date.now()

    db.run(
      'INSERT INTO history (diagram_type, code, created_at) VALUES (?, ?, ?)',
      [diagramType, trimmed, createdAt],
    )

    // 최대 건수 초과 시 오래된 항목 삭제
    db.run(
      `DELETE FROM history WHERE id IN (
        SELECT id FROM history ORDER BY created_at ASC LIMIT MAX(0, (SELECT COUNT(*) FROM history) - ?)
      )`,
      [MAX_HISTORY],
    )

    lastSavedCode = trimmed
    await loadItems()
    await persist()
  }

  // ── 제목 편집 ─────────────────────────────────────────────
  async function updateTitle(id: number, title: string) {
    const db = await getDb()
    db.run('UPDATE history SET title = ? WHERE id = ?', [title || null, id])
    const item = items.value.find((i) => i.id === id)
    if (item) item.title = title || null
    await persist()
  }

  // ── 개별 삭제 ─────────────────────────────────────────────
  async function deleteItem(id: number) {
    const db = await getDb()
    db.run('DELETE FROM history WHERE id = ?', [id])
    items.value = items.value.filter((i) => i.id !== id)
    await persist()
  }

  // ── 전체 삭제 ─────────────────────────────────────────────
  async function clearAll() {
    const db = await getDb()
    db.run('DELETE FROM history')
    items.value = []
    lastSavedCode = ''
    await persist()
  }

  // ── IndexedDB 영구 저장 ────────────────────────────────────
  async function persist() {
    const data = exportDb()
    if (data) await saveSnapshot(data)
  }

  function togglePanel() {
    isPanelOpen.value = !isPanelOpen.value
  }

  return {
    items,
    isLoading,
    isPanelOpen,
    init,
    addHistory,
    updateTitle,
    deleteItem,
    clearAll,
    togglePanel,
  }
})
