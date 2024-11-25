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
  >
    <n-button>点击上传</n-button>
  </n-upload>
  <div>
    <n-form ref="formRef" inline :label-width="80" :model="formValue">
      <n-form-item label="背景图片位置" path="position">
        <n-input v-model:value="formValue.position" placeholder="背景图片位置" />
      </n-form-item>
      <n-form-item label="背景图片大小" path="size">
        <n-input v-model:value="formValue.size" placeholder="背景图片大小" />
      </n-form-item>
      <n-form-item label="背景图片重复方式" path="repeat">
        <n-select v-model:value="formValue.repeat" :options="options" />
      </n-form-item>
    </n-form>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, defineEmits } from 'vue'
// 已上传文件列表
const selectedFiles = ref([])
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
  repeat: '',
})
const emit = defineEmits(['uploadSuccess'])

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
      } else {
        console.error('传入的参数不是File类型的文件对象', file)
      }
    })
  } else {
    // 处理只选择单个文件的情况，同样确保是File类型再生成URL
    if (files.file?.file instanceof File) {
      const fileUrl = URL.createObjectURL(files.file?.file)
      fileWithUrl = { ...files.file?.file, url: fileUrl }
      selectedFiles.value.push(fileWithUrl)
    } else {
      console.error('传入的参数不是File类型的文件对象', files.file?.file)
    }
  }
  if (selectedFiles.value.length > 0) {
    emit('uploadSuccess', fileWithUrl.url)
  }
  console.log('上点击发送考虑', fileWithUrl)
}
</script>
