<template>
  <n-form label-placement="left" label-width="auto">
    <n-form-item
      :label="`标签${index + 1}`"
      v-for="(label, index) in labels"
      label-width="auto"
      :key="index"
    >
      <div class="w-full">
        <n-input
          v-model:value="label.text"
          type="textarea"
          class="w-full"
          @update:value="handleUpdateLabel"
        />
        <div class="flex items-center justify-center mt-2 break-keep">
          <span>字体颜色:</span>
          <n-color-picker
            v-model:value="label.color"
            class="w-[30px] h-[30px] ml-2"
            :render-label="() => null"
            :modes="['rgb', 'hex', 'hsl']"
            @update:value="handleUpdateLabel"
          />

          <span class="mx-2">背景颜色:</span>
          <n-color-picker
            v-model:value="label.backgroundColor"
            class="w-[30px] h-[30px]"
            :render-label="() => null"
            :modes="['rgb', 'hex', 'hsl']"
            @update:value="handleUpdateLabel"
          />

          <span class="mx-2">位置:</span>
          <n-input-number
            v-model:value="label.distance"
            class="w-[150px]"
            :precision="0"
            :step="10"
            :min="0"
            :max="100"
            @update:value="handleUpdateLabel"
          >
            <template #suffix> % </template>
          </n-input-number>
        </div>
      </div>
    </n-form-item>
    <n-button class="mb-4" type="primary" @click="handleAddLabel">新增标签</n-button>

    <n-form-item label="路由">
      <n-select
        v-model:value="form.router"
        :options="routerMap"
        @update:value="handleUpdateRouter"
      />
    </n-form-item>

    <n-form-item label="连线">
      <n-select
        v-model:value="form.connector"
        :options="connectorMap"
        @update:value="handleUpdateConnector"
      />
    </n-form-item>

    <n-form-item label="填充">
      <n-color-picker
        v-model:value="stroke"
        :modes="['rgb', 'hex', 'hsl']"
        @update:value="handleColorChange"
      />
    </n-form-item>

    <n-form-item label="线条">
      <div class="flex justify-between">
        <n-select
          v-model:value="strokeType"
          class="w-[50%] flex-shrink mr-4"
          :options="strokeWidthList"
          :render-label="renderLabel"
          @update:value="handleStrokeType"
        >
        </n-select>
        <n-input-number
          v-model:value="strokeWidth"
          class="w-[50%] flex-shrink"
          :min="0"
          @update:value="handleStrokeWidth"
        />
      </div>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, h, onMounted, onBeforeUnmount } from 'vue'
import { usePanelStore } from '@/stores/panel'
import { useGraphStore } from '@/stores/graph'

// import types
import { Edge, Node } from '@antv/x6'
import type { SelectOption } from 'naive-ui'
import type { VNodeChild } from 'vue'

const routerMap = [
  { value: 'normal', label: '正常' },
  { value: 'orth', label: '正交' },
  { value: 'oneSide', label: '受限正交' },
  { value: 'manhattan', label: '智能正交' },
  { value: 'metro', label: '智能地铁线' },
  { value: 'er', label: '实体关系' },
]

const connectorMap = [
  { value: 'normal', label: '简单' },
  { value: 'rounded', label: '圆角' },
  { value: 'smooth', label: '平滑' },
]

const strokeWidthList = [
  { label: '实线', value: '0', labelClass: 'border-b-[1px] border-[#000] h-[1px] w-[200px]' },
  { label: '短间隔虚线', value: '1', labelClass: 'border-dashed' },
  { label: '长间隔虚线', value: '5,5', labelClass: 'dashed-2' },
  { label: '等长虚线', value: '10,5', labelClass: 'dashed-3' },
  { label: '长短虚线', value: '15,5,3,5', labelClass: 'dashed-4' },
]

type Label = Partial<typeof DEFAULT_LABEL>
const DEFAULT_LABEL = {
  backgroundColor: '#fff',
  color: '#000',
  text: '',
  distance: undefined,
}

const panelStore = usePanelStore()
const graph = computed(() => {
  return useGraphStore().graph
})
const stroke = ref('')
const strokeType = ref('0')
const strokeWidth = ref(1)
const labels = ref<Label[]>([])

const form = reactive<{
  router?: Edge.RouterData['name']
  connector?: Edge.ConnectorData['name']
}>({})

const edge = computed(() => {
  return panelStore.getCell()! as Edge
})

const initEdge = () => {
  if (!edge.value || !edge.value.isEdge()) return
  const router = edge.value.getRouter()
  if (typeof router === 'string') {
    form.router = router
  } else {
    form.router = router?.name
  }

  const connector = edge.value.getConnector()
  if (typeof connector === 'string') {
    form.connector = connector
  } else {
    form.connector = connector?.name
  }
  stroke.value = edge.value.getAttrByPath('line/stroke')
  strokeType.value = edge.value.getAttrByPath('line/strokeDasharray')
  strokeWidth.value = edge.value.getAttrByPath('line/strokeWidth')

  // handle labels
  const _labels = edge.value.getLabels()
  const transformed = transfomLabels(_labels)
  labels.value = transformed.filter((label) => label.text)
  if (!labels.value.length) {
    handleAddLabel()
  }
}

const fn = () => initEdge()
onMounted(() => {
  initEdge()
  graph.value?.on('selection:changed', fn)
})

onBeforeUnmount(() => {
  graph.value!.off('selection:changed', fn)
})

const generateLabels = (labels: any) => {
  return labels.map((label: any) => {
    return {
      attrs: {
        text: {
          text: label.text,
          fill: label.color,
          // 'font-weight': 'bold',
        },
        rect: {
          fill: label.backgroundColor,
          refWidth: '120%',
          refX: '-10%',
        },
      },
      position: {
        distance: label.distance !== undefined ? label.distance / 100 : undefined,
      },
    }
  })
}

const transfomLabels = (labels: Edge.Label[]) => {
  return labels.map((label: Edge.Label) => {
    const attrs = label.attrs || {}
    // @ts-ignore
    const distance = label.position?.distance
    return {
      text: attrs?.text?.text,
      color: attrs?.text?.fill,
      backgroundColor: attrs?.rect?.fill,
      distance: distance !== undefined ? distance * 100 : undefined,
    }
  }) as Label[]
}

const handleAddLabel = () => {
  if (labels.value.length >= 5) return
  labels.value.push({
    ...DEFAULT_LABEL,
  })
  edge.value.setLabels(generateLabels(labels.value))
}

const handleUpdateLabel = (value: string) => {
  edge.value.setLabels(generateLabels(labels.value))
}

const handleUpdateRouter = (value: string) => {
  edge.value.setRouter(value)
}

const handleUpdateConnector = (value: string) => {
  edge.value.setConnector(value)
}

const handleColorChange = (value: string) => {
  edge.value.setAttrs({
    line: {
      stroke: value,
    },
  })
}

const renderLabel = (option: SelectOption): VNodeChild => {
  const baseClass = 'border-b-[1px] border-[#000] h-[1px] w-[200px]'
  return h(
    'div',
    { class: 'w-full flex  items-center h-[30px]', title: option.label },
    h('div', {
      class: baseClass + ' ' + option.labelClass,
    }),
  )
}

const handleStrokeType = (value: string) => {
  edge.value.setAttrs({
    line: {
      strokeDasharray: value,
    },
  })
}

const handleStrokeWidth = (value: number) => {
  edge.value.setAttrs({
    line: {
      strokeWidth: value,
    },
  })
}
</script>
