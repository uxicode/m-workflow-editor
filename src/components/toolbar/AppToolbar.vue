<template>
  <header class="toolbar">
    <div class="toolbar-left">
      <div class="brand">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span class="brand-name">Mermaid <strong>에디터</strong></span>
      </div>
    </div>

    <div class="toolbar-center">
      <div class="diagram-theme-selector">
        <label class="selector-label">다이어그램 테마</label>
        <select
          :value="store.mermaidTheme"
          class="theme-select"
          @change="onMermaidThemeChange"
        >
          <option v-for="opt in mermaidThemeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="toolbar-right">
      <ExportMenu :svg-container="svgContainer" />

      <div class="divider" />

      <button
        class="theme-toggle"
        :title="store.isDark ? '라이트 모드로 전환' : '다크 모드로 전환'"
        @click="store.toggleTheme()"
      >
        <transition name="icon-swap" mode="out-in">
          <svg v-if="store.isDark" key="sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg v-else key="moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </transition>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/editor'
import ExportMenu from './ExportMenu.vue'
import type { MermaidTheme } from '@/types'
import { MERMAID_THEME } from '@/types'

interface Props {
  svgContainer: HTMLElement | null
}

defineProps<Props>()

const store = useEditorStore()

const mermaidThemeOptions: { label: string; value: MermaidTheme }[] = [
  { label: 'Default', value: MERMAID_THEME.default },
  { label: 'Dark', value: MERMAID_THEME.dark },
  { label: 'Forest', value: MERMAID_THEME.forest },
  { label: 'Neutral', value: MERMAID_THEME.neutral },
  { label: 'Base', value: MERMAID_THEME.base },
]

function onMermaidThemeChange(e: Event) {
  const target = e.target as HTMLSelectElement
  store.setMermaidTheme(target.value as MermaidTheme)
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.toolbar {
  @include flex-between;
  height: var(--toolbar-height);
  padding: 0 $space-5;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  z-index: $z-toolbar;
  gap: $space-4;
}

.toolbar-left,
.toolbar-right {
  @include flex-row($space-3);
  flex-shrink: 0;
}

.toolbar-center {
  flex: 1;
  @include flex-center;
}

.brand {
  @include flex-row($space-2);
  color: var(--color-accent);
  text-decoration: none;
}

.brand-name {
  font-size: $font-size-lg;
  font-weight: 400;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;

  strong {
    font-weight: 700;
    color: var(--color-accent);
  }
}

.diagram-theme-selector {
  @include flex-row($space-2);
}

.selector-label {
  font-size: $font-size-sm;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.theme-select {
  appearance: none;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: $border-radius-sm;
  padding: 4px $space-3;
  font-size: $font-size-sm;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: border-color $transition-fast;

  &:hover,
  &:focus {
    border-color: var(--color-accent);
    outline: none;
  }
}

.divider {
  width: 1px;
  height: 24px;
  background: var(--color-border);
}

.theme-toggle {
  @include icon-btn(34px);
  border-radius: $border-radius-sm;
  color: var(--color-text-secondary);
}

.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity $transition-fast, transform $transition-fast;
}

.icon-swap-enter-from {
  opacity: 0;
  transform: rotate(-30deg) scale(0.8);
}

.icon-swap-leave-to {
  opacity: 0;
  transform: rotate(30deg) scale(0.8);
}
</style>
