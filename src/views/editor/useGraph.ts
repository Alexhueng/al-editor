import { Graph, Shape, Node, Cell, EdgeView, NodeView, Edge } from '@antv/x6'
import { StorageService } from '@/utils/storage'
import { Persistence } from './persistence'
import useTransform from './plugins/transform'
import { merge, round } from 'lodash'
import { GRAPH_DEFAULT_OPTIONS, DEFAULT_TARGET_MARKER } from './consts'
import { sortByNumberField, randomColor } from '@/utils'
import { useGraphStore } from '@/stores/graph'

import type { Transform } from '@antv/x6-plugin-transform'

const storage = new StorageService()

export class useGraph extends Graph {
  graph: Graph
  persistence: Persistence
  animationStack: Map<Edge, any> = new Map();
  [key: string]: any

  constructor(id?: string) {
    const graphStore = useGraphStore()
    const options: Graph.Options = {
      container: document.getElementById(id || 'graph-container')!,
      grid: true,
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
        allowNode: true,
        allowEdge: true,
        anchor: 'center',
        connectionPoint: 'boundary',
        allowBlank: true,
        snap: {
          radius: 20,
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: graphStore.edgeRandomColor ? randomColor() : '#0c0c0c',
                strokeWidth: 2,
                strokeDasharray: '0',
                targetMarker: DEFAULT_TARGET_MARKER,
                style: {
                  animation: 'running-line 30s infinite linear',
                },
              },
            },
            tools: ['edge-editor'],
            router: 'manhattan',
            connector: 'normal',
            zIndex: 0,
          })
        },
        // validateConnection(...args) {
        //   return !!targetMagnet
        // },
        validateEdge: ({ edge, previous, type }) => {
          if (this._isConnetedEdge(edge)) {
            edge.removeAttrByPath('line/targetMarker')
          } else {
            edge.setAttrByPath('line/targetMarker', DEFAULT_TARGET_MARKER)
          }

          return true
        },
      },
      highlighting: {
        // magnetAdsorbed: {
        //   name: 'stroke',
        //   args: {
        //     attrs: {
        //       fill: '#000',
        //       stroke: '#5F95FF',
        //     },
        //   },
        // },
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

  // #region
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
  // #endregion

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

  private getPossibleCells(cells?: Cell[] | Cell) {
    const _cells =
      cells !== undefined ? (Array.isArray(cells) ? cells : [cells]) : this.graph.getSelectedCells()

    return _cells
  }
  private getSelectedNodes(cells?: Cell[] | Cell) {
    const _cells = this.getPossibleCells(cells)
    return _cells.filter((cell) => cell.isNode())
  }
  _toFront(cells?: Cell[] | Cell, options?: Cell.ToFrontOptions) {
    const _cells = this.getPossibleCells(cells)
    sortByNumberField(_cells, 'zIndex').forEach((cell: Cell) => cell.toFront(options))
  }
  _toBack(cells?: Cell[] | Cell, options?: Cell.ToBackOptions) {
    const _cells = this.getPossibleCells(cells)
    sortByNumberField(_cells, 'zIndex', false).forEach((cell: Cell) => cell.toBack(options))
  }
  _toUp(cells?: Cell[] | Cell, options?: Cell.SetOptions) {
    const _cells = this.getPossibleCells(cells)
    _cells.forEach((cell) => {
      cell.setZIndex(cell.getZIndex()! + 1, options)
    })
  }
  _toDown(cells?: Cell[] | Cell, options?: Cell.SetOptions) {
    const _cells = this.getPossibleCells(cells)
    _cells.forEach((cell) => {
      cell.setZIndex(cell.getZIndex()! - 1, options)
    })
  }
  _rotate(angel: number, cells?: Cell[] | Cell, options?: Node.RotateOptions) {
    const _cells = this.getPossibleCells(cells)
    _cells.forEach((cell) => {
      if (Node.isNode(cell)) {
        cell.rotate(angel, {
          absolute: true,
          ...options,
        })
      }
    })
  }
  _alignToGrid(cells?: Cell[] | Cell, options?: Node.SetPositionOptions) {
    const _cells = this.getPossibleCells(cells)
    const gridSize = this.graph.getGridSize()
    _cells.forEach((cell) => {
      if (cell.isNode()) {
        const position = cell.getPosition()
        cell.setPosition(
          {
            x: round(position.x / gridSize) * gridSize,
            y: round(position.y / gridSize) * gridSize,
          },
          options,
        )
      }
    })
  }
  _alignLeft(cells?: Cell[] | Cell) {
    const nodes = this.getSelectedNodes(cells)
    const xs = nodes.map((node) => node.getPosition().x)
    const minX = Math.min(...xs)
    nodes.forEach((node) => {
      node.setPosition({
        x: minX,
        y: node.getPosition().y,
      })
    })
  }
  _alignRight(cells?: Cell[] | Cell) {
    const nodes = this.getSelectedNodes(cells)
    const { node: maxNode, max } = this.getMaxNode(nodes, 'x')
    nodes.forEach((node) => {
      if (node !== maxNode) {
        node.setPosition({
          x: max - node.getSize().width,
          y: node.getPosition().y,
        })
      }
    })
  }
  _alignTop(cells?: Cell[] | Cell) {
    const nodes = this.getSelectedNodes(cells)
    const ys = nodes.map((node) => node.getPosition().y)
    const minY = Math.min(...ys)
    nodes.forEach((node) => {
      node.setPosition({
        x: node.getPosition().x,
        y: minY,
      })
    })
  }
  _alignBottom(cells?: Cell[] | Cell) {
    const nodes = this.getSelectedNodes(cells)
    const { node: maxNode, max } = this.getMaxNode(nodes, 'y')
    nodes.forEach((node) => {
      if (node !== maxNode) {
        node.setPosition({
          x: node.getPosition().x,
          y: max - node.getSize().height,
        })
      }
    })
  }
  /**
   * 计算距离指定轴最远的节点和距离, 比如传入x, 则返回距离画布左侧最远的节点和x坐标. 也即距离画布右侧最近
   */
  private getMaxNode(nodes: Node[], axis: 'x' | 'y') {
    let max = undefined
    let maxNode = null
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const size = node.getSize()
      const value = node.getPosition()[axis] + (axis === 'x' ? size.width : size.height)
      if (max === undefined || value > max) {
        max = value
        maxNode = node
      }
    }
    return {
      node: maxNode!,
      max: max!,
    }
  }
  /**
   * 计算距离指定轴最近的节点和距离, 比如传入x, 则返回距离画布左侧最近的节点和x坐标.
   */
  private getMinNode(nodes: Node[], axis: 'x' | 'y') {
    let min = undefined
    let minNode = null
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const value = node.getPosition()[axis]
      if (min === undefined || value < min) {
        min = value
        minNode = node
      }
    }
    return {
      node: minNode!,
      min: min!,
    }
  }
  _alignVertically(cells?: Cell[] | Cell) {
    const nodes = this.getSelectedNodes(cells)
    const { node, min } = this.getMinNode(nodes, 'y')
    if (node) {
      const centralAxis = min! + node!.getSize().height / 2
      nodes.forEach((node) => {
        node.setPosition({
          x: node.getPosition().x,
          y: centralAxis - node.getSize().height / 2,
        })
      })
    }
  }
  _alignHorizontally(cells?: Cell[] | Cell) {
    const nodes = this.getSelectedNodes(cells)
    const { node, min } = this.getMinNode(nodes, 'x')
    if (node) {
      const centralAxis = min! + node!.getSize().width / 2
      nodes.forEach((node) => {
        node.setPosition({
          x: centralAxis - node.getSize().width / 2,
          y: node.getPosition().y,
        })
      })
    }
  }
  _isConnetedBlank(edge: Edge) {
    const { target } = edge
    return target.hasOwnProperty('x') || target.hasOwnProperty('y')
  }
  isPosition(target: any) {
    return target.hasOwnProperty('x') || target.hasOwnProperty('y')
  }
  _isConnetedNode(edge: Edge) {
    const { target }: { target: any } = edge
    if (target.cell) {
      return this.graph.getCellById(target.cell as unknown as string).isNode()
    } else {
      return false
    }
  }
  _isConnetedEdge(edge: Edge) {
    const { target }: { target: any } = edge
    if (target.cell) {
      return this.graph.getCellById(target.cell as unknown as string).isEdge()
    } else {
      return false
    }
  }
  _removeAllTools() {
    const cells = this.graph.getCells()
    cells.forEach((cell) => {
      const tools = cell.getTools()
      if (tools?.items.length) {
        cell.removeTools()
      }
    })
    return this
  }
  addAnimation(edge: Edge) {
    this.animationStack.set(edge, edge.getAttrs())
    edge.attr('line/stroke', '#18a058')
    edge.attr('line/strokeDasharray', 5)
    edge.attr('line/style/animation', 'running-line 30s infinite linear')
  }
  removeAnimation(edge: Edge) {
    const attrs = this.animationStack.get(edge)
    if (attrs) {
      edge.setAttrs(attrs)
      this.animationStack.delete(edge)
    }
  }

  // getters
  // _getBackground() {
  //   return this.graph.background.options.background
  // }
}
