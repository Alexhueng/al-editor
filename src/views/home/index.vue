<template>
  <div class="w-full h-full">
    <div class="w-full h-[56px] px-10 bg-zinc-900 shadow-2xl">
      <div class="flex items-center justify-end h-full">
        <n-button circle @click="handleGithub">
          <svg-icon name="github" color="#fff" />
        </n-button>
      </div>
    </div>

    <PatternBackground
      :animate="true"
      :direction="PATTERN_BACKGROUND_DIRECTION.Bottom"
      :variant="PATTERN_BACKGROUND_VARIANT.BigDot"
      :speed="PATTERN_BACKGROUND_SPEED.Slow"
      class="w-full h-[calc(100vh-56px)] pt-20"
    >
      <h3 class="text-6xl font-bold text-center relative text-[#000] whitespace-nowrap select-none">
        今天你想<span class="bg-clip-text">画</span>什么?
      </h3>

      <div class="flex justify-center mt-16">
        <n-button
          class="w-[200px] h-[50px] text-[20px] font-bold text-white rounded-md"
          type="primary"
          @click="router.push('/editor')"
        >
          开始画图
        </n-button>
      </div>

      <div class="w-[1200px] mx-auto mt-20">
        <h3 class="text-[60px] font-bold relative text-[#000] mt-20 bg-clip-text">DEMO</h3>
        <div class="flex flex-wrap">
          <div
            v-for="(item, index) in Object.keys(graphs).slice(0, maxCount)"
            class="w-[31%] mb-4 h-[400px] flex-shrink bg-[#fff] p-3 relative rounded cursor-pointer hover:scale-[1.05] transition-all duration-300 ease-in-out shadow-md"
            :class="[(index + 1) % 3 ? 'mr-8' : 'mr-0']"
            @click="handleClick(item)"
          >
            <span class="absolute top-3 left-3 text-[20px] z-30 text-[#000] font-bold">{{
              item
            }}</span>
            <div
              :ref="(el) => setItemRef(el as HTMLDivElement, index)"
              class="text-xl text-[#000] h-full pt-14"
            />
          </div>
        </div>
      </div>
    </PatternBackground>
  </div>
  <!-- <div contenteditable="true">contenteditable</div> -->
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { StorageService } from '@/utils/storage'
import { computed, ref, onMounted } from 'vue'
import { Graph } from '@antv/x6'
// import { useRegisterNode } from '@/views/editor/registerNode'
import {
  PatternBackground,
  PATTERN_BACKGROUND_DIRECTION,
  PATTERN_BACKGROUND_VARIANT,
  PATTERN_BACKGROUND_SPEED,
} from '@/components/ui/pattern-background/index'
import { useGraphStore } from '@/stores/graph'
import demoData from './data.json'

const graphStore = useGraphStore()
const router = useRouter()
const storage = new StorageService()
const maxCount = 6

const graphs = computed(() => {
  return {
    ...demoData,
    ...(storage.get('graphs') || {}),
  }
})

const itemRefs = ref<HTMLDivElement[]>([])
const setItemRef = (el: HTMLDivElement, index: number) => {
  itemRefs.value[index] = el
}

onMounted(() => {
  // useRegisterNode()
  itemRefs.value.forEach((item, index) => {
    const graph = new Graph({
      container: item,
      interacting: false,
    })
    graph.fromJSON(graphs.value[Object.keys(graphs.value)[index]]).centerContent()
    graph.zoom(-0.5)
  })
})

const handleClick = (item: string) => {
  router.push({ path: 'editor' })
  graphStore.setCurrentGraphName(item)
}

const handleGithub = () => {
  window.open('https://github.com/Alexhueng/al-editor', '_blank')
}
</script>

<style lang="scss">
.bg-clip-text {
  background-clip: text;
  background-image: linear-gradient(90deg, rgb(0, 160, 168), rgb(125, 42, 232));
  color: transparent;
}
</style>
