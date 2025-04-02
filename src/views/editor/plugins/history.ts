import type { Graph } from '@antv/x6'
import { History } from '@antv/x6-plugin-history'

export default function (graph: Graph) {
  graph.use(new History())
}
