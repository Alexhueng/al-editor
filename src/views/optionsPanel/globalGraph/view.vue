<template>
  <div
    class="h-[32px] flex items-center hover:bg-zinc-100 px-2 rounded justify-between cursor-pointer"
    v-for="(cell, index) in cells"
    :key="cell.id"
    @click="handleClickCell(cell)"
  >
    <div class="flex items-center">
      <svg-icon :name="cell.isNode() ? 'node' : 'edge'" class="mr-2" />
      <span>{{ getLabel(cell, index) }}</span>
    </div>
    <div class="flex">
      <svg-icon
        :name="cell.visible ? 'eye' : 'eye-close'"
        class="mr-2"
        @click.stop="handleVisible(cell, index)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick } from 'vue'
import { useGraphStore } from '@/stores/graph'
import type { Cell } from '@antv/x6'

const graph = computed(() => {
  return useGraphStore().graph
})

const cells: any = ref([])

nextTick(() => {
  updateCells()
})

const getLabel = (cell: Cell, index: number) => {
  if (cell.isEdge()) {
    return 'edge '
  } else {
    return 'node '
  }
}

const updateCells = () => {
  cells.value = graph.value?.getCells?.() || []
}

const handleClickCell = (cell: Cell) => {
  graph.value!.clearTransformWidgets()
  graph.value!.cleanSelection()
  graph.value!.select(cell)
}

const handleVisible = (cell: Cell, index: number) => {
  cell.setProp('visible', !cell.getProp('visible'))
  updateCells()
}
</script>
