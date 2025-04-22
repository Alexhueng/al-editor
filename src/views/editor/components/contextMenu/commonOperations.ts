import { computed } from 'vue'
import { useGraphStore } from '@/stores/graph'

const graph = computed(() => {
  return useGraphStore().graph
})

// 层级相关操作
export const zIndexOperations = [
  {
    label: '移至最前',
    click: () => graph.value!._toFront(),
  },
  {
    label: '移至最后',
    click: () => graph.value!._toBack(),
  },
  {
    label: '上移一层',
    click: () => graph.value!._toUp(),
  },
  {
    label: '下移一层',
    click: () => graph.value!._toDown(),
  },
]
