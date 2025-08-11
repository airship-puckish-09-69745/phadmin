import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'

function menuTree(data, pid) {
  const res = []
  for (const i in data) {
    let row = {}
    if (data[i]['pid'] === pid) {

      if (data[i]['metaExt']) {
        try {
          data[i]['metaExt'] = JSON.parse(data[i]['metaExt'])
        } catch (e) {
          data[i]['metaExt'] = {}
        }
      }

      row = {
        id: data[i]['id'],
        path: data[i]['path'],
        name: data[i]['name'],
        meta: {
          title: data[i]['title'],
          icon: data[i]['icon'],
          ...data[i]['metaExt']
        },
        label: data[i]['title']
      }

      if (data[i].type === 1) {
        row.redirect = data[i]['redirect']
        row.component = Layout
      } else {
        row.component = (resolve) => require([`@/views${data[i]['component']}`], resolve)
      }

      row.children = menuTree(data, data[i]['id'])
      res.push(row)
    }
   
  }

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  menus: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus // 菜单权限
  }
}

const actions = {
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      const accessedRoutes = menuTree(menus, 0)
      commit('SET_MENUS', accessedRoutes)
      accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      console.log('menu tree', accessedRoutes)

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