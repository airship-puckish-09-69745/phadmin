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
      },
      {
        path: 'slots_daily',
        component: () => import('@/views/online/slotsDaily'),
        name: 'slots_daily',
        meta: { title: '老虎机每日健康数据' }
      },
      {
        path: 'rocketRandom',
        component: () => import('@/views/playerManage/rocketRandom'),
        name: 'rocketRandom',
        meta: { title: 'Crash - 概率监控 ◐' }
      },
      {
        path: 'play_log_top100',
        component: () => import('@/views/playerManage/PlaylogTop100'),
        name: 'play_log_top100',
        meta: { title: '牌局排行榜 ◐' }
      },
      {
        path: 'sweeperTableUserData',
        component: () => import('@/views/playerManage/sweeperTableUserData'),
        name: 'sweeperTableUserData',
        meta: { title: '扫雷 - 桌子数据 ◐' }
      }
    ]
  },
  {
    path: '/tableConfig',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '场次管理', icon: 'example', perm: 'CFG_MANAGEMENT' },
    children: [
      {
        path: 'tongitsTable',
        component: () => import('@/views/config/tableConfig/tongitsTable'),
        name: 'tongitsTable',
        meta: { title: 'Tongits ◐' }
      },
      {
        path: 'tongitsTableAI',
        component: () => import('@/views/config/tableConfig/tongitsAIConfig'),
        name: 'tongitsTableAI',
        meta: { title: 'TongitsAI ◐' }
      },
      {
        path: 'lucky9Table',
        component: () => import('@/views/config/tableConfig/lucky9Table'),
        name: 'lucky9Table',
        meta: { title: 'Lucky9 ◐' }
      },
      {
        path: 'lucky9RobotSetting',
        component: () => import('@/views/config/tableConfig/lucky9RobotSetting'),
        name: 'lucky9RobotSetting',
        meta: { title: 'Lucky9 AI◐' }
      },
      {
        path: 'lucky89Table',
        component: () => import('@/views/config/tableConfig/lucky89Table'),
        name: 'lucky89Table',
        meta: { title: 'Lucky89 ◐' }
      },
      {
        path: 'lucky89RobotSetting',
        component: () => import('@/views/config/tableConfig/lucky89RobotSetting'),
        name: 'lucky89RobotSetting',
        meta: { title: 'Lucky89 AI◐' }
      },
      {
        path: 'pusoyTable',
        component: () => import('@/views/config/tableConfig/pusoyTable'),
        name: 'pusoyTable',
        meta: { title: 'Pusoy ◐' }
      },
      {
        path: 'SmallGameCfg',
        component: () => import('@/views/empty'),
        redirect: 'noRedirect',
        meta: { title: '下注类游戏', noCache: true },
        children: [
          {
            path: 'abTable',
            component: () => import('@/views/config/tableConfig/abTable'),
            name: 'abTable',
            meta: { title: 'AB - Andar Bahar ◐' }
          },
          {
            path: 'CarRoulette',
            component: () => import('@/views/config/tableConfig/CarRouletteTable'),
            name: 'CarRoulette',
            meta: { title: 'Car - 车标转盘 ◐' }
          },
          {
            path: 'color_game',
            component: () => import('@/views/config/tableConfig/colorGame'),
            name: 'gameColorCfg',
            meta: { title: 'color game ◐' }
          },
          {
            path: 'gameCrash',
            component: () => import('@/views/config/tableConfig/gameCrash'),
            name: 'gameCrash',
            meta: { title: 'Crash - 小火箭 ◐' }
          },
          {
            path: 'dvtTable',
            component: () => import('@/views/config/tableConfig/dvtTable'),
            name: 'dvtTable',
            meta: { title: 'Dragon - 龙虎 ◐' }
          },
          {
            path: 'bcrTable',
            component: () => import('@/views/config/tableConfig/bcrTable'),
            name: 'bcrTable',
            meta: { title: 'Baccarat - 百家乐 ◐' }
          },
          {
            path: 'sweeper',
            component: () => import('@/views/config/tableConfig/sweeperCfg'),
            name: 'sweeperCfg',
            meta: { title: 'Sweeper - 扫雷 ◐' }
          },
          {
            path: 'windrop_cfg',
            component: () => import('@/views/config/tableConfig/windrop_cfg'),
            name: 'windrop_cfg',
            meta: { title: 'Windrop ◐' }
          }

        ]
      },

      {
        path: 'texasTable',
        component: () => import('@/views/config/tableConfig/texasTable'),
        name: 'texasTable',
        meta: { title: 'Texas - 德州' }
      },
      {
        path: 'slotsCfg',
        component: () => import('@/views/empty'),
        redirect: 'noRedirect',
        meta: { title: 'Slots - 老虎机配置', noCache: true },
        children: [

          {
            path: 'beauty_slots_cfg',
            component: () => import('@/views/config/tableConfig/slots/beauty_slots_cfg'),
            name: 'beauty_slots_cfg',
            meta: { title: 'Beauty - 睡美人' }
          },

          {
            path: 'gold_miner_slots_cfg',
            component: () => import('@/views/config/tableConfig/slots/gold_miner_slots_cfg'),
            name: 'gold_miner_slots_cfg',
            meta: { title: 'GoldMiner - 黄金矿工' }
          },
          {
            path: 'gold_train_slots_cfg',
            component: () => import('@/views/config/tableConfig/slots/gold_train_slots_cfg'),
            name: 'gold_train_slots_cfg',
            meta: { title: 'GoldTrain - 黄金列车' }
          },
          {
            path: 'joker_slots_cfg',
            component: () => import('@/views/config/tableConfig/slots/joker_slots_cfg'),
            name: 'joker_slots_cfg',
            meta: { title: 'Joker - 小丑' }
          },
          {
            path: 'phoenix_slots_cfg',
            component: () => import('@/views/config/tableConfig/slots/phoenix_slots_cfg'),
            name: 'phoenix_slots_cfg',
            meta: { title: 'Phoenix - 凤凰' }
          },
          {
            path: 'chicago_slots_cfg',
            component: () => import('@/views/config/tableConfig/slots/chicago_slots_cfg'),
            name: 'chicago_slots_cfg',
            meta: { title: 'Chicago - 芝加哥' }
          },
          {
            path: 'aladdin_slots_cfg',
            component: () => import('@/views/config/tableConfig/slots/aladdin_slots_cfg'),
            name: 'aladdin_slots_cfg',
            meta: { title: '阿拉丁' }
          },
          {
            path: 'ireland_slots_cfg',
            component: () => import('@/views/config/tableConfig/slots/ireland_slots_cfg'),
            name: 'ireland_slots_cfg',
            meta: { title: '爱尔兰精灵' }
          },
          {
            path: 'rabbit_slots_cfg',
            component: () => import('@/views/config/tableConfig/slots/rabbit_slots_cfg'),
            name: 'rabbit_slots_cfg',
            meta: { title: '金钱兔' }
          },
          {
            path: 'slots_winner_record',
            component: () => import('@/views/config/tableConfig/slots/slots_winner_record'),
            name: 'slots_winner_record',
            meta: { title: '大奖记录' }
          },
          {
            path: 'slots_act_configs',
            component: () => import('@/views/config/tableConfig/slots/slotsActConfig'),
            name: 'slots_act_configs',
            meta: { title: '剧本游戏配置' }
          },
          {
            path: 'slots_act_common',
            component: () => import('@/views/config/tableConfig/slots/slotsActCommon'),
            name: 'slots_act_common',
            meta: { title: '剧本通用配置' }
          }

        ]
      },

      {
        path: 'level_hide',
        component: () => import('@/views/config/tableConfig/level_hide'),
        name: 'level_hide',
        meta: { title: '场次隐藏配置' }
      },
      {
        path: 'prize_pool',
        component: () => import('@/views/online/prizePool'),
        name: 'prize_pool',
        meta: { title: '小游戏奖池配置' }
      },
      {
        path: 'slots_rooms',
        component: () => import('@/views/config/tableConfig/slots_rooms'),
        name: 'slots_rooms',
        meta: { title: '老虎机房间列表' }
      },
      {
        path: 'miniGamesCfg',
        component: () => import('@/views/empty'),
        redirect: 'noRedirect',
        meta: { title: '小游戏配置', noCache: true },
        children: [
          {
            path: 'tower_cfg',
            component: () => import('@/views/config/tableConfig/minigames/tower'),
            name: 'tower_cfg',
            meta: { title: 'Tower - ' }
          }

        ]
      }
    ]
  },
  {
    path: '/winConfig',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '输赢调控', icon: 'dashboard', noCache: true, perm: 'CORE_CFG' },
    children: [
      {
        path: 'gambleSchemaCfg',
        component: () => import('@/views/config/winConfig/gambleSchemaCfg'),
        name: 'gambleSchemaCfg',
        meta: { title: '小游戏调控杂项配置 ◐', noCache: true }
      },
      {
        path: 'paySchemaCfg',
        component: () => import('@/views/config/winConfig/paySchema'),
        name: 'gambleSchemaCfg',
        meta: { title: '付费用户调控配置 ◐', noCache: true }
      },
      {
        path: 'VUPCfg',
        component: () => import('@/views/config/winConfig/VUPCfg'),
        name: 'VUPCfg',
        meta: { title: '小黑屋数值配置 ◐', noCache: true }
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
      },
      {
        path: 'jackpotLog',
        component: () => import('@/views/playerManage/jackpotLog'),
        name: 'ban',
        meta: { title: 'jackpot 流水 ◐', noCache: true, perm: 'CUTOMER' }
      }
    ]
  },
  {
    path: '/thirdparty',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '第三方管理', icon: 'user' },
    children: [
      {
        path: 'thirdparty',
        component: () => import('@/views/thirdparty/thirdparty'),
        name: 'thirdpartyManage',
        meta: { title: '第三方信息 ◐' }
      },
      {
        path: 'transfer',
        component: () => import('@/views/thirdparty/transfer'),
        name: 'transfer_log',
        meta: { title: '转账流水 ◐' }
      },
      {
        path: 'playlog_list',
        component: () => import('@/views/thirdparty/playlog'),
        name: 'thirdparty_playlog',
        meta: { title: '牌局流水 ◐' }
      },
      {
        path: 'thirdparty_game_list',
        component: () => import('@/views/thirdparty/gamelist'),
        name: 'thirdparty_game_list',
        meta: { title: '第三方子游戏 ◐' }
      }
    ]
  },
  {
    path: '/playlog',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '牌局日志 ◐', icon: 'log' },
    // eslint-disable-next-line no-sparse-arrays
    children: [
      {
        path: 'playlog_lucky9',
        component: () => import('@/views/playerManage/playlog'),
        name: 'playlog_lucky9',
        meta: { title: 'Lucky9 ◐', gid: 23 }
      },
      {
        path: 'playlog_car',
        component: () => import('@/views/playerManage/playlog'),
        name: 'playlog_car',
        meta: { title: 'Car - 车标转盘 ◐', gid: 5 }
      },
      {
        path: 'playlog_crash',
        component: () => import('@/views/playerManage/playlog'),
        name: 'playlog_crash',
        meta: { title: 'Crash - 小火箭◐', gid: 10 }
      },
      {
        path: 'playlog_sweeper',
        component: () => import('@/views/playerManage/playlog'),
        name: 'playlog_sweeper',
        meta: { title: 'Sweeper - 扫雷◐', gid: 20 }
      },
      {
        path: 'playlog_tongits',
        component: () => import('@/views/playerManage/tongitsPlaylog'),
        name: 'playlog_tongits',
        meta: { title: 'Tongits - 标准 ◐', gid: 22 }
      },
      {
        path: 'playlog_colorgame',
        component: () => import('@/views/playerManage/playlog'),
        name: 'playlog_colorgame',
        meta: { title: 'ColorGame - ◐', gid: 25 }
      },
      {
        path: 'playlog_ab',
        component: () => import('@/views/playerManage/playlog'),
        name: 'playlog_ab',
        meta: { title: 'AB - Andar Bahar ◐', gid: 2 }
      },
      {
        path: 'slotsLog',
        component: () => import('@/views/empty'),
        redirect: 'noRedirect',
        meta: { title: 'Slots - 老虎机日志', noCache: true },
        children: [
          {
            path: 'beauty_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'beauty_slots_log',
            meta: { title: 'beauty - 睡美人', gid: 52 }
          },
          {
            path: 'joker_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'joker_slots_log',
            meta: { title: 'joker - 小丑', gid: 53 }
          },
          {
            path: 'gold_train_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'gold_train_slots_log',
            meta: { title: 'goldTrain - 黄金列车', gid: 54 }
          },
          {
            path: 'phoenix_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'phoenix_slots_log',
            meta: { title: 'phoenix - 凤凰', gid: 51 }
          },
          {
            path: 'gold_miner_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'gold_miner_slots_log',
            meta: { title: 'goldMiner - 黄金矿工', gid: 57 }
          },
          {
            path: 'aladdin_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'gold_miner_slots_log',
            meta: { title: 'aladdin - 阿拉丁', gid: 58 }
          },
          {
            path: 'chicago_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'chicago_slots_log',
            meta: { title: 'chicago - 芝加哥', gid: 59 }
          },
          {
            path: 'ireland_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'ireland_slots_log',
            meta: { title: 'Ireland - 爱尔兰精灵', gid: 66 }
          },
          {
            path: 'rabbit_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'rabbit_slots_log',
            meta: { title: 'Rabbit - 金钱兔', gid: 67 }
          }

        ]
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
            path: 'emojPrice',
            component: () => import('@/views/config/baseConfig/emojPrice'),
            name: 'emojPrice',
            meta: { title: '道具价格 ◐', noCache: true }
          },
          {
            path: 'onlineCnt',
            component: () => import('@/views/config/baseConfig/online_cnt'),
            name: 'onlineCnt',
            meta: { title: '在线人数配置', noCache: true }
          },
          {
            path: 'smsWhite',
            component: () => import('@/views/config/baseConfig/sms_white'),
            name: 'smsWhite',
            meta: { title: '白名单发短信配置', noCache: true }
          }
        ]
      },
      {
        path: 'customize',
        component: () => import('@/views/config/baseConfig/customize'),
        name: 'customize',
        meta: { title: '自定义配置 ◐', noCache: true }
      },
      {
        path: 'broadcast',
        component: () => import('@/views/config/baseConfig/broadcast'),
        name: 'broadcast',
        meta: { title: '广播配置 ◐', noCache: true }
      },
      {
        path: 'commonData',
        component: () => import('@/views/config/baseConfig/common_data'),
        name: 'commonData',
        meta: { title: '公共数据配置 ◐', noCache: true }
      },
      {
        path: 'review',
        component: () => import('@/views/config/review'),
        name: 'review',
        meta: { title: '审核发布', noCache: true, perm: 'REVIEW_CHECK' }
      },
      {
        path: 'frontProxy',
        component: () => import('@/views/config/frontConfig/menu'),
        redirect: 'noRedirect',
        meta: { title: 'AP代理配置', icon: 'example', noCache: true },
        children: [
          {
            path: 'apcfg',
            component: () => import('@/views/config/frontConfig/front_ap_config'),
            name: 'apcfg',
            meta: { title: 'AP配置', noCache: true }
          },
          {
            path: 'apgroup',
            component: () => import('@/views/config/frontConfig/front_ap_group'),
            name: 'apgroup',
            meta: { title: 'AP分组配置', noCache: true }
          },
          {
            path: 'frontCfg',
            component: () => import('@/views/config/frontConfig/front_config'),
            name: 'frontCfg',
            meta: { title: '代理配置', noCache: true }
          }
        ]
      },
      {
        path: 'wspProxy',
        component: () => import('@/views/config/wspConfig/menu'),
        redirect: 'noRedirect',
        meta: { title: 'WebSocket代理管理', icon: 'example', noCache: true },
        children: [
          {
            path: 'wsp_instance',
            component: () => import('@/views/config/wspConfig/wsp_instance'),
            name: 'wsp_instance',
            meta: { title: '1-代理实例管理', noCache: true }
          },
          {
            path: 'wsp_group',
            component: () => import('@/views/config/wspConfig/wsp_group'),
            name: 'wsp_group',
            meta: { title: '2-代理分组管理', noCache: true }
          },
          {
            path: 'wsp_config',
            component: () => import('@/views/config/wspConfig/wsp_config'),
            name: 'wsp_config',
            meta: { title: '3-代理服务分派', noCache: true }
          }
        ]
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
            meta: { title: '多语言配置(Android)', perm: 'LANG_RES', platform: 'android' }
          },
          {
            path: 'langResIOS',
            component: () => import('@/views/devTools/langRes'),
            name: 'langResIOS',
            meta: { title: '多语言配置(IOS)', perm: 'LANG_RES', platform: 'ios' }
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
            path: 'langZips_ios',
            component: () => import('@/views/devTools/langZips'),
            name: 'langZips_ios',
            hidden: true,
            meta: { title: '多语言下载', platform: 'ios' }
          }
        ]
      },
      {
        path: 'subGameList',
        component: () => import('@/views/devTools/devTools'),
        redirect: 'noRedirect',
        meta: { title: '子游戏列表配置', icon: 'code' },
        children: [
          {
            path: 'subgame_android',
            component: () => import('@/views/config/tableConfig/subgame'),
            name: 'subgame_android',
            meta: { title: 'Android ◐', noCache: true, platform: 'android' }
          },
          {
            path: 'subgame_ios',
            component: () => import('@/views/config/tableConfig/subgame'),
            name: 'subgame_ios',
            meta: { title: 'IOS ◐', noCache: true, platform: 'ios' }
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
        path: 'testToolsGroup',
        component: () => import('@/views/devTools/devTools'),
        redirect: 'noRedirect',
        meta: { title: '测试工具集', icon: 'tab' },
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
          }
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
