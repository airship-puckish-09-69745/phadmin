import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(pers, route) {
  /*  if (route.meta && route.meta.roles) {
      return roles.some(role => route.meta.roles.includes(role))
    } else {
      return true
    }*/
  // 至少拥有可读权限
  if (route.meta && route.meta.perm) {
    if (pers[route.meta.perm] & 1 > 0) {
      return hasProject(route)
    } else {
      return false
    }
  } else {
    return hasProject(route)
  }
}

// 检测项目权限
function hasProject(route) {
  // 如果有配置项目，检测是否包含项目
  // eslint-disable-next-line no-prototype-builtins
  if (route.meta && route.meta.hasOwnProperty('project')) {
    return route.meta.project.indexOf(process.env.VUE_APP_PROJECT) >= 0
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, pers) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(pers, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, pers)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, pers) {
    console.log('pers:' + pers)
    return new Promise(resolve => {
      /* let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {*/
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, pers)
      // }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
