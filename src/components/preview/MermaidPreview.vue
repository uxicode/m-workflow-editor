<template>
  <div class="preview-wrapper">
    <div class="preview-header">
      <span class="preview-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        Preview
      </span>

      <div class="preview-header-right">
        <transition name="fade">
          <div v-if="store.isRendering" class="rendering-badge">
            <span class="spinner" />
            렌더링 중...
          </div>
        </transition>
      </div>
    </div>

    <div ref="containerRef" class="preview-canvas">
      <div ref="targetRef" class="preview-content">
        <div ref="svgContainerRef" class="svg-container" />
      </div>

      <transition name="fade">
        <div v-if="!store.code.trim() && !store.isRendering" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <p>좌측 에디터에 Mermaid 코드를 입력하세요</p>
        </div>
      </transition>
    </div>

    <div class="preview-footer">
      <ZoomControls
        :scale="zoomControls.currentScale.value"
        @zoom-in="zoomControls.zoomIn"
        @zoom-out="zoomControls.zoomOut"
        @fit="zoomControls.fit"
        @reset="zoomControls.reset"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useEditorStore } from '@/stores/editor'
import { useMermaid } from '@/composables/useMermaid'
import { useZoom } from '@/composables/useZoom'
import ZoomControls from './ZoomControls.vue'

const store = useEditorStore()

const containerRef = ref<HTMLElement | null>(null)
const targetRef = ref<HTMLElement | null>(null)
const svgContainerRef = ref<HTMLElement | null>(null)

const zoomControls = useZoom(targetRef, containerRef)

const { render } = useMermaid(svgContainerRef, () => {
  zoomControls.fit()
})

useResizeObserver(containerRef, () => {
  zoomControls.fit()
})

defineExpose({ svgContainerRef, render })
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.preview-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-bg);
  overflow: hidden;
  position: relative;
}

.preview-header {
  @include flex-between;
  padding: 0 $space-4;
  height: 40px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
}

.preview-label {
  @include flex-row($space-2);
  font-size: $font-size-sm;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.preview-header-right {
  @include flex-row($space-3);
}

.rendering-badge {
  @include flex-row($space-2);
  font-size: $font-size-xs;
  color: var(--color-accent);
}

.spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid var(--color-accent-subtle);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.preview-canvas {
  flex: 1;
  overflow: hidden;
  position: relative;
  cursor: grab;
}

.preview-content {
  display: inline-block;
  transform-origin: 0 0;
  will-change: transform;
  user-select: none;
  pointer-events: none;
}

.svg-container {
  :deep(svg) {
    display: block;
  }
}

.empty-state {
  @include flex-center;
  flex-direction: column;
  gap: $space-4;
  position: absolute;
  inset: 0;
  color: var(--color-text-secondary);
  pointer-events: none;

  p {
    font-size: $font-size-md;
  }
}

.preview-footer {
  @include flex-center;
  padding: $space-3;
  flex-shrink: 0;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-base;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
