import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  env: Cookies.get('env') || 'test',
  zone: Cookies.get('zone') || 'cn',
  appId: Cookies.get('appId') || '',
  version: Cookies.get('version') || ''
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_ENV: (state, env) => {
    state.env = env
    Cookies.set('env', env)
  },
  SET_ZONE: (state, env) => {
    state.zone = env
    Cookies.set('zone', env)
  },
  SET_APP_ID: (state, appId) => {
    state.appId = appId
    Cookies.set('appId', appId)
  },
  SET_VERSION: (state, version) => {
    state.version = version
    Cookies.set('version', version)
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  setEnv({ commit }, env) {
    commit('SET_ENV', env)
  },
  setZone({ commit }, zone) {
    commit('SET_ZONE', zone)
  },
  setAppId({ commit }, appId) {
    commit('SET_APP_ID', appId)
  },
  setVersion({ commit }, version) {
    commit('SET_VERSION', version)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
