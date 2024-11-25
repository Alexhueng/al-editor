<template>
  <n-drawer
    v-model:show="panelStore.panelVisible"
    class="custom-class"
    :width="500"
    root-class-name="root-class-name"
    :root-style="{ color: 'blue' }"
    :title="null"
    placement="right"
  >
    <n-drawer-content title="节点属性">
      <n-form :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <n-form-item label="节点内容">
          <n-input
            v-model:value="data.text"
            placeholder="请输入节点内容"
            @input="handleNodeContentChange"
          />
        </n-form-item>

        <n-form-item label="层级">
          <n-input-number
            v-model:value="zIndex"
            placeholder="请输入层级"
            class="w-full"
            @update:value="handleZIndexChange"
          />
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
              v-model:value="data.backgroundColor"
              :modes="['rgb', 'hex', 'hsl']"
              @update:value="handleUpdateColor"
            />
            <n-input v-model:value="data.backgroundColor" @update:value="handleUpdateColor" />
          </div>
        </n-form-item>
        <!-- <n-form-item label="角度选择">
          <AngleSelection @angle="handleUpdateRadius"></AngleSelection>
        </n-form-item> -->
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts" setup>
import { ref, watch, computed, reactive } from 'vue'
import { usePanelStore } from '@/stores/panel'
import type { Node, Size } from '@antv/x6'
// import AngleSelection from '@/components/AngleSelection.vue'

type SizeType = 'w' | 'h'

const panelStore = usePanelStore()
const form = reactive({
  width: 0,
  height: 0,
})
const size = ref({} as Size)
const data = ref({} as any)
const position = ref({} as any)
const zIndex = ref(0)

const node = computed(() => {
  return panelStore.getNode()!
})

watch(
  () => panelStore.panelVisible,
  (value) => {
    if (value) {
      size.value = node.value!.getSize()
      data.value = node.value!.getData() || {}
      position.value = node.value?.getPosition()
      zIndex.value = node.value?.getZIndex()!
    }
  },
)

const handleNodeContentChange = (value: string) => {
  // const node = panelStore.getNode()
  // node?.setProp({
  //   text: value,
  // })

  node.value!.setData({
    text: value,
  })
}

const handleZIndexChange = (value: number) => {
  console.log(value)
  node.value.setZIndex(value)
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
  node.value.setData({
    backgroundColor: value,
  })
}
// const handleUpdateRadius = (value: string) => {
//   node.value.setData({
//     borderRadius: value,
//   })
// }

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
</script>
