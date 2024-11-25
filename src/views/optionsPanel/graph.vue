<template>
  <div class="w-full p-4">
    <n-form :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <n-form-item label="背景颜色">
        <div class="w-full">
          <n-color-picker
            v-model:value="form.backgroundColor"
            :modes="['rgb', 'hex', 'hsl']"
            @update:value="handleUpdateColor"
          />
        </div>
      </n-form-item>
      <n-form-item label="背景图片" style="display: block">
        <n-flex vertical>
          <Upload @uploadSuccess="uploadSuccess" />
        </n-flex>
      </n-form-item>

      <n-form-item label="网格">
        <div class="w-full"></div>
      </n-form-item>

      <n-form-item label="画布平移">
        <div class="w-full"></div>
      </n-form-item>

      <n-form-item label="画布缩放">
        <div class="w-full"></div>
      </n-form-item>

      <n-form-item label="视口变换">
        <div class="w-full"></div>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch } from 'vue'
import { useGraphStore } from '@/stores/graph'
import Upload from '@/components/Upload.vue'

const form = reactive({
  backgroundColor: '#fff',
})

const graphStore = useGraphStore()

watch(
  () => graphStore.graph,
  (graph) => {
    if (graph) {
      setBackgroundColor()
    }
  },
)

const setBackgroundColor = () => {
  const background = graphStore.graph?.options?.background || {}
  if (background.color) {
    form.backgroundColor = background.color
  }
}

const uploadSuccess = (fileWithUrl: any) => {
  console.log(fileWithUrl, '是封建时代')
  graphStore.graph?.drawBackground({
    image: fileWithUrl,
  })
}
const handleUpdateColor = (value: string) => {
  graphStore.graph?.drawBackground({
    color: value,
  })
  setBackgroundColor()
}
</script>

<style lang="scss"></style>
