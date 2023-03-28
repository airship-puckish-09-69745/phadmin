import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/playerManage/systemMoneyChart'),
        name: 'dashboard',
        meta: { title: '系统健康监测 ◐', icon: 'risk' }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  /** when your routing map is too long, you can split it into small modules **/
  {
    path: '/online',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '系统监控', icon: 'el-icon-pie-chart', perm: 'SWITCH_PAY_METHOD' },
    children: [
      {
        path: 'data',
        component: () => import('@/views/online/onlineData'),
        name: 'data',
        meta: { title: '在线数据 ◐' }
      },
      {
        path: 'pay_channel_success_rate',
        component: () => import('@/views/online/payChannelSuccessRate'),
        name: 'pay_channel_success_rate',
        meta: { title: '支付渠道成功率' }
      }
    ]
  },
  {
    path: '/player',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '玩家管理', icon: 'user' },
    children: [
      {
        path: 'userManage',
        component: () => import('@/views/playerManage/userManage'),
        name: 'userManage',
        meta: { title: '玩家信息 ◐' }
      },
      {
        path: 'moneylog',
        component: () => import('@/views/playerManage/moneylog'),
        name: 'moneylog',
        meta: { title: '金币流水 ◐' }
      }
    ]
  },
  {
    path: '/config',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '配置管理', icon: 'config', perm: 'CFG_MANAGEMENT' },
    children: [
      {
        path: 'baseConfig',
        component: () => import('@/views/config/baseConfig/baseConfig'),
        redirect: 'noRedirect',
        meta: { title: '基础配置', icon: 'example', noCache: true },
        children: [
          {
            path: 'item',
            component: () => import('@/views/config/baseConfig/item'),
            name: 'item',
            meta: { title: 'Item配置', noCache: true }
          },
          {
            path: 'goods',
            component: () => import('@/views/config/baseConfig/goods'),
            name: 'goods',
            meta: { title: '商品配置', noCache: true }
          }
        ]
      },
      {
        path: 'Tongits',
        component: () => import('@/views/config/tableConfig/tongitsTable'),
        name: 'Tongits',
        meta: { title: 'Tongits ◐', noCache: true }
      },
      {
        path: 'customize',
        component: () => import('@/views/config/baseConfig/customize'),
        name: 'customize',
        meta: { title: '自定义配置 ◐', noCache: true }
      },
      {
        path: 'review',
        component: () => import('@/views/config/review'),
        name: 'review',
        meta: { title: '审核发布', noCache: true, perm: 'REVIEW_CHECK' }
      }
    ]
  },
  {
    path: '/devTools',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '研发工具', icon: 'tool', perm: 'DEV_TOOL' },
    children: [
      {
        path: 'langDir',
        component: () => import('@/views/devTools/devTools'),
        redirect: 'noRedirect',
        meta: { title: '多语言管理', icon: 'language' },
        children: [
          {
            path: 'langResAndroid',
            component: () => import('@/views/devTools/langRes'),
            name: 'langResAndroid',
            meta: { title: '多语言配置(Galaxy)', perm: 'LANG_RES', platform: 'android' }
          },
          {
            path: 'langResGalaxy',
            component: () => import('@/views/devTools/langRes'),
            name: 'langResGalaxy',
            meta: { title: '多语言配置(Android)', perm: 'LANG_RES', platform: 'galaxy' }
          },
          {
            path: 'langResFortune',
            component: () => import('@/views/devTools/langRes'),
            name: 'langResFortune',
            meta: { title: '多语言配置(Fortune)', perm: 'LANG_RES', platform: 'fortune' }
          },
          {
            path: 'langModules',
            component: () => import('@/views/devTools/langModules'),
            name: 'langModules',
            meta: { title: '多语言模块配置', perm: 'LANG_RES' }
          },
          {
            path: 'langZips_android',
            component: () => import('@/views/devTools/langZips'),
            name: 'langZips_android',
            hidden: true,
            meta: { title: '多语言下载', platform: 'android' }
          },
          {
            path: 'langZips_galaxy',
            component: () => import('@/views/devTools/langZips'),
            name: 'langZips_galaxy',
            hidden: true,
            meta: { title: '多语言下载', platform: 'galaxy' }
          },
          {
            path: 'langZips_fortune',
            component: () => import('@/views/devTools/langZips'),
            name: 'langZips_fortune',
            hidden: true,
            meta: { title: '多语言下载', platform: 'fortune' }
          }
        ]
      },
      {
        path: 'google',
        component: () => import('@/views/devTools/devTools'),
        redirect: 'noRedirect',
        meta: { title: '提审管理', icon: 'review', perm: 'GOOGLE' },
        children: [
          {
            path: 'googleInfo',
            component: () => import('@/views/devTools/googleInfo'),
            name: 'googleInfo',
            meta: { title: '开发者账号管理', noCache: true }
          },
          {
            path: 'appInfo',
            component: () => import('@/views/devTools/appInfo'),
            name: 'appInfo',
            meta: { title: '提审包管理', noCache: true }
          },
          {
            path: 'mailChecker',
            component: () => import('@/views/devTools/mailChecker'),
            name: 'mailChecker',
            meta: { title: '账号状态检测', noCache: true }
          }
        ]
      },
      {
        path: 'genCode',
        component: () => import('@/views/devTools/devTools'),
        redirect: 'noRedirect',
        meta: { title: '代码生成', icon: 'code' },
        children: [
          {
            path: 'codeGenAdmin',
            component: () => import('@/views/devTools/codeGen'),
            name: 'CodeGenAdmin',
            meta: { title: '生成代码（Admin)' }
          },
          {
            path: 'codeGenRPCSQL',
            component: () => import('@/views/devTools/codeGen'),
            name: 'codeGenRPCSQL',
            meta: { title: '生成代码（RPC_SQL)' }
          }
        ]
      },
      {
        path: 'subGameList',
        component: () => import('@/views/devTools/devTools'),
        redirect: 'noRedirect',
        meta: {title: '子游戏列表配置', icon: 'code'},
        children: [
          {
            path: 'subgame_android',
            component: () => import('@/views/config/tableConfig/subgame'),
            name: 'subgame_android',
            meta: { title: 'Android ◐', noCache: true, platform: 'android' }
          },
          {
            path: 'subgame_galaxy',
            component: () => import('@/views/config/tableConfig/subgame'),
            name: 'subgame_galaxy',
            meta: { title: 'Galaxy ◐', noCache: true, platform: 'galaxy' }
          },
          {
            path: 'subgame_fortune',
            component: () => import('@/views/config/tableConfig/subgame'),
            name: 'subgame_fortune',
            meta: { title: 'Fortune ◐', noCache: true, platform: 'fortune' }
          },
          {
            path: 'subgame_android_ccs',
            component: () => import('@/views/config/tableConfig/subgame'),
            name: 'subgame_android_ccs',
            meta: { title: 'Android Cocos  ◐', noCache: true, platform: 'android_ccs' }
          }
        ]
      },
      {
        path: 'jsonViewer',
        component: () => import('@/views/devTools/jsonViewer'),
        name: 'jsonViewer',
        meta: { title: 'JSON查看器' }
      },
      {
        path: 'adjustHelper',
        component: () => import('@/views/devTools/adjustHelper'),
        name: 'adjustHelper',
        meta: { title: 'Adjust事件代码' }
      },
      {
        path: 'adjustUrl',
        component: () => import('@/views/devTools/adjustUrl'),
        name: 'adjustUrl',
        meta: { title: 'Adjust事件链接' }
      },
      {
        path: 'slotsCompute',
        component: () => import('@/views/devTools/SlotsCompute'),
        name: 'slotsCompute',
        meta: { title: '老虎机概率计算' }
      },
      {
        path: 'viewPlaylog',
        component: () => import('@/views/devTools/viewPlaylog'),
        name: 'viewPlaylog',
        meta: { title: '牌局日志查看' }
      },
      {
        path: 'testToolsGroup',
        component: () => import('@/views/devTools/devTools'),
        redirect: 'noRedirect',
        meta: {title: '测试工具集', icon: 'tab'},
        children: [
          {
            path: 'fakeOrderSucc',
            component: () => import('@/views/devTools/fakeOrderSucc'),
            name: 'fakeOrderSucc',
            meta: { title: '测试订单成功' }
          },
          {
            path: 'testTools',
            component: () => import('@/views/devTools/test_tools'),
            name: 'testTools',
            meta: { title: '测试小工具' }
          },
          {
            path: 'testSign',
            component: () => import('@/views/devTools/testSign'),
            name: 'testSign',
            meta: { title: '签到小工具' }
          },
          {
            path: 'testMonthCard',
            component: () => import('@/views/devTools/testMonthCard'),
            name: 'testMonthCard',
            meta: { title: '月卡小工具' }
          },
        ]
      },
      {
        path: 'logDeal',
        component: () => import('@/views/devTools/logDeal'),
        name: 'logDeal',
        meta: { title: '错误日志处理' }
      }
    ]
  },
  {
    path: '/adminUser',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '系统管理', icon: 'adminUser', perm: 'ADMINUSER_MANAGEMENT' },
    children: [
      {
        path: 'adminUser',
        component: () => import('@/views/adminUser/adminUser'),
        name: 'adminUser',
        meta: { title: '管理员列表' }
      },
      {
        path: 'role',
        component: () => import('@/views/adminUser/role'),
        name: 'role',
        meta: { title: '角色管理' }
      },
      {
        path: 'reviewerConfig',
        component: () => import('@/views/adminUser/reviewerConfig'),
        name: 'reviewerConfig',
        meta: { title: '审核权限管理' }
      },
      {
        path: 'operateLog',
        component: () => import('@/views/adminUser/operateLog'),
        name: 'operateLog',
        meta: { title: '操作日志' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
