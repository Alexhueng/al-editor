import { Graph, Shape } from '@antv/x6'
import { defaultPorts } from '../ports'
import { colors, NODE_SIZE, EQUAL_NODE_SIZE, INITIAL_TEXT } from '../consts'
import { merge } from 'lodash'

const getInitAttrs = (override: Recordable = {}) => {
  return merge(
    {
      body: {
        strokeWidth: 2,
        stroke: colors.primary,
      },
      text: {
        fontSize: 12,
        textWrap: {
          width: '100%',
          height: '0',
          text: '',
          breakWord: true,
          ellipsis: true,
        },
      },
    },
    override,
  )
}

export const useRegisterNode = () => {
  Graph.registerNode(
    'normal-rect',
    {
      inherit: 'rect',
      ...NODE_SIZE,
      attrs: getInitAttrs(),
      ports: { ...defaultPorts },
    },
    true,
  )

  Graph.registerNode(
    'normal-polygon',
    {
      inherit: 'polygon',
      ...NODE_SIZE,
      attrs: getInitAttrs(),
      ports: { ...defaultPorts },
    },
    true,
  )

  Graph.registerNode('normal-ellipse', {
    inherit: 'ellipse',
    ...NODE_SIZE,
    attrs: getInitAttrs(),
    ports: { ...defaultPorts },
  })

  Graph.registerNode(
    'equal-polygon',
    {
      inherit: 'polygon',
      ...EQUAL_NODE_SIZE,
      attrs: getInitAttrs(),
      ports: { ...defaultPorts },
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
      attrs: getInitAttrs(),
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
      attrs: getInitAttrs(),
      ports: { ...defaultPorts },
    },
    true,
  ).config({
    preserveAspectRatio: true,
  })

  Graph.registerNode(
    'container',
    {
      inherit: 'normal-rect',
    },
    true,
  ).config({
    zoom: 4,
  })

  Graph.registerNode('normal-path', {
    inherit: 'path',
    ...EQUAL_NODE_SIZE,
    attrs: getInitAttrs(),
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

  // Shape.HTML.register({
  //   shape: 'normal-html',
  //   ...NODE_SIZE,
  //   effect: ['data', 'attrs'],
  //   attrs: {
  //     text: {
  //       display: 'none',
  //     },
  //   },
  //   html(cell) {
  //     const div = document.createElement('div')
  //     div.className = 'custom-html'
  //     const styleString = objectToStyle({
  //       wordBreak: 'break-word',
  //       height: '100%',
  //       width: '100%',
  //       display: 'flex',
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //       color: '#000',
  //       fontSize: '12px',
  //     })
  //     div.style.cssText = styleString
  //     div.innerText = cell.getAttrByPath('text/text')
  //     return div
  //   },
  // })

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
