<template>
  <div class="app" :data-theme="store.theme">
    <AppToolbar :svg-container="previewRef?.svgContainerRef ?? null" />

    <main class="app-body">
      <div
        class="panel panel-editor"
        :style="{ width: `${store.panelRatio}%` }"
      >
        <MermaidEditor />
      </div>

      <div
        class="resizer"
        :class="{ 'is-dragging': isDragging }"
        @mousedown="startDrag"
      >
        <div class="resizer-handle">
          <span /><span /><span />
        </div>
      </div>

      <div class="panel panel-preview">
        <MermaidPreview ref="previewRef" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import AppToolbar from '@/components/toolbar/AppToolbar.vue'
import MermaidEditor from '@/components/editor/MermaidEditor.vue'
import MermaidPreview from '@/components/preview/MermaidPreview.vue'

const store = useEditorStore()
const previewRef = ref<InstanceType<typeof MermaidPreview> | null>(null)

const isDragging = ref(false)

function startDrag(e: MouseEvent) {
  e.preventDefault()
  isDragging.value = true

  const startX = e.clientX
  const startRatio = store.panelRatio
  const bodyWidth = document.body.clientWidth

  function onMove(e: MouseEvent) {
    const dx = e.clientX - startX
    const newRatio = startRatio + (dx / bodyWidth) * 100
    store.setPanelRatio(newRatio)
  }

  function onUp() {
    isDragging.value = false
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}
</script>

<style lang="scss">
@use '@/styles/main.scss';
</style>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--color-bg);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  transition: background $transition-base, color $transition-base;
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.panel {
  overflow: hidden;
  min-width: 0;
  display: flex;
  flex-direction: column;

  &.panel-preview {
    flex: 1;
  }
}

.resizer {
  width: var(--divider-width);
  flex-shrink: 0;
  background: var(--color-border);
  cursor: col-resize;
  position: relative;
  transition: background $transition-fast;
  @include flex-center;

  &:hover,
  &.is-dragging {
    background: var(--color-accent);

    .resizer-handle span {
      background: white;
    }
  }
}

.resizer-handle {
  display: flex;
  flex-direction: column;
  gap: 3px;
  pointer-events: none;

  span {
    display: block;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--color-text-secondary);
    transition: background $transition-fast;
  }
}
</style>
