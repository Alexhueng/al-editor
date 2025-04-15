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

  graph.on('cell:mouseenter', ({ cell }) => {
    const ports = getPorts()
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
    showPorts(ports, false)
    cell.removeTool('source-arrowhead')
    cell.removeTool('target-arrowhead')
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
