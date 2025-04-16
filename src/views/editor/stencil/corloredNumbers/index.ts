import { useGraph } from '@/views/editor/useGraph'
import { NODE_SIZE, EQUAL_NODE_SIZE, colors } from '@/views/editor/consts'
import { Stencil } from '@/plugins/stencil'

const options = {
  title: '彩色数字',
  name: 'corloredNumbers',
  // graphHeight: 250,
  layoutOptions: {
    // rowHeight: 80,
  },
  nodeMovable: true,
}

const modules = import.meta.glob('./modules/*', { eager: true })

export const load = (graph: useGraph, stencil: Stencil) => {
  const images = Object.values(modules).map((item) => {
    return (item as any).default
  })

  const imageNodes = images.map((item) =>
    graph.createNode({
      shape: 'normal-image',
      ...EQUAL_NODE_SIZE,
      imageUrl: item,
    }),
  )

  if (imageNodes.length) {
    stencil.addGroup(options)
    stencil.load(imageNodes, options.name)
  }
}
