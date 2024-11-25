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
    data: {
      text: '自定义节点',
      backgroundColor: 'linear-gradient(161deg, #0f62ff 0%, #5e94ff 100%)',
      zIndex: 1,
      borderRadius: 0,
    },
  })
}
