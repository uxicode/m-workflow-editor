<template>
  <div class="export-menu" v-click-outside="close">
    <button
      class="export-trigger"
      :class="{ 'is-open': isOpen, 'is-loading': isExporting }"
      :disabled="isExporting || !hasDiagram"
      @click="toggle"
    >
      <template v-if="isExporting">
        <span class="spinner" />
        내보내는 중...
      </template>
      <template v-else>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        내보내기
        <svg
          class="chevron"
          :class="{ 'is-open': isOpen }"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </template>
    </button>

    <transition name="dropdown">
      <div v-if="isOpen" class="export-dropdown">
        <button
          v-for="item in exportItems"
          :key="item.format"
          class="export-item"
          @click="handleExport(item.format)"
        >
          <span class="export-item-icon" v-html="item.icon" />
          <span class="export-item-info">
            <span class="export-item-label">{{ item.label }}</span>
            <span class="export-item-desc">{{ item.desc }}</span>
          </span>
          <span class="export-item-badge">{{ item.format.toUpperCase() }}</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useExport } from '@/composables/useExport'
import type { ExportFormat } from '@/types'

interface Props {
  svgContainer: HTMLElement | null
}

const props = defineProps<Props>()

const store = useEditorStore()
const { exportDiagram } = useExport()

const isOpen = ref(false)
const isExporting = ref(false)
const hasDiagram = computed(() => !!store.code.trim() && !store.error)

const exportItems = [
  {
    format: 'svg' as ExportFormat,
    label: 'SVG 벡터',
    desc: '확대해도 선명한 벡터 이미지',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
  },
  {
    format: 'png' as ExportFormat,
    label: 'PNG 이미지',
    desc: '투명 배경 지원 고화질 이미지',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  },
  {
    format: 'jpg' as ExportFormat,
    label: 'JPG 이미지',
    desc: '용량이 작은 압축 이미지',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  },
  {
    format: 'pdf' as ExportFormat,
    label: 'PDF 문서',
    desc: '인쇄 및 공유용 PDF',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  },
]

function toggle() {
  if (!hasDiagram.value) return
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

async function handleExport(format: ExportFormat) {
  close()
  isExporting.value = true
  try {
    await exportDiagram(format, props.svgContainer)
  } catch (err) {
    console.error('내보내기 실패:', err)
    alert(err instanceof Error ? err.message : '내보내기에 실패했습니다.')
  } finally {
    isExporting.value = false
  }
}

type ClickOutsideEl = HTMLElement & { _clickOutsideHandler?: (e: MouseEvent) => void }

const vClickOutside = {
  mounted(el: ClickOutsideEl, binding: { value: () => void }) {
    el._clickOutsideHandler = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) binding.value()
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el: ClickOutsideEl) {
    if (el._clickOutsideHandler) {
      document.removeEventListener('click', el._clickOutsideHandler)
    }
  },
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.export-menu {
  position: relative;
}

.export-trigger {
  @include flex-row($space-2);
  padding: 0 $space-3;
  height: 32px;
  border-radius: $border-radius-sm;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: $font-size-sm;
  font-weight: 500;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover:not(:disabled) {
    background: var(--color-surface-hover);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  &.is-open {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.chevron {
  transition: transform $transition-fast;

  &.is-open {
    transform: rotate(180deg);
  }
}

.spinner {
  display: inline-block;
  width: 13px;
  height: 13px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.export-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 260px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: $border-radius-md;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: $z-dropdown;
}

.export-item {
  @include flex-row($space-3);
  width: 100%;
  padding: $space-3 $space-4;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background $transition-fast;

  &:hover {
    background: var(--color-surface-hover);
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border);
  }
}

.export-item-icon {
  @include flex-center;
  width: 32px;
  height: 32px;
  border-radius: $border-radius-sm;
  background: var(--color-accent-subtle);
  color: var(--color-accent);
  flex-shrink: 0;
}

.export-item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.export-item-label {
  font-size: $font-size-md;
  font-weight: 500;
  color: var(--color-text-primary);
}

.export-item-desc {
  font-size: $font-size-xs;
  color: var(--color-text-secondary);
}

.export-item-badge {
  font-size: $font-size-xs;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--color-accent);
  background: var(--color-accent-subtle);
  padding: 2px 6px;
  border-radius: $border-radius-sm;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity $transition-fast, transform $transition-fast;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
