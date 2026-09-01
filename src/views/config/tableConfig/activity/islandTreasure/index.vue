<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="id" key-id="IslandTreasureConfig" :env-empty="false" compare-type="Array" :attr-names="AttrNames" :head-attrs="['cfgId', 'name']" />
    </el-row>
    <el-row style="padding-top: 10px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAdd()">添加配置项</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>

    <el-row style="padding-top: 10px">
      <el-row>
        <el-table
          ref="filterTable"
          :data="clientDB.ShowData"
          stripe
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
          style="width: 100%"
          @sort-change="handleSortChange"
        >
          <el-table-column prop="id" label="id" sortable="custom" width="80" />
          <el-table-column prop="activity.isOpen" label="是否开启" align="center" width="100">
            <template slot-scope="scope">
              <el-tag :type="scope.row.activity.isOpen ? 'success' : 'info'" size="mini">{{ scope.row.activity.isOpen ? '开' : '关' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="activity.name" label="活动名称" />
          <el-table-column prop="activity.whitelist" label="站点">
            <template slot-scope="scope">
              {{ scope.row.activity.whitelist.siteIdList.join(',') }}
            </template>
          </el-table-column>
          <el-table-column prop="activity.startTime" label="开始时间" align="center">
            <template slot-scope="scope">
              {{ formatTime(scope.row.activity.startTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="结束时间" sortable="custom" align="center">
            <template slot-scope="scope">
              {{ formatTime(scope.row.activity.endTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="modifyUser" label="最后修改人" align="center" />
          <el-table-column prop="status" label="状态" align="center" width="100">
            <template slot-scope="scope">
              {{ libShow.DataStatuses[scope.row.status] }}
            </template>
          </el-table-column>
          <el-table-column label="操作" column-key="op" min-width="100">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.status !== 2" size="mini" type="success" icon="el-icon-upload2" @click="handleOnline(scope.row)">上架 </el-button>
              <el-button v-if="scope.row.status !== 2" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)" />
              <el-button v-if="scope.row.status === 2" size="mini" type="danger" icon="el-icon-download" @click="handleOffline(scope.row)">下架 </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :offset="16" :span="8">
          <div class="block">
            <el-pagination
              :current-page="clientDB.GetCurrentPage()"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="clientDB.GetPageNum()"
              layout="total, sizes, prev, pager, next, jumper"
              :total="clientDB.GetTotalCount()"
              @size-change="clientDB.OnPageSizeChange"
              @current-change="clientDB.OnPageNoChange"
            />
          </div>
        </el-col>
      </el-row>
    </el-row>

    <update-form
      ref="updateForm"
      :visible.sync="updateForm.visible"
      :is-edit="updateForm.isEdit"
      :data.sync="updateForm.data"
      @changeData="getList"
    />
  </div>
</template>
<script>
import Publish from '@/components/Publish/index.vue'
import UpdateForm from './components/updateForm.vue'
import { $libDate, ClientTableData, $libShow } from '@/utils/common'
import request from '@/utils/request'
import { RECORD_STATUS_OPTIONS } from '@/utils/options'
import { Message } from 'element-ui'

const filterMap = {}

export default {
  components: {
    Publish,
    UpdateForm
  },
  data() {
    return {
      libShow: $libShow,
      clientDB: new ClientTableData([], 10, filterMap),
      updateForm: {
        visible: false,
        isEdit: false,
        data: null
      },
      tableData: [],
      AttrNames: {},
      activityId: 31,
      propList: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    handleAdd() {
      this.updateForm.visible = true
      this.updateForm.isEdit = false
      this.updateForm.data = {}
    },
    handleEdit(ob) {
      this.updateForm.visible = true
      this.updateForm.isEdit = true
      this.updateForm.data = ob
    },
    handleSortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
    },
    handleOnline(ob) {
      this.changeStatus(ob.id, RECORD_STATUS_OPTIONS.ONLINE, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handleOffline(ob) {
      this.changeStatus(ob.id, RECORD_STATUS_OPTIONS.OFFLINE, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleDelete(ob) {
      const deleteList = []
      deleteList.push(ob)
      this.deleteData = deleteList
      this.changeStatus(ob.id, RECORD_STATUS_OPTIONS.DELETE, '您确定要将记录状态修改为废弃吗？')
    },
    changeStatus(id, status, msg) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/activityconfig/update/status',
          method: 'post',
          data: {
            id: id,
            status: status,
            activityId: this.activityId
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            this.getList()
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    getList() {
      request({
        url: '/activityconfig/all',
        method: 'get',
        data: {
          activityId: this.activityId
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          const rows = []
          for (const obj of objs) {
            rows.push({
              ...obj,
              activity: JSON.parse(obj.activity),
              extend: JSON.parse(obj.extend)
            })
          }
          this.clientDB = new ClientTableData(rows, 10, filterMap, 'id', -1, 'id')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
