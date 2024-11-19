import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Cell, Node } from '@antv/x6'

interface PanelStore {
  panelVisible: boolean
  togglePanel: () => {}
  currentSelectedNode: null | Node
  setNode: (node: Node | null) => {}
  getNode: () => Cell | null
}

export const usePanelStore = defineStore('Panel', () => {
  const panelVisible = ref(false)
  const currentSelectedNode = ref<null | Node>(null)

  const togglePanel = (visible: boolean) => {
    panelVisible.value = visible ?? !panelVisible.value
  }

  const setNode = (node: Node | null) => {
    currentSelectedNode.value = node
  }

  const getNode = () => {
    return currentSelectedNode.value
  }

  return {
    panelVisible,
    togglePanel,
    setNode,
    getNode,
    currentSelectedNode,
  }
})
