// 这个文件用于存放一些常量数据，一般是下拉框数据，方便复用

// appid
export const APPID_OPTIONS = [
  { 'value': 1000002, 'label': 'dayusenlin' },
  { 'value': 1000003, 'label': 'testaccount' },
  { 'value': 1000004, 'label': 'testkey' },
  { 'value': 1000005, 'label': 'BingoPlusTongits' },
  { 'value': 1000006, 'label': 'BingoPlusTest' },
  { 'value': 1000007, 'label': 'br' },
  { 'value': 1000008, 'label': 'gli' },
  { 'value': 1100000, 'label': 'xworld' }
]

export const CHANNEL_OPTIONS = [
  { 'value': 'BP', 'label': 'BP' },
  { 'value': 'AP', 'label': 'AP' },
  { 'value': 'GP', 'label': 'GP' },
  //{ 'value': 'TP', 'label': 'TP' },
  { 'value': 'PG', 'label': 'PG' },
  { 'value': 'Dev', 'label': 'Dev' }
]
// 道具类型
export const ITEM_TYPE_OPTIONS = [
  { 'value': 1, 'label': 'Tongits门票', disabled: false },
  { 'value': 2, 'label': '头像框', disabled: false },
  { 'value': 3, 'label': '德州门票', disabled: false },
  { 'value': 4, 'label': '德州头像框', disabled: false },
  { 'value': 5, 'label': 'SlotFreeSpin', disabled: false },
  { 'value': 6, 'label': 'Pusoy门票', disabled: false },
  { 'value': 7, 'label': '新版Tongits门票', disabled: false },
  { 'value': 8, 'label': '新版德州参赛券', disabled: false },
  { 'value': 9, 'label': '新版Pusoy门票', disabled: false },
]

// 道具过期时间下拉框
export const ITEM_DAY_TYPE_OPTIONS = [
  { 'value': 1, 'label': '1天', disabled: false },
  { 'value': 2, 'label': '2天', disabled: false },
  { 'value': 3, 'label': '3天', disabled: false },
  { 'value': 4, 'label': '4天', disabled: false },
  { 'value': 5, 'label': '5天', disabled: false },
  { 'value': 7, 'label': '7天', disabled: false },
  { 'value': 30, 'label': '30天', disabled: false },
  { 'value': 365, 'label': '365天', disabled: false },
  { 'value': 0, 'label': '永久', disabled: false }
]

// 道具发放审批状态
// 1: '发起成功',
// 2: '发起失败',
// 3: '未审批',
// 4: '审批中',
// 5: '废弃',
// 6: '同意',
// 7: '拒绝',
// 8: '小额自动同意',
// 9: '自动取消',
// 10: '手动取消'
export const ITEM_STATUS_OPTIONS = [
  { 'value': 1, 'label': '发起成功', disabled: false },
  { 'value': 2, 'label': '发起失败', disabled: false },
  { 'value': 3, 'label': '未审批', disabled: false },
  { 'value': 4, 'label': '审批中', disabled: false },
  { 'value': 5, 'label': '废弃', disabled: false },
  { 'value': 6, 'label': '同意', disabled: false },
  { 'value': 7, 'label': '拒绝', disabled: false },
  { 'value': 8, 'label': '小额自动同意', disabled: false },
  { 'value': 9, 'label': '自动取消', disabled: false },
  { 'value': 10, 'label': '手动取消', disabled: false }
]

//头像框常量枚举定义
export const PROP_TYPE_OPTIONS = {
  PROP_TYPE_TICKET: 1,        //门票
  PROP_TYPE_AVATAR_FRAME: 2,    //头像框
  PROP_TYPE_TEXAS_TICKET: 3,    //德州参赛券
  PROP_TYPE_TEXAS_AVATAR: 4,    //德州头像框
  PROP_TYPE_SLOT_FREE_SPIN: 5,  //slot freespin
  PROP_TYPE_PUSOY_TICKET: 6,    //Pusoy参赛券
  PROP_TYPE_TICKET_NEW:7,      //新版Tongits门票 带交易ID
  PROP_TYPE_TEXAS_TICKET_NEW:8, //新版德州参赛券 带交易ID
  PROP_TYPE_PUSOY_TICKET_NEW:9, //新版Pusoy门票 带交易ID
}
// 操作类型
export const PROP_SOURCE_OPTIONS = [
  { value: 1, label: '后台发放' },
  { value: 2, label: '平台发放' },
  { value: 3, label: '空投' },
  { value: 4, label: 'tongits报名' },
  { value: 5, label: 'texas报名' },
  { value: 6, label: 'Tongits比赛发放' },
  { value: 7, label: 'texas比赛发放' },
  { value: 8, label: 'tongits报名取消' },
  { value: 9, label: 'texas报名取消' },
  { value: 10, label: '头像框激活' },
  { value: 11, label: '道具过期' },
  { value: 12, label: '红包活动' },
  { value: 13, label: 'rebuy' },
  { value: 14, label: 'rebuy回退' },
  { value: 16, label: 'free spin' }
]

//奖励分类
export const REWARD_CURRENCY_OPTIONS = [
  { 'value': 1, 'label': '金币' },
  { 'value': 2, 'label': '投注金' },
  { 'value': 3, 'label': '返水金' }
]


// 返水金
export const REBATE_SCENES_CFG_OPTIONS = [
  { 'value': 5, 'label': '没有任何限制的返水金' },
  { 'value': 6, 'label': '有限制倍数的返水金（10倍）' }
]

//投注金
export const  BET_SCENES_CFG_OPTIONS = [
  { 'value': 1, 'label': '任意游戏投注' },
  { 'value': 2, 'label': '仅限Poker类游戏投注' },
  { 'value': 3, 'label': '仅限Slots类游戏投注' },
  { 'value': 4, 'label': '仅限Tongits游戏投注' },

]

// 比赛Tongits全局ID集合
export const MATCH_UNIQUE_ID_CFG =[
  { 'value': 0, 'label': '无' },
  { 'value': 10001, 'label': '188Free' },
  { 'value': 10002, 'label': '12888Free' },
  { 'value': 10003, 'label': 'P10' },
  { 'value': 10004, 'label': 'P20' },
  { 'value': 10005, 'label': 'P40' },
  { 'value': 10006, 'label': 'P100' },
  { 'value': 10007, 'label': 'P300' },
  { 'value': 10008, 'label': 'GTCC 2005' },

  //以下全局ID为GTCC线上赛临时用 不长期占用
  { 'value': 11001, 'label': 'GTCC日赛' },
  { 'value': 11002, 'label': 'GTCC周赛' },
  { 'value': 11003, 'label': 'GTCC月赛' },
  { 'value': 11004, 'label': 'GTCC线上半决赛' },
  { 'value': 11005, 'label': 'GTCC线上决赛' },
  { 'value': 11006, 'label': 'GTCC机酒赛' },
  { 'value': 11007, 'label': 'GTCC魔戒赛' },
  { 'value': 11008, 'label': 'GTCC豪客赛' },
]

// 比赛Pusoy全局ID集合
export const MATCH_PUSOY_UNIQUE_ID_CFG =[
  { 'value': 0, 'label': '无' },
  { 'value': 20001, 'label': '188Free' },
  { 'value': 20002, 'label': '12888Free' },
  { 'value': 20003, 'label': 'P10' },
  { 'value': 20004, 'label': 'P20' },
  { 'value': 20005, 'label': 'P40' },
  { 'value': 20006, 'label': 'P100' },
  { 'value': 20007, 'label': 'P300' },
  { 'value': 20008, 'label': 'GTCC 2005' },
  { 'value': 20009, 'label': 'P60' },
  { 'value': 20010, 'label': 'P150' },
  { 'value': 20011, 'label': 'P400' },
]

//牌桌TableId
export const MATCH_TABLE_SCENE_ID_CFG =[
  { 'value': 0, 'label': '免费赛桌面' },
  { 'value': 1, 'label': '付费赛桌面' },
  { 'value': 2, 'label': 'GTCC预选赛1' },
  { 'value': 3, 'label': 'GTCC预选赛2' },
  { 'value': 4, 'label': 'GTCC预选赛3' },
  { 'value': 5, 'label': 'Table5' },
]
  //Pusoy 牌桌TableId
export const MATCH_PUSOY_TABLE_SCENE_ID_CFG =[
  { 'value': 100, 'label': '免费赛桌面' },
  { 'value': 101, 'label': '付费赛桌面' },
]

//比赛页签选项
export const MATCH_LIST_TAG_OPTIONS = [
  { 'value': 0, 'label': 'All', disabled: false },
  { 'value': 1, 'label': 'Events', disabled: false },
  { 'value': 2, 'label': 'FREE', disabled: false },
  { 'value': 3, 'label': 'Pro Arena', disabled: false },
  { 'value': 4, 'label': 'GTCC', disabled: false },
]

//比赛GameId选项
export const MATCH_GAME_ID_CFG_OPTIONS = [
  { 'value': 2031, 'label': 'Tongits', disabled: false },
  { 'value': 2032, 'label': 'TexasMtt', disabled: false },
  { 'value': 2033, 'label': 'Pusoy', disabled: false },
]

//比赛GameID 宏定义
export const MATCH_IUPSTREAM_TYPE_OPTIONS = {
  MATCH_UPSTREAM_TYPE_TONGITS: 2031,        //tongits
  UPSTREAM_TYPE_TEXAS_MTT:2032,             //德州MTT
  MATCH_UPSTREAM_TYPE_PUSOY: 2033,          //pusoy
}

