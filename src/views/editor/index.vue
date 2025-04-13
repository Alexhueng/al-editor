<template>
  <div class="flex w-full h-full">
    <div id="stencil" :style="{ width: stencilWidth + 'px' }"></div>

    <Toolbar />
    <div
      id="graph-container"
      class="mt-[50px]"
      :style="{ width: `calc(100% - ${stencilWidth + controlPanelWidth}px)` }"
    />
    <div class="graph-control-panel" :style="{ width: controlPanelWidth + 'px' }">
      <GraphControlPanel />
    </div>

    <TeleportContainer />

    <OptionsPanel :mask="false" />
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
import { useRegisterNode } from './registerNode'
import { useStencil } from './stencil'

import OptionsPanel from '@/views/optionsPanel/index.vue'
import GraphControlPanel from '@/views/optionsPanel/graph.vue'
import Toolbar from './components/toolbar/index.vue'

const route = useRoute()
const TeleportContainer = getTeleport()
const graphStore = useGraphStore()
let graph: useGraph | null = null

onMounted(() => {
  preWork()

  graph = new useGraph()

  graphStore.setGraph(graph)

  useRegisterNode()
  usePlugins(graph)
  useEvents(graph)
  useKeyboard(graph)
  useStencil(graph)

  if (graph.persistence.hasUnsaved()) {
    graph.persistence.restore()
  } else {
    if (!route.params.name) return
    graph._fromLocalJSON(route.params.name as string).centerContent()
    graph.persistence.save()
  }
})

onBeforeUnmount(() => {
  graph!.persistence!.remove()
})
</script>

<style lang="scss" scoped></style>
