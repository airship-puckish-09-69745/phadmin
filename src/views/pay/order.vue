<template>
  <div class="app-container">
    <el-row>
      <el-form ref="form" :model="form" :inline="true" label-width="120px">

        <el-form-item label="我方订单号">
          <el-input v-model="form.orderId" placeholder="我方订单号" size="mini" />
        </el-form-item>

        <el-form-item label="Uid">
          <el-input v-model="form.uid" placeholder="用户uid" size="mini" />
        </el-form-item>
        <el-form-item label="查询类型：">
          <el-select v-model="form.searchYear" size="mini">
            <el-option
              v-for="item in form.yearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="form.cTime"
            size="mini"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>
        <el-form-item label="AppID">
          <el-autocomplete
            v-model="form.appID"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          />
        </el-form-item>

        <pay-channel v-model="form.payChannel" :filter="true" :channel-map="form.channelMap" />

        <el-form-item label="平台订单号">
          <el-input v-model="form.orderNo" placeholder="平台订单号" size="mini" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择" size="mini">
            <el-option
              v-for="item in form.statusOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="支付方式">
          <el-select v-model="form.bankCode" placeholder="请选择" size="mini">
            <el-option
              v-for="item in form.bankCodeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="按金额排序" label-width="100px">
          <el-switch
            v-model="form.orderByAmount"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
          <el-button type="success" size="mini" @click="exportExcel">导出</el-button>
        </el-form-item>

        <span style="display:inline-block;margin: 6px 0 0 6px;color: red">支付成功率：{{ successTotal }} / {{ total }} = {{ showPaySuccessRatio() }}</span>

      </el-form>
    </el-row>
    <el-table
      :data="tableData"
      border
      stripe
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.TableCell(0)"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
      />
      <el-table-column
        prop="order_id"
        label="ID"
      />
      <el-table-column
        prop="app_id"
        label="AppID"
      />
      <el-table-column
        prop="AccountType"
        label="账号类型"
      >
        <template slot-scope="{row}">
          {{ showAccountType(row.AccountType) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="uid"
        label="Uid"
      />
      <el-table-column
        prop="goods_id"
        label="商品"
        width="150px"
      >
        <template slot-scope="scope">
          {{ showGoods(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="支付金额"
      >
        <template slot-scope="{row}">
          {{ toRupee(row.amount) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="item_num"
        label="获得数量"
      >
        <template slot-scope="{row}">
          {{ toRupee(row.item_num) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="pay_sys_id"
        label="支付渠道"
        width="100px"
      >
        <template slot-scope="scope">
          {{ formatPaySysId(scope.row.pay_sys_id) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="pay_sys_order"
        label="平台订单号"
        width="350px"
      />
      <el-table-column
        prop="pay_sys_channel"
        label="方式"
      />
      <el-table-column
        prop="status"
        label="状态"
        width="180px"
      >
        <template slot-scope="scope">
          {{ showStatus(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="pay_scene"
        label="支付场景"
        width="180px"
      >
        <template slot-scope="scope">
          {{ showPayScene(scope.row.pay_scene) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="申请时间"
        width="130px"
      >
        <template slot-scope="{row}">
          <DateTimeShow :show-type="7" :timestamp="row.create_time"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="deliver_time"
        label="发货时间"
        width="130px"
      >
        <template slot-scope="{row}">
          <DateTimeShow :show-type="7" :timestamp="row.deliver_time"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="操作"
        width="200px"
      >
        <template slot-scope="scope">
          <el-button v-if="hasEditPerm && [0,1,4].indexOf(scope.row.status) !== -1" size="mini" class="tableButton" type="primary" @click="deliveryClick2(scope.row.order_id)">发货</el-button>
          <el-button v-if="canQueryOrder(scope.row.pay_sys_order, scope.row.pay_sys_id)" type="primary" size="mini" class="tableButton" @click="queryThirdOrder(scope.row.order_id, scope.row.uid)">支付平台查询</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="limit"
            layout="slot, total, sizes, prev, next"
            prev-text="上一页"
            next-text="下一页"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
            <span class="pageSizeInput" style="padding-right: 10px">
              当前页：{{ page }}/{{ Math.floor((total+limit)/limit) }}
            </span>

          </el-pagination>
        </div>
      </el-col>
    </el-row>

    <div style="margin-top: 20px">
      <el-button type="success" @click="showBatchOrderDelivery">批量发货</el-button>
      <el-button type="primary" @click="queryBatchLogs">批量发货操作日志</el-button>
      <el-button type="success" v-if="hasExportPer()" @click="exportMonthBtn">支付渠道按月导出</el-button>
    </div>

    <el-dialog
      title="导出"
      :visible.sync="exportMonth.show"
      width="30%"
    >
      <span>
        <div class="block">
          <el-alert
            title="导出指定月份的支付/提现成功的订单数和金额"
            type="success"
            show-icon>
          </el-alert>
          <el-alert
            title="不能导出当前月份的数据"
            type="error"
            show-icon>
          </el-alert>
        </div>
        <br/>
        <div class="block">
          <el-date-picker
            v-model="exportMonth.month"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月"
          />
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportMonth.show = false">取 消</el-button>
        <el-button type="primary" @click="queryPayMonthData">导 出</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="第三方查询订单信息"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="dialogClose"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="交易状态">{{ queryOrderInfo.status }}</el-descriptions-item>
        <el-descriptions-item label="描述信息">{{ queryOrderInfo.msg }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog
      title="确认发货"
      :visible.sync="deliveryDialog.show"
      width="30%"
      :before-close="deliveryDialogClose"
    >
      <h3>确定要尝试发货吗？</h3>
      <div>
        <el-form ref="deliveryFrm" :model="deliveryDialog">
          <el-checkbox v-model="deliveryDialog.isAdmin">是否强制发货</el-checkbox>
          <br>
          <small style="color: red">强制发货不会去支付平台查询订单情况，需要自己去支付平台确认</small>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deliveryDialog.show = false">取 消</el-button>
        <el-button type="primary" @click="deliverySubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-------------批量发货预览start----------->
    <el-dialog
      title="批量发货预览"
      :visible.sync="batchDeliveryShow"
      width="60%"
      :before-close="batchDeliveryClose"
    >
      <div class="batch-delivery-preview">
        <el-table
          :data="batchQueryData"
          style="width: 100%"
        >
          <el-table-column
            prop="orderId"
            label="订单ID"
            width="180"
          />
          <el-table-column
            prop="status"
            label="状态"
            width="180"
          />
          <el-table-column
            prop="result"
            label="处理结果"
          >
            <template slot-scope="scope">
              <el-link v-if="scope.row.result === 1" type="success" :underline="false">成功</el-link>
              <el-link v-else-if="scope.row.result === 2" type="danger" :underline="false">失败</el-link>
              <el-link v-else type="info" :underline="false">待处理</el-link>
            </template>
          </el-table-column>
        </el-table>

        <el-form ref="form" :model="form">
          <el-form-item>
            <el-input v-model="batchRemark" type="textarea" :rows="3" placeholder="批量处理的理由" />
          </el-form-item>
        </el-form>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="disableDeliveryBtn" @click="batchDeliverySubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-------------批量发货预览end----------->

    <!-------------批量发货操作日志start----------->
    <el-dialog
      title="批量操作日志"
      :visible.sync="batchLogs.show"
      width="60%"
      :before-close="batchLogClose"
    >
      <div class="batch-delivery-preview">
        <el-table
          :data="batchLogs.data"
          style="width: 100%"
        >
          <el-table-column
            prop="Operator"
            label="操作人"
            width="180"
          />
          <el-table-column
            prop="CreateTime"
            label="操作时间"
            width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.CreateTime | parseTime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="Remark"
            label="备注"
            width="180"
          />
          <el-table-column
            prop="OrderSuccess"
            label="成功订单"
          />
          <el-table-column
            prop="OrderFailed"
            label="失败订单"
          />
        </el-table>
        <el-row type="flex" justify="end">
          <el-col :span="12">
            <div class="block">
              <el-pagination
                :current-page="batchLogs.page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="batchLogs.limit"
                layout="slot, total, sizes, prev, next"
                prev-text="上一页"
                next-text="下一页"
                :total="batchLogs.total"
                @size-change="batchLogsSizeChange"
                @current-change="batchLogsCurrentChange"
              >
                <span class="pageSizeInput" style="padding-right: 10px">
                  当前页：{{ batchLogs.page }}/{{ Math.floor((batchLogs.total+batchLogs.limit)/batchLogs.limit) }}
                </span>

              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-------------批量发货操作日志end----------->

  </div>
</template>
<script>
import { $libDate, $libShow } from '@/utils/common'
import request from '@/utils/request'
import store from '@/store'
import PayChannel from '@/components/PayChannel'
import { parseTime } from '@/utils'
import DateTimeShow from "@/components/DatetimeShow";

export default {
  components: {DateTimeShow, PayChannel },
  data() {
    return {
      form: {
        orderId: 0,
        uid: 0,
        orderByAmount: false,
        orderNo: '',
        searchYear: 0,
        cTime: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
        appID: 0,
        status: -1,
        statusOption: [
          { 'label': '所有', 'value': -1 },
          { 'label': '待支付', 'value': 0 },
          { 'label': '发货中', 'value': 1 },
          { 'label': '支付成功', 'value': 2 },
          { 'label': '取消支付', 'value': 3 },
          { 'label': '订单异常', 'value': 4 },
          { 'label': '支付失败', 'value': 9 }
        ],
        yearOptions: [
          { 'label': '最近三十天', 'value': 0},
          { 'label': '2023年', 'value': 2023},
          { 'label': '2022年', 'value': 2022},
        ],
        bankCode: '',
        bankCodeOption: [
          { 'label': '所有', 'value': '' },
          { 'label': 'india_upi', 'value': 'india_upi' },
          { 'label': 'Paytm', 'value': 'Paytm' }
        ],
        payChannel: 0,
        channelMap: {} // 接收channel map映射
      },
      hasEditPerm: false,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      libShow: $libShow,
      successTotal: 0,
      total: 0,
      page: 1,
      offsetID: 0, // 当前页
      allItems: [],
      limit: 10,
      tableData: [],
      dialogVisible: false,
      queryOrderInfo: {
        status: '',
        msg: ''
      },
      exportData: [],
      exportOffsetID: 0, // 导出数据偏移id

      deliveryDialog: {
        show: false,
        orderId: 0,
        isAdmin: false
      },

      exportMonth: {
        show: false,
        month: ''
      },

      appData: [
        { 'value': '自运营（android）', 'app': 100000001 },
        { 'value': '联运发行（galaxy）', 'app': 100000002 },
        { 'value': '联运线下（逆光）', 'app': 100000003 }
      ],

      // 批量操作发货
      batchDeliveryLoading: false,
      batchDeliveryShow: false, // 批量发货是否显示
      batchQueryData: [], // 批量查询数据
      batchRemark: '',
      disableDeliveryBtn: false, // 禁止提交发货按钮
      selectTableData: [], // 全选数据

      paySceneMap: {}, //支付场景

      // 批量发货日志
      batchLogs: {
        show: false, // dialog是否显示
        data: [], // 操作日志
        total: 0,
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    console.log(1)
    const pers = store.getters.pers
    this.hasEditPerm = (pers['ORDER_MANAGE'] & 2) > 0
    this.getPayScene()
  },
  methods: {
    loading() {
      this.tempLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    loadingClose() {
      const $this = this
      setTimeout(function() {
        $this.tempLoading.close()
      }, 1000)
    },
    showPayScene(sid) {
      return this.paySceneMap[sid] ? this.paySceneMap[sid] : sid
    },
    getPayScene() {
      const that = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/other/pay/scenes',
          env: this.$store.getters.env
        }
      }).then(function(response) {
        if (response.RetCode === 0) {
          that.paySceneMap = response.Data
        }
      })
    },
    // 是否有导出权限
    hasExportPer() {
      return ['byronqiu', 'yoyo'].indexOf(this.$store.getters.name) >= 0
    },
    exportMonthBtn() {
      this.exportMonth.show = true
    },

    // 查询支付渠道月支付数据
    queryPayMonthData() {
      if (this.exportMonth.month === '') {
        this.$message.error('请选择月份')
        return
      }
      console.log(this.exportMonth.month)
      const arr = this.exportMonth.month.split('-')
      const year = arr[0]
      const month = arr[1]
      const curMonth = (new Date).getMonth() + 1
      if (curMonth === parseInt(month)) {
        this.$message.error('不能导出当前月份')
        return
      }

      this.loading()

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/log/query/pay/platform/summary',
          env: this.$store.getters.env,
          year: year,
          month: month
        }
      }).then(response => {
        console.log('pay platform', response)
        this.exportMonth.show = false
        const data = []
        for (const i in response.Data) {
          const tmp = []
          if (response.Data[i]['DataType'] === 2) {
            tmp.push('提现')
          } else {
            tmp.push('支付')
          }
          tmp.push(response.Data[i]['PayName'])
          tmp.push(response.Data[i]['Count'])
          tmp.push(response.Data[i]['Amount'] / 1000)

          data.push(tmp)
        }

        import('@/vendor/Export2Excel').then(async excel => {
          const max = Math.ceil(this.total / 200)
          for (let i = 1; i <= max; i++) {
            await this.getExportData(i)
          }

          const header = [
            '类型', '渠道', '笔数', '金额'
          ]
          const filename = '支付提现' + this.exportMonth.month + '月份'
          excel.export_json_to_excel({
            header: header, // 表头 必填
            data, // 具体数据 必填
            filename: filename, // 非必填
            autoWidth: true, // 非必填
            bookType: 'xlsx' // 非必填
          })

          this.loadingClose()
        })
      })
    },

    // 查询批量发货日志
    batchLogClose(done) {
      this.batchLogs.show = false
      done()
    },
    queryBatchLogs() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/query/batch/order/delivery/log',
          page: this.batchLogs.page,
          limit: this.batchLogs.limit,
          env: this.$store.getters.env
        }
      }).then(response => {
        console.log('query logs', response)
        this.batchLogs.show = true
        this.batchLogs.data = response.Data.items
        if (this.batchLogs.page === 1) {
          this.batchLogs.total = response.Data.total
        }
      })
    },
    batchLogsSizeChange(limit) {
      this.batchLogs.limit = limit
      this.queryBatchLogs()
    },
    batchLogsCurrentChange(page) {
      this.batchLogs.page = page
      this.queryBatchLogs()
    },

    handleSelectionChange(data) {
      console.log('全选数据', data)
      this.selectTableData = data
    },
    batchDeliveryClose(done) {
      this.batchDeliveryShow = false
      this.batchRemark = ''
      this.disableDeliveryBtn = false
      done()
    },
    showBatchOrderDelivery() {
      if (!this.selectTableData || this.selectTableData.length === 0) {
        this.$message.error('没有选择数据')
        return
      }

      if (!this.checkSelectData()) {
        this.$message.error('批量发货只处理异常状态的订单')
        return
      }

      this.loading()
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/batch/query/order',
          orderInfo: this.getQueryOrderInfo()
        }
      }).then(response => {
        console.log('batch query', response)
        // this.batchQueryData = response.Data
        this.transQueryData(response.Data)
        this.batchDeliveryShow = true
        this.loadingClose()
      })
    },
    checkSelectData() { // 检测全选数据是否正确，只处理异常状态订单
      let ret = true
      for (const i in this.selectTableData) {
        if (this.selectTableData[i]['status'] !== 4) {
          ret = false
          break
        }
      }

      return ret
    },
    getQueryOrderInfo() { // 获取查询的订单参数信息
      const param = []
      for (const i in this.selectTableData) {
        param.push({
          'Id': this.selectTableData[i]['order_id'],
          'Uid': this.selectTableData[i]['uid']
        })
      }

      return JSON.stringify(param)
    },
    transQueryData(data) { // 转化查询的数据
      this.batchQueryData = []
      for (const i in this.selectTableData) {
        let status = ''
        for (const k in data) {
          if (data[k]['orderId'] === this.selectTableData[i]['order_id']) {
            status = data[k]['status']
            break
          }
        }

        this.batchQueryData.push({
          'orderId': this.selectTableData[i]['order_id'],
          'status': status,
          'result': 0
        })
      }
    },
    batchDeliverySubmit() { // 提交批量发货申请
      if (!this.batchRemark) {
        this.$message.error('请输入操作理由')
        return
      }
      const orderIds = []
      for (const i in this.batchQueryData) {
        orderIds.push(this.batchQueryData[i]['orderId'])
      }
      if (!orderIds || orderIds.length <= 0) {
        this.$message.error('没有待处理订单')
        return
      }

      this.batchOrderDelivery(JSON.stringify(orderIds), this.batchRemark)
    },
    batchOrderDelivery(orderIds, remark) { // 批量发货api
      this.loading()
      this.disableDeliveryBtn = true
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/user/batch/order/delivery',
          orderIds: orderIds,
          env: this.$store.getters.env,
          operator: this.$store.getters.name,
          remark: remark
        }
      }).then(response => {
        console.log('batch delivery', response) // 返回的数据是发货失败的订单id数组
        for (const i in this.batchQueryData) {
          // 查询的状态是支付成功
          if (this.batchQueryData[i]['status'] === '成功') {
            if (response.Data && response.Data.indexOf(this.batchQueryData[i]['orderId']) >= 0) {
              this.batchQueryData[i]['result'] = 2 // 发货失败
            } else {
              this.batchQueryData[i]['result'] = 1

              // 更新订单列表
              for (const t in this.tableData) {
                if (this.tableData[t]['order_id'] === this.batchQueryData[i]['orderId']) {
                  this.tableData[t]['status'] = 2
                  break
                }
              }
            }
          }
        }

        this.loadingClose()
      })
    },

    deliveryDialogClose(done) {
      this.deliveryDialog.show = false
      done()
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.appData
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants

      cb(results)
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      console.log('select', item)
      this.form.appID = item.app
    },

    dialogClose(done) {
      this.dialogVisible = false
      done()
    },
    deliveryClick(orderId) {
      const $this = this
      this.$confirm('确定要尝试发货?', '提示').then(() => {
        $this.Delivery(orderId)
      })
    },
    deliveryClick2(orderId) {
      this.deliveryDialog.show = true
      this.deliveryDialog.orderId = orderId
    },
    deliverySubmit() {
      this.Delivery(this.deliveryDialog.orderId)
      this.deliveryDialog.show = false
      this.deliveryDialog.isAdmin = false
    },
    toRupee(amount) {
      return parseInt(amount) / 1000
    },
    canQueryOrder(order, paySysId) {
      return !/^FAKE_/i.test(order) || paySysId == 8 // 逆光支付发货前都是FAKE_前缀的平台订单号，但可以使用我方的订单ID去查询
    },
    formatPaySysId(paySysId) {
      // eslint-disable-next-line no-prototype-builtins
      return this.form.channelMap.hasOwnProperty(paySysId) ? this.form.channelMap[paySysId] : paySysId
    },
    showGoods(row) {
      return row.goods_id + '. ' + row.goods_name
    },
    showStatus(status) {
      let name = ''
      switch (status) {
        case 0:
          name = '待支付'
          break
        case 1:
          name = '发货中'
          break
        case 2:
          name = '支付成功'
          break
        case 3:
          name = '取消支付'
          break
        case 4:
          name = '订单异常'
          break
        case 9:
          name = '支付失败'
          break
      }
      return status + '.' + name
    },
    showAccountType(t) {
      let name = ''
      switch (t) {
        case 1:
          name = '游客'
          break
        case 2:
          name = 'FB'
          break
        case 3:
          name = '邮箱'
          break
        case 4:
          name = '手机号'
          break
      }
      return t + '.' + name
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.getPageData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.getPageData()
    },
    transTime(t) {
      if (!t) {
        return 0
      }
      let time = t
      if (typeof t !== 'number') {
        time = t.getTime()
      }
      return parseInt($libDate.SelectTimeToIndiaByZone(time) / 1000)
    },
    showPaySuccessRatio() {
      if (this.total <= 0) {
        return 0
      }

      return (this.successTotal / this.total * 100).toFixed(2) + '%'
    },
    getPageData() {
      if (this.offsetID == 0) {
        this.getData(this.offsetID, this.page, this.limit)
      } else {
        if (this.allItems.length < this.page * this.limit) {
          this.getData(this.offsetID, this.page, this.limit)
        } else {
          this.setTableData(this.page, this.limit)
        }
      }
    },
    setTableData(page, limit) {
      this.tableData = []
      for (let i = (page - 1) * limit; i < page * limit && i < this.allItems.length; i++) {
        this.tableData.push(this.allItems[i])
      }
    },
    getInfo() {
      this.offsetID = 0
      this.page = 1
      this.allItems = []
      this.getData(this.offsetID, this.page, this.limit)
    },
    getData(offsetID, page, limit) {
      const $this = this
      let createSts, createEts
      if (this.form.cTime) {
        createSts = this.transTime(this.form.cTime[0])
        createEts = this.transTime(this.form.cTime[1])
      }
      //不允许跨年查询
      if (this.form.searchYear > 0) {
        var startYear = new Date(createSts*1000).getFullYear()
        var endYear = new Date(createEts*1000).getFullYear()
        if (startYear != endYear) {
          $this.$message.error("暂不支持跨年查询！")
          return false
        } else if (this.form.searchYear != startYear) {
          $this.$message.error("查询时间段跟年份不匹配！")
          return false
        }
      }
      console.log('form appid ', this.form.appID)

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/order/list',
          OrderId: this.form.orderId,
          Uid: this.form.uid,
          OrderNo: this.form.orderNo,
          CreateTimeSts: createSts,
          CreateTimeEts: createEts,
          Status: this.form.status,
          BankCode: this.form.bankCode,
          PaySysId: this.form.payChannel,
          OffsetID: offsetID,
          Limit: 400, // 一次性取400条回来，满足大部分需求，减少请求
          OrderByAmount: this.form.orderByAmount ? 1 : 0,
          AppID: this.form.appID,
          SearchYear: this.form.searchYear
        }
      }).then(response => {
        console.log('order list', response)
        let items = []
        if (response.Data && response.Data.Items) {
          items = response.Data.Items
        }
        if (items.length > 0) {
          $this.allItems = $this.allItems.concat(items)
          $this.offsetID = items[items.length - 1].order_id
          $this.setTableData(page, limit)
          $this.total = response.Data.Total
          $this.successTotal = response.Data.SuccessTotal
        }
      })
    },
    Delivery(id) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/user/order/delivery',
          orderId: id,
          operator: this.$store.getters.name,
          isAdmin: this.deliveryDialog.isAdmin ? 1 : 0
        }
      }).then(response => {
        console.log('order list', response)
        if (response.RetCode === 0) {
          for (const i in $this.tableData) {
            if ($this.tableData[i].order_id === id) {
              $this.tableData[i].status = 2
              break
            }
          }
          $this.$message.success('发货成功')
        } else {
          $this.$message.error(response.Data)
        }
      })
    },
    queryThirdOrder(id, uid) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/query/third/order',
          orderId: id,
          uid: uid
        }
      }).then(response => {
        console.log('order list', response)
        if (response.RetCode === 0) {
          $this.dialogVisible = true
          $this.queryOrderInfo = response.Data
        } else {
          $this.$message.error(response.Data)
        }
      })
    },
    // 导出
    async getExportData(page) {
      // const $this = this
      const $this = this
      let createSts, createEts
      if (this.form.cTime) {
        createSts = this.transTime(this.form.cTime[0])
        createEts = this.transTime(this.form.cTime[1])
      }
      const response = await request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/order/list',
          OrderId: this.form.orderId,
          Uid: this.form.uid,
          OrderNo: this.form.orderNo,
          CreateTimeSts: createSts,
          CreateTimeEts: createEts,
          Status: this.form.status,
          BankCode: this.form.bankCode,
          PaySysId: this.form.payChannel,
          // Page: page, 分页已经用不到
          Limit: 200,
          AppID: this.form.appID,
          OffsetID: this.exportOffsetID
        }
      })

      console.log('export order list', response)
      if (response.Data && response.Data.Items) {
        for (const i in response.Data.Items) {
          const tmp = []
          tmp.push(response.Data.Items[i]['order_id'])
          tmp.push(response.Data.Items[i]['app_id'])
          tmp.push(this.showAccountType(response.Data.Items[i]['AccountType']))
          tmp.push(response.Data.Items[i]['uid'])
          tmp.push(this.showGoods(response.Data.Items[i]))
          tmp.push(this.toRupee(response.Data.Items[i]['amount']))
          tmp.push(this.toRupee(response.Data.Items[i]['item_num']))
          tmp.push(this.formatPaySysId(response.Data.Items[i]['pay_sys_id']))
          tmp.push(response.Data.Items[i]['pay_sys_order'])
          tmp.push(response.Data.Items[i]['pay_sys_channel'])
          tmp.push(this.showStatus(response.Data.Items[i]['status']))
          tmp.push(parseTime(response.Data.Items[i]['create_time']))
          tmp.push(parseTime(response.Data.Items[i]['deliver_time']))

          this.exportData.push(tmp)
        }
        this.exportOffsetID = response.Data.Items[response.Data.Items.length - 1]['order_id']
      }
    },
    getFileName() {
      const dt = new Date()
      const h = dt.getHours()
      const m = dt.getMinutes()
      const s = dt.getSeconds()
      return '订单列表' + h + m + s
    },
    exportExcel() {
      import('@/vendor/Export2Excel').then(async excel => {
        if (this.total === 0) {
          this.$message.error('没有导出数据，或者先查询')
          return
        }

        if (this.total > 10000) {
          this.$message.error('导出数据量太大(' + this.total + ')，可能会影响线上业务，请缩小搜索范围')
          return
        }

        this.exportData = []
        this.exportOffsetID = 0

        const max = Math.ceil(this.total / 200)
        for (let i = 1; i <= max; i++) {
          await this.getExportData(i)
        }

        const data = this.exportData
        const header = [
          'ID', 'AppID', '账号类型', 'Uid', '商品', '支付金额', '获得数量',
          '支付渠道', '平台订单号', '方式', '状态', '申请时间', '发货时间'
        ]
        const filename = this.getFileName()
        excel.export_json_to_excel({
          header: header, // 表头 必填
          data, // 具体数据 必填
          filename: filename, // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.cell .el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
.tableButton {
  padding: 4px 5px;
  font-size: 12px;
  border-radius: 4px;
}

.el-form-item{
  margin-bottom: 0px;
}
</style>

