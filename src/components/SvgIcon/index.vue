<template>
  <n-icon class="flex" :size="size" :component="icon" v-if="icon" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, defineProps, ref, shallowRef, watchEffect } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 },
})

const icons = import.meta.glob('@/assets/icons/*.svg')

const icon = shallowRef<ReturnType<typeof defineAsyncComponent> | null>(null)

watchEffect(() => {
  const path = `/src/assets/icons/${props.name}.svg`
  if (icons[path]) {
    icon.value = defineAsyncComponent(icons[path] as () => Promise<any>)
  } else {
    console.warn(`Icon not found: ${props.name}`)
    icon.value = null
  }
})
</script>
