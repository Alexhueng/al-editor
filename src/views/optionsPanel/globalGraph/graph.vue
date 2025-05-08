<template>
  <div class="w-full select-none">
    <n-form
      :model="form"
      class="[&>div]:mb-3"
      label-width="auto"
      label-placement="left"
      :show-feedback="false"
    >
      <n-form-item label="背景颜色：">
        <n-color-picker
          v-model:value="form.backgroundColor"
          :modes="['rgb', 'hex', 'hsl']"
          @update:value="handleUpdateColor"
        />
      </n-form-item>
      <!-- <n-form-item label="背景图片(仅支持png格式)" style="display: block">
        <n-flex vertical>
          <Upload @uploadSuccess="uploadSuccess" @valueChange="uploadSuccess" />
        </n-flex>
      </n-form-item> -->
      <n-form-item label="网格：">
        <n-switch v-model:value="form.grid.visible" @update:value="handleUpdateGrid"></n-switch>
      </n-form-item>
      <n-form-item label="类型：">
        <n-select
          v-model:value="form.grid.type"
          :disabled="!form.grid.visible"
          :options="[
            { label: 'dot', value: 'dot' },
            { label: 'fixedDot', value: 'fixedDot' },
            { label: 'mesh', value: 'mesh' },
            // { label: 'doubleMesh', value: 'doubleMesh' },
          ]"
          @update:value="handleUpdateGrid"
        />
      </n-form-item>
      <n-form-item label="网格大小：">
        <n-slider
          v-model:value="form.grid.size"
          :disabled="!form.grid.visible"
          :min="1"
          :max="20"
          @update:value="handleUpdateGrid"
        ></n-slider>
      </n-form-item>
      <n-form-item label="网格颜色：">
        <n-color-picker
          v-model:value="form.grid.args.color"
          :disabled="!form.grid.visible"
          :modes="['rgb', 'hex', 'hsl']"
          @update:value="handleUpdateGrid"
        />
      </n-form-item>
      <n-form-item label="线条厚度：">
        <n-slider
          v-model:value="form.grid.args!.thickness"
          :disabled="!form.grid.visible"
          :min="0.5"
          :step="0.5"
          :max="10"
          @update:value="handleUpdateGrid"
        ></n-slider>
      </n-form-item>

      <!-- <n-form-item label="画布缩放">
        <n-slider
          v-model:value="form.zoom"
          class="ml-3"
          :min="0.5"
          :step="0.1"
          :max="12"
          @update:value="handleUpdateZoom"
        ></n-slider>
      </n-form-item> -->
      <n-form-item label="随机边颜色">
        <n-switch
          v-model:value="form.edgeRandomColor"
          @update:value="handleUpdateEdgeRandomColor"
        ></n-switch>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { useGraphStore } from '@/stores/graph'
// import Upload from '@/components/Upload.vue'
import { GRAPH_DEFAULT_OPTIONS } from '@/views/editor/consts'

const graphStore = useGraphStore()

const form = reactive({
  // @ts-ignore
  backgroundColor: GRAPH_DEFAULT_OPTIONS.background!.color,
  image: '',
  position: '' as any,
  repeat: '',
  size: '' as any,
  grid: GRAPH_DEFAULT_OPTIONS.grid,
  zoom: 1.2,
  edgeRandomColor: graphStore.edgeRandomColor,
})

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

const uploadSuccess = (obj: any) => {
  graphStore.graph?.background.draw({
    image: obj.url,
    position: obj.position,
    size: obj.size,
    repeat: obj.repeat,
    color: form.backgroundColor,
  })
  setBackgroundColor()
}

const handleUpdateColor = (value: string) => {
  graphStore.graph?.background.draw({
    color: value,
  })
}

const handleUpdateGrid = (value: boolean) => {
  graphStore.graph?.drawGrid({
    ...form.grid,
  })
}

const handleUpdateZoom = (value: number) => {
  graphStore.graph?.zoomTo(value)
}

const handleUpdateEdgeRandomColor = (value: boolean) => {
  graphStore.edgeRandomColor = value
}
</script>

<style lang="scss" scoped></style>
