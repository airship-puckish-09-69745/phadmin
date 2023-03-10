import request from '@/utils/request'
import hexMd5 from '@/utils/md5'

export function login(data) {
  // 密码需要加密
  data.password = hexMd5(data.password)

  return request({
    url: '/login/login',
    method: 'post',
    data: data
  })
}

export function getInfo(token) {
  return request({
    url: '/login/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'get'
  })
}
