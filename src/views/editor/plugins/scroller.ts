import { useGraph } from '../useGraph'
import { Scroller } from '@antv/x6-plugin-scroller'

export default function (graph: useGraph) {
  graph.use(
    new Scroller({
      enabled: true,
      pannable: {
        enabled: true,
        eventTypes: ['rightMouseDown'],
      },
      // modifiers: ['ctrl', 'meta'],
      pageVisible: true,
      pageBreak: true,
      background: {
        color: '#f1f3f4',
      },
      pageWidth: 800,
      pageHeight: 600,
    }),
  )
}
