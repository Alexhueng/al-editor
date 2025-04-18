<template>
  <FloatBoard :position="{ x: 1000, y: 50 }" title="自由绘图">
    <div class="flex justify-center mt-2">
      <n-button @click="toogleMode">{{ options.isDrawingMode ? '结束绘图' : '开始绘图' }}</n-button>
    </div>
  </FloatBoard>

  <Teleport to="body">
    <canvas ref="canvasRef"></canvas>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, onMounted, Teleport, reactive, nextTick } from 'vue'
import FloatBoard from '../floatBoard/index.vue'
import { FreeDrawing } from './draing'
import { useElementBounding } from '@vueuse/core'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let freeDrawing: FreeDrawing | null = null

const options = reactive({
  isDrawingMode: false,
})

const startPoint = ref<{ x: number; y: number } | null>(null)

onMounted(() => {
  nextTick(() => {
    freeDrawing = new FreeDrawing({
      id: canvasRef.value as HTMLCanvasElement,
      // width: bounding.value!.width,
      // height: bounding.value!.height,
    })

    const wrapperStyle = freeDrawing.getWrapperEl().style
    wrapperStyle.display = 'none'

    freeDrawing.canvas.on('mouse:down', (event) => {
      console.log(event)
      const e = event.e as MouseEvent
      startPoint.value = {
        x: e.pageX,
        y: e.pageY,
      }
    })
  })
})

const getBounding = () => {
  const graphContainerWrapper = document.getElementById('graph-container-wrapper')
  // const graphScroller = graphContainerWrapper?.getElementsByClassName('x6-graph-scroller')[0]
  const graphScroller = document.getElementById('graph-container')
  const bounding = useElementBounding(graphScroller as any)
  console.log(bounding)
  return bounding
}

let json: any = null
const toogleMode = () => {
  const wrapperStyle = freeDrawing!.getWrapperEl().style
  if (options.isDrawingMode) {
    freeDrawing!.closeDrawingMode()
    options.isDrawingMode = false
    wrapperStyle.display = 'none'
    json = freeDrawing?.canvas.toJSON()
    freeDrawing?.clear()
  } else {
    freeDrawing!.openDrawingMode()
    options.isDrawingMode = true
    wrapperStyle.display = 'block'

    const bounding = getBounding()
    freeDrawing!.canvas.setWidth(bounding.width.value)
    freeDrawing!.canvas.setHeight(bounding!.height.value)
    wrapperStyle.left = `${bounding.left.value}px`
    wrapperStyle.top = `${bounding.top.value}px`
    if (json) {
      freeDrawing?.canvas.loadFromJSON(json)
      console.log('load')
    }
  }
}
</script>

<style lang="scss">
.canvas-container {
  position: absolute !important;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
