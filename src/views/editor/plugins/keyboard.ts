import type { Graph } from '@antv/x6'
import { Keyboard } from '@antv/x6-plugin-keyboard'

export default function (graph: Graph) {
  graph.use(new Keyboard())
}
