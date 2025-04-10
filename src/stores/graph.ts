import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Graph } from '@antv/x6'
import { useGraph } from '@/views/editor/useGraph'

export const useGraphStore = defineStore('graph', () => {
  const graph = ref<useGraph | null>(null)

  const setGraph = (value: useGraph) => {
    graph.value = value
  }
  return { graph, setGraph }
})
