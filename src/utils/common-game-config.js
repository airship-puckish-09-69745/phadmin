import request from './request'

export const getAllCommonGameConfig = async() => {
  const response = await request({
    url: '/customizeconfig/one',
    method: 'get',
    data: {
      SubKey: 'game_resource_common_cfg'
    }
  })

  if (response.RetCode === 0) {
    if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
      return JSON.parse(response.Data.Data)
    }
  }
}

export const getAllMatchGuidesConfig = async() => {
  const response = await request({
    url: '/customizeconfig/one',
    method: 'get',
    data: {
      SubKey: 'match_guide_list_new'
    }
  })

  if (response.RetCode === 0) {
    if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
      return JSON.parse(response.Data.Data)
    }
  }
}
