import request from '@/utils/request'

/**
 * 获取结算信息
 */
export const findCheckoutInfo = () => {
  return request({
    url: '/member/order/pre'
  })
}

/**
 * 添加收货地址信息
 * @param {Object} address - 地址对象
 */
export const addAddress = (address) => {
  return request({
    url: '/member/address',
    method: 'post',
    data: address
  })
}

/**
 * 修改收货地址信息
 * @param {Object} address - 地址对象
 */
export const editAddress = (data) => {
  return request({
    url: `/member/address/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 提交订单
 * @param {Object} order - 订单信息对象-根据购物车信息生成
 */
export const createOrder = (data) => {
  return request({
    url: '/member/order',
    method: 'post',
    data
  })
}

/**
 * 获取订单详情
 * @param {String} id - 订单ID
 */
export const findOrder = (id) => {
  return request({
    url: '/member/order/' + id
  })
}

/**
 * 查询订单列表
 * @param {Number} orderState - 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部
 * @param {Number} page - 页码
 * @param {Number} pageSize - 每页条数
 * @returns
 */
export const findOrderList = ({ orderState = 0, page = 1, pageSize = 10 }) => {
  return request({
    url: '/member/order',
    params: {
      orderState,
      page,
      pageSize
    }
  })
}

/**
 * 取消订单
 * @param {String} orderId - 订单ID
 * @param {String} cancelReason - 取消原因
 * @returns Promise
 */
export const cancelOrder = (orderId, cancelReason) => {
  return request({
    url: `/member/order/${orderId}/cancel`,
    method: 'put',
    data: { cancelReason }
  })
}

/**
 * 删除订单
 * @param {Array<string>} ids - 删除订单，id集合
 * @returns
 */
export const delteOrder = (ids) => {
  return request({
    url: '/member/order',
    method: 'delete',
    data: { ids: [ids] }
  })
}

/**
 * 确认收货
 * @param {*} orderId 订单id
 * @returns
 */
export const confirmOrder = (orderId) => {
  return request({
    url: `/member/order/${orderId}/receipt`,
    method: 'put'
  })
}

/**
 * 查看物流
 * @param {String} id - 订单ID
 * @returns
 */
export const logisticsOrder = (id) => {
  return request({
    url: `/member/order/${id}/logistics`
  })
}

/**
 * 获取再次购买的订单结算信息
 * @param {String} id - 订单ID-根据订单中的商品
 * @returns
 */
export const findOrderRepurchase = (id) => {
  return request({
    url: `/member/order/repurchase/${id}`
  })
}
