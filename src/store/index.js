import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'
import cart from './modules/cart'
import user from './modules/user'
import category from './modules/category'
export default createStore({
  modules: {
    cart,
    user,
    category
  },
  // 配置插件
  plugins: [
    // 默认存储在localStorage中
    createPersistedstate({
      // 本地存储名字
      key: 'xiaotuxian',
      // 指定需要存储的模块
      paths: ['user', 'cart']
    })
  ]
})
