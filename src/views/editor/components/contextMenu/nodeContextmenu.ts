import { useGraphStore } from '@/stores/graph'
import { computed } from 'vue'
import type { Node } from '@antv/x6'
import type { UseContextMenuParameters } from '.'
import { zIndexOperations } from './commonOperations'

const graph = computed(() => {
  return useGraphStore().graph
})

const memoPad = computed(() => {
  return useGraphStore().memoPad
})

export const getNodeOptions: UseContextMenuParameters['getOptions'] = (
  position,
  eventTarget,
  instance,
  cell,
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
    {
      type: 'divider',
    },
    {
      label: '添加到便签本',
      click: () => {
        const json = cell?.toJSON() as Node.Properties
        delete json.ports
        delete json.position
        delete json.zIndex

        memoPad.value.push(json)
        console.log(memoPad.value)
      },
    },
  ] as OptionItem[]
}
