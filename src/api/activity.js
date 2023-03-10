import request from '@/utils/request'

export function getAll() {
  return request({
    url: '/activity/all',
    method: 'get'
  })
}

export function getOne(data) {
  return request({
    url: '/activity/one',
    method: 'get',
    data: data
  })
}

export function create(data) {
  return request({
    url: '/activity/create',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/activity/update',
    method: 'post',
    data: data
  })
}

export function del(data) {
  return request({
    url: '/activity/delete',
    method: 'post',
    data: data
  })
}

export function copy(data) {
  return request({
    url: '/activity/copy',
    method: 'get',
    data: data
  })
}

export function updateStatus(data) {
  return request({
    url: '/activity/update/status',
    method: 'post',
    data: data
  })
}
