import type { Graph } from '@antv/x6'
import { Clipboard } from '@antv/x6-plugin-clipboard'

export default function (graph: Graph) {
  graph.use(new Clipboard())
}
