import { Graph, Shape, ObjectExt } from '@antv/x6'
import { defaultPorts } from '../ports'
import { colors, NODE_SIZE, EQUAL_NODE_SIZE } from '../consts'

export const useRegisterNode = () => {
  Graph.registerNode(
    'normal-rect',
    {
      inherit: 'rect',
      ...NODE_SIZE,
      attrs: {
        body: {
          strokeWidth: 0,
          fill: colors.primary,
        },
        text: {
          fontSize: 12,
          fill: colors.text,
        },
      },
      ports: { ...defaultPorts },
    },
    true,
  )

  Graph.registerNode(
    'normal-polygon',
    {
      inherit: 'polygon',
      ...NODE_SIZE,
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
        ...defaultPorts,
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

  Graph.registerNode('normal-ellipse', {
    inherit: 'ellipse',
    ...NODE_SIZE,
    attrs: {
      body: {
        strokeWidth: 0,
        fill: colors.primary,
      },
      text: {
        fontSize: 12,
        fill: colors.text,
      },
    },
  })

  Graph.registerNode(
    'equal-polygon',
    {
      inherit: 'polygon',
      ...EQUAL_NODE_SIZE,
      attrs: {
        body: {
          strokeWidth: 0,
          fill: colors.primary,
        },
        text: {
          fontSize: 12,
          fill: colors.text,
        },
      },
      ports: {
        ...defaultPorts,
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
  ).config({
    preserveAspectRatio: true,
  })

  Graph.registerNode(
    'normal-circle',
    {
      inherit: 'circle',
      ...EQUAL_NODE_SIZE,
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
      ports: { ...defaultPorts },
    },
    true,
  ).config({
    preserveAspectRatio: true,
  })

  Graph.registerNode(
    'ring',
    {
      inherit: 'circle',
      ...EQUAL_NODE_SIZE,
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
      ports: { ...defaultPorts },
    },
    true,
  ).config({
    preserveAspectRatio: true,
  })

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
        },
      },
      ports: { ...defaultPorts },
    },
    true,
  )

  Graph.registerNode('normal-path', {
    inherit: 'path',
    ...EQUAL_NODE_SIZE,
    attrs: {
      body: {
        strokeWidth: 2,
        stroke: colors.primary,
      },
      text: {
        fontSize: 12,
        fill: colors.text,
      },
    },
    ports: { ...defaultPorts },
  })

  Graph.registerNode('normal-image', {
    inherit: 'image',
    ...EQUAL_NODE_SIZE,
    attrs: {},
    ports: { ...defaultPorts },
  }).config({
    preserveAspectRatio: true,
  })

  // Graph.registerNode(
  //   'normal-image',
  //   {
  //     inherit: 'rect',
  //     width: 52,
  //     height: 52,
  //     markup: [
  //       {
  //         tagName: 'rect',
  //         selector: 'body',
  //       },
  //       {
  //         tagName: 'image',
  //       },
  //       {
  //         tagName: 'text',
  //         selector: 'label',
  //       },
  //     ],
  //     attrs: {
  //       body: {
  //         // stroke: '#5F95FF',
  //         // fill: '#5F95FF',
  //       },
  //       image: {
  //         width: 52,
  //         height: 52,
  //         // refX: 13,
  //         // refY: 16,
  //       },
  //       label: {
  //         refX: 3,
  //         refY: 2,
  //         textAnchor: 'left',
  //         textVerticalAnchor: 'top',
  //         fontSize: 12,
  //         fill: '#fff',
  //       },
  //     },
  //     ports: { ...defaultPorts },
  //   },
  //   true,
  // )
}
