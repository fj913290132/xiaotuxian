import request from '@/utils/request'

/**
 * 获取新的商品信息
 * @param {String} skuId - 商品SKUID
 * @returns Promise
 */
export const getNewCartGoods = (skuId) => {
  return request({
    url: `/goods/stock/${skuId}`
  })
}

/**
 * 获取商品的specs和skus
 * @param {String} skuId - 商品SKUID
 * @returns Promise
 */
export const getSpecsAndSkus = (skuId) => {
  return request({
    url: `/goods/sku/${skuId}`
  })
}

/**
 * 合并本地购物车
 * @param {Array<object>} cartList - 本地购物车数组
 * @param {String} item.skuId - 商品SKUID
 * @param {Boolean} item.selected - 是否选中
 * @param {Integer} item.count - 数量
 */
export const mergeCart = (cartList) => {
  return request({
    url: '/member/cart/merge',
    method: 'post',
    data: cartList
  })
}

/**
 * 获取登录后的购物车列表
 * @returns Promise
 */
export const findCartList = () => {
  return request({
    url: '/member/cart'
  })
}

/**
 * 加入购物车
 * @param {String} skuId - 商品SKUID
 * @param {Integer} count - 商品数量
 * @returns Promise
 */
export const insertCart = ({ skuId, count }) => {
  return request({
    url: '/member/cart',
    method: 'post',
    data: {
      skuId,
      count
    }
  })
}

/**
 * 删除商品（支持批量删除）
 * @param {Array<string>} ids - skuId集合
 * @returns Promise
 */
export const deleteCart = (ids) => {
  return request({
    url: '/member/cart',
    method: 'delete',
    data: { ids }
  })
}

/**
 * 登录状态 -> 修改购物车商品的状态和数量
 * @param {String} goods.skuId - 商品sku
 * @param {Boolean} goods.selected - 选中状态
 * @param {Integer} goods.count - 商品数量 (可选) -> 逻辑页面上修改数量也调用这个接口
 * @returns Promise
 */
export const updateCart = (goods) => request({
  url: `/member/cart/${goods.skuId}`,
  method: 'PUT',
  data: goods
})

/**
 * 全选反选
 * @param {Boolean} selected - 选中状态
 * @param {Array<string>} ids - 有效商品skuId集合
 * @returns Promise
 */
export const checkAllCart = ({ selected, ids }) => request({
  url: '/member/cart/selected',
  method: 'PUT',
  data: { selected, ids }
})
