<template>
  <div
    class="absolute top-0 h-[50px] bg-white p-2"
    :style="{ left: stencilWidth + 'px', right: controlPanelWidth + 'px' }"
  >
    <div class="flex justify-between">
      <n-space>
        <n-button>撤销</n-button>
        <n-button>全选</n-button>
      </n-space>
      <div>
        <n-button @click="handleSave">保存</n-button>
        <n-button @click="handleRender">渲染</n-button>
        <n-button @click="handleExport">导出</n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { stencilWidth, controlPanelWidth } from './consts'
import { useGraphStore } from '@/stores/graph'
import data from './data.json'

const graphStore = useGraphStore()

const handleSave = () => {
  const graph = graphStore.graph
  if (graph) {
    const json = graph.toJSON()
    console.log(json)
    console.log(JSON.stringify(json))
  }
}

const handleRender = () => {
  const graph = graphStore.graph
  if (graph) {
    graph.fromJSON(data)
  }
}

const handleExport = () => {}
</script>
