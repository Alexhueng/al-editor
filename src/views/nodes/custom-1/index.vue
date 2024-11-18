<template>
  <div
    class="custom-node bg-white rounded-[2px] text-white flex justify-center items-center"
    :style="{ width: `${size?.width}px`, height: `${size?.height}px` }"
  >
    <div class="text-center break-keep">{{ state?.data?.text }}</div>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, onMounted, watch, reactive } from 'vue'
import type { Size, Node, Cell } from '@antv/x6'
import { usePanelStore } from '@/stores/panel'

interface State {
  data: any
}

const panelStore = usePanelStore()
const getNode: any = inject('getNode')
const size = ref<Size | null>(null)
const node = ref<Node | null>(null)
const state = reactive<State>({
  data: null,
})

watch(
  () => panelStore.currentSelectedNode,
  (value: any) => {
    if (value === node.value) {
      node.value?.on('change:data', ({ cell }: { cell: any }) => {
        node.value = cell
        state.data = ref(cell.data)
      })
    }
  },
)
onMounted(() => {
  node.value = getNode() as Node
  size.value = node.value.getSize()

  node.value.on('change:size', ({ current }: { current: Size }) => {
    size.value = current
  })
})
</script>

<style lang="scss" scoped>
.custom-node {
  background: linear-gradient(161deg, #0f62ff 0%, #5e94ff 100%);
}
</style>
