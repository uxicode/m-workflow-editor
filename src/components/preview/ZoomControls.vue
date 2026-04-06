<template>
  <div class="zoom-controls">
    <button class="zoom-btn" title="축소 (-)" @click="emit('zoom-out')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>

    <span class="zoom-label">{{ scaleLabel }}</span>

    <button class="zoom-btn" title="확대 (+)" @click="emit('zoom-in')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>

    <div class="zoom-divider" />

    <button class="zoom-btn fit-btn" title="전체 보기 (Fit)" @click="emit('fit')">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
      </svg>
      <span>Fit</span>
    </button>

    <button class="zoom-btn" title="1:1 크기로 초기화" @click="emit('reset')">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  scale: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'zoom-in': []
  'zoom-out': []
  fit: []
  reset: []
}>()

const scaleLabel = computed(() => `${Math.round(props.scale * 100)}%`)
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.zoom-controls {
  @include flex-row($space-1);
  padding: $space-1 $space-2;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: $border-radius-md;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px);
}

.zoom-btn {
  @include icon-btn(28px);
  border-radius: $border-radius-sm;
  font-size: $font-size-sm;

  &.fit-btn {
    @include flex-row(4px);
    width: auto;
    padding: 0 $space-2;
    font-size: $font-size-xs;
    font-weight: 600;
  }
}

.zoom-label {
  min-width: 44px;
  text-align: center;
  font-size: $font-size-xs;
  font-weight: 600;
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
}

.zoom-divider {
  width: 1px;
  height: 18px;
  background: var(--color-border);
  margin: 0 $space-1;
}
</style>
