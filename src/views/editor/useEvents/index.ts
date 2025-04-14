import { useGraph } from '../useGraph'
import { usePanelStore } from '@/stores/panel'
import { useContextMenu } from '../components/contextMenu/index'
import { defaultPorts, showPorts } from '../ports'
import useTransform from '../plugins/transform'

const panelStore = usePanelStore()

export const useEvents = (graph: useGraph) => {
  graph.on('cell:selected', ({ cell }) => {
    const selectedCells = graph.getSelectedCells()
    if (selectedCells.length === 1) {
      panelStore.panelVisible = true
      panelStore.setCell(cell)
    } else {
      // todo: 群组选中的面板
      // console.log(selectedCells)
      // panelStore.panelVisible = true
    }
    if (cell.isEdge()) {
      cell.addTools(['vertices', 'segments'])
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

    if (cell.isEdge()) {
      cell.removeTools()
    }
  })

  graph.on('blank:contextmenu', (event) => {
    useContextMenu(event.e.pageX, event.e.pageY, event)
  })

  graph.on('node:mouseenter', () => {
    const container = document.getElementById('graph-container')!
    const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>
    showPorts(ports, true)
  })

  graph.on('node:mouseleave', () => {
    const container = document.getElementById('graph-container')!
    const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>
    showPorts(ports, false)
  })

  // graph.on('cell:click', ({ e, x, y, cell, view }) => {
  //   panelStore.panelVisible = true
  //   panelStore.setCell(cell)
  // })

  // graph.on('blank:click', () => {
  //   panelStore.setCell(null)
  //   panelStore.panelVisible = false
  // })
}
