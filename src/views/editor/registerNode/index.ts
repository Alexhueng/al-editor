import { Graph, Shape, ObjectExt } from '@antv/x6'
import { defaultPorts } from '../ports'
import { colors } from '../consts'

export const useRegisterNode = () => {
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
      ports: { ...defaultPorts },
    },
    true,
  )
  // .config({
  //   // preserveAspectRatio: true,
  // })

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
      ports: { ...defaultPorts },
    },
    true,
  ).config({
    preserveAspectRatio: true,
  })

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
      ports: { ...defaultPorts },
    },
    true,
  )
}
