import { Graph } from '@antv/x6'

export const stencilWidth = 300
export const controlPanelWidth = 500

export const colors = {
  primary: '#1e131d',
  text: '#fff',
  transparent: 'transparent',
}

export const DEFAULT_SCALING = 0.8

// 画布默认配置
export const GRAPH_DEFAULT_OPTIONS: Graph.Options = {
  background: {
    color: '#fff',
  },
  grid: false,
  mousewheel: {
    minScale: 0.05,
    maxScale: 12,
  },
}

export const NODE_SIZE = {
  width: 66,
  height: 36,
}

export const EQUAL_NODE_SIZE = {
  width: 36,
  height: 36,
}
