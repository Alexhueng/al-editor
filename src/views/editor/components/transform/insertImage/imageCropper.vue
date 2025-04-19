<template>
  <n-spin :show="loading" class="w-full">
    <div class="mb-2">
      <n-input
        v-model:value="networdAddress"
        placeholder="请输入网络图片链接或在下方上传图片"
        :disabled="loading"
        @change="handleImageChange"
      />
    </div>

    <n-upload
      ref="uploadRef"
      v-show="!imageSrc"
      directory-dnd
      :max="1"
      :file-list="fileList"
      accept="image/*"
      @change="handleImageUpload"
    >
      <n-upload-dragger>
        <div class="flex justify-center mb-4">
          <svg-icon name="upload" size="40" class="mr-2"></svg-icon>
        </div>
        <n-text class="text-[16px]"> 点击或者拖动文件到该区域来上传 </n-text>
        <n-p class="text-[14px]"> 图片最大不超过500KB </n-p>
      </n-upload-dragger>
    </n-upload>

    <div v-if="imageSrc" class="flex mt-6 mb-2">
      <div class="w-[60%] pl-4">
        <img ref="imageRef" :src="imageSrc" alt="待裁剪图片" class="cropper-image h-[400px]" />

        <div class="action-buttons">
          <n-button-group>
            <n-button
              round
              :type="dragMode === 'move' ? 'primary' : 'default'"
              @click="handleDragMode('move')"
            >
              <template #icon>
                <svg-icon name="move" size="20" />
              </template>
            </n-button>
            <n-button
              round
              :type="dragMode === 'crop' ? 'primary' : 'default'"
              @click="handleDragMode('crop')"
            >
              <template #icon>
                <svg-icon name="crop" size="20" />
              </template>
            </n-button>
          </n-button-group>

          <n-button-group>
            <n-button round @click="handleFlip('x')">
              <template #icon>
                <svg-icon name="flip" size="20" />
              </template>
            </n-button>
            <n-button round @click="handleFlip('y')">
              <template #icon>
                <svg-icon name="flip" size="20" class="rotate-90" />
              </template>
            </n-button>
            <n-button round @click="handleZoom('plus')">
              <template #icon>
                <svg-icon name="plus" size="20" />
              </template>
            </n-button>
            <n-button round @click="handleZoom('minus')">
              <template #icon>
                <svg-icon name="minus" size="20" />
              </template>
            </n-button>
            <n-button>
              <template #icon>
                <svg-icon name="download" size="20" @click="downloadImage" />
              </template>
            </n-button>
            <n-button round @click="reset">
              <template #icon>
                <svg-icon name="reset" size="20" />
              </template>
            </n-button>
          </n-button-group>

          <n-button round @click="clear">重新上传 </n-button>
        </div>
      </div>

      <div class="flex flex-col items-center w-[40%]">
        <div class="mb-4 font-bold preview-title">预览</div>
        <div class="preview-image w-[300px] h-[300px]" ref="previewRef"></div>
      </div>
    </div>
  </n-spin>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineExpose } from 'vue'
import { useMessage, NUpload } from 'naive-ui'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { isImageFile, isWebImageUrl } from '@/utils'

const imageRef = ref(null)
const previewRef = ref(null)
const imageSrc = ref('')
const uploadRef = ref<typeof NUpload | null>(null)
const fileList = ref<any[]>([])
const cropper = ref<Cropper | null>(null)
const croppedImage = ref('')
const networdAddress = ref('')
const loading = ref(false)

const message = useMessage()
const dragMode = ref<Cropper.DragMode>('move')
const initialData = ref<Cropper.Data>()

// 初始化Cropper实例
const initCropper = () => {
  if (imageRef.value) {
    cropper.value = new Cropper(imageRef.value, {
      // aspectRatio: 1, // 1:1比例
      viewMode: 1, // 限制裁剪框不超过图片范围
      autoCropArea: 1, // 初始裁剪区域占图片80%
      responsive: true,
      preview: previewRef.value!,
      dragMode: dragMode.value,
      ready: () => {
        initialData.value = cropper.value?.getData()
      },
    })
  }
}

const handleDragMode = (value: Cropper.DragMode) => {
  dragMode.value = value
  cropper.value?.setDragMode(value)
}

const handleFlip = (value: 'x' | 'y') => {
  const data = cropper.value?.getData()
  if (value === 'x') {
    cropper.value?.scaleX(-data!.scaleX)
  } else {
    cropper.value?.scaleY(-data!.scaleY)
  }
}

const handleZoom = (value: 'plus' | 'minus') => {
  if (value === 'plus') {
    cropper.value?.zoom(0.1)
  } else {
    cropper.value?.zoom(-0.1)
  }
}

const renderCropper = (src: string) => {
  imageSrc.value = src
  if (cropper.value) {
    cropper.value.destroy()
  }
  setTimeout(initCropper, 0)
}

const handleImageChange = (value: string) => {
  if (!value || !isWebImageUrl(value)) {
    imageSrc.value = ''
    return
  }
  loading.value = true
  urlToBase64Fetch(value)
    .then((base64) => {
      renderCropper(base64 as string)
    })
    .finally(() => {
      loading.value = false
    })
}

async function urlToBase64Fetch(url: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP错误! 状态码: ${response.status}`)

    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (err) {
    message.error('图片加载失败, 请传入正确的图片链接')
    throw err
  }
}

const handleImageUpload = (e: any) => {
  if (!e.file) return
  const file = e.file.file
  if (file.size > 500 * 1024) {
    fileList.value = []
    message.warning('文件大小不超过500KB')
    return
  }
  if (!isImageFile(file.name)) {
    fileList.value = []
    message.warning('请上传正确的图片文件')
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    fileList.value.push(file)
    renderCropper(event.target!.result as string)
  }
  reader.readAsDataURL(file)
}

const clear = () => {
  imageSrc.value = ''
  networdAddress.value = ''
  croppedImage.value = ''
  fileList.value = []
  initialData.value = undefined
  cropper.value?.destroy()
}

const hasBeenCropped = () => {
  const currentData = cropper.value?.getData()
  return (
    initialData.value?.width !== currentData?.width ||
    initialData.value?.height !== currentData?.height
  )
}

const crop = () => {
  cropper.value?.crop()
}

// 裁剪图片
const cropImage = () => {
  const canvas = cropper.value!.getCroppedCanvas({
    width: 300,
    height: 300,
    minWidth: 256,
    minHeight: 256,
    maxWidth: 4096,
    maxHeight: 4096,
    fillColor: '#fff',
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
  })

  return canvas.toDataURL('image/jpeg', 0.9)
}

const downloadImage = () => {
  const link = document.createElement('a')
  link.href = cropImage()
  link.download = 'cropped-image.jpg'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const getImage = () => {
  return imageSrc.value
}

const reset = () => {
  cropper.value!.reset()
}

onBeforeUnmount(() => {
  cropper.value?.destroy?.()
})

defineExpose({
  cropImage,
  clear,
  getImage,
  hasBeenCropped,
  getData: () => {
    return cropper.value?.getData()
  },
  cropper: cropper.value,
})
</script>

<style scoped>
.preview-image {
  overflow: hidden;
  border: 1px solid #ddd;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

/* :deep(cropper-canvas) {
  height: 400px !important;
} */
</style>
