<template>
  <transition name="panel-slide">
    <div v-if="historyStore.isPanelOpen" class="history-panel">
      <div class="panel-header">
        <span class="panel-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          히스토리
          <span class="panel-count">{{ historyStore.items.length }}</span>
        </span>

        <div class="panel-actions">
          <button
            v-if="historyStore.items.length > 0"
            class="clear-all-btn"
            title="전체 삭제"
            @click="confirmClearAll"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2" />
            </svg>
            전체 삭제
          </button>
        </div>
      </div>

      <div class="panel-body">
        <transition name="fade" mode="out-in">
          <div v-if="historyStore.isLoading" class="panel-empty">
            <span class="loading-spinner" />
            불러오는 중...
          </div>
          <div v-else-if="historyStore.items.length === 0" class="panel-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <p>저장된 히스토리가 없습니다</p>
            <small>템플릿 전환 또는 Ctrl+S로 저장됩니다</small>
          </div>
          <div v-else class="item-list">
            <HistoryItemVue
              v-for="item in historyStore.items"
              :key="item.id"
              :item="item"
              @load="loadItem"
              @delete="historyStore.deleteItem($event)"
              @update-title="(id, title) => historyStore.updateTitle(id, title)"
            />
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useHistoryStore } from '@/stores/history'
import { useEditorStore } from '@/stores/editor'
import HistoryItemVue from './HistoryItem.vue'
import type { HistoryItem } from '@/types/history'

const historyStore = useHistoryStore()
const editorStore = useEditorStore()

function loadItem(item: HistoryItem) {
  editorStore.setCode(item.code)
}

function confirmClearAll() {
  if (confirm(`히스토리 ${historyStore.items.length}개를 모두 삭제하시겠습니까?`)) {
    historyStore.clearAll()
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.history-panel {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 240px;
  max-height: 50%;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  overflow: hidden;
}

.panel-header {
  @include flex-between;
  padding: 0 $space-3;
  height: 36px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
}

.panel-title {
  @include flex-row($space-2);
  font-size: $font-size-xs;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.panel-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: var(--color-accent-subtle);
  color: var(--color-accent);
  font-size: 10px;
  font-weight: 700;
}

.panel-actions {
  @include flex-row($space-2);
}

.clear-all-btn {
  @include flex-row($space-1);
  @include btn-reset;
  font-size: $font-size-xs;
  color: var(--color-text-secondary);
  padding: 3px $space-2;
  border-radius: $border-radius-sm;
  transition: all $transition-fast;

  &:hover {
    color: $color-error;
    background: var(--color-error-bg);
  }
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  @include scroll-y;
}

.panel-empty {
  @include flex-center;
  flex-direction: column;
  gap: $space-2;
  height: 100%;
  color: var(--color-text-secondary);
  font-size: $font-size-sm;
  padding: $space-4;
  text-align: center;

  small {
    font-size: $font-size-xs;
    opacity: 0.7;
  }
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.item-list {
  padding: $space-2 $space-2;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

// ── 패널 슬라이드 애니메이션 ──────────────────────────────
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: height $transition-base, opacity $transition-fast;
  overflow: hidden;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  height: 0 !important;
  opacity: 0;
}

.panel-slide-enter-to,
.panel-slide-leave-from {
  height: 240px;
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-fast;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
