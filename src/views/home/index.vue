<template>
  <div class="flex justify-center">
    <div
      class="text-3xl text-center mt-[20px] bg-white border border-[#dedede] w-fit px-2 rounded-lg cursor-pointer"
      @click="router.push('/editor')"
    >
      to editor
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style lang="scss" scoped></style>
