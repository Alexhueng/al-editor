import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
    },
    {
      path: '/editor/:name?',
      name: 'editor',
      component: () => import('@/views/editor/index.vue'),
    },
    {
      path: '/vueNode',
      name: 'vueNode',
      component: () => import('@/views/vueNode/index.vue'),
    },
  ],
})

export default router
