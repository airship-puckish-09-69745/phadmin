import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import Watermark from '@/utils/watermark'
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
    meta: { title: '系统健康监测', icon: 'el-icon-pie-chart', perm: 'DATA_MONITOR' },
    children: [
      // {
      //   path: 'dashboard',
      //   component: () => import('@/views/playerManage/systemMoneyChart'),
      //   name: 'dashboard',
      //   meta: { title: '系统健康监测 ◐', icon: 'risk', perm: 'KEY_DATA_MONITOR' }
      // },
      {
        path: '/dashboard',
        component: () => import('@/views/playerManage/systemMoneyChartV2.vue'),
        name: 'dashboard',
        meta: { title: '系统健康监测 ◐', icon: 'risk', perm: 'KEY_DATA_MONITOR' }
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
    meta: { title: '系统监控', icon: 'el-icon-pie-chart', perm: 'DATA_MONITOR' },
    children: [
      {
        path: 'data',
        component: () => import('@/views/online/onlineData'),
        name: 'data',
        meta: { title: '在线数据 ◐' }
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
      // {
      //   path: 'slotsScriptStatistics_old',
      //   component: () => import('@/views/online/slotsScriptStatistics_old.vue'),
      //   name: 'slotsScriptStatistics_old',
      //   meta: { title: 'Slots剧本监控(旧)', noCache: true }
      // },
      {
        path: 'slotsScriptStatistics',
        component: () => import('@/views/online/slotsScriptStatistics.vue'),
        name: 'slotsScriptStatistics',
        meta: { title: 'Slots剧本监控', perm: 'SLOTS_PROCESS' , noCache: true }
      },
      {
        path: 'piggyStatistics',
        component: () => import('@/views/online/piggyStatistics.vue'),
        name: 'piggyStatistics',
        meta: { title: '金猪大奖统计', noCache: true }
      },
      /* {
        path: 'play_log_top100',
        component: () => import('@/views/playerManage/PlaylogTop100'),
        name: 'play_log_top100',
        meta: { title: '牌局排行榜 ◐' }
      },*/
      /*     {
        path: 'play_log_together_top100',
        component: () => import('@/views/playerManage/PlaylogTogetherTop100'),
        name: 'play_log_together_top100',
        meta: { title: 'Tongits同桌排行榜 ◐' }
      },*/
      {
        path: 'sweeperTableUserData',
        component: () => import('@/views/playerManage/sweeperTableUserData'),
        name: 'sweeperTableUserData',
        meta: { title: '扫雷 - 桌子数据 ◐' }
      },
      {
        path: 'colorTableUserData',
        component: () => import('@/views/playerManage/colorTableUserData'),
        name: 'colorTableUserData',
        meta: { title: 'color - 桌子数据 ◐' }
      },
      {
        path: 'bigprizelog',
        component: () => import('@/views/playerManage/bigprizelog'),
        name: '大奖日志',
        meta: { title: 'slots - 大奖日志 ◐' }
      }
    ]
  },
  {
    path: '/tableConfig',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '场次配置', icon: 'example', perm: 'CFG_MANAGEMENT' },
    children: [
      {
        path: 'PokersCfg',
        component: () => import('@/views/empty'),
        redirect: 'noRedirect',
        meta: { title: 'Poker 牌类', noCache: true },
        children: [
          {
            path: 'TongitsCfg',
            component: () => import('@/views/empty'),
            redirect: 'noRedirect',
            meta: { title: 'Tongits', noCache: true },
            children: [
              {
                path: 'tongitsTable',
                component: () => import('@/views/config/tableConfig/tongitsTable'),
                name: 'tongitsTable',
                meta: { title: 'Tongits ◐' }
              },
              /* {
                 path: 'tongitsClassicTable',
                 component: () => import('@/views/config/tableConfig/tongitsTableClassic'),
                 name: 'tongitsTableClassic',
                 meta: { title: 'Tongits-经典 ◐' }
               },*/
              {
                path: 'tongitsLaiZiTable',
                component: () => import('@/views/config/tableConfig/tongitsTableLaiZi'),
                name: 'tongitsTableLaiZi',
                meta: { title: 'Tongits-Joker ◐' }
              },
              {
                path: 'tongitsQuickTable',
                component: () => import('@/views/config/tableConfig/tongitsTableQuick'),
                name: 'tongitsTableQuick',
                meta: { title: 'Tongits-Quick ◐' }
              },
              {
                path: 'tongitsswapTable',
                component: () => import('@/views/config/tableConfig/tongitsTableSwap'),
                name: 'tongitsSwapTable',
                meta: { title: 'Tongits-Swap ◐' }
              },
              /*          {
                          path: 'tongitsTogether',
                          component: () => import('@/views/config/tableConfig/tongits_blacklist'),
                          name: 'tongitsTogether',
                          meta: { title: '同桌黑名单 ◐' }
                        },*/
              {
                path: 'tongitsTableAI',
                component: () => import('@/views/config/tableConfig/tongitsAIConfig'),
                name: 'tongitsTableAI',
                meta: { title: 'TongitsAI ◐' }
              },
              /*          {
                          path: 'tongitsTableAIClassic',
                          component: () => import('@/views/config/tableConfig/tongitsClassicAIConfig'),
                          name: 'tongitsClassicTableAI',
                          meta: { title: 'Tongits经典-AI ◐' }
                        },*/
              {
                path: 'tongitsAIList',
                component: () => import('@/views/config/tableConfig/tongitsAIListConfig'),
                name: 'tongitsAIList',
                meta: { title: 'TongitsAI-List ◐' }
              }
            ]
          },
          {
            path: 'PusoyCfg',
            component: () => import('@/views/empty'),
            redirect: 'noRedirect',
            meta: { title: 'Pusoy', noCache: true },
            children: [
              {
                path: 'pusoyTable',
                component: () => import('@/views/config/tableConfig/pusoyTable'),
                name: 'pusoyTable',
                meta: { title: 'Pusoy ◐' }
              },
              {
                path: 'PusoySwapTable',
                component: () => import('@/views/config/tableConfig/pusoySwapTable'),
                name: 'pusoySwapTable',
                meta: { title: 'Pusoy Swap  ◐' }
              },
              {
                path: 'pusoyPresetCards',
                component: () => import('@/views/config/tableConfig/pusoyPresetCards'),
                name: 'pusoyPresetCards',
                meta: { title: 'Pusoy用户配牌控制 ◐' }
              }
            ]
          },
          {
            path: 'PusoyDosCfg',
            component: () => import('@/views/empty'),
            redirect: 'noRedirect',
            meta: { title: 'PusoyDos', noCache: true },
            children: [
              {
                path: 'PusoyDosTable',
                component: () => import('@/views/config/tableConfig/pusoyDos/pusoyDosTable'),
                name: 'PusoyDosTable',
                meta: { title: 'PusoyDos ◐' }
              },
              {
                path: 'PusoyDosTogether',
                component: () => import('@/views/config/tableConfig/pusoyDos/pusoyDos_blacklist'),
                name: 'PusoyDosTogether',
                meta: { title: '同桌黑名单 ◐' }
              }
            ]
          },
          {
            path: 'Lucky9Cfg',
            component: () => import('@/views/empty'),
            redirect: 'noRedirect',
            meta: { title: 'Lucky9', noCache: true },
            children: [
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
              }
            ]
          },
          {
            path: 'blackJackTable',
            component: () => import('@/views/config/tableConfig/blackJackTable'),
            name: 'blackJackTable',
            meta: { title: 'BlackJack ◐' }
          },
          {
            path: 'dominoTable',
            component: () => import('@/views/config/tableConfig/dominoTable'),
            name: 'dominoTable',
            meta: { title: 'Domino ◐' }
          },
          {
            path: 'solitaire',
            component: () => import('@/views/config/tableConfig/solitaire'),
            name: 'solitaire',
            meta: { title: 'Solitaire ◐' }
          },
          { // 牛牛
            path: 'niuniuCfg',
            component: () => import('@/views/empty'),
            name: 'niuniuTable',
            meta: { title: 'NiuNiu ◐', noCache: true },
            children: [
              {
                path: 'niuniuTable',
                component: () => import('@/views/config/tableConfig/niuniuTable'),
                name: 'niuniuTable',
                meta: { title: 'NiuNiu ◐' }
              },
              {
                path: 'niuniuRobotSetting',
                component: () => import('@/views/config/tableConfig/niuniuRobotSetting'),
                name: 'niuniuRobotSetting',
                meta: { title: 'NiuNiu AI ◐' }
              },
              {
                path: 'niuniuAIList',
                component: () => import('@/views/config/tableConfig/niuniuAIListConfig'),
                name: 'niuniuAIList',
                meta: { title: 'NiuNiuAI-List ◐' }
              }
            ]
          },
          { // 金拉米
            path: 'ginrummyTable',
            component: () => import('@/views/config/tableConfig/ginrummyTable'),
            name: 'ginrummyTable',
            meta: { title: 'GinRummy ◐' }
          },
          {
            path: 'texasTable',
            component: () => import('@/views/config/tableConfig/texasTable'),
            name: 'texasTable',
            meta: { title: 'Texas - 德州' }
          },
          {
            path: 'DominoQiuQiu',
            component: () => import('@/views/config/tableConfig/qiuqiuTable'),
            name: 'DominoQiuQiu',
            meta: { title: 'DominoQiuQiu' }
          },
          {
            path: 'Uno',
            component: () => import('@/views/empty'),//import('@/views/config/tableConfig/uno/unoTable'),
            redirect: 'noRedirect',
            meta: { title: 'Uno', noCache: true },
            children: [
              {
                path: 'unoTable',
                component: () => import('@/views/config/tableConfig/uno/unoTable'),
                name: 'unoTable',
                meta: { title: 'Uno ◐' }
              },
              {
                path: 'unoTableTeam',
                component: () => import('@/views/config/tableConfig/uno/unoTeamTable'),
                name: 'unoTableTeam',
                meta: { title: 'Uno-Team ◐' }
              }
            ]
          },
          {
            path: 'gameWaitQueue',
            component: () => import('@/views/config/tableConfig/gameWaitQueue.vue'),
            name: 'gameWaitQueue',
            meta: { title: '排队入桌配置 ◐' }
          },
          {
            path: 'texasNlh',
            component: () => import('@/views/empty'),
            redirect: 'noRedirect',
            meta: { title: '德州专业版 ', noCache: true },
            children: [
              {
                path: 'texasNlhTable',
                component: () => import('@/views/empty'),
                redirect: 'noRedirect',
                meta: { title: '德州配桌', noCache: true },
                children: [
                  {
                    path: 'texasNlhTable',
                    component: () => import('@/views/texas2dpro/table/texasNlhTable'),
                    name: 'texasNlhTable',
                    meta: { title: '无限德州' }
                  },
                  {
                    path: 'texasOmhTable',
                    component: () => import('@/views/texas2dpro/table/texasOmhTable'),
                    name: 'texasNlhTable',
                    meta: { title: '奥马哈' }
                  },
                  {
                    path: 'texasSdpTable',
                    component: () => import('@/views/texas2dpro/table/texasSdpTable'),
                    name: 'texasNlhTable',
                    meta: { title: '6+短牌' }
                  },
                  {
                    path: 'texasPusoyTable',
                    component: () => import('@/views/texas2dpro/table/texasPusoyTable'),
                    name: 'texasPusoyTable',
                    meta: { title: '大菠萝' }
                  },
                  {
                    path: 'texasAofTable',
                    component: () => import('@/views/texas2dpro/table/texasAofTable'),
                    name: 'texasAofTable',
                    meta: { title: 'AOF场' }
                  },
                  {
                    path: 'texasRushTable',
                    component: () => import('@/views/texas2dpro/table/texasRushTable'),
                    name: 'texasRushTable',
                    meta: { title: 'Rush场' }
                  },
                  {
                    path: 'texasMttTable',
                    component: () => import('@/views/texas2dpro/table/texasMatchTable'),
                    name: 'texasMttTable',
                    meta: { title: '比赛场' }
                  },
                  {
                    path: 'texasMatchReward',
                    component: () => import('@/views/texas2dpro/table/texasMatchReward'),
                    name: 'texasMatchReward',
                    meta: { title: '比赛动态奖励' }
                  },
                  {
                    path: 'texasMatchReward2',
                    component: () => import('@/views/texas2dpro/table/texasMatchReward2'),
                    name: 'texasMatchReward2',
                    meta: { title: '比赛固定奖励' }
                  },
                  {
                    path: 'texasMatchBlind',
                    component: () => import('@/views/texas2dpro/table/texasMatchBlind'),
                    name: 'texasMatchBlind',
                    meta: { title: '比赛盲注' }
                  },
                  {
                    path: 'texasNlhCfg',
                    component: () => import('@/views/texas2dpro/table/texasNlhCfg'),
                    name: 'texasNlhCfg',
                    meta: { title: '公共配置' }
                  }
                ]
              },
              {
                path: '/updateCfg',
                component: () => import('@/views/empty'),
                redirect: 'noRedirect',
                meta: { title: '更新配置', noCache: true },
                children: [
                  {
                    path: 'packageList',
                    component: () => import('@/views/texas2dpro/version/packageModule'),
                    name: 'packageList',
                    meta: { title: '包管理' }
                  },
                  {
                    path: 'versionList',
                    component: () => import('@/views/texas2dpro/version/versionModule'),
                    name: 'versionList',
                    meta: { title: '版本管理' }
                  }
                ]
              },
              {
                path: '/texasProActivityNotice',
                component: () => import('@/views/texas2dpro/activity/texasProActivityNotice'),
                name: 'noticeList',
                meta: { title: '活动公告' }
              }
            ]
          },
          {
            path: '/billiardsVersion',
            component: () => import('@/views/empty'),
            redirect: 'noRedirect',
            meta: { title: '台球专业版' },
            children: [
              {
                path: 'billiardsTable',
                component: () => import('@/views/empty'),
                redirect: 'noRedirect',
                meta: { title: '台球配桌', noCache: true },
                children: [
                  {
                    path: 'billiardsTable',
                    component: () => import('@/views/billiards/table/billiardsTable'),
                    name: 'billiardsTable',
                    meta: { title: '台球' }
                  }
                ]
              }
            ]
          },
          {
            path: '/filipinoMahjongVersion',
            component: () => import('@/views/empty'),
            redirect: 'noRedirect',
            meta: { title: '菲律宾麻将' },
            children: [
              {
                path: 'filipinoMahjongTable',
                component: () => import('@/views/empty'),
                redirect: 'noRedirect',
                meta: { title: '菲律宾麻将配桌', noCache: true },
                children: [
                  {
                    path: 'filipinoMahjongTable',
                    component: () => import('@/views/filipinoMahjong/table/filipinoMahjongTable'),
                    name: 'filipinoMahjongTable',
                    meta: { title: '菲律宾麻将配桌' }
                  }
                ]
              },
              {
                path: 'filipinoMahjongRobot',
                component: () => import('@/views/empty'),
                redirect: 'noRedirect',
                meta: { title: '菲律宾麻将 AI', noCache: true },
                children: [
                  {
                    path: 'filipinoMahjongRobot',
                    component: () => import('@/views/filipinoMahjong/table/filipinoMahjongRobot'),
                    name: 'filipinoMahjongRobot',
                    meta: { title: '菲律宾麻将 AI' }
                  }
                ]
              }
            ]
          }, {
            path: 'MinesBattleTable',
            component: () => import('@/views/config/tableConfig/MinesBattleTable'),
            name: 'MinesBattleTable',
            meta: { title: 'MinesBattle ◐' }
          }

        ]
      },
      {
        path: 'SmallGameCfg',
        component: () => import('@/views/empty'),
        redirect: 'noRedirect',
        meta: { title: 'Casio 下注类', noCache: true },
        children: [
          {
            path: 'miniAb_cfg',
            component: () => import('@/views/config/tableConfig/miniAbGame'),
            name: 'miniAb_cfg',
            meta: { title: 'Andar Bahar ◐' }
          },
          {
            path: 'miniBcr_cfg',
            component: () => import('@/views/config/tableConfig/miniBcrGame'),
            name: 'miniBcr_cfg',
            meta: { title: 'Baccarat ◐' }
          },
          {
            path: 'color_game',
            component: () => import('@/views/config/tableConfig/colorGame'),
            // component: () => import('@/views/config/tableConfig/colorGameMars'),
            name: 'gameColorCfg',
            meta: { title: 'Color game ◐' }
          },
          {
            path: 'gameCrash',
            component: () => import('@/views/config/tableConfig/gameCrash'),
            name: 'gameCrash',
            meta: { title: 'Crash - 小火箭 ◐' }
          },
          {
            path: 'miniDvt_cfg',
            component: () => import('@/views/config/tableConfig/miniDvtGame'),
            name: 'miniDvt_cfg',
            meta: { title: 'Drogon&Tiger ◐' }
          },
          {
            path: 'hilo_cfg',
            component: () => import('@/views/config/tableConfig/minigames/hilo'),
            name: 'hilo_cfg',
            meta: { title: 'Hilo ◐' }
          },
          {
            path: 'sweeper',
            component: () => import('@/views/config/tableConfig/sweeperCfg'),
            name: 'sweeperCfg',
            meta: { title: 'Mines - 扫雷 ◐' }
          },
          {
            path: 'Piggy',
            component: () => import('@/views/config/tableConfig/piggy'),
            name: 'Piggy',
            meta: { title: 'Piggy Tap◐' }
          },
          {
            path: 'sicbo_cfg',
            component: () => import('@/views/config/tableConfig/sicboGame'),
            name: 'sicbo_cfg',
            meta: { title: 'Sicbo ◐' }
          },
          {
            path: 'tower_cfg',
            component: () => import('@/views/config/tableConfig/minigames/tower'),
            name: 'tower_cfg',
            meta: { title: 'Tower ◐' }
          },
          {
            path: 'miniWindrop_cfg',
            component: () => import('@/views/config/tableConfig/minigames/miniWindrop_cfg'),
            name: 'miniWindrop_cfg',
            meta: { title: 'Windrop ◐' }
          },
          {
            path: 'miniWindropc_cfg',
            component: () => import('@/views/config/tableConfig/minigames/miniWindropc'),
            name: 'miniWindropc_cfg',
            meta: { title: 'Windrop积分 ◐' }
          },
          {
            path: 'UpDown',
            component: () => import('@/views/config/tableConfig/UpDownTable'),
            name: 'UpDown',
            meta: { title: '7Up7Down ◐' }
          },
          {
            path: 'Dropball_cfg',
            component: () => import('@/views/config/tableConfig/dropballConfig'),
            name: 'Dropball_cfg',
            meta: { title: 'Dropball ◐' }
          },
          {
            path: 'VideoPoker_cfg',
            component: () => import('@/views/config/tableConfig/minigames/videoPoker.vue'),
            name: 'VideoPoker_cfg',
            meta: { title: 'VideoPoker ◐' }
          },
          {
            path: 'WingoLottery_cfg',
            component: () => import('@/views/config/tableConfig/minigames/wingoLottery.vue'),
            name: 'WingoLottery_cfg',
            meta: { title: 'WingoLottery ◐' }
          },
          {
            path: 'MultiPlayerNiuNiu_cfg',
            component: () => import('@/views/config/tableConfig/minigames/niuniu.vue'),
            name: 'MultiPlayerNiuNiu_cfg',
            meta: { title: 'Multi NiuNiu ◐' }
          },
          {
            path: 'carracing_cfg',
            component: () => import('@/views/config/tableConfig/carracingConfig'),
            name: 'carracing_cfg',
            meta: { title: 'Carracing ◐' }
          }
        ]
      },

      {
        path: 'slotsCfg',
        component: () => import('@/views/empty'),
        redirect: 'noRedirect',
        meta: { title: 'Slots - 老虎机', noCache: true },
        children: [
          {
            path: 'slotsProCfg',
            component: () => import('@/views/empty'),
            redirect: 'noRedirect',
            meta: { title: '正式环境', noCache: true },
            children: [
              {
                path: 'candypartyway_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/candypartyway_slots_cfg'),
                name: 'candypartyway_slots_cfg',
                meta: { title: 'Candy Rush' }
              },
              {
                path: 'candycandy_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/candycandy_slots_cfg'),
                name: 'candycandy_slots_cfg',
                meta: { title: 'Candy Crazy' }
              },
              {
                path: 'supergem_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/supergem_slots_cfg'),
                name: 'supergem_slots_cfg',
                meta: { title: 'SuperGems' }
              },
              {
                path: 'millionaire_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/millionaire_slots_cfg'),
                name: 'millionaire_slots_cfg',
                meta: { title: 'Millionaire' }
              },
              {
                path: 'superace_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/superace_slots_cfg'),
                name: 'superace_slots_cfg',
                meta: { title: 'FortuneAce' }
              },
              {
                path: 'supergemii_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/supergemii_slots_cfg'),
                name: 'supergemii_slots_cfg',
                meta: { title: 'SuperGemsII' }
              },
              {
                path: 'crazy777_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/crazy777_slots_cfg'),
                name: 'crazy777_slots_cfg',
                meta: { title: 'Lucky777' }
              },
              {
                path: 'moneycoming_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/moneycoming_slots_cfg'),
                name: 'moneycoming_slots_cfg',
                meta: { title: 'FortuneComing' }
              },
              {
                path: 'fortuneacego_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/fortuneacego_slots_cfg'),
                name: 'fortuneacego_slots_cfg',
                meta: { title: 'UltraAce' }
              },
              {
                path: 'chargebison_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/chargebison_slots_cfg'),
                name: 'chargebison_slots_cfg',
                meta: { title: 'Wild Buffalo' }
              },
              {
                path: 'romanarena_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/romanarena_slots_cfg'),
                name: 'romanarena_slots_cfg',
                meta: { title: 'Roman Arena' }
              },
              {
                path: 'supertongit_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/supertongit_slots_cfg'),
                name: 'supertongit_slots_cfg',
                meta: { title: 'SuperTongit' }
              },
              {
                path: 'aladdinlamp_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/aladdinlamp_slots_cfg'),
                name: 'aladdinlamp_slots_cfg',
                meta: { title: 'Aladdin\'s Lamp' }
              },
              {
                path: 'supergemiii_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/supergemiii_slots_cfg'),
                name: 'supergemiii_slots_cfg',
                meta: { title: 'SuperGemsIII' }
              },
              {
                path: 'grandace_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/grandace_slots_cfg'),
                name: 'grandace_slots_cfg',
                meta: { title: 'GrandAce' }
              },
              {
                path: 'wrathofzeus_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/wrathofzeus_slots_cfg'),
                name: 'wrathofzeus_slots_cfg',
                meta: { title: 'WrathOfZeus' }
              },
              {
                path: 'crazyace_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/crazyace_slots_cfg'),
                name: 'crazyace_slots_cfg',
                meta: { title: 'CrazyAce' }
              },
              {
                path: 'sharkkingdom_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/sharkkingdom_slots_cfg'),
                name: 'sharkkingdom_slots_cfg',
                meta: { title: 'SharkKingdom' }
              },
              {
                path: 'gigaace_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/gigaace_slots_cfg'),
                name: 'gigaace_slots_cfg',
                meta: { title: 'GigaAce' }
              },
              {
                path: 'majorace_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/majorace_slots_cfg'),
                name: 'majorace_slots_cfg',
                meta: { title: 'MajorAce' }
              },
              {
                path: 'mahjongfortune_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/mahjongfortune_slots_cfg'),
                name: 'mahjongfortune_slots_cfg',
                meta: { title: 'MahjongFortune' }
              },
              {
                path: 'firelink_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/firelink_slots_cfg'),
                name: 'firelink_slots_cfg',
                meta: { title: 'FireLink' }
              },
              {
                path: 'pharaohtreasure_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/pharaohtreasure_slots_cfg'),
                name: 'pharaohtreasure_slots_cfg',
                meta: { title: 'PharaohTreasure' }
              },
              {
                path: 'epicace_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/epicace_slots_cfg'),
                name: 'epicace_slots_cfg',
                meta: { title: 'EpicAce' }
              }
            ]
          },
          {
            path: 'slotsReviewCfg',
            component: () => import('@/views/empty'),
            redirect: 'noRedirect',
            meta: { title: '审核环境', noCache: true },
            children: [

              {
                path: 'candypartyallline_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/candypartyallline_slots_cfg'),
                name: 'candypartyallline_slots_cfg',
                meta: { title: 'Candy Rush(审)' }
              },
              {
                path: 'candycandymars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/candycandymars_slots_cfg'),
                name: 'candycandymars_slots_cfg',
                meta: { title: 'Candy Crazy(审)' }
              },
              {
                path: 'supergemmars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/supergemmars_slots_cfg'),
                name: 'supergemmars_slots_cfg',
                meta: { title: 'SuperGems(审)' }
              },
              {
                path: 'millionairemars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/millionairemars_slots_cfg'),
                name: 'millionairemars_slots_cfg',
                meta: { title: 'Millionaire(审)' }
              },
              {
                path: 'superacemars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/superacemars_slots_cfg'),
                name: 'superacemars_slots_cfg',
                meta: { title: 'FortuneAce(审)' }
              },
              {
                path: 'supergemiimars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/supergemiimars_slots_cfg'),
                name: 'supergemiimars_slots_cfg',
                meta: { title: 'SuperGemsII(审)' }
              },
              {
                path: 'crazy777mars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/crazy777mars_slots_cfg'),
                name: 'crazy777mars_slots_cfg',
                meta: { title: 'Lucky777(审)' }
              },
              {
                path: 'moneycomingmars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/moneycomingmars_slots_cfg'),
                name: 'moneycomingmars_slots_cfg',
                meta: { title: 'FortuneComing(审)' }
              },
              {
                path: 'fortuneacegomars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/fortuneacegomars_slots_cfg'),
                name: 'fortuneacegomars_slots_cfg',
                meta: { title: 'UltraAce(审)' }
              },
              {
                path: 'chargebisonmars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/chargebisonmars_slots_cfg'),
                name: 'chargebisonmars_slots_cfg',
                meta: { title: 'Wild Buffalo(审)' }
              },
              {
                path: 'romanarenamars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/romanarenamars_slots_cfg'),
                name: 'romanarenamars_slots_cfg',
                meta: { title: 'Roman Arena(审)' }
              },
              {
                path: 'supertongitmars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/supertongitmars_slots_cfg'),
                name: 'supertongitmars_slots_cfg',
                meta: { title: 'SuperTongit(审)' }
              },
              {
                path: 'aladdinlampmars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/aladdinlampmars_slots_cfg'),
                name: 'aladdinlampmars_slots_cfg',
                meta: { title: 'Aladdin\'s Lamp(审)' }
              },
              {
                path: 'supergemiiimars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/supergemiiimars_slots_cfg'),
                name: 'supergemiiimars_slots_cfg',
                meta: { title: 'SuperGemsIII(审)' }
              },
              {
                path: 'grandacemars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/grandacemars_slots_cfg'),
                name: 'grandacemars_slots_cfg',
                meta: { title: 'GrandAce(审)' }
              },
              {
                path: 'wrathofzeusmars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/wrathofzeusmars_slots_cfg'),
                name: 'wrathofzeusmars_slots_cfg',
                meta: { title: 'WrathOfZeus(审)' }
              },
              {
                path: 'crazyacemars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/crazyacemars_slots_cfg'),
                name: 'crazyacemars_slots_cfg',
                meta: { title: 'CrazyAce(审)' }
              },
              {
                path: 'sharkkingdommars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/sharkkingdommars_slots_cfg'),
                name: 'sharkkingdommars_slots_cfg',
                meta: { title: 'SharkKingdom(审)' }
              },
              {
                path: 'gigaacemars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/gigaacemars_slots_cfg'),
                name: 'gigaacemars_slots_cfg',
                meta: { title: 'GigaAce(审)' }
              },
              {
                path: 'majoracemars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/majoracemars_slots_cfg'),
                name: 'majoracemars_slots_cfg',
                meta: { title: 'MajorAce(审)' }
              },
              {
                path: 'pharaohtreasuremars_slots_cfg',
                component: () => import('@/views/config/tableConfig/slots/pharaohtreasuremars_slots_cfg'),
                name: 'pharaohtreasuremars_slots_cfg',
                meta: { title: 'Pharaoh Treasure(审)' }
              }
            ]
          },
          {
            path: 'millionaire_script_cfg',
            component: () => import('@/views/config/tableConfig/slots/slotsScript/MillionaireScriptCfg'),
            name: 'millionaire_script_cfg',
            meta: { title: '老虎机V3配置' }
          },
          {
            path: 'slots_act_configs_v2',
            component: () => import('@/views/config/tableConfig/slots/slotsActConfigV2'),
            name: 'slots_act_configs_v2',
            meta: { title: '剧本配置V2' }
          },
          {
            path: 'slots_mission',
            component: () => import('@/views/config/tableConfig/slots/slotsMission'),
            name: 'slots_mission',
            meta: { title: 'Slots任务配置' }
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
          },
          {
            path: 'slots_rooms',
            component: () => import('@/views/config/tableConfig/slots_rooms'),
            name: 'slots_rooms',
            meta: { title: '老虎机房间列表' }
          }
        ]
      },
      {
        path: 'prize_pool',
        component: () => import('@/views/online/prizePool'),
        name: 'prize_pool',
        meta: { title: '小游戏奖池配置', perm: 'KEY_DATA_MONITOR' }
      },
      {
        path: 'gambleSchemaCfg',
        component: () => import('@/views/config/winConfig/gambleSchemaCfg'),
        name: 'gambleSchemaCfg',
        meta: { title: '小游戏调控杂项配置 ◐', noCache: true }
      },
      {
        path: 'gameAuditConfig',
        component: () => import('@/views/config/tableConfig/gameAuditConfig.vue'),
        name: 'gameAuditConfig',
        meta: { title: 'GP审核配置 ◐' }
      }
    ]
  },
  {
    path: '/activityConfig',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '活动配置', icon: 'example', perm: 'CFG_MANAGEMENT' },
    children: [
      /*
      {
        path: 'millionPointRaceRuleConfig',
        component: () => import('@/views/empty'),
        redirect: 'noRedirect',
        meta: { title: '百万积分赛配置' },
        children: [
          {
            path: 'millionPointRaceRuleConfig',
            component: () => import('@/views/config/tableConfig/millionPointRaceRule/millionPointRaceRuleConfig'),
            name: 'millionPointRaceRuleConfig',
            meta: { title: '百万积分赛周期配置 🎶', noCache: true }
          },
          {
            path: 'millionPointRaceRuleCommonConfig',
            component: () => import('@/views/config/tableConfig/millionPointRaceRule/millionPointRaceRuleCommonConfig'),
            name: 'millionPointRaceRuleCommonConfig',
            meta: { title: '百万积分赛公共配置', noCache: true }
          },
          {
            path: 'activityLog',
            component: () => import('@/views/activityMillionPointRaceRule/activityLog.vue'),
            name: 'activityLog',
            meta: { title: '百万积分赛用户日志  🚩️' }
          },
          {
            path: 'pointRaceUserLog',
            component: () => import('@/views/activityMillionPointRaceRule/pointRaceUserLog.vue'),
            name: 'pointRaceUserLog',
            meta: { title: '百万积分赛排行榜' }
          },
          {
            path: 'UserDetailLog',
            component: () => import('@/views/activityMillionPointRaceRule/UserDetail.vue'),
            name: 'UserDetailLog',
            meta: { title: '百万积分赛用户信息' }
          }
        ]
      },
      */
      {
        path: 'pointRaceConfig',
        component: () => import('@/views/empty'),
        redirect: 'noRedirect',
        meta: { title: '积分赛配置' },
        children: [
          {
            path: 'pointRaceConfig',
            component: () => import('@/views/config/tableConfig/pointRace/pointRaceConfig'),
            name: 'pointRaceConfig',
            meta: { title: '周期配置', noCache: true }
          },
          {
            path: 'pointRaceCommonConfig',
            component: () => import('@/views/config/tableConfig/pointRace/pointRaceCommonConfig'),
            name: 'pointRaceCommonConfig',
            meta: { title: '公共配置', noCache: true }
          },
          {
            path: 'pointRaceUserInfo',
            component: () => import('@/views/activity/pointRace/userInfo.vue'),
            name: 'pointRaceUserInfo',
            meta: { title: '用户信息' }
          },
          {
            path: 'pointRaceUserLog',
            component: () => import('@/views/activity/pointRace/userLog.vue'),
            name: 'pointRaceUserLog',
            meta: { title: '用户日志' }
          },
          {
            path: 'pointRaceRank',
            component: () => import('@/views/activity/pointRace/rankInfo.vue'),
            name: 'pointRaceRank',
            meta: { title: '排行榜' }
          }
        ]
      },
      {
        path: 'h5game',
        component: () => import('@/views/empty'),
        name: 'h5game',
        meta: { title: 'H5游戏配置', noCache: true },
        children: [
          {
            path: 'basketballShootConfig',
            component: () => import('@/views/config/tableConfig/h5Game/basketballShootConfig.vue'),
            name: 'basketballShootConfig',
            meta: { title: '投篮游戏配置项', noCache: true }
          },
          {
            path: 'basketballShootRedeemCodes',
            component: () => import('@/views/config/tableConfig/h5Game/basketballShootRedeemCodes.vue'),
            name: 'basketballShootRedeemCodes',
            meta: { title: '投篮游戏兑奖券', noCache: true }
          }
        ]
      },
      {
        path: 'pokerTopic',
        component: () => import('@/views/empty'),
        name: 'pokerTopic',
        meta: { title: 'Poker专题活动配置', noCache: true },
        children: [
          {
            path: 'activityConfig',
            component: () => import('@/views/config/tableConfig/pokerTopic/pokerTopicActivityConfig.vue'),
            name: 'activityConfig',
            meta: { title: '活动信息配置', noCache: true }
          },
          {
            path: 'taskConfig',
            component: () => import('@/views/config/tableConfig/pokerTopic/pokerTopicTaskConfig'),
            name: 'taskConfig',
            meta: { title: '积分任务配置', noCache: true }
          },
          {
            path: 'rankConfig',
            component: () => import('@/views/config/tableConfig/pokerTopic/pokerTopicRankConfig'),
            name: 'rankConfig',
            meta: { title: '积分排名配置', noCache: true }
          },
          {
            path: 'randomBoxConfig',
            component: () => import('@/views/config/tableConfig/pokerTopic/pokerTopicRandomBoxConfig'),
            name: 'randomBoxConfig',
            meta: { title: '随机宝箱配置', noCache: true }
          },
          {
            path: 'scoreRewardsConfig',
            component: () => import('@/views/config/tableConfig/pokerTopic/pokerScoreRewardsConfig'),
            name: 'scoreRewardsConfig',
            meta: { title: '积分奖励配置', noCache: true }
          }
        ]
      },
      {
        path: 'gameZoneConfig',
        component: () => import('@/views/empty'),
        name: 'gameZoneConfig',
        meta: { title: 'gameZone配置', noCache: true },
        children: [
          {
            path: 'gameZoneConfig',
            component: () => import('@/views/config/tableConfig/activity/gameZoneConfig'),
            name: 'gameZoneConfig',
            meta: { title: 'gameZone配置', noCache: true }
          }
        ]
      },
      {
        path: 'christmasConfig',
        component: () => import('@/views/empty'),
        name: 'christmasConfig',
        meta: { title: '圣诞活动配置', noCache: true },
        children: [
          {
            path: 'christmasActivityConfig',
            component: () => import('@/views/config/tableConfig/activity/christmasFortuneTreeConfig'),
            name: 'christmasActivityConfig',
            meta: { title: '圣诞活动配置', noCache: true }
          }
        ]
      },
      {
        path: 'activityCommonConfig',
        component: () => import('@/views/config/tableConfig/activity/activityCommonConfig'),
        name: 'activityCommonConfig',
        meta: { title: '活动公共配置', noCache: true }
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
        meta: { title: 'jackpot 奖池流水 ◐', noCache: true, perm: 'CUTOMER' }
      },
      {
        path: 'jackpotAward',
        component: () => import('@/views/playerManage/jackpotAward'),
        name: 'ban',
        meta: { title: 'jackpot 中奖记录 ◐', noCache: true, perm: 'CUTOMER' }
      },
      {
        path: 'pointlog',
        component: () => import('@/views/playerManage/pointlog'),
        name: 'pointtransfer',
        meta: { title: '积分流水 ◐' }
      },
      {
        path: 'pointGameFailLog',
        component: () => import('@/views/playerManage/PointGameFailLog'),
        name: 'pointgamefail',
        meta: { title: '积分注单失败 ◐' }
      }
    ]
  },
  {
    path: '/match',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '比赛管理', icon: 'example', perm: 'CFG_MANAGEMENT' },
    children: [
      {
        path: 'matchConfig',
        component: () => import('@/views/matchManage/matchConfig'),
        name: 'matchConfig',
        meta: { title: '赛事管理', noCache: true }
      },
      {
        path: 'matchRule',
        component: () => import('@/views/matchManage/matchRule'),
        name: 'matchRule',
        meta: { title: '赛制管理', noCache: true }
      },
      {
        path: 'matchMonitor',
        component: () => import('@/views/matchManage/matchMonitor'),
        name: 'matchMonitor',
        meta: { title: '赛事监控', noCache: true }
      },
      {
        path: 'matchTcc',
        component: () => import('@/views/matchManage/matchTcc'),
        name: 'matchTcc',
        meta: { title: 'Tcc名单配置', noCache: true }
      },
      {
        path: 'matchLimitWhite',
        component: () => import('@/views/matchManage/matchLimitWhite'),
        name: 'matchLimitWhite',
        meta: { title: '限制白名单', noCache: true }
      },
      {
        path: 'matchWatcherList',
        component: () => import('@/views/matchManage/watcherList.vue'),
        name: 'matchWatcherList',
        meta: { title: '主播名单', noCache: true }
      },
      {
        path: 'matchPosterList',
        component: () => import('@/views/matchManage/posterList.vue'),
        name: 'matchPosterList',
        meta: { title: '比赛海报', noCache: true }
      },
      {
        path: 'matchGuideList',
        component: () => import('@/views/matchManage/matchGuide.vue'),
        name: 'matchPosterList',
        meta: { title: '赛事引导', noCache: true }
      }
    ]
  },
  {
    path: '/playlog',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '牌局日志 ◐', icon: 'log', perm: 'PLAYLOG_MANAGEMENT' },
    // eslint-disable-next-line no-sparse-arrays
    children: [
      {
        path: 'PokersLog',
        component: () => import('@/views/empty'),
        redirect: 'noRedirect',
        meta: { title: 'Poker 牌类', noCache: true },
        children: [
          {
            path: 'playlog_lucky9',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_lucky9',
            meta: { title: 'Lucky9 ◐', gid: 23 }
          },
          {
            path: 'playlog_pusoy',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_pusoy',
            meta: { title: 'Pusoy - ◐', gid: 21 }
          },
          {
            path: 'playlog_niuniu',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_domino',
            meta: { title: 'NiuNiu ◐', gid: 49 }
          },
          {
            path: 'playlog_pusoyDos',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_pusoyDos',
            meta: { title: 'PusoyDos - ◐', gid: 34 }
          },
          {
            path: 'playlog_uno',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_uno',
            meta: { title: 'Uno - 单人◐', gid: 117 }
          },
          {
            path: 'playlog_unoTeam',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_unoTeam',
            meta: { title: 'Uno - 组队◐', gid: 121 }
          },
          {
            path: 'playlog_tongits',
            component: () => import('@/views/playerManage/tongitsPlaylog'),
            name: 'playlog_tongits',
            meta: { title: 'Tongits - POT ◐', gid: 22 }
          },
          /*      {
                  path: 'playlog_classic_tongits',
                  component: () => import('@/views/playerManage/tongitsPlaylog'),
                  name: 'playlog_classic_tongits',
                  meta: { title: 'Tongits - 经典 ◐', gid: 31 }
                },*/
          {
            path: 'playlog_laizi_tongits',
            component: () => import('@/views/playerManage/tongitsPlaylog'),
            name: 'playlog_laizi_tongits',
            meta: { title: 'Tongits - Joker ◐', gid: 28 }
          },
          {
            path: 'playlog_quick_tongits',
            component: () => import('@/views/playerManage/tongitsPlaylog'),
            name: 'playlog_tongits',
            meta: { title: 'Tongits-Quick ', gid: 29 }
          },
          {
            path: 'playlog_swap_tongits',
            component: () => import('@/views/playerManage/tongitsPlaylog'),
            name: 'playlog_tongits',
            meta: { title: 'Tongits - Swap ◐', gid: 120 }
          },
          {
            path: 'playlog_texas',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_texas',
            meta: { title: 'Texas - 德州扑克◐', gid: 15 }
          },
          {
            path: 'playlog_solitaire',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_solitaire',
            meta: { title: 'Solitaire ◐', gid: 35 }
          },
          {
            path: 'playlog_blackjack',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_blackjack',
            meta: { title: 'BlackJack ◐', gid: 37 }
          },
          {
            path: 'playlog_domino',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_domino',
            meta: { title: 'Domino ◐', gid: 46 }
          },
          {
            path: 'playlog_qiuqiu',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_qiuqiu',
            meta: { title: 'DominoQiuQiu ◐', gid: 111 }
          },
          {
            path: 'playlog_pusoySwap',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_pusoySwap',
            meta: { title: 'PusoySwap ◐', gid: 113 }
          },
          {
            path: 'playlog_ginRummy',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_ginRummy',
            meta: { title: 'GinRummy◐', gid: 116 }
          },
          {
            path: 'texasNlhStat',
            component: () => import('@/views/empty'),
            redirect: 'noRedirect',
            meta: { title: '德州专业版', noCache: true },
            children: [
              {
                path: 'texasNlhInsure',
                component: () => import('@/views/texas2dpro/stat/texasNlhInsure'),
                name: 'texasNlhInsure',
                meta: { title: '保险数据' }
              },
              {
                path: 'texasNlhJP',
                component: () => import('@/views/texas2dpro/stat/texasNlhJP'),
                name: 'texasNlhJP',
                meta: { title: 'JP数据' }
              },
              {
                path: 'texasNlhGameLog',
                component: () => import('@/views/playerManage/playlog'),
                name: 'playlog_texasnlh',
                meta: { title: '无限德州', gid: 32 }
              },
              {
                path: 'texasMttGameLog',
                component: () => import('@/views/texas2dpro/stat/texasMttGameLog'),
                name: 'texasMttGameLog',
                meta: { title: 'MTT比赛场' }
              }/*,
              {
                path: 'texasNlhGameConsumeSta',
                component: () => import('@/views/texas2dpro/stat/texasNlhGameConsumeSta'),
                name: 'texasNlhGameDetail',
                meta: { title: '每日消耗统计' }
              }*/
            ]
          },
          {
            path: '/billiardsVersion',
            component: () => import('@/views/empty'),
            redirect: 'noRedirect',
            meta: { title: '台球专业版' },
            children: [
              {
                path: 'playlog_8Ball',
                component: () => import('@/views/playerManage/playlog'),
                name: 'playlog_8Ball',
                meta: { title: '8Ball ◐', gid: 47 }
              },
              {
                path: 'playlog_9Ball',
                component: () => import('@/views/playerManage/playlog'),
                name: 'playlog_9Ball',
                meta: { title: '9Ball ◐', gid: 48 }
              }
            ]
          },
          {
            path: '/filipinoMahjongVersion',
            component: () => import('@/views/empty'),
            redirect: 'noRedirect',
            meta: { title: '菲律宾麻将' },
            children: [
              {
                path: 'playlog_filipinoMahjong',
                component: () => import('@/views/playerManage/playlog'),
                name: 'playlog_filipinoMahjong',
                meta: { title: '菲律宾麻将 ◐', gid: 122 }
              }
            ]
          },
          {
            path: 'playlog_minesBattle',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_minesBattle',
            meta: { title: 'MinesBattle◐', gid: 123 }
          }
        ]
      },
      {
        path: 'CasioLog',
        component: () => import('@/views/empty'),
        redirect: 'noRedirect',
        meta: { title: 'Casio 下注类', noCache: true },
        children: [
          {
            path: 'playlog_colorgame',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_colorgame',
            meta: { title: 'ColorGame - ◐', gid: 25 }
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
            meta: { title: 'Mines - 扫雷◐', gid: 20 }
          },
          {
            path: 'playlog_tower',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_tower',
            meta: { title: 'Tower ◐', gid: 100 }
          },
          {
            path: 'playlog_hilo',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_hilo',
            meta: { title: 'Hilo ◐', gid: 102 }
          },
          {
            path: 'playlog_sicbo',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_sicbo',
            meta: { title: 'Sicbo ◐', gid: 101 }
          },
          {
            path: 'playlog_dvt',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_dvt',
            meta: { title: 'Drogon&Tiger ◐', gid: 104 }
          },
          {
            path: 'playlog_ab',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_ab',
            meta: { title: 'Andar Bahar ◐', gid: 105 }
          },
          {
            path: 'playlog_seven',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_seven',
            meta: { title: '7Up7Down ◐', gid: 6 }
          },
          {
            path: 'playlog_windrop',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_windrop',
            meta: { title: 'Windrop ◐', gid: 103 }
          },
          {
            path: 'playlog_windropc',
            component: () => import('@/views/playerManage/pointgameplaylog.vue'),
            name: 'playlog_windropc',
            meta: { title: 'Windrop积分 ◐', gid: 119 }
          },
          {
            path: 'playlog_piggy',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_piggy',
            meta: { title: 'Piggy Tap ◐', gid: 106 }
          },
          {
            path: 'playlog_baccarat',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_baccarat',
            meta: { title: 'Baccarat ◐', gid: 107 }
          },
          {
            path: 'playlog_dropBall',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_dropBall',
            meta: { title: 'DropBall ◐', gid: 108 }
          },
          {
            path: 'playlog_videopoker',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_videoPoker',
            meta: { title: 'VideoPoker ◐', gid: 110 }
          },
          {
            path: 'playlog_wingolottery',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_wingolottery',
            meta: { title: 'WingoLottery ◐', gid: 112 }
          },
          {
            path: 'playlog_multiplayeriuniu',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_multiplayerniuniu',
            meta: { title: 'Multi NiuNiu ◐', gid: 115 }
          },
          {
            path: 'playlog_carracing',
            component: () => import('@/views/playerManage/playlog'),
            name: 'playlog_carracing',
            meta: { title: 'Carracing ◐', gid: 118 }
          }
        ]
      },
      {
        path: 'slotsLog',
        component: () => import('@/views/empty'),
        redirect: 'noRedirect',
        meta: { title: 'Slots - 老虎机', noCache: true },
        children: [
          /*
          {
            path: 'beauty_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'beauty_slots_log',
            meta: { title: 'beauty - 睡美人', gid: 52 }
          },
          {
            path: 'phoenix_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'phoenix_slots_log',
            meta: { title: 'phoenix - 凤凰', gid: 51 }
          },
          */
          {
            path: 'candypartyway_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'candypartyway_slots_log',
            meta: { title: 'Candy Rush', gid: 76 }
          },
          {
            path: 'supergem_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'supergem_slots_log',
            meta: { title: 'SuperGems', gid: 78 }
          },

          {
            path: 'candycandy_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'candycandy_slots_log',
            meta: { title: 'Candy Craze', gid: 80 }
          },
          {
            path: 'millionaire_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'millionaire_slots_log',
            meta: { title: 'Millionaire', gid: 82 }
          },
          {
            path: 'superace_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'superace_slots_log',
            meta: { title: 'FortuneAce', gid: 84 }
          },
          {
            path: 'supergemii_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'supergemii_slots_log',
            meta: { title: 'SuperGemsII', gid: 86 }
          },
          {
            path: 'crazy777_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'crazy777_slots_log',
            meta: { title: 'Lucky777', gid: 88 }
          },
          {
            path: 'moneycoming_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'moneycoming_slots_log',
            meta: { title: 'FortuneComing', gid: 90 }
          },
          {
            path: 'fortuneacego_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'fortuneacego_slots_log',
            meta: { title: 'UltraAce', gid: 92 }
          },
          {
            path: 'chargebison_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'chargebison_slots_log',
            meta: { title: 'Wild Buffalo', gid: 94 }
          },
          {
            path: 'romanarena_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'romanarena_slots_log',
            meta: { title: 'Roman Arena', gid: 96 }
          },
          {
            path: 'supertongit_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'supertongit_slots_log',
            meta: { title: 'SuperTongit', gid: 98 }
          },
          {
            path: 'supergemiii_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'supergemiii_slots_log',
            meta: { title: 'SuperGemsIII', gid: 150 }
          },
          {
            path: 'aladdinlamp_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'aladdinlamp_slots_log',
            meta: { title: 'Aladdin\'s Lamp', gid: 152 }
          },
          {
            path: 'grandace_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'grandace_slots_log',
            meta: { title: 'GrandAce', gid: 154 }
          },
          {
            path: 'wrathofzeus_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'wrathofzeus_slots_log',
            meta: { title: 'WrathOfZeus', gid: 172 }
          },
          {
            path: 'crazyace_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'crazyace_slots_log',
            meta: { title: 'CrazyAce', gid: 156 }
          },
          {
            path: 'gigaace_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'gigaace_slots_log',
            meta: { title: 'GigaAce', gid: 160 }
          },
          {
            path: 'sharkkingdom_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'sharkkingdom_slots_log',
            meta: { title: 'SharkKingdom', gid: 158 }
          },
          {
            path: 'majorace_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'majorace_slots_log',
            meta: { title: 'MajorAce', gid: 162 }
          },
          {
            path: 'mahjongfortune_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'mahjongfortune_slots_log',
            meta: { title: 'MahjongFortune', gid: 164 }
          },
          {
            path: 'firelink_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'firelink_slots_log',
            meta: { title: 'FireLink', gid: 166 }
          },
          {
            path: 'epicace_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'epicace_slots_log',
            meta: { title: 'EpicAce', gid: 170 }
          },
          {
            path: ' pharaohtreasure_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'pharaohtreasure_slots_log',
            meta: { title: 'PharaohTreasure', gid: 168 }
          }
        ]
      },
      {
        path: 'slotsReviewLog',
        component: () => import('@/views/empty'),
        redirect: 'noRedirect',
        meta: { title: 'Slots-老虎机(审）', noCache: true },
        children: [
          {
            path: 'candypartyallline_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'candypartyallline_slots_log',
            meta: { title: 'Candy Rush(审)', gid: 77 }
          },
          {
            path: 'supergemmars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'supergemmars_slots_log',
            meta: { title: 'SuperGems(审)', gid: 81 }
          },
          {
            path: 'candycandymars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'candycandymars_slots_log',
            meta: { title: 'CandyCraze(审)', gid: 79 }
          },
          {
            path: 'millionairemars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'millionairemars_slots_log',
            meta: { title: 'Millionaire(审)', gid: 83 }
          },
          {
            path: 'superacemars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'superacemars_slots_log',
            meta: { title: 'FortuneAce(审)', gid: 85 }
          },
          {
            path: 'supergemiimars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'supergemiimars_slots_log',
            meta: { title: 'SuperGemsII(审)', gid: 87 }
          },
          {
            path: 'crazy777mars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'crazy777mars_slots_log',
            meta: { title: 'Lucky777(审)', gid: 89 }
          },
          {
            path: 'moneycomingmars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'moneycomingmars_slots_log',
            meta: { title: 'FortuneComing(审)', gid: 91 }
          },
          {
            path: 'fortuneacegomars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'fortuneacegomars_slots_log',
            meta: { title: 'UltraAce(审)', gid: 93 }
          },
          {
            path: 'chargebison_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'chargebison_slots_log',
            meta: { title: 'Wild Buffalo(审)', gid: 95 }
          },
          {
            path: 'romanarenamars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'romanarenamars_slots_log',
            meta: { title: 'roman arena(审)', gid: 97 }
          },
          {
            path: 'supertongitmars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'supertongitmars_slots_log',
            meta: { title: 'superTongit(审)', gid: 99 }
          },
          {
            path: 'supergemiiimars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'supergemiiimars_slots_log',
            meta: { title: 'SuperGemsIII(审)', gid: 151 }
          },
          {
            path: 'aladdinlampmars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'aladdinlampmars_slots_log',
            meta: { title: 'Aladdin\'s Lamp', gid: 153 }
          },
          {
            path: 'grandacemars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'grandacemars_slots_log',
            meta: { title: 'GrandAce(审)', gid: 155 }
          },
          {
            path: 'wrathofzeusmars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'wrathofzeusmars_slots_log',
            meta: { title: 'WrathOfZeus(审)', gid: 173 }
          },
          {
            path: 'crazyacemars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'crazyacemars_slots_log',
            meta: { title: 'CrazyAce(审)', gid: 157 }
          },
          {
            path: 'gigaacemars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'gigaacemars_slots_log',
            meta: { title: 'GigaAce(审)', gid: 161 }
          },
          {
            path: 'sharkkingdommars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'sharkkingdommars_slots_log',
            meta: { title: 'SharkKingdom(审)', gid: 159 }
          },
          {
            path: 'majoracemars_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'majoracemars_slots_log',
            meta: { title: 'MajorAce(审)', gid: 163 }
          },
          {
            path: 'mahjongfortune_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'mahjongfortune_slots_log',
            meta: { title: 'MahjongFortune(审)', gid: 165 }
          }
        ]
      },
      {
        path: 'playlog_lotterylog',
        component: () => import('@/views/playerManage/lotterylog'),
        name: 'playlog_lotterylog',
        meta: { title: '小游戏奖池日志 ◐' }
      },

      {
        path: 'tongitsCheat',
        component: () => import('@/views/empty'),
        redirect: 'noRedirect',
        meta: { title: 'Tongits-作弊识别 ◐' },
        children: [
          {
            path: 'tongits_cheat_group',
            component: () => import('@/views/playerManage/tongitsCheatGroup'),
            name: 'tongits_cheat_group',
            meta: { title: 'tongits作弊组合 ◐' }
          },
          {
            path: 'tongits_cheatlog',
            component: () => import('@/views/playerManage/tongitsCheatlog'),
            name: 'tongits_cheatlog',
            meta: { title: 'tongits作弊识别日志 ◐' }
          },
          {
            path: 'game_kick_user_log',
            component: () => import('@/views/playerManage/gameKickUserlog'),
            name: 'game_kick_user_log',
            meta: { title: '游戏作弊踢出用户日志 ◐' }
          },
          {
            path: 'tongits_blackuserlog',
            component: () => import('@/views/playerManage/tongitsBlackUserlog'),
            name: 'tongits_blackuserlog',
            meta: { title: '黑名单配桌日志 ◐' }
          },
          {
            path: 'tongits_cheat_related_scorelog',
            component: () => import('@/views/playerManage/tongitsCheat/tongitsCheatRelatedScorelog'),
            name: 'tongits_cheat_related_scorelog',
            meta: { title: '关联计分日志 ◐' }
          },
          {
            path: 'tongits_cheat_related_blacklog',
            component: () => import('@/views/playerManage/tongitsCheat/tongitsCheatRelatedBlacklog'),
            name: 'tongits_cheat_related_blacklog',
            meta: { title: '关联拉黑日志 ◐' }
          },
          {
            path: 'tongits_black_users',
            component: () => import('@/views/playerManage/tongitsCheat/tongitsBlackUsers'),
            name: 'tongits_black_users',
            meta: { title: 'Tongits黑名单 ◐' }
          },
          {
            path: 'tongits_updatemoneylog',
            component: () => import('@/views/playerManage/tongitsUpdateMoneylog'),
            name: 'tongits_blackuserlog',
            meta: { title: '机器人资产变更日志 ◐' }
          }
        ]
      },
      {
        path: 'microctrl_log',
        component: () => import('@/views/playerManage/microctrlLog'),
        name: 'microctrl_log',
        meta: { title: '扫雷点控日志 ◐' }
      }
    ]
  },
  {
    path: '/thirdparty',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '第三方管理', icon: 'user', perm: 'CFG_MANAGEMENT' },
    children: [
      {
        path: 'thirdparty',
        component: () => import('@/views/thirdparty/thirdparty'),
        name: 'thirdpartyManage',
        meta: { title: '第三方信息 ◐' }
      },
      // {
      //   path: 'transfer',
      //   component: () => import('@/views/thirdparty/transfer'),
      //   name: 'transfer_log',
      //   meta: { title: '转账流水 ◐' }
      // },
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
      },
      {
        path: 'enterurl',
        component: () => import('@/views/thirdparty/enterurl'),
        name: 'enterurl',
        meta: { title: '生成游戏链接 ◐' }
      },
      {
        path: 'point',
        component: () => import('@/views/thirdparty/point'),
        name: 'point',
        meta: { title: '积分链接、转账 ◐' }
      },
      {
        path: 'pointtransfer',
        component: () => import('@/views/thirdparty/pointTransfer.vue'),
        name: 'pointtransfer',
        meta: { title: '积分转账日志 ◐' }
      },
      {
        path: '/systemPointGameChart',
        component: () => import('@/views/playerManage/systemPointGameChart.vue'),
        name: 'systemPointGameChart',
        meta: { title: '积分系统健康监测 ◐' }
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
          // {
          //   path: 'onlineCnt',
          //   component: () => import('@/views/config/baseConfig/online_cnt'),
          //   name: 'onlineCnt',
          //   meta: { title: '在线人数配置', noCache: true }
          // },
          {
            path: 'gameOnlineCountCfg',
            component: () => import('@/views/config/tableConfig/gameOnlineCountCfg'),
            name: 'gameOnlineCountCfg',
            meta: { title: '游戏在线人数配置 ◐' }
          },
          {
            path: 'gameHealthCheckCfg',
            component: () => import('@/views/config/tableConfig/gameHealthCheckCfg'),
            name: 'gameHealthCheckCfg',
            meta: { title: '游戏健康度检查配置 ◐' }
          }
          // ,{
          //   path: 'smsWhite',
          //   component: () => import('@/views/config/baseConfig/sms_white'),
          //   name: 'smsWhite',
          //   meta: { title: '白名单发短信配置', noCache: true }
          // }
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
        meta: { title: '审核发布', noCache: true }
      },
      {
        path: 'gameAlarm',
        component: () => import('@/views/config/gameAlarmConfig.vue'),
        name: 'gameAlarm',
        meta: { title: '游戏人数告警配置', noCache: true }
      },
      {
        path: 'slotsScriptStatistics',
        component: () => import('@/views/config/slotsScriptStatisticsConfig'),
        name: 'slotsScriptStatistics',
        meta: { title: 'slots剧本统计配置', noCache: true }
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
      },
      {
        path: 'image-manage',
        component: () => import('@/views/config/image-manage'),
        name: 'ImageManage',
        meta: { title: '图片管理', noCache: true }
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
      // {
      //   path: 'genCode',
      //   component: () => import('@/views/devTools/devTools'),
      //   redirect: 'noRedirect',
      //   meta: { title: '代码生成', icon: 'code' },
      //   children: [
      //     {
      //       path: 'codeGenAdmin',
      //       component: () => import('@/views/devTools/codeGen'),
      //       name: 'CodeGenAdmin',
      //       meta: { title: '生成代码（Admin)' }
      //     },
      //     {
      //       path: 'codeGenRPCSQL',
      //       component: () => import('@/views/devTools/codeGen'),
      //       name: 'codeGenRPCSQL',
      //       meta: { title: '生成代码（RPC_SQL)' }
      //     }
      //   ]
      // },
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
        path: 'gamePkgVersion',
        component: () => import('@/views/devTools/devTools'),
        redirect: 'noRedirect',
        meta: { title: '游戏包版本配置', icon: 'el-icon-files' },
        children: [
          {
            path: 'game_pkg_versions_copy',
            component: () => import('@/views/config/tableConfig/gamePkgVersion/gamePkgVersionsCopy.vue'),
            name: 'game_pkg_versions_copy',
            meta: { title: '游戏包配置列表 ◐', noCache: true }
          },
          {
            path: 'game_pkg_versions',
            component: () => import('@/views/config/tableConfig/gamePkgVersion/gamePkgVersions.vue'),
            name: 'game_pkg_versions',
            meta: { title: '游戏包配置列表开发版 ◐', noCache: true }
          },
          {
            path: 'pkgversionsWhiteList',
            component: () => import('@/views/config/tableConfig/gamePkgVersion/pkgversionsWhiteList'),
            name: 'pkgversionsWhiteList',
            meta: { title: '游戏包白名单 ◐', noCache: true }
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
          // {
          //   path: 'fakeOrderSucc',
          //   component: () => import('@/views/devTools/fakeOrderSucc'),
          //   name: 'fakeOrderSucc',
          //   meta: { title: '测试订单成功' }
          // },
          // {
          //   path: 'testTools',
          //   component: () => import('@/views/devTools/test_tools'),
          //   name: 'testTools',
          //   meta: { title: '测试小工具' }
          // },
          // {
          //   path: 'testSign',
          //   component: () => import('@/views/devTools/testSign'),
          //   name: 'testSign',
          //   meta: { title: '签到小工具' }
          // },
          // {
          //   path: 'testMonthCard',
          //   component: () => import('@/views/devTools/testMonthCard'),
          //   name: 'testMonthCard',
          //   meta: { title: '月卡小工具' }
          // },
          {
            path: 'testWebThirdpartyTransfer',
            component: () => import('@/views/devTools/testWebThirdpartyTransfer'),
            name: 'TestWebThirdpartyTransfer',
            meta: { title: '转入转出小工具', perm: 'CFG_MANAGEMENT' }
          },
          {
            path: 'testClearGameScheam',
            component: () => import('@/views/devTools/testClearGameSchema'),
            name: 'TestClearGameScheam',
            meta: { title: '清理游戏健康数据', perm: 'CFG_MANAGEMENT' }
          }
        ]
      },
      {
        path: 'logDeal',
        component: () => import('@/views/devTools/logDeal'),
        name: 'logDeal',
        meta: { title: '错误日志处理' }
      },
      {
        path: 'gameTable',
        component: () => import('@/views/config/gameTable'),
        name: 'gameTable',
        meta: { title: '空闲游戏桌子' }
      },
      {
        path: 'gameCustomConfig',
        component: () => import('@/views/devTools/devTools'),
        redirect: 'noRedirect',
        meta: { title: '返回大厅按钮配置', icon: 'el-icon-files' },
        children: [
          {
            path: 'gameReturnConfig',
            component: () => import('@/views/config/gameCustomConfig/gameReturnConfig'),
            name: 'gameReturnConfig',
            meta: { title: '返回大厅按钮配置 ◐', noCache: true }
          },
          {
            path: 'gameReturnWhiteList',
            component: () => import('@/views/config/gameCustomConfig/gameReturnWhiteList'),
            name: 'gameReturnWhiteList',
            meta: { title: '返回大厅白名单 ◐', noCache: true }
          }
        ]
      },
      {
        path: 'gameLogoDisplayConfig',
        component: () => import('@/views/config/gameLogoDisplayConfig'),
        name: 'game_logo_display_config',
        meta: { title: '游戏场次Logo显示配置' }
      }
    ]
  },
  {
    path: '/wallet',
    component: Layout,
    alwaysShow: true,
    redirect: 'noRedirect',
    meta: { title: '单一钱包', icon: 'el-icon-copy-document', perm: 'PLAYLOG_MANAGEMENT' },
    children: [
      {
        path: 'failWallet',
        component: () => import('@/views/wallet/walletFailLog.vue'),
        name: 'failWallet',
        meta: { title: '钱包失败列表' }
      },
      {
        path: 'sucWallet',
        component: () => import('@/views/wallet/walletSucLog.vue'),
        name: 'sucWallet',
        meta: { title: '钱包金币流水' }
      },
      {
        path: 'walletInfo',
        component: () => import('@/views/wallet/walletInfo.vue'),
        name: 'walletInfo',
        meta: { title: '钱包信息' }
      },
      {
        path: 'walletApiStat',
        component: () => import('@/views/wallet/walletApiTimesStat.vue'),
        name: 'walletApiStat',
        meta: { title: '钱包API请求统计' }
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
        path: 'systemMoneyConfig',
        component: () => import('@/views/adminUser/systemMoneyConfig.vue'),
        name: 'systemMoneyConfig',
        meta: { title: '健康度权限管理' }
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

const outWatermark = (id) => {
  if (document.getElementById(id) !== null) {
    const div = document.getElementById(id)
    div.style.display = 'none'
  }
}

router.afterEach((to) => {
  if ((to.path === '/') || (to.path === '/login')) {
    Watermark.out() // 清除水印
  } else {
    // Watermark.set('未获取到用户名') // 设置水印title
  }
})
