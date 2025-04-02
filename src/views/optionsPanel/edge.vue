<template>
  <n-form label-placement="left">
    <n-form-item label="路由">
      <n-select
        v-model:value="form.router"
        :options="routerMap"
        @update:value="handleUpdateRouter"
      />
    </n-form-item>

    <n-form-item label="连线">
      <n-select
        v-model:value="form.connector"
        :options="connectorMap"
        @update:value="handleUpdateConnector"
      />
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { usePanelStore } from '@/stores/panel'
import type { Edge } from '@antv/x6'

const routerMap = [
  { value: 'normal', label: '正常' },
  { value: 'orth', label: '正交' },
  { value: 'oneSide', label: '受限正交' },
  { value: 'manhattan', label: '智能正交' },
  { value: 'metro', label: '智能地铁线' },
  { value: 'er', label: '实体关系' },
]

const connectorMap = [
  { value: 'normal', label: '简单连接器' },
  { value: 'rounded', label: '圆角连接器' },
  { value: 'smooth', label: '平滑连接器' },
]

const panelStore = usePanelStore()

const form = reactive<{
  router?: Edge.RouterData['name']
  connector?: Edge.ConnectorData['name']
}>({})

const edge = computed(() => {
  return panelStore.getCell()! as Edge
})

watch(
  () => panelStore.panelVisible,
  (value) => {
    if (value) {
      if (!edge.value.isEdge()) return
      form.router = edge.value.getRouter()?.name
      form.connector = edge.value.getConnector()?.name
    }
  },
  {
    immediate: true,
  },
)

const handleUpdateRouter = (value: string) => {
  edge.value.setRouter(value)
}

const handleUpdateConnector = (value: string) => {
  edge.value.setConnector(value)
}
</script>
