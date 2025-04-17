import { useGraph } from '../useGraph'
import { usePanelStore } from '@/stores/panel'
import { useContextMenu } from '../components/contextMenu/index'
import { showPorts } from '../ports'
import { debounce } from 'lodash'

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
      // console.log(selectedCells)
      // panelStore.panelVisible = true
    }
    if (cell.isEdge()) {
      cell.addTools(['vertices', 'segments'])
      // console.log('cell:selected', cell)
    }
  })

  graph.on('node:click', ({ node }) => {
    const preserveAspectRatio = node.getProp('preserveAspectRatio')
    graph._recreateTransform(node, { resizing: { preserveAspectRatio } })
  })

  graph.on('cell:unselected', ({ cell }) => {
    panelStore.setCell(null)
    panelStore.panelVisible = false
    if (cell.isNode()) {
      graph.disposePlugins('transform')
    }

    cell.removeTools()
  })

  graph.on('blank:contextmenu', (event) => {
    useContextMenu(event.e.pageX, event.e.pageY, event)
  })

  const getPorts = () => {
    const container = document.getElementById('graph-container')!
    return container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>
  }

  let timeout: any = null
  graph.on('cell:mouseenter', ({ cell }) => {
    const ports = getPorts()
    if (timeout) {
      clearTimeout(timeout)
    }
    showPorts(ports, true)

    if (cell.isEdge()) {
      cell.addTools([
        {
          name: 'source-arrowhead',
          args: {
            attrs: {
              width: 6,
              height: 6,
              fill: '#36ad6a',
              stroke: '#36ad6a',
            },
          },
        },
        {
          name: 'target-arrowhead',
          args: {
            attrs: {
              fill: '#36ad6a',
              stroke: '#36ad6a',
            },
          },
        },
      ])
    }
  })

  graph.on('cell:mouseleave', ({ cell }) => {
    const ports = getPorts()
    timeout = setTimeout(() => {
      showPorts(ports, false)
    }, 500)
    cell.removeTool('source-arrowhead')
    cell.removeTool('target-arrowhead')
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
