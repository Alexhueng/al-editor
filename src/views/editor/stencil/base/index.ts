import { useGraph } from '@/views/editor/useGraph'
import { EQUAL_NODE_SIZE, colors } from '@/views/editor/consts'
import { Stencil } from '@/plugins/stencil'

const options = {
  name: 'base',
  title: '基础节点',
  layoutOptions: {
    columns: 3,
    rowHeight: 50,
  },
  nodeMovable: true,
}

export const load = (graph: useGraph, stencil: Stencil) => {
  const r1 = graph.createNode({
    shape: 'normal-rect',
    attrs: {
      body: {
        rx: 20,
        ry: 26,
      },
    },
  })

  const r2 = graph.createNode({
    shape: 'normal-rect',
  })

  const r3 = graph.createNode({
    shape: 'normal-rect',
    attrs: {
      body: {
        rx: 6,
        ry: 6,
      },
    },
  })
  const r4 = graph.createNode({
    shape: 'normal-polygon',
    attrs: {
      body: {
        refPoints: '0,10 10,0 20,10 10,20',
      },
    },
  })
  const r5 = graph.createNode({
    shape: 'normal-polygon',
    attrs: {
      body: {
        refPoints: '10,0 40,0 30,20 0,20',
      },
    },
  })
  const r6 = graph.createNode({
    shape: 'normal-circle',
  })

  const container = graph.createNode({
    shape: 'container',
  })

  const triangleNode = graph.createNode({
    shape: 'normal-polygon',
    ...EQUAL_NODE_SIZE,
    attrs: {
      body: {
        refPoints: '0,20 20,20 10,0', // 三个顶点: 左下, 右下, 顶部中心
        stroke: colors.primary,
        strokeWidth: 2,
        fill: '#fff',
      },
    },
  })

  const pentagon = graph.createNode({
    shape: 'equal-polygon',
    attrs: {
      body: {
        // refPoints: '0,38 38,0 76,38 61,90 15,90',
        refPoints: '33,0 66,12 52.8,36 13.2,36 0,12',
        stroke: colors.primary,
        strokeWidth: 2,
        fill: '#fff',
      },
    },
  })

  const octagon = graph.createNode({
    shape: 'equal-polygon',
    attrs: {
      body: {
        refPoints: '11,0 25,0 36,11 36,25 25,36 11,36 0,25 0,11',
        stroke: colors.primary,
        strokeWidth: 2,
        fill: '#fff',
      },
    },
  })

  const cross = graph.createNode({
    shape: 'normal-polygon',
    ...EQUAL_NODE_SIZE,
    attrs: {
      body: {
        refPoints:
          '25.2,24 20.4,24 20.4,18 15.6,18 15.6,24 10.8,24 10.8,29.4 15.6,29.4 15.6,35.4 20.4,35.4 20.4,29.4 25.2,29.4',
        stroke: colors.primary,
        strokeWidth: 2,
        fill: '#fff',
      },
    },
  })

  const star = graph.createNode({
    shape: 'normal-polygon',
    ...EQUAL_NODE_SIZE,
    points: '100,10 40,198 190,78 10,78 160,198',
    attrs: {
      body: {
        // refPoints: '100,10 40,198 190,78 10,78 160,198',
        stroke: colors.primary,
        strokeWidth: 2,
        fill: '#fff',
      },
    },
  })

  const love = graph.createNode({
    shape: 'normal-path',
    path: 'M24.85,10.126c2.018-4.783,6.628-8.125,11.99-8.125c7.223,0,12.425,6.179,13.079,13.543c0,0,0.353,1.828-0.424,5.119c-1.058,4.482-3.545,8.464-6.898,11.503L24.85,48L7.402,32.165c-3.353-3.038-5.84-7.021-6.898-11.503c-0.777-3.291-0.424-5.119-0.424-5.119C0.734,8.179,5.936,2,13.159,2C18.522,2,22.832,5.343,24.85,10.126z',
  })

  const ellipse = graph.createNode({
    shape: 'normal-ellipse',
  })

  // const html = graph.createNode({
  //   shape: 'normal-html',
  //   attrs: {
  //     text: {
  //       text: INITIAL_TEXT,
  //     },
  //   },
  // })

  stencil.addGroup(options)
  stencil.load(
    [
      r1,
      r2,
      r3,
      r4,
      r5,
      r6,
      ellipse,
      triangleNode,
      container,
      pentagon,
      octagon,
      cross,
      love,
      star,
      // html,
    ],
    options.name,
  )
}
