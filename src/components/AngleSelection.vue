<template>
  <div
    ref="setup_angle"
    class="setup_angle"
    @mousedown="mousedown = true"
    @mouseup="mousedown = false"
    @mousemove="on_mousemove"
    @mouseleave="mousedown = false"
  >
    <div
      class="container"
      :style="{
        transform: `rotate(${angle_data}deg)`,
      }"
    >
      <div class="point"></div>
    </div>
    <div class="content">
      {{ angle_data + '°' }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineEmits } from 'vue'
// 正确定义自定义事件
const emit = defineEmits(['angle'])
// 创建响应式数据
const angle_data = ref(0)
const mousedown = ref(false)
const setup_angle = ref(null)
function calculate_degree(x, y, centerX, centerY) {
  // 根据当前坐标和中心坐标计算角度
  const radians = Math.atan2(x - centerX, y - centerY)
  return radians * (180 / Math.PI) * -1 + 180
}
function on_mousemove(event) {
  // 鼠标移动事件(按下移动就算拖拽，在元素里移动才算，元素外移动监听)
  if (mousedown.value) {
    // 表示是按下移动的
    const el = setup_angle.value
    let centerX = -~(el.offsetHeight || el.height) / 2
    let centerY = -~(el.offsetWidth || el.width) / 2
    let angle = calculate_degree(event.offsetX, event.offsetY, centerX, centerY)
    angle_data.value = parseInt(-~angle)
    emit('angle', angle_data.value / 3.6)
  }
}
// 挂载时添加事件监听器
onMounted(() => {
  const el = setup_angle.value
  el.addEventListener('mousemove', on_mousemove)
})
// 卸载时移除事件监听器
onUnmounted(() => {
  const el = setup_angle.value
  el.removeEventListener('mousemove', on_mousemove)
})
</script>
<style scoped lang="scss">
.setup_angle {
  width: 120px;
  height: 120px;
  border: 5px solid #e8454571;
  box-sizing: border-box;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  > .container {
    pointer-events: none;
    height: 100%;
    width: fit-content;
    padding: 5px 0;
    box-sizing: border-box;
    > .point {
      width: 14px;
      height: 14px;
      background-color: #e84545;
      border-radius: 50px;
    }
  }
  > .content {
    position: absolute;
    font-size: 16px;
    color: #5b748e;
    font-weight: bold;
    pointer-events: none;
  }
}
</style>
