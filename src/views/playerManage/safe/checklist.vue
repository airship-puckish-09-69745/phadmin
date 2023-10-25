665<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="80px" :inline="true" size="small">
        <el-form-item label="日期：">
          <el-date-picker
            v-model="item.dayTime"
            type="date"
            size="mini"
            value-format="timestamp"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item label="步骤:" label-width="50px">
          <el-select v-model.number="item.step" size="mini" placeholder="请选择">
            <el-option label="A->B验证" :value="1" />
            <el-option label="登录验证" :value="2" />
            <el-option label="注册验证" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item :label="item.step==1?'包名：':'AppID：'">
          <el-input v-model.number="item.pkg" size="mini" placeholder="可不填" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="getRate">成功比率</el-button>
        </el-form-item>
        <el-form-item v-if="rate.Total > 0">
          {{ rate.Succ }}/{{ rate.Total }}={{ (rate.Succ*100/rate.Total).toFixed(2) }}%
        </el-form-item>
        <el-form-item v-if="rate.Reg > 0">
          （注册检测/AB通过：{{ rate.Reg }}/{{ rate.Succ }}={{ (rate.Reg*100/rate.Succ).toFixed(2) }}%）
        </el-form-item>
        <el-row>
          <el-form-item label="过滤类别:">
            <el-select v-model.number="item.iType" size="mini" placeholder="请选择">
              <el-option label="无" :value="0" />
              <el-option label="按IP" :value="2" />
              <el-option label="按设备" :value="4" />
              <el-option label="按Uid" :value="3" />
              <el-option label="是否通过" :value="8" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="item.search"
              size="mini"
              placeholder="输入搜索内容"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
    <el-table
      v-if="tableVisible"
      ref="filterTable"
      :data="tableData"
      stripe
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :header-click="showNote"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="padding:10px;width: 100%"
    >
      <el-table-column
        prop="CTime"
        label="时间"
        width="200"
      >
        <template slot-scope="scope">
          {{ formatTime(scope.row.CTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Safe"
        label="通过"
        width="70"
      >
        <template slot-scope="scope">
          {{ scope.row.Safe == 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Type"
        label="原因"
        width="100"
      >
        <template slot-scope="scope">
          {{ getReason(scope.row.Type) }}
        </template>
      </el-table-column>

      <el-table-column
        width="150px"
      >
        <template slot="header">
          <span @click="showNote(1)">IP</span>
        </template>
        <template slot-scope="scope">
          <div @click="showInfo(1, scope.row)">
            <span>{{ scope.row.Ip }}</span>
            <div v-if="scope.row.IpReason">
              <span style="color: cornflowerblue">{{ scope.row.IpReason }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="Pkg"
        :label="item.step==1?'包名':'AppID'"
        width="250"
      >
        <template slot-scope="scope">
          {{ item.step==1?getPkgName(scope.row.Pkg):scope.row.Pkg }}
        </template>
      </el-table-column>
      <el-table-column
        prop="Device"
        width="400"
      >
        <template slot="header">
          <span @click="showNote(2)">设备码</span>
        </template>
        <template slot-scope="scope">
          <div @click="showSameInfo(2,scope.row)">
            <span :style="scope.row.showGreen?'background:lightgreen':''">{{ scope.row.Device }}</span>
            <div v-if="scope.row.DeviceReason">
              <span style="color: cornflowerblue">{{ scope.row.DeviceReason }}</span>
            </div>
            <el-button size="mini" icon="el-icon-edit" circle @click="showInfo(2, scope.row)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="item.step==1"
        prop="Power"
        label="电量"
        width="70"
      />
      <el-table-column
        v-if="item.step==2"
        prop="Uid"
        width="150"
      >
        <template slot="header">
          <span @click="showNote(3)">Uid</span>
        </template>
        <template slot-scope="scope">
          <div @click="showInfo(3, scope.row)">
            <span>{{ scope.row.Uid }}</span>
            <div v-if="scope.row.UidReason">
              <span style="color: cornflowerblue">{{ scope.row.UidReason }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="SimCountry"
        label="国家(Sim)"
        width="100"
      />
      <el-table-column
        prop="SimOperatorName"
        label="运营商"
        width="100"
      />
      <el-table-column
        prop="Source"
        label="来源"
        width="150"
      />
      <el-table-column
        prop="Invite"
        label="邀请码"
        width="100"
      />
    </el-table>

    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="修改"
      :visible.sync="edit.noteDialogVisible"
      width="30%"
    >
      <el-form label-width="80px">
        <el-form-item label="IP：">
          {{ edit.item.Key }}
        </el-form-item>
        <el-form-item label="说明：">
          <el-input v-model="edit.item.Val" type="textarea" :autosize="true" size="mini" />
        </el-form-item>
      </el-form>
      <el-col :offset="16">
        <el-button size="mini" type="primary" @click="updateNote()">提交</el-button>
      </el-col>
    </el-dialog>
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow, $libType } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'

const reasons = ['', 'IP白名单', '设备白名单', 'IP黑名单', '设备黑名单', 'IP不合法',
  'SIM不合法', '来源不合法', '邀请码问题', '注册电量100', '参数错误',
  '系统错误', '审核中']

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, UidInput },
  data() {
    return {
      tableData: [],
      totalCount: 0,
      currentPage: 0,
      pageNum: 10,
      tableVisible: false,
      libShow: $libShow,

      onlineMap: {},

      item: {
        step: 1,
        dayTime: $libDate.GetDayBegin(new Date().getTime()),
        pkg: '',
        iType: 0,
        search: ''
      },
      rate: {
        Succ: 0,
        Total: 0,
        Reg: 0
      },

      noteInfos: { // 用于缓存已经查找过的注释信息
        1: {},
        2: {},
        3: {}
      },

      edit: {
        item: {
          Type: 1,
          Key: '',
          Val: ''
        },
        noteDialogVisible: false
      }
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.getOnlineInfo()
    console.log(1)
  },
  methods: {
    getPkgName(pkg) {
      const ob = this.onlineMap[pkg]
      let appID = '不存在'

      if (ob) {
        appID = ob.RelatedAppID
      }
      return pkg + '【' + appID + '】'
    },
    getOnlineInfo() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/other/app/safe/status'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          for (const n in response.Data) {
            const ob = response.Data[n]
            $this.onlineMap[ob.PackageName] = ob
          }
        }
      })
    },
    getReason(n) {
      return reasons[n]
    },
    showSameInfo(iType, ob) {
      for (const o in this.tableData) {
        const item = this.tableData[o]
        this.tableData[o].showGreen = (item.Device === ob.Device)
      }
    },
    showNote(iType) {
      // 获取要查询的内容
      const obs = new Set()
      for (const o in this.tableData) {
        switch (iType) {
          case 1:
            if (!this.noteInfos[iType][this.tableData[o].Ip]) {
              obs.add(this.tableData[o].Ip)
            }
            break
          case 2:
            if (!this.noteInfos[iType][this.tableData[o].Device]) {
              obs.add(this.tableData[o].Device)
            }
            break
          case 3:
            if (!this.noteInfos[iType][this.tableData[o].Uid]) {
              obs.add(this.tableData[o].Uid)
            }
            break
        }
      }
      // 查询对应备注信息
      const $this = this
      request({
        url: '/other/comm/data',
        method: 'get',
        data: {
          Env: this.env,
          Type: iType,
          Keys: JSON.stringify([...obs])
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const tMap = response.Data || ''
          for (const o in tMap) {
            this.noteInfos[iType][o] = tMap[o]
          }

          $this.showReason()
        }
      })
    },
    showInfo(iType, ob) {
      this.edit.item.Type = iType
      switch (iType) {
        case 1:
          this.edit.item.Key = ob.Ip
          this.edit.item.Val = ob.IpReason
          break
        case 2:
          this.edit.item.Key = ob.Device
          this.edit.item.Val = ob.DeviceReason
          break
        case 3:
          this.edit.item.Key = ob.Uid
          this.edit.item.Val = ob.UidReason
          break
      }

      this.edit.noteDialogVisible = true
    },
    showReason() {
      for (const o in this.tableData) {
        if (this.noteInfos[1][this.tableData[o].Ip]) {
          this.tableData[o].IpReason = this.noteInfos[1][this.tableData[o].Ip]
        }

        if (this.noteInfos[2][this.tableData[o].Device]) {
          this.tableData[o].DeviceReason = this.noteInfos[2][this.tableData[o].Device]
        }

        if (this.noteInfos[3][this.tableData[o].Uid]) {
          this.tableData[o].UidReason = this.noteInfos[3][this.tableData[o].Uid]
        }
      }
    },
    updateNote() {
      const $this = this
      request({
        url: '/other/update/comm/data',
        method: 'post',
        data: {
          Env: this.env,
          Type: this.edit.item.Type,
          Key: this.edit.item.Key,
          Val: this.edit.item.Val
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('更新成功！')
          $this.edit.noteDialogVisible = false
          $this.noteInfos[$this.edit.item.Type][$this.edit.item.Key] = $this.edit.item.Val
          $this.showReason()
        }
      })
    },
    // 筛选相关逻辑
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter() {
      this.clientDB.FilterData()
      this.refreshShow()
    },

    // 显示相关
    handleSizeChange(val) {
      this.pageNum = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getInfo()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    getRate() {
      const $this = this
      this.rate.Total = 0
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/safe/check/list/rate',
          DayTime: $libDate.SelectTimeToIndia(this.item.dayTime) / 1000,
          PkgName: this.item.pkg,
          Step: this.item.step
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.rate = response.Data
        }
      })
    },
    getInfo() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/safe/check/list',
          DayTime: $libDate.SelectTimeToIndia(this.item.dayTime) / 1000,
          PkgName: this.item.pkg,
          Step: this.item.step,
          PageNo: this.currentPage,
          PageNum: this.pageNum,
          SearchType: this.item.iType,
          IntCond: $libType.IsNumber(this.item.search) ? this.item.search : 0,
          StrCond: this.item.search
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data.Items || []
          if (objs.length === 0) {
            $this.tableData = []
            $this.totalCount = 0
            Message.success('查询结果为空')
            return
          }
          for (const o in objs) {
            try {
              const ob = JSON.parse(objs[o].Sim)
              objs[o].SimCountry = ob.country
              objs[o].SimOperatorName = ob.operator_name
              objs[o].SimOperator = ob.sim_operator
            } catch (e) {
              console.log(objs[o])
            }
            objs[o].IpReason = ''
            objs[o].DeviceReason = ''
            objs[o].UidReason = ''
            objs[o].showGreen = false
          }
          $this.tableVisible = true
          $this.tableData = objs
          $this.totalCount = response.Data.TotalCount
          $this.currentPage = response.Data.CurrentPage
          $this.showReason()
        }
      })
    }
  }
}
</script>
