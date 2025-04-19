import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useGraph } from '@/views/editor/useGraph'

// export const useGraphStore = defineStore('graph', () => {
//   const graph = ref<useGraph | null>(null)
//   const currentGraphName = ref('')
//   const edgeRandomColor = ref(false)

//   const setGraph = (value: useGraph) => {
//     graph.value = value
//   }
//   const setCurrentGraphName = (value: string) => {
//     currentGraphName.value = value
//   }

//   return { graph, setGraph, setCurrentGraphName, currentGraphName, edgeRandomColor }
// })

export const useGraphStore = defineStore({
  id: 'graph',
  state: () => ({
    graph: null as useGraph | null,
    currentGraphName: '',
    edgeRandomColor: false,
  }),
  actions: {
    setGraph(value: useGraph) {
      this.graph = value
    },
    setCurrentGraphName(value: string) {
      this.currentGraphName = value
    },
  },
})
