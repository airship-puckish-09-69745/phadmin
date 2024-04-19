<template>
  <el-dialog
      title="牌局过程"
      :visible.sync="ComponentsGameLogVisible"
      :before-close="closeView"
      width="85%"
  >
    <el-table
        :data="actions"
        border
        :row-style="getDetailRowStyle"
        style="width: 100%"
    >
      <el-table-column
          label="步骤"
          width="100"
      >
        <template slot-scope="scope">
          第{{ scope.row.Index }}步
        </template>
      </el-table-column>
      <el-table-column
          prop="Uid"
          label="Uid"
          width="100"
      />
      <el-table-column
          prop="Action"
          label="动作"
          width="80"
      />
      <el-table-column
          label="手牌"
      >
        <template slot-scope="scope">
          <div v-for="card in scope.row.cards" class="block">
            <el-image
                style="width: 37px; height: 50px"
                :src="getCardUrl(card)"
            />
          </div>
          <div
              v-if="scope.row.HandCards !== undefined && scope.row.HandCards != null && scope.row.HandCards.length > 0">
            <span>剩余手牌:</span>
            <div v-for="card in scope.row.HandCards" class="block">
              <el-image
                  style="width: 37px; height: 50px"
                  :src="getCardUrl(card)"
              />
            </div>
          </div>
          <!-- 结算信息 -->
          <div v-if="scope.row.IsFinished">

            <div v-for="one in scope.row.FinishArray" class="block-info">
              <span>用户：{{ one.Uid }} - {{ one.Nick }}</span><br>
              <span>Normal：{{ one.normalScore / 1000 }}</span><br>
              <span>下注：{{ one.payPot / 1000 }}</span><br>
              <span>输赢：{{ one.moneyWon / 1000 }}</span><br>
              <span>筹码变化：{{ one.moneyChange / 1000 }}</span><br>

              <span>抽水：{{ one.moneyFee / 1000 }}</span><br>
              <span>最终资产：{{ one.moneyTotal / 1000 }}</span><br>
              <span>燃烧获得：{{ one.burnedScore / 1000 }}</span><br>
              <span>额外结算：{{ one.extraScore / 1000 }}</span><br>
              <span>pusoyDos金币：{{ one.pusoyDosScore / 1000 }}</span><br>
              <span>奖池：{{ one.potMoney/1000 }}</span><br>
              <span>剩余手牌：
                <div v-for="card in one.handCards" class="block">
              <el-image
                  style="width: 37px; height: 50px"
                  :src="getCardUrl(card)"
              />
            </div></span><br>
<!--              <span>奖池：{{ showRobotLevel(one.Character) }}</span><br>-->
            </div>
          </div>
        </template>
      </el-table-column>

    </el-table>
  </el-dialog>
</template>

<script>

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'PusoyDosDetailLog',
  components: {},
  props: {
    GameLog: {
      type: Object,
      default: function () {
        return {}
      }
    },
    Gid: {
      type: Number,
      default: function () {
        return 0
      }
    },
    GameLogVisible: Boolean
  },
  data() {
    return {
      ComponentsGameLogVisible: false,
      actions: [],
      actionNames: {
        1: '单张',
        2: '对子',
        3: '三条',
        4: '顺子',
        5: '同花',
        6: '葫芦',
        7: '四带一',
        8: '同花顺',
        9: '皇家同花顺',
        10:'发牌'
      },
      cardMap : {
        0: 2, // 梅花 0x01->>0x21
        1: 4, // 黑桃 0x11->>0x41
        2: 3, // 红桃 0x21->>0x31
        3: 1, //  方片  0x31->>0x11
      },
      UidMap: {},
      UidStyleMap: {}
    }
  },
  watch: {
    'GameLog': {
      deep: true,
      handler: function (val) {
        this.initData(val)
      }
    },
    'Gid': {
      deep: true,
      handler: function (val) {
        this.Gid = val
      }
    },
    'GameLogVisible': {
      deep: true,
      handler: function (val) {
        this.ComponentsGameLogVisible = val
      }
    }
  },
  created() {

  },
  methods: {
    getDetailRowStyle(row) {
      switch (this.UidStyleMap[row.row.Uid]) {
        case 1:
          return {background: 'rgba(213,154,229,0.21)'}
        case 2:
          return {background: 'rgb(153,183,215)'}
        case 3:
          return {background: 'rgb(191,234,169)'}
        case 4:
          return {background: 'rgb(115,181,210)'}
      }
    },
    initData(val) {
      this.actions = []
      console.log('val===>', val)
      let styleIndex = 1
      const finishArray = []
      for (const o of val.players) {
        if (!this.UidStyleMap[o.uid]) {
          this.UidStyleMap[o.uid] = styleIndex
          styleIndex++
        }
        let one = {
          Uid: this.getRealUid(o.uid),
          Nick: o.nick,
          moneyFee: o.moneyFee,
          moneyChange: o.moneyChange,
          payPot: o.payPot,
          moneyWon: o.moneyWon,
          moneyTotal: o.moneyTotal,
          burnedScore:o.burnedScore,
          normalScore:o.normalScore,
          extraScore:o.extraScore,
          pusoyDosScore:o.pusoyDosScore,
          potMoney:o.potMoney,
          handCards: o.handCards,
          IsFinished: false,
        }
        finishArray.push(one)
      }
      for (const o of val.displayCardsList) {
        let action =this.actionNames[o.cardType]
        if (o.isPass===1){
          action="跳过"
        }
        let obj = {
          Action: action,
          Index: o.roundID,
          Uid: this.getRealUid(o.uid),
          cards: o.cards,
          // HandCards: HandCards,
          IsFinished: false,
        }
        console.log("=====",o.cards)
        if (o.cards) {
          // for (const c of o.cards) {
          //   obj.cards.push(c)
          // }
        }
        this.actions.push(obj)
      }

      this.actions.push({
        Index: 100000,
        Uid: this.getRealUid(val.winUid),
        Action: '赢家',
        HandCards: [],
        Cards: [],
        FinishArray: finishArray,
        IsFinished: true,
      })
    },
    isSecretGroup(group) {
      if (group.groupId === 0) {
        if (group.cardType === 2 && !group.joker) { // 没有使用癞子
          return true
        } else if (group.cardType === 2 && group.joker && group.joker.isSecretGroup) { // 癞子5条以上
          return true
        } else if (group.cardType === 3 && !group.joker && group.cards.length >= 5) {
          return true
        } else if (group.cardType === 3 && group.joker && group.joker.isSecretGroup) {
          return true
        }
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
    getCardNum(card) {
      const color = card >> 4
      const num = card & 0x0F
      let newColor = this.cardMap[color]
      const newCard = parseInt("0x" + newColor + num)
      console.log("============================",color,num,card,newColor,newCard)
      return newCard
    },
    getCardUrl(card) {      console.log("============================",card)
      let cardNum = this.getCardNum(card)
      return require('@/assets/poker/' + cardNum + '.png')
    },
    splitCards(cards) {
      if (cards == 0) {
        return []
      }
      const arr = cards.split('_')
      const vals = []
      for (let i = 0; i < arr.length; i++) {
        vals.push(parseInt(arr[i]))
      }
      return vals
    },
    getPoint(cards) {
      if (cards.length == 0) {
        return 0
      } else {
        return cards[0]
      }
    },
    showRobotLevel(level) {
      switch (level) {
        case 0:
          return '真人'
        case 1:
          return 'A'
        case 2:
          return 'B'
        case 3:
          return 'C'
        case 4:
          return 'D'
        case 5:
          return 'E'
        default:
          return level
      }
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
