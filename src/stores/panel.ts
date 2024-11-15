import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Cell } from '@antv/x6'

interface PanelStore {
  panelVisible: boolean
  togglePanel: () => {}
  currentSelectedNode: null | Cell
}

export const usePanelStore = defineStore('Panel', () => {
  const panelVisible = ref(false)
  const currentSelectedNode = ref<null | Cell>(null)

  const togglePanel = (visible: boolean) => {
    panelVisible.value = visible ?? !panelVisible.value
  }

  const setNode = (node: Cell) => {
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
