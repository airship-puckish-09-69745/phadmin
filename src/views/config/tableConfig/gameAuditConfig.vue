<template>
  <div class="app-container">
    <publish primary-key="Volume" :key-id="getFullKey(this.subKey)" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-row :gutter="10" style="margin-top: 30px">

      <el-col :span="22">
        <el-button type="primary" size="mini" @click="addOne">添加游戏审核配置项</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
      </el-col>
      <el-col :span="24">
        <el-form ref="allCfg" v-model="allCfg" label-width="150px">
          <el-table
            :data="allCfg"
            style="width: 95%"
            border
          >

            <el-table-column
              prop="AppId"
              label="应用"
              width="180"
            >
              <template slot-scope="scope">
                <el-form-item v-model="scope.row.AppId" :required="true" label-width="0">
                  <el-select v-model="scope.row.AppId" placeholder="请选择" size="mini">
                    <el-option
                      v-for="row in appInfo"
                      :key="row.key"
                      :label="row.label"
                      :value="row.key"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              prop="GameId"
              label="游戏"
              width="180"
            >
              <template slot-scope="scope">
                <el-form-item v-model="scope.row.GameId" :required="true" label-width="0">
                  <el-select v-model="scope.row.GameId" placeholder="请选择" size="mini">
                    <el-option
                      v-for="row in gameOptions"
                      :key="row.key"
                      :label="row.label"
                      :value="row.key"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              prop="ChannelId"
              label="站点渠道"
              width="180"
            >
              <template slot-scope="scope">
                <el-form-item v-model="scope.row.ChannelId" :required="true" label-width="0">
                  <el-select v-model="scope.row.ChannelId" placeholder="请选择" size="mini">
                    <el-option label="BP" value="BP" />
                    <el-option label="GP" value="GP" />
                    <el-option label="AP" value="AP" />
                    <el-option label="DEV" value="DEV" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              prop="FinishTime"
              label="结束时间"
            >
              <template slot-scope="scope">
                <el-form-item v-model="scope.row.FinishTime" label-width="0">
                  <el-date-picker
                    v-model="scope.row.FinishTime"
                    value-format="timestamp"
                    type="datetime"
                    placeholder="选择结束时间"
                    size="mini"
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="delRow(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <br>
          <br>
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput'
import { copyObj } from 'codemirror/src/util/misc'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput },
  data() {
    return {
      form: {},
      postData: {},
      subKey: 'game_audit_config',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      allCfg: [],
      appInfo: [],
      games: {
        // 2: 'Andar Bahar',
        // 3: 'Dragon VS Tiger',
        // 5: 'Car Roulette',
        // 9: 'Baccarat',
        // 10: 'Crash',
        '15': 'Texas Poker',
        // 20: 'MINES',
        '21': 'Pusoy',
        '22': 'Tongits-Pot',
        '23': 'Lucky9',
        // 25: 'Color Game',
        '31': 'Tongits-Classic'
        // 52: 'Sleeping Beauty',
        // 51: 'Phoenix'
      },

      gameOptions: [
        { key: 15, label: 'Texas Poker' },
        { key: 21, label: 'Pusoy' },
        { key: 22, label: 'Tongits-Pot' },
        { key: 23, label: 'Lucky9' },
        { key: 31, label: 'Tongits-Classic' }
      ],
      item: {
        GameId: '',
        AppId: '',
        ChannelId: '',
        FinishTime: 0
      }
    }
  },
  created() {
    this.getAppInfo()
    this.getData()
  },
  methods: {
    newItem() {
      return this.item
    },
    addOne() {
      this.allCfg.push(this.newItem())
    },
    delRow(idx, row) {
      console.log('idx:' + idx + ' row:', row)
      this.allCfg.splice(idx, 1)
    },
    showGameName(gid) {
      return this.games[gid] || gid
    },
    getFullKey(k) {
      return 'CustomizeCfg_' + k
    },
    getData() {
      const $this = this
      // 加载基础数值配置
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || {}
          $this.postData = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const cfg = JSON.parse(response.Data.Data)
            for (const i in cfg) {
              cfg[i].FinishTime *= 1000
            }
            $this.allCfg = cfg
            console.log('$this.allCfg >>> ', $this.allCfg)
            $this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    setData() {
      const cfg = this.getCfg()
      console.log('saveData ===> ', cfg)
      if (!this.checkData(cfg)) {
        return false
      }

      // this.form.Data = JSON.stringify(cfg)
      this.postData.Data = JSON.stringify(cfg)
      const $this = this
      // 设置修改后数据
      // this.$refs.compare.SetNewVal(this.form)
      this.$refs.compare.SetNewVal(this.postData)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        request({
          url: 'customizeconfig/update',
          method: 'post',
          // data: $this.form
          data: $this.postData
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功')
          }
        })
      })
    },
    getCfg() {
      const cfg = []
      for (const i in this.allCfg) {
        const item = {}
        copyObj(this.allCfg[i], item)
        item.FinishTime = this.allCfg[i].FinishTime / 1000
        cfg.push(item)
      }
      return cfg
    },
    checkData(cfg) {
      for (const i in cfg) {
        if (!cfg[i].GameId || !cfg[i].AppId || !cfg[i].ChannelId || !cfg[i].FinishTime) {
          Message.error('请查看配置是否有漏')
          return false
        }
      }
      return true
    },
    getAppInfo() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          // const objs = response.Data || []
          for (let i = 0; i < response.Data.length; i++) {
            this.appInfo.push({
              key: response.Data[i].ID,
              label: response.Data[i].Account
            })
          }
        }
      })
    }
  }
}
</script>
