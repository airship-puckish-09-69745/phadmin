import request from '@/utils/request'

// 生成管理后台需要的代码
export function GenCodeAdmin(fileName) {
  return request({
    url: '/other/gen/code',
    method: 'post',
    data: {
      FileName: fileName
    }
  })
}

// 生成RPC数据读取需要的代码
export function GenCodeRPCSQL(fileName) {
  return request({
    url: '/other/gen/code/rpc',
    method: 'post',
    data: {
      FileName: fileName
    }
  })
}
