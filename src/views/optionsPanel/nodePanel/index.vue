<template>
  <n-tabs type="segment" animated>
    <n-tab-pane name="chap1" tab="样式"> </n-tab-pane>
    <n-tab-pane name="chap2" tab="文本">
      <TextPanel />
    </n-tab-pane>
    <n-tab-pane name="chap3" tab="图形调整">
      <TransformPanel />
    </n-tab-pane>
  </n-tabs>
</template>

<script lang="ts" setup>
import { ref, watch, computed, reactive } from 'vue'
import { usePanelStore } from '@/stores/panel'
import type { Node, Size } from '@antv/x6'
import TransformPanel from './transform.vue'
import TextPanel from './text.vue'

const panelStore = usePanelStore()
</script>
