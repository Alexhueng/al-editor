import { Stencil } from '@/plugins/stencil'
import { useGraph } from '../useGraph'

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
    groups: [
      {
        title: '基础节点',
        name: 'group1',
        layoutOptions: {
          rowHeight: 60,
        },
        nodeMovable: true,
      },
      // {
      //   title: '系统设计图',
      //   name: 'group2',
      //   // graphHeight: 250,
      //   layoutOptions: {
      //     // rowHeight: 80,
      //   },
      // },
    ],
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

  const r1 = graph.createNode({
    shape: 'custom-rect',
    label: 'text',
    attrs: {
      body: {
        rx: 20,
        ry: 26,
      },
    },
  })
  // register nodes
  // useRegister(undefined, {
  //   ports,
  // })

  // const r1 = graph.createNode({
  //   shape: 'custom-1',
  // })

  const r2 = graph.createNode({
    shape: 'custom-rect',
    label: 'text',
  })
  const r3 = graph.createNode({
    shape: 'custom-rect',
    attrs: {
      body: {
        rx: 6,
        ry: 6,
      },
    },
    label: 'text',
  })
  const r4 = graph.createNode({
    shape: 'custom-polygon',
    attrs: {
      body: {
        refPoints: '0,10 10,0 20,10 10,20',
      },
    },
    label: 'text',
  })
  const r5 = graph.createNode({
    shape: 'custom-polygon',
    attrs: {
      body: {
        refPoints: '10,0 40,0 30,20 0,20',
      },
    },
    label: 'text',
  })
  const r6 = graph.createNode({
    shape: 'custom-circle',
    label: 'text',
  })
  const ring = graph.createNode({
    shape: 'ring',
  })
  const container = graph.createNode({
    shape: 'container',
  })

  const triangleNode = graph.createNode({
    shape: 'custom-polygon',
    attrs: {
      body: {
        refPoints: '0,20 20,20 10,0', // 三个顶点: 左下, 右下, 顶部中心
      },
    },
    // label: 'text', // e.g., "Judgment" or "Condition"
  })

  stencil.load([r1, r2, r3, r4, r5, r6, triangleNode, ring, container], 'group1')

  const imageShapes = [
    {
      label: 'Client',
      image: 'https://gw.alipayobjects.com/zos/bmw-prod/687b6cb9-4b97-42a6-96d0-34b3099133ac.svg',
    },
    {
      label: 'Http',
      image: 'https://gw.alipayobjects.com/zos/bmw-prod/dc1ced06-417d-466f-927b-b4a4d3265791.svg',
    },
    {
      label: 'Api',
      image: 'https://gw.alipayobjects.com/zos/bmw-prod/c55d7ae1-8d20-4585-bd8f-ca23653a4489.svg',
    },
    {
      label: 'Sql',
      image: 'https://gw.alipayobjects.com/zos/bmw-prod/6eb71764-18ed-4149-b868-53ad1542c405.svg',
    },
    {
      label: 'Clound',
      image: 'https://gw.alipayobjects.com/zos/bmw-prod/c36fe7cb-dc24-4854-aeb5-88d8dc36d52e.svg',
    },
    {
      label: 'Mq',
      image: 'https://gw.alipayobjects.com/zos/bmw-prod/2010ac9f-40e7-49d4-8c4a-4fcf2f83033b.svg',
    },
  ]
  const imageNodes = imageShapes.map((item) =>
    graph.createNode({
      shape: 'custom-image',
      label: item.label,
      attrs: {
        image: {
          'xlink:href': item.image,
        },
      },
    }),
  )
  // stencil.load(imageNodes, 'group2')
}
