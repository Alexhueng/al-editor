import { ref, createApp, type ComponentPublicInstance } from 'vue'
import Template from './index.vue'
import type { Cell, EventArgs } from '@antv/x6'
// import { NDropdown } from 'naive-ui'

let instance: DropdownInstance | null = null

const createDropdownInstance = (): DropdownInstance => {
  const app = createApp(Template as DropdownTemplate)
  // app.component('NDropdown', NDropdown)

  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  return app.mount(mountNode) as DropdownInstance
}

export const useContextMenu = ({ position, event, getOptions, cell }: UseContextMenuParameters) => {
  instance = instance || createDropdownInstance()
  instance.init({
    options: getOptions(position, event, instance, cell),
    position,
    event,
  })
  return instance!.show()
}

export const destroyDropdown = () => {
  if (instance) {
    instance.$el.remove()
    instance = null
  }
}

export type InitParameters = {
  options: OptionItem[]
  position: { x: number; y: number }
  event: EventArgs['blank:contextmenu'] | EventArgs['cell:contextmenu']
}

export type DropdownTemplate = typeof Template & {
  init: ({ options, position, event }: InitParameters) => void
  setOptions: (options: any[]) => void
  show: () => void
}

type DropdownInstance = ComponentPublicInstance & DropdownTemplate

export type UseContextMenuParameters = Omit<InitParameters, 'options'> & {
  getOptions: (
    position: { x: number; y: number },
    event: EventArgs['blank:contextmenu'] | EventArgs['cell:contextmenu'],
    instance: DropdownInstance,
    cell?: Cell,
  ) => OptionItem[]
  cell?: Cell
}
