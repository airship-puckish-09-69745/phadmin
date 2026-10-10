import Cookies from 'js-cookie'
import { Message } from 'element-ui'

const common = {}

// 填充模板
common.fillTpl = function() {
  var getTplName = function(str) {
    var len = str.length
    return str.substring(2, len - 2)
  }
  this.ReplaceTemplate = function(tpl, obj) {
    var vals = tpl.match(/##[^#]*##/g)
    for (var x in vals) {
      tpl = tpl.replace(vals[x], obj[getTplName(vals[x])])
    }
    return tpl
  }
}

/** ************url相关* **********************/
// 获取url参数
function LibURL() {
  this.GetUrlParam = function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg) // 匹配目标参数
    if (r !== null) return unescape(r[2])
    return null
  }
  this.GetUrlParamInt = function(name) {
    var ob = this.GetUrlParam(name)
    return ob ? parseInt(ob) : ob
  }
  this.GetUrlParamFloat = function(name) {
    var ob = this.GetUrlParam(name)
    return ob ? parseFloat(ob) : ob
  }
  // 传入一个对象，将对象转化成 a=1&b=2 如此格式
  this.GenUrlParams = function(ob) {
    var param = ''
    var bFirst = true
    for (var name in ob) {
      if (bFirst) {
        param += name + '=' + ob[name]
        bFirst = false
      } else {
        param += '&' + name + '=' + ob[name]
      }
    }
    return param
  }
}

function PublicData() {
  this.LangTypes = ['en', 'hi']
  this.LangNames = ['英文', '印地语']
}

export const $data = new PublicData()

// 多语言控件
export function NewLangObj() {
  const obj = {}
  for (let i = 0; i < $data.LangTypes.length; i++) {
    const name = $data.LangTypes[i]
    obj[name] = ''
  }
  return obj
}

function Lang() {
  this.GetLangEN = function(value) {
    return this.GetLangOBJ(value).en
  }
  this.GetLangOBJ = function(value) {
    const res = NewLangObj()
    try {
      const item = JSON.parse(value)
      Object.assign(res, item)
    } catch (e) {
      console.log('Parse Lang err,' + e)
    }
    return res
  }
}

export const $libLang = new Lang()

export function LibShow() {
  this.DataStatuses = {
    2: '上架', 6: '下架', 7: '预上架', 8: '预下架'
  }
  this.ColorMap = {
    1: '♦',
    2: '♣',
    3: '♥',
    4: '♠'
  }
  this.GameNames = { 2: 'AB', 3: '龙虎', 4: 'JM', 5: 'Car', 6: '7UpD', 7: '红黑', 8: 'AK47', 9: 'TPatti', 10: 'Crash', 13: 'TP War', 14: 'TP真', 15: '德州',
    500: 'GoldMaster',
    501: 'BalloonTap',
    214: 'PumpkinCash',
    202: 'FortunateEbisu', // 独占一行
    144: 'Mines Multiplayer', // 独占一行
    206: 'LuckyWineglass', // 独占一行
    212: 'PirateShip', // 独占一行
    218: 'WrathOfZeus2', // 独占一行
    228: 'JokerAce', // 独占一行
    188: 'StreetFighting', // 独占一行
    192: 'BountyRaid', // 独占一行
    180: 'FishingMaster', // 独占一行
    16: 'Baccarat', 17: 'wingo', 18: '球队标转盘', 19: '动物转盘', 20: '扫雷', 22: 'Tongits', 23: 'Lucky 9', 25: 'Color Game', 31: 'Tongits经典',
    34: 'Pusoy-Dos', 37: 'BlackJack', 46: '多米诺',
    51: '凤凰', 52: '睡美人', 53: '小丑', 	54: ' 黄金列车', 55: '澳洲', 56: '象鼻神', 57: '黄金矿工', 58: '阿拉丁',
    59: '芝加哥', 60: '糖果派', 61: 'fireKick',
    76: 'Candy Rush', 78: 'SuperGems', 80: 'Candy Craze', 82: 'Millionaire', 84: 'FortuneAce', 86: 'SuperGemsII', 88: 'Lucky777', 90: 'FortuneComing', 92: 'UltraAce', 94: 'Wild Buffalo', 96: 'RomanArena', 98: 'SuperTongit', // slots
    100: 'Tower', 101: 'Sicbo', 102: 'Hilo', 103: 'Windrop', 119: 'Windropc积分', 104: 'Dragon Tiger', 105: 'Andar Bahar', 106: 'PIGGY TAP', 107: 'Mini Baccarat', 108: 'Dropball', 110: 'Video Poker',
    112: 'Wingo Lottery', 115: 'MultiPlayer NiuNiu', 118: 'Car Racing', 124: 'Jackpot Wheel', 125: 'Free Spin', 127: 'SaBong', 128: 'Tongits JP', 129: 'Live Color', 132: '新版扫雷', 134: 'Pusoy JP', 135: 'SUPER COLOR', 136: 'Limbo', 137: 'BlackJackMH',
    138: 'Chicken Go', 139: 'manny Punch', 140: 'HiloPlus', 141: 'Pirate Scratch', 142: 'Pirate Tap', 143: 'Triple Wheels Spin', 146: 'Poker Cascade', 147: 'Goal In Between',
    150: 'SuperGemsIII', 152: 'Aladdin\'s Lamp', 154: 'GrandAce', 156: 'CrazyAce', 172: 'WrathOfZeus', 158: 'SharkKingdom', 160: 'GigaAce', 162: 'MajorAce', 164: 'MahjongFortune', 166: 'FireLink',
    170: 'EpicAce', 176: 'PuppyHome', 182: 'GodOfFortune', 186: 'MahjongJackpot', 174: 'TreasureBowl', 178: 'MayanTotem', 194: 'GoldTrain', 168: 'Pharaoh\'sTreasure', 196: 'GoldMiner', 184: 'Dance of the Lion',
    190: 'ArcaneEgypt', 198: 'FortuneBlessing', 200: 'AtlantisTreasure', 204: 'SpaceTreasure', 208: 'CandyBurst', 210: 'LuckySpirits', 216: 'Phoenix', 220: 'GoldenDragon', 222: 'LionFortune', 226: 'Fortune Wheel', 232: 'MafiaWars', // slots
    230: 'PahiyasWins', 236: 'PacquiaoFortune', 234: 'Fortune Tree', 238: 'MasskaraFortune', 240: 'BathalaAgeOfCreation', 242: 'Museo Yaman', 244: 'WildBone', 246: 'TalaReyesSouthSeaPearls', 248: 'MayanTemple', 250: 'LightOfMactan',
    1139: 'Manny Punch 试玩', 1236: 'PacquiaoFortune试玩', 1237: 'Pahiyas Win\'s试玩', 145: 'Tongits1V1', 252: 'LuckyBang', 274: 'SarimanokFortune', 275: 'Anubis\'s Verdict'
  }
  // 是否显示冻结池
  this.IsShowFreeFreezePool = function(gameId) {
    return [
      20, // 扫雷
      100, // Tower
      102, // Hilo
      132, // 新版扫雷
      138, // Chicken Go
      139, // Manny Punch
      140, // HiloPlus
      143 // Triple Wheels Spin
    ].indexOf(gameId) !== -1
  }

  this.NumMap = {
    1: 'A',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: 'J',
    12: 'Q',
    13: 'K',
    14: '小王',
    15: '大王'
  }

  this.AllCards = [
    0x5e, 0x5f, // 小王、大王
    0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d, // 黑桃
    0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x3b, 0x3c, 0x3d, // 红桃
    0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d, // 梅花
    0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d // 方块
  ]
  this.CardShow = function(card) {
    if (card === 94) {
      return '<span style="color:black">小王</span>'
    } else if (card === 95) {
      return '<span style="color:red">大王</span>'
    } else {
      const color = card >> 4
      const num = card & 0x0F
      return '<span style="color:' + ((color === 1 || color === 3) ? 'red' : 'black') + '">' + this.ColorMap[color] + this.NumMap[num] + '</span>'
    }
  }
  let staticPath = ''
  this.GetFullPath = function(url) {
    if (staticPath === '') {
      staticPath = Cookies.get('staticPath')
    }
    // 兼容一下第三方图片
    let needCdnDomain = true
    if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
      needCdnDomain = false
    }
    if (needCdnDomain) {
      return staticPath + url
    } else {
      return url
    }
  }
  // 日期控件选择日期默认选项
  this.DefaultDatePickerOptions = function() {
    return {
      shortcuts: [{
        text: '今天',
        onClick(picker) {
          var start = new Date()
          var end = new Date()
          start.setTime($libDate.GetDayBegin(start))
          end.setTime($libDate.GetDayEnd(end))
          picker.$emit('pick', [start, end])
        }
      }, {
        text: '昨天',
        onClick(picker) {
          var end = new Date()
          var start = new Date()
          start.setTime($libDate.GetDayBegin(start.getTime()) - 3600 * 1000 * 24)
          end.setTime($libDate.GetDayEnd(end.getTime()) - 3600 * 1000 * 24)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: '最近7天',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: '最近一个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      }]
    }
  }

  // 表格头默认属性
  this.DefaultTableHeadClass = function() {
    return 'text-align: center;background:#f5fafe;'
  }

  // 表格字体默认属性
  this.DefaultTableCell = function() {
    return 'padding:5px;font-family: "Microsoft Yahei"; font-size: 12px;'
  }
  // 表格字体属性
  this.TableCell = function(padding) {
    return {
      'padding': padding ? padding + 'px' : '0px',
      'font-family': 'Microsoft Yahei',
      'font-size': '12px'
    }
  }
}

export const $libDate = new LibDate()
export const $libUrl = new LibURL()
export const $libShow = new LibShow()

Date.prototype.Format = function(fmt) { // author: meizz
  const o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'H+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

export function LibDate() {
  /* 根据毫秒数返回当前时间的格式化表示
   * iType:1 返回格式 1990-01-02
   * iType:2 返回格式 1990-02-03 15:03:30
   * iType:3 返回格式 02-03 (月-日)
   */
  this.FormateMilisecondStr = function(ms, iType) {
    const zone = Cookies('zone')
    return this.FormateMilisecondStrByZone(ms, iType, zone)
  }

  this.FormateMilisecondStrByZone = function(ms, iType, zone) {
    const dt = new Date()
    if (zone === 'in') {
      ms = this.TimeShowToIndia(ms)
    } else if (zone === 'br') {
      ms = this.TimeShowToBR(ms)
    }
    dt.setTime(ms)
    switch (iType) {
      case 1:
        return dt.Format('yyyy-MM-dd')
      case 2:
        return dt.Format('yyyy-MM-dd HH:mm:ss')
      case 3:
        return dt.Format('MM-dd')
      case 4:
        return dt.Format('HH:mm:ss')
      case 5:
        return dt.Format('HH:mm')
      case 6:
        return dt.Format('MM-dd HH:mm')
      case 7:
        return dt.Format('MM-dd HH:mm:ss')
    }
  }
  this.SelectTimeToIndiaByZone = function(t) { // 根据选择的时区决定是否要将选定的时间要转化成印度时间(毫秒）
    const zone = Cookies('zone')
    if (zone === 'in') {
      return this.SelectTimeToIndia(t)
    } else if (zone === 'br') {
      return this.SelectTimeToBR(t)
    } else {
      return t
    }
  }
  this.SelectTimeToIndia = function(t) { // 选定的时间要转化成印度时间(毫秒）
    return t + 9000000
  }
  this.TimeShowToIndia = function(t) { // 用于展示的时间要转化成印度时间(毫秒）
    return t - 9000000
  }
  this.SelectTimeToBR = function(t) { // 选定的时间要转化成印度时间(毫秒）
    return t + 39600000
  }
  this.TimeShowToBR = function(t) { // 用于展示的时间要转化成印度时间(毫秒）
    return t - 39600000
  }
  this.FormateSecondStr = function(second, iType) {
    return this.FormateMilisecondStr(second * 1000, iType)
  }
  // 获取一天的开始的毫秒数
  // 输入参数为某个时间戳（毫秒)
  this.GetDayBegin = function(t) {
    return Date.parse(new Date(this.FormateMilisecondStr(t, 1) + ' 00:00:00'))
  }

  // 获取一天的结束的毫秒数
  // 输入参数为某个时间戳（毫秒)
  this.GetDayEnd = function(t) {
    const begin = this.GetDayBegin(t)
    return new Date().setTime((begin / 1000 + 24 * 60 * 60 - 1) * 1000)
  }

  // 测试要求用户输入的 08：30 这样的时间字符串格式是否正确
  this.TestHourFormat = function(str) {
    const pattern = /^([01]?\d|2[0-3]):[0-5]?\d$/
    return pattern.test(str)
  }
}

export function Pagination(_totalCount, _pageNum) {
  this.totalCount = _totalCount
  this.pageNum = _pageNum
  this.pageNo = 1
  const $this = this

  this.GetCurrentPage = function() {
    return $this.pageNo
  }
  this.SetPageNo = function(pageNo) {
    $this.pageNo = pageNo
  }
  this.SetTotalCount = function(count) {
    $this.totalCount = count
  }
  this.SetPageNum = function(pageNum) {
    $this.pageNum = pageNum
  }
  this.GetPageNum = function() {
    return $this.pageNum
  }
  this.GetPageMax = function() {
    return Math.floor(($this.totalCount + $this.pageNum - 1) / $this.pageNum)
  }
  this.GetTotalCount = function() {
    return $this.totalCount
  }
  this.GetPageIndex = function(pageNo) {
    if ($this.totalCount === 0) {
      return { Begin: 0, End: 0 }
    } else {
      var maxPageNo = this.GetPageMax()
      if (maxPageNo < pageNo) {
        pageNo = maxPageNo
      } else if (pageNo < 1) {
        pageNo = 1
      }
      return {
        Begin: (pageNo - 1) * $this.pageNum,
        End: $this.pageNum * pageNo > $this.totalCount ? $this.totalCount : $this.pageNum * pageNo
      }
    }
  }
}

// sortOrder 1 ASC -1 DESC
export function ClientTableData(_totalData, pageNum, filterMap, sortName, sortOrder, idKey) {
  this.TotalData = _totalData
  this.FilterMap = filterMap
  this.FilterValueMap = {}
  const $this = this
  this.Page = new Pagination(this.TotalData.length, pageNum)
  this.SortName = sortName
  this.SortOrder = sortOrder || -1
  this.IDKey = idKey || 'ID'
  this.ShowData = []
  this.tmpData = []

  this.GetShowValue = function(typeName, key) {
    console.log('GetShowValue', key)
    return $this.FilterMap[typeName][key]
  }

  // 处理搜索相关逻辑

  // value为搜索的内容
  // params为搜索哪些字段
  this.Search = function(value, params) {
    console.log('Search', value, params)
    const v = value.toString()
    $this.tmpData = $this.TotalData.filter(
      function(data) {
        for (const o in params) {
          const key = params[o]
          console.log('Search key', key, ' data', data)
          if (key.includes('.')) {
            const keys = key.split('.')
            for (let i = 0; i < keys.length; i++) {
              const k = keys[i]
              if (i === keys.length - 1) {
                if (data[k].toString().includes(v)) {
                  return true
                }
              } else if (data[k]) {
                data = data[k]
              }
            }
            continue
          }
          if (data[key].toString().includes(v)) {
            console.log('Search key', key, ' data[key]', data[key])
            return true
          }
        }
        return false
      }
    )
    $this.Page.SetTotalCount($this.tmpData.length)
    $this._sortByProp()
    $this.ShowData = $this.GetCurrentPageData()
  }

  // 处理筛选相关的逻辑
  this.ClearFilterMap = function() {
    console.log('ClearFilterMap')
    if ($this.TotalData.length > 0) {
      for (const o in $this.FilterMap) {
        $this.FilterValueMap[o] = 0
        if ($this.FilterMap[o] === 'all') {
          $this.FilterMap[o] = getDefaultFilterValues(o)
        }
      }
      $this.FilterData()
    }
  }

  // 处理没有映射关系，直接使用值作筛选的情况
  const getDefaultFilterValues = function(key) {
    console.log('getDefaultFilterValues', key)
    const s = new Set()
    for (let i = 0; i < $this.TotalData.length; i++) {
      s.add($this.TotalData[i][key])
    }
    const res = {}
    for (const x of s) {
      res[x] = x
    }
    return res
  }

  // 处理筛选相关的逻辑
  // includeVal0 是否包含值为0的项，默认不包含
  this.FilterData = function(includeVal0 = false) {
    console.log('FilterData', includeVal0)
    $this.tmpData = $this.TotalData.filter(
      function(data) {
        for (const f in $this.FilterValueMap) {
          if (!includeVal0 && $this.FilterValueMap[f] !== 0 && $this.FilterValueMap[f] !== data[f] || // FilterValueMap[f] 值不为0
            includeVal0 && $this.FilterValueMap[f] !== data[f]) { // FilterValueMap[f] 值可为0
            return false
          }
        }
        return true
      }
    )
    $this.Page.SetTotalCount($this.tmpData.length)
    $this._sortByProp()
    $this.ShowData = $this.GetCurrentPageData()
  }
  // 传对应的字段和值然后返回所有
  this.FilterDataCustomize = function(obj) {
    console.log('FilterDataCustomize', obj)
    $this.tmpData = $this.TotalData.filter(
      function(data) {
        for (const f in $this.FilterValueMap) {
          let defaultValue = 0
          if (obj.hasOwnProperty(f)) {
            defaultValue = parseInt(obj[f])
          }
          if ($this.FilterValueMap[f] !== defaultValue && $this.FilterValueMap[f] !== data[f]) {
            return false
          }
        }
        return true
      }
    )
    $this.Page.SetTotalCount($this.tmpData.length)
    $this._sortByProp()
    $this.ShowData = $this.GetCurrentPageData()
  }

  this.GetPage = function() {
    return $this.Page
  }
  // 排序函数
  this.compare = function(a, b) {
    let val1 = null
    let val2 = null
    if ($this.SortName.includes('.')) {
      const arr = $this.SortName.split('.')
      for (let i = 0; i < arr.length; i++) {
        const key = arr[i]
        console.log('compare key', key, ' a', a, ' b', b)
        if (i === arr.length - 1) {
          val1 = a[key]
          val2 = b[key]
        } else {
          a = a[key]
          b = b[key]
        }
        if (a === null || b === null) {
          val1 = a
          val2 = b
          break
        }
      }
    } else {
      val1 = a[$this.SortName]
      val2 = b[$this.SortName]
    }

    if (val1 < val2) {
      return -1 * $this.SortOrder
    } else if (val1 > val2) {
      return 1 * $this.SortOrder
    } else {
      return 0
    }
  }
  // 传入排序字段及排序方向
  this.SortByProp = function(prop, order, compareMethod) {
    console.log('SortByProp sortName', $this.SortName, ' sortOrder', $this.SortOrder, ' compareMethod', compareMethod)
    $this.SortName = prop
    if (prop != null) {
      $this.SortOrder = order === 'ascending' ? 1 : -1
    }
    this._sortByProp(compareMethod)
  }
  this._sortByProp = function(compareMethod) {
    if ($this.SortName == null) {
      $this.tmpData = $this.tmpData.slice(0)
    } else {
      if (compareMethod != null) {
        $this.tmpData = $this.tmpData.sort(compareMethod)
      } else {
        $this.tmpData = $this.tmpData.sort(this.compare)
      }
    }
  }
  // 获取总记录数
  this.GetTotalCount = function() {
    return $this.Page.GetTotalCount()
  }
  // 获取当前页
  this.GetCurrentPage = function() {
    return $this.Page.GetCurrentPage()
  }
  // 获取每页数量
  this.GetPageNum = function() {
    return $this.Page.GetPageNum()
  }
  // 返回当前页的内容
  this.GetCurrentPageData = function() {
    return $this.GetPageData($this.Page.GetCurrentPage())
  }
  // 获取某一页数据
  this.GetPageData = function(pageNo) {
    console.log('GetPageData', pageNo)
    if ($this.tmpData == null || $this.tmpData.length === 0) {
      return []
    }
    const pageIndex = $this.Page.GetPageIndex(pageNo)
    return $this.tmpData.slice(pageIndex.Begin, pageIndex.End)
  }
  // 分页处理-当前页改变
  this.OnPageNoChange = function(pageNo) {
    console.log('onPageNoChange', pageNo)
    $this.Page.SetPageNo(pageNo)
    $this.ShowData = $this.GetPageData(pageNo)
  }
  // 分页处理-每页数量改变
  this.OnPageSizeChange = function(pageNum) {
    console.log('onPageSizeChange', pageNum)
    $this.Page.SetPageNum(pageNum)
    $this.ShowData = $this.GetPageData($this.Page.GetCurrentPage())
    console.log('OnPageSizeChange ShowData.length', $this.ShowData.length)
  }
  // 更新数组中字段内容
  this.UpdateData = function(ob) {
    for (var i = 0; i < $this.TotalData.length; i++) {
      var data = $this.TotalData[i]
      if (data[this.IDKey] === ob.ID) {
        Object.assign($this.TotalData[i], ob)
        break
      }
    }
    $this.tmpData = $this.TotalData.slice(0)
    this._sortByProp()
    this.FilterData()
    $this.ShowData = $this.GetCurrentPageData()
  }

  // 更新数组中字段内容
  this.UpdateData2 = function(keyName, ob) {
    for (let i = 0; i < $this.TotalData.length; i++) {
      const item = $this.TotalData[i]
      if (item[keyName] === ob[keyName]) {
        Object.assign($this.TotalData[i], ob)
        break
      }
    }
    $this.tmpData = $this.TotalData.slice(0)
    this._sortByProp()
    this.FilterData()
    $this.ShowData = $this.GetCurrentPageData()
  }

  this.GetDataByID = function(ID) {
    for (let i = 0; i < $this.TotalData.length; i++) {
      const data = $this.TotalData[i]
      if (data[this.IDKey] === ID) {
        return data
      }
    }
    return null
  }

  this.GetTreeDataById = function(ID) {
    const stack = [...$this.TotalData]

    while (stack.length > 0) {
      const current = stack.pop()

      if (current[this.IDKey] === ID) {
        return current
      }

      if (current.children && current.children.length > 0) {
        stack.push(...[...current.children].reverse())
      }
    }

    return null // 未找到
  }

  this.DelData = function(id) {
    for (var i = 0; i < $this.TotalData.length; i++) {
      if ($this.TotalData[i][this.IDKey] === id) {
        $this.TotalData.splice(i, 1)
        break
      }
    }
    $this.tmpData = $this.TotalData.slice(0)
    $this.Page.SetTotalCount($this.TotalData.length)
    this._sortByProp()
    this.FilterData()
    $this.ShowData = $this.GetCurrentPageData()
  }
  this.DelData2 = function(keyName, id) {
    for (let i = 0; i < $this.TotalData.length; i++) {
      const item = $this.TotalData[i]
      if (item[keyName] === id) {
        console.log(item, keyName, id)
        $this.TotalData.splice(i, 1)
        break
      }
    }
    $this.tmpData = $this.TotalData.slice(0)
    $this.Page.SetTotalCount($this.TotalData.length)
    this._sortByProp()
    this.FilterData()
    $this.ShowData = $this.GetCurrentPageData()
  }

  // 添加数组中的字段内容
  this.AddData = function(ob) {
    $this.TotalData.push(ob)
    $this.tmpData = $this.TotalData.slice(0)
    $this.Page.SetTotalCount($this.TotalData.length)
    this._sortByProp()
    this.FilterData()
    $this.ShowData = $this.GetCurrentPageData()
  }
  this.ClearFilterMap()
  this._sortByProp()
}

const Type = (function() {
  const type = {}
  const typeArr = ['String', 'Object', 'Number', 'Array', 'Undefined', 'Function', 'Null', 'Symbol']
  for (let i = 0; i < typeArr.length; i++) {
    (function(name) {
      type['Is' + name] = function(obj) {
        return Object.prototype.toString.call(obj) === '[object ' + name + ']'
      }
    })(typeArr[i])
  }
  return type
})()

function TypeHelper() {
  this.IsString = function(obj) {
    return Type.IsString(obj)
  }
  this.IsObject = function(obj) {
    return Type.IsObject(obj)
  }
  this.IsNumber = function(obj) {
    return Type.IsNumber(obj)
  }
  this.IsArray = function(obj) {
    return Type.IsArray(obj)
  }
  this.IsUndefined = function(obj) {
    return Type.IsUndefined(obj)
  }
  this.IsFunction = function(obj) {
    return Type.IsFunction(obj)
  }
  this.IsNull = function(obj) {
    return Type.IsNull(obj)
  }
  this.IsSymbol = function(obj) {
    return Type.IsSymbol(obj)
  }

  const intPattern = /^(\d+)$/
  const floatPattern = /^\d*.\d*$/

  this.IsInt = function(ob) {
    return intPattern.test(ob)
  }

  this.IsFloat = function(ob) {
    return floatPattern.test(ob)
  }

  this.DeepCopy = function(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
}

export const $libType = new TypeHelper()

/** **************************Vue Validate *************************/

/* config{
          nullMsg：string 在内容不能为空时的错误提示
          type:
              n:整数
              f:浮点数
              s:任何字符
              reg: 需要提供属性 pattern(正则对象)  例：:rules="dataRule(true,{type:'reg',pattern:/^\d+(;\d)*$/})"
              fun: 需要提供属性 fun(函数对象)

          range:  min-max(或只填写 min) 最小值,最大值 （在type为数字时，表示数值；在type为字符串时，表示长度）
        }
     例：
       {
           type:'s',
           range:'10-100',
           nullMsg:"请上传图片",
        }
        */
export function DataRule(required, config) {
  var rules = []
  var nullMsg = '该输入项为必填项!'
  if (config && config.nullMsg) {
    nullMsg = config.nullMsg
  }
  if (required) {
    rules.push({ required: true, message: nullMsg, trigger: 'blur' },
      { required: true, message: nullMsg, trigger: 'change' }
    )
  }
  if (!config) return rules

  var min = null
  var max = null
  if (config.range) {
    var reg2 = /^(\d+\.*\d*)-(\d+\.*\d*)$/
    if (reg2.test(config.range)) {
      var ss = config.range.split('-')
      min = parseFloat(ss[0])
      max = parseFloat(ss[1])
    } else {
      min = parseFloat(config.range)
    }
  }

  var sType, sMsg

  if (config.type) {
    switch (config.type) {
      case 's':
        sType = 'string'
        sMsg = '请填写内容'
        if (min == null && max == null) {
          rules.push({ type: sType, message: sMsg, trigger: 'blur' })
        } else if (max == null) {
          rules.push({ type: sType, message: sMsg + '，字符串长度至少为' + min, min: min, trigger: 'blur' })
        } else {
          rules.push({
            type: sType,
            message: sMsg + '，字符串长度在' + min + '-' + max + '之间',
            min: min,
            max: max,
            trigger: 'blur'
          })
        }
        break
      case 'n':
        sType = 'integer'
        if (min == null && max == null) {
          rules.push({ type: sType, message: '请填写整数', trigger: 'blur' })
        } else if (max == null) {
          rules.push({ type: sType, message: '请填写≥' + min + '的整数', min: min, trigger: 'blur' })
        } else {
          rules.push({
            type: sType,
            message: '请填写≥' + min + '且<' + max + '的整数',
            min: min,
            max: max,
            trigger: 'blur'
          })
        }
        break
      case 'f':
        var isValidNumber = (rule, value, callback, source, options) => {
          if (value != null && value !== '') {
            var f = parseFloat(value)
            if (isNaN(f)) {
              callback(new Error('请输入数字'))
            } else {
              // parseFloat对于输入尾部有非数字类型会忽略，所以再次检查
              var reg = /^-?\d*.\d*$/
              if (!reg.test(value)) {
                callback(new Error('请输入数字'))
              }
              var min = rule.min
              var max = rule.max
              if (min != null || max != null) {
                if (min != null && max != null) {
                  if (f < min || f > max) {
                    callback(new Error('请填写≥' + min + '且<' + max + '的数字'))
                  }
                } else if (min != null && f < min) {
                  callback(new Error('请填写≥' + min + '的数字'))
                }
              }
              callback()
            }
          } else {
            callback()
          }
        }
        rules.push({ validator: isValidNumber, min: min, max: max, trigger: 'blur' })
        break
      case 'reg':
        if (config.pattern) {
          rules.push({ pattern: config.pattern, message: '格式不正确', trigger: 'blur' })
        }
        break
      case 'fun':
        if (config.fun) {
          rules.push({ validator: config.fun, trigger: 'blur' })
        }
        break
    }
  }
  // console.log("rules", rules)
  return rules
}

export function ValidateVueItem(item) {
  let ok = false
  item.validate((valid) => {
    ok = valid
  })
  if (!ok) {
    Message.error('填写内容存在错误或缺漏！')
    return false
  }
  return true
}

// 处理金币与实际存储之间的逻辑（加大1000倍后存储）
// attrNames 为金币相关的数值的字段名
export function MoneyShow(attrNames) {
  this.attrNames = attrNames
  const _tranObjectForShow = function(item) {
    var _item = {}
    Object.assign(_item, item)
    for (let i = 0; i < attrNames.length; i++) {
      if (item[attrNames[i]]) {
        // 判断值是对象还是数组
        _item[attrNames[i]] /= 1000
      }
    }
    return _item
  }
  this.TransForShow = function(obj) {
    if ($libType.IsArray(obj)) {
      var items = obj.splice(0)
      for (const o in items) {
        items[o] = _tranObjectForShow(items[o])
      }
      return items
    } else if ($libType.IsObject(obj)) {
      return _tranObjectForShow(obj)
    } else {
      return obj / 1000
    }
  }
  const _tranObjectForStore = function(item) {
    var _item = {}
    Object.assign(_item, item)
    for (let i = 0; i < attrNames.length; i++) {
      if (item[attrNames[i]]) {
        _item[attrNames[i]] *= 1000
      }
    }
    return _item
  }
  this.TransForStore = function(obj) {
    if ($libType.IsArray(obj)) {
      var items = obj.splice(0)
      for (const o in items) {
        items[o] = _tranObjectForStore(items[o])
      }
      return items
    } else if ($libType.IsObject(obj)) {
      return _tranObjectForStore(obj)
    } else {
      return obj * 1000
    }
  }
}

export default common

export function LibJsonDiff() {
  const jsonDiff = require('diff')
  // 处理换行和空格
  const _replaceContent = function(content) {
    let text = content
    if (content.indexOf('\n') >= 0) {
      // 换行替换为<br/>
      // 空格替换为&ensp;
      const reg1 = new RegExp('\n', 'g')
      text = text.replace(reg1, '<br/>')
    }
    return text
  }

  // 获取对比后的结果及拼接展示效果
  this.DiffHistory = function(oldContent, newContent) {
    // diff之后的结果
    var diffResult = jsonDiff.diffJson(oldContent, newContent)
    const addedList = []
    const removedList = []
    // 遍历对比结果，摘出相应的数据
    // 首先判断的量级为一行
    diffResult.forEach((diffObj, index) => {
      const content = diffObj.value
      let replaceContent = _replaceContent(content)
      // 该项的下一项
      const next = diffResult[index + 1]
      const nextReplceContent = next && _replaceContent(next.value)
      if (diffObj.removed) {
        // 需要展示在历史结果位置的数据
        let dealedContent = ''
        if (diffObj.removeContent) {
          dealedContent = diffObj.removeContent
        } else {
          // 判断下一个项
          if (next && next.added) {
            // 说明两个项之前是对应的关系
            // 判断在不同的这行中，具体到字段的不同位置
            const testDiffList = jsonDiff.diffWordsWithSpace(
              replaceContent,
              nextReplceContent
            )
            const { addContent, removeContent } = diffText(testDiffList)
            next.addContent = addContent
            dealedContent = removeContent
          } else {
            // 如果想用空白，对没有内容的地方占位 start
            addedList.push('<span  style="visibility:hidden;">' + replaceContent + '</span>')
            // 如果想用空白，对没有内容的地方占位 end
            dealedContent =
              '<span style="color:red"">' +
              replaceContent.replace(/\s/gm, '&ensp;') +
              '</span>'
          }
          removedList.push(dealedContent)
        }
      } else if (diffObj.added) {
        // 需要展示在当前结果位置的数据
        let dealedContent = ''
        if (diffObj.addContent) {
          dealedContent = diffObj.addContent
        } else {
          // 判断下一个项
          if (next && next.removed) {
            // 说明两个项之前是对应的关系
            // 判断在不同的这行中，具体到字段的不同位置
            const testDiffList = jsonDiff.diffWordsWithSpace(
              replaceContent,
              nextReplceContent
            )
            const { addContent, removeContent } = diffText(testDiffList)
            next.removeContent = removeContent
            dealedContent = addContent
          } else {
            // 如果想用空白，对没有内容的地方占位 start
            removedList.push('<span  style="visibility:hidden;">' + replaceContent + '</span>')
            // 如果想用空白，对没有内容的地方占位 end
            dealedContent =
              '<span  style="color:red">' +
              replaceContent.replace(/\s/gm, '&ensp;') +
              '</span>'
          }
        }
        addedList.push(dealedContent)
      } else {
        // 没有改动的部分
        replaceContent = replaceContent.replace(/\s/gm, '&ensp;')
        addedList.push(
          '<p>' + replaceContent + '</p>'
        )
        removedList.push(
          '<p>' + replaceContent + '</p>'
        )
      }
    })
    return [removedList.join(''), addedList.join('')]
  }
  // 对比行内容差异并且拼接结果
  const diffText = function(result) {
    // 当前的数据
    const addList = []
    // 历史数据
    const removeList = []
    result.forEach((item) => {
      const value = item.value.replace(/\s/gm, '&ensp;')
      if (item.added) {
        addList.push(
          '<span style="color:red">' + value + '</span>'
        )
      } else if (item.removed) {
        removeList.push(
          '<span  style="color:red">' + value + '</span>'
        )
      } else {
        removeList.push('<span>' + value + '</span>')
        addList.push('<span>' + value + '</span>')
      }
    })
    return {
      addContent: addList.join(''),
      removeContent: removeList.join('')
    }
  }
}

export const $LibJsonDiff = new LibJsonDiff()

export function ToRawHtml(text) {
  if (!text) return ''
  let result = text

  result = result.replace(/<img\s+src=['"]([^'"]+)['"](?:\s+width=(\d+))?(?:\s+height=(\d+))?\s*\/?>/gi, (match, src, w, h) => {
    const wAttr = w ? ` width="${w}"` : ''
    const hAttr = h ? ` height="${h}"` : ''
    return `<img src="${src}"${wAttr}${hAttr} alt=""  style="vertical-align: middle;" />`
  })

  result = result.replace(/<on\s+click=['"]([^'"]+)['"]>/gi, '<span>')
  result = result.replace(/<\/on>/gi, '</span>')

  result = result.replace(/<size=(\d+)>/gi, '<span style="font-size: $1px;">')
  result = result.replace(/<\/size>/gi, '</span>')

  result = result.replace(/<color=([#a-fA-F0-9]+)>/gi, '<span style="color: $1;">')
  result = result.replace(/<\/color>/gi, '</span>')

  result = result.replace(/<outline\s+color=([#a-fA-F0-9]+)\s+width=(\d+)>/gi, '<span style="text-shadow: 0 0 $2px $1, 0 0 $2px $1, 0 0 $2px $1, 0 0 $2px $1;">')
  result = result.replace(/<\/outline>/gi, '</span>')

  result = result.replace(/<b>/gi, '<b>')
  result = result.replace(/<\/b>/gi, '</b>')

  result = result.replace(/<i>/gi, '<i>')
  result = result.replace(/<\/i>/gi, '</i>')

  result = result.replace(/<u>/gi, '<u>')
  result = result.replace(/<\/u>/gi, '</u>')

  result = result.replace(/\n/g, '<br/>')

  return result
}
