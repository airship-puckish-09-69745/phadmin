<template>
  <el-dialog v-if="showGameLog.gid==117" title="GinRummy 详情" :visible.sync="showGameLog.visible" width="1300px">
    <el-descriptions class="margin-top" title="" :column="3" border size="mini">
      <el-descriptions-item>
        <template slot="label">前注：</template>
        {{ formatNumber(showGameLog.detail.tableMoney / 1000) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">结束原因：</template>
        {{ formatNumber(reasonOverMap[showGameLog.detail.reasonOver]) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">玩法：</template>
        {{ showGameLog.detail.playMode === 1 ? '单人模式' : '组队模式' }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">开始时间：</template>
        {{ formatTime(showGameLog.detail.startTime) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">结束时间：</template>
        {{ formatTime(showGameLog.detail.finishTime) }}
      </el-descriptions-item>
    </el-descriptions>
    <el-table
      :data="showGameLog.detail.actionLogs"
      border
      :row-style="getUserStyle"
      :header-cell-style="libShow.DefaultTableHeadClass"
      :cell-style="libShow.DefaultTableCell"
      size="mini"
    >
      <el-table-column label="Idx" width="50px">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="Uid" width="90px">
        <template slot-scope="scope">{{ scope.row.uid }}</template>
      </el-table-column>
      <el-table-column label="ActionType" width="90px">
        <template slot-scope="scope">{{ actionType[scope.row.actionType] }}</template>
      </el-table-column>
      <el-table-column label="SystemAction" width="90px">
        <template slot-scope="scope">{{ scope.row.isSystem ? "是" : "否" }}</template>
      </el-table-column>
      <el-table-column label="Cards">
        <template slot-scope="scope">
          <span v-for="(v,idx) in scope.row.cards ">
            <div style="position: relative; width: 37px; height: 50px;float: left">
              <!-- 显示卡片背景的图片 -->
              <el-image style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;"
                        :src="getCardBackgroundUrl(v)"
              />
              <!-- 显示卡片编号的图片并居中 -->
              <el-image v-if="v!==93&&v!==94"
                        style="position: absolute; top: 50%; left: 50%; width: 50%; height: 50%; z-index: 2; transform: translate(-50%, -50%);"
                        :src="getCardNumUrl(v)"
              />
            </div>
        </span>
        </template>
      </el-table-column>
      <el-table-column label="ActionTime" width="160px">
        <template slot-scope="scope">{{ formatTime(scope.row.actionTime) }}</template>
      </el-table-column>
    </el-table>

    <el-table
      :data="showGameLog.detail.players"
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :cell-style="libShow.DefaultTableCell"
      size="mini"
      style="margin-top: 10px"
    >

      <el-table-column label="最终结算">
        <el-table-column label="Uid">
          <template slot-scope="scope">{{ scope.row.uid }}</template>
        </el-table-column>
        <el-table-column label="Score">
          <template slot-scope="scope">{{ scope.row.cardsScore }}</template>
        </el-table-column>
        <el-table-column label="Winner">
          <template slot-scope="scope">{{ scope.row.isWin ? 'Win' : 'loss' }}</template>
        </el-table-column>
        <el-table-column label="Bet">
          <template slot-scope="scope">{{ scope.row.moneyBet / 1000 }}</template>
        </el-table-column>
        <el-table-column label="Won">
          <template slot-scope="scope">{{ scope.row.moneyWon / 1000 }}</template>
        </el-table-column>
        <el-table-column label="Taxed">
          <template slot-scope="scope">{{ scope.row.moneyTaxed / 1000 }}</template>
        </el-table-column>
        <el-table-column label="MoneySettle">
          <template slot-scope="scope">{{ scope.row.moneyChange / 1000 }}</template>
        </el-table-column>
        <el-table-column label="MoneyChange">
          <template slot-scope="scope">{{ (scope.row.moneyChange - scope.row.moneyBet) / 1000 }}</template>
        </el-table-column>
        <el-table-column label="MoneyCurrent">
          <template slot-scope="scope">{{ scope.row.moneyCur / 1000 }}</template>
        </el-table-column>
        <el-table-column label="Rank">
          <template slot-scope="scope">{{ scope.row.rank }}</template>
        </el-table-column>
      </el-table-column>
    </el-table>

  </el-dialog>

</template>
<script>

import {$libDate, $libShow} from "@/utils/common";

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'UnoLog',
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
      showGameLog: {},
      cardMap: {
        0: 2, // 梅花 0x01->>0x21
        1: 4, // 黑桃 0x11->>0x41
        2: 3, // 红桃 0x21->>0x31
        3: 1 //  方片  0x31->>0x11
      },
      reasonOverMap: {
        1: '牌局时间耗尽，无玩家出完所有手牌',
        2: ' 在牌局时间内，有玩家出完所有手牌',
      },
      UidMap: {},
      UidStyleMap: {},
      tableData: [],
      userInfo: {},
      ConversionColorMap: {},
      cardType: {},
      actionType: {
        1: '出牌',
        2: '摸牌',
        4: 'UNO',
        8: 'UNO 警告',
        16: '质疑',
        32: '保留牌',
        4096: '首发牌',
        4097: '结算剩余'
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
      let obj = JSON.parse(JSON.stringify(val))
      this.showGameLog = obj
      obj.detail.players.sort((a, b) => {
        return a.rank - b.rank
      })
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

    getCardNumUrl(card) {
      if (card === '' || card === '' || 0 || card === undefined) {
        return
      }
      let str = this.numberToHex(card)
      let s = str.charAt(str.length - 1);
      if (str === '5D') {
        return ''
      }
      if (str === '5E') {
        return ''
      }
      switch (s) {
        case 'A':
          return require('@/assets/uno/a.png')
        case 'B':
          return require('@/assets/uno/b.png')
        case 'C':
          return require('@/assets/uno/c.png')
        case 'D':
          return require('@/assets/uno/d.png')
        case 'E':
          return require('@/assets/uno/e.png')
        default:
          return require('@/assets/uno/' + s + '.png')
      }
    },
    getCardBackgroundUrl(card) {
      if (card === '' || card === '' || 0 || card === undefined) {
        return
      }
      let colorMap = {
        '1': 'blue',
        '2': 'yellow',
        '3': 'red',
        '4': 'green'
      }
      let str = this.numberToHex(card)

      if (str === '5D') {
        return require('@/assets/uno/5d.png')
      }
      if (str === '5E') {
        return require('@/assets/uno/5e.png')
      }
      let s = str.charAt(str.length - 2);
      switch (s) {
        case '1':
          return require('@/assets/uno/' + colorMap[s] + '.png')
        case '2':
          return require('@/assets/uno/' + colorMap[s] + '.png')
        case '3':
          return require('@/assets/uno/' + colorMap[s] + '.png')
        case '4':
          return require('@/assets/uno/' + colorMap[s] + '.png')
      }
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    numberToHex(number) {
      let s = number.toString(16).toUpperCase();
      return '' + s;
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
