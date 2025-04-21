<template>
  <n-dropdown
    :options="options"
    key-field="label"
    :render-label="renderLabel"
    placement="bottom-start"
    @select="handleSelect"
  >
    <span class="p-4 text-[#202942] hover:text-primary hover:bg-[#f3f3f5]">帮助</span>
  </n-dropdown>

  <Modal v-model:visible="visible" title="快捷键列表" draggable>
    <div class="w-full h-full">
      <n-table size="small" :bordered="false" :single-line="false" striped>
        <thead>
          <tr class="text-center">
            <th>操作</th>
            <th>快捷键</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.label" class="text-center">
            <td>{{ item.label }}</td>
            <td class="w-[60%]">{{ Array.isArray(item.key) ? item.key.join('、') : item.key }}</td>
          </tr>
        </tbody>
      </n-table>
    </div>
    <template #footer="{ close }">
      <div class="flex justify-center">
        <n-button type="primary" @click="close">知道了</n-button>
      </div>
    </template>
  </Modal>
</template>

<script lang="tsx" setup>
import { ref, computed, nextTick, type VNode, type VNodeChild } from 'vue'
import { useGraphStore } from '@/stores/graph'
import Modal from '@/components/Modal/index.vue'

import type { Cell } from '@antv/x6'
import type { DropdownOption } from 'naive-ui'
import * as SHORTCUT_KEYS from '@/views/editor/useKeyboard/shortcutKeys'

const graph = computed(() => {
  return useGraphStore().graph
})

type OptionItem = { click?: (key: string, option: DropdownOption) => void } & DropdownOption

const list = [
  { label: '撤销', key: SHORTCUT_KEYS.UNDO },
  { label: '重做', key: SHORTCUT_KEYS.REDO },
  { label: '复制', key: SHORTCUT_KEYS.COPY },
  { label: '剪切', key: SHORTCUT_KEYS.CUT },
  { label: '粘贴', key: SHORTCUT_KEYS.PASTE },
  { label: '全选', key: SHORTCUT_KEYS.SELECT_ALL },
  { label: '删除', key: SHORTCUT_KEYS.DELETE },
  { label: '旋转90°', key: SHORTCUT_KEYS.ROTATE_90 },
  { label: '画布拖拽', key: '按住鼠标右键拖动' },
  { label: '框选', key: '按住鼠标左键拖动' },
  { label: '右键菜单', key: '点击鼠标右键' },
  { label: '全屏', key: SHORTCUT_KEYS.FULL_SCREEN },
  { label: '...', key: ['...'] },
]

const visible = ref(false)

const options = computed(() => {
  return [
    {
      label: '快捷键列表',
      click: () => (visible.value = true),
    },
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
