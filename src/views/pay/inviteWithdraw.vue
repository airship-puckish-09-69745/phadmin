<template>
  <div class="app-container">
    <el-row>
      <el-form ref="form" :model="form" :inline="true" label-width="80px">
        <el-form-item label="uid">
          <el-input v-model="form.uid" size="mini" placeholder="用户uid" />
        </el-form-item>

        <el-form-item label="申请时间">
          <el-date-picker
            v-model="form.applyTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            size="mini"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择" size="mini">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="应用ID">
          <el-select v-model="form.appId" placeholder="请选择" size="mini">
            <el-option
              v-for="item in appidOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
      stripe
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.TableCell(0)"
    >
      <el-table-column
        prop="ID"
        label="ID"
      />
      <el-table-column
        prop="Appid"
        label="应用ID"
      />
      <el-table-column
        prop="Uid"
        label="Uid"
      >
        <template slot-scope="scope">
          <el-button type="text" size="mini">{{ scope.row.Uid }}</el-button>
          <i class="el-icon-copy-document" style="margin: 0 5px" @click="copyText(scope.row.Uid)" />
          <i class="el-icon-search" @click="goUserInfo(scope.row.Uid)" />
        </template>
      </el-table-column>
      <el-table-column
        prop="Amount"
        label="提现金额"
      >
        <template slot-scope="scope">
          {{ scope.row.Amount | toRupee }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Status"
        label="状态"
      >
        <template slot-scope="scope">
          <span :style="'color:'+ showStatus(scope.row.Status, 2)">{{ showStatus(scope.row.Status, 1) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ApplyTime"
        label="申请时间"
      >
        <template slot-scope="scope">
          <DateTimeShow :show-type="7" :timestamp="scope.row.ApplyTime" />
        </template>
      </el-table-column>
      <el-table-column
        prop="FinishTime"
        label="到账时间"
      >
        <template slot-scope="scope">
          <DateTimeShow :show-type="7" :timestamp="scope.row.FinishTime" />
        </template>
      </el-table-column>
      <el-table-column
        prop="Remark"
        label="备注"
      />
      <el-table-column
        prop="Operator"
        label="操作人"
      />
      <el-table-column
        prop="FinishTime"
        label="操作"
        fixed="right"
        width="300px"
      >
        <template slot-scope="scope">
          <el-button v-if="[0,6].indexOf(scope.row.Status)>=0" type="success" size="mini" class="tableButton" @click="operate(scope.row.ID, 1)">通过</el-button>
          <el-button v-if="[0].indexOf(scope.row.Status)>=0" type="warning" size="mini" class="tableButton" @click="showRemark(scope.row)">挂起</el-button>
          <el-button v-if="[0,6].indexOf(scope.row.Status)>=0" type="danger" size="mini" class="tableButton" @click="operate(scope.row.ID, 2)">拒绝且退款</el-button>
          <el-button v-if="[0,6].indexOf(scope.row.Status)>=0" type="danger" size="mini" class="tableButton" @click="operate(scope.row.ID, 3)">拒绝不退款</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="pageInfo.GetCurrentPage()"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageInfo.GetPageNum()"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageInfo.GetTotalCount()"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>

    <!--编辑备注start-->
    <el-dialog
      title="挂起备注"
      :visible.sync="pending.show"
      width="30%"
      :before-close="remarkClose"
    >
      <span>
        <el-form ref="form">
          <el-form-item>
            <el-input v-model="pending.remark" type="textarea" :rows="5" />
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pending.show = false">取 消</el-button>
        <el-button type="primary" @click="updateRemark">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑备注end-->
  </div>
</template>

<script>
import { $libDate, $libShow, $libType, ClientTableData, MoneyShow, Pagination } from '@/utils/common'
import request from '@/utils/request'
import DateTimeShow from '@/components/DatetimeShow'

export default {
  name: 'InviteWithdraw',
  components: { DateTimeShow },
  data() {
    return {
      tableData: [],
      form: {
        uid: 0,
        status: -1,
        appid: 0,
        applyTime: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())]
      },
      statusOption: [
        { 'label': '所有', 'value': -1 },
        { 'label': '未关闭', 'value': 100 },
        { 'label': '待审核&申请中', 'value': 0 },
        { 'label': '审核通过&提现中', 'value': 1 },
        { 'label': '提现成功&已到账', 'value': 2 },
        { 'label': '拒绝且退款', 'value': 3 },
        { 'label': '拒绝不退款', 'value': 4 },
        { 'label': '用户取消并退款', 'value': 5 },
        { 'label': '挂起', 'value': 6 },
        { 'label': '失败可重试', 'value': 7 },
        { 'label': '锁定中', 'value': 8 },
        { 'label': '提现失败', 'value': 9 }
      ],
      appidOption: [
        { 'label': '所有', 'value': 0 },
        { 'label': '1', 'value': 1 },
        { 'label': '10015', 'value': 10015 }
      ],
      libShow: $libShow,
      pending: { // 挂起操作
        show: false,
        id: 0,
        remark: ''
      },
      pageInfo: new Pagination(0, 10),
      pickerOptions: $libShow.DefaultDatePickerOptions()
    }
  },
  created() {

  },
  methods: {
    showRemark(row) {
      this.pending.show = true
      this.pending.remark = row.Remark
      this.pending.id = row.ID
    },
    remarkClose(done) {
      this.pending.show = false
      done()
    },
    updateRemark() {
      if (this.pending.remark === '') {
        this.$message.error('备注内容不能为空')
        return
      }
      this.operate(this.pending.id, 4)
      this.pending.show = false
    },
    copyText(txt) {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', txt)
      input.select()
      document.execCommand('copy') // 执行浏览器复制命令
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success('复制成功')
      }
      document.body.removeChild(input)
    },
    // 跳转到用户信息查询页面
    goUserInfo(uid) {
      // this.setIntoStorage(uid)
      this.$router.push({
        path: '/player/userManage',
        query: {
          uid: uid
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageInfo.SetPageNum(val)
      this.getData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageInfo.SetPageNo(val)
      this.getData()
    },
    showStatus(status, iType) {
      let name = ''
      let color = ''
      switch (status) {
        case 0:
          name = '待审核'
          color = 'red'
          break
        case 1:
          name = '通过&三方处理'
          color = 'green'
          break
        case 2:
          name = '成功&已到账'
          color = 'green'
          break
        case 3:
          name = '拒绝且退款'
          color = 'gray'
          break
        case 4:
          name = '拒绝不退款'
          color = 'gray'
          break
        case 5:
          name = '用户取消'
          color = 'gray'
          break
        case 6:
          name = '挂起'
          color = 'gray'
          break
        case 7:
          name = '失败，可重试'
          color = 'gray'
          break
        case 8:
          name = '锁定中'
          color = 'red'
          break
        case 9:
          name = '失败,用户可退'
          color = 'red'
          break
      }
      return iType == 1 ? status + '.' + name : color
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
    getData() {
      const $this = this
      let applySts, applyEts
      if (this.form.applyTime) {
        applySts = this.transTime(this.form.applyTime[0])
        applyEts = this.transTime(this.form.applyTime[1])
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/invite/withdraw/list',
          uid: this.form.uid,
          status: this.form.status,
          page: this.pageInfo.GetCurrentPage(),
          limit: this.pageInfo.GetPageNum(),
          appid: this.form.appid,
          applyStartTime: applySts,
          applyEndTime: applyEts
        }
      }).then(response => {
        console.log('data response', response)
        if (response.RetCode === 0) {
          $this.tableData = response.Data.rows
          $this.pageInfo.SetTotalCount(response.Data.total)
        } else {
          $this.$message.error(response.Data)
        }
      })
    },
    operate(withdrawId, opType) {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/user/invite/withdraw/update',
          withdrawId: withdrawId,
          opType: opType,
          remark: this.pending.remark,
          operator: this.$store.getters.name
        }
      }).then(response => {
        console.log('response ', response)
        if (response.RetCode === 0) {
          $this.getData()
          $this.$message.success('操作成功')
        } else {
          $this.$message.error('操作失败')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table--medium .el-table__cell {
  padding: 5px 0;
}

.tableButton {
  padding: 4px 5px;
  font-size: 12px;
  border-radius: 4px;
}
</style>
