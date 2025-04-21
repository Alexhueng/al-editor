<template>
  <n-modal
    :show="visible"
    v-bind="$attrs"
    :draggable="true"
    transform-origin="center"
    @update:show="close"
  >
    <template #default="{ draggableClass }">
      <div class="bg-white rounded" :style="{ width: width + 'px' }">
        <div
          v-if="$attrs.title || $slots.title"
          :class="draggableClass"
          class="p-4 font-bold modal-header"
        >
          <slot name="title">
            {{ $attrs.title }}
          </slot>
        </div>
        <div class="px-4" :class="[footer ? 'pb-0' : 'pb-4']">
          <slot></slot>
        </div>
        <div v-if="footer || $slots.footer" class="p-4">
          <slot name="footer" :close="close">
            <n-space justify="center">
              <n-button class="w-[80px]" @click="close">取消</n-button>
              <n-button class="w-[80px]" :loading="confirmLoading" type="primary" @click="confirm">
                确定
              </n-button>
            </n-space>
          </slot>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, defineEmits, defineProps } from 'vue'

const emit = defineEmits(['update:visible', 'close', 'confirm'])
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  footer: {
    type: Boolean,
    default: true,
  },
  width: {
    type: [String, Number],
    default: 500,
  },
})

const confirmLoading = ref(false)

const close = () => {
  emit('close')
  emit('update:visible', false)
}

const confirm = () => {
  confirmLoading.value = true

  const resolve = () => {
    confirmLoading.value = false
    close()
  }

  const reject = () => {
    confirmLoading.value = false
  }

  emit('confirm', {
    resolve,
    reject,
  })
}
</script>
