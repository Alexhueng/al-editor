<template>
  <div class="flex w-full h-full">
    <div id="stencil" :style="{ width: stencilWidth + 'px' }"></div>

    <Toolbar />
    <div
      ref="graphContainer"
      id="graph-container-wrapper"
      class="flex-grow p-4 pr-0 pb-2 mt-[50px] w-auto bg-[#f1f3f4]"
      :style="{
        width: `calc(100% - ${stencilWidth + controlPanelWidth}px)`,
        height: `calc(100% - 50px)`,
      }"
    >
      <div id="graph-container" :style="{ height: `100%` }" />
    </div>
    <div class="graph-control-panel" :style="{ width: controlPanelWidth + 'px' }">
      <GraphControlPanel />
    </div>

    <TeleportContainer />

    <OptionsPanel :mask="false" />

    <!-- <FloatBoard :position="position" resizable title="便签本"> </FloatBoard> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { getTeleport } from '@antv/x6-vue-shape'
import { useGraphStore } from '@/stores/graph'
import { stencilWidth, controlPanelWidth } from './consts'
import { preWork } from './insertCss'
import { useGraph } from './useGraph'
import { usePlugins } from './plugins'
import { useRoute } from 'vue-router'
import { useEvents } from './useEvents'
import { useKeyboard } from './useKeyboard'
import { useStencil } from './stencil'

import OptionsPanel from '@/views/optionsPanel/index.vue'
import GraphControlPanel from '@/views/optionsPanel/graph.vue'
import Toolbar from './components/toolbar/index.vue'
import FloatBoard from './components/floatBoard/index.vue'

const route = useRoute()
const graphStore = useGraphStore()
const TeleportContainer = getTeleport()
let graph: useGraph | null = null
const graphContainer = ref(null)
const position = ref({ x: 300, y: 50 })

onMounted(() => {
  preWork()
  graph = new useGraph()

  graphStore.setGraph(graph)

  // useRegisterNode()
  usePlugins(graph)
  useEvents(graph)
  useKeyboard(graph)
  useStencil(graph)

  if (graph.persistence.hasUnsaved()) {
    graph.persistence.restore()
  } else {
    if (graphStore.currentGraphName) {
      graph._fromLocalJSON(graphStore.currentGraphName).centerContent()
      graph.persistence.save()
      graphStore.setCurrentGraphName('')
    }
  }
  graph.zoomTo(0.8)
})

onBeforeUnmount(() => {
  graph!.persistence!.remove()
})

const handleMouseMove = (e: MouseEvent) => {
  const a = graph!.clientToLocal(e.pageX, e.pageY)
}
</script>

<style lang="scss" scoped></style>
