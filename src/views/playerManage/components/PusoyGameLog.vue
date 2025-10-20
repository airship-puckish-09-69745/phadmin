<template>
  <el-dialog title="Pusoy牌局详情" :visible.sync="pusoyDetailVisible" width="1400px">
    <el-table
      :data="pusoyDetail.players"
      :span-method="pusoySpanMethods"
      border
    >
      <el-table-column prop="uid" label="UID" width="100" />
      <el-table-column prop="seat" label="座位" width="100" />
      <el-table-column label="手牌" width="450" align="center">
        <el-table-column prop="cards" label="后手牌" width="150">
          <template #default="scope">
            <template v-if="scope.row.cardType > 1">
              <div v-html="showCard(scope.row.cards)" />
              <span>({{ pusoyCardTypes[scope.row.cardType] || '' }})</span>
            </template>
            <template v-else>
              <div v-html="showCard(scope.row.groupBottom.cards)" />
              <span>({{ pusoyGroupCardTypes[scope.row.groupBottom.cardType] || '' }})</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="cards" label="中手牌" width="150">
          <template slot-scope="scope">
            <div v-html="showCard(scope.row.groupMiddle.cards)" />
            <span>({{ pusoyGroupCardTypes[scope.row.groupMiddle.cardType] || '' }})</span></template>
        </el-table-column>
        <el-table-column prop="cards" label="前手牌" width="150">
          <template slot-scope="scope">
            <div v-html="showCard(scope.row.groupTop.cards)" />
            <span>({{ pusoyGroupCardTypes[scope.row.groupTop.cardType] || '' }})</span></template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="cardType" label="牌型" width="90">
        <template slot-scope="scope">{{ pusoyShowCardTypeName(scope.row.cardType) }} {{
          pusoyShowShootAll(scope.row)
        }} {{ pusoyShowGroupExtra(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column prop="cardScore" label="点数" width="100" />
      <el-table-column prop="moneyBet" label="下注" width="100">
        <template slot-scope="scope">{{ scope.row.moneyBet / 1000 }}</template>
      </el-table-column>
      <el-table-column prop="moneyWon" label="输赢" width="100">
        <template slot-scope="scope">{{ scope.row.moneyWon / 1000 }}</template>
      </el-table-column>
      <el-table-column prop="moneyFee" label="抽水" width="100">
        <template slot-scope="scope">{{ scope.row.moneyFee / 1000 }}</template>
      </el-table-column>
      <el-table-column prop="moneyTotal" label="最终资产" width="100">
        <template slot-scope="scope">{{ scope.row.moneyTotal / 1000 }}</template>
      </el-table-column>
      <el-table-column prop="moneyTotal" label="用户类型" width="120">
        <template slot-scope="scope">{{ getRobotType(scope.row.RobotId,scope.row.RobotLevel,scope.row.userType,scope.row.RobotDefenceLevel) }}</template>
      </el-table-column>
    </el-table>
    <br>
    <el-table
      title="打枪："
      :visible.sync="pusoyShootOneShow"
      :data="pusoyDetail.shootOne"
      width="100%"
      border
    >
      <el-table-column label="Pusoy List：">
        <el-table-column prop="SourcePlayer.uid" label="打枪">
          <template slot-scope="scope">{{ scope.row.SourcePlayer.uid }}</template>
        </el-table-column>
        <el-table-column prop="TargetPlayer.uid" label="Pusoy">
          <template slot-scope="scope">{{ scope.row.TargetPlayer.uid }}</template>
        </el-table-column>
        <el-table-column prop="SourcePlayer.scoreChanged" label="ScoreChanged" />
      </el-table-column>
    </el-table>
    <br>
    <el-descriptions title="扩展信息">
      <el-descriptions-item label="桌子ID">{{ pusoyDetail.tid }}</el-descriptions-item>
      <el-descriptions-item label="Server日志ID">{{ pusoyDetail.logId }}</el-descriptions-item>
      <el-descriptions-item label="是否发生换牌">{{ pusoyShowChangeCardString(pusoyDetail.isChangedCards) }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>

</template>
<script>
import { $libShow } from '@/utils/common'

export default {
  name: 'PusoyGameLog',
  components: {},
  props: {
    // eslint-disable-next-line vue/prop-name-casing
    GameLog: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      libShow: $libShow,
      showGameLog: {},
      pusoyCardTypes: {
        0: '爆牌',
        1: '普通牌型',
        101: '三同花',
        102: '三顺子',
        103: '六对半',
        106: '清一色',
        112: '一条龙',
        113: '清龙'
      },
      pusoyGroupCardTypes: {},
      pusoyDetail: {},
      pusoyShootOneShow: false,
      pusoyDetailVisible: false,
      title: 'Pusoy牌局详情'
    }
  },
  watch: {
    'GameLog': {
      deep: true,
      handler: function(val) {
        this.initData(val)
      }
    }
  },
  created() {
    this.initData(this.GameLog)
  },
  methods: {
    showCard(cards, isSpe) {
      if (cards === null || cards === undefined) {
        return ''
      }
      let ret = '初：'
      if (isSpe) {
        ret = '展：'
      }
      if (cards.length === 1) {
        return ret + $libShow.CardShow(cards[0])
      }
      for (let i = 0; i < cards.length; i++) {
        ret += $libShow.CardShow(cards[i])
      }
      return ret
    },
    pusoyShowGroupExtra(row) {
      if (row.groupBottom.extraScore > 0 || row.groupMiddle.extraScore > 0 || row.groupTop.extraScore > 0) {
        return '(牌型加分)'
      }
      return ''
    },
    pusoyShowShootAll(row) {
      if (row.uid === this.pusoyDetail.shootAllUid) {
        return '(全垒打)'
      }
      return ''
    },
    pusoyShowCardTypeName(type) {
      if (type > 1) {
        return '特殊牌型'
      } else {
        return this.pusoyCardTypes[type] || '-'
      }
    },
    pusoySpanMethods({ row, columnIndex }) {
      if (columnIndex === 3) {
        console.log('row: ', row)
        console.log('columnIndex: ', columnIndex)
      }
      let _row = 0
      let _col = 0
      // 前三列
      if (columnIndex === 2 && row.cardType > 1) {
        _row = 1 // 偶数行 两行
        _col = 3
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if ((columnIndex === 3 || columnIndex === 4) && row.cardType > 1) {
        _row = 1 // 偶数行 两行
        _col = 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    initData(val) {
      this.showGameLog = JSON.parse(JSON.stringify(val))
      this.title = 'Pusoy牌局详情'
      this.showPusoyGame(this.showGameLog.detail)
    },
    pusoyShowChangeCardString(change) {
      if (change) {
        return '是'
      } else {
        return '否'
      }
    },
    showPusoyGame(obj) {
      console.log(obj)
      if (obj === null || obj === undefined) {
        return
      }
      this.pusoyShootOneShow = false
      for (const k in obj.players) {
        for (const i in obj.groupTop) {
          if (obj.groupTop[i].uid === obj.players[k].uid) {
            obj.players[k].groupTop = obj.groupTop[i]
            break
          }
        }
        for (const i in obj.groupMiddle) {
          if (obj.groupMiddle[i].uid === obj.players[k].uid) {
            obj.players[k].groupMiddle = obj.groupMiddle[i]
            break
          }
        }
        for (const i in obj.groupBottom) {
          if (obj.groupBottom[i].uid === obj.players[k].uid) {
            obj.players[k].groupBottom = obj.groupBottom[i]
            break
          }
        }
      }
      if (obj.shootOne) {
        this.pusoyShootOneShow = true
      }
      this.pusoyDetail = obj
      this.pusoyDetailVisible = true
    },
    getRobotType(robotId, robotLevel,userType,robotDefenceLevel) {
      console.log(robotId, robotLevel,userType,robotDefenceLevel)
      if (robotId == 0) {
        if (userType === 0 ||userType === undefined) {
          return '真人'
        }else if (userType == 1) {
          return '真人-疑似'
        }else if (userType == 2) {
          return '真人-黑子'
        }
      } else {
        if (robotDefenceLevel !== undefined && robotDefenceLevel > 0) {
          return this.getRobotDefenceLevel(robotDefenceLevel)
        }

        switch (robotLevel) {
          case 1:
            return '机器人-强放'
          case 2:
            return '机器人-弱放'
          case 3:
            return '机器人-陪玩'
          case 4:
            return '机器人-弱杀'
          case 5:
            return '机器人-强杀'
          case 6:
            return '机器人-破产保护'
          default:
            return '机器人-未知'
        }
      }
    },

    getRobotDefenceLevel(level) {
      if (level === 0) {
        return ''
      } else if (level === 3) {
        return '贴防 -- 陪玩'
      } else if (level === 4) {
        return '贴防 -- 弱杀'
      } else if (level === 5) {
        return '贴防 -- 强杀'
      } else if (level === 6) {
        return '贴防 -- 防作弊'
      } else if (level === 7) {
        return '预贴防 -- 陪玩'
      } else if (level === 8) {
        return '预贴防 -- 弱杀'
      } else if (level === 9) {
        return '预贴防 -- 强杀'
      } else if (level === 10) {
        return '贴防 -- 锁血强杀'
      } else if (level === 11) {
        return '预贴防 --  锁血强杀'
      }
    },

  }
}
</script>
