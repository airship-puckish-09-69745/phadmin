<template>
  <div class="app-container">
     <el-row>
      <el-form :model="searchForm" label-width="90px" :inline="true" size="small">
        <el-form-item label="">
          <el-form-item label="">
            <el-date-picker
              v-model="searchForm.dateTime"
              value-format="timestamp"
              type="date"
              placeholder="选择时间"
            />
          </el-form-item>
          <el-form-item label="牌局id">
            <el-input v-model.number="searchForm.SrvLogId" size="mini" placeholder="牌局id" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="getDetail">查询</el-button>
          </el-form-item>
        </el-form-item>
      </el-form>
    </el-row>
    <ul :span="5" v-for="item in roundInfo" :key="item.id" >
       <template>
        <el-card style="border-bottom: 0px;width: 60%">
          <template #header>
            <div :data="item" class="card-header">
              <el-row>
                <div>
                    {{ getRoundName(item[0].Round) }}
                </div>
                <div style="align-items: center;justify-content: center;display: flex;">
                  <el-image v-for="(imageItem, index) in getPublishCard(item)" :key="index" :src="imageItem" :preview-src-list="[imageItem]"  style="width: 32px; height: 48px">
                  </el-image>
                </div>
              </el-row>
            </div>
          </template>
          <el-table :data="getStepInfo(item)" :show-header="false" style="--el-table-border-color: none;">
            <el-table-column margin-right= "1px">
              <template slot-scope="scope">
                {{ getRoleByUid(scope.row.Uid) }}
              </template>
            </el-table-column>
            <el-table-column margin-left= "1px">
              <template slot-scope="scope">
                {{ getNickByUid(scope.row.Uid) }}
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-image v-for="(item, index) in getHdCardByUid(scope.row.Uid)" :key="index" :src="item" :preview-src-list="[item]"  style="width: 32px; height: 48px">
                </el-image>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                {{ getActByUid(scope.row.Act) }}
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                {{ getBetByUid(scope.row.Bet) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card :data="item" border-top="0px" style="align-items: center;justify-content: center;display: flex;border-top: 0px;width: 60%">
          {{ getRoundPot(item) }}
        </el-card>
      </template>
    </ul>

    <ul :span="6" v-if="userInfo.length!==0">
      <el-card border-bottom="0px" style="width: 60%">
         <template #header>
            <div class="card-header">
              <el-row>
                <div>
                  {{ getRoundName(0) }}
                </div>
              </el-row>
            </div>
          </template>
        <el-table :data="userInfo" :show-header="false" style="--el-table-border-color: none;">
          <el-table-column margin-right= "1px">
            <template slot-scope="scope">
              {{ getRoleByUid(scope.row.Uid) }}
            </template>
          </el-table-column>
          <el-table-column margin-left= "1px">
            <template slot-scope="scope">
              {{ getNickByUid(scope.row.Uid) }}
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-image v-for="(item, index) in getHdCardByUid(scope.row.Uid)" :key="index" :src="item" :preview-src-list="[item]"  style="width: 32px; height: 48px">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column>
            <template>
              <el-image v-for="(item, index) in showCards(publishCards)" :key="index" :src="item" :preview-src-list="[item]"  style="width: 32px; height: 48px">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              {{ scope.row.TurnMoney/1000 }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card border-top="0px" style="align-items: center;justify-content: center;display: flex;border-top: 0px;width: 60%">
        {{ getPot() }}
      </el-card>
    </ul>
  </div>
</template>
<script>
import { $libDate } from '@/utils/common'
import request from '@/utils/request'
import { Message } from 'element-ui'

export default {
  name: 'RocketRet',
  data() {
    console.log('begin data')
    return {
      searchForm: {
        SrvLogId: '',
        dateTime: $libDate.GetDayBegin(new Date().getTime())
      },
      userInfo: [],
      roundInfo: [],
      publishCards: [],
      pots: [],
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
        19: 'FORCED_BB'
      },
      RoundName: {
        0: 'Showdown',
        1: 'Preflop',
        2: 'Flop',
        3: 'Turn',
        4: 'River'
      }
    }
  },
  activated() {
    if (Number(this.$route.query.SrvLogId) > 0 && Number(this.$route.query.dateTime) > 0) {
      this.searchForm.SrvLogId = this.$route.query.SrvLogId
      this.searchForm.dateTime = $libDate.GetDayBegin(this.$route.query.dateTime * 1000)
      
      this.userInfo = []
      this.roundInfo = []
      this.publishCards = []
      this.pots = []

      this.getDetail()
    }
  },
  created() {
  },
  methods: {
    getDetail() {
      console.log(this.searchForm)
      const _this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/texasnlhdata/gamelog',
          srvLogId: Number(_this.searchForm.SrvLogId),
          dateTime: Date.parse(new Date(_this.searchForm.dateTime).toString()) / 1000
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const obj = response.Data || {}
          console.log(obj)
          for (var i = 0; i < obj.list.length; i++) {
            _this.userInfo = obj.list[i].Players
            _this.publishCards = obj.list[i].AllPublishCards
            _this.pots = obj.list[i].Pots
            _this.dealStepInfo(obj.list[i].StepInfo)
          }
        } else {
          Message.error(response.Data)
        }
      })
    },
    dealStepInfo(stepinfo) {
      var curRound = 0
      var cruRoundInfo = []
      for (var i = 0; i < stepinfo.length; i++) {
        if (stepinfo[i].Round > curRound) {
          if (cruRoundInfo.length > 0) {
            this.roundInfo.push(cruRoundInfo)
            cruRoundInfo = []
          }
        }
        curRound = stepinfo[i].Round
        cruRoundInfo.push(stepinfo[i])
      }
      this.roundInfo.push(cruRoundInfo)
    },
    getRoundName(round) {
      return this.RoundName[round]
    },
    getStepInfo(item) {
      var stepInfo = []
      for (var i = 0; i < item.length; i++) {
        if (item[i].StepType !== 0) {
          continue
        }
        stepInfo.push(item[i])
      }
      return stepInfo
    },
    getPublishCard(item) {
      for (var i = 0; i < item.length; i++) {
        if (item[i].StepType !== 2) {
          continue
        }
        return this.showCards(item[i].PublishCards)
      }
    },
    getRoundPot(item) {
      for (var i = 0; i < item.length; i++) {
        if (item[i].StepType !== 1) {
          continue
        }
        return 'POT: ' + item[i].Pot / 1000
      }
    },
    getPot() {
      var pot = 0
      for (var i = 0; i < this.pots.length; i++) {
        pot += this.pots[i].Pots
      }
      return 'POT: ' + pot/1000
    },
    getRoleByUid(uid) {
      for (var i = 0; i < this.userInfo.length; i++) {
        if (this.userInfo[i].Uid !== uid) {
          continue
        }
        if (this.userInfo[i].Role === 1) {
          return '{SB}'
        } else if (this.userInfo[i].Role === 2) {
          return '{BB}'
        } else if (this.userInfo[i].Role === 3) {
          return '{D}'
        } else {
          return ''
        }
      }
    },
    getNickByUid(uid) {
      for (var i = 0; i < this.userInfo.length; i++) {
        if (this.userInfo[i].Uid !== uid) {
          continue
        }
        return '玩家: ' + this.userInfo[i].Nick
      }
    },
    getActByUid(act) {
      return this.ActName[act]
    },
    getBetByUid(bet) {
      if (bet > 0) {
        return 'P(' + Number(bet) / 1000 + ')'
      } else {
        return ''
      }
    },
    getHdCardByUid(uid) {
      for (var i = 0; i < this.userInfo.length; i++) {
        if (this.userInfo[i].Uid !== uid) {
          continue
        }
        return this.showCards(this.userInfo[i].HandCards)
      }
    },
    showCards(cardInfo) {
      var cardList = []
      for (var i = 0; i < cardInfo.length; i++) {
        cardList.push(this.getCardUrl(cardInfo[i]))
      }
      return cardList
    },
    getCardUrl(card) {
      return require('@/assets/poker_texas2d/' + card + '_card.png')
    }
  }
}
</script>
