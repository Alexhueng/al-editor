<template>
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="position.x"
    :y="position.y"
    :options="options"
    :show="visible"
    :on-clickoutside="onClickoutside"
    @select="handleSelect"
  >
    <div v-show="false">trigger</div>
  </n-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NDropdown } from 'naive-ui'
import type { DropdownOption } from 'naive-ui'
import { useGraphStore } from '@/stores/graph'
import { base64Image2Clipboard, isString, isObject } from '@/utils'
import type { Node } from '@antv/x6'

const graphStore = useGraphStore()

const visible = ref(false)
const position = ref<{ x?: number; y?: number }>({
  x: undefined,
  y: undefined,
})
const eventTarget = ref<any>(null)

const getDistance = (pos1: { x: number; y: number }, pos2: { x: number; y: number }) => {
  return {
    dx: pos2.x - pos1.x,
    dy: pos2.y - pos1.y,
  }
}

const options: (DropdownOption & {
  click?: (key: string, option: (typeof options)[number]) => void
})[] = [
  {
    label: '撤销',
    key: '1',
    click: (key, option) => {
      const graph = graphStore.graph
      if (!graph) return
      graph._undo()
    },
  },
  {
    label: '在这粘贴',
    key: '2',
    click: (key, option) => {
      const graph = graphStore.graph
      if (!graph) return
      graph.startBatch('paste-here')
      const cells = graph.getCellsInClipboard()
      if (cells.length) {
        // if the first element is a not a node, maybe throw error
        const { dx, dy } = getDistance((cells[0] as unknown as Node).getPosition(), {
          x: eventTarget.value.x,
          y: eventTarget.value.y,
        })
        cells.forEach((cell) => {
          if (cell.isNode()) {
            const { x, y } = cell.getPosition()
            cell.setPosition(x + dx, y + dy)
          }

          if (cell.isEdge()) {
            const vertices = cell.getVertices()
            const newVertices = vertices.map((v) => {
              return {
                x: v.x + dx,
                y: v.y + dy,
              }
            })
            cell.setVertices(newVertices)
          }
        })
        const pasteCells = graph.paste({ offset: 0 })
        graph.cleanSelection()
        graph.select(pasteCells)
      }
      graph.stopBatch('paste-here')
    },
  },
  {
    label: '复制为图像',
    key: 'copy2image',
    click: () => {
      const graph = graphStore.graph
      if (!graph) return
      graph.background.options.background
      if (graph._isGraphEmpty()) return

      let background: any = graph.background.options.background
      if (isObject(background) && 'color' in background) {
        background = background.color
      } else {
        background = '#fff'
      }

      graph.toPNG(
        async (dataUri) => {
          console.log(dataUri)
          const clipboardItem = await base64Image2Clipboard(dataUri)

          await navigator.clipboard.write([clipboardItem])
        },
        {
          padding: 40,
          backgroundColor: background,
          quality: 1,
        },
      )
    },
  },
  {
    type: 'divider',
  },
  {
    label: '全选',
    key: 'select-all',
    click: () => {
      const graph = graphStore.graph
      if (!graph) return
      graph._selectNodes()
    },
  },
  {
    label: '选择节点',
    key: 'select-nodes',
    click: () => {
      const graph = graphStore.graph
      if (!graph) return
      graph._selectNodes()
    },
  },
  {
    label: '选择线',
    key: 'select-edges',
    click: () => {
      const graph = graphStore.graph
      if (!graph) return
      graph._selectEdges()
    },
  },
  {
    label: '清空画布',
    key: 'clear-graph',
    click: () => {
      const graph = graphStore.graph
      if (!graph) return
      graph._clearGraph()
    },
  },
]

const show = (x: number, y: number, event: any) => {
  visible.value = true
  position.value = { x, y }
  eventTarget.value = event
}

const handleSelect = (key: string, option: DropdownOption) => {
  if (option.click && typeof option.click === 'function') {
    option.click(key, option)
  }
  visible.value = false
}

const onClickoutside = () => {
  visible.value = false
}

defineExpose({ show })
</script>
