<template>
  <div class="w-full p-4 select-none">
    <n-form
      :model="form"
      :label-col="{ span: 4 }"
      :show-feedback="false"
      :wrapper-col="{ span: 20 }"
    >
      <n-form-item label="背景颜色">
        <div class="w-full">
          <n-color-picker
            v-model:value="form.backgroundColor"
            :modes="['rgb', 'hex', 'hsl']"
            @update:value="handleUpdateColor"
          />
        </div>
      </n-form-item>

      <!-- <n-form-item label="背景图片(仅支持png格式)" style="display: block">
        <n-flex vertical>
          <Upload @uploadSuccess="uploadSuccess" @valueChange="uploadSuccess" />
        </n-flex>
      </n-form-item> -->

      <n-form-item label="网格" class="mt-4">
        <template #label>
          <span class="mr-2">网格</span>
          <n-switch v-model:value="form.grid.visible" @update:value="handleUpdateGrid"></n-switch>
        </template>
        <div class="w-full text-[14px] text-[#666]">
          <div class="flex items-center mt-3 break-keep">
            类型
            <n-select
              v-model:value="form.grid.type"
              class="ml-3"
              :disabled="!form.grid.visible"
              :options="[
                { label: 'dot', value: 'dot' },
                { label: 'fixedDot', value: 'fixedDot' },
                { label: 'mesh', value: 'mesh' },
                // { label: 'doubleMesh', value: 'doubleMesh' },
              ]"
              @update:value="handleUpdateGrid"
            ></n-select>
          </div>

          <div class="flex items-center mt-3 break-keep">
            网格大小
            <n-slider
              v-model:value="form.grid.size"
              class="ml-3"
              :disabled="!form.grid.visible"
              :min="1"
              :max="20"
              @update:value="handleUpdateGrid"
            ></n-slider>
          </div>

          <div class="flex items-center mt-3 break-keep">
            网格颜色

            <n-color-picker
              v-model:value="form.grid.color"
              class="ml-3"
              :disabled="!form.grid.visible"
              :modes="['rgb', 'hex', 'hsl']"
              @update:value="handleUpdateGrid"
            />
          </div>

          <div class="flex items-center my-3 break-keep">
            线条厚度

            <n-slider
              v-model:value="form.grid.thickness"
              class="ml-3"
              :disabled="!form.grid.visible"
              :min="0.5"
              :step="0.5"
              :max="10"
              @update:value="handleUpdateGrid"
            ></n-slider>
          </div>
        </div>
      </n-form-item>

      <n-form-item label="画布缩放">
        <n-slider
          v-model:value="form.zoom"
          class="ml-3"
          :min="0.5"
          :step="0.1"
          :max="12"
          @update:value="handleUpdateZoom"
        ></n-slider>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch } from 'vue'
import { useGraphStore } from '@/stores/graph'
// import Upload from '@/components/Upload.vue'
import { GRAPH_DEFAULT_OPTIONS } from '@/views/editor/consts'

const form = reactive({
  backgroundColor: GRAPH_DEFAULT_OPTIONS.background.color,
  image: '',
  position: '' as any,
  repeat: '',
  size: '' as any,
  grid: {
    visible: GRAPH_DEFAULT_OPTIONS.grid,
    type: 'dot',
    size: 10,
    color: '#ccc',
    thickness: 0.5,
  },
  zoom: 1.2,
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

graphStore.graph?.on('scale', ({ sx, sy }) => {
  form.zoom = sx
})

const setBackgroundColor = () => {
  const background = graphStore.graph?.options?.background || {}
  if (background.color) {
    form.backgroundColor = background.color
  }
  form.image = background.image!
  form.position = background.position
  form.repeat = background.repeat!
  form.size = background.size
}

// const uploadSuccess = (obj: any) => {
//   graphStore.graph?.drawBackground({
//     image: obj.url,
//     position: obj.position,
//     size: obj.size,
//     repeat: obj.repeat,
//     color: form.backgroundColor,
//   })
//   setBackgroundColor()
// }

const handleUpdateColor = (value: string) => {
  graphStore.graph?.drawBackground({
    color: value,
    image: form.image,
    position: form.position,
    size: form.size,
    repeat: form.repeat,
  })
  setBackgroundColor()
}

const handleUpdateGrid = (value: boolean) => {
  graphStore.graph?.drawGrid({
    ...form.grid,
    args: [
      {
        color: form.grid.color,
        thickness: form.grid.thickness,
      },
    ],
  })
}

const handleUpdateZoom = (value: number) => {
  graphStore.graph?.zoomTo(value)
}
</script>

<style lang="scss"></style>
