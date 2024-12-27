<template>
  <div class="app-container">

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="24">
        <el-form inline label-width="90px" :inline="true" size="small">
          <el-form-item label="日期：">
            <el-date-picker
              v-model="timeRange"
              :default-time="['00:00:00', '23:59:59']"
              type="datetimerange"
              value-format="timestamp"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              size="mini"
            />
          </el-form-item>
          <el-form-item label="Uid">
            <el-input v-model.number="fromData.Uid" placeholder="Uid" size="mini" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model.number="fromData.Status" placeholder="请选择" size="mini">
              <el-option label="所有" :value="0" />
              <el-option v-for="(k,v) in statusMap" :key="parseInt(v)" :label="k" :value="parseInt(v)" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="getData">查询</el-button>
            <el-button type="success" size="mini" @click="createData">创建申请</el-button>
          </el-form-item>
        </el-form>

      </el-col>
      <el-col :span="15" />
      <el-col>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          stripe
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.TableCell(0)"
        >
          <el-table-column label="AppId" width="75px">
            <template slot-scope="scope">
              {{ scope.row.app_id }}
            </template>
          </el-table-column>
          <el-table-column label="uid" width="90px">
            <template slot-scope="scope">
              {{ scope.row.uid }}
            </template>
          </el-table-column>
          <el-table-column label="游戏">
            <template slot-scope="scope">
              {{ gameMap[scope.row.game_id] }}
            </template>
          </el-table-column>

          <el-table-column label="申请时间" width="140px">
            <template slot-scope="scope">
              {{ formatTime(scope.row.apply_time) }}
            </template>
          </el-table-column>
          <el-table-column label="富裕卡等级" width="120px">
            <template slot-scope="scope">
              {{ scope.row.richcard_level + '星' }}
            </template>
          </el-table-column>
          <el-table-column label="富裕卡bet值" width="120px">
            <template slot-scope="scope">
              {{ scope.row.richcard_bet / 1000 }}
            </template>
          </el-table-column>
          <el-table-column label="富裕卡数量" width="120px">
            <template slot-scope="scope">
              {{ scope.row.richcard_count }}
            </template>
          </el-table-column>
          <el-table-column label="发放原因">
            <template slot-scope="scope">
              {{ scope.row.description }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              {{ statusMap[scope.row.status] }}
            </template>
          </el-table-column>
          <el-table-column label="最后操作时间" width="140px">
            <template slot-scope="scope">
              {{ formatTime(scope.row.applicant_time) }}
            </template>
          </el-table-column>
          <el-table-column label="申请人">
            <template slot-scope="scope">
              {{ scope.row.applicant_user }}
            </template>
          </el-table-column>
          <el-table-column label="审核时间">
            <template slot-scope="scope" width="140px">
              {{ scope.row.approval_time === 0 ? "-" : formatTime(scope.row.approval_time) }}
            </template>
          </el-table-column>
          <el-table-column label="审核人">
            <template slot-scope="scope">
              {{ scope.row.approval_user === '' ? "-" : scope.row.approval_user }}
            </template>
          </el-table-column>

          <el-table-column label="审核意见">
            <template slot-scope="scope">
              {{ scope.row.approval_description === '' ? "-" : scope.row.approval_description }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope" style="width: 100px;">
              <el-button
                v-if="showBtn(scope.row,[3])"
                type="text"
                :disabled="getDisable(scope.row,[3])"
                size="mini"
                @click="editData(scope.row)"
              >编辑
              </el-button>
              <el-button
                v-if="showBtn(scope.row,[3])"
                type="text"
                :disabled="getDisable(scope.row,[3])"
                size="mini"
                @click="initiateApplication(scope.row)"
              >发起申请
              </el-button>
              <el-button
                v-if="showBtn(scope.row,[6,2,8])"
                type="text"
                :disabled="getDisable(scope.row,[6,2,8])"
                size="mini"
                @click="execution(scope.row)"
              >发起发放/重试
              </el-button>
              <el-button
                v-if="showBtn(scope.row,[3])"
                type="text"
                :disabled="getDisable(scope.row,[3])"
                size="mini"
                @click="deleteForm(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            background
            :current-page="item.currPage"
            :page-sizes="[2]"
            :page-size="item.limit"
            layout=" prev, next"
            :total="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
    <el-dialog
      v-loading="true"
      :title="isEdit?'编辑':'创建'"
      :modal="false"
      :visible.sync="visibleData"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="800px"
    >
      <el-form ref="robotForm" :model="item" label-width="200px">
        <el-form-item v-model="item.AppID" label="App：" :required="true" label-width="120px">
          <el-select v-model="item.AppID" filterable placeholder="请选择" size="mini">
            <el-option
              v-for="row in appInfo"
              :key="row.key"
              :label="row.label"
              :value="row.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-model="item.GameId" label="游戏：" :required="true" label-width="120px">
          <el-select v-model="item.GameId" filterable placeholder="游戏筛选" size="mini">
            <el-option
              v-for="(k,v) in gameMap"
              :label="k"
              :value="parseInt(v)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户id：" label-width="120px" :required="true">
          <el-input v-model.number="item.UID" placeholder="用户id" size="mini" />
        </el-form-item>
        <el-form-item label="富裕卡：" label-width="120px" :required="true">
          <el-cascader
            v-model="richCardSelect"
            :options="cfgData.richCardList"
            :props="{ expandTrigger: 'hover' }"
          />
        </el-form-item>
        <el-form-item label="数量：" label-width="120px" :required="true">
          <el-input v-model.number="item.RichCardCount" placeholder="数量" size="mini" />
        </el-form-item>
        <el-form-item label="发放原因：" label-width="120px" :required="true">
          <el-input
            v-model="item.Description"
            type="textarea"
            :rows="4"
            placeholder="发放原因"
          />
        </el-form-item>
<!--        <el-form-item label="发放详细信息：" label-width="120px">-->
<!--          <template slot="label">-->
<!--            <span>发放详细信息-->
<!--              <el-tooltip class="item" effect="dark" placement="right">-->
<!--                <i class="el-icon-question" style="font-size: 16px; vertical-align: middle;" />-->
<!--                <div slot="content">-->
<!--                  <p>json格式的字符串</p>-->
<!--                </div>-->
<!--              </el-tooltip>-->
<!--            </span>-->
<!--          </template>-->
<!--          <el-input-->
<!--            v-model="item.Detail"-->
<!--            type="textarea"-->
<!--            :rows="4"-->
<!--            placeholder="发放详细信息"-->
<!--          />-->
<!--        </el-form-item>-->
      </el-form>
      <el-row>
        <el-col :span="24" :offset="10">
          <el-button type="danger" @click="visibleData = false">取消</el-button>
          <el-button type="success" @click="addForm('robotForm')">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import Compare from '@/components/Compare/index.vue'
import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput/index.vue'
import { $libDate, $libShow, ClientTableData } from '@/utils/common'
import { Message } from 'element-ui'
import ShowTip from '@/components/Tip/showTip.vue'

const filterMap = {}
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { ShowTip, Compare, Publish, MoneyInput },
  data() {
    return {
      timeRange: [$libDate.GetDayBegin(new Date()), $libDate.GetDayEnd(new Date())],
      libShow: $libShow,
      clientDB: new ClientTableData([], 1, filterMap),
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      fromData: {
        Limit: 20,
        Offset: 1,
        Uid: '',
        GameID: 0,
        AppID: 0,
        Status: 0,
        ApprovalStatus: 0,
        StartTime: $libDate.GetDayBegin(new Date()),
        EndTime: $libDate.GetDayEnd(new Date())
      },
      item: this.getNewItem(),
      showRow: {},
      visibleID: false,
      tableData: [],
      gameMap: {},
      statusMap: {
        1: '发放成功',
        2: '发放失败',
        3: '未审批',
        4: '审批中',
        5: '废弃',
        6: '同意',
        7: '拒绝'
      },
      totalCount: 0,
      visibleData: false,
      appInfo: [],
      isEdit: false,
      cfgData: {},
      richCardData: '',
      richCardSelect: []
    }
  },
  created() {
    this.getAppInfo()
    this.loadData()
    this.getData()
  },
  methods: {
    async loadData() {
      try {
        await this.getMissionData()
        this.getGameList()
      } catch (error) {
        console.error('Error loading data:', error)
      }
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    showBtn(row, idx) {
      return idx.includes(row.status)
    },

    addForm() {
      const data = this.item
      this.item.RichCardLevel = this.richCardSelect[0]
      this.item.RichCardBet = this.richCardSelect[1]
      if (this.isEdit) {
        request({
          url: '/applyrichcard/update',
          method: 'post',
          data: data
        }).then(response => {
          console.log('addForm', response)
          if (response.RetCode === 0) {
            Message.success('ok~')
            this.getData()
          }
        })
      } else {
        request({
          url: '/applyrichcard/create',
          method: 'post',
          data: data
        }).then(response => {
          console.log('addForm', response)
          if (response.RetCode === 0) {
            Message.success('ok~')
            this.getData()
          }
        })
      }
      this.visibleData = false
    },
    deleteForm(row) {
      const data = this.item
      data.ApplyTime = parseInt(data.ApplyTime / 1000)
      request({
        url: '/applyrichcard/update/status/discard',
        method: 'post',
        data: { ID: row.id }
      }).then(response => {
        console.log('addForm', response)
        if (response.RetCode === 0) {
          Message.success('ok~')
          this.getData()
        }
      })
    },
    editData(row) {
      this.isEdit = true
      console.log('editData', row)
      this.item.ID = row.id
      this.item.UID = row.uid
      this.item.AppID = row.app_id
      this.item.GameId = row.game_id
      this.item.Description = row.description
      this.item.RichCardLevel = row.richcard_level
      this.item.RichCardBet = row.richcard_bet / 1000
      this.item.RichCardCount = row.richcard_count
      this.item.Detail = row.detail
      this.item.ApplyTime = row.apply_time * 1000
      this.visibleData = true
    },
    getNewItem() {
      return {
        ID: 0,
        UID: 0,
        AppID: 0,
        GameId: 0,
        Description: '',
        RichCardLevel: 0,
        RichCardBet: 0,
        RichCardCount: 0,
        Detail: '',
        ApplyTime: new Date().getTime()
      }
    },
    getDisable(row, idx) {
      console.log('getDisable', row.status, idx, idx.includes(row.status))
      return !idx.includes(row.status)
    },
    initiateApplication(row) {
      request({
        url: '/applyrichcard/update/status',
        method: 'post',
        data: { ID: row.id }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('ok~')
          this.getData()
        }
      })
    },
    getData() {
      const $this = this
      let minTime = 0
      let maxTime = 0
      if (this.timeRange) {
        minTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[0]) / 1000)
        maxTime = Math.floor($libDate.SelectTimeToIndiaByZone(this.timeRange[1]) / 1000)
      }
      request({
        url: '/applyrichcard/list',
        method: 'get',
        data: {
          Offset: ($this.fromData.Offset - 1) * $this.fromData.Limit,
          Limit: $this.fromData.Limit,
          GameId: $this.fromData.GameID,
          App: $this.fromData.AppID,
          Status: $this.fromData.Status,
          ApprovalStatus: $this.fromData.Status,
          StartTime: minTime,
          EndTime: maxTime,
          Uid: $this.fromData.Uid
        }
      }).then(response => {
        $this.tableData = []
        if (response.RetCode === 0) {
          if (response.Data == null) {
            Message.error('no Data')
            return
          }
          $this.tableData = response.Data
          if (response.Data.length >= $this.fromData.Limit) {
            $this.totalCount = ($this.item.Offset - 1) * $this.fromData.Limit + $this.fromData.Limit + 1
          }
        }
      })
    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Gid < 50 || response.Data[i].Gid > 100 && response.Data[i].Gid < 150 || response.Data[i].Gid > 199) {
              continue
            }
            if (this.cfgData.openGames[response.Data[i].Gid]) {
              this.gameMap[response.Data[i].Gid] = response.Data[i].Name
            }
          }
        }
      })
    },
    execution(row) {
      request({
        url: '/applyrichcard/prop/damage',
        method: 'Post',
        data: {
          ID: row.id,
          Uid: row.uid,
          RichCardLevel: row.richcard_level,
          RichCardBet: row.richcard_bet,
          RichCardCount: row.richcard_count,
          GameId: row.game_id,
          App: row.app_id,
          Detail: row.detail,
          Reason: row.description + '|操作人:' + row.applicant_user
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('执行成功')
        }
        this.getData()
      })
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
    },
    createData() {
      this.visibleData = true
      this.isEdit = false
      this.item = this.getNewItem()
    },
    // 分页处理
    handleSizeChange(val) {
      this.fromData.Limit = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.fromData.Offset = val
      this.getData()
    },
    getMissionData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: 'slotsmission'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || { Data: '{}' }
          const o = JSON.parse(this.form.Data)
          const openGames = {}
          for (const k in o.BuyFreeList) {
            openGames[o.BuyFreeList[k].SlotsType] = o.BuyFreeList[k].Open
          }

          const richCardList = []
          for (const k in o.RichCardList) {
            const item = {
              value: o.RichCardList[k].RichCardLevel,
              label: '星级' + o.RichCardList[k].RichCardLevel,
              children: []
            }
            for (const i in o.RichCardList[k].Bets) {
              item.children.push({
                value: o.RichCardList[k].Bets[i],
                label: '金额 ' + o.RichCardList[k].Bets[i] / 1000
              })
            }
            richCardList.push(item)
          }
          this.cfgData = {
            openGames: openGames,
            richCardList: richCardList
          }
        }
      })
    }
  }
}
</script>
