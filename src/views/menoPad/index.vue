<template>
  <FloatBoard :position="position" :fullscreen="false" title="便签本">
    <div class="h-[300px] w-full" ref="menoPadRef"></div>
  </FloatBoard>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef, computed, watch, nextTick } from 'vue'
import { Graph } from '@antv/x6'
import { useGraphStore } from '@/stores/graph'
import { AutoWrapLayout } from './gridLayout'

import FloatBoard from '@/views/editor/components/floatBoard/index.vue'

const memoPadData = computed(() => {
  return useGraphStore().memoPad
})

const menoPadRef = useTemplateRef('menoPadRef')
const position = ref({ x: 300, y: 50 })

const graph = ref<Graph | null>(null)

const layout = (data: any) => {
  const gridLayout = new AutoWrapLayout({
    itemHeight: 40,
    itemWidth: 80,
    // hGap: 10,
    containerWidth: 300,
  })

  const model = gridLayout.execute(data)
  graph.value?.fromJSON(model)
}

watch(
  () => memoPadData.value,
  (newVal) => {
    nextTick(() => {
      layout(newVal)
    })
  },
  {
    deep: true,
    immediate: true,
  },
)

onMounted(() => {
  graph.value = new Graph({
    container: menoPadRef.value!,
    panning: {
      enabled: false,
    },
    interacting: false,
  })
})
</script>
