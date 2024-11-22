<template>
  <n-drawer
    v-model:show="panelStore.panelVisible"
    class="custom-class"
    :width="500"
    root-class-name="root-class-name"
    :root-style="{ color: 'blue' }"
    :title="null"
    placement="right"
  >
    <n-drawer-content title="节点属性">
      <NodeOptions />
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts" setup>
import { ref, watch, computed, reactive } from 'vue'
import { usePanelStore } from '@/stores/panel'
import type { Node, Size } from '@antv/x6'
import NodeOptions from './node.vue'

const panelStore = usePanelStore()

const node = computed(() => {
  return panelStore.getNode()!
})

// watch(
//   () => panelStore.panelVisible,
//   (value) => {
//     if (value) {
//     }
//   },
// )
</script>
