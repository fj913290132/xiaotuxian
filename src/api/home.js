// 定义首页需要的接口函数
import request from '@/utils/request'

/**
 *
 * @param {int} limit - 品牌个数
 * @returns promise
 */
export const findBrand = (limit) => {
  return request({
    url: '/home/brand',
    method: 'get',
    params: limit
  })
}

/**
 * 获取广告图
 * @returns Promise
 */
export const findBanner = () => {
  return request({
    url: '/home/banner'
  })
}

/**
 * 获取信息好物
 * @returns Promise
 */
export const findNew = () => {
  return request({
    url: 'home/new'
  })
}

/**
 *  获取人气推荐
 * @returns Promise
 */
export const findHot = () => {
  return request({
    url: 'home/hot'
  })
}

/**
 * 获取商品板块
 * @returns promise
 */
export const findGoods = () => {
  return request({
    url: 'home/goods'
  })
}

/**
 * 获取最新专题
 * @returns promise
 */
export const findSpecial = () => {
  return request({
    url: 'home/special'
  })
}
