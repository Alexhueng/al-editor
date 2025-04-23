<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { NConfigProvider } from 'naive-ui'
import { dateZhCN, zhCN } from 'naive-ui'
import { Analytics } from '@vercel/analytics/vue'
</script>

<template>
  <NConfigProvider class="h-full" :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <RouterView />
    </n-message-provider>
  </NConfigProvider>
  <Analytics />
</template>

<style scoped></style>
