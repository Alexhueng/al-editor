<template>
  <n-drawer
    v-model:show="panelStore.panelVisible"
    class="custom-class"
    :width="500"
    :show-mask="false"
    root-class-name="root-class-name"
    :root-style="{ color: 'blue' }"
    :title="null"
    placement="right"
  >
    <n-drawer-content :title="`${isNode ? '节点' : '边'}属性`">
      <NodeOptions v-if="isNode" />
      <EdgeOptions v-if="isEdge" />
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts" setup>
import { ref, watch, computed, reactive } from 'vue'
import { usePanelStore } from '@/stores/panel'
import type { Node, Size } from '@antv/x6'
import NodeOptions from './node.vue'
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
//   (value) => {
//     if (value) {
//     }
//   },
// )
</script>
