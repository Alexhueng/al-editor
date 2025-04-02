import type { Graph } from '@antv/x6'
import { Transform } from '@antv/x6-plugin-transform'

export default function (graph: Graph) {
  graph.use(
    new Transform({
      resizing: true,
      rotating: true,
    }),
  )
}
