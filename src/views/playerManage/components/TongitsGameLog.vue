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
          <template v-if="scope.row.Groups">
            <template v-for="group in scope.row.Groups">
              <template v-if="group.isSecretGroup">
                <div class="block" style="background-color: green; margin: 0 1px 0 1px;">
                  <div v-for="card in group.cards" class="block">
                    <el-image
                      style="width: 37px; height: 50px"
                      :src="getCardUrl(card)"
                    />
                  </div>
                </div>
              </template>
              <template v-else>
                <div v-for="card in group.cards" class="block">
                  <el-image
                    style="width: 37px; height: 50px"
                    :src="getCardUrl(card)"
                  />
                </div>
              </template>
            </template>
          </template>
          <template v-else>
            <div v-for="card in scope.row.Cards" class="block">
              <el-image
                style="width: 37px; height: 50px"
                :src="getCardUrl(card)"
              />
            </div>
          </template>
          <div v-if="scope.row.HandCards !== undefined && scope.row.HandCards != null && scope.row.HandCards.length > 0">
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
              <span>Normal：{{ one.normalMoney/1000 }}</span><br>
              <span>奖励牌：{{ one.bonusCardMoney/1000 }}</span><br>
              <span>灼烧：{{ one.burnedMoney/1000 }}</span><br>
              <span>挑战：{{ one.challengeMoney/1000 }}</span><br>
              <template v-if="Gid !== 31">
                <span>PotMoney：{{ one.potMoney/1000 }}</span><br>
              </template>
              <span>秘密牌：{{ one.secretMeldMoney/1000 }}</span><br>
              <span>tongits：{{ one.tongitsMoney/1000 }}</span><br>
              <span>服务费：{{ one.moneyFee/1000 }}</span><br>
              <template v-if="Gid !== 31">
                <span>Pot：{{ one.payPot/1000 }}</span><br>
              </template>
              <span>输赢：{{ one.moneyChange/1000 }}</span><br>
              <span>机器人级别：{{ showRobotLevel(one.Character) }}</span><br>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="贴牌|点数"
        width="120"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.IsPoint">点数:{{ getPoint(scope.row.Contritube) }}</span>
          <div v-for="card in scope.row.Contritube" v-else class="block">
            <el-image
              style="width: 37px; height: 50px"
              :src="getCardUrl(card)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'TongitsGameLog',
  components: { },
  props: {
    GameLog: {
      type: Object,
      default: function() {
        return {}
      }
    },
    Gid: {
      type: Number,
      default: function() {
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
        0x01: '出牌',
        0x02: '放牌',
        0x04: '抓牌',
        0x08: '贴自己的牌',
        0x10: '吃牌',
        0x20: '贴牌',
        0x40: '发起比牌',
        0x80: '挑战发起的比牌',
        0x100: '比牌认输',
        0x200: '比牌燃烧',
        0x1000: '发牌',
        0x1001: '结算'
      },
      UidMap: {}
    }
  },
  watch: {
    'GameLog': {
      deep: true,
      handler: function(val) {
        this.initData(val)
      }
    },
    'Gid': {
      deep: true,
      handler: function(val) {
        this.Gid = val
      }
    },
    'GameLogVisible': {
      deep: true,
      handler: function(val) {
        this.ComponentsGameLogVisible = val
      }
    }
  },
  created() {
  },
  methods: {
    initData(val) {
      this.actions = []
      console.log('val===>', val)
      const stepArr = val.actionLogs.split('|')
      let stepIdx = 1
      this.UidMap = {}
      let uidIndex = 0
      for (let i = 0; i < stepArr.length; i++) {
        const detail = stepArr[i].split('-')
        if (detail.length !== 4) {
          Message.error('数据错误，不为4部分组合，原始值为：' + stepArr[i])
          return
        }
        const uid = parseInt(detail[0])
        const actionName = this.actionNames[parseInt(detail[1])]
        let cards = this.splitCards(detail[2]) // 牌值
        const contritube = this.splitCards(detail[3]) // 贴牌
        let handcards = []
        let idx = stepIdx
        let isPoint = false
        if (actionName !== '发牌' && actionName !== '结算') {
          stepIdx++
        }
        let resGroups = []
        if (actionName === '结算') {
          idx = idx + 1
          for (let j = 0; j < val.players.length; j++) {
            if (val.players[j].uid === uid) {
              cards = []
              let groups = []
              resGroups = []
              if (val.players[j].hasOwnProperty('groups')) {
                groups = val.players[j].groups
              }
              for (let k = 0; k < groups.length; k++) {
                const one = groups[k]
                one.isSecretGroup = this.isSecretGroup(one)
                const jokerMap = {}
                // 查找是否癞子代替
                if (one.hasOwnProperty('joker') && one.joker.replace.length > 0) {
                  for (let w = 0; w < one.joker.replace.length; w++) {
                    jokerMap[one.joker.replace[w]] = 0x02 // 癞子
                  }
                }
                for (let d = 0; d < one.cards.length; d++) {
                  if (jokerMap.hasOwnProperty(one.cards[d])) {
                    cards.push(0x02)
                  } else {
                    cards.push(one.cards[d])
                  }
                }
                resGroups.push(one)
              }
              handcards = val.players[j].handCards
            }
          }
          isPoint = true // contritube 代表结算时点数
        } else if (actionName == '发牌') {
          idx = 0
          if (uid < 1000000) {
            this.UidMap[uid] = val.players[uidIndex].uid
          }
          uidIndex++
        }
        const item = {
          Index: idx,
          Uid: this.getRealUid(uid),
          Action: actionName,
          Cards: cards,
          HandCards: handcards,
          Contritube: contritube,
          IsPoint: isPoint,
          IsFinished: false
        }
        if (resGroups.length > 0) {
          item.Groups = resGroups
        }
        this.actions.push(item)
      }
      const finishArray = []
      for (let j = 0; j < val.players.length; j++) {
        const one = val.players[j]
        finishArray.push({
          Uid: one.uid,
          Nick: one.nick,
          bonusCardMoney: val.players[j].bonusCardMoney,
          burnedMoney: val.players[j].burnedMoney,
          challengeMoney: val.players[j].challengeMoney,
          normalMoney: val.players[j].normalMoney,
          potMoney: val.players[j].potMoney,
          secretMeldMoney: val.players[j].secretMeldMoney,
          tongitsMoney: val.players[j].tongitsMoney,
          moneyChange: val.players[j].moneyChange,
          moneyFee: val.players[j].moneyFee,
          payPot: 0 - val.players[j].payPot,
          Character: val.players[j].character
        })
      }
      this.actions.push({
        Index: 9999,
        Uid: this.getRealUid(val.winUid),
        Action: '赢家',
        Cards: [],
        HandCards: [],
        Contirube: [],
        IsPoint: false,
        FinishArray: finishArray,
        IsFinished: true
      })
    },
    isSecretGroup(group) {
      if (group.groupId === 0) {
        if (group.cardType === 2 && !group.joker) { // 没有使用癞子
          return true
        } else if (group.cardType === 2 && group.joker && group.Joker.IsSecretGroup) { // 癞子5条以上
          return true
        } else if (group.cardType === 3 && !group.joker && group.cards.length >= 5) {
          return true
        } else if (group.cardType === 3 && group.joker && group.Joker.IsSecretGroup) {
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
    getCardUrl(card) {
      return require('@/assets/poker/' + card + '.png')
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
<style >
	.block{
		display:inline-table;
	}
	.block-info{
		display:inline-table;
		padding-left:10px;
	}
</style>
