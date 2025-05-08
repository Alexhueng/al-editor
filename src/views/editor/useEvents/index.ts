import { useGraph } from '../useGraph'
import { usePanelStore } from '@/stores/panel'
import { useContextMenu } from '../components/contextMenu/index'
import { getBlankOptions } from '@/views/editor/components/contextMenu/blankContextmenu'
import { getEdgeOptions } from '@/views/editor/components/contextMenu/edgeContextmenu'
import { getNodeOptions } from '@/views/editor/components/contextMenu/nodeContextmenu'
import { showPorts } from '../ports'
import { debounce } from 'lodash'
import type { EventArgs } from '@antv/x6'

const panelStore = usePanelStore()

const MAX_CELLS_NUM = 100

export const useEvents = (graph: useGraph) => {
  graph.on('cell:selected', ({ cell }) => {
    const selectedCells = graph.getSelectedCells()
    if (selectedCells.length > MAX_CELLS_NUM) return

    if (selectedCells.length === 1) {
      panelStore.panelVisible = true
      panelStore.setCell(cell)
    } else {
      // todo: 群组选中的面板
      // panelStore.panelVisible = true
    }
    if (cell.isNode()) {
      graph.createTransformWidget(cell)
    }

    if (cell.isEdge()) {
      cell.addTools(['vertices', 'segments'])

      const arrowheadConfig = {
        args: {
          attrs: {
            fill: '#36ad6a',
            stroke: '#36ad6a',
            d: 'M 0 -5 A 5 5 0 1 0 0 5 A 5 5 0 1 0 0 -5 Z',
          },
        },
      }

      cell.addTools([
        {
          name: 'source-arrowhead',
          ...arrowheadConfig,
        },
        {
          name: 'target-arrowhead',
          ...arrowheadConfig,
        },
      ])
      // graph.addAnimation(cell)
    }
  })

  graph.on('cell:unselected', ({ cell }) => {
    panelStore.setCell(null)
    panelStore.panelVisible = false

    cell.removeTools()
    if (cell.isEdge()) {
      // graph.removeAnimation(cell)
      cell.removeTool('source-arrowhead')
      cell.removeTool('target-arrowhead')
    }
  })

  let time = 0
  window.addEventListener('mousedown', (event) => {
    if (event.button === 2) {
      time = Date.now()
    }
  })
  graph.on('blank:contextmenu', (event) => {
    if (Date.now() - time < 200) {
      useContextMenu({
        position: {
          x: event.e.pageX,
          y: event.e.pageY,
        },
        event,
        getOptions: getBlankOptions,
      })
    }
  })
  graph.on('cell:contextmenu', ({ cell, e }) => {
    if (Date.now() - time < 200) {
      graph.clearTransformWidgets()
      graph.cleanSelection()
      graph.select(cell)

      useContextMenu({
        position: {
          x: e.pageX,
          y: e.pageY,
        },
        event: e as unknown as EventArgs['cell:contextmenu'],
        getOptions: cell.isEdge() ? getEdgeOptions : getNodeOptions,
        cell,
      })
    }
  })

  const getPorts = () => {
    const container = document.getElementById('graph-container')!
    return container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>
  }

  let timeout: any = null
  graph.on('node:mouseenter', ({ cell }) => {
    const ports = getPorts()
    if (timeout) {
      clearTimeout(timeout)
    }
    showPorts(ports, true)
  })

  graph.on('node:mouseleave', ({ cell }) => {
    const ports = getPorts()
    timeout = setTimeout(() => {
      showPorts(ports, false)
    }, 500)
  })

  graph.on('blank:mousewheel', ({ e }) => {
    if (e.ctrlKey) {
      e.preventDefault()
      return false
    }
  })

  // 全局禁用滚轮缩放
  window.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey) {
        e.preventDefault()
        return false
      }
    },
    { passive: false },
  )

  window.addEventListener(
    'resize',
    debounce(() => {
      const scroller = graph.getPlugin('scroller')
      const wrapeper = document.getElementById('graph-container-wrapper')!
      const styleMap = wrapeper?.computedStyleMap() as StylePropertyMapReadOnly

      const getValue = (prop: string) => {
        return (styleMap?.get(prop) as CSSUnitValue)?.value
      }
      ;(scroller as any).scrollerImpl.resize(
        wrapeper?.clientWidth - getValue('padding-left') - getValue('padding-right'),
        wrapeper?.clientHeight - getValue('padding-top') - getValue('padding-bottom'),
      )
    }, 300),
  )

  // graph.on('cell:click', ({ e, x, y, cell, view }) => {
  //   panelStore.panelVisible = true
  //   panelStore.setCell(cell)
  // })

  // graph.on('blank:click', () => {
  //   panelStore.setCell(null)
  //   panelStore.panelVisible = false
  // })
}
