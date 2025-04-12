<template>
  <div>
    <div class="xuxian"></div>
    <div class="text-[14px] mb-1 font-bold">背景颜色</div>

    <div class="flex flex-wrap p-2 pb-0">
      <div
        v-for="(item, index) in presetColors"
        :key="index"
        class="w-[55px] h-[55px] mr-4 mb-4 flex-grow cursor-pointer border box-border border-[#dedede] hover:border-[#000] rounded hover:scale-[1.01] transition-all duration-300 ease-in-out"
        :class="[(index + 1) % 6 ? 'mr-4' : 'mr-0', typeof item === 'string' ? '' : item.cls]"
        :style="{ background: typeof item === 'string' ? item : undefined }"
        @click="handleUpdateColor(typeof item === 'string' ? item : item?.color)"
      ></div>
    </div>

    <n-color-picker
      v-model:value="backgroundColor"
      :modes="['rgb', 'hex', 'hsl']"
      @update:value="handleUpdateColor"
    />

    <n-space justify="space-between" class="h-[40px]" align="center">
      <n-checkbox v-model:checked="isBorder" @update:checked="handleChangeBorder">
        <span class="text-[14px] mb-1 font-bold"> 边框</span>
      </n-checkbox>
      <n-color-picker
        v-show="isBorder"
        v-model:value="borderColor"
        :modes="['rgb', 'hex', 'hsl']"
        class="w-[200px]"
        @update:value="handleUpdateBorderColor"
      />
    </n-space>
    <n-space v-show="isBorder" justify="space-between">
      <n-select
        v-model:value="borderType"
        class="w-[200px]"
        :options="strokeWidthList"
        :render-label="renderLabel"
        @update:value="handleBorderType"
      >
      </n-select>
      <n-input-number
        v-model:value="strokeWidth"
        class="w-[200px]"
        :min="0"
        @update:value="handleBorderWidth"
      />
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted, h, onBeforeUnmount } from 'vue'
import { usePanelStore } from '@/stores/panel'
import { useGraphStore } from '@/stores/graph'
import { colors } from '@/views/editor/consts'

// import types
import type { Node, Size } from '@antv/x6'
import type { SelectGroupOption, SelectOption } from 'naive-ui'
import type { VNodeChild } from 'vue'

const panelStore = usePanelStore()

const node = computed(() => {
  return panelStore.getCell()! as Node
})

const graph = computed(() => {
  return useGraphStore().graph!
})

const backgroundColor = ref('')
const isBorder = ref(true)
const borderColor = ref('')
const strokeWidth = ref(0)
const borderType = ref('')

// toto https://www.zhongguose.com/ 从中精心挑选一些颜色作为预设
const presetColors = [
  {
    color: 'transparent',
    cls: 'tp',
  },
  '#fff',
  '#000',
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#607d8b',
  '#9e9e9e',
  '#546e7a',
  // '#455a64',
  // '#37474f',
  '#263238',
]

const strokeWidthList = [
  { label: '实线', value: '0', labelClass: 'border-b-[1px] border-[#000] h-[1px] w-[200px]' },
  { label: '短间隔虚线', value: '1', labelClass: 'border-dashed' },
  { label: '长间隔虚线', value: '5,5', labelClass: 'dashed-2' },
  { label: '等长虚线', value: '10,5', labelClass: 'dashed-3' },
  { label: '长短虚线', value: '15,5,3,5', labelClass: 'dashed-4' },
]

const defaultBorderType = strokeWidthList[0].value

const initNode = () => {
  if (!node.value || !node.value.isNode()) return
  backgroundColor.value = node.value?.getAttrByPath('body/fill')
  const stroke = node.value?.getAttrByPath('body/stroke')
  borderColor.value = node.value?.getAttrByPath('body/stroke')
  isBorder.value = !!stroke
  strokeWidth.value = node.value?.getAttrByPath('body/strokeWidth') || 0
  borderType.value = node.value?.getAttrByPath('body/strokeDasharray') || defaultBorderType
}

onMounted(() => {
  initNode()
  graph.value.on('selection:changed', () => {
    initNode()
  })
})

onBeforeUnmount(() => {
  graph.value.off('selection:changed')
})

const handleUpdateColor = (value: string) => {
  backgroundColor.value = value
  node.value.setAttrs({
    body: {
      fill: value,
    },
  })
}

const handleChangeBorder = (value: boolean) => {
  isBorder.value = value
  if (value) {
    borderColor.value = colors.primary
    strokeWidth.value = 1
    borderType.value = defaultBorderType
  }
  node.value.setAttrs({
    body: {
      strokeWidth: value ? 1 : 0,
      stroke: value ? colors.primary : '',
      strokeDasharray: value ? defaultBorderType : '',
    },
  })
}

const handleUpdateBorderColor = (value: string) => {
  borderColor.value = value
  node.value.setAttrs({
    body: {
      stroke: value,
    },
  })
}

const renderLabel = (option: SelectOption): VNodeChild => {
  const baseClass = 'border-b-[1px] border-[#000] h-[1px] w-[200px]'
  return h(
    'div',
    { class: 'w-full flex  items-center h-[30px]', title: option.label },
    h('div', {
      class: baseClass + ' ' + option.labelClass,
    }),
  )
}

const handleBorderType = (value: string) => {
  node.value.setAttrs({
    body: {
      strokeDasharray: value,
    },
  })
}

const handleBorderWidth = (value: number) => {
  strokeWidth.value = value
  node.value.setAttrs({
    body: {
      strokeWidth: value,
    },
  })
}
</script>

<style lang="scss">
.dashed-2 {
  border: none;
  background-image: linear-gradient(90deg, #000 25%, transparent 0%);
  background-size: 20px 1px;
}

.dashed-3 {
  border: none;
  border-bottom-style: none;
  background-image: linear-gradient(to right, black 50%, transparent 0%);
  background-size: 40px 1px;
}

.dashed-4 {
  border: none;
  border-bottom-style: none;
  background-image: linear-gradient(
    to right,
    black 45%,
    transparent 45%,
    transparent 65%,
    black 65%,
    black 75%,
    transparent 0
  );
  background-size: 60px 1px;
}

.trans {
  width: 36px;
  height: 24px;
  margin: 0px 6px 6px 0px;
  background: linear-gradient(45deg, black 50%, transparent 50%);
  border: 1px solid #ccc;
  border-radius: 2px;
}
</style>
