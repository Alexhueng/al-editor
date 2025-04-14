import type { Graph } from '@antv/x6'
import { Transform } from '@antv/x6-plugin-transform'
import { merge } from 'lodash-es'

export default function (graph: Graph, options: Transform.Options = {}) {
  graph.use(
    new Transform(
      merge(
        {
          resizing: {
            enabled: true,
          },
          rotating: {
            enabled: true,
          },
        } as Transform.Options,
        options,
      ),
    ),
  )
}
