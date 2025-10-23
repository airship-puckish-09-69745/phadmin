import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'
import { $libType } from '@/utils/common'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
  // withCredentials: true,
})

// request interceptor
service.interceptors.request.use(
  config => {
    let isHandle = false

    // console.log("axios config", config)
    // 如果请求的数据不为空，且是对象就特殊处理
    // 后端接收请求数据 GET 是以 application / x-www-form-urlencoded
    // POST 是以 application / form-data
    if (config.data && config.data instanceof Object) {
      // eslint-disable-next-line no-prototype-builtins
      if (config.hasOwnProperty('envEmpty') && config.envEmpty) {
        config.data.Env = ''
      } else {
        config.data.Env = store.getters.env
      }
      if (store.getters.version === 'V2') {
        config.headers['X-App-Id'] = store.getters.appId
      }
      config.headers['X-Version'] = store.getters.version
      isHandle = true
    }
    // do something before request is sent
    switch (config.method.toUpperCase()) {
      case 'GET':
        // GET application / x-www-form-urlencoded 格式发送
        if (isHandle) {
          config.url += '?' + qs.stringify(config.data)
        }
        break
      case 'POST':
        // GET application / form-data 格式发送
        if (isHandle) {
          const form = new FormData()
          for (const k in config.data) {
            form.append(k, config.data[k])
          }
          config.data = form
          config.headers['content-type'] = 'application/form-data'
        }
        break
    }

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.RetCode !== 0) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.RetCode === -101 || res.RetCode === 50008 || res.RetCode === 50012 || res.RetCode === 50014) {
        // to re-login
        MessageBox.confirm('登录已过期！请选择 留在此页面 或 重新登录？', '登录过期', {
          confirmButtonText: '重新登录',
          cancelButtonText: '留在此页面',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else if (res.RetCode < 0) {
        Message.error('操作失败！参数错误：' + ($libType.IsString(res.Data) ? res.Data : res.Data.Msg))
        console.log(res)
        return res
      }

      Message({
        message: res.Data || res.Data.Msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(new Error(res.Data || res.Data.Msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
