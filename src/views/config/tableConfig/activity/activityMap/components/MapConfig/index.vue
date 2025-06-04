<template>
  <div>
    <el-row style="padding-bottom: 12px;">
      <el-button size="mini" type="primary" icon="el-icon-search" @click="onSearch()">查询</el-button>
      <el-button size="mini" type="success" icon="el-icon-plus" style="float: right;" @click="handleEdit()">添加配置</el-button>
    </el-row>

    <el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :cell-style="libShow.DefaultTableCell"
      >
        <!-- 序号 -->
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column
          v-for="field in fields"
          :key="field.prop"
          :label="field.label"
          :prop="field.prop"
          :width="field.width"
        >
          <template slot-scope="scope">
            <!-- 活动图标 -->
            <el-image
              v-if="field.prop === 'Icon'"
              :src="scope.row.Icon"
              fit="contain"
              :preview-src-list="[scope.row.Icon]"
              class="image-manage-item__image"
            />
            <!-- 分页 -->
            <template v-else-if="field.prop === 'Page'">
              <el-tag
                v-for="item in scope.row.Page"
                :key="item"
                :type="item"
                size="mini"
                style="margin-right: 4px;"
              >
                {{ item }}
              </el-tag>
            </template>
            <!-- 日期处理 -->
            <template v-else-if="field.prop === 'ActivityTime'">
              <span v-if="scope.row.ActivityTime">
                {{ parseTime(scope.row.ActivityTime[0], '{y}-{m}-{d}') }} <br> {{ parseTime(scope.row.ActivityTime[1], '{y}-{m}-{d}') }}
              </span>
            </template>
            <!-- 活动：格式为：活动名称-[活动ID] -->
            <template v-else-if="field.prop === 'ActivityName'">
              <span v-if="scope.row.ActivityName">{{
                `${scope.row.ActivityName}-[${scope.row.ActivityId}]`
              }}</span>
              <span v-else>暂无</span>
            </template>
            <span v-else>{{ scope.row[field.prop] }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="mapList.length > 0"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :current-page="pagination.currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; text-align: right;"
        @size-change="handlePaginationSizeChange"
        @current-change="handlePaginationCurrentChange"
      />
    </el-row>

    <!-- 添加|编辑配置弹窗 -->
    <FormDialog :update-data="formDialog.updateData" :activity-options="activityOptions" :visible="formDialog.visible" @update:visible="handleUpdateDialogVisible" @update="handleUpdateConfig" />
  </div>
</template>

<script>
import { $libShow } from '@/utils/common'
import FormDialog from './components/FormDialog.vue'
import { parseTime } from '@/utils/index'
export default {
  name: 'MapConfig',
  components: {
    FormDialog
  },
  props: {
    mapList: {
      type: Array,
      default: () => []
    },
    activityOptions: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      libShow: $libShow,
      fields: [
        { label: '配置ID', prop: 'ID', width: 130 },
        { label: '活动名称', prop: 'ActivityName', width: 200 },
        { label: '活动金额', prop: 'Amount', width: 200 },
        { label: '活动时间', prop: 'ActivityTime', width: 130 },
        { label: '分页', prop: 'Page' },
        { label: '活动图标', prop: 'Icon', width: 120 },
        { label: '插入位置', prop: 'Position', width: 120, formatter: (row) => `x:${row.Position.x}, y:${row.Position.y}` }
      ],
      formDialog: {
        updateData: null,
        visible: false
      },
      // 主键
      subKey: 'activity_map_task_cfg',
      tableData: [],
      pagination: {
        total: 0, // 数据总条数
        currentPage: 1, // 当前页码
        pageSize: 10 // 每页显示条数
      }
    }
  },
  watch: {
    mapList: {
      handler(newVal) {
        // console.log('mapList changed:', newVal)
        this.$nextTick(() => {
          this.getList()
        })
      },
      immediate: true
    }
  },
  methods: {
    parseTime,
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    onSearch() {
      this.$emit('reload')
    },
    /**
     * 从mapList中获取分页数据
     */
    getList() {
      if (!this.mapList || this.mapList.length === 0) {
        this.tableData = []
        this.pagination.total = 0
        return
      }

      this.tableData = this.mapList.slice(
        (this.pagination.currentPage - 1) * this.pagination.pageSize,
        this.pagination.currentPage * this.pagination.pageSize
      )
      this.pagination.total = this.mapList.length
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
        `确定要删除[ ${row.Name} ]吗？`,
        '删除提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$emit('delete', row.ID)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleUpdateConfig(data) {
      this.$emit('update', data)
    },
    handleUpdateDialogVisible(visible) {
      this.formDialog.visible = visible
      this.formDialog.updateData = null
    },
    handlePaginationSizeChange(size) {
      this.pagination.pageSize = size
      this.getList()
    },
    handlePaginationCurrentChange(page) {
      this.pagination.currentPage = page
      this.getList()
    }
  }
}
</script>
