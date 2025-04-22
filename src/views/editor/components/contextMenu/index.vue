<template>
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="position.x"
    :y="position.y"
    :options="options"
    :show="visible"
    key-field="label"
    class="min-w-[200px]"
    :on-clickoutside="onClickoutside"
    @select="handleSelect"
  >
    <div v-show="false">trigger</div>
  </n-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NDropdown } from 'naive-ui'
import type { DropdownOption } from 'naive-ui'
import type { InitParameters } from '.'

const visible = ref(false)
const position = ref<{ x?: number; y?: number }>({
  x: undefined,
  y: undefined,
})

const eventTarget = ref<any>(null)

const options = ref<OptionItem[]>([])

const init = (data: InitParameters) => {
  options.value = data.options
  position.value = data.position
  eventTarget.value = data.event
}

const show = () => {
  visible.value = true
}

const handleSelect = (key: string, option: DropdownOption) => {
  if (option.click && typeof option.click === 'function') {
    option.click(key, option)
  }
  visible.value = false
}

const onClickoutside = () => {
  visible.value = false
}

defineExpose({
  init,
  show,
})
</script>
