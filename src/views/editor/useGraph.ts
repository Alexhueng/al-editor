import router from '@/router'
import { Graph, Shape, Node } from '@antv/x6'

export class useGraph extends Graph {
  graph: Graph

  constructor(id?: string) {
    const graph = super({
      container: document.getElementById(id || 'graph-container')!,
      grid: true,
      background: {
        color: '#F2F7FA',
      },
      // autoResize: true,
      panning: {
        enabled: true,
        modifiers: ['ctrl'],
      },
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        // modifiers: 'ctrl',
        minScale: 0.5,
        maxScale: 12,
      },
      embedding: true,
      interacting: {
        nodeMovable: true,
        edgeMovable: true,
        magnetConnectable: true,
        edgeLabelMovable: true,
        arrowheadMovable: true,
        vertexMovable: true,
        vertexAddable: true,
        vertexDeletable: true,
      },
      connecting: {
        // router: 'manhattan',
        // connector: {
        //   name: 'rounded',
        //   args: {
        //     radius: 8,
        //   },
        // },
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: true,
        snap: {
          radius: 20,
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#A2B1C3',
                strokeWidth: 2,
                strokeDasharray: '0',
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8,
                },
              },
            },
            router: 'manhattan',
            connector: 'normal',
            zIndex: 0,
          })
        },
        validateConnection({ targetMagnet }) {
          return !!targetMagnet
        },
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#000',
              stroke: '#5F95FF',
            },
          },
        },
      },
    })

    this.graph = graph as unknown as Graph
  }

  _isGraphEmpty() {
    return this.graph.getCells().length === 0
  }
  _selectAll() {
    const nodes = this.graph.getCells()
    if (nodes) {
      this.graph.select(nodes)
    }
  }
  _selectNodes() {
    const nodes = this.graph.getNodes()
    if (nodes) {
      this.graph.select(nodes)
    }
  }
  _selectEdges() {
    const edges = this.graph.getEdges()
    if (edges) {
      this.graph.select(edges)
    }
  }
  _deleteCells() {
    const cells = this.graph.getSelectedCells()
    if (cells.length) {
      this.graph.removeCells(cells)
    }
  }
  _clearGraph() {
    const cells = this.graph.getCells()
    if (cells.length) {
      this.graph.removeCells(cells)
    }
  }
  _copy() {
    const cells = this.graph.getSelectedCells()
    if (cells.length) {
      this.graph.copy(cells)
    }
  }
  _cut() {
    const cells = this.graph.getSelectedCells()
    if (cells.length) {
      this.graph.cut(cells)
    }
  }
  _paste() {
    if (!this.graph.isClipboardEmpty()) {
      const cells = this.graph.paste({ offset: 32 })
      this.graph.cleanSelection()
      this.graph.select(cells)
    }
  }
  _undo() {
    if (this.graph.canUndo()) {
      this.graph.undo()
    }
  }
  _redo() {
    if (this.graph.canRedo()) {
      this.graph.redo()
    }
  }

  // getters
  // _getBackground() {
  //   return this.graph.background.options.background
  // }
}
