<template>
  <a-drawer
    v-model:open="panelStore.panelVisible"
    class="custom-class"
    root-class-name="root-class-name"
    :root-style="{ color: 'blue' }"
    style="color: red"
    :title="null"
    placement="right"
  >
    <a-input placeholder="请输入节点内容" @change="handleNodeContentChange" />
  </a-drawer>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { usePanelStore } from '@/stores/panel'

const panelStore = usePanelStore()

const handleNodeContentChange = (evt: any) => {
  const value = evt.target.value
  panelStore.currentSelectedNode?.setProp({
    text: value,
  })
}
</script>
