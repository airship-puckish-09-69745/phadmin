<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="'CustomizeCfg_' + subKey" :env-empty="false" compare-type="Object"
        :attr-names="AttrNames" />
    </el-row>
    <el-col v-if="version === 'V2'" :span="20">
      <el-select v-model="appId" placeholder="请选择" @change="onAppIdChange">
        <el-option v-for="(o,idx) in appInfos" :key="idx" :label="o.Account" :value="o.ID" />
      </el-select>
      <el-button type="primary" icon="el-icon-document-copy" @click="onCopyAllCfg">
        复制配置
      </el-button>
    </el-col>
    <el-col :span="21" :offset="1">
      <el-row>
        <el-divider content-position="left">新手配置</el-divider>
        <el-descriptions class="margin-top" :column="4" size="medium"
          :label-style="{ 'text-align': 'right', 'font-weight': 'bold', 'padding': '5px' }" border>
          <el-descriptions-item label="总下注额(放大1000倍)">
            <el-input v-model.number="cfgData.Newbie.TotalBet" size="mini" />
          </el-descriptions-item>
          <el-descriptions-item label="任务一占比">
            <el-input v-model.number="cfgData.Newbie.Mission1Rate" size="mini">
              <template slot="append">%</template>
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item label="任务二占比">
            <el-input v-model.number="cfgData.Newbie.Mission2Rate" size="mini">
              <template slot="append">%</template>
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item label="任务三占比">
            <el-input v-model.number="cfgData.Newbie.Mission3Rate" size="mini">
              <template slot="append">%</template>
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item label="增长保底系数(放大100倍)">
            <el-input v-model.number="cfgData.Newbie.RiseRateMin" size="mini" />
          </el-descriptions-item>
          <el-descriptions-item label="难度系数(放大100倍)">
            <el-input v-model.number="cfgData.Newbie.Degree" size="mini" />
          </el-descriptions-item>

        </el-descriptions>
      </el-row>

      <el-divider content-position="left">老用户配置</el-divider>
      <el-row>
        <el-descriptions class="margin-top" :column="4" size="medium"
          :label-style="{ 'text-align': 'right', 'font-weight': 'bold', 'padding': '5px' }" border>

          <el-descriptions-item label="总下注额(放大1000倍)">
            <el-input v-model.number="cfgData.Normal.TotalBet" size="mini" />
          </el-descriptions-item>
          <el-descriptions-item label="任务一占比">
            <el-input v-model.number="cfgData.Normal.Mission1Rate" size="mini">
              <template slot="append">%</template>
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item label="任务二占比">
            <el-input v-model.number="cfgData.Normal.Mission2Rate" size="mini">
              <template slot="append">%</template>
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item label="任务三占比">
            <el-input v-model.number="cfgData.Normal.Mission3Rate" size="mini">
              <template slot="append">%</template>
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item label="任务二小于2000时最小下注(放大1000倍) >=">
            <el-input v-model.number="cfgData.Normal.Mission2BetMinSmall" size="mini" />
          </el-descriptions-item>
          <el-descriptions-item label="任务二大于等于2000时最小下注(放大1000倍) >=">
            <el-input v-model.number="cfgData.Normal.Mission2BetMinBig" size="mini" />
          </el-descriptions-item>
          <el-descriptions-item label="任务三小于2000时最小下注(放大1000倍) >=">
            <el-input v-model.number="cfgData.Normal.Mission3BetMinSmall" size="mini" />
          </el-descriptions-item>
          <el-descriptions-item label="任务三大于等于2000时最小下注(放大1000倍) >=">
            <el-input v-model.number="cfgData.Normal.Mission3BetMinBig" size="mini" />
          </el-descriptions-item>
          <el-descriptions-item label="增长保底系数(放大100倍)">
            <el-input v-model.number="cfgData.Normal.RiseRateMin" size="mini" />
          </el-descriptions-item>
          <el-descriptions-item label="增长上限系数(放大100倍)">
            <el-input v-model.number="cfgData.Normal.RiseRateMax" size="mini" />
          </el-descriptions-item>
          <el-descriptions-item label="难度系数(放大100倍)">
            <el-input v-model.number="cfgData.Normal.Degree" size="mini" />
          </el-descriptions-item>

        </el-descriptions>
      </el-row>

      <el-row>
        <el-divider content-position="left">富裕卡配置</el-divider>
        <el-table ref="filterTable" :data="cfgData.RichCardList" stripe border
          :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{ height: '10px' }"
          :cell-style="libShow.DefaultTableCell" style="width: 100%">
          <el-table-column prop="RichCardLevel" label="星级" width="80" />
          <el-table-column prop="BetMin" label="最小下注(放大1000倍)" width="200">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.BetMin" size="mini" />
            </template>
          </el-table-column>

          <el-table-column prop="BetMax" label="最大下注(放大1000倍)" width="200">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.BetMax" size="mini" />
            </template>
          </el-table-column>

          <el-table-column prop="BetList" label="下注列表,例如 0.5,1,2,5">
            <template slot-scope="scope">
              <el-input v-model="scope.row.BetList" size="mini" />
            </template>
          </el-table-column>

          <el-table-column prop="RtpRate" label="返奖RTP" width="200">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.RtpRate" size="mini">
                <template slot="append">‱</template>
              </el-input>
            </template>
          </el-table-column>

        </el-table>
      </el-row>

      <el-row>
        <el-divider content-position="left">游戏配置</el-divider>
        <el-table ref="filterTable" :data="cfgData.BuyFreeList" stripe border
          :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{ height: '10px' }"
          :cell-style="libShow.DefaultTableCell" style="width: 100%">

          <el-table-column prop="SlotsType" label="游戏ID" width="80" />
          <el-table-column prop="GameNames" label="游戏名称" width="180">
            <template slot-scope="scope">
              {{ gameName(scope.row.SlotsType) }}
            </template>
          </el-table-column>

          <el-table-column prop="Open" label="开启" width="80">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.Open"></el-checkbox>
            </template>
          </el-table-column>

          <el-table-column prop="BuyFreeRtpRate" label="购买免费旋转RTP" width="200">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.BuyFreeRtpRate" size="mini">
                <template slot="append">‱</template>
              </el-input>
            </template>
          </el-table-column>

          <el-table-column prop="BetRequiredOdds" label="余额需要Bet倍数" width="180">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.BetRequiredOdds" size="mini"/>
            </template>
          </el-table-column>

        </el-table>
      </el-row>

    </el-col>

    <el-col :offset="1" :span="8" style="margin-top: 10px;">
      <el-button type="primary" @click="setData">保存</el-button>
    </el-col>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libShow, $libType } from '@/utils/common'
import {createCustomize, getCustomize, updateCustomize} from "@/api/custome_configV2";
import store from "@/store";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      games: [],
      options: [],
      cfgData: {
        Newbie: {
          TotalBet: 0,
          Mission1Rate: 0,
          Mission2Rate: 0,
          Mission3Rate: 0,
          Degree: 0
        },
        Normal: {
          TotalBet: 0,
          Mission1Rate: 0,
          Mission2Rate: 0,
          Mission3Rate: 0,
          Degree: 0
        },
        RichCardList: [
        ]
      },
      form: {},
      libShow: $libShow,
      subKey: 'slotsmission',

      AttrNames: {
        'Data': '索引',
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      appInfos: [
        { ID: 0, Account: '旧版' }
      ],
      appId: store.getters.appId || 0,
      version: store.getters.version || 'V1',
      bCreateCfg: false
    }
  },
  created() {
    this.loadData()
    this.getAppInfos()
  },
  methods: {
    async loadData() {
      try {
        // 先执行 getGameList，等待其完成
        await this.getGameList()
        // 再执行 getData
        await this.getData()
      } catch (error) {
        console.error('Error loading data:', error)
      }
    },
    gameName(slotsType) {
      return $libShow.GameNames[slotsType]
    },
    getData() {
      const $this = this
      getCustomize($this.subKey, $this.appId).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || { Data: '{}' }
          // console.log('$this.form', $this.form)
          const o = JSON.parse(this.form.Data)

          for (const k in o.RichCardList) {
            const betList = []
            for (const i in o.RichCardList[k].Bets) {
              betList[i] = o.RichCardList[k].Bets[i] / 1000
            }
            o.RichCardList[k].BetList = betList.join(',')
          }

          const buyFreeMap = {}
          const openGames = {}
          const betRequiredMap = {}
          for (const k in o.BuyFreeList) {
            buyFreeMap[o.BuyFreeList[k].SlotsType] = o.BuyFreeList[k].BuyFreeRtpRate
            openGames[o.BuyFreeList[k].SlotsType] = o.BuyFreeList[k].Open
            betRequiredMap[o.BuyFreeList[k].SlotsType] = o.BuyFreeList[k].BetRequiredOdds
          }
          // console.log(buyFreeMap)
          o.BuyFreeList = []
          // const buyFreeList = [];
          for (const k in this.games) {
            let rate = 0
            if (buyFreeMap[this.games[k]] !== undefined) {
              rate = buyFreeMap[this.games[k]]
            }
            o.BuyFreeList.push({ "SlotsType": this.games[k], "Open": openGames[this.games[k]], "BuyFreeRtpRate": rate, "BetRequiredOdds": betRequiredMap[this.games[k]] })
          }

          this.cfgData = o

          // 设置修改之前数据
          this.$refs.compare.SetOldVal(this.form)
        } else {
          if (store.getters.appId === this.appId) {
            this.bCreateCfg = true
            console.log('this.bCreateCfg', this.bCreateCfg)
          }
        }
      })
    },
    setData() {
      const newbie = this.cfgData.Newbie.Mission1Rate + this.cfgData.Newbie.Mission2Rate + this.cfgData.Newbie.Mission3Rate
      const normal = this.cfgData.Normal.Mission1Rate + this.cfgData.Normal.Mission2Rate + this.cfgData.Normal.Mission3Rate
      if (newbie !== 100) {
        Message.error('新手任务总占比必须等于100%')
        return
      }
      if (normal !== 100) {
        Message.error('老用户任务总占比必须等于100%')
        return
      }

      const postData = $libType.DeepCopy(this.cfgData)

      for (const k in postData.RichCardList) {
        const bets = postData.RichCardList[k].BetList.split(',')
        postData.RichCardList[k].Bets = []
        for (const i in bets) {
          postData.RichCardList[k].Bets.push(parseFloat(bets[i]) * 1000)
        }
      }
      // console.log('postData', postData)

      this.form.Data = JSON.stringify(postData)
      if (this.bCreateCfg) {
        this.form.AppId = store.getters.appId
        this.form.RedisSubkey = this.subKey
        this.form.Name = 'Slots任务配置'
        this.form.Description = 'Slots任务配置'
        this.form.Type = 1
        createCustomize(this.form).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功！')
          }
        })
      } else {
        const $this = this
        // 设置修改后数据
        this.$refs.compare.SetNewVal(this.form)
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          }
          updateCustomize($this.form).then(response => {
            if (response.RetCode === 0) {
              Message.success('保存成功')
            }
          })
        })
      }
    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Gid < 50 || response.Data[i].Gid >= 100 && response.Data[i].Gid < 150 || response.Data[i].Gid > 499) {
              continue
            }
            this.games.push(response.Data[i].Gid)
            this.options.push({ 'label': $libShow.GameNames[response.Data[i].Gid], 'value': response.Data[i].Gid })
          }
          this.games.sort(function(a, b) {
            return a - b
          })
          this.options.sort(function(a, b) {
            return a.value - b.value
          })
        }
        console.log('getGameList')
      })
    },
    getAppInfos() {
      request({
        url: '/thirdparties/apps',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Status !== 2) {
              continue
            }
            this.appInfos.push({
              ID: response.Data[i].ID,
              Account: response.Data[i].ID + '-' + response.Data[i].Account
            })
          }
        }
      })
    },
    onAppIdChange() {
      if (this.appId === 0) {
        const $this = this
        request({
          url: '/customizeconfig/one',
          method: 'get',
          data: {
            SubKey: this.subKey
          }
        }).then(response => {
          $this.form = response.Data || { Data: '{}' }
          // console.log('$this.form', $this.form)
          const o = JSON.parse(this.form.Data)

          for (const k in o.RichCardList) {
            const betList = []
            for (const i in o.RichCardList[k].Bets) {
              betList[i] = o.RichCardList[k].Bets[i] / 1000
            }
            o.RichCardList[k].BetList = betList.join(',')
          }

          const buyFreeMap = {}
          const openGames = {}
          const betRequiredMap = {}
          for (const k in o.BuyFreeList) {
            buyFreeMap[o.BuyFreeList[k].SlotsType] = o.BuyFreeList[k].BuyFreeRtpRate
            openGames[o.BuyFreeList[k].SlotsType] = o.BuyFreeList[k].Open
            betRequiredMap[o.BuyFreeList[k].SlotsType] = o.BuyFreeList[k].BetRequiredOdds
          }
          o.BuyFreeList = []
          for (const k in this.games) {
            let rate = 0
            if (buyFreeMap[this.games[k]] !== undefined) {
              rate = buyFreeMap[this.games[k]]
            }
            o.BuyFreeList.push({ "SlotsType": this.games[k], "Open": openGames[this.games[k]], "BuyFreeRtpRate": rate, "BetRequiredOdds": betRequiredMap[this.games[k]] })
          }

          this.cfgData = o
        })
      } else {
        this.getData()
      }
    },
    onCopyAllCfg() {
      this.setData()
      this.bCreateCfg = false
    }
  }
}
</script>
