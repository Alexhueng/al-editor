import './assets/main.css'
// import 'tailwindcss/tailwind.css'
import './assets/style/tailwind.css'
import Antd, { message } from 'ant-design-vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')

app.config.globalProperties.$message = message
