<template>
  <Modal
    v-model:visible="_visible"
    draggable
    :width="1000"
    @confirm="handleConfirm"
    @close="handleClose"
  >
    <template #title>
      <span class="flex items-center">
        插入图片
        <n-tooltip trigger="hover" placement="top-start">
          <template #trigger>
            <svg-icon name="tip" class="ml-2 w-fit" color="#18a058" />
          </template>
          支持的图片格式有:
          {{ IMAGE_EXTENSIONS.join(', ') }}
        </n-tooltip>
      </span>
    </template>
    <div class="w-full h-full">
      <ImageCropper ref="cropperRef" />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { defineProps, ref, nextTick } from 'vue'
import { useVModel } from '@vueuse/core'
import Modal from '@/components/Modal/index.vue'
import ImageCropper from './imageCropper.vue'
import { useGraphStore } from '@/stores/graph'
import { IMAGE_EXTENSIONS } from '@/utils'

const props = defineProps({
  visible: { type: Boolean, default: false },
})

const graphStore = useGraphStore()
const _visible = useVModel(props, 'visible')
const cropperRef = ref<typeof ImageCropper | null>(null)

const handleConfirm = ({ resolve, reject }: { resolve: () => void; reject: () => void }) => {
  const hasBeenCropped = cropperRef.value!.hasBeenCropped()
  let data = null
  if (hasBeenCropped) {
    data = cropperRef.value!.cropImage()
  } else {
    data = cropperRef.value!.getImage()
  }
  const _data = cropperRef.value!.getData()
  cropperRef.value!.clear()
  graphStore.graph?.addNode({
    shape: 'normal-image',
    x: 0,
    y: 0,
    width: _data.width,
    height: _data.height,
    imageUrl: data,
  })
  resolve()
}

const handleClose = () => {
  _visible.value = false
}
</script>

<style lang="scss" scoped>
:deep(cropper-canvas) {
  height: 500px !important;
}
</style>
