import { Graph } from '@antv/x6'

export const stencilWidth = 300
export const controlPanelWidth = 500

export const colors = {
  primary: '#1e131d',
  white: '#fff',
  text: '#333',
  transparent: 'transparent',
}

export const DEFAULT_SCALING = 0.8
export const INITIAL_TEXT = 'text'

export type GridOptions = Partial<Graph.GridManager.CommonOptions> &
  Graph.GridManager.DrawGridOptions

// 画布默认配置
// : Omit<Graph.Options, 'grid'> & { grid: GridOptions }
export const GRAPH_DEFAULT_OPTIONS = {
  background: {
    color: '#fff',
  },
  grid: {
    visible: false,
    type: 'mesh',
    size: 10,
    args: {
      color: '#ccc',
      thickness: 1,
    },
  },
  mousewheel: {
    minScale: 0.05,
    maxScale: 12,
  },
  connecting: {
    edgeAnchor: 'closest',
  },
}

export const DEFAULT_TARGET_MARKER = {
  name: 'block',
  width: 12,
  height: 8,
}

export const NODE_SIZE = {
  width: 66,
  height: 36,
}

export const EQUAL_NODE_SIZE = {
  width: 36,
  height: 36,
}
