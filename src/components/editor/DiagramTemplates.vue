<template>
  <div class="templates-bar">
    <button
      v-for="item in DIAGRAM_TEMPLATES"
      :key="item.id"
      class="template-btn"
      :class="{ 'is-active': activeId === item.id }"
      :title="item.label"
      @click="apply(item)"
    >
      <span class="template-btn-icon" v-html="item.icon" />
      <span class="template-btn-label">{{ item.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { DIAGRAM_TEMPLATES } from '@/constants/diagramTemplates'
import type { DiagramTemplate } from '@/constants/diagramTemplates'

const store = useEditorStore()

const activeId = computed(() => {
  const code = store.code.trimStart()
  return (
    DIAGRAM_TEMPLATES.find((t) => {
      const firstWord = t.code.split(/[\s\n]/)[0]
      return code.startsWith(firstWord)
    })?.id ?? null
  )
})

function apply(template: DiagramTemplate) {
  store.setCode(template.code)
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.templates-bar {
  display: flex;
  align-items: center;
  gap: $space-1;
  padding: $space-2 $space-3;
  overflow-x: auto;
  overflow-y: hidden;
  flex-shrink: 0;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;

  &::-webkit-scrollbar {
    height: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 2px;
  }
}

.template-btn {
  @include flex-row(5px);
  flex-shrink: 0;
  padding: 4px $space-3;
  height: 28px;
  border-radius: 14px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: $font-size-xs;
  font-weight: 500;
  cursor: pointer;
  transition: all $transition-fast;
  white-space: nowrap;

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    background: var(--color-accent-subtle);
  }

  &.is-active {
    border-color: var(--color-accent);
    background: var(--color-accent-subtle);
    color: var(--color-accent);
    font-weight: 600;
  }
}

.template-btn-icon {
  @include flex-center;
  flex-shrink: 0;
  opacity: 0.75;

  :deep(svg) {
    display: block;
  }
}

.template-btn-label {
  line-height: 1;
}
</style>
