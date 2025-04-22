<template>
  <n-dropdown
    :options="options"
    key-field="label"
    :render-label="renderLabel"
    placement="bottom-start"
    @select="handleSelect"
  >
    <span class="p-4 text-[#202942] hover:text-primary hover:bg-[#f3f3f5]">图形调整</span>
  </n-dropdown>

  <Modal
    v-model:visible="angelVisible"
    title="旋转角度(0-360)"
    draggable
    @confirm="handleAngelConfirm"
    @close="handleAngelClose"
  >
    <div>
      <n-input-number v-model:value="angel" placeholder="请输入角度值" :min="0" :max="360" />
    </div>
  </Modal>

  <InsertImage v-model:visible="insertImageVisible" />
</template>

<script lang="tsx" setup>
import {
  ref,
  computed,
  onMounted,
  nextTick,
  toRef,
  shallowRef,
  type VNode,
  type VNodeChild,
} from 'vue'
import { useGraphStore } from '@/stores/graph'
import Modal from '@/components/Modal/index.vue'
import InsertImage from './insertImage/index.vue'
import { zIndexOperations } from '../contextMenu/commonOperations'

import type { Cell } from '@antv/x6'
import type { DropdownOption } from 'naive-ui'

const graph = computed(() => {
  return useGraphStore().graph
})

type OptionItem = { click?: (key: string, option: DropdownOption) => void } & DropdownOption

const selectedCells = ref<Cell[]>([])
const selectedNodes = ref<Node[]>([])
const angelVisible = ref(false)
const angel = ref<number | undefined>(undefined)
const insertImageVisible = ref(false)

nextTick(() => {
  graph.value!.on('selection:changed', () => {
    selectedCells.value = graph.value!.getSelectedCells()
    selectedNodes.value = graph.value!.getSelectedNodes()
  })
})

const handleAngelConfirm = ({ resolve, reject }: { resolve: () => void; reject: () => void }) => {
  if (!angel.value) return reject()
  graph.value?._rotate(angel.value!)
  resolve()
}

const handleAngelClose = () => {
  angel.value = undefined
}

const options = computed(() => {
  return [
    ...zIndexOperations.map((item) => {
      return {
        ...item,
        disabled: selectedCells.value.length < 1,
      }
    }),
    { type: 'divider' },
    {
      label: '方向',
      disabled: !selectedNodes.value.length,
      children: [
        // { label: '水平翻转' },
        // { label: '垂直翻转' },
        { label: '旋转', click: () => (angelVisible.value = true) },
      ],
    },
    {
      label: '旋转90°',
      disabled: !selectedNodes.value.length,
      click: () => graph.value?._rotate(90, undefined, { absolute: false }),
    },
    { type: 'divider' },
    {
      label: '对齐',
      disabled: !selectedCells.value?.length,
      children: [
        { label: '左对齐', click: () => graph.value?._alignLeft() },
        { label: '水平居中', click: () => graph.value?._alignHorizontally() },
        { label: '右对齐', click: () => graph.value?._alignRight() },
        { type: 'divider' },
        { label: '向上对齐', click: () => graph.value?._alignTop() },
        { label: '垂直居中', click: () => graph.value?._alignVertically() },
        { label: '向下对齐', click: () => graph.value?._alignBottom() },
        { type: 'divider' },
        {
          label: '对齐到网格',
          disabled: !selectedNodes.value.length,
          click: () => graph.value?._alignToGrid(),
        },
      ].map((item) => {
        return {
          ...item,
          disabled: item.disabled ?? selectedNodes.value.length <= 1,
        }
      }),
    },
    {
      label: '插入',
      children: [
        {
          label: '图片',
          click: () => {
            insertImageVisible.value = true
          },
        },
        // { label: '自由绘图' },
      ],
    },
    // {
    //   label: '布局',
    //   children: [
    //     { label: '水平树' },
    //     { label: '垂直树' },
    //     { label: '径向树' },
    //     { label: '环形' },
    //     { label: '椭圆' },
    //     { label: '力导向' },
    //   ],
    // },
    // { type: 'divider' },
    // { label: '组合' },
    // { label: '取消组合' },
    // { label: '移出组合' },
    // { type: 'divider' },
  ] as OptionItem[]
})

const renderLabel = (option: DropdownOption): VNodeChild => {
  return <div class="w-[150px]">{option.label}</div>
}

const handleSelect = (key: string, option: DropdownOption) => {
  if (option.click && typeof option.click === 'function') {
    option.click(key, option)
  }
}
</script>
