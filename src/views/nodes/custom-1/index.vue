<template>
  <template
    class="custom-node rounded-[2px] text-white flex justify-center items-center"
    :style="{
      width: `${state?.size?.width}px`,
      height: `${state?.size?.height}px`,
      background: state?.data?.backgroundColor,
      zIndex: state?.data?.zIndex,
      borderRadius: `${state?.data?.borderRadius}%`,
    }"
  >
    <div class="text-center break-keep">{{ state?.data?.text }}</div>
  </template>
</template>

<script lang="ts" setup>
import { inject, ref, onMounted, watch, reactive } from 'vue'
// import type { ToRef } from 'vue'
import type { Size, Node, Cell } from '@antv/x6'
import { usePanelStore } from '@/stores/panel'

interface State {
  data: any
  size: Size | null
}

const panelStore = usePanelStore()
const getNode: () => Node = inject('getNode')!
const size = ref<Size | null>(null)
const node = ref<Node | null>(null)
const state = reactive<State>({
  data: null,
  size: null,
})

watch(
  () => panelStore.currentSelectedNode,
  (value: any) => {
    if (value === node.value) {
      node.value?.on('change:data', ({ cell }: { cell: any }) => {
        state.data = ref(cell.data)
      })
    }
  },
)
onMounted(() => {
  node.value = getNode() as Node
  state.size = ref(node.value.getSize())
  state.data = ref(node.value.getData())

  node.value.on('change:size', ({ current }: { current: Size }) => {
    state.size = current
  })
})
</script>

<style lang="scss" scoped>
.custom-node {
  // background: linear-gradient(161deg, #0f62ff 0%, #5e94ff 100%);
}
</style>
