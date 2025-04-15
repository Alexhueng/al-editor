<template>
  <div>
    <div class="text-[14px] mb-1 font-bold">文本内容</div>
    <n-input
      v-model:value="text"
      type="textarea"
      placeholder="请输入节点内容"
      maxlength="1000"
      @input="handleNodeContentChange"
    />
    <div class="text-[14px] my-2 font-bold">
      <n-space justify="space-between" align="center">
        字体颜色
        <n-color-picker
          v-model:value="fontColor"
          class="w-[200px]"
          @complete="handleFontColor"
        ></n-color-picker>
      </n-space>
    </div>
    <div class="text-[14px] my-2 font-bold">字体</div>
    <n-space>
      <n-button :type="isBold ? 'primary' : 'default'" @click="handleBold">加粗</n-button>
      <n-button :type="isItalic ? 'primary' : 'default'" @click="handleItalic">斜体</n-button>
      <n-button :type="isUnderline ? 'primary' : 'default'" @click="handleUnderline">
        下划线
      </n-button>
      <n-button :type="isVertical ? 'primary' : 'default'" @click="handleVertical">
        文本垂直
      </n-button>
      <n-input-number v-model:value="fontSize" class="w-[100px]" @update:value="handleFontSize" />
    </n-space>
    <n-space>
      <n-space class="my-2">
        <n-button
          v-for="align in HAlignMap"
          :key="align.value"
          :type="horizontalAlign === align.value ? 'primary' : 'default'"
          @click="handleHAlign(align.value)"
        >
          {{ align.label }}
        </n-button>
      </n-space>
      <n-space class="my-2">
        <n-button
          v-for="align in VAlignMap"
          :key="align.value"
          :type="verticalAlign === align.value ? 'primary' : 'default'"
          @click="handleVAlign(align.value)"
        >
          {{ align.label }}
        </n-button>
      </n-space>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { usePanelStore } from '@/stores/panel'
import { useGraphStore } from '@/stores/graph'

import type { Node, Size } from '@antv/x6'

const panelStore = usePanelStore()
const node = computed(() => {
  return panelStore.getCell()! as Node
})
const graph = computed(() => {
  return useGraphStore().graph!
})

const HAlignMap = [
  { value: 'start', label: '居左' },
  { value: 'middle', label: '水平居中' },
  { value: 'end', label: '居右' },
] as const
const VAlignMap = [
  { value: 'top', label: '顶部' },
  { value: 'middle', label: '垂直居中' },
  { value: 'bottom', label: '底部' },
] as const

const text = ref('')
const isBold = ref(false)
const isItalic = ref(false)
const isUnderline = ref(false)
const isVertical = ref(false)
const fontSize = ref(12)
const fontColor = ref('#fff')
const horizontalAlign = ref('middle')
const verticalAlign = ref('middle')

const initNode = () => {
  if (!node.value || !node.value.isNode()) return
  text.value = node.value.getAttrByPath('text/text') || ''
  fontSize.value = node.value!.getAttrByPath('text/fontSize')
  isBold.value = node.value!.getAttrByPath('text/fontWeight') === 'bold'
  isItalic.value = node.value!.getAttrByPath('text/fontStyle') === 'italic'
  isUnderline.value = node.value!.getAttrByPath('text/textDecoration') === 'underline'
  const transform = node.value!.getAttrByPath('text/transform')
  if (transform && typeof transform === 'string') {
    isVertical.value = transform.includes('rotate(90deg)')
  }
  horizontalAlign.value = node.value!.getAttrByPath('text/textAnchor') as HAlign
  verticalAlign.value = node.value!.getAttrByPath('text/textVerticalAnchor') as VAlign
}

const fn = () => initNode()
onMounted(() => {
  initNode()
  graph.value.on('selection:changed', fn)
})

onBeforeUnmount(() => {
  graph.value.off('selection:changed', fn)
})

const handleNodeContentChange = (value: string) => {
  node.value.setAttrs({
    text: {
      text: value,
    },
  })
}

const handleBold = () => {
  node.value.setAttrs({
    text: {
      fontWeight: isBold.value ? 'normal' : 'bold',
    },
  })
  isBold.value = !isBold.value
}

const handleItalic = () => {
  node.value.setAttrs({
    text: {
      fontStyle: isItalic.value ? 'normal' : 'italic',
    },
  })
  isItalic.value = !isItalic.value
}

const handleUnderline = () => {
  node.value.setAttrs({
    text: {
      textDecoration: isUnderline.value ? 'none' : 'underline',
    },
  })
  isUnderline.value = !isUnderline.value
}

const handleVertical = () => {
  isVertical.value = !isVertical.value
  node.value.setAttrs({
    text: {
      transform: `rotate(${isVertical.value ? 90 : 0}deg)`,
    },
  })
}

const handleFontSize = (value: number) => {
  node.value.setAttrs({
    text: {
      fontSize: value,
    },
  })
}

const handleFontColor = (value: string) => {
  node.value.setAttrs({
    text: {
      fill: value,
    },
  })
}

const resetOffset = () => {
  ;['refX', 'refX2', 'refY', 'refY2'].forEach((key: string) => {
    node.value.removeAttrByPath(`text/${key}`)
  })
}

type HAlign = (typeof HAlignMap)[number]['value']
type VAlign = (typeof VAlignMap)[number]['value']
const getHOffset = (align: HAlign) => {
  const map = {
    start: { refX: 0, refX2: '2%' },
    middle: { refX: 0.5 },
    end: { refX: '100%', refX2: '-2%' },
  }

  return map[align]
}

const getVOffset = (align: VAlign) => {
  const map = {
    top: { refY: '2%' },
    middle: { refY: 0.5 },
    bottom: { refY: '100%', refY2: '-2%' },
  }

  return map[align]
}

const handleHAlign = (align: HAlign) => {
  if (horizontalAlign.value === align) return
  resetOffset()
  horizontalAlign.value = align
  const textVerticalAnchor = node.value.getAttrByPath('text/textVerticalAnchor') as VAlign

  node.value.setAttrs({
    text: {
      ...getHOffset(align),
      ...getVOffset(textVerticalAnchor),
      textAnchor: align,
      textVerticalAnchor: textVerticalAnchor,
    },
  })
}

const handleVAlign = (align: VAlign) => {
  if (verticalAlign.value === align) return
  resetOffset()
  verticalAlign.value = align
  const textAnchor = node.value.getAttrByPath('text/textAnchor') as HAlign
  node.value.setAttrs({
    text: {
      ...getHOffset(textAnchor),
      ...getVOffset(align),
      textAnchor: textAnchor,
      textVerticalAnchor: align,
    },
  })
}
</script>
