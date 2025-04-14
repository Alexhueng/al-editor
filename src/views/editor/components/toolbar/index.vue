<template>
  <div
    class="absolute top-0 h-[50px] bg-white p-2"
    :style="{ left: stencilWidth + 'px', right: controlPanelWidth + 'px' }"
  >
    <div class="flex justify-end">
      <n-space>
        <n-button type="primary" @click="handleSave">
          <svg-icon name="save" size="16" class="mr-2"></svg-icon>
          保存
        </n-button>
        <n-button @click="handleRender">
          <svg-icon name="display" size="16" class="mr-2"></svg-icon>
          渲染
        </n-button>
        <n-dropdown :options="exportOptions" key-field="label" @select="handleExportSelect">
          <n-button class="w-[80px]">
            <svg-icon name="export" size="16" class="mr-2"></svg-icon>
            导出
          </n-button>
        </n-dropdown>
      </n-space>
    </div>

    <Modal v-model:visible="visible" title="保存绘图" draggable @confirm="handleConfirm">
      <div class="flex items-center">
        <span class="mr-4 break-keep">名称:</span>
        <n-input v-model:value="form.name" class="w-full" placeholder="请输入名称"></n-input>
      </div>

      <div class="flex items-center mt-4">
        <span class="mr-4 break-keep">描述:</span>
        <n-input
          v-model:value="form.description"
          class="w-full"
          type="textarea"
          placeholder="请输入描述"
          :maxlength="100"
        ></n-input>
      </div>
    </Modal>

    <Modal
      v-model:visible="renderVisible"
      title="选择绘图"
      draggable
      @confirm="handleConfirmRender"
    >
      <div>
        <n-select v-model:value="selectedGraph" teleport="body" :options="options"></n-select>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { stencilWidth, controlPanelWidth } from '../../consts'
import { useGraphStore } from '@/stores/graph'
import Modal from '@/components/Modal/index.vue'
import { ref } from 'vue'
import { StorageService } from '@/utils/storage'
import { useMessage } from 'naive-ui'

import type { DropdownOption } from 'naive-ui'

const graphStore = useGraphStore()
const message = useMessage()
const visible = ref(false)
const renderVisible = ref(false)
const form = ref<{ name?: string; description?: string }>({})
const options = ref<any[]>([])
const selectedGraph = ref('')

const storage = new StorageService()

const handleSave = () => {
  const getGraph = graphStore.graph
  if (getGraph?._isGraphEmpty()) return
  visible.value = true
}

const handleConfirm = ({ resolve, reject }: { resolve: () => void; reject: () => void }) => {
  if (!form.value.name) return reject()
  const graphs = storage.get('graphs') || {}

  const graph = graphStore.graph
  if (graph) {
    const json = graph.toJSON()
    graphs[form.value.name] = json
    storage.set('graphs', graphs)
  }
  setTimeout(() => {
    resolve()
  }, 1000)
}

const handleRender = () => {
  renderVisible.value = true
  const graphs = storage.get('graphs')
  options.value = Object.keys(graphs || {}).map((key) => ({ label: key, value: key }))
}

const handleConfirmRender = ({ resolve, reject }: { resolve: () => void; reject: () => void }) => {
  const graph = graphStore.graph
  const graphs = storage.get('graphs')
  const json = graphs[selectedGraph.value]
  if (graph) {
    graph.fromJSON(json).centerContent()
    graph.persistence.save(json)
  }
  selectedGraph.value = ''
  resolve()
}

const exportOptions = [{ label: 'PNG' }, { label: 'SVG' }, { label: 'JPEG' }]
const handleExportSelect = (value: string, option: DropdownOption) => {
  const graph = graphStore.graph
  if (graph?._isGraphEmpty()) return message.error('当前画布为空')
  const fileName = 'graph' + Date.now()
  if (graph) {
    graph[`_export${value}`](fileName)
  }
}
</script>
