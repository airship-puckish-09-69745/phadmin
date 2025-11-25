<template>
  <div class="app-container" style="padding: 10px">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :offset="3" :span="16">
        <el-form ref="form" :model="item" label-position="left" style="margin-top: 30px">
          <el-form-item label="下注额度(值用 , 连接如 200,100,50,20,10,5,1)" :required="true">
            <el-input v-model="betMoneyList" size="mini" :required="true" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="5">
        <el-button size="mini" type="primary" @click="setData">保存</el-button>
      </el-col>
    </el-row>
    <el-row style="padding-top: 5px">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate()">
        添加机器人
      </el-button>
      <el-button type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button type="info" size="mini" icon="el-icon-data-analysis" @click="showChartDialog">图表查询</el-button>
      <!--   <el-col :span="2" :offset="1">
      <el-upload
        class="upload-demo"
        :action="actionURL"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :with-credentials="true"
        :before-remove="beforeRemove"
        :limit="1"
        :on-exceed="handleExceed"
      >
        <el-button size="small" type="primary">导入数据</el-button>
      </el-upload>
      </el-col> -->
    </el-row>
    <div style="padding-top: 10px">
      <el-col span="16" :offset="3">
        <el-table
          ref="filterTable"
          :data="statItems"
          stripe
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
          style="width: 100%"
          @row-click="clickData"
          @sort-change="sortChange"
        >
          <el-table-column
            prop="tableMoney"
            label="场次"
            width="90"
          />
          <el-table-column
            prop="initMoney"
            label="成本"
            width="150"
          >
            <template slot-scope="scope">
              {{ formatNumber(scope.row.initMoney) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="money"
            label="当前金额"
            width="150"
          >
            <template slot-scope="scope">
              {{ formatNumber(scope.row.money) }}
            </template>
          </el-table-column>
          <el-table-column
            label="输赢"
            width="150"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.money > scope.row.initMoney" style="color:red">
                {{ formatNumber(scope.row.money - scope.row.initMoney) }}
              </span>
              <span v-else style="color:green">
                {{ formatNumber(scope.row.money - scope.row.initMoney) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="比例"
            width="100"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.money > scope.row.initMoney" style="color:red">
                {{ ((scope.row.money - scope.row.initMoney)*100/scope.row.initMoney).toFixed(2) }}%
              </span>
              <span v-else style="color:green">
                {{ ((scope.row.money - scope.row.initMoney)*100/scope.row.initMoney).toFixed(2) }}%
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="游戏中"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.gameCount }}/ {{ scope.row.gameCount + scope.row.workCount }}
            </template>
          </el-table-column>
          <el-table-column
            label="输异常"
            width="100"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.loserCount > 0" style="color:red">
                {{ scope.row.loserCount}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="冻结中"
            width="100"
          >
            <template slot-scope="scope">
               <span v-if="scope.row.coldCount > 0">
              {{ scope.row.coldCount }}
               </span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <el-table
        ref="filterTable"
        :data="tableData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        @row-click="clickData"
        @sort-change="sortChange"
      >
        <el-table-column
          prop="uid"
          label="用户id"
          sortable="custom"
          width="90"
        />
        <el-table-column
          prop="nick"
          label="昵称"
          width="120"
        />
        <el-table-column
          prop="account"
          label="账号标识"
          width="120"
        />
        <el-table-column
          prop="app"
          label="应用ID"
          width="90"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['app']" size="mini" @change="handleFilter">
              <el-option label="应用ID" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['app']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('app', scope.row.app) }}
          </template>
        </el-table-column>


        <el-table-column
          prop="channel"
          label="渠道"
          width="80"
        />
        <el-table-column
          prop="money"
          label="当前资产"
          width="90"
        >
          <template slot-scope="scope">
            {{ scope.row.money }}
          </template>
        </el-table-column>
        <el-table-column
          prop="initMoney"
          label="初始资产"
          width="90"
        >
          <template slot-scope="scope">
            {{ scope.row.initMoney }}
          </template>
        </el-table-column>
        <el-table-column
          label="输赢"
          width="90"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.money > scope.row.initMoney" style="color:red">
              {{ (scope.row.money - scope.row.initMoney).toFixed(2) }}
            </span>
            <span v-else style="color:green">
              {{ (scope.row.money - scope.row.initMoney).toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="输赢比"
          width="90"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.money > scope.row.initMoney" style="color:red">
              {{ ((scope.row.money - scope.row.initMoney)*100/scope.row.initMoney).toFixed(2) }}%
            </span>
            <span v-else style="color:green">
              {{ ((scope.row.money - scope.row.initMoney)*100/scope.row.initMoney).toFixed(2) }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="robotId"
          label="机器人id"
          width="90"
        />
        <el-table-column
          prop="level"
          label="等级"
          width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.level==5" style="color:green">
              强杀
            </span>
            <span v-if="scope.row.level==4" style="color:green">
              弱杀
            </span>
            <span v-if="scope.row.level==3" style="color:red">
              陪玩
            </span>
            <span v-if="scope.row.level==2" style="color:red">
              弱放
            </span>
            <span v-if="scope.row.level==1" style="color:red">
              强放
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="RobotDefenceLevel"
          label="贴防等级"
          sortable="custom"
          width="100"
        >
          <template slot-scope="scope">
            <span>{{ getRobotDefenceLevel(scope.row.RobotDefenceLevel) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="allowTableMoney"
          label="场次"
          width="100"
        >

          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['allowTableMoney']" size="mini" @change="handleFilter">
              <el-option label="允许出现场次" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['allowTableMoney']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('allowTableMoney', scope.row.allowTableMoney) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="currentTid"
          label="当前所在的桌子"
          width="120"
        />
        <el-table-column
          prop="status"
          label="状态"
          sortable="custom"
          width="90"
        >
          <template slot-scope="scope">
            {{ statNames[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="lastLogin"
          label="更新时间"
          sortable="custom"
          width="150"
        >
          <template slot-scope="scope">
            <span v-if="(scope.row.status===2 || scope.row.currentTid ===0) && scope.row.lastLogin * 1000 < timeYesterday" style="color:red">
              {{ formatTime(scope.row.lastLogin) }}
            </span>
            <span v-else>
              {{ formatTime(scope.row.lastLogin) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="WalletType"
          label="状态"
          sortable="custom"
          width="90"
        >
          <template slot-scope="scope">
            {{ walletNames[scope.row.WalletType] }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status==0"
              type="primary"
              size="mini"
              @click="handleCopy(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-if="scope.row.status==0"
              size="mini"
              type="success"
              @click="handlePreOn(scope.row)"
            >解冻
            </el-button>
            <el-button
              v-if="scope.row.status==1"
              size="mini"
              type="warning"
              @click="handlePreOff(scope.row)"
            >冻结
            </el-button>

            <RobotRecycleBtn :row="scope.row" :gid="gid" />
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="clientDB.GetPage().GetPageNum()"
            layout="total, sizes, prev, pager, next, jumper"
            :total="clientDB.GetPage().GetTotalCount()"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </div>
    <el-dialog
      :title="getEditTitle()"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit.item" :model="edit.item" label-width="250px" size="small">
        <el-form-item label="用户id：" :required="true" prop="uid">
          <el-col :span="15">
            <el-input v-model="edit.item.uid" :disabled="isDisabled" />
          </el-col>
        </el-form-item>
        <el-form-item label="账号标识：" :required="true" prop="account">
          <el-col :span="15">
            <el-input v-model="edit.item.account" :disabled="isDisabled" />
          </el-col>
        </el-form-item>

        <el-form-item label="应用ID：" prop="app">
          <el-col :span="15">
            <el-input v-model="edit.item.app" :disabled="isDisabled" />
          </el-col>
        </el-form-item>
        <el-form-item label="渠道：" prop="channel">
          <el-col :span="15">
            <el-input v-model="edit.item.channel" :disabled="isDisabled" />
          </el-col>
        </el-form-item>
        <el-form-item label="当前资产：" :required="true" prop="money">
          <el-col :span="15">
            <el-input v-model="edit.item.money" :disabled="isDisabled" />
          </el-col>
        </el-form-item>

        <el-form-item label="昵称：" :required="true" prop="nick">
          <el-col :span="15">
            <el-input v-model="edit.item.nick" />
          </el-col>
        </el-form-item>
        <el-form-item label="头像：" prop="icon">
          <el-col :span="15">
            <el-input v-model="edit.item.icon" />
          </el-col>
        </el-form-item>

        <el-form-item label="初始资产：" :required="true" prop="initMoney">
          <el-col :span="15">
            <el-input v-model="edit.item.initMoney" />
          </el-col>
        </el-form-item>

        <el-form-item label="允许出现的场次：" :required="true" prop="allowTableMoney">
          <el-col :span="15">
            <el-input v-model="edit.item.allowTableMoney" />
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-row>
            <el-col :span="15" :offset="10">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" />

    <el-dialog title="机器人数据图表" :visible.sync="chartDialog.visible" width="80%" @close="closeChartDialog">
      <el-form :model="chartDialog.form" label-width="100px" style="margin-bottom: 20px;">
        <el-form-item label="场次:">
          <el-row>
            <el-button
              v-for="item in tableMoneyOptions"
              :key="item.value"
              size="mini"
              :type="chartDialog.form.tableMoney === item.value ? 'primary' : 'default'"
              @click="selectTableMoney(item.value)"      style="margin-right: 10px; margin-bottom: 10px;"
            >
              {{ item.label }}
            </el-button>
          </el-row>
        </el-form-item>
        <el-form-item label="时间范围:">
          <el-date-picker
            v-model="chartDialog.form.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRobotList">查询</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <line-chart :chart-data="chartData" :max="maxy"  height="600px" />
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libDate, $libShow, ClientTableData, DataRule, MoneyShow } from '@/utils/common'
import { getTime } from '@/utils'
import RobotRecycleBtn from '@/components/RobotRecycleBtn'
import LineChart from '../../playerManage/components/LineChart'
const filterMap = {
  currentTableMoney: 'all',
  allowTableMoney: 'all',
  app: 'all'
}
function newItem() {
  return { 'nick': '', 'money': 0, 'initMoney': 0, 'channel': '', 'account': '', 'icon': '', 'app': '', 'allowTableMoney': 0 }
}
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, RobotRecycleBtn, LineChart },
  data() {
    return {
      gid: 22, // 机器人回收需要传gid
      item: {
        TableMoneyList: []
      }, // 奖励
      betMoneyList: '200,100',
      Ratio: 900,
      statNames: { 0: '冻结', 1: '正常', 2: '游戏中' },
      walletNames: { 0: '转账钱包', 1: '单一钱包' },
      libShow: $libShow,
      showData: [],
      clientDB: new ClientTableData([], 1, {}),
      tableData: [],
      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },
      isDisabled: false,
      form: {
      },
      statItems: [],
      txt: '',
      subKey: '',
      cgiPath: '',
      chartData: {},
      maxy: 0,
      ratioData: [],
      timeYesterday: new Date().getTime() - 86400 * 1000,
      tableMoneyOptions: [], // 场次选项
      chartDialog: {
        visible: false,
        form: {
          tableMoney: [],
          dateRange: []
        }
      },
    }
  },

  computed: {
    actionURL() {
      return process.env.VUE_APP_BASE_API + '/other/upload'
    }
  },
  created() {
    this.gid = this.$route.meta.gid
    this.subKey = this.$route.meta.cfgSubKey
    this.cgiPath = this.$route.meta.cgiPath
    this.getData()
    this.getList()
    this.isDisabled = false

    console.log(1)
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    refresh() {
      this.getData()
      this.getList()
    },
    selectTableMoney(tableMoney) {
      this.chartDialog.form.tableMoney = tableMoney;
      this.getRobotList(); // 直接触发查询
    },
    getData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            $this.item = JSON.parse(response.Data.Data)
            $this.showData = []
            for (const i in this.item.TableMoneyList) {
              this.item.TableMoneyList[i] /= 1000
            }
            this.betMoneyList = this.item.TableMoneyList ? this.item.TableMoneyList.join(',') : this.betMoneyList
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
      })
    },
    getPostData() {
      const ret = {}
      const items = this.betMoneyList.split(',')
      this.item.TableMoneyList = []
      for (const o in items) {
        this.item.TableMoneyList.push(parseInt(items[o]) * 1000)
      }
      Object.assign(ret, this.item)
      return ret
    },
    setData() {
      this.form.Data = JSON.stringify(this.getPostData())
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('sign reward save', response)
            Message.success('保存成功')
          }
        })
      })
    },
    handlePreOn(ob) {
      console.log(ob.uid)
      this.changeStatus(ob, 1, '您确定要将机器人修改为正常使用状态吗？该记录将同步到外网。')
    },
    handlePreOff(ob) {
      console.log(ob.uid)
      this.changeStatus(ob, 0, '您确定要将机器人修改为冻结状态吗？该记录将同步到外网。')
    },
    changeStatus(ob, status, msg) {
      console.log(status)
      const $this = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: $this.env,
            uid: ob.uid,
            status: status,
            Path: '/' + this.cgiPath + '/update/status'
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            ob.status = status
            $this.clientDB.UpdateData2('uid', ob)
          } else {
            Message.error('修改记录状态失败！')
            $this.refresh()
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    getList() {
      const _this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: _this.env,
          Path: '/' + this.cgiPath + '/list',
          Page: 1,
          PageNum: 500
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          this.totalData = objs

          for (let i = 0; i < objs.length; i++) {
            objs[i].money /= 1000
            objs[i].initMoney /= 1000
            objs[i].currentTableMoney /= 1000
            objs[i].allowTableMoney /= 1000
          }
          objs.sort(function(a, b) {
            return a.currentTid - b.currentTid
          })
          this.clientDB = new ClientTableData(objs, 20, filterMap, 'status', -1)
          this.handleCurrentChange(1)
          const statMap = {}
          for (let i = 0; i < objs.length; i++) {
            const item = objs[i]
            if (statMap[item.allowTableMoney] == null) {
              statMap[item.allowTableMoney] = { tableMoney: item.allowTableMoney, initMoney: 0, money: 0, gameCount: 0, workCount: 0, coldCount: 0, loserCount: 0 }
            }
            if (item.status == 0) {
              statMap[item.allowTableMoney].coldCount++
            } else {
              statMap[item.allowTableMoney].initMoney += item.initMoney
              statMap[item.allowTableMoney].money += item.money
              if (item.status == 1) {
                statMap[item.allowTableMoney].workCount++
              } else if (item.status == 2) {
                statMap[item.allowTableMoney].gameCount++
              }
            }
            if (item.money / item.initMoney < 0.2) {
              statMap[item.allowTableMoney].loserCount++
            }
          }
          this.statItems = []
          for (const o in statMap) {
            this.statItems.push(statMap[o])
          }
        }
        // loading.close()
      })
    },
    showChartDialog() {
      this.resetChartDialog()
      this.chartDialog.visible = true
      this.initChartDialog()
    },
    resetChartDialog() {
      // 重置表单数据
      this.chartDialog.form = {
        tableMoney: [],
        dateRange: []
      };

      // 清空图表数据
      this.chartData = {}
      this.maxy = 0
      this.ratioData = []
    },
    initChartDialog() {
      // 初始化场次选项
      this.tableMoneyOptions = []
      if (this.statItems && this.statItems.length > 0) {
        this.statItems.forEach(item => {
          this.tableMoneyOptions.push({
            value: item.tableMoney,
            label: `${item.tableMoney}`
          })
        })
      }

      // 初始化时间范围为今天
      const now = new Date()
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const endOfDay = new Date(startOfDay)
      endOfDay.setDate(startOfDay.getDate() + 1)

      this.chartDialog.form.dateRange = [startOfDay.getTime(), endOfDay.getTime()]
    },
    // 关闭图表弹窗
    closeChartDialog() {
      if (this.chartInstance) {
        this.chartInstance.dispose()
        this.chartInstance = null
      }
    },
    getRequestParams() {
      const startTime = Math.floor(this.chartDialog.form.dateRange[0] / 1000)
      const endTime = Math.floor(this.chartDialog.form.dateRange[1] / 1000)

      const params = {
        Path: '/log/robotlog',
        gid: this.gid,
        tableMoney: this.chartDialog.form.tableMoney * 1000,
        startTime: startTime,
        endTime: endTime
      }
      return params
    },
    getRobotList() {
      const params = this.getRequestParams()
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: params
      }).then(response => {
        if (response.RetCode === 0) {
          // this.pagination.total = 0
          const {
            list,
            max,
          } = response.Data
          // console.log('表格数据', list)
          // console.log('折线图数据', max)

          if (list && list.length > 0) {
            this.ratioData = list
            this.maxy = max
            this.drawLineChart()
          } else {
            this.$message.warning('没有折线图数据')
          }
        }
      })
    },
    drawLineChart() {
      function addZero(num) {
        return num < 10 ? '0' + num : num
      }

      const yData = [
        { Name: '机器人数量', Data: [] }
      ]
      const xData = []
      this.ratioData.forEach(item => {
        // 计算库存百分比
        yData[0].Data.push(item.count)
        // 横轴时间：MM-DD HH:mm
        const date = new Date(item.send_time * 1000)
        xData.push(`${addZero(date.getMonth() + 1)}-${addZero(date.getDate())} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`)
      })

      // console.log('折线图数据-yData ', yData)
      // console.log('折线图数据', this.maxy)

      this.chartData = {
        xData,
        yData,
        yShow: true
      }
    },

    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },

    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter(k, v) {
      console.log('k=>', k, 'v==>', v)
      this.clientDB.FilterData()
      this.refreshShow()
    },
    // 分页处理
    refreshShow() {
      this.tableData = this.clientDB.GetCurrentPageData()
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },

    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    // 操作类函数
    clickData(row, column, event) {
      if (row.status === 2) {
        return null
      }
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.uid)
        this.edit.visible = true
      }
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      if (ID) {
        const _data = this.getDataByUid(ID)
        if (_data) {
          Object.assign(this.edit.item, _data)
        }
      }
    },
    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    handleCopy(ob) {
      this.initFormData(true, ob.uid)
      this.edit.visible = true
    },
    getEditTitle() {
      this.isDisabled = this.edit.isEdit
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    getRobotData() {
      this.edit.item.money *= 1000
      this.edit.item.initMoney *= 1000
      this.edit.item.allowTableMoney *= 1000
      return this.edit.item
    },
    getEditData() {
      const o = {
        uid: this.edit.item.uid,
        initMoney: -1,
        allowTableMoney: -1,
        money: -1
      }
      this.edit.item.money *= 1000
      this.edit.item.initMoney *= 1000
      this.edit.item.allowTableMoney *= 1000
      const oldData = this.getDataByUid(this.edit.item.uid)
      if (oldData.nick != this.edit.item.nick) {
        o.nick = this.edit.item.nick
      }
      if (oldData.icon != this.edit.item.icon) {
        o.icon = this.edit.item.icon
      }
      if (oldData.initMoney != this.edit.item.initMoney) {
        o.initMoney = this.edit.item.initMoney
      }
      if (oldData.allowTableMoney != this.edit.item.allowTableMoney) {
        o.allowTableMoney = this.edit.item.allowTableMoney
      }
      return o
    },
    /*    checkData() {
      this.$refs['edit.item'].validate(valid => {})
      if (this.getRobotData().uid <= 0) {
        this.$alert('用户id不能为空')
        return false
      }
      return true
    },*/
    save() {
      // if (!this.checkData()) return
      if (this.edit.isEdit) {
        this.editSave(this.getEditData())
      } else {
        this.createSave(this.getRobotData())
      }
      this.edit.visible = false
    },
    getDataByUid(uid) {
      for (let i = 0; i < this.totalData.length; i++) {
        const data = this.totalData[i]
        if (data.uid === uid) {
          return data
        }
      }
      return null
    },
    editSave(postData) {
      postData.Env = this.env
      postData.Path = '/' + this.cgiPath + '/update/item'
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.edit.item.money /= 1000
          this.edit.item.initMoney /= 1000
          this.edit.item.allowTableMoney /= 1000
          this.clientDB.UpdateData2('uid', this.edit.item)

          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    createSave(postData) {
      postData.Env = this.env
      postData.Path = '/' + this.cgiPath + '/add/user'
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.AddData(this.edit.item)
          this.refreshShow()
          this.getList()
          Message.success('添加成功！')
        }
      })
    },
    // excel处理逻辑
    importData() {
      if (this.fileName === '') {
        Message.info('您需要先上传excel文件')
        return
      }
      const $this = this
      request({
        url: '/slotsActConfig/import/excel',
        method: 'post',
        data: {
          Gid: this.edit.item.Gid,
          FileName: this.edit.fileName
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const items = response.Data
          $this.edit.item.Acts = items
          const rets = []
          for (let i = 0; i < items.length; i++) {
            const rows = items[i]
            const newRow = []
            for (let j = 0; j < rows[0].length; j++) {
              const newCols = [j + 1]
              for (let r = 0; r < rows.length; r++) {
                newCols.push(rows[r][j])
              }
              newRow.push(newCols)
            }
            rets.push(newRow)
          }
          $this.edit.showActs = rets
          $this.edit.isNewImport = true
          Message.success('导入数据成功！')
        }
      })
    },
    handleSuccess(rsp, file, fileList) {
      this.edit.fileName = rsp.Data
      this.importData()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    getRobotDefenceLevel(level) {
      if (level === 0) {
        return '无'
      } else if (level === 3) {
        return '贴-陪玩'
      } else if (level === 4) {
        return '贴-弱杀'
      } else if (level === 5) {
        return '贴-强杀'
      } else if (level === 6) {
        return '贴-防作弊'
      } else if (level === 7) {
        return '预贴-陪玩'
      } else if (level === 8) {
        return '预贴-弱杀'
      } else if (level === 9) {
        return '预贴-强杀'
      } else if (level === 10) {
        return '贴-锁血强杀'
      } else if (level === 11) {
        return '预贴-锁血强杀'
      }
    },
  }
}
</script>
