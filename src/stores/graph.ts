import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Graph } from '@antv/x6'

export const useGraphStore = defineStore('graph', () => {
  const graph = ref<Graph | null>(null)

  const setGraph = (value: Graph) => {
    graph.value = value
  }
  return { graph, setGraph }
})
