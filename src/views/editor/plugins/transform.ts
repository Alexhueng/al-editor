import type { Graph, Node } from '@antv/x6'
// import { Transform } from '@antv/x6-plugin-transform'
import { Transform } from '@/plugins/transform/index'
import { merge } from 'lodash'

export default function (graph: Graph, options: Transform.Options = {}) {
  graph.use(
    new Transform(
      merge(
        {
          resizing: {
            enabled: true,
            preserveAspectRatio: (node: Node) => {
              const preserveAspectRatio = node.getProp('preserveAspectRatio')
              return !!preserveAspectRatio
            },
          },
          rotating: {
            enabled: true,
          },
          allowMultiple: true,
        } as Transform.Options,
        options,
      ),
    ),
  )
}
