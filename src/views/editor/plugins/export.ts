import type { Graph } from '@antv/x6'
import { Export } from '@antv/x6-plugin-export'

export default function (graph: Graph) {
  graph.use(new Export())
}
