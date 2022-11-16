// 定义首页需要的接口函数
import request from '@/utils/request'

/**
 * 获取所有分类(顶级，二级，对应的商品推荐数据)
 * @returns promise
 */
export const findAllCategory = () => {
  return request({
    url: '/home/category/head',
    method: 'GET'
  })
}

/**
 * 获取顶级类目信息(children属性就是各个子分类)
 * @param {string} id 顶级类目Id
 * @returns promise
 */
export const findTopCategory = (id) => {
  return request({
    url: '/category',
    method: 'GET',
    params: {
      id
    }
  })
}

/**
 * 获取二级分类筛选条件数据
 * @param {String} id - 二级分类ID
 */
export const findSubCategoryFilter = (id) => {
  return request({
    url: '/category/sub/filter',
    params: {
      id
    }
  })
}

/**
 * 获取分类下的商品（带筛选条件）
 * @obj {Object} params - 一个对象
 */
export const findSubCategoryGoods = (obj) => {
  return request({
    url: '/category/goods/temporary',
    method: 'post',
    data: obj
  })
}
