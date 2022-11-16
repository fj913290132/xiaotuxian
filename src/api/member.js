import request from '@/utils/request'

export const findcollect = ({ page = 1, pageSize = 10, collectType = 1 }) => {
  return request({
    url: '/member/collect',
    method: 'GET',
    params: {
      page,
      pageSize,
      collectType
    }
  })
}
