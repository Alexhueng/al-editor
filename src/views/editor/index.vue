<template>
  <div class="flex w-full h-full">
    <div id="stencil" :style="{ width: stencilWidth + 'px' }"></div>

    <Toolbar />
    <div
      id="graph-container"
      class="mt-[50px]"
      :style="{ width: `calc(100% - ${stencilWidth + controlPanelWidth}px)` }"
    />
    <div class="graph-control-panel" :style="{ width: controlPanelWidth + 'px' }">
      <GraphControlPanel />
    </div>

    <TeleportContainer />

    <OptionsPanel :mask="false" />
  </div>
</template>

<script setup lang="ts">
import { Graph, Shape } from '@antv/x6'
import type { Node } from '@antv/x6'
// import { Stencil } from '@antv/x6-plugin-stencil'
import { Stencil } from '@/plugins/stencil'
import { onMounted } from 'vue'
import { register, getTeleport } from '@antv/x6-vue-shape'
// import { useRegister } from '@/views/nodes/custom-1/index'
import OptionsPanel from '@/views/optionsPanel/index.vue'
import { usePanelStore } from '@/stores/panel'
import { useGraphStore } from '@/stores/graph'
import GraphControlPanel from '@/views/optionsPanel/graph.vue'
import Toolbar from './toolbar.vue'
import { stencilWidth, controlPanelWidth, colors } from './consts'
import { preWork } from './insertCss'
import usePlugins from './plugins/index'
import { useContextMenu } from './contextMenu/index'
import { useGraph } from './useGraph'

const TeleportContainer = getTeleport()
const panelStore = usePanelStore()
const graphStore = useGraphStore()

onMounted(() => {
  preWork()

  const graph = new useGraph()
  // #endregion

  graphStore.setGraph(graph)

  // #region 使用插件
  usePlugins(graph)
  // #endregion

  // graph.on('cell:click', ({ e, x, y, cell, view }) => {
  //   panelStore.panelVisible = true
  //   panelStore.setCell(cell)
  // })

  // graph.on('blank:click', () => {
  //   panelStore.setCell(null)
  //   panelStore.panelVisible = false
  // })

  graph.on('cell:selected', ({ cell }) => {
    const selectedCells = graph.getSelectedCells()
    if (selectedCells.length === 1) {
      panelStore.panelVisible = true
      panelStore.setCell(cell)
    } else {
      // todo: 群组选中的面板
    }
    if (cell.isEdge()) {
      cell.addTools('vertices', 'onhover')
    }
  })

  graph.on('cell:unselected', ({ cell }) => {
    panelStore.setCell(null)
    panelStore.panelVisible = false
    if (cell.isEdge()) {
      cell.removeTools()
    }
  })

  // #region 初始化 stencil
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
      {
        title: '系统设计图',
        name: 'group2',
        // graphHeight: 250,
        layoutOptions: {
          // rowHeight: 80,
        },
      },
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

  // #endregion

  // #region 快捷键与事件
  graph.bindKey(['meta+c', 'ctrl+c'], () => {
    graph._copy()
    return false
  })
  graph.bindKey(['meta+x', 'ctrl+x'], () => {
    graph._cut()
    return false
  })
  graph.bindKey(['meta+v', 'ctrl+v'], () => {
    // if (!graph.isClipboardEmpty()) {
    //   const cells = graph.paste({ offset: 32 })
    //   graph.cleanSelection()
    //   graph.select(cells)
    // }
    graph._paste()
    return false
  })

  // undo redo
  graph.bindKey(['meta+z', 'ctrl+z'], (...args) => {
    graph._undo()
    return false
  })
  graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
    graph._redo()
    return false
  })

  // select all
  graph.bindKey(['meta+a', 'ctrl+a'], () => {
    graph._selectAll()
  })

  // delete 'backspace',
  graph.bindKey(['delete'], () => {
    graph._deleteCells()
  })
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Delete') {
      graph._deleteCells()
    }
  })

  // zoom
  // ctrl + 数字会冲突到chrome浏览器的切换标签快捷键.
  // graph.bindKey(['ctrl+1', 'meta+1'], () => {
  //   const zoom = graph.zoom()
  //   if (zoom < 1.5) {
  //     graph.zoom(0.1)
  //   }
  // })
  // graph.bindKey(['ctrl+2', 'meta+2'], () => {
  //   const zoom = graph.zoom()
  //   if (zoom > 0.5) {
  //     graph.zoom(-0.1)
  //   }
  // })

  // 控制连接桩显示/隐藏
  const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
    for (let i = 0, len = ports.length; i < len; i += 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }
  graph.on('node:mouseenter', () => {
    const container = document.getElementById('graph-container')!
    const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>
    showPorts(ports, true)
  })
  graph.on('node:mouseleave', () => {
    const container = document.getElementById('graph-container')!
    const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>
    showPorts(ports, false)
  })

  graph.on('blank:contextmenu', (event) => {
    useContextMenu(event.e.pageX, event.e.pageY, event)
  })
  // #endregion

  // #region 初始化图形
  const ports = {
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
      left: {
        position: 'left',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
    },
    items: [
      {
        group: 'top',
      },
      {
        group: 'right',
      },
      {
        group: 'bottom',
      },
      {
        group: 'left',
      },
    ],
  }

  Graph.registerNode(
    'custom-rect',
    {
      inherit: 'rect',
      width: 66,
      height: 36,
      attrs: {
        body: {
          strokeWidth: 0,
          // stroke: colors.primary,
          fill: colors.primary,
        },
        text: {
          fontSize: 12,
          fill: colors.text,
        },
      },
      ports: { ...ports },
    },
    true,
  )

  Graph.registerNode(
    'container',
    {
      inherit: 'rect',
      width: 66,
      height: 36,
      attrs: {
        body: {
          strokeWidth: 2,
          stroke: colors.primary,
          fill: 'transparent',
        },
        text: {
          fontSize: 12,
          // fill: colors.text,
        },
      },
      ports: { ...ports },
    },
    true,
  )

  Graph.registerNode(
    'custom-polygon',
    {
      inherit: 'polygon',
      width: 66,
      height: 36,
      attrs: {
        body: {
          strokeWidth: 0,
          // stroke: colors.primary,
          fill: colors.primary,
        },
        text: {
          fontSize: 12,
          fill: colors.text,
        },
      },
      ports: {
        ...ports,
        items: [
          {
            group: 'top',
          },
          {
            group: 'bottom',
          },
        ],
      },
    },
    true,
  )

  Graph.registerNode(
    'custom-circle',
    {
      inherit: 'circle',
      width: 45,
      height: 45,
      attrs: {
        body: {
          strokeWidth: 0,
          // stroke: colors.primary,
          fill: colors.primary,
        },
        text: {
          fontSize: 12,
          fill: colors.text,
        },
      },
      ports: { ...ports },
    },
    true,
  )

  Graph.registerNode(
    'ring',
    {
      inherit: 'circle',
      width: 45,
      height: 45,
      attrs: {
        body: {
          strokeWidth: 2,
          stroke: colors.primary,
          fill: colors.transparent,
        },
        text: {
          fontSize: 12,
          // fill: colors.text,
        },
      },
      ports: { ...ports },
    },
    true,
  )

  Graph.registerNode(
    'custom-image',
    {
      inherit: 'rect',
      width: 52,
      height: 52,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'image',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
      ],
      attrs: {
        body: {
          stroke: '#5F95FF',
          fill: '#5F95FF',
        },
        image: {
          width: 26,
          height: 26,
          refX: 13,
          refY: 16,
        },
        label: {
          refX: 3,
          refY: 2,
          textAnchor: 'left',
          textVerticalAnchor: 'top',
          fontSize: 12,
          fill: '#fff',
        },
      },
      ports: { ...ports },
    },
    true,
  )

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
  stencil.load(imageNodes, 'group2')
  // #endregion
})
</script>

<style lang="scss" scoped></style>
