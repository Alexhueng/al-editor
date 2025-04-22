import { useGraphStore } from '@/stores/graph'
import { computed } from 'vue'
import type { Node } from '@antv/x6'
import type { UseContextMenuParameters } from '.'
import { zIndexOperations } from './commonOperations'

const graph = computed(() => {
  return useGraphStore().graph
})

export const getNodeOptions: UseContextMenuParameters['getOptions'] = (
  position,
  eventTarget,
  instance,
) => {
  return [
    {
      label: '剪切',
      click: () => graph.value!._cut(),
    },
    {
      label: '复制',
      click: () => graph.value!._copy(),
    },
    {
      label: '删除',
      click: () => graph.value!._deleteCells(),
    },
    {
      type: 'divider',
    },
    ...zIndexOperations,
  ] as OptionItem[]
}
