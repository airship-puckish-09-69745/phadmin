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
        path: 'CarRoulette',
        component: () => import('@/views/config/tableConfig/CarRouletteTable'),
        name: 'CarRoulette',
        meta: { title: 'Car - 车标转盘 ◐' }
      },
      {
        path: 'gameCrash',
        component: () => import('@/views/config/tableConfig/gameCrash'),
        name: 'gameCrash',
        meta: { title: 'Crash - 小火箭 ◐' }
      },
      {
        path: 'tongitsTable',
        component: () => import('@/views/config/tableConfig/tongitsTable'),
        name: 'tongitsTable',
        meta: { title: 'Tongits ◐' }
      },
      {
        path: 'lucky9Table',
        component: () => import('@/views/config/tableConfig/lucky9Table'),
        name: 'lucky9Table',
        meta: { title: 'Lucky9 ◐' }
      },
      {
        path: 'pusoyTable',
        component: () => import('@/views/config/tableConfig/pusoyTable'),
        name: 'pusoyTable',
        meta: { title: 'Pusoy ◐' }
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
            path: 'phoenix_slots_cfg',
            component: () => import('@/views/config/tableConfig/slots/phoenix_slots_cfg'),
            name: 'phoenix_slots_cfg',
            meta: { title: 'Phoenix - 凤凰' }
          },

          {
            path: 'slots_winner_record',
            component: () => import('@/views/config/tableConfig/slots/slots_winner_record'),
            name: 'slots_winner_record',
            meta: { title: '大奖记录' }
          }

        ]
      },

      {
        path: 'sweeper',
        component: () => import('@/views/config/tableConfig/sweeperCfg'),
        name: 'sweeperCfg',
        meta: { title: 'Sweeper - 扫雷 ◐' }
      },
      {
        path: 'color_game',
        component: () => import('@/views/config/tableConfig/colorGame'),
        name: 'gameColorCfg',
        meta: { title: 'color game ◐' }
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
        path: 'mainWinControl',
        component: () => import('@/views/config/winConfig/mainWinControl'),
        name: 'mainWinControl',
        meta: { title: '总体控制 ◐', noCache: true }
      },
      {
        path: 'luckyValue_teenPatti',
        component: () => import('@/views/config/winConfig/luckyValue'),
        name: 'luckyValue_teenPatti',
        meta: { title: '幸运值(TeenPatti) ◐', noCache: true }
      },
      {
        path: 'luckyValue_rummy',
        component: () => import('@/views/config/winConfig/luckyValue'),
        name: 'luckyValue_rummy',
        meta: { title: '幸运值(Rummy) ◐', noCache: true, project: ['id'] }
      },
      {
        path: 'luckyValue_buraco',
        component: () => import('@/views/config/winConfig/luckyValue'),
        name: 'luckyValue_buraco',
        meta: { title: '幸运值(Buraco) ◐', noCache: true, project: ['br'] }
      },
      {
        path: 'luckyValue_ak',
        component: () => import('@/views/config/winConfig/luckyValue'),
        name: 'luckyValue_ak',
        meta: { title: '幸运值(AK47) ◐', noCache: true }
      },
      {
        path: 'luckyValue_texas',
        component: () => import('@/views/config/winConfig/luckyValue'),
        name: 'luckyValue_texas',
        meta: { title: '幸运值(Texas) ◐', noCache: true }
      },
      {
        path: 'baseValueAfterPay',
        component: () => import('@/views/config/winConfig/baseValueAfterPay'),
        name: 'baseValueAfterPay',
        meta: { title: '充值加基础值 ◐', noCache: true }
      },
      {
        path: 'freeControl',
        component: () => import('@/views/config/winConfig/freeControl'),
        name: 'freeControl',
        meta: { title: '免费用户控制 ◐', noCache: true, subKey: 'free_control' }
      },
      {
        path: 'freeControlByApp',
        component: () => import('@/views/config/winConfig/freeControl'),
        name: 'freeControlByApp',
        meta: { title: '[差异化]免费用户控制 ◐', noCache: true, subKey: 'free_ctrl_by_app' }
      },

      {
        path: 'playWinLimit',
        component: () => import('@/views/config/winConfig/playWinLimit'),
        name: 'playWinLimit',
        meta: { title: '单局赢上限 ◐', noCache: true }
      },
      {
        path: 'robotConfig',
        component: () => import('@/views/empty'),
        redirect: 'noRedirect',
        meta: { title: '机器人控制', noCache: true },
        children: [
          {
            path: 'robotConfig',
            component: () => import('@/views/config/winConfig/robotConfig'),
            name: 'robotConfig',
            meta: { title: '默认 ◐', noCache: true, subKey: 'win_limit' }
          },
          {
            path: 'robotConfig_1',
            component: () => import('@/views/config/winConfig/robotConfig'),
            name: 'robotConfig',
            meta: { title: '分组1 ◐', noCache: true, subKey: 'win_limit_1' }
          }
        ] },
      {
        path: 'produceRates',
        component: () => import('@/views/config/winConfig/produceRates'),
        name: 'produceRates',
        meta: { title: '基准值消耗比例 ◐', noCache: true }
      },
      {
        path: 'baseValueReduceRates',
        component: () => import('@/views/config/winConfig/baseValueReduceRates'),
        name: 'baseValueReduceRates',
        meta: { title: '差异化-基准值消耗比例 ◐', noCache: true }
      },
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
    path: '/orderManage',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '付费相关', icon: 'money2', perm: 'ORDER_MANAGE' },
    children: [
      {
        path: 'withdraw',
        component: () => import('@/views/pay/withdraw'),
        name: 'withdraw',
        meta: { title: '提现审核', perm: 'WITHDRAW' }
      },
      {
        path: 'inviteWithdraw',
        component: () => import('@/views/pay/inviteWithdraw'),
        name: 'inviteWithdraw',
        meta: { title: '邀请提现', perm: 'WITHDRAW' }
      },
      {
        path: 'order',
        component: () => import('@/views/pay/order'),
        name: 'order',
        meta: { title: '充值订单', perm: 'ORDER_MANAGE' }
      },
      {
        path: 'payBaseLog',
        component: () => import('@/views/pay/payBaseLog'),
        name: 'payBaseLog',
        meta: { title: '付费基础值日志 ◐', perm: 'PAY_STATS' }
      },
      {
        path: 'payUserRank',
        component: () => import('@/views/pay/payUserRank'),
        name: 'payUserRank',
        meta: { title: '付费用户排行 ◐', perm: 'PAY_STATS' }
      },
      {
        path: 'payStat',
        component: () => import('@/views/pay/payStat'),
        name: 'payStat',
        meta: { title: '收入统计 ◐', perm: 'PAY_STATS' }
      },
      {
        path: 'payStatNow',
        component: () => import('@/views/pay/payStatNow'),
        name: 'payStatNow',
        meta: { title: '收入余额（实时）◐', perm: 'PAY_STATS', noCache: true }
      },
      {
        path: 'withdrawBanUsers',
        component: () => import('@/views/playerManage/withdrawBanUsers'),
        name: 'withdrawBanUsers',
        meta: { title: '提现黑名单◐', perm: 'WITHDRAW', noCache: true }
      },
      {
        path: 'inviteWithdrawBlacklist',
        component: () => import('@/views/pay/invite_withdraw_blacklist'),
        name: 'inviteWithdrawBlacklist',
        meta: { title: '邀请提现黑名单◐', perm: 'WITHDRAW', noCache: true }
      },
      {
        path: 'payChanBan',
        component: () => import('@/views/empty'),
        redirect: 'noRedirect',
        meta: { title: '支付平台黑名单', icon: 'list', noCache: true },
        children: [
          {
            path: 'payBanUsers',
            component: () => import('@/views/pay/ban/payBanUsers'),
            name: 'payBanUsers',
            meta: { title: '黑名单用户 ◐', noCache: true, perm: 'CUTOMER' }
          },
          {
            path: 'blacklistRegion',
            component: () => import('@/views/pay/ban/blacklist_region'),
            name: 'payBanUsers',
            meta: { title: '黑名单地区 ◐', noCache: true, perm: 'SWITCH_PAY_METHOD' }
          },
          {
            path: 'payChanBanToggleSwitch',
            component: () => import('@/views/pay/ban/pay_chan_ban_toggle_switch'),
            name: 'payChanBanToggleSwitch',
            meta: { title: '切换渠道开关', noCache: true, perm: 'SWITCH_PAY_METHOD' }
          },
          {
            path: 'payWhitelistUser',
            component: () => import('@/views/pay/ban/pay_whitelist'),
            name: 'payWhitelistUser',
            meta: { title: '白名单用户', noCache: true, perm: 'SWITCH_PAY_METHOD' }
          }
        ]
      },
      {
        path: 'payConfig',
        component: () => import('@/views/empty'),
        redirect: 'noRedirect',
        meta: { title: '配置', icon: 'list', noCache: true },
        children: [
          {
            path: 'payToggleAndroid',
            component: () => import('@/views/pay/pay_toggle'),
            name: 'payToggleAndroid',
            meta: { title: '支付切换(Android)', noCache: true, perm: 'SWITCH_PAY_METHOD', platform: 'android' }
          },
          {
            path: 'payToggleAndroidBan',
            component: () => import('@/views/pay/pay_toggle_ban'),
            name: 'payToggleAndroidBan',
            meta: { title: '支付切换(Android-Ban)', noCache: true, perm: 'SWITCH_PAY_METHOD', platform: 'android' }
          },
          {
            path: 'payCfgAndroid',
            component: () => import('@/views/pay/pay_cfg'),
            name: 'payCfgAndroid',
            meta: { title: '支付渠道(Android)', noCache: true, perm: 'SWITCH_PAY_METHOD', platform: 'android' }
          },
          {
            path: 'payToggleGalaxy',
            component: () => import('@/views/pay/pay_toggle'),
            name: 'payToggleGalaxy',
            meta: { title: '支付切换(Galaxy)', noCache: true, perm: 'SWITCH_PAY_METHOD', platform: 'galaxy' }
          },
          {
            path: 'payToggleGalaxyBan',
            component: () => import('@/views/pay/pay_toggle_ban'),
            name: 'payToggleGalaxyBan',
            meta: { title: '支付切换(Galaxy-Ban)', noCache: true, perm: 'SWITCH_PAY_METHOD', platform: 'galaxy' }
          },
          {
            path: 'payCfgGalaxy',
            component: () => import('@/views/pay/pay_cfg'),
            name: 'payCfgGalaxy',
            meta: { title: '支付渠道(Galaxy)', noCache: true, perm: 'SWITCH_PAY_METHOD', platform: 'galaxy' }
          },
          {
            path: 'galaxyIpBlacklist',
            component: () => import('@/views/pay/galaxy_ip_blacklist'),
            name: 'galaxyIpBlacklist',
            meta: { title: 'ip支付黑名单(Galaxy)', noCache: true, perm: 'SWITCH_PAY_METHOD' }
          },
          {
            path: 'payAlarm',
            component: () => import('@/views/pay/payAlarm'),
            name: 'payAlarm',
            meta: { title: '支付告警配置', noCache: true, perm: 'SWITCH_PAY_METHOD' }
          },
          {
            path: 'withdrawCfg',
            component: () => import('@/views/config/baseConfig/withdraw'),
            name: 'withdrawCfg',
            meta: { title: '提现配置', noCache: true, perm: 'WITHDRAW' }
          },
          {
            path: 'withdrawLimitGroup',
            component: () => import('@/views/empty'),
            redirect: 'noRedirect',
            meta: { title: '提现额度配置', icon: 'list', noCache: true },
            children: [
              {
                path: 'withdrawLimitCfg',
                component: () => import('@/views/pay/withdraw_limit'),
                name: 'withdrawLimitCfg',
                meta: { title: '默认', noCache: true, perm: 'WITHDRAW' }
              },
              {
                path: 'withdrawLimitAppCfg',
                component: () => import('@/views/pay/withdraw_limit_app'),
                name: 'withdrawLimitAppCfg',
                meta: { title: '分组1', noCache: true, perm: 'WITHDRAW' }
              }
            ]
          },
          {
            path: 'withdrawObserveCfg',
            component: () => import('@/views/pay/withdraw_observe'),
            name: 'withdrawObserveCfg',
            meta: { title: '提现观察配置', noCache: true, perm: 'WITHDRAW' }
          },
          {
            path: 'sms',
            component: () => import('@/views/pay/sms'),
            name: 'sms',
            meta: { title: '短信配置', noCache: true, perm: 'SWITCH_PAY_METHOD' }
          },
          {
            path: 'binanceConfig',
            component: () => import('@/views/pay/binance'),
            name: 'sms',
            meta: { title: '币安支付配置', noCache: true, perm: 'SWITCH_PAY_METHOD' }
          }
        ]
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
        path: 'moneyPayAndWithdrawlog',
        component: () => import('@/views/playerManage/moneyPayAndWithdrawlog'),
        name: 'moneyPayAndWithdrawlog',
        meta: { title: '充值提现流水 ◐' }
      },
      {
        path: 'inviteCommissionLog',
        component: () => import('@/views/playerManage/inviteCommissionLog'),
        name: 'inviteCommissionLog',
        meta: { title: '邀请佣金流水 ◐' }
      },
      {
        path: 'vupLog',
        component: () => import('@/views/playerManage/vupLog'),
        name: 'vupLog',
        meta: { title: '小黑屋日志 ◐' }
      },
      {
        path: 'inviteInfo',
        component: () => import('@/views/playerManage/inviteInfo'),
        name: 'inviteInfo',
        meta: { title: '邀请信息 ◐' }
      },
      {
        path: 'queryCode',
        component: () => import('@/views/playerManage/queryCode'),
        name: 'queryCode',
        meta: { title: '查询验证码' }
      },
      {
        path: 'mail',
        component: () => import('@/views/playerManage/mail'),
        name: 'mail',
        meta: { title: '邮件通知 ◐', noCache: true, perm: 'CUTOMER' }
      },
      {
        path: 'mailTemplate',
        component: () => import('@/views/playerManage/mailTemplate'),
        name: 'mailTemplate',
        meta: { title: '邮件模板 ◐', noCache: true, perm: 'CUTOMER' }
      },
      {
        path: 'ban',
        component: () => import('@/views/playerManage/ban'),
        name: 'ban',
        meta: { title: '批量封号 ◐', noCache: true, perm: 'CUTOMER' }
      },
      {
        path: 'banUsers',
        component: () => import('@/views/playerManage/banUsers'),
        name: 'banUsers',
        meta: { title: '封号用户列表 ◐', noCache: true, perm: 'CUTOMER' }
      },
      {
        path: 'vupMonitor',
        component: () => import('@/views/playerManage/vupMonitor'),
        name: 'ban',
        meta: { title: '小黑屋活跃健康 ◐', noCache: true, perm: 'CUTOMER' }
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
        component: () => import('@/views/playerManage/playlog'),
        name: 'playlog_tongits',
        meta: { title: 'Tongits - ◐', gid: 22 }
      },
      {
        path: 'playlog_colorgame',
        component: () => import('@/views/playerManage/playlog'),
        name: 'playlog_colorgame',
        meta: { title: 'ColorGame - ◐', gid: 25 }
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
            path: 'phoenix_slots_log',
            component: () => import('@/views/playerManage/slotsLog'),
            name: 'phoenix_slots_log',
            meta: { title: 'phoenix - 凤凰', gid: 51 }
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
          },
          {
            path: 'aihelp',
            component: () => import('@/views/config/baseConfig/aiHelp'),
            name: 'goods',
            meta: { title: 'AI_Helper', noCache: true }
          },
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
          },
          {
            path: 'activity',
            redirect: '/activity/list',
            name: 'Activity',
            component: () => import('@/views/config/baseConfig/activity/router_view'), // Parent router-view
            meta: { title: '活动配置', noCache: true, perm: 'ACTIVITY' },
            children: [
              {
                path: 'list',
                component: () => import('@/views/config/baseConfig/activity/index'),
                name: 'ActivityList',
                meta: { title: '活动配置', noCache: true }
              },
              {
                path: 'create',
                component: () => import('@/views/config/baseConfig/activity/create'),
                name: 'ActivityCreate',
                hidden: true,
                meta: { title: '创建活动', noCache: true }
              },
              {
                path: 'edit/:id(\\d+)',
                component: () => import('@/views/config/baseConfig/activity/edit'),
                name: 'ActivityEdit',
                hidden: true,
                meta: { title: '编辑活动', noCache: true }
              }
            ]
          }
        ]
      },
      {
        path: 'giveMoneyConfig',
        component: () => import('@/views/config/giveMoneyConfig/giveMoneyConfig'),
        redirect: 'noRedirect',
        meta: { title: '发放配置', icon: 'money', noCache: true },
        children: [
          {
            path: 'sign',
            component: () => import('@/views/config/giveMoneyConfig/sign'),
            name: 'SingReward',
            meta: { title: '签到奖励 ◐', noCache: true }
          },
          {
            path: 'registerReward',
            component: () => import('@/views/config/giveMoneyConfig/registerReward'),
            name: 'registerReward',
            meta: { title: '注册奖励 ◐', noCache: true }
          },
          {
            path: 'shareReward',
            component: () => import('@/views/config/giveMoneyConfig/shareReward'),
            name: 'shareReward',
            meta: { title: '分享邀请配置 ◐', noCache: true }
          },
          {
            path: 'gullak',
            component: () => import('@/views/config/giveMoneyConfig/gullak'),
            name: 'gullak',
            meta: { title: '存钱罐 ◐', noCache: true }
          },
          {
            path: 'AmazingBonus',
            component: () => import('@/views/config/giveMoneyConfig/AmazingBonus'),
            name: 'AmazingBonus',
            meta: { title: 'AmazingBonus ◐', noCache: true }
          },
          {
            path: 'Bankrupt',
            component: () => import('@/views/config/giveMoneyConfig/bankrupt'),
            name: 'Bankrupt',
            meta: { title: '破产补助 ◐', noCache: true }
          },
          {
            path: 'bindPhoneReward',
            component: () => import('@/views/config/giveMoneyConfig/bindPhoneReward'),
            name: 'bindPhoneReward',
            meta: { title: '绑定手机奖励 ◐', noCache: true }
          },
          {
            path: 'PLINKO',
            component: () => import('@/views/config/giveMoneyConfig/plinko'),
            name: 'PLINKO',
            meta: { title: 'PLINKO ◐', noCache: true, project: ['id'] }
          },
          {
            path: 'newbieGift',
            component: () => import('@/views/config/giveMoneyConfig/newbieGift'),
            name: 'newbieGift',
            meta: { title: '新手礼物 ◐', noCache: true }
          }
        ]
      },
      {
        path: 'invite',
        component: () => import('@/views/config/invite/menu'),
        redirect: 'noRedirect',
        meta: { title: '邀请配置', icon: 'example', noCache: true },
        children: [
          {
            path: 'config',
            component: () => import('@/views/config/invite/invite'),
            name: 'config',
            meta: { title: '邀请配置', noCache: true }
          },
          {
            path: 'level',
            component: () => import('@/views/config/invite/invite_level'),
            name: 'level',
            meta: { title: '等级配置', noCache: true }
          },
          {
            path: 'share',
            component: () => import('@/views/config/invite/invite_share'),
            name: 'share',
            meta: { title: '分享任务', noCache: true }
          },
          {
            path: 'rank',
            component: () => import('@/views/config/invite/invite_rank'),
            name: 'rank',
            meta: { title: '排行榜奖励', noCache: true }
          },
          {
            path: 'inviteWithdrawAudit',
            component: () => import('@/views/config/invite/invite_withdraw'),
            name: 'inviteWithdrawAudit',
            meta: { title: '提现自动审核', noCache: true }
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
    path: '/safe',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '安全管理', icon: 'safe' },
    children: [
      {
        path: 'checklist',
        component: () => import('@/views/playerManage/safe/checklist'),
        name: 'checklist',
        meta: { title: '安全检测日志 ◐' }
      },
      {
        path: 'safeInfo',
        component: () => import('@/views/playerManage/safeInfo'),
        name: 'safeInfo',
        meta: { title: '账号关联查询 ◐' }
      },
      {
        path: 'blackInfo',
        component: () => import('@/views/playerManage/blackInfo'),
        name: 'blackInfo',
        meta: { title: '是否黑名单 ◐' }
      },
      {
        path: 'blacklist',
        component: () => import('@/views/playerManage/blacklist'),
        name: 'blacklist',
        meta: { title: '黑名单列表 ◐' }
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
