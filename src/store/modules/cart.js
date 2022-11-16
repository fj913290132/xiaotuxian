import { getNewCartGoods, mergeCart, findCartList, insertCart, deleteCart, updateCart, checkAllCart } from '@/api/cart'

// 购物车模块
export default {
  namespaced: true,
  state () {
    return {
      // 购物车数据
      list: []
    }
  },
  mutations: {
    // 加入购物车
    inSertCart (state, payload) {
      // 约定加入购物车字段必须和后端保持一致 payload的字段
      // 插入数据规则：
      // 1.先找下是否有相同的商品
      // 2.如果有相同的商品，查询它的数量，累加到palyload上，在保存最新位置
      // 3.如果没有相同的商品，保存在最新位置即可
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (sameIndex > -1) {
        const count = state.list[sameIndex].count
        payload.count += count
        state.list.splice(sameIndex, 1) // 删除旧的
        state.list.unshift(payload) // 追加新的
      } else {
        state.list.unshift(payload)
      }
    },
    // 修改购物车商品
    updateCart (state, goods) {
      // console.log(state, goods)
      // goods 商品信息：nowPrice stock isEffective
      // goods 商品对象的字段不固定,对象中有哪些字段就改哪些字段，字段的值合理才改
      // goods 商品对象 必须有SKUID
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    //! 删除购物车
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 设置购物车
    setCart (state, payload) {
      state.list = payload
    }
  },
  actions: {
    // 合并购物车
    async mergeCart (ctx) {
      // 准备合并的参数
      const cartList = ctx.state.list.map(goods => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count: goods.count
        }
      })
      await mergeCart(cartList)
      // console.log(res)
      ctx.commit('setCart', [])
    },
    // 加入购物车
    async inSertCart (ctx, payload) {
      // console.log(ctx.rootState.user.profile.token)
      if (ctx.rootState.user.profile.token) {
        // 已登录
        await insertCart(payload)
        ctx.dispatch('findCart')
      } else {
        // 未登录
        ctx.commit('inSertCart', payload)
      }
    },
    // 获取商品列表
    async findCart (ctx) {
      if (ctx.rootState.user.profile.token) {
        // 已登录
        const res = await findCartList()
        ctx.commit('setCart', res.result)
      } else {
        // 未登录
        // 同时发送请求(有几个商品发几个请求)，等所有请求发送成功，一并修改本地数据
        const promiseArr = ctx.state.list.map(goods => {
          return getNewCartGoods(goods.skuId)
        })
        const res = await Promise.all(promiseArr)
        // 更新本地购物车
        res.forEach((data, index) => {
          ctx.commit('updateCart', { skuId: ctx.state.list[index].skuId, ...data.result })
        })
      }
    },
    //! 删除购物车
    async deleteCart (ctx, payload) {
      // payload就是skuid 目前做单条删除
      if (ctx.rootState.user.profile.token) {
        // 登录
        await deleteCart([payload])
        await ctx.dispatch('findCart')
      } else {
        // 未登录
        ctx.commit('deleteCart', payload)
      }
    },
    //! 修改购物车(选中状态，数量)
    async updateCart (ctx, goods) {
      // payload需要：必须有skuid，可能count(数量)，selected(选中状态)
      if (ctx.rootState.user.profile.token) {
        // 登录
        await updateCart(goods)
        await ctx.dispatch('findCart')
      } else {
        // 未登录
        // ctx.commit('updateCart', goods)
        ctx.commit('updateCart', goods)
      }
    },
    //! 全选与取消全选
    async checkAllCart (ctx, selected) {
      if (ctx.rootState.user.profile.token) {
        // 登录
        const ids = ctx.getters.validList.map(item => item.skuId)
        await checkAllCart({ selected, ids })
        await ctx.dispatch('findCart')
      } else {
        /// 未登录
        ctx.getters.validList.forEach(item => {
          ctx.commit('updateCart', { skuId: item.skuId, selected })
        })
      }
    },
    //! 批量删除
    async batchDeleteCart (ctx) {
      if (ctx.rootState.user.profile.token) {
        // 登录
        const ids = ctx.getters.selectedList.map(item => item.skuId)
        await deleteCart(ids)
        await ctx.dispatch('findCart')
      } else {
        // 未登录
        ctx.getters.selectedList.forEach(item => [
          ctx.commit('deleteCart', item.skuId)
        ])
      }
    },
    //! 修改sku规格函数
    async updateCartSku (ctx, { oldSkuId, newSku }) {
      if (ctx.rootState.user.profile.token) {
        // 登录 TODO
        const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
        await deleteCart([oldGoods.skuId])
        await insertCart({ skuId: newSku.skuId, count: oldGoods.count })
        await ctx.dispatch('findCart')
      } else {
        // 本地
        // 但你修改了sku的时候其实skuId需要更改，相当于把原来的信息移出，创建一条新的商品信息。
        // 1. 获取旧的商品信息
        const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
        // 2. 删除旧的商品
        ctx.commit('deleteCart', oldSkuId)
        // 3. 合并一条新的商品信息
        const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = newSku
        const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
        // 4. 去插入即可
        ctx.commit('inSertCart', newGoods)
      }
    }
  },
  getters: {
    // 有效商品列表
    validList (state) {
      // 有效商品：库存大于0 stock 商品有效标识为true
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    // 有效商品的总件数
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      return getters.validList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 无效商品列表
    invalidList (state) {
      // 库存小于0 或者无效的商品
      return state.list.filter(goods => goods.stock <= 0 || !goods.isEffective)
    },
    // 已选商品列表
    selectedList (state, getters) {
      return getters.validList.filter(goods => goods.selected)
    },
    // 已选商品总件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 是否全选
    isCheckAll (state, getters) {
      return getters.selectedList.length !== 0 && getters.selectedList.length === getters.validList.length
    }
  }
}
