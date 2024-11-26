<template>
  <!-- 使用n-upload组件实现文件上传功能 -->
  <n-upload
    :show-upload-list="true"
    :before-upload="beforeUpload"
    :on-update:file-list="handleFileListUpdate"
    list-type="image-card"
    multiple
    action="#"
    :custom-request="handleFileSelect"
    :max="1"
  >
    <n-button>点击上传</n-button>
  </n-upload>
  <div class="image-list">
    <div
      v-for="(image, index) in selectedFiles"
      :key="index"
      class="image-item"
      @click="selectImage(index)"
    >
      <img :src="image.url" :class="{ selected: selectedIndex === index }" />
    </div>
  </div>
  <div>
    <n-form ref="formRef" inline :label-width="80" :model="formValue">
      <n-flex vertical>
        <n-form-item label="背景图片位置" path="position">
          <n-input v-model:value="formValue.position" placeholder="背景图片位置" />
        </n-form-item>
        <n-form-item label="背景图片大小" path="size">
          <n-input v-model:value="formValue.size" placeholder="背景图片大小" />
        </n-form-item>
        <n-form-item label="背景图片重复方式" path="repeat">
          <n-select v-model:value="formValue.repeat" :options="options" />
        </n-form-item>
      </n-flex>
    </n-form>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, defineEmits, watch } from 'vue'
// 已上传文件列表
const selectedFiles = ref([])
// 当前选中图片的索引
const selectedIndex = ref(-1)
const options = ref([
  {
    label: '水印效果',
    value: 'watermark',
  },
  {
    label: '水平翻转背景图片',
    value: 'flip-x',
  },
  {
    label: '垂直翻转背景图片',
    value: 'flip-y',
  },
  {
    label: '水平和垂直翻转背景图片',
    value: 'flip-xy',
  },
])
const formValue = ref({
  position: '',
  size: '',
  repeat: 'watermark',
  url: '',
})
const emit = defineEmits(['uploadSuccess'])

watch(
  () => formValue,
  (obj: any) => {
    emit('uploadSuccess', obj.value)
  },
  { deep: true },
)
interface FileType {
  name: string
  uid: number
  url: string
  status: string
  size: string
  files?: FileType
}
// 文件上传前的钩子函数，进行前置校验
const beforeUpload = (file: FileType) => {
  const allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif']
  const fileExtension = file.name?.split('.').pop().toLowerCase()
  if (!allowedImageTypes.includes(fileExtension)) {
    console.error('只允许选择图片文件')
    return false
  }
  return true
}

// 处理文件列表更新的函数，更新已上传文件列表信息
const handleFileListUpdate = (fileList: FileType[]) => {
  // selectedFiles.value = fileList
}

// 处理文件选择的函数，将选择的文件添加到selectedFiles列表中
const handleFileSelect = (files: FileType[]) => {
  // 如果files是数组（支持多选的情况），则遍历添加到selectedFiles列表
  let fileWithUrl: FileType = {
    name: '',
    uid: 1,
    url: '',
    status: '',
    size: '',
  }
  if (Array.isArray(files)) {
    files.forEach((file: FileType) => {
      // 确保传入的file是符合要求的文件对象，再生成临时URL地址
      if (file instanceof File) {
        const fileUrl = URL.createObjectURL(file)
        fileWithUrl = { ...file, url: fileUrl }
        selectedFiles.value.push(fileWithUrl)
      }
    })
  } else {
    // 处理只选择单个文件的情况，同样确保是File类型再生成URL
    if (files.file?.file instanceof File) {
      const fileUrl = URL.createObjectURL(files.file?.file)
      fileWithUrl = { ...files.file?.file, url: fileUrl }
      selectedFiles.value.push(fileWithUrl)
    }
  }
  formValue.value.url = fileWithUrl.url
  if (selectedFiles.value.length > 0) selectedIndex.value = selectedFiles.value.length - 1
}
// 点击图片时触发的方法，用于更新选中的索引
const selectImage = (index) => {
  selectedIndex.value = index
  formValue.value.url = selectedFiles.value[index].url
}
</script>

<style lang="scss">
.n-upload-file-list.n-upload-file-list--grid {
  display: flex;
  flex-wrap: wrap;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  > div {
    width: 25%;
    img {
      width: 100%;
    }
  }
}

.image-item {
  cursor: pointer;
}

.selected {
  border: 3px solid blue;
}
</style>
