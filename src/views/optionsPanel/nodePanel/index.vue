<template>
  <n-tabs type="segment" animated>
    <n-tab-pane name="chap1" display-directive="show" tab="样式">
      <StylePanel />
    </n-tab-pane>
    <n-tab-pane name="chap2" display-directive="show" tab="文本">
      <TextPanel />
    </n-tab-pane>
    <n-tab-pane name="chap3" display-directive="show" tab="图形调整">
      <TransformPanel />
    </n-tab-pane>
  </n-tabs>
</template>

<script lang="ts" setup>
import { ref, watch, computed, reactive } from 'vue'
import { usePanelStore } from '@/stores/panel'
import type { Node, Size } from '@antv/x6'
import StylePanel from './style.vue'
import TextPanel from './text.vue'
import TransformPanel from './transform.vue'

const panelStore = usePanelStore()
</script>
