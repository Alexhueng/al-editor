import { Stencil } from '@/plugins/stencil'
import { useGraph } from '../useGraph'
import { load } from './base'

const modules = import.meta.glob(['./**/index.ts', '!./base/index.ts'])

export const useStencil = (graph: useGraph) => {
  const stencil = new Stencil({
    title: '图形库',
    target: graph,
    stencilGraphWidth: 280,
    stencilGraphHeight: 0,
    collapsable: false,
    scaled: true,
    stencilGraphOptions: {
      embedding: true,
    },
    beforeDndStart: ({ node, e }) => {
      const cloneNode = node.clone()
      const shape = cloneNode.shape

      if (shape === 'container') {
        const size = cloneNode.prop('size')
        cloneNode.prop('size', {
          width: size!.width * 4,
          height: size!.height * 4,
        })
      }
      return cloneNode
    },
    groups: [],
    layoutOptions: {
      columns: 3,
      columnWidth: 80,
      // rowHeight: 55,
    },
  })
  document.getElementById('stencil')?.appendChild(stencil.container)

  // Object.values(stencil.graphs).forEach((graph) => {
  //   graph.on('cell:mouseenter', () => {
  //     console.log('mouseenter')
  //   })
  // })

  load(graph, stencil)
  Object.values(modules).forEach((item) => {
    item().then((moduleItem) => {
      ;(moduleItem as any).load(graph, stencil)
    })
  })
}
