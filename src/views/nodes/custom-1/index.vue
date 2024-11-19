<template>
  <div
    class="custom-node bg-white rounded-[2px] text-white flex justify-center items-center"
    :style="{ width: `${size?.width}px`, height: `${size?.height}px` }"
    :key="key"
  >
    <div class="text-center break-keep">{{ node?.getProp().text }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, onMounted, watch } from 'vue'
import type { Size, Node } from '@antv/x6'
import { usePanelStore } from '@/stores/panel'

const panelStore = usePanelStore()
const getNode: any = inject('getNode')
const size = ref<Size | null>(null)
const node = ref<Node | null>(null)
const key = ref(Math.random())

watch(
  () => node.value,
  (value) => {
    console.log(value)
  },
  {
    deep: true,
  },
)

watch(
  () => panelStore.currentSelectedNode,
  (value) => {
    if (value === node.value) {
      node.value?.on('change:*', ({ cell }) => {
        // console.log(cell)
        // console.log(value)
        node.value = cell as Node
        key.value = Math.random()
        // console.log(node.value?.getProp())
        // console.log(node.value?.getProp().text)
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
// export default defineComponent({
//   name: 'CustomNode',
//   inject: ['getNode'],
//   data() {
//     return {
//       size: {} as Size,
//       node: null as Node | null,
//     }
//   },
//   mounted() {
//     this.node = (this as any).getNode()
//     this.size = this.node!.getSize()

//     this.node!.on('change:size', ({ current }: { current: Size }) => {
//       this.size = current
//     })
//   },
// })
</script>

<style lang="scss" scoped>
.custom-node {
  background: linear-gradient(161deg, #0f62ff 0%, #5e94ff 100%);
}
</style>
