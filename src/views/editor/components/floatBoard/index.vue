<template>
  <div
    ref="panelRef"
    class="absolute bg-[#fff] shadow-lg overflow-hidden flex flex-col will-change-[transform,width,height,left,top] transform-gpu translate-z-0"
    :class="[isMaximized ? '' : 'rounded']"
    :style="panelStyle"
  >
    <div
      ref="headerRef"
      class="px-2 py-3 bg-[#333] text-[#fff] flex justify-between items-center select-none shrink-0"
      :class="[
        { 'cursor-move': draggable },
        { 'cursor-grabbing': isDragging },
        `h-[${HEADER_HEIGHT}px]`,
      ]"
      @mousedown="startDrag"
      @dblclick="handleHeaderDoubleClick"
    >
      <span class="text-[14px] font-bold">{{ title }}</span>
      <div class="flex items-center gap-2 select-none" @mousedown.stop>
        <svg-icon
          v-if="foldable"
          :name="isMinimized ? 'expand' : 'fold'"
          color="#fff"
          size="16"
          class="cursor-pointer"
          @click="toggleMinimize"
          @dblclick.stop
        />
        <svg-icon
          v-if="fullscreen"
          :name="isMaximized ? 'minimize' : 'fullscreen'"
          class="cursor-pointer"
          size="14"
          @click="toggleMaximize"
          @dblclick.stop
        />
        <svg-icon
          name="close"
          class="cursor-pointer"
          size="18"
          @click="$emit('close')"
          @dblclick.stop
        />
      </div>
    </div>

    <div
      ref="contentWrapper"
      class="will-change-[height] transform-gpu translate-z-0 transition-[height] duration-300 ease-in-out"
    >
      <div class="h-full p-4 overflow-auto">
        <slot></slot>
      </div>
    </div>

    <svg-icon
      v-if="resizable && !isMaximized"
      name="resize"
      color="#000"
      size="20"
      class="absolute bottom-0 right-0 cursor-nw-resize"
      @mousedown="startResize"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const HEADER_HEIGHT = 32

const props = defineProps({
  title: { type: String, default: '' },
  width: { type: Number, default: 400 },
  position: { type: Object, default: () => ({ x: 0, y: 0 }) },
  fullscreen: { type: Boolean, default: true },
  draggable: { type: Boolean, default: true },
  resizable: { type: Boolean, default: false },
  foldable: { type: Boolean, default: true },
  boundary: { type: Boolean, default: true },
})

const emit = defineEmits(['close', 'minimize', 'maximize', 'restore'])

type DivRefType = Nullable<HTMLDivElement>

const panelRef = ref<DivRefType>(null)
const contentWrapper = ref<DivRefType>(null)
const headerRef = ref<DivRefType>(null)
const isDragging = ref(false)
const isResizing = ref(false)
const isMinimized = ref(false)
const isMaximized = ref(false)
const zIndex = ref(10)
const offset = ref({ x: 0, y: 0 })
const startSize = ref({ width: 0, height: 0 })
const startPos = ref({ x: 0, y: 0 })

// 保存最大化前的位置和尺寸
const preMaximizeState = ref({
  position: { x: props.position.x, y: props.position.y },
  size: { width: props.width, height: 0 },
})

// 面板位置和尺寸
const position = ref({ x: props.position.x, y: props.position.y })
const size = ref({ width: props.width, height: 0 })

// 计算样式
const panelStyle = computed(() => {
  return {
    left: isMaximized.value ? 0 : `${position.value.x}px`,
    top: isMaximized.value ? 0 : `${position.value.y}px`,
    width: isMaximized.value ? '100%' : `${size.value.width}px`,
    height: isMaximized.value
      ? '100%'
      : isMinimized.value
        ? `${HEADER_HEIGHT}px`
        : `${size.value.height + HEADER_HEIGHT}px`,
    zIndex: zIndex.value,
    transition:
      isDragging.value || isResizing.value ? 'none' : 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', // 统一添加过渡效果
  }
})

// 视口尺寸
const viewportSize = ref({ width: window.innerWidth, height: window.innerHeight })

// 处理标题栏双击事件
const handleHeaderDoubleClick = (e: MouseEvent) => {
  if (!props.fullscreen) return
  toggleMaximize()
}

const startDrag = (e: MouseEvent) => {
  if (isMaximized.value || !props.draggable) return

  bringToFront()
  isDragging.value = true
  const rect = panelRef.value!.getBoundingClientRect()
  offset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'grabbing'
}

// 开始调整大小
const startResize = (e: MouseEvent) => {
  bringToFront()
  isResizing.value = true
  startSize.value = { ...size.value }
  startPos.value = { x: e.clientX, y: e.clientY }
  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'nwse-resize'
}

// 最大化/还原
const toggleMaximize = () => {
  if (isMaximized.value) {
    // 还原
    isMaximized.value = false
    // 添加延迟确保过渡效果生效
    setTimeout(() => {
      size.value = { ...preMaximizeState.value.size }
      position.value = { ...preMaximizeState.value.position }
    }, 10)
    emit('restore')
  } else {
    // 最大化
    preMaximizeState.value = {
      position: { ...position.value },
      size: { ...size.value },
    }
    isMaximized.value = true
    emit('maximize')
  }
}

// 最小化/还原
const toggleMinimize = () => {
  const wrapper = contentWrapper.value!
  if (isMinimized.value) {
    wrapper.style.height = 'auto'
    const h = wrapper.offsetHeight
    wrapper.style.height = '0'
    wrapper.clientHeight // 强制重新渲染
    wrapper.style.height = `${h}px`
  } else {
    const h = wrapper.offsetHeight
    wrapper.style.height = `${h}px`
    wrapper.clientHeight
    wrapper.style.height = '0'
  }
  isMinimized.value = !isMinimized.value
  emit('minimize', isMinimized.value)
}

// 置顶
const bringToFront = () => {
  zIndex.value = Date.now()
}

// 使用requestAnimationFrame优化性能
const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value && !isResizing.value) return

  requestAnimationFrame(() => {
    const clientX = e.clientX
    const clientY = e.clientY

    if (isDragging.value) {
      let newX = clientX - offset.value.x
      let newY = clientY - offset.value.y

      // 边界限制
      if (props.boundary) {
        newX = Math.max(0, Math.min(newX, viewportSize.value.width - size.value.width))
        newY = Math.max(
          0,
          Math.min(newY, viewportSize.value.height - (isMinimized.value ? 40 : size.value.height)),
        )
      }

      position.value = { x: newX, y: newY }
    }

    if (isResizing.value) {
      const deltaX = clientX - startPos.value.x
      const deltaY = clientY - startPos.value.y

      let newWidth = startSize.value.width + deltaX
      let newHeight = startSize.value.height + deltaY

      // 最小尺寸限制
      newWidth = Math.max(200, Math.min(newWidth, viewportSize.value.width - position.value.x))
      newHeight = Math.max(150, Math.min(newHeight, viewportSize.value.height - position.value.y))

      contentWrapper.value!.style.height = `${newHeight}px`
      size.value = { width: newWidth, height: newHeight }
    }
  })
}

// 结束操作
const handleMouseUp = () => {
  isDragging.value = false
  isResizing.value = false
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
}

// 更新视口尺寸
const updateViewportSize = () => {
  viewportSize.value = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  // 如果面板超出边界，调整位置
  if (props.boundary && !isMaximized.value) {
    position.value.x = Math.min(position.value.x, viewportSize.value.width - size.value.width)
    position.value.y = Math.min(position.value.y, viewportSize.value.height - size.value.height)
  }
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
  window.addEventListener('resize', updateViewportSize)

  size.value.height = contentWrapper.value!.offsetHeight
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('resize', updateViewportSize)
})
</script>

<style scoped></style>
