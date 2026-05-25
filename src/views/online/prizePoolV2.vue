<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="22" :offset="1">
        <div style="color: red; margin-bottom: 10px">当前奖池APP：{{ appId }}</div>
      </el-col>
      <el-col :span="22" :offset="1">
        <el-button type="success" size="mini" @click="getData">刷新</el-button>
        <el-button type="primary" size="mini" @click="copyForm.copyDialogVisible=true">APP奖池复制</el-button>
        <el-button type="warning" size="mini" @click="initPoolDialogVisible=true">批量初始化奖池</el-button>
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
                {{ getGameNameDisplay(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="PrizePool"
              label="奖池"
              width="200"
            >
              <template slot-scope="scope">
                <span :style="isPoolHigh(scope.row.PrizePool)?'color:red':''">{{ formatPool(scope.row.PrizePool) }}</span>
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
                <span :style="isPoolHigh(scope.row.PrizePool)?'color:red':''">{{ formatPool(scope.row.PrizePool) }}</span>
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
        <el-form-item v-if="form.Gid===37" label="低注：" prop="PrizePool">
          <el-input v-model.number="form.Ante" size="medium" :required="true" :placeholder="form.Ante" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setData">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="初始化奖池"
      :visible.sync="initPoolDialogVisible"
      width="900px"
      @opened="onInitPoolDialogOpened"
    >
      <el-form ref="initPoolForm" :model="{ initPoolValue: this.initPoolValue }" label-width="200px">
        <el-form-item label="初始化奖池数值：" prop="initPoolValue">
          <el-input v-model.number="initPoolValue" size="medium" placeholder="请输入初始化数值" @change="onInitPoolValueChange" />
        </el-form-item>
        <el-form-item label="自动筛选低于数值的游戏：">
          <el-switch v-model="initPoolAutoFilter" @change="onInitPoolAutoFilterChange" />
        </el-form-item>
      </el-form>
      <span style="color: #ed1616; font-size: 12px;">注意：开启自动筛选后，列表将只显示低于该数值的游戏的</span>

      <el-tabs active-name="initFirst" style="margin-top: 20px;">
        <el-tab-pane label="下注类" name="initFirst">
          <el-table
            :data="initPoolCasioData"
            border
            style="width: 100%;"
            @selection-change="onInitPoolCasioSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="Gid"
              label="子游戏"
              min-width="150"
            >
              <template slot-scope="scope">
                {{ getGameNameDisplay(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="PrizePool"
              label="当前奖池"
              width="150"
            >
              <template slot-scope="scope">
                <span :style="scope.row.PrizePool < initPoolValue * 1000 ? 'color:red;font-weight:bold' : ''">
                  {{ formatPool(scope.row.PrizePool) }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="Slots" name="initSecond">
          <el-table
            :data="initPoolSlotsData"
            border
            style="width: 100%;"
            @selection-change="onInitPoolSlotsSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="Gid"
              label="子游戏"
            >
              <template slot-scope="scope">
                {{ getSlotsName(scope.row.Gid) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="Gid"
              label="类型"
              width="80"
            >
              <template slot-scope="scope">
                {{ getSlotsfSuffix(scope.row.Gid) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="PrizePool"
              label="当前奖池"
            >
              <template slot-scope="scope">
                <span :style="scope.row.PrizePool < initPoolValue * 1000 ? 'color:red;font-weight:bold' : ''">
                  {{ formatPool(scope.row.PrizePool) }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="initPoolDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchUpdatePool">确认更新</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="奖池复制"
      :visible.sync="copyForm.copyDialogVisible"
      width="1000px"
      @opened="onCopyDialogOpened"
    >
      <el-form ref="copyForm" :model="copyForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="来源APP：" prop="copyFromAppId">
              <el-select v-model.number="copyForm.copyFromAppId" size="medium" :required="true" placeholder="请选择" @change="onCopyAppChange">
                <el-option label="未区分APP的奖池" :value="0" />
                <el-option
                  v-for="item in appList"
                  :key="item.key"
                  :label="appLabel(item.key, item.label)"
                  :value="item.key"
                  :disabled="item.key === copyForm.copyToAppId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标APP：" prop="copyToAppId">
              <el-select v-model.number="copyForm.copyToAppId" size="medium" :required="true" placeholder="请选择" @change="onCopyToAppChange">
                <el-option
                  v-for="item in appList"
                  :key="item.key"
                  :label="appLabel(item.key, item.label)"
                  :value="item.key"
                  :disabled="copyForm.copyFromAppId !== 0 && item.key === copyForm.copyFromAppId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-tabs active-name="first">
            <el-tab-pane label="下注类" name="first">
              <el-table
                :data="copyForm.casioData"
                border
                style="width: 100%;"
                @selection-change="onSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="55"
                />
                <el-table-column
                  prop="Gid"
                  label="子游戏"
                  min-width="150"
                >
                  <template slot-scope="scope">
                    {{ getGameNameDisplay(scope.row) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="PrizePool"
                  label="奖池"
                  width="120"
                >
                  <template slot-scope="scope">
                    <span :style="isPoolHigh(scope.row.PrizePool)?'color:red':''">{{ formatPool(scope.row.PrizePool) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="Slots" name="second">
              <el-table
                :data="copyForm.slotsData"
                :span-method="copyFormSpanMethod"
                border
                style="width: 100%;"
                @selection-change="onSlotsSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="55"
                />
                <el-table-column
                  prop="Gid"
                  label="子游戏"
                >
                  <template slot-scope="scope">
                    {{ getSlotsName(scope.row.Gid) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Gid"
                  label="类型"
                  width="80"
                >
                  <template slot-scope="scope">
                    {{ getSlotsfSuffix(scope.row.Gid) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="PrizePool"
                  label="奖池"
                >
                  <template slot-scope="scope">
                    <span :style="isPoolHigh(scope.row.PrizePool)?'color:red':''">{{ formatPool(scope.row.PrizePool) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="12">
          <el-tabs active-name="targetFirst">
            <el-tab-pane label="下注类" name="targetFirst">
              <el-table
                :data="targetCasioData"
                border
                style="width: 100%;"
              >
                <el-table-column
                  prop="Gid"
                  label="子游戏"
                  min-width="150"
                >
                  <template slot-scope="scope">
                    {{ getGameNameDisplay(scope.row) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="PrizePool"
                  label="奖池"
                  width="120"
                >
                  <template slot-scope="scope">
                    <span :style="isPoolHigh(scope.row.PrizePool)?'color:red':''">{{ formatPool(scope.row.PrizePool) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="Slots" name="targetSecond">
              <el-table
                :data="targetSlotsData"
                :span-method="targetSpanMethod"
                border
                style="width: 100%;"
              >
                <el-table-column
                  prop="Gid"
                  label="子游戏"
                >
                  <template slot-scope="scope">
                    {{ getSlotsName(scope.row.Gid) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Gid"
                  label="类型"
                  width="80"
                >
                  <template slot-scope="scope">
                    {{ getSlotsfSuffix(scope.row.Gid) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="PrizePool"
                  label="奖池"
                >
                  <template slot-scope="scope">
                    <span :style="isPoolHigh(scope.row.PrizePool)?'color:red':''">{{ formatPool(scope.row.PrizePool) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>

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
      appId: parseInt(store.getters.appId),

      copyForm: {
        copyFromAppId: 0,
        copyToAppId: 0,
        copyDialogVisible: false,
        slotsData: [],
        casioData: [],
        rowsSpanGameIdMap: {},
        casioDataGameIds: [],
        slotsDataGameIds: [],
        antes: []
      },
      targetCasioData: [],
      targetSlotsData: [],
      targetRowsSpanGameIdMap: {},
      appList: [],

      initPoolDialogVisible: false,
      initPoolValue: 0,
      initPoolCasioData: [],
      initPoolSlotsData: [],
      initPoolCasioGameIds: [],
      initPoolSlotsGameIds: [],
      initPoolAutoFilter: false // 是否自动隐藏高于初始化数值的游戏
    }
  },
  created() {
    this.getData()
    this.getAppList()
  },
  methods: {
    parsePoolList(data) {
      const result = { slotsData: [], casioData: [], rowsSpanGameIdMap: {}}
      for (const item of data) {
        if (IGNORE_GIDS.includes(item.Gid)) continue
        if (item.Gid > 5000) {
          const gid = parseInt(item.Gid / 100)
          if (!PoolByAppSlotsGameIds.includes(gid)) continue
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
    formatPool(val) {
      return Math.floor(val / 1000).toLocaleString()
    },
    isPoolHigh(val) {
      return val / 1000 > 1000000
    },
    getGameNameDisplay(row) {
      if (row.Gid === 37) {
        return this.getGameName(row.Gid) + ' ' + row.Ante / 1000 + '场'
      }
      return this.getGameName(row.Gid)
    },
    createSpanMethod(spanMap, targetCol) {
      return ({ row, columnIndex }) => {
        if (columnIndex === targetCol) {
          const gid = parseInt(row.Gid / 100)
          if (gid in spanMap && row.Gid % 100 === 1) {
            return { rowspan: spanMap[gid], colspan: 1 }
          }
          return { rowspan: 0, colspan: 0 }
        }
      }
    },
    objectSpanMethod(params) {
      return this.createSpanMethod(this.rowsSpanGameIdMap, 0)(params)
    },
    copyFormSpanMethod(params) {
      return this.createSpanMethod(this.copyForm.rowsSpanGameIdMap, 1)(params)
    },
    targetSpanMethod(params) {
      return this.createSpanMethod(this.targetRowsSpanGameIdMap, 0)(params)
    },
    edit(row) {
      this.$refs.compare.SetOldVal(row)
      this.form.Gid = row.Gid
      this.form.PrizePool = 0
      this.form.LotteryPool = row.PrizePool
      this.form.FeeRate = row.FeeRate
      this.form.RecountRate = row.RecountRate
      this.form.Name = this.getGameName(row.Gid)
      this.form.Ante = row.Ante
      this.dialogVisible = true
    },
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
    getData() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/lotteryschema/prize/pool/list',
          Env: store.getters.env,
          AppId: this.appId
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const result = this.parsePoolList(response.Data)
          this.slotsData = result.slotsData
          this.casioData = result.casioData
          this.rowsSpanGameIdMap = result.rowsSpanGameIdMap
        } else {
          this.$message.error(response.Data)
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
          txt: txt,
          path: 'online/prize_pool',
          stype: 'prizepool',
          optype: 3
        }
      })
    },
    setData() {
      if (!ValidateVueItem(this.$refs['form'])) return false

      if (this.form.PrizePool === 0) {
        this.$message.error('增减奖池值不能为0')
        return
      }

      const submitData = {
        Gid: this.form.Gid,
        PrizePool: parseInt(this.form.LotteryPool) + parseInt(this.form.PrizePool * 1000),
        FeeRate: this.form.FeeRate,
        RecountRate: this.form.RecountRate,
        Ante: this.form.Ante,
        AppId: this.appId
      }

      // 设置修改后数据
      this.$refs.compare.SetNewVal(submitData)
      this.$refs.compare.Compare((isEdit) => {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        this.writeLog()
        // 上面设置的值，只是为了对比
        submitData.PrizePool = parseInt(this.form.PrizePool) * 1000
        submitData.Path = '/lotteryschema/update/prize/pool'
        submitData.Env = this.$store.getters.env

        request({
          url: '/dataProxy/info',
          method: 'post',
          data: submitData
        }).then(response => {
          if (response.RetCode === 0) {
            this.$message.success('更新成功')
            this.dialogVisible = false
            this.getData()
          } else {
            this.$message.error(response.Data)
          }
        })
      })
    },
    copyFromApp() {
      if (!this.copyForm.copyToAppId) {
        this.$message.error('请选择目标APP')
        return
      }

      // 验证来源APP和目标APP不能相同
      if (this.copyForm.copyFromAppId !== 0 && this.copyForm.copyFromAppId === this.copyForm.copyToAppId) {
        this.$message.error('来源APP和目标APP不能相同')
        return
      }

      const appLabel = this.copyForm.copyFromAppId === 0 ? '未区分APP' : this.appList.find(item => item.key === this.copyForm.copyFromAppId).label + '-' + this.copyForm.copyFromAppId
      const targetAppLabel = this.copyForm.copyToAppId === this.appId ? '当前APP' : this.appList.find(item => item.key === this.copyForm.copyToAppId).label + '-' + this.copyForm.copyToAppId
      const gameIds = [...this.copyForm.casioDataGameIds, ...this.copyForm.slotsDataGameIds]

      if (gameIds.length === 0) {
        this.$message.error('请选择要同步的子游戏')
        return
      }

      const h = this.$createElement
      const gameNames = gameIds.map(gid =>
        h('div', { style: { 'margin-top': '10px', 'padding-left': '10px' }}, this.getGameName(gid))
      )

      const message = h('div', {}, [
        h('div', {}, '确认将来源【' + appLabel + '】的奖池配置复制到目标【' + targetAppLabel + '】吗？'),
        h('div', { style: { 'margin-top': '10px' }}, '包括以下子游戏：'),
        ...gameNames
      ])

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
            ToAppId: this.copyForm.copyToAppId,
            GameIds: gameIds.join(','),
            Antes: this.copyForm.antes.join(',')
          }
        }).then(response => {
          if (response.RetCode === 0) {
            this.copyForm.copyDialogVisible = false
            this.$message.success('复制成功')
            this.getTargetAppData()
            if (this.copyForm.copyToAppId === this.appId) {
              this.getData()
            }
          } else {
            this.$message.error(response.Data)
          }
        })
      })
    },
    getAppList() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          this.appList = response.Data
            .map(item => ({ key: item.ID, label: item.Account }))
        }
      })
    },
    appLabel(key, label) {
      return label + '-' + key
    },
    onCopyDialogOpened() {
      this.copyForm.copyFromAppId = 0
      this.copyForm.copyToAppId = this.appId
      this.onCopyAppChange()
      this.getTargetAppData()
    },
    onCopyToAppChange() {
      this.getTargetAppData()
    },
    getTargetAppData() {
      if (!this.copyForm.copyToAppId) return

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/lotteryschema/prize/pool/list',
          Env: store.getters.env,
          AppId: this.copyForm.copyToAppId
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const result = this.parsePoolList(response.Data)
          this.targetSlotsData = result.slotsData
          this.targetCasioData = result.casioData
          this.targetRowsSpanGameIdMap = result.rowsSpanGameIdMap
        } else {
          this.$message.error(response.Data)
        }
      })
    },
    onCopyAppChange() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/lotteryschema/prize/pool/list',
          Env: store.getters.env,
          AppId: this.copyForm.copyFromAppId
        }
      }).then(response => {
        this.copyForm.casioDataGameIds = []
        this.copyForm.slotsDataGameIds = []
        this.copyForm.antes = []
        if (response.RetCode === 0) {
          const result = this.parsePoolList(response.Data)
          this.copyForm.slotsData = result.slotsData
          this.copyForm.casioData = result.casioData
          this.copyForm.rowsSpanGameIdMap = result.rowsSpanGameIdMap
        } else {
          this.$message.error(response.Data)
        }
      })
    },
    onSelectionChange(val) {
      this.copyForm.casioDataGameIds = [...new Set(val.map(item => item.Gid))]
      this.copyForm.antes = [...new Set(val.filter(item => item.Ante > 0).map(item => item.Ante))]
    },
    onSlotsSelectionChange(val) {
      this.copyForm.slotsDataGameIds = [...new Set(val.map(item => item.Gid))]
    },
    getFreezePool(row) {
      if (row.FreezePool === undefined) return ''
      const prizePool = row.PrizePool - row.FreezePool
      return `奖池：${Math.floor(prizePool / 1000).toLocaleString()} 未提现冻结：${Math.floor(row.FreezePool / 1000).toLocaleString()}`
    },
    onInitPoolDialogOpened() {
      // 初始化时显示所有游戏
      this.initPoolValue = 0
      this.initPoolCasioData = [...this.casioData]
      this.initPoolSlotsData = [...this.slotsData]
      this.initPoolCasioGameIds = []
      this.initPoolSlotsGameIds = []
      this.initPoolAutoFilter = false
    },
    onInitPoolValueChange() {
      if (!this.initPoolAutoFilter) {
        // 未开启自动筛选，保持显示所有游戏
        return
      }

      this.doInitPoolFilter()
    },
    onInitPoolAutoFilterChange() {
      if (this.initPoolAutoFilter) {
        // 开启自动筛选
        this.doInitPoolFilter()
      } else {
        // 关闭自动筛选，显示所有游戏
        this.initPoolCasioData = [...this.casioData]
        this.initPoolSlotsData = [...this.slotsData]
        this.initPoolCasioGameIds = []
        this.initPoolSlotsGameIds = []
      }
    },
    doInitPoolFilter() {
      if (!this.initPoolValue || this.initPoolValue <= 0) {
        // 数值为空或无效时，显示所有游戏
        this.initPoolCasioData = [...this.casioData]
        this.initPoolSlotsData = [...this.slotsData]
        this.initPoolCasioGameIds = []
        this.initPoolSlotsGameIds = []
        return
      }

      const initValue = this.initPoolValue * 1000

      // 只显示低于初始化数值的游戏
      this.initPoolCasioData = this.casioData.filter(item => item.PrizePool < initValue)
      this.initPoolSlotsData = this.slotsData.filter(item => item.PrizePool < initValue)
    },
    onInitPoolCasioSelectionChange(val) {
      this.initPoolCasioGameIds = [...new Set(val.map(item => item.Gid))]
    },
    onInitPoolSlotsSelectionChange(val) {
      this.initPoolSlotsGameIds = [...new Set(val.map(item => item.Gid))]
    },
    batchUpdatePool() {
      if (!this.initPoolValue || this.initPoolValue <= 0) {
        this.$message.error('请输入有效的奖池数值')
        return
      }

      const gameIds = [...this.initPoolCasioGameIds, ...this.initPoolSlotsGameIds]

      if (gameIds.length === 0) {
        this.$message.error('请选择需要更新奖池的游戏')
        return
      }

      const initValue = this.initPoolValue * 1000 // 放大1000倍

      // 获取选中的游戏数据
      const casioSelected = this.initPoolCasioData.filter(item => this.initPoolCasioGameIds.includes(item.Gid))
      const slotsSelected = this.initPoolSlotsData.filter(item => this.initPoolSlotsGameIds.includes(item.Gid))
      const needUpdateData = [...casioSelected, ...slotsSelected]

      const h = this.$createElement
      const gameNames = needUpdateData.map(item =>
        h('div', { style: { 'margin-top': '5px', 'padding-left': '10px' }}, this.getGameNameDisplay(item))
      )

      const message = h('div', {}, [
        h('div', {}, '确认将以下 ' + needUpdateData.length + ' 个游戏奖池按 ' + this.initPoolValue + ' 更新吗？'),
        h('div', { style: { 'margin-top': '10px', 'max-height': '200px', 'overflow-y': 'auto' }}, gameNames)
      ])

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        let successCount = 0
        let failCount = 0

        for (const item of needUpdateData) {
          const submitData = {
            Gid: item.Gid,
            PrizePool: initValue - item.PrizePool, // 需要增加的差值
            FeeRate: item.FeeRate,
            RecountRate: item.RecountRate,
            Ante: item.Ante || 0,
            AppId: this.appId,
            Path: '/lotteryschema/update/prize/pool',
            Env: this.$store.getters.env
          }

          try {
            const response = await request({
              url: '/dataProxy/info',
              method: 'post',
              data: submitData
            })

            if (response.RetCode === 0) {
              successCount++
            } else {
              failCount++
            }
          } catch (error) {
            failCount++
          }
        }

        this.initPoolDialogVisible = false
        if (failCount === 0) {
          this.$message.success(`初始化成功，共更新 ${successCount} 个奖池`)
        } else {
          this.$message.warning(`初始化完成，成功 ${successCount} 个，失败 ${failCount} 个`)
        }
        this.getData()
      })
    }
  }
}
</script>
