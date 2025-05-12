<template>
  <el-dialog
    title="发放详情"
    :visible.sync="visible"
    width="800"
    :before-close="onClose"
  >
    <div class="search-filter">
      <div class="search-filter-item">
        账号或UID: <el-input v-model="filter.account" />
      </div>
      <div class="search-filter-item">
        发放状态: <el-select v-model="filter.status" placeholder="发放状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click="onSearch()"
      >查 询</el-button>
    </div>

    <el-table
      :data="tableData"
      border
      stripe
      :header-cell-style="libShow.DefaultTableHeadClass"
      :cell-style="libShow.TableCell(10)"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="60"
      />
      <el-table-column prop="account" label="账号或者UID" sortable />
      <el-table-column prop="status" label="发放状态" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1 ? 'success' : scope.row.status === -1 ? 'danger' : 'info'"
            size="small"
          >{{ getStatusText(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose()">取 消</el-button>
      <el-button type="primary" @click="onClose()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import {
  // $libDate,
  $libShow
} from '@/utils/common'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    originData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      libShow: $libShow,
      filter: {
        account: '',
        status: ''
      },
      // 0:未发放；1:成功; -1:失败
      statusOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 0,
          label: '未发放'
        },
        {
          value: 1,
          label: '成功'
        },
        {
          value: -1,
          label: '失败'
        }
      ],
      tableData: []
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.onSearch()
      }
    }
  },
  methods: {
    /**
     * 搜索数据展示列表
     * 数据源是props传入的data，过滤之后得到tableData
     * 根据是否有uid和status来过滤数据
     */
    onSearch() {
      this.tableData = this.originData.send_details.account_details.filter(item => {
        const account = this.filter.account
        const status = this.filter.status
        return (
          (account ? item.account === account : true) &&
          ((status === 0 || status) ? item.status === status : true)
        )
      })
    },
    onReset() {
      this.filter = {
        uid: '',
        status: ''
      }
    },
    onCancel() {
      this.onClose()
    },
    onClose() {
      this.onReset()
      this.$emit('close')
    },
    /**
     * 将发放状态转为文字
     * @param status 发放状态
     */
    getStatusText(status) {
      const statusObj = this.statusOptions.find(item => item.value === status)
      return statusObj ? statusObj.label : status
    }
  }
}
</script>

<style scoped lang="scss">
.search-filter-item {
  display: inline-block;
  width: 250px;
  margin-left: 12px;
  margin-bottom: 12px;

  .el-input,
  .el-select {
    width: calc(100% - 80px);
  }
}
</style>
