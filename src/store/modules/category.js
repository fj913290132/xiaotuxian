// 分类模块
import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
export default {
  namespaced: true,
  state () {
    // 分类信息，依赖topCategory重新设置，保证初始化就要数据，不至于白屏
    return {
      List: topCategory.map(item => ({ name: item }))
    }
  },
  mutations: {
    // 修改分类函数
    setList (state, val) {
      state.List = val
    },
    // 定义show和hide函数，控制当前分类的二级分类显示/隐藏
    show (state, id) {
      const currcategory = state.List.find(item => item.id === id)
      currcategory.open = true
    },
    hide (state, id) {
      const currcategory = state.List.find(item => item.id === id)
      currcategory.open = false
    }
  },
  actions: {
    // 获取分类函数
    async getList ({ commit }) {
      // 获取
      const data = await findAllCategory()
      // 给每个分类加上控制二级分类显示隐藏的数据
      data.result.forEach((item) => { item.open = false })
      // 修改
      commit('setList', data.result)
    }
  }
}
