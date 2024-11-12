<template>
  <el-dialog v-if="GameLog.gid==116" title="GinRummy 详情" :visible.sync="GameLog.visible" width="1300px">
    <el-descriptions class="margin-top" title="" :column="5" border>
      <el-descriptions-item>
        <template slot="label">前注：</template>
        {{ formatNumber(GameLog.detail.antes / 1000) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">总台费：</template>
        {{ formatNumber(GameLog.detail.totalTableFee / 1000) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">台费比例：</template>
        {{ formatNumber(GameLog.detail.FlowRate / 1000) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">开始时间：</template>
        {{ formatTime(GameLog.detail.startTime) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">结束时间：</template>
        {{ formatTime(GameLog.detail.endTime) }}
      </el-descriptions-item>
    </el-descriptions>
      <el-table
        :data="GameLog.detail.players"
        border
        :row-style="getUserStyle"
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.DefaultTableCell"
        size="mini"
      >
        <el-table-column label="uid">
          <template slot-scope="scope">{{scope.row.uid }}</template>
        </el-table-column>
        <el-table-column label="是否庄家">
          <template slot-scope="scope">{{scope.row.isDealer?'庄家':'闲家' }}</template>
        </el-table-column>
        <el-table-column label="总下注">
          <template slot-scope="scope">{{formatNumber(scope.row.moneyBet/ 1000) }}</template>
        </el-table-column>
        <el-table-column label="总输赢">
          <template slot-scope="scope">{{formatNumber((scope.row.moneyChange )/1000) }}</template>
        </el-table-column>
        <el-table-column label="玩家台费">
          <template slot-scope="scope">{{formatNumber((scope.row.moneyTaxed )/1000) }}</template>
        </el-table-column>
      </el-table>
    <el-table
      :data="GameLog.detail.turnInfos"
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :cell-style="libShow.DefaultTableCell"
      size="mini"
      style="margin-top: 10px"
    >
      <el-table-column label="轮数" width="120px">
        <template slot-scope="scope">{{ roundMap[scope.row.Index] }}</template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-table
            :row-style="getUserStyle"
            :data="scope.row.infos"
            border
          >
            <el-table-column label="uid">
              <template slot-scope="scope">{{ scope.row.uid }}</template>
            </el-table-column>
            <el-table-column label="座位">
              <template slot-scope="scope">{{ scope.row.seatId }}</template>
            </el-table-column>
            <el-table-column label="操作类型">
              <template slot-scope="scope">{{ cardType[scope.row.type] }}</template>
            </el-table-column>
            <el-table-column label="筹码值">
              <template slot-scope="scope">{{ formatNumber(scope.row.chip /1000) }}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">{{ scope.row.attitude == 0 ? '主动操作' : '被动操作' }}</template>
            </el-table-column>
            <el-table-column label="牌型">
              <template slot-scope="scope" v-if=" scope.row.cardInfo">
                <span v-if="scope.row.cardInfo.CardType >= 10">
                {{ CardTypeMap[scope.row.cardInfo.CardType] }}
              </span>
                <span v-if="scope.row.cardInfo.CardType < 10">
                  {{ getCardPoint(scope.row.cardInfo.CardPoint) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="牌值"width="150px">
              <template slot-scope="scope" v-if=" scope.row.cardInfo">
                <div v-for="(card,index) in scope.row.cardInfo.cards" style="display: inline-table;">
                  {{ '牌'+(index+1) }}
                  <div v-if="card >= 0" class="dominoHr">
                    <el-image
                      style="width: 30px; height: 30px"
                      :src="getDominoCardUrl(card,0)"
                    />
                    <el-image
                      style="width: 30px; height: 30px;margin-top: -3px"
                      :src="getDominoCardUrl(card,1)"
                    />
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

</template>
<script>

import {$libDate, $libShow} from "@/utils/common";

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'GinRummy',
  components: {},
  props: {
    GameLog: {
      type: Object,
      default: function () {
        return {}
      }
    },
    UserMap: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      actions: [],
      libShow: $libShow,
      cardMap: {
        0: 2, // 梅花 0x01->>0x21
        1: 4, // 黑桃 0x11->>0x41
        2: 3, // 红桃 0x21->>0x31
        3: 1 //  方片  0x31->>0x11
      },
      UidMap: {},
      userData:{},
      UidStyleMap: {},
      tableData: [],
      userInfo: {},
      ConversionColorMap: {},
      roundMap: {
        1: '前注',
        2: '第一轮发牌',
        3: '第二轮发牌',
        4: '确认牌型',
        5: '游戏结算',
      },
      cardType: {
        1: '弃牌',
        2: 'Check',
        8: 'Call',
        9: 'Call',
        10: 'Raise',
        11: 'All In',
      },
      CardTypeMap: {
        10: 'QIUQIU',
        11: 'Big Cards',
        12: 'Small Cards',
        13: 'Twin Cards',
        14: 'Six Devils',
      }
    }
  },
  watch: {
    'GameLog': {
      deep: true,
      handler: function (val) {
        this.initData(val)
      }
    }
  },
  created() {
    this.initData(this.GameLog)
  },
  methods: {
    getDetailRowStyle(row) {
      switch (row.row.Round) {
        case 1:
          return {background: 'rgba(224,148,250,0.25)'}
        case 2:
          return {background: 'rgba(121,236,236,0.23)'}
        case 3:
          return {background: 'rgba(156,188,231,0.35)'}
        case 4:
          return {background: 'rgba(169,246,166,0.29)'}
      }
    },

    initData(val) {
      console.log("===============",val)
      val.detail.players.forEach(item => {
        this.userData[item.uid]=item
      })
      console.log("====,",this.userData)
    },
    getCardPoint(val) {
      var s = val.toString(16);
      if (s.length<2){
        s = '0' + s
      }
        return '(' + s[0] + ',' + s[1] + ')'
    },
    getRealUid(uid) {
      if (uid < 1000000) {
        if (this.UidMap.hasOwnProperty(uid)) {
          return this.UidMap[uid]
        }
      }
      return uid
    },
    getUserStyle(  {row,idx} ) {
      if (this.userData[row.uid].isDealer) {
        return { color: 'red' , width: '120px', textAlign: 'center',fontSize: '12px',height: '20px'}
      }
      return {fontSize: '12px',height: '20px'}
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    getDominoCardUrl(card, num) {
      card = num === 1 ? card & 0x0f : (card >> 4) & 0x0f
      return require('@/assets/domino/' + card + '.png')
    },
    getCardNum(card) {
      card = parseInt(card)
      const color = card >> 4
      const num = card & 0x0F
      let newNum = '' + num
      const newColor = this.cardMap[color]

      if (num == 10) {
        newNum = 'a'
      } else if (num == 11) {
        newNum = 'b'
      } else if (num == 12) {
        newNum = 'c'
      } else if (num == 13) {
        newNum = 'd'
      } else if (num == 14) {
        newNum = '1'
      }
      const newCard = parseInt('0x' + newColor + newNum)

      return newCard
    },
    getCardUrl(card) {
      if (card == '') {
        return
      }
      // const cardNum = this.getCardNum(card)
      return require('@/assets/poker/' + card + '.png')
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    cardConversionColor(num, meihua, heitao, hongtao, fangkuai) {
      // 要转换的颜色-转换后的颜色  梅花:?-2,黑桃:?-4,红桃:?-3,方块:?-1
      if (num == 0) {
        return 2
      }
      if (Object.keys(this.ConversionColorMap).length === 0) {
        var m = meihua.split('-')
        var hei = heitao.split('-')
        var hong = hongtao.split('-')
        var f = fangkuai.split('-')
        this.ConversionColorMap[m[0]] = m[1]
        this.ConversionColorMap[hei[0]] = hei[1]
        this.ConversionColorMap[hong[0]] = hong[1]
        this.ConversionColorMap[f[0]] = f[1]
      }
      var s = num.toString(16)
      // 补0
      if (s.length === 1) {
        s = '0' + s[0]
      }
      if (s[1] == 'e') {
        s = s[0] + '1'
      }
      const result = '0x' + this.ConversionColorMap[s[0]] + s[1]
      return parseInt(result)
    },

    closeView(done) {
      this.$emit('closeDialog')
      done()
    }
  }
}
</script>
<style>


.block-info {
  display: inline-table;
  padding-left: 10px;
}
.dominoHr{
  display: flex;
  flex-direction: column;
}
</style>
