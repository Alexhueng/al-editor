import { useGraphStore } from '@/stores/graph'
import { base64Image2Clipboard, isObject } from '@/utils'
import { computed } from 'vue'
import type { Node } from '@antv/x6'
import type { UseContextMenuParameters } from '.'

const graph = computed(() => {
  return useGraphStore().graph
})

const getDistance = (pos1: { x: number; y: number }, pos2: { x: number; y: number }) => {
  return {
    dx: pos2.x - pos1.x,
    dy: pos2.y - pos1.y,
  }
}

export const getBlankOptions: UseContextMenuParameters['getOptions'] = (
  position,
  eventTarget,
  instance,
) => {
  return [
    {
      label: '撤销',
      key: '1',
      click: (key, option) => {
        graph.value!._undo()
      },
    },
    {
      label: '在这粘贴',
      key: '2',
      click: (key, option) => {
        graph.value!.startBatch('paste-here')
        const cells = graph.value!.getCellsInClipboard()
        if (cells.length) {
          // if the first element is a not a node, maybe throw error
          const { dx, dy } = getDistance((cells[0] as unknown as Node).getPosition(), {
            x: eventTarget.x,
            y: eventTarget.y,
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
          const pasteCells = graph.value!.paste({ offset: 0 })
          graph.value!.clearTransformWidgets()
          graph.value!.cleanSelection()
          graph.value!.select(pasteCells)
          // graph.value!.resetSelection(pasteCells)
        }
        graph.value!.stopBatch('paste-here')
      },
    },
    {
      label: '复制为图像',
      key: 'copy2image',
      click: () => {
        graph.value!.background.options.background
        if (graph.value!._isGraphEmpty()) return

        let background: any = graph.value!.background.options.background
        if (isObject(background) && 'color' in background) {
          background = background.color
        } else {
          background = '#fff'
        }

        graph.value!.toPNG(
          async (dataUri) => {
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
      click: () => {
        graph.value!._selectNodes()
      },
    },
    {
      label: '选择节点',
      click: () => {
        graph.value!._selectNodes()
      },
    },
    {
      label: '选择线',
      click: () => {
        graph.value!._selectEdges()
      },
    },
    {
      label: '清空画布',
      click: () => {
        graph.value!._clearGraph()
      },
    },
    {
      type: 'divider',
    },
    {
      label: '全屏',
      key: 'fullscreen',
      click: () => {
        const doc = document.documentElement as any
        if (document.fullscreenElement) {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen()
          } else if (doc.msExitFullscreen) {
            doc.msExitFullscreen()
          }
        } else {
          if (doc.requestFullscreen) {
            doc.requestFullscreen()
          } else if (doc.webkitRequestFullscreen) {
            doc.webkitRequestFullscreen()
          } else if (doc.msRequestFullscreen) {
            doc.msRequestFullscreen()
          }
        }
      },
    },
  ] as OptionItem[]
}
