<template>
  <div class="h-full pt-[60px] px-4">
    <n-tabs type="segment" animated>
      <n-tab-pane name="chap1" display-directive="show" tab="全局设置">
        <GraphOptions />
      </n-tab-pane>
      <!-- <n-tab-pane name="chap2" display-directive="show" tab="视图">
        <View />
      </n-tab-pane> -->
    </n-tabs>
  </div>
</template>

<script lang="ts" setup>
import { usePanelStore } from '@/stores/panel'
import GraphOptions from './graph.vue'
import View from './view.vue'

const panelStore = usePanelStore()
</script>
