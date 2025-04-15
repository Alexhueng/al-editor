<template>
  <n-drawer
    v-model:show="panelStore.panelVisible"
    class="custom-class"
    :width="500"
    :show-mask="false"
    display-directive="show"
    root-class-name="root-class-name"
    :root-style="{ color: 'blue' }"
    :title="null"
    :mask-closable="false"
    :close-on-esc="false"
    placement="right"
  >
    <n-drawer-content :title="`${isNode ? '节点' : '边'}`">
      <NodeOptions v-if="isNode" />
      <EdgeOptions v-if="isEdge" />
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts" setup>
import { ref, watch, computed, reactive } from 'vue'
import { usePanelStore } from '@/stores/panel'
import type { Node, Size } from '@antv/x6'
import NodeOptions from './nodePanel/index.vue'
import EdgeOptions from './edge.vue'

const panelStore = usePanelStore()

const cell = computed(() => {
  return panelStore.getCell()!
})

const isNode = computed(() => {
  return cell.value?.isNode?.()
})

const isEdge = computed(() => {
  return cell.value?.isEdge?.()
})

// watch(
//   () => panelStore.panelVisible,
//   (value) => {},
// )
</script>
