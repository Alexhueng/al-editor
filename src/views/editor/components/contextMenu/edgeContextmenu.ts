import { useGraphStore } from '@/stores/graph'
import { computed } from 'vue'
import { zIndexOperations } from './commonOperations'

import type { Node } from '@antv/x6'
import type { UseContextMenuParameters } from '.'

const graph = computed(() => {
  return useGraphStore().graph
})

export const getEdgeOptions: UseContextMenuParameters['getOptions'] = (
  position,
  eventTarget,
  instance,
) => {
  return [
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
