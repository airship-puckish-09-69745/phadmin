<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="'CustomizeCfg_' + subKey" :env-empty="false" compare-type="Object"
        :attr-names="AttrNames" />
    </el-row>
    <el-col v-if="version === 'V2'" :span="20">
      <el-select v-model="appId" placeholder="请选择" @change="onAppIdChange">
        <el-option v-for="(o,idx) in appOptions" :key="idx" :label="o.label" :value="o.value" />
      </el-select>
      <el-button type="primary" icon="el-icon-document-copy" @click="onCopyAllCfg">
        复制配置
      </el-button>
      <el-button type="primary" icon="el-icon-document-copy" @click="onCopyMultiAppCfg">
        多App复制
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

    <!-- 多应用选择弹窗 -->
    <multi-app-select-dialog
      :visible.sync="multiAppDialogVisible"
      :app-options="appOptions"
      :checked-keys.sync="checkedAppKeys"
      :confirm-text="multiAppAction === 'copy' ? '确认复制' : '确认保存'"
      @confirm="confirmMultiAppSave"
    />

    <el-col :offset="1" :span="8" style="margin-top: 10px;">
      <el-button type="primary" @click="setData">保存</el-button>
      <el-button v-if="version === 'V2'" type="primary" @click="onMultiAppSaveClick">多APP保存</el-button>
    </el-col>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import MultiAppSelectDialog from '@/components/Publish/MultiAppSelectDialog'
import request from '@/utils/request'
import {$libShow, $libType, ValidateVueItem} from '@/utils/common'
import {createCustomize, getCustomize, updateCustomize} from "@/api/custome_configV2";
import store from "@/store";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { MultiAppSelectDialog, Compare, Publish },
  data() {
    return {
      games: [],
      gameNames: {},
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
      appOptions: [
        { value: 0, label: '旧版' }
      ],
      appId: store.getters.appId || 0,
      version: store.getters.version || 'V1',
      multiAppDialogVisible: false,
      appTreeData: [],
      checkedAppKeys: [],
      selectAllNodeKey: 'all',
      diffData: {},
      multiAppAction: 'save'
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
      return this.gameNames[slotsType]
    },
    getDefaultCfgData() {
      return {
        Newbie: {
          TotalBet: 0,
          Mission1Rate: 0,
          Mission2Rate: 0,
          Mission3Rate: 0,
          RiseRateMin: 0,
          Degree: 0
        },
        Normal: {
          TotalBet: 0,
          Mission1Rate: 0,
          Mission2Rate: 0,
          Mission3Rate: 0,
          Mission2BetMinSmall: 0,
          Mission2BetMinBig: 0,
          Mission3BetMinSmall: 0,
          Mission3BetMinBig: 0,
          RiseRateMin: 0,
          RiseRateMax: 0,
          Degree: 0
        },
        RichCardList: [],
        BuyFreeList: this.games.map(slotsType => ({
          SlotsType: slotsType,
          Open: false,
          BuyFreeRtpRate: 0,
          BetRequiredOdds: 0
        }))
      }
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
          this.form = {}
          this.cfgData = this.getDefaultCfgData()
          if (this.$refs.compare) {
            this.$refs.compare.SetOldVal({
              Data: JSON.stringify(this.getPostData())
            })
          }
        }
      })
    },
    buildSavePayload() {
      const payload = JSON.parse(JSON.stringify(this.form || {}))
      payload.Data = JSON.stringify(this.getPostData())
      if (!payload.ID) {
        payload.AppId = this.appId || store.getters.appId
        payload.RedisSubkey = this.subKey
        payload.Name = payload.Name || 'Slots任务配置'
        payload.Description = payload.Description || 'Slots任务配置'
        payload.Type = payload.Type || 1
      }
      return payload
    },
    setData() {
      if (!this.checkData()) {
        return Promise.resolve()
      }

      const savePayload = this.buildSavePayload()
      if (!savePayload.ID) {
        return createCustomize(savePayload).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功！')
            this.form = response.Data || savePayload
            this.$refs.compare.SetOldVal(this.form)
          }
        })
      } else {
        const $this = this
        // 设置修改后数据
        this.$refs.compare.SetNewVal(savePayload)
        return this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          }
          return updateCustomize(savePayload).then(response => {
            if (response.RetCode === 0) {
              Message.success('保存成功')
              $this.form = savePayload
              $this.$refs.compare.SetOldVal(savePayload)
            }
          })
        })
      }
    },
    checkData() {
      const newbie = this.cfgData.Newbie.Mission1Rate + this.cfgData.Newbie.Mission2Rate + this.cfgData.Newbie.Mission3Rate
      const normal = this.cfgData.Normal.Mission1Rate + this.cfgData.Normal.Mission2Rate + this.cfgData.Normal.Mission3Rate
      if (newbie !== 100) {
        Message.error('新手任务总占比必须等于100%')
        return false
      }
      if (normal !== 100) {
        Message.error('老用户任务总占比必须等于100%')
        return false
      }
      return true
    },
    getPostData() {
      const postData = $libType.DeepCopy(this.cfgData)

      for (const k in postData.RichCardList) {
        const bets = postData.RichCardList[k].BetList.split(',')
        postData.RichCardList[k].Bets = []
        for (const i in bets) {
          postData.RichCardList[k].Bets.push(parseFloat(bets[i]) * 1000)
        }
      }
      return postData
    },
    getGameList() {
      return request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const games = []
          const gameNames = {}
          const options = []
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Gid < 50 || response.Data[i].Gid >= 100 && response.Data[i].Gid < 150 || response.Data[i].Gid > 499) {
              continue
            }
            games.push(response.Data[i].Gid)
            gameNames[response.Data[i].Gid] = response.Data[i].Name
            options.push({ 'label': response.Data[i].Name, 'value': response.Data[i].Gid })
          }
          games.sort(function(a, b) {
            return a - b
          })
          options.sort(function(a, b) {
            return a.value - b.value
          })
          this.games = games
          this.gameNames = gameNames
          this.options = options
        }
        console.log('getGameList')
      })
    },
    getAppInfos() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Status !== 2) {
              continue
            }
            this.appOptions.push({
              value: response.Data[i].ID,
              label: response.Data[i].ID + '-' + response.Data[i].Account
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
      if (!this.checkData()) {
        return false
      }
      createCustomize(this.buildCopyPayload(store.getters.appId)).then(response => {
        if (response.RetCode === 0) {
          Message.success('配置复制成功！')
        } else {
          const errMsg = response.Data ? (typeof response.Data === 'string' ? response.Data : JSON.stringify(response.Data)) : ''
          Message.error(`配置复制失败！${errMsg ? '：' + errMsg : ''}`)
        }
      })
    },
    onCopyMultiAppCfg() {
      this.prepareAppTree()
      this.multiAppAction = 'copy'
      this.multiAppDialogVisible = true
    },
    // 计算当前应用原数据与修改后的数据之间的差异
    getDifferenceBetweenConfigs(originalData, modifiedData) {
      if (Array.isArray(modifiedData)) {
        if (JSON.stringify(originalData) !== JSON.stringify(modifiedData)) {
          return JSON.parse(JSON.stringify(modifiedData))
        }
        return []
      }
      const diff = {}
      for (const key in modifiedData) {
        if (!modifiedData.hasOwnProperty(key)) continue
        if (Array.isArray(modifiedData[key])) {
          if (JSON.stringify(originalData[key]) !== JSON.stringify(modifiedData[key])) {
            diff[key] = JSON.parse(JSON.stringify(modifiedData[key]))
          }
        } else if (typeof modifiedData[key] === 'object' && modifiedData[key] !== null) {
          if (typeof originalData[key] !== 'object' || originalData[key] === null) {
            diff[key] = modifiedData[key]
          } else {
            const nestedDiff = this.getDifferenceBetweenConfigs(originalData[key], modifiedData[key])
            if (Object.keys(nestedDiff).length > 0) {
              diff[key] = nestedDiff
            }
          }
        } else {
          if (modifiedData[key] !== originalData[key]) {
            console.log('不同', key, modifiedData[key])
            diff[key] = modifiedData[key]
          }
        }
      }

      return diff
    },
    async saveDifferenceToOtherApps(appIds, diffData) {
      for (const appId of appIds) {
        // 获取当前应用的配置
        const response = await getCustomize(this.subKey, appId)

        if (response.RetCode === 0) {
          const currentConfig = response.Data || '{}'
          // 计算当前应用配置与修改数据的差异
          const data = JSON.parse(currentConfig.Data)
          const updatedConfig = this.applyDifferenceToConfig(data, diffData)

          // 将差异应用到该应用的配置
          currentConfig.Data = JSON.stringify(updatedConfig)

          await updateCustomize(currentConfig).then(response => {
            if (response.RetCode === 0) {
              Message.success(`应用 ${appId} 配置已成功更新！`)
            }
          })
        } else {
          console.warn(`⚠️ 无法获取应用 ${appId} 的配置.`)
        }
      }
    },
    applyDifferenceToConfig(currentConfig, diffData) {
      if (Array.isArray(diffData)) {
        return JSON.parse(JSON.stringify(diffData))
      }
      for (const key in diffData) {
        // eslint-disable-next-line no-prototype-builtins
        if (diffData.hasOwnProperty(key)) {
          // 如果差异存在于当前配置中，则进行覆盖
          if (Array.isArray(diffData[key])) {
            currentConfig[key] = JSON.parse(JSON.stringify(diffData[key]))
          } else if (typeof diffData[key] === 'object' && diffData[key] !== null) {
            // 如果是对象，则递归处理
            currentConfig[key] = this.applyDifferenceToConfig(currentConfig[key] || {}, diffData[key])
          } else {
            console.log('修改', key, diffData[key])
            currentConfig[key] = diffData[key]
          }
        }
      }

      return currentConfig
    },
    onMultiAppSaveClick() {
      if (!this.checkData()) {
        return
      }

      const newData = this.getPostData()
      const oldData = JSON.parse(this.$refs.compare.oldVal.Data)
      this.form.Data = JSON.stringify(newData)
      this.$refs.compare.SetNewVal(this.form)

      const $this = this

      // 先执行对比
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        // 差异计算
        $this.diffData = $this.getDifferenceBetweenConfigs(oldData, newData)

        // 弹出多应用选择弹窗
        $this.prepareAppTree()
        $this.multiAppAction = 'save'
        $this.multiAppDialogVisible = true
      })
    },
    prepareAppTree(defaultCheckedKeys = []) {
      this.appTreeData = [
        {
          label: '全选',
          value: this.selectAllNodeKey,
          children: this.appOptions.slice(1).map(app => ({
            label: app.label,
            value: app.value
          }))
        }
      ]
      const checkedKeys = defaultCheckedKeys.filter(key => key !== this.selectAllNodeKey)
      this.$set(this, 'checkedAppKeys', checkedKeys)
      this.$nextTick(() => {
        if (this.$refs.appTree) {
          this.$refs.appTree.setCheckedKeys(checkedKeys)
        }
      })
    },
    buildCopyPayload(appId) {
      const payload = JSON.parse(JSON.stringify(this.form || {}))
      delete payload.ID
      payload.AppId = appId
      payload.RedisSubkey = this.subKey
      payload.Data = JSON.stringify(this.getPostData())
      payload.Name = payload.Name || 'Slots任务配置'
      payload.Description = payload.Description || 'Slots任务配置'
      payload.Type = 1
      return payload
    },
    async confirmMultiAppCopy(appIds) {
      const successAppIds = []
      const failedApps = []
      for (const appId of appIds) {
        const response = await createCustomize(this.buildCopyPayload(appId))
        if (response.RetCode !== 0) {
          const errMsg = response.Data ? (typeof response.Data === 'string' ? response.Data : JSON.stringify(response.Data)) : ''
          failedApps.push({ appId, errMsg })
          continue
        }
        successAppIds.push(appId)
      }
      if (successAppIds.length > 0) {
        Message.success(`配置复制完成，成功 ${successAppIds.length} 个App：${successAppIds.join(', ')}`)
      }
      if (failedApps.length > 0) {
        const errText = failedApps.map(item => `${item.appId}${item.errMsg ? '：' + item.errMsg : ''}`).join('；')
        Message.error(`配置复制失败 ${failedApps.length} 个App：${errText}`)
      }
    },
    async confirmMultiAppSave() {
      // 选中的 App ID（排除全选节点 key）
      const appIds = this.checkedAppKeys.filter(key => key !== this.selectAllNodeKey)
      if (appIds.length === 0) {
        Message.warning('请至少选择一个应用')
        return
      }

      try {
        if (this.multiAppAction === 'copy') {
          await this.confirmMultiAppCopy(appIds)
        } else {
          await this.saveDifferenceToOtherApps(appIds, this.diffData)
        }
      } finally {
        this.multiAppDialogVisible = false
        this.multiAppAction = 'save'
      }
    },
    // 处理全选或取消全选
    onCheckChange(node, checked) {
      if (node.value === this.selectAllNodeKey) {
        // 点击全选节点时
        if (checked) {
          // 勾选全选时，选中所有子节点
          this.checkedAppKeys = this.appOptions.slice(1).map(app => app.value)
        } else {
          // 取消全选时，清空所有子节点的选中状态
          this.checkedAppKeys = []
        }
      } else {
        // 如果是其他节点，直接更新 checkedAppKeys
        if (checked) {
          this.checkedAppKeys = Array.from(new Set([...this.checkedAppKeys, node.value]))
        } else {
          this.checkedAppKeys = this.checkedAppKeys.filter(item => item !== node.value)
        }
      }
    }
  }
}
</script>

