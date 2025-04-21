<template>
  <n-form :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
    <n-form-item inline label="限制宽高比例" label-placement="left" label-width="auto">
      <n-checkbox
        v-model:checked="preserveAspectRatio"
        @update:checked="handleUpdateAspectRatio"
      ></n-checkbox>
    </n-form-item>
    <n-form-item label="层级">
      <div class="w-full">
        <n-input-number
          v-model:value="zIndex"
          placeholder="请输入层级"
          class="w-full mb-2"
          @update:value="handleZIndexChange"
        />
        <n-flex class="flex-grow">
          <n-button
            size="small"
            class="flex-grow"
            @click="(value: number) => handleZIndexChange(value, 'up')"
            >上移一层</n-button
          >
          <n-button
            size="small"
            class="flex-grow"
            @click="(value: number) => handleZIndexChange(value, 'down')"
            >下移一层</n-button
          >
          <n-button
            size="small"
            class="flex-grow"
            @click="(value: number) => handleZIndexChange(value, 'top')"
            >移至最前</n-button
          >
          <n-button
            size="small"
            class="flex-grow"
            @click="(value: number) => handleZIndexChange(value, 'bottom')"
            >移至最后</n-button
          >
        </n-flex>
      </div>
    </n-form-item>

    <n-form-item label="位置">
      <n-space>
        <n-input-number
          v-model:value="position.x"
          placeholder="x"
          @update:value="(value: number) => handleUpdatePosition(value, 'x')"
          @input="(evt: InputEvent) => handleNodePostionChange(evt, 'x')"
        />
        <n-input-number
          v-model:value="position.y"
          placeholder="y"
          @update:value="(value: number) => handleUpdatePosition(value, 'y')"
          @input="(evt: InputEvent) => handleNodePostionChange(evt, 'y')"
        />
      </n-space>
    </n-form-item>

    <n-form-item label="宽高">
      <n-space>
        <n-input-number
          v-model:value="size.width"
          placeholder="请输入宽"
          @update:value="(value: number) => handleUpdateSize(value, 'w')"
          @input="(evt: InputEvent) => handleNodeSizeChange(evt, 'w')"
        />
        <n-input-number
          v-model:value="size.height"
          placeholder="请输入高"
          @update:value="(value: number) => handleUpdateSize(value, 'h')"
          @input="(evt: InputEvent) => handleNodeSizeChange(evt, 'h')"
        />
      </n-space>
    </n-form-item>

    <n-form-item label="角度">
      <n-flex class="w-full">
        <n-input-number
          v-model:value="angel"
          placeholder="请输入角度"
          :precision="0"
          class="flex-grow"
          @update:value="handleUpdateRotate"
        />
        <n-button class="flex-grow" @click="handleUpdateRotate(90, { absolute: false })"
          >旋转90°</n-button
        >
      </n-flex>
    </n-form-item>
  </n-form>
</template>
<script lang="ts" setup>
import { ref, watch, computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import { usePanelStore } from '@/stores/panel'
import { useGraphStore } from '@/stores/graph'
import { debounce } from 'lodash'

import type { Node, Size } from '@antv/x6'

type SizeType = 'w' | 'h'

const panelStore = usePanelStore()
const form = reactive({
  width: 0,
  height: 0,
})
const size = ref({} as Size)
const position = ref({} as any)
const zIndex = ref(0)
const angel = ref(0)
const preserveAspectRatio = ref(false)

const node = computed(() => {
  return panelStore.getCell()! as Node
})
const graph = computed(() => {
  return useGraphStore().graph!
})

const parseWH = (size: { width: number; height: number }) => {
  size = JSON.parse(JSON.stringify(size))
  return {
    width: parseInt(`${Math.round(size.width)}`),
    height: parseInt(`${Math.round(size.height)}`),
  }
}

const parseXY = (position: { x: number; y: number }) => {
  position = JSON.parse(JSON.stringify(position))
  return {
    x: parseInt(`${Math.round(position.x)}`),
    y: parseInt(`${Math.round(position.y)}`),
  }
}

const nodeChangeHandler = () => {
  size.value = parseWH(node.value!.getSize())
  position.value = parseXY(node.value?.getPosition())
  angel.value = node.value?.getAngle()
}

const initNode = () => {
  if (!node.value || !node.value.isNode()) return
  preserveAspectRatio.value = !!node.value.getProp('preserveAspectRatio')
  zIndex.value = node.value?.getZIndex()!

  nodeChangeHandler()
}

let offNode: Node | null = null
const event = debounce(nodeChangeHandler, 200)

const fn = () => initNode()
onMounted(() => {
  initNode()
  graph.value.on('selection:changed', fn)

  offNode = node.value.on('changed', event)
})

onBeforeUnmount(() => {
  graph.value.off('selection:changed', fn)
  offNode!.off('changed', event)
})

const handleUpdateAspectRatio = (value: boolean) => {
  node.value.setProp('preserveAspectRatio', value)
  // graph.value._recreateTransform(node.value)
  graph.value.clearTransformWidget(node.value)
  graph.value.createTransformWidget(node.value)
}

const handleZIndexChange = (value: number, type: 'up' | 'down' | 'top' | 'bottom') => {
  if (!type) {
    node.value.setZIndex(value)
    return
  }
  const preZindex = node.value.getZIndex()
  const zIndexMap = {
    up: () => node.value.setZIndex(preZindex! + 1),
    down: () => node.value.setZIndex(preZindex! - 1),
    top: () => node.value.toFront(),
    bottom: () => node.value.toBack(),
  }

  zIndexMap[type]()
  zIndex.value = node.value.getZIndex()!
}

const handleUpdateSize = (value: number, type: SizeType) => {
  resize(value, type)
}

const resize = (value: number, type: SizeType) => {
  const size = node.value.getSize()
  node.value.resize(type === 'w' ? value : size.width, type === 'h' ? value : size.height)
}

const handleNodeSizeChange = (evt: InputEvent, type: SizeType) => {
  const value = Number((evt.target as HTMLInputElement).value)
  resize(value, type)
}

type positionType = 'x' | 'y'
const handleUpdatePosition = (value: number, type: positionType) => {
  node.value.setPosition(
    type === 'x' ? value : position.value.x,
    type === 'y' ? value : position.value.y,
  )
}

const handleNodePostionChange = (evt: InputEvent, type: positionType) => {
  const value = Number((evt.target as HTMLInputElement).value)
  handleUpdatePosition(value, type)
}

const handleUpdateRotate = (value: number, opts: Node.RotateOptions = {}) => {
  node.value.rotate(value, { absolute: true, ...opts })
  angel.value = node.value.getAngle()
}
</script>
