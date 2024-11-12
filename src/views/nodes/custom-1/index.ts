import { register } from '@antv/x6-vue-shape'
import node from './index.vue'

export const NODE_NAME = 'custom-1'

export const useRegister = (name = NODE_NAME, data: any) => {
  register({
    width: 220,
    height: 42,
    ...data,
    shape: name,
    component: node,
  })
}
