import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Cell, Node, Edge } from '@antv/x6'

interface PanelStore {
  panelVisible: boolean
  togglePanel: () => {}
  currentSelectedNode: Cell | null
  setNode: (node: Cell) => {}
  getNode: () => Cell | null
}

export const usePanelStore = defineStore('Panel', () => {
  const panelVisible = ref(false)
  const currentSelectedNode = ref<PanelStore['currentSelectedNode']>(null)

  const togglePanel = (visible: boolean) => {
    panelVisible.value = visible ?? !panelVisible.value
  }

  const setCell = (cell: Cell | null) => {
    currentSelectedNode.value = cell
  }

  const getCell = () => {
    return currentSelectedNode.value
  }

  return {
    panelVisible,
    togglePanel,
    setCell,
    getCell,
    currentSelectedNode,
  }
})
