<template>
  <div class="imported-user-list">
    <div v-if="showRefreshButton" style="margin-top: 8px">
      <el-button type="primary" size="mini" @click="refresh">查询</el-button>
    </div>
    <el-table
      :data="list"
      border
      style="width: 100%; margin-top: 8px"
    >
      <el-table-column prop="uid" label="用户ID" />
      <el-table-column prop="create_at" label="导入时间">
        <template slot-scope="scope">
          {{ formatTime(scope.row.create_at) }}
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrap">
      <el-pagination
        :current-page="page"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import { $libDate } from '@/utils/common'

export default {
  name: 'ImportedUserList',
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    activityCfgId: {
      type: Number,
      default: 0
    },
    activityId: {
      type: Number,
      default: 0
    },
    requestUrl: {
      type: String,
      default: '/activityconfig/uids/imported'
    },
    requestMethod: {
      type: String,
      default: 'get'
    },
    includeActivityId: {
      type: Boolean,
      default: true
    },
    extraData: {
      type: Object,
      default: () => ({})
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40]
    },
    showRefreshButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      page: 1,
      pageSize: 10
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        if (val) {
          this.refresh()
        }
      }
    },
    activityCfgId(val, oldVal) {
      if (val !== oldVal) {
        this.page = 1
        this.refresh()
      }
    }
  },
  methods: {
    formatTime(raw) {
      const ts = Number(raw)
      if (Number.isFinite(ts) && ts > 0) {
        return $libDate.FormateSecondStr(ts, 2)
      }
      return raw || '-'
    },
    clearList() {
      this.list = []
      this.total = 0
      this.$emit('loaded', { list: [], total: 0 })
    },
    buildRequestData() {
      const data = {
        ...this.extraData,
        ActCfgId: this.activityCfgId,
        Page: this.page,
        PageSize: this.pageSize
      }
      if (this.includeActivityId && this.activityId > 0) {
        data.ActivityId = this.activityId
      }
      return data
    },
    refresh() {
      if (!this.visible || this.activityCfgId <= 0) {
        this.clearList()
        return
      }
      request({
        url: this.requestUrl,
        method: this.requestMethod,
        data: this.buildRequestData()
      }).then(response => {
        if (response.RetCode === 0 && response.Data) {
          this.list = response.Data.list || []
          this.total = Number(response.Data.total) || 0
          this.$emit('loaded', { list: this.list, total: this.total })
        } else {
          this.clearList()
        }
      }).catch(() => {
        this.clearList()
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.page = 1
      this.refresh()
    },
    handleCurrentChange(val) {
      this.page = val
      this.refresh()
    }
  }
}
</script>

<style scoped>
.pagination-wrap {
  margin-top: 8px;
  text-align: right;
}
</style>
