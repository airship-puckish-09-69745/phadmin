import store from '@/store'
import router from '@/router'

export function isNewVersion() {
  return getAppVersion() === 'V2'
}

export function getAppVersion() {
  return store.getters.version
}

export function setAppVersion(version) {
  store.dispatch('app/setVersion', version)
}

export function getAppEnv() {
  return store.getters.env
}

export function setAppEnv(env) {
  store.dispatch('app/setEnv', env)
}

export function getAppId() {
  return store.getters.appId
}

export function setAppId(appId) {
  store.dispatch('app/setAppId', appId)
}

export function switchNewAppEnv(env, defaultAppId, vue, newPath) {
  setAppEnv(env)
  if (getAppId() === '') {
    setAppId(defaultAppId)
  }
  setAppVersion('V2')
  const isDiffEnv = env === getAppEnv()
  refreshAppView(isDiffEnv, vue, newPath)
}

export function switchOldAppEnv(env, vue, newPath) {
  setAppEnv(env)
  setAppId('')
  setAppVersion('V1')
  const isDiffEnv = env === getAppEnv()
  refreshAppView(isDiffEnv, vue, newPath)
}

export function switchAppId(appId, vue) {
  setAppId(appId)
  refreshAppView(false, vue)
}

export function refreshAppView(isDiffEnv, vue, newPath) {
  // In order to make the cached page re-rendered
  store.dispatch('tagsView/delAllCachedViews', vue.$route)

  let { fullPath } = vue.$route
  if (isDiffEnv){
    fullPath = '/'
  }
  if (newPath) {
    fullPath = newPath
  }

  vue.$nextTick(() => {
    router.replace({
      path: '/redirect' + fullPath
    })
  })

  vue.$message({
    message: '切换成功，正在重新刷新页面...',
    type: 'success'
  })

  // 强制刷一下页面，让切环境生效
  setInterval(function() {
    window.location.reload()
  }, 500)
}
