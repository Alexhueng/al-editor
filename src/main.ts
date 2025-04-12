import './assets/main.css'
import './assets/style/tailwind.css'
import Antd, { message } from 'ant-design-vue'
import NaiveUI from 'naive-ui'
import SvgIcon from './components/SvgIcon/index.vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(NaiveUI)
app.use(Antd)
app.component('SvgIcon', SvgIcon)

app.mount('#app')

app.config.globalProperties.$message = message
