import { ref, createApp } from 'vue'
import template from './index.vue'
import { NDropdown } from 'naive-ui'

let instance: any = null

const createDropdownInstance = () => {
  const app = createApp(template)
  app.component('NDropdown', NDropdown)

  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  return app.mount(mountNode)
}

export const useContextMenu = (x: number, y: number, event: any) => {
  if (!instance) {
    instance = createDropdownInstance()
  }
  return instance.show(x, y, event)
}

// 可选：销毁实例
export const destroyDropdown = () => {
  if (instance) {
    instance.$el.remove()
    instance = null
  }
}
