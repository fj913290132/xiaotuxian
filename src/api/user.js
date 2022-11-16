import request from '@/utils/request'

/**
 * 帐号登录
 * @param {String} account - 用户名
 * @param {String} password - 密码
 * @returns Promise
 */
export const userAccountLogin = ({ account, password }) => {
  return request({
    url: '/login',
    method: 'post',
    data: {
      account,
      password
    }
  })
}

/**
 * 短信登录
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns Promise
 */
export const userMobileLogin = ({ mobile, code }) => {
  return request({
    url: '/login/code',
    method: 'post',
    data: {
      mobile,
      code
    }
  })
}

/**
 * 获取短信登录验证码
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const userMobileLoginMsg = (mobile) => {
  return request({
    url: '/login/code',
    params: { mobile }
  })
}
