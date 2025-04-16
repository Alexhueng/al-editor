import type { Node } from '@antv/x6'

const DIRECTIONS = ['top', 'right', 'bottom', 'left'] as const

const presetAttr = {
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
}

export const generatePorts = (
  directions: ReadonlyArray<(typeof DIRECTIONS)[number]>,
): Node['ports'] => {
  return {
    groups: directions.reduce(
      (acc, direction) => {
        acc![direction] = {
          position: direction,
          attrs: presetAttr,
        }
        return acc
      },
      {} as Node['ports']['groups'],
    ),
    items: directions.map((direction) => ({ group: direction })) as Node['ports']['items'],
  }
}

export const defaultPorts = generatePorts(DIRECTIONS)

export const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
  for (let i = 0, len = ports.length; i < len; i += 1) {
    ports[i].style.visibility = show ? 'visible' : 'hidden'
  }
}
