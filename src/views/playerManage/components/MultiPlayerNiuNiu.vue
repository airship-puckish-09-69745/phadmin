<template>
  <el-dialog
    title="MultiPlayerNiuNiu详情"
    :visible.sync="ComponentsGameLogVisible"
    :before-close="closeView"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="1200px"
  >
    <el-descriptions class="margin-top" title="" :column="3" border>
      <el-descriptions-item>
        <template slot="label">
          前注：
        </template>
        {{ formatNumber(GameLog.Bet / 1000) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          开始时间：
        </template>
        {{ formatTime(GameLog.StartTime ) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          结束时间：
        </template>
        {{ formatTime(GameLog.FinishTime ) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          输赢：
        </template>
        {{ formatNumber(getMoneyWon() / 1000) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          庄家牌组：
        </template>
        <span v-for="(k,v) in base64ToUint8Array(GameLog.NiuNiu.bankerCardInfo.cards)">
          <el-image
            style="width: 37px; height: 50px"
            :src="getCardUrl(cardConversionColor(k,'2-2','4-4','3-3','1-1'))"
          />
        </span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          庄家牌型：
        </template>
        {{ CardTypeNames[GameLog.NiuNiu.bankerCardInfo.cardType] }} （倍率：{{ GameLog.NiuNiu.bankerCardInfo.odds /1000 }}）
      </el-descriptions-item>
    </el-descriptions>
    <el-table :data="GameLog.NiuNiu.areas" border :header-cell-style="{'text-align':'center'}" :row-style="getHitStyle">
      <el-table-column label="区域ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="区域名称">
        <template slot-scope="scope">{{ getOptionName(scope.row.id) }}</template>
      </el-table-column>
      <el-table-column label="区域牌组" width="230">
        <template slot-scope="scope">
          <span v-for="(k,v) in base64ToUint8Array(scope.row.cardInfo.cards)">
            <el-image
              style="width: 37px; height: 50px"
              :src="getCardUrl(cardConversionColor(k,'2-2','4-4','3-3','1-1'))"
            />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="区域牌型">
        <template slot-scope="scope">{{ CardTypeNames[scope.row.cardInfo.cardType] }}</template>
      </el-table-column>
      <el-table-column label="命中">
        <template slot-scope="scope">{{ scope.row.isHit ==0?'否':'是' }}</template>
      </el-table-column>
      <el-table-column label="倍率">
        <template slot-scope="scope">{{ scope.row.cardInfo.odds /1000 }}</template>
      </el-table-column>
      <el-table-column label="区域累计下注">
        <template slot-scope="scope">{{ formatNumber(scope.row.moneyBet /1000) }}</template>
      </el-table-column>
    </el-table>
    <el-table :data="GameLog.NiuNiu.players" border :header-cell-style="{'text-align':'center'}">
      <el-table-column prop="uid" label="UID" width="80px">
        <template slot-scope="scope">{{ scope.row.uid }}</template>
      </el-table-column>
      <el-table-column prop="uid" label="下注金额" width="80px">
        <template slot-scope="scope">{{ formatNumber(scope.row.moneyBet /1000) }}</template>
      </el-table-column>
      <el-table-column prop="uid" label="当前金额" width="80px">
        <template slot-scope="scope">{{ formatNumber(scope.row.moneyEnd /1000) }}</template>
      </el-table-column>
      <el-table-column prop="uid" label="下注前金额" width="100px">
        <template slot-scope="scope">{{ formatNumber(scope.row.moneyOrigin /1000 ) }}</template>
      </el-table-column>
      <el-table-column prop="uid" label="输赢" width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.moneyWon>0" style="color: red">
            {{ formatNumber( scope.row.moneyWon /1000) }}
          </span>
          <span v-else style="color: green">
            {{ formatNumber( scope.row.moneyWon /1000) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="uid" label="下注详情" width="auto">
        <template slot-scope="scope">
          <el-table :data="scope.row.betAreas" border :row-style="getHitStyle">
            <el-table-column label="区域ID">
              <template slot-scope="scope2">{{ scope2.row.id }}</template>
            </el-table-column>
            <el-table-column label="区域名称">
              <template slot-scope="scope2">{{ getOptionName(scope2.row.id) }}</template>
            </el-table-column>
            <el-table-column label="下注金额">
              <template slot-scope="scope2">{{ formatNumber(scope2.row.moneyBet /1000) }}</template>
            </el-table-column>
            <el-table-column label="命中">
              <template slot-scope="scope2">{{ scope2.row.isHit==0?'否':'是' }}</template>
            </el-table-column>
            <el-table-column label="区域输赢">
              <template slot-scope="scope2">{{ formatNumber(scope2.row.moneyWon /1000) }}</template>
            </el-table-column>
            <el-table-column label="倍率">
              <template slot-scope="scope2">{{ scope2.row.cardInfo.odds /1000 }}</template>
            </el-table-column>
            <el-table-column label="Jackpot">
              <template slot-scope="scope2">{{ scope2.row.cardInfo.jackpot ? scope2.row.cardInfo.jackpot.award : 0 }}</template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { $libDate } from '@/utils/common'

export default {
  name: 'MultiPlayerNiuNiuDetailLog',
  components: {},
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
      CardTypeNames: {
        0: '无牛',
        1: '牛一',
        2: '牛二',
        3: '牛三',
        4: '牛四',
        5: '牛五',
        6: '牛六',
        7: '牛七',
        8: '牛八',
        9: '牛九',
        10: '牛牛',
        11: '四花',
        12: '五花',
        13: '四条',
        14: '五小'
      },
      BetOptions: [
        { Id: 0, Name: 'Luzon' },
        { Id: 1, Name: 'Mindanao' },
        { Id: 2, Name: 'Samar' },
        { Id: 3, Name: 'Negros' }
      ],
      ConversionColorMap: {}
    }
  },
  watch: {
    'GameLog': {
      deep: true,
      handler: function(val) {
        this.GameLog = val
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
        console.log('GameLogVisible', val)
        this.ComponentsGameLogVisible = val
      }
    }
  },
  created() {
    this.ComponentsGameLogVisible = this.GameLogVisible
  },
  methods: {
    getHitStyle({ row }) {
      if (row.isHit) {
        return { color: 'red' }
      }
      return {}
    },
    getOptionName(optionId) {
      for (let i = 0; i < this.BetOptions.length; i++) {
        if (this.BetOptions[i].Id === optionId) {
          return this.BetOptions[i].Name
        }
      }
      return ''
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    getMoneyWon() {
      let moneyWon = 0
      this.GameLog.NiuNiu.players.map((item) => {
        moneyWon += item.moneyWon
      })
      return moneyWon
    },
    closeView(done) {
      this.$emit('closeDialog')
      done()
    },
    getCardUrl(card) {
      return require('@/assets/poker/' + card + '.png')
    },
    cardConversionColor(num, meihua, heitao, hongtao, fangkuai) {
      // 要转换的颜色-转换后的颜色  梅花:?-2,黑桃:?-4,红桃:?-3,方块:?-1
      if (num === 0 || num === 'NaN' || num === 'undefined' || num === undefined) {
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
      const result = '0x' + this.ConversionColorMap[s[0]] + s[1]

      return parseInt(result)
    },
    base64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4)
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/')

      const rawData = atob(base64)
      const rawDataLength = rawData.length
      const array = new Uint8Array(new ArrayBuffer(rawDataLength))

      for (let i = 0; i < rawDataLength; i++) {
        array[i] = rawData.charCodeAt(i)
      }
      return array
    }
  }
}
</script>

<style scoped>

</style>
