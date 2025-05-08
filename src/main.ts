import './assets/main.css'
import './assets/style/tailwind.css'
import NaiveUI from 'naive-ui'
import SvgIcon from './components/SvgIcon/index.vue'
import { useRegisterNode } from '@/views/editor/registerNode'

import { createApp } from 'vue'
import { pinia } from '@/stores'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(NaiveUI)
app.component('SvgIcon', SvgIcon)

app.mount('#app')

useRegisterNode()
