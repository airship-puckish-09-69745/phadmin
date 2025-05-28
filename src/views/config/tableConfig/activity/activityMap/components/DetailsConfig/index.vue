<template>
  <div>
    <el-row style="padding-bottom: 12px;">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleEdit()">添加配置</el-button>
    </el-row>

    <el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :cell-style="libShow.DefaultTableCell"
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
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 添加|编辑配置弹窗 -->
    <FormDialog :update-data="formDialog.updateData" :visible="formDialog.visible" @update:visible="handleUpdateDialogVisible" />
  </div>
</template>

<script>

import { $libShow } from '@/utils/common'
import FormDialog from './components/FormDialog.vue'
export default {
  name: 'DetailsConfig',
  components: {
    FormDialog
  },
  data() {
    return {
      libShow: $libShow,
      fields: [
        { label: '配置ID', prop: 'ID', width: 100, required: true },
        { label: '活动名称', prop: 'Name', width: 200, required: true },
        { label: '活动金额', prop: 'Amount', width: 100 },
        { label: '头像框', prop: 'Avatar' },
        { label: '活动图标', prop: 'Icon' },
        { label: '玩法简要', prop: 'Description' },
        { label: '活动时间', prop: 'ActivityTime' },
        { label: '成就个数', prop: 'AchievementNumber' },
        { label: '成就名称', prop: 'AchievementName' },
        { label: '成就完成条件', prop: 'AchievementCondition' }
      ],
      formDialog: {
        updateData: null,
        visible: false
      },
      // 主键
      subKey: 'activity_map_task_cfg',
      tableData: []
    }
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getList() {},
    /**
     * 新增或编辑配置
     * @param row
     */
    handleEdit(row = null) {
      this.formDialog.updateData = row ? { ...row } : null
      this.formDialog.visible = true
    },
    handleDelete(row) {
    },
    handleSave() {

    },
    handleUpdateDialogVisible(visible) {
      this.formDialog.visible = visible
      this.formDialog.updateData = null

      this.getList()
    }
  }
}
</script>
