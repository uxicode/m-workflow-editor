<template>
  <div class="editor-wrapper" :class="{ 'is-error': !!store.error }">
    <div class="editor-header">
      <span class="editor-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        Mermaid Editor
      </span>
      <button class="clear-btn" title="코드 초기화" @click="clearCode">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2" />
        </svg>
      </button>
    </div>

    <div ref="editorContainer" class="editor-body" />

    <transition name="fade">
      <div v-if="store.error" class="editor-error">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>{{ store.error }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightActiveLine, drawSelection } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { markdown } from '@codemirror/lang-markdown'
import { defaultKeymap, historyKeymap, history, indentWithTab } from '@codemirror/commands'
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter } from '@codemirror/language'
import { oneDark } from '@codemirror/theme-one-dark'
import { useDebounceFn } from '@vueuse/core'
import { useEditorStore } from '@/stores/editor'

const store = useEditorStore()

const editorContainer = ref<HTMLElement | null>(null)
let editorView: EditorView | null = null

const themeCompartment = new Compartment()

const lightTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '13px',
    fontFamily: 'var(--font-mono)',
    background: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
  },
  '.cm-scroller': { overflow: 'auto' },
  '.cm-content': { padding: '12px 0' },
  '.cm-line': { padding: '0 16px' },
  '.cm-gutters': {
    background: 'var(--color-bg)',
    borderRight: '1px solid var(--color-border)',
    color: 'var(--color-text-secondary)',
  },
  '.cm-activeLineGutter': { background: 'var(--color-surface-hover)' },
  '.cm-activeLine': { background: 'var(--color-surface-hover)' },
  '.cm-cursor': { borderLeftColor: 'var(--color-accent)' },
  '.cm-selectionBackground': { background: 'var(--color-accent-subtle) !important' },
  '.cm-focused .cm-selectionBackground': { background: 'var(--color-accent-subtle) !important' },
})

function buildExtensions(isDark: boolean) {
  return [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightActiveLine(),
    drawSelection(),
    history(),
    bracketMatching(),
    foldGutter(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    markdown(),
    keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
    themeCompartment.of(isDark ? oneDark : lightTheme),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        handleChange(update.state.doc.toString())
      }
    }),
    EditorView.lineWrapping,
  ]
}

const handleChange = useDebounceFn((value: string) => {
  store.setCode(value)
}, 300)

function clearCode() {
  if (!editorView) return
  editorView.dispatch({
    changes: { from: 0, to: editorView.state.doc.length, insert: '' },
  })
  store.setCode('')
}

onMounted(() => {
  if (!editorContainer.value) return

  const state = EditorState.create({
    doc: store.code,
    extensions: buildExtensions(store.isDark),
  })

  editorView = new EditorView({
    state,
    parent: editorContainer.value,
  })
})

watch(
  () => store.isDark,
  (isDark) => {
    if (!editorView) return
    editorView.dispatch({
      effects: themeCompartment.reconfigure(isDark ? oneDark : lightTheme),
    })
  },
)

// 외부에서 코드가 변경될 경우 (예: 초기화) 에디터 내용도 동기화
watch(
  () => store.code,
  (newCode) => {
    if (!editorView) return
    const current = editorView.state.doc.toString()
    if (current !== newCode) {
      editorView.dispatch({
        changes: { from: 0, to: current.length, insert: newCode },
      })
    }
  },
)

onUnmounted(() => {
  editorView?.destroy()
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.editor-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-surface);
  overflow: hidden;
  transition: box-shadow $transition-base;

  &.is-error .editor-body {
    border-bottom: 2px solid var(--color-error);
  }
}

.editor-header {
  @include flex-between;
  padding: 0 $space-4;
  height: 40px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
}

.editor-label {
  @include flex-row($space-2);
  font-size: $font-size-sm;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.clear-btn {
  @include icon-btn(28px);
  color: var(--color-text-secondary);

  &:hover {
    color: $color-error;
  }
}

.editor-body {
  flex: 1;
  overflow: hidden;

  :deep(.cm-editor) {
    height: 100%;
    outline: none;
  }
}

.editor-error {
  @include flex-row($space-2);
  flex-shrink: 0;
  padding: $space-2 $space-4;
  background: var(--color-error-bg);
  color: var(--color-error);
  font-size: $font-size-xs;
  font-family: var(--font-mono);
  border-top: 1px solid var(--color-error);
  max-height: 80px;
  overflow-y: auto;

  span {
    line-height: 1.4;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-fast, max-height $transition-base;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  max-height: 80px;
}
</style>
