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
              @update:value="(value) => handleUpdateSize(value, 'h')"
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
      </n-form>
    </n-drawer-content>
  </n-drawer>
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
const size = ref({} as Size)
const data = ref({} as any)

watch(
  () => panelStore.panelVisible,
  (value) => {
    if (value) {
      const node = panelStore.getNode()
      size.value = node!.getSize()
      data.value = node!.getData() || {}
      console.log(node)
    }
  },
)

const node = computed(() => {
  return panelStore.getNode()!
})

const handleNodeContentChange = (value: string) => {
  // const node = panelStore.getNode()
  // node?.setProp({
  //   text: value,
  // })

  node.value!.setData({
    text: value,
  })
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
</script>
