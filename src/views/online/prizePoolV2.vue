<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="22" :offset="1">
        <div style="color: red; margin-bottom: 10px">当前奖池APP：{{ appId }}</div>
      </el-col>
      <el-col :span="22" :offset="1">
        <el-button type="success" size="mini" @click="getData">刷新</el-button>
        <el-button type="primary" size="mini" @click="copyForm.copyDialogVisible=true">从其他APP拷贝</el-button>
      </el-col>
      <el-col :span="22" :offset="1">
        <el-tabs active-name="first">
          <el-tab-pane label="下注类" name="first"><el-table
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
              prop="FreezePool"
              label="未提现冻结"
              width="300"
            >
              <template slot-scope="scope">
                <span>{{ getFreezePool(scope.row) }}</span>
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
              prop="RecountRate"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
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

    <el-dialog
      title="从其他APP奖池同步"
      :visible.sync="copyForm.copyDialogVisible"
      @opened="onCopyDialogOpened"
      width="300"
    >
      <el-form ref="copyForm" :model="copyForm">
        <el-form-item label="请选择要同步的APP奖池：" prop="copyFromAppId">
          <el-select v-model.number="copyForm.copyFromAppId" size="medium" :required="true" placeholder="请选择" @change="onCopyAppChange">
            <el-option label="未区分APP的奖池" :value="0" />
            <el-option
              v-for="item in appList"
              :key="item.key"
              :label="appLabel(item.key, item.label)"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-tabs active-name="first">
        <el-tab-pane label="下注类" name="first"><el-table
          :data="copyForm.casioData"
          border
          @selection-change="onSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
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
        </el-table></el-tab-pane>
        <el-tab-pane label="Slots" name="second"><el-table
          :data="copyForm.slotsData"
          :span-method="copyFormObjectSpanMethod"
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
        </el-table></el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="copyForm.copyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="copyFromApp">确 定</el-button>
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
import store from '@/store'
import { $libShow, DataRule, ValidateVueItem } from '@/utils/common'

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
      appId: parseInt(store.getters.appId),

      copyForm: {
        copyFromAppId: 0,
        copyDialogVisible: false,
        slotsData: [],
        casioData: [],
        rowsSpanGameIdMap: {},
        casioDataGameIds: [],
        slotsDataGameIds: [],
      },
      appList: [],
    }
  },
  created() {
    this.getData()
    this.getAppList()
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
    copyFormObjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const gid = parseInt(row.Gid / 100)
        if (gid in this.copyForm.rowsSpanGameIdMap && row.Gid % 100 === 1) {
          return {
            rowspan: this.copyForm.rowsSpanGameIdMap[gid],
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
    handleClose(done) {
      this.dialogVisible = false
      done()
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getData() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/lotteryschema/prize/pool/list',
          Env: store.getters.env,
          AppId: this.appId
        }
      }).then(response => {
        console.log('list response', response)
        const ignore = [2, 3, 4, 5, 7, 8, 9, 13, 14, 16, 17, 18, 19]
         $this.slotsData = []
         $this.casioData = []
        if (response.RetCode === 0) {
          $this.rowsSpanGameIdMap = {}
          for (let i = 0; i < response.Data.length; i++) {
            const item = response.Data[i]
            if (ignore.includes(item.Gid)) {
              continue
            }

            if (item.Gid > 5000) {
              const gid = parseInt(item.Gid / 100)
              if (gid in $this.rowsSpanGameIdMap) {
                $this.rowsSpanGameIdMap[gid] += 1
              } else {
                $this.rowsSpanGameIdMap[gid] = 1
              }
              $this.slotsData.push(item)
            } else {
              $this.casioData.push(item)
            }
            // $this.tableData.push(response.Data[i])
          }
          $this.slotsData.sort(function(a, b) {
            return $this.getSlotsName(a.Gid).localeCompare($this.getSlotsName(b.Gid))
          })

          $this.casioData.sort(function(a, b) {
            return a.Gid - b.Gid
          })
        } else {
          $this.$message.error(response.Data)
        }
      })
    },
    getGameName(gid) {
      const id = parseInt(gid)
      if (id > 5000) {
        return this.getSlotsName(gid) + this.getSlotsfSuffix(gid)
      }
      return $libShow.GameNames[id]
    },
    getSlotsName(gid){
      return $libShow.GameNames[parseInt(gid / 100)]
    },
    getSlotsfSuffix(gid){
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
        'AppId': this.appId,
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
        submitData.Path = '/lotteryschema/update/prize/pool'
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
    copyFromApp() {
      const $this = this

      let appLabel = this.copyForm.copyFromAppId === 0 ? '未区分APP' : this.appList.find(item => item.key === this.copyForm.copyFromAppId).label + '-' +this.copyForm.copyFromAppId
      // 合并casioDataGameIds和slotsDataGameIds
      const gameIds = [...this.copyForm.casioDataGameIds, ...this.copyForm.slotsDataGameIds]

      if (gameIds.length === 0) {
        this.$message.error('请选择要同步的子游戏')
        return
      }

      const h = this.$createElement

      let gameNames = []
      gameIds.forEach(gid => {
        gameNames.push(h('div', { style: { 'margin-top': '10px', 'padding-left': '10px' } }, $this.getGameName(gid)))
      })

      const message = h('div', {}, [
        h('div', {}, '确认同步来源【' + appLabel + '】的奖池配置吗？'),
        h('div', { style: { 'margin-top': '10px' } }, '包括以下子游戏：'),
        ...gameNames
      ])

      // 是否确认同步
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/dataProxy/info',
          method: 'get',
          data: {
            Path: '/lotteryschema/copy/from/app',
            Env: store.getters.env,
            FromAppId: this.copyForm.copyFromAppId,
            ToAppId: this.appId,
            GameIds: gameIds.join(',')
          }
        }).then(response => {
          console.log('list response', response)
          if (response.RetCode === 0) {
            $this.copyForm.copyDialogVisible = false
            $this.$message.success('同步成功')
            $this.getData()
          } else {
            $this.$message.error(response.Data)
          }
        })
      })
    },
    getAppList() {
      const $this = this
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          // const objs = response.Data || []
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].ID === $this.appId) {
              continue
            }
            this.appList.push({
              key: response.Data[i].ID,
              label: response.Data[i].Account
            })
          }
        }
      })
    },
    appLabel(key, label) {
      return label + '-' + key
    },
    onCopyDialogOpened() {
      this.copyForm.copyFromAppId = 0
      this.onCopyAppChange()
    },
    onCopyAppChange() {
      console.log('onCopyAppChange copyFromAppId', this.copyForm.copyFromAppId)

      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/lotteryschema/prize/pool/list',
          Env: store.getters.env,
          AppId: this.copyForm.copyFromAppId
        }
      }).then(response => {
        console.log('list response', response)
        const ignore = [2, 3, 4, 5, 7, 8, 9, 13, 14, 16, 17, 18, 19]

        // 清空casioDataGameIds和slotsDataGameIds
        $this.copyForm.casioDataGameIds = []
        $this.copyForm.slotsDataGameIds = []

        $this.copyForm.slotsData = []
        $this.copyForm.casioData = []
        if (response.RetCode === 0) {
          $this.copyForm.rowsSpanGameIdMap = {}
          for (let i = 0; i < response.Data.length; i++) {
            const item = response.Data[i]
            if (ignore.includes(item.Gid)) {
              continue
            }

            if (item.Gid > 5000) {
              const gid = parseInt(item.Gid / 100)
              if (gid in $this.copyForm.rowsSpanGameIdMap) {
                $this.copyForm.rowsSpanGameIdMap[gid] += 1
              } else {
                $this.copyForm.rowsSpanGameIdMap[gid] = 1
              }

              const slotsItem = $this.slotsData.find(sitem => sitem.Gid === item.Gid)
              if (slotsItem.PrizePool === 0) {
                $this.copyForm.slotsData.push(item)
              }
            } else {
              const casioItem = $this.casioData.find(citem => citem.Gid === item.Gid)
              console.log('casioItem:', casioItem)
              if (casioItem.PrizePool === 0) {
                $this.copyForm.casioData.push(item)
              }
            }
          }
          $this.copyForm.slotsData.sort(function (a, b) {
            return $this.getSlotsName(a.Gid).localeCompare($this.getSlotsName(b.Gid))
          })

          $this.copyForm.casioData.sort(function(a, b) {
            return a.Gid - b.Gid
          })
        } else {
          $this.$message.error(response.Data)
        }
      })
    },
    onSelectionChange(val) {
      console.log('onSelectionChange', val)
      this.copyForm.casioDataGameIds = val.map(item => item.Gid)
    },
    getFreezePool(row) {
      let prizePool = row.PrizePool
      let freezePool = row.FreezePool
      if (row.FreezePool == undefined) {
        return ''
      }
      prizePool -= row.FreezePool
      return `奖池：${Math.floor(prizePool/1000).toLocaleString()} 未提现冻结：${Math.floor(freezePool/1000).toLocaleString()}`
    },
  }
}
</script>
