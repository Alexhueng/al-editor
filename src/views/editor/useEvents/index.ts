import { useGraph } from '../useGraph'
import { usePanelStore } from '@/stores/panel'
import { useContextMenu } from '../contextMenu/index'
import { defaultPorts, showPorts } from '../ports'

const panelStore = usePanelStore()

export const useEvents = (graph: useGraph) => {
  graph.on('cell:selected', ({ cell }) => {
    const selectedCells = graph.getSelectedCells()
    if (selectedCells.length === 1) {
      panelStore.panelVisible = true
      panelStore.setCell(cell)
    } else {
      // todo: 群组选中的面板
    }
    if (cell.isEdge()) {
      cell.addTools('vertices', 'onhover')
    }
  })

  graph.on('cell:unselected', ({ cell }) => {
    panelStore.setCell(null)
    panelStore.panelVisible = false
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
