import { Graph, Shape, Node } from '@antv/x6'
import { StorageService } from '@/utils/storage'
import { Persistence } from './persistence'
import useTransform from './plugins/transform'
import { merge } from 'lodash'
import { GRAPH_DEFAULT_OPTIONS } from './consts'

import type { Transform } from '@antv/x6-plugin-transform'
import { ref } from 'vue'

const storage = new StorageService()

export const bgColor = ref('#fff')

export class useGraph extends Graph {
  graph: Graph
  persistence: Persistence;
  [key: string]: any

  constructor(id?: string) {
    const options: Graph.Options = {
      container: document.getElementById(id || 'graph-container')!,
      grid: true,
      // autoResize: true,
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
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
                stroke: '#0c0c0c',
                strokeWidth: 2,
                strokeDasharray: '0',
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8,
                },
              },
            },
            // labels: [
            //   {
            //     attrs: {
            //       label: {
            //         text: '',
            //       },
            //     },
            //   },
            // ],
            tools: ['edge-editor'],
            router: 'manhattan',
            connector: 'normal',
            zIndex: 0,
          })
        },
        validateConnection({ targetMagnet }: any) {
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
    }

    const graph = super(merge(options, GRAPH_DEFAULT_OPTIONS) as Graph.Options)

    this.graph = graph as unknown as Graph
    this.persistence = new Persistence(this)
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
      this.persistence.remove()
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
      this.graph.resetSelection(cells)
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

  // exports
  private imgExportOptions = {
    padding: 40,
    backgroundColor: '#fff',
    quality: 1,
  }
  _exportSVG(fileName: string) {
    this.graph?.exportSVG(fileName, {
      preserveDimensions: true,
      stylesheet: `
        .x6-graph-svg {
          padding: 40px;
        }
      `,
    })
  }
  _exportPNG(fileName: string) {
    this.graph?.exportPNG(fileName, this.imgExportOptions)
  }

  _exportJPEG(fileName: string) {
    this.graph?.exportJPEG(fileName, this.imgExportOptions)
  }

  _fromLocalJSON(name: string) {
    const json = storage.get('graphs')[name]
    this.graph.fromJSON(json)

    return this.graph
  }
  _recreateTransform(node: Node, options: Transform.Options = {}) {
    this.graph.disposePlugins('transform')
    useTransform(this.graph, options)
    this.graph.createTransformWidget(node)
  }

  // getters
  // _getBackground() {
  //   return this.graph.background.options.background
  // }
}
