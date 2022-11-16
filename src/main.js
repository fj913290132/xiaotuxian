import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入自己封装的ui组件库
import ui from './components/library'

// 1.重置样式
import 'normalize.css'
// 2.自己项目的重置样式和公用样式
import '@/assets/styles/common.less'

// mockjs
import '@/mock'

createApp(App).use(store).use(router).use(ui).mount('#app')
