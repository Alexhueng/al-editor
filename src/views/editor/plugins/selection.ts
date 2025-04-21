import { Cell, type Graph } from '@antv/x6'
import { Selection } from '@antv/x6-plugin-selection'

export default function (graph: Graph) {
  graph.use(
    new Selection({
      enabled: true,
      multiple: true,
      movable: true,
      rubberband: true,
      rubberEdge: true,
      following: true,
      showNodeSelectionBox: false,
      showEdgeSelectionBox: false,
      // pointerEvents: 'none',
    }),
  )
}
