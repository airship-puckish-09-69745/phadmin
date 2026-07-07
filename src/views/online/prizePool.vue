<template>
  <div id="prizePoolContainer" class="app-container">
    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :span="4" :offset="1">
        <span>APP：</span>
        <el-select v-model="selectedApp" placeholder="请选择APP" size="mini" filterable style="width: 80%" @change="onAppChange">
          <el-option label="旧版" :value="0" />
          <el-option v-for="(item,index) in appOptions" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
      <el-col :span="1">
        <el-button type="success" size="mini" @click="getData">刷新</el-button>
      </el-col>
      <el-col :span="22" :offset="1">
        <el-tabs active-name="first">
          <el-tab-pane label="下注类" name="first">
            <el-table
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.5)"
              :data="casioData"
              border
            >
              <el-table-column
                prop="Gid"
                label="子游戏"
                width="150"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.Gid===37">
                    {{ getGameName(scope.row.Gid)+' '+scope.row.Ante/1000+'场' }}
                  </span>
                  <span v-else>
                    {{ getGameName(scope.row.Gid) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="PrizePool"
                label="奖池"
                width="200"
              >
                <template slot-scope="scope">
                  <span :style="scope.row.PrizePool/1000>1000000?'color:red':''">{{ Math.floor(scope.row.PrizePool/1000).toLocaleString() }}</span>

                </template>
              </el-table-column>
              <el-table-column
                prop="IsByApp"
                label="支持按APP区分奖池"
                width="150"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.IsByApp" style="color: red">{{ scope.row.IsByApp ? '是' : '否' }}</span>
                  <span v-if="!scope.row.IsByApp">{{ scope.row.IsByApp ? '是' : '否' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="RecountRate"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table></el-tab-pane>
          <el-tab-pane label="Slots" name="second"><el-table
            :data="slotsData"
            :span-method="objectSpanMethod"
            border
          >
            <el-table-column
              prop="Gid"
              label="子游戏"

              width="150"
            >
              <template slot-scope="scope">
                {{ getSlotsName(scope.row.Gid) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="Gid"
              label="类型"
              width="150"
            >
              <template slot-scope="scope">
                {{ getSlotsfSuffix(scope.row.Gid) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="PrizePool"
              label="奖池"
              width="200"
            >
              <template slot-scope="scope">
                <span :style="scope.row.PrizePool/1000>1000000?'color:red':''">{{ Math.floor(scope.row.PrizePool/1000).toLocaleString() }}</span>

              </template>
            </el-table-column>
            <el-table-column
              prop="IsByApp"
              label="按APP区分奖池"
              width="150"
            >
              <template slot-scope="scope">
                {{ scope.row.IsByApp ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="RecountRate"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
                <el-button v-if="scope.row.IsByApp" type="success" size="mini" @click="jumpToNewPage">前往新后台</el-button>
              </template>
            </el-table-column>
          </el-table></el-tab-pane>
        </el-tabs>

      </el-col>

    </el-row>

    <el-dialog
      title="修改"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="子游戏：">
          <el-input v-model="form.Name" size="medium" />
        </el-form-item>
        <el-form-item label="增减奖池：" prop="PrizePool">
          <el-input v-model.number="form.PrizePool" size="medium" :required="true" :placeholder="form.LotteryPool" />
        </el-form-item>
        <el-form-item v-if="form.Gid==37" label="低注：" prop="PrizePool">
          <el-input v-model.number="form.Ante" size="medium" :required="true" :placeholder="form.Ante" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setData">确 定</el-button>
      </span>
    </el-dialog>

    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import watermark from '@/utils/watermark'
import store from '@/store'
import { $libShow, DataRule, ValidateVueItem } from '@/utils/common'

/**
 * 支持分app奖池的Slots游戏id
 */
const PoolByAppSlotsGameIds = [86, 88, 90, 94, 98]
const IGNORE_GIDS = [2, 3, 4, 5, 7, 8, 9, 13, 14, 16, 17, 18, 19]

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      tableData: [],
      slotsData: [],
      casioData: [],
      form: {
        Gid: 1,
        PrizePool: 0,
        LotteryPool: 0, // 坚持现在值
        FeeRate: 0,
        RecountRate: 0,
        Name: '',
        Ante: 0
      },
      gameNamesSuffix: {
        1: '普通',
        2: '购买',
        3: '重转'
      },
      libShow: $libShow,
      dialogVisible: false,
      rowsSpanGameIdMap: {},
      PrizePoolV2Url: process.env.VUE_APP_ADMIN_V2_URL,
      selectedApp: 0,
      appOptions: [],
      loading: false
    }
  },
  created() {
    this.getData()
    this.getAppInfos()
    console.log(1)
  },
  methods: {
    edit(row) {
      // 设置修改之前数据
      this.$refs.compare.SetOldVal(row)

      this.form.Gid = row.Gid
      this.form.PrizePool = 0
      this.form.LotteryPool = row.PrizePool
      this.form.FeeRate = row.FeeRate
      this.form.RecountRate = row.RecountRate
      this.form.Name = this.getGameName(row.Gid)
      this.form.Ante = row.Ante
      this.dialogVisible = true
      console.log(row.Gid, this.form.Gid)
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const gid = parseInt(row.Gid / 100)
        if (gid in this.rowsSpanGameIdMap && row.Gid % 100 === 1) {
          return {
            rowspan: this.rowsSpanGameIdMap[gid],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    /*    isSlots(o) {
      if (o > 50 && o < 100 || o > 149 && o < 200) {
        return true
      } else {
        return false
      }
    },*/
    handleClose(done) {
      this.dialogVisible = false
      done()
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    slotsDataCompare(a, b) {
      let aName = this.getSlotsName(a.Gid)
      aName = aName !== undefined ? aName.toLowerCase() : ''
      let bName = this.getSlotsName(b.Gid)
      bName = bName !== undefined ? bName.toLowerCase() : ''
      return aName.localeCompare(bName)
    },
    casioDataCompare(a, b) {
      let aName = this.getGameName(a.Gid)
      aName = aName !== undefined ? aName.toLowerCase() : ''
      let bName = this.getGameName(b.Gid)
      bName = bName !== undefined ? bName.toLowerCase() : ''
      return aName.localeCompare(bName)
    },
    parsePoolList(data) {
      const result = { slotsData: [], casioData: [], rowsSpanGameIdMap: {}}
      for (const item of data) {
        if (IGNORE_GIDS.includes(item.Gid)) continue
        if (item.Gid > 5000) {
          const gid = parseInt(item.Gid / 100)
          // if (!PoolByAppSlotsGameIds.includes(gid)) continue
          result.rowsSpanGameIdMap[gid] = (result.rowsSpanGameIdMap[gid] || 0) + 1
          result.slotsData.push(item)
        } else {
          result.casioData.push(item)
        }
      }
      result.slotsData.sort(this.slotsDataCompare)
      result.casioData.sort(this.casioDataCompare)
      return result
    },
    getData() {
      this.loading = true
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/game/prize/pool/list',
          Env: store.getters.env,
          AppId: this.selectedApp
        }
      }).then(response => {
        this.loading = false
        if (response.RetCode === 0) {
          const result = this.parsePoolList(response.Data)
          this.slotsData = result.slotsData
          this.casioData = result.casioData
          this.rowsSpanGameIdMap = result.rowsSpanGameIdMap
          const appName = this.getAppName(this.selectedApp)
          this.$message({
            title: '提示',
            message: 'APP-' + appName + ' 奖池数据加载成功',
            type: 'success'
          })
        } else {
          this.$message.error(response.Data)
        }
      })
    },
    getAppInfos() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode !== 0) {
          return
        }
        response.Data.forEach(app => {
          if (app.Status === 2) {
            this.appOptions.push({
              value: app.ID,
              label: app.ID + '-' + app.Account
            })
          }

          this.updateWatter()
        })
      })
    },
    getAppName(appId) {
      if (appId === 0) return '旧版'
      const appInfo = this.appOptions.find(item => item.value === appId)
      if (appInfo) {
        return appInfo.label
      }
      return ''
    },
    onAppChange() {
      this.getData()
      this.updateWatter()
    },
    updateWatter() {
      const appName = this.getAppName(this.selectedApp)
      const parentElement = document.getElementById('prizePoolContainer')
      watermark.setWatermark(appName, 99999999, parentElement, 160, 0)
    },
    getGameName(gid) {
      const id = parseInt(gid)
      if (id > 5000) {
        return this.getSlotsName(gid) + this.getSlotsfSuffix(gid)
      }
      return $libShow.GameNames[id]
    },
    getSlotsName(gid) {
      return $libShow.GameNames[parseInt(gid / 100)]
    },
    getSlotsfSuffix(gid) {
      return this.gameNamesSuffix[parseInt(gid % 100)]
    },
    writeLog() {
      const op = this.form.PrizePool > 0 ? '累加' : '累减'
      const env = this.$store.getters.env === 'test' ? '测试' : '线上'
      const txt = env + ': ' + this.getGameName(this.form.Gid) + '奖池' + op + this.form.PrizePool

      request({
        url: '/adminuser/write/log',
        method: 'post',
        data: {
          'txt': txt,
          'path': 'online/prize_pool',
          'stype': 'prizepool',
          'optype': 3
        }
      }).then(response => {
        console.log('write log', response)
      })
    },
    setData() {
      if (!ValidateVueItem(this.$refs['form'])) return false
      console.log('form', this.form)
      const $this = this

      if (this.form.PrizePool === 0) {
        this.$message.error('增减奖池值不能为0')
        return
      }

      const submitData = {
        'Gid': this.form.Gid,
        'PrizePool': parseInt(this.form.LotteryPool) + parseInt(this.form.PrizePool * 1000),
        'FeeRate': this.form.FeeRate,
        'RecountRate': this.form.RecountRate,
        'Ante': this.form.Ante,
        'AppId': this.selectedApp
      }

      // 设置修改后数据
      this.$refs.compare.SetNewVal(submitData)
      this.$refs.compare.Compare(function(isEdit) {
        console.log('isEdit....', isEdit)
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        $this.writeLog()
        // 上面设置的值，只是为了对比
        submitData.PrizePool = parseInt($this.form.PrizePool) * 1000
        submitData.Path = '/user/update/game/prize/pool'
        submitData.Env = $this.$store.getters.env

        request({
          url: '/dataProxy/info',
          method: 'post',
          data: submitData
        }).then(response => {
          console.log('list response', response)
          if (response.RetCode === 0) {
            $this.$message.success('更新成功')
            $this.dialogVisible = false
            $this.getData()
          } else {
            $this.$message.error(response.Data)
          }
        })
      })
    },
    jumpToNewPage() {
      // 跳转到新后台页面
      window.open(this.PrizePoolV2Url)
    }
  }
}
</script>
