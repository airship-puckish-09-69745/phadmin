<template>
  <div>
    <el-row style="padding-bottom: 12px;">
      <el-button size="mini" type="primary" icon="el-icon-search" @click="onSearch()">查询</el-button>
      <el-button size="mini" type="success" icon="el-icon-plus" style="float: right;" @click="handleEdit()">添加配置</el-button>
    </el-row>

    <el-row>
      <el-table
        ref="filterTable"
        :data="tableData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
      >
        <el-table-column
          v-for="field in fields"
          :key="field.prop"
          :label="field.label"
          :prop="field.prop"
          :width="field.width"
          :required="field.required"
        />
        <!-- 操作 -->
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 添加|编辑配置弹窗 -->
    <FormDialog :update-data="formDialog.updateData" :visible="formDialog.visible" @update:visible="handleUpdateDialogVisible" @save="handleSave" />
  </div>
</template>

<script>

import { $libShow } from '@/utils/common'
import FormDialog from './components/FormDialog.vue'
export default {
  name: 'BonusConfig',
  components: {
    FormDialog
  },
  props: {
    bonusList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      libShow: $libShow,
      fields: [
        { label: '配置ID', prop: 'ID', required: true },
        { label: '金额', prop: 'Amount', required: true }
      ],
      formDialog: {
        updateData: null,
        visible: false
      },
      // 主键
      subKey: 'activity_map_task_cfg',
      tableData: [],
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      }
    }
  },
  watch: {
    bonusList: {
      handler(newVal) {
        this.$nextTick(() => this.getList())
      },
      immediate: true
    }
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getList() {
      if (!this.bonusList || this.bonusList.length === 0) {
        this.tableData = []
        this.pagination.total = 0
        return
      }
      this.tableData = this.bonusList.slice(
        (this.pagination.currentPage - 1) * this.pagination.pageSize,
        this.pagination.currentPage * this.pagination.pageSize
      )
      this.pagination.total = this.bonusList.length
    },
    onSearch() {
      this.$emit('reload')
    },
    /**
     * 新增或编辑配置
     * @param row
     */
    handleEdit(row = null) {
      this.formDialog.updateData = row ? { ...row } : null
      this.formDialog.visible = true
    },
    handleDelete(row) {
      this.$confirm(
        `确定要删除[ 金额配置${row.ID} ]吗？`,
        '删除提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$emit('delete', row.ID)
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    handleSave(data) {
      this.$emit('update', data)
      // this.$message.success('保存成功')
      this.formDialog.visible = false
      this.getList()
    },
    handleUpdateDialogVisible(visible) {
      this.formDialog.visible = visible
      this.formDialog.updateData = null

      this.getList()
    }
  }
}
</script>
