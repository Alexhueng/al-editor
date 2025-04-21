import { useGraph } from '../useGraph'
import { usePanelStore } from '@/stores/panel'
import { useContextMenu } from '../components/contextMenu/index'
import { showPorts } from '../ports'
import { debounce } from 'lodash'
import { stroke } from '@antv/x6/lib/registry/highlighter/stroke'

const panelStore = usePanelStore()

export const useEvents = (graph: useGraph) => {
  graph.on('cell:selected', ({ cell }) => {
    const selectedCells = graph.getSelectedCells()

    if (selectedCells.length === 1) {
      panelStore.panelVisible = true
      panelStore.setCell(cell)
      // cell.addTools('node-editor')
    } else {
      // todo: 群组选中的面板
      // panelStore.panelVisible = true
    }
    if (cell.isNode()) {
      graph.createTransformWidget(cell)
    }

    if (cell.isEdge()) {
      cell.addTools(['vertices', 'segments'])

      cell.addTools([
        {
          name: 'source-arrowhead',
          args: {
            attrs: {
              fill: '#36ad6a',
              stroke: '#36ad6a',
              // strokeWidth: 2,
              d: 'M 0 -5 A 5 5 0 1 0 0 5 A 5 5 0 1 0 0 -5 Z',
              // d: 'M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10',
            },
          },
        },
        {
          name: 'target-arrowhead',
          args: {
            attrs: {
              fill: '#36ad6a',
              stroke: '#36ad6a',
              // d: 'M 0 0 L -8 -4 L -8 4 Z',
              d: 'M 0 -5 A 5 5 0 1 0 0 5 A 5 5 0 1 0 0 -5 Z',
            },
          },
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
  window.addEventListener('mousedown', (event: MouseEvent) => {
    if (event.button === 2) {
      time = Date.now()
    }
  })
  graph.on('blank:contextmenu', (event) => {
    if (Date.now() - time < 200) {
      useContextMenu(event.e.pageX, event.e.pageY, event)
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
        return (styleMap?.get(prop) as CSSUnitValue).value
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
