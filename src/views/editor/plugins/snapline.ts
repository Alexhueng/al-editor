import type { Graph } from '@antv/x6'
import { Snapline } from '@antv/x6-plugin-snapline'

export default function (graph: Graph) {
  graph.use(new Snapline())
}
