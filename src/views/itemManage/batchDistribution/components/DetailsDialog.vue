<template>
  <el-dialog
    title="发放详情"
    :visible.sync="visible"
    width="800"
    :before-close="onClose"
  >
    <div class="search-filter">
      <div class="search-filter-item">
        UID: <el-input v-model="filter.uid" />
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
      <el-table-column prop="createTime" label="发布时间" width="150" />
      <el-table-column prop="id" label="玩家ID" sortable width="100" />
      <el-table-column prop="number" label="发放数量" />
      <el-table-column prop="propName" label="道具类型" />
      <el-table-column prop="propName" label="道具名称" />
      <el-table-column prop="status" label="发放状态">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.status == 1"
            type="primary"
            size="mini"
          >待发放</el-tag>
          <el-tag
            v-else-if="scope.row.status == 2"
            type="success"
            size="mini"
          >已发放</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose()">取 消</el-button>
      <el-button type="primary" @click="onSubmit()">确 定</el-button>
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
    }
  },
  data() {
    return {
      libShow: $libShow,
      filter: {
        uid: '',
        status: 0
      },
      statusOptions: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '已发放'
        },
        {
          value: 2,
          label: '未发放'
        }
      ],
      tableData: []
    }
  },
  methods: {
    onSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.form)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onReset() {
      this.filter = {
        uid: '',
        status: 0
      }
    },
    onCancel() {
      this.onClose()
    },
    onClose() {
      this.$emit('close')
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
