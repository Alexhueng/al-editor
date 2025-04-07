<template>
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="position.x"
    :y="position.y"
    :options="options"
    :show="visible"
    :on-clickoutside="onClickoutside"
    @select="handleSelect"
  >
    <div v-show="false">trigger</div>
  </n-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NDropdown } from 'naive-ui'

const options = [
  {
    label: '杰·盖茨比',
    key: 'jay gatsby',
  },
  {
    label: '黛西·布坎南',
    key: 'daisy buchanan',
  },
  {
    type: 'divider',
    key: 'd1',
  },
  {
    label: '尼克·卡拉威',
    key: 'nick carraway',
  },
]

const visible = ref(false)
const x = ref(undefined)
const y = ref(undefined)
const position = ref<{ x: number | undefined; y: number | undefined }>({
  x: undefined,
  y: undefined,
})

const show = (x: number, y: number, event: any) => {
  visible.value = true
  position.value = { x, y }
}

const handleSelect = () => {}

const onClickoutside = () => {
  visible.value = false
}

defineExpose({ show })
</script>
