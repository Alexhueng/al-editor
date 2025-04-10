<template>
  <n-form :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
    <n-form-item label="节点内容">
      <n-input v-model:value="text" placeholder="请输入节点内容" @input="handleNodeContentChange" />
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

    <n-form-item label="背景颜色">
      <div class="w-full">
        <n-color-picker
          v-model:value="backgroundColor"
          :modes="['rgb', 'hex', 'hsl']"
          @update:value="handleUpdateColor"
        />
        <!-- <n-input v-model:value="data.backgroundColor" @update:value="handleUpdateColor" /> -->
      </div>
    </n-form-item>

    <n-form-item label="角度">
      <n-flex class="w-full">
        <n-input-number
          v-model:value="angel"
          placeholder="请输入角度"
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
import { ref, watch, computed, reactive } from 'vue'
import { usePanelStore } from '@/stores/panel'
import type { Node, Size } from '@antv/x6'

type SizeType = 'w' | 'h'

const panelStore = usePanelStore()
const form = reactive({
  width: 0,
  height: 0,
})
const text = ref('')
const size = ref({} as Size)
const data = ref({} as any)
const backgroundColor = ref('')
const position = ref({} as any)
const zIndex = ref(0)
const angel = ref(0)

const node = computed(() => {
  return panelStore.getCell()! as Node
})

watch(
  () => panelStore.panelVisible,
  (value) => {
    if (value) {
      if (!node.value.isNode()) return
      text.value = node.value.getAttrByPath('text/text')
      size.value = node.value!.getSize()
      data.value = node.value!.getData() || {}
      position.value = node.value?.getPosition()
      zIndex.value = node.value?.getZIndex()!
      angel.value = node.value?.getAngle()
      backgroundColor.value = node.value?.getAttrByPath('body/fill')
    }
  },
  {
    immediate: true,
  },
)

const handleNodeContentChange = (value: string) => {
  // node.value!.setData({
  //   text: value,
  // })
  node.value.setAttrs({
    text: {
      text: value,
    },
  })
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

const handleUpdateColor = (value: string) => {
  node.value.setAttrs({
    body: {
      fill: value,
    },
  })
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
