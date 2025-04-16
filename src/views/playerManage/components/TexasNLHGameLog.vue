<template>
  <el-dialog
    title="TEXAL NLH Detail"
    :visible.sync="GameLog.visible"
    :before-close="closeView"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="85%"
  >
    <el-table
      :data="tableData"
      :row-style="getDetailRowStyle"
      style="width: 100%"
    >
      <el-table-column label="Round">
        <template slot-scope="scope">
          {{ RoundName[scope.row.Round] }}
        </template>
      </el-table-column>
      <el-table-column label="Role">
        <template v-if="isShowFunc(scope.row.StepType) && scope.row.Act!== 101" slot-scope="scope">
          {{ getRoleByUid(userInfo[scope.row.Uid].Role) }}
        </template>
      </el-table-column>

      <el-table-column label="Account">
        <template v-if="isShowFunc(scope.row.StepType) && scope.row.Act!== 101" slot-scope="scope">
          {{ scope.row.Uid }}
        </template>
      </el-table-column>
      <!--      <el-table-column label="StepType">-->
      <!--        <template slot-scope="scope" v-if="isShowFunc(scope.row.StepType)">-->
      <!--          {{ scope.row.StepType }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="HandCards">
        <template slot-scope="scope">
          <div v-if="scope.row.StepType==0 && scope.row.Act!== 101">
            <span v-for="(row,idx) in userInfo[scope.row.Uid].HandCards">
              <el-image
                :style="getCardStyle(idx)"
                :src="getCardUrl(cardConversionColor(row,'1-2','3-4','2-3','0-1'))"
              />
            </span>
          </div>
          <div v-else-if="scope.row.StepType==1 && scope.row.Act!== 101" style="font-size: 30px;height: 40px"> {{ 'POT:' + formatNumber(scope.row.Pot / 1000) }}</div>
          <div v-else-if="scope.row.StepType==2 && scope.row.Act!== 101">
            <span v-for="(row,idx) in scope.row.PublishCards">
              <el-image
                :style="getCardStyle(idx)"
                :src="getCardUrl(cardConversionColor(row,'1-2','3-4','2-3','0-1'))"
              />
            </span></div>
        </template>
      </el-table-column>
      <el-table-column label="Act">
        <template v-if="isShowFunc(scope.row.StepType)" slot-scope="scope">
          {{ ActName[scope.row.Act] }}
        </template>
      </el-table-column>
      <el-table-column label="Bet">
        <template v-if="isShowFunc(scope.row.StepType)" slot-scope="scope">
          {{ formatNumber(scope.row.Bet / 1000) }}
        </template>
      </el-table-column>
      <el-table-column label="Pot">
        <template v-if="isShowFunc(scope.row.StepType) && scope.row.Act!== 100" slot-scope="scope">
          {{ scope.row.Pot }}
        </template>
        <template v-if="isShowFunc(scope.row.StepType) && scope.row.Act=== 100" slot-scope="scope">
          Ratio: ({{ scope.row.Pot }}%)
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'TexasNLHDetailLog',
  components: {},
  props: {
    GameLog: {
      type: Object,
      default: function() {
        return {}
      }
    },
    UserMap: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      actions: [],
      ActName: {
        0: '前注',
        1: 'SB',
        2: 'BB',
        3: 'FOLD',
        4: 'CHECK',
        5: 'CALL',
        6: 'RAISE',
        7: 'ALLIN',
        8: 'CHECK_FOLD',
        9: 'CALL_ANY',
        16: 'STRADDLE',
        17: 'STRADDLE_ALL_IN',
        18: 'BET',
        19: 'FORCED_BB',
        98: 'WIN',
        99: 'LOSE',
        100: 'Insured',
        101: 'Insured'
      },
      RoundName: {
        0: 'Showdown',
        1: 'Preflop',
        2: 'Flop',
        3: 'Turn',
        4: 'River',
        5: 'Insure'
      },
      cardMap: {
        0: 2, // 梅花 0x01->>0x21
        1: 4, // 黑桃 0x11->>0x41
        2: 3, // 红桃 0x21->>0x31
        3: 1 //  方片  0x31->>0x11
      },
      UidMap: {},
      UidStyleMap: {},
      tableData: [],
      userInfo: {},
      ConversionColorMap: {}
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
    getDetailRowStyle(row) {
      switch (row.row.Round) {
        case 0:
          return { background: 'rgba(187,255,255,0.25)' }
        case 1:
          return { background: 'rgba(224,148,250,0.25)' }
        case 2:
          return { background: 'rgba(121,236,236,0.23)' }
        case 3:
          return { background: 'rgba(156,188,231,0.35)' }
        case 4:
          return { background: 'rgba(169,246,166,0.29)' }
      }
    },

    initData(val) {
      val.detail.Players.forEach(item => {
        this.userInfo[item.Uid] = {
          HandCards: item.HandCards,
          Uid: item.Uid,
          Role: item.Role,
          MoneyWon: item.MoneyWon,
          ServiceFee: item.ServiceFee,
          JpAward: item.JpAward,
          JpServiceFee: item.JpServiceFee
        }
      })
      this.tableData=[]
      val.detail.StepInfo.forEach(item => {
        this.tableData.push({
          Uid: item.Uid,
          Round: item.Round,
          StepType: item.StepType,
          Act: item.Act,
          Bet: item.Bet,
          Pot: item.Pot,
          PublishCards: item.PublishCards
        })
      })

      //添加结算信息
       this.tableData.push({
          Uid: 0,
          Round: 0,
          StepType: 2,
          PublishCards: val.detail.AllPublishCards
        })
      val.detail.Players.forEach(item => {
        var info = {
          Uid: item.Uid,
          Round: 0,
          StepType: 0,
          Act: 98,
          Bet: item.TurnMoney,
        }
        if (item.TurnMoney < 0 ){
          info.Act = 99
        }
        this.tableData.push(info)
      })

       val.detail.Players.forEach(item => {
        if (item.insureInfo !== undefined) {
          for (var i=0; i< item.insureInfo.length; i++) {
            var info = {
              Uid: item.Uid,
              Round: 5,
              StepType: 0,
              Act: 100,
              Bet: item.insureInfo[i].InsureFail,
              Pot: item.insureInfo[i].InsureRatio/10,
            }
            this.tableData.push(info)
          }

          var info = {
            Uid: item.Uid,
            Round: -1,
            StepType: 0,
            Act: 101,
            Bet: val.detail.SysInsure,
          }
          this.tableData.push(info)
        }
      })

      
    },
    getRoleByUid(role) {
      if (role === 1) {
        return '{SB}'
      } else if (role === 2) {
        return '{BB}'
      } else if (role === 3) {
        return '{D}'
      } else {
        return ''
      }
    },
    isShowFunc(stepType) {
      if (stepType == 0) {
        return true
      }
      return false
    },
    getRealUid(uid) {
      if (uid < 1000000) {
        if (this.UidMap.hasOwnProperty(uid)) {
          return this.UidMap[uid]
        }
      }
      return uid
    },
    formatNumber(n) {
      return n.toLocaleString()
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

    getPoint(cards) {
      if (cards.length == 0) {
        return 0
      } else {
        return cards[0]
      }
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
    getCardStyle(idx) {
      return 'width: 37px; height: 50px;'
    },
    getColor() {
      var color = '#'
      for (var i = 0; i < 6; i++) {
        color += (Math.random() * 16 | 0).toString(16)
      }
      return color
    },

    closeView(done) {
      this.$emit('closeDialog')
      done()
    }
  }
}
</script>
<style>
.block {
  display: inline-table;
}

.block-info {
  display: inline-table;
  padding-left: 10px;
}
</style>
