<template>
  <div
    class="history-item"
    :class="{ 'is-editing': isEditing }"
    @click="!isEditing && emit('load', item)"
  >
    <div class="item-icon" v-html="diagramIcon" />

    <div class="item-body">
      <template v-if="isEditing">
        <input
          ref="titleInputRef"
          v-model="editTitle"
          class="title-input"
          placeholder="제목 입력..."
          maxlength="60"
          @keydown.enter="confirmEdit"
          @keydown.esc="cancelEdit"
          @blur="confirmEdit"
          @click.stop
        />
      </template>
      <template v-else>
        <p class="item-title">{{ displayTitle }}</p>
        <p class="item-preview">{{ codePreview }}</p>
      </template>
    </div>

    <div class="item-meta">
      <span class="item-time">{{ relativeTime }}</span>
      <div class="item-actions" @click.stop>
        <button class="action-btn" title="제목 편집" @click="startEdit">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button class="action-btn delete-btn" title="삭제" @click="emit('delete', item.id)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6M9 6V4h6v2" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { HistoryItem } from '@/types/history'
import { formatRelativeTime } from '@/types/history'
import { DIAGRAM_TEMPLATES } from '@/constants/diagramTemplates'

interface Props {
  item: HistoryItem
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'load', item: HistoryItem): void
  (e: 'delete', id: number): void
  (e: 'update-title', id: number, title: string): void
}>()

const isEditing = ref(false)
const editTitle = ref('')
const titleInputRef = ref<HTMLInputElement | null>(null)

const diagramIcon = computed(() => {
  const tpl = DIAGRAM_TEMPLATES.find((t) => t.id === props.item.diagramType)
  return (
    tpl?.icon ??
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`
  )
})

const displayTitle = computed(() =>
  props.item.title || props.item.diagramType.charAt(0).toUpperCase() + props.item.diagramType.slice(1),
)

const codePreview = computed(() => {
  const first = props.item.code.split('\n')[0].trim()
  return first.length > 44 ? first.slice(0, 44) + '…' : first
})

const relativeTime = computed(() => formatRelativeTime(props.item.createdAt))

async function startEdit() {
  editTitle.value = props.item.title ?? ''
  isEditing.value = true
  await nextTick()
  titleInputRef.value?.focus()
  titleInputRef.value?.select()
}

function confirmEdit() {
  if (!isEditing.value) return
  emit('update-title', props.item.id, editTitle.value.trim())
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.history-item {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-2 $space-3;
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: background $transition-fast;
  min-width: 0;

  &:hover {
    background: var(--color-surface-hover);

    .item-actions {
      opacity: 1;
    }
  }

  &.is-editing {
    cursor: default;
    background: var(--color-surface-hover);
  }
}

.item-icon {
  @include flex-center;
  width: 28px;
  height: 28px;
  border-radius: $border-radius-sm;
  background: var(--color-accent-subtle);
  color: var(--color-accent);
  flex-shrink: 0;

  :deep(svg) { display: block; }
}

.item-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-title {
  font-size: $font-size-sm;
  font-weight: 500;
  color: var(--color-text-primary);
  @include truncate;
}

.item-preview {
  font-size: $font-size-xs;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  @include truncate;
}

.title-input {
  width: 100%;
  background: var(--color-bg);
  border: 1px solid var(--color-accent);
  border-radius: $border-radius-sm;
  padding: 2px $space-2;
  font-size: $font-size-sm;
  color: var(--color-text-primary);
  outline: none;
}

.item-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.item-time {
  font-size: $font-size-xs;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.item-actions {
  @include flex-row(2px);
  opacity: 0;
  transition: opacity $transition-fast;
}

.action-btn {
  @include icon-btn(22px);
  color: var(--color-text-secondary);

  &.delete-btn:hover {
    color: $color-error;
    background: var(--color-error-bg);
  }
}
</style>
