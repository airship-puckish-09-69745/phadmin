<template>
  <el-dialog v-if="GameLog.gid==116" title="GinRummy 详情" :visible.sync="GameLog.visible" width="1300px">
    <el-descriptions class="margin-top" title="" :column="3" border size="mini">
      <el-descriptions-item>
        <template slot="label">前注：</template>
        {{ formatNumber(GameLog.detail.tableMoney / 1000) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">结束原因：</template>
        {{ formatNumber(reasonOverMap[GameLog.detail.reasonOver]) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">牌局结束后牌桌Pot值：</template>
        {{ formatNumber(GameLog.detail.pot / 1000) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">总回合数：</template>
        {{ formatNumber(GameLog.detail.round) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">开始时间：</template>
        {{ formatTime(GameLog.detail.startTime) }}
      </el-descriptions-item><el-descriptions-item>
        <template slot="label">结束时间：</template>
        {{ formatTime(GameLog.detail.finishTime) }}
      </el-descriptions-item>
    </el-descriptions>
    <el-table
      :data="GameLog.detail.roundRet"
      border
      :row-style="getUserStyle"
      :header-cell-style="libShow.DefaultTableHeadClass"
      :cell-style="libShow.DefaultTableCell"
      size="mini"

    >
      <el-table-column label="Round" width="80px">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-table
            :data="scope.row.player"
            border
            :row-style="getUserStyle"
            :header-cell-style="libShow.DefaultTableHeadClass"
            :cell-style="libShow.DefaultTableCell"
            size="mini"
            style="margin-top: -10px"

          >
            <el-table-column label="Uid">
              <template slot-scope="scope2">{{ scope2.row.uid }}</template>
            </el-table-column>

            <el-table-column min-width="450px" label="手牌">
              <template slot-scope="scope">
                <span v-for="(k,v) in scope.row.groups">
                  <fieldset style="display: inline-block; padding: 1px; color: #0a76a4; margin-top: 10px; margin-right: 7px;">
                       <span v-for="(k2,v2) in k.cards" style="margin-top: 30px">
                            <el-image
                              style="width: 37px; height: 50px"
                              :src="getCardUrl(cardConversionColor(k2,'2-2','4-4','3-3','1-1'))"
                            />
                </span>
                  </fieldset>
                </span>

              </template>
            </el-table-column>

            <el-table-column label="手牌数量">
              <template slot-scope="scope2">{{ scope2.row.cardsNum }}</template>
            </el-table-column>
            <el-table-column label="knock玩家">
              <template slot-scope="scope2">{{ scope.row.uidKnock === scope2.row.uid ? '是' : '否' }}</template>
            </el-table-column>
            <el-table-column label="小局死点数">
              <template slot-scope="scope2">{{ scope2.row.scoreDie }}</template>
            </el-table-column>
            <el-table-column label="小局得分">
              <template slot-scope="scope2">{{ scope2.row.scoreRound }}</template>
            </el-table-column>
            <el-table-column label="总得分">
              <template slot-scope="scope2">{{ scope2.row.score }}</template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      :data="GameLog.detail.players"
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :cell-style="libShow.DefaultTableCell"
      size="mini"
      style="margin-top: 10px"
    >

      <el-table-column label="最终结算">
         <el-table-column label="uid">
           <template slot-scope="scope">{{ scope.row.uid }}</template>
         </el-table-column>
        <el-table-column label="筹码变化">
          <template slot-scope="scope">{{ scope.row.moneyChange  / 1000}}</template>
        </el-table-column>
        <el-table-column label="结算后金额">
          <template slot-scope="scope">{{ scope.row.moneyCur  / 1000}}</template>
        </el-table-column>
         <el-table-column label="总得分">
           <template slot-scope="scope">{{ scope.row.score }}</template>
         </el-table-column>
         <el-table-column label="每回合得分">
           <template slot-scope="scope">{{ scope.row.scoreRounds }}</template>
         </el-table-column>
        <el-table-column label="第四回合死点数">
          <template slot-scope="scope">{{ scope.row.scoreDie4 }}</template>
        </el-table-column>
         <el-table-column label="第四回合先摸牌">
           <template slot-scope="scope">{{ scope.row.isFirst4 === 1 ? '是' : '否' }}</template>
         </el-table-column>
         <el-table-column label="牌局输赢">
           <template slot-scope="scope">{{ scope.row.moneyWon  / 1000}}</template>
         </el-table-column>
         <el-table-column label="牌局抽成">
           <template slot-scope="scope">{{ scope.row.moneyTaxed  / 1000}}</template>
         </el-table-column>
         <el-table-column label="pot投入">
           <template slot-scope="scope">{{ scope.row.moneyPotPay  / 1000}}</template>
         </el-table-column>
         <el-table-column label="pot">
           <template slot-scope="scope">{{ scope.row.moneyPotWin  / 1000}}</template>
         </el-table-column>
         <el-table-column label="pot抽成">
           <template slot-scope="scope">{{ scope.row.moneyPotTaxed  / 1000}}</template>
         </el-table-column>
<!--         <el-table-column label="抽成贡献(输家)">-->
<!--           <template slot-scope="scope">{{ scope.row.payRake  / 1000}}</template>-->
<!--         </el-table-column>-->
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
      reasonOverMap:{
        1:'超分',
        2:'4局正常打完',
        3:'投降',
        4:'连续超时3次',
      },
      UidMap: {},
      userData: {},
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
      console.log("===============", val)
      val.detail.players.forEach(item => {
        this.userData[item.uid] = item
      })
      console.log("====,", this.userData)
    },
    getCardPoint(val) {
      var s = val.toString(16);
      if (s.length < 2) {
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
    getUserStyle({row, idx}) {
      // if (this.userData[row.uid].isDealer) {
      //   return { color: 'red' , width: '120px', textAlign: 'center',fontSize: '12px',height: '20px'}
      // }
      // return {fontSize: '12px',height: '20px'}
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
      if (card === '' || card === '' || 0) {
        return
      }
      return require('@/assets/poker/' + card + '.png')
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    cardConversionColor(num, meihua, heitao, hongtao, fangkuai) {
      // 要转换的颜色-转换后的颜色  梅花:?-2,黑桃:?-4,红桃:?-3,方块:?-1
      console.log("===", num)
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

      // 补1
      if (s.length === 1) {
        s = '1' + s[0] + ''
      }
      if (s[1] === 'e') {
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

.dominoHr {
  display: flex;
  flex-direction: column;
}
</style>
