<template>
  <n-dropdown
    :options="options"
    key-field="label"
    :render-label="renderLabel"
    placement="bottom-start"
    @select="handleSelect"
  >
    <span class="p-4 text-[#3f3f3f] hover:text-primary hover:bg-[#f3f3f5]">图形调整</span>
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

import type { Cell } from '@antv/x6'
import type { DropdownOption } from 'naive-ui'

const graph = computed(() => {
  return useGraphStore().graph
})

type OptionItem = { click?: (key: string, option: DropdownOption) => void } & DropdownOption

const selectedCells = ref<Cell[]>([])
const angelVisible = ref(false)
const angel = ref<number | undefined>(undefined)

nextTick(() => {
  graph.value!.on('selection:changed', () => {
    selectedCells.value = graph.value!.getSelectedCells()
    // console.log(selectedCells.value[0])
    // const node = selectedCells.value[0]
    // const position = node.isNode() && node.getPosition()
    // const relativePosition = node.isNode() && node.getPosition({ relative: true })
    // // graph.value.
    // console.log(position)
    // console.log(relativePosition)
    // console.log(graph.value!.localToGraph(position))
  })
})

const isMoreThan1Selected = computed(() => {
  return selectedCells.value?.length >= 1
})
const isMoreThan2Selected = computed(() => {
  return selectedCells.value?.length >= 2
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
    {
      label: '移至最前',
      disabled: !isMoreThan1Selected.value,
      click: () => graph.value?._toFront(),
    },
    {
      label: '移至最后',
      disabled: !isMoreThan1Selected.value,
      click: () => graph.value?._toBack(),
    },
    {
      label: '上移一层',
      disabled: !isMoreThan1Selected.value,
      click: () => graph.value?._toUp(),
    },
    {
      label: '下移一层',
      disabled: !isMoreThan1Selected.value,
      click: () => graph.value?._toDown(),
    },
    { type: 'divider' },
    {
      label: '方向',
      disabled: !isMoreThan1Selected.value,
      children: [
        // { label: '水平翻转' },
        // { label: '垂直翻转' },
        { label: '旋转', click: () => (angelVisible.value = true) },
      ],
    },
    {
      label: '旋转90°',
      disabled: !isMoreThan1Selected.value,
      click: () => graph.value?._rotate(90),
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
          disabled: !isMoreThan1Selected.value,
          click: () => graph.value?._alignToGrid(),
        },
      ].map((item) => {
        return {
          ...item,
          disabled: item.disabled ?? !isMoreThan2Selected.value,
        }
      }),
    },
    { label: '插入', children: [{ label: '图片' }, { label: '自由绘图' }] },
    {
      label: '布局',
      children: [
        { label: '水平树' },
        { label: '垂直树' },
        { label: '径向树' },
        { label: '环形' },
        { label: '椭圆' },
        { label: '力导向' },
      ],
    },
    { type: 'divider' },
    { label: '组合' },
    { label: '取消组合' },
    { label: '移出组合' },
    { type: 'divider' },
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
