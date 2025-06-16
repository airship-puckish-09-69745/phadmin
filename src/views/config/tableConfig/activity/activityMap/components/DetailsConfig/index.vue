<template>
  <div>
    <el-row style="padding-bottom: 12px;">
      <el-button size="mini" type="primary" icon="el-icon-search" @click="onSearch()">查询</el-button>
      <el-button
        size="mini"
        type="success"
        icon="el-icon-plus"
        style="float: right;"
        @click="handleEdit()"
      >添加配置</el-button>
    </el-row>

    <el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%;"
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
          :required="field.required"
        >
          <template slot-scope="scope">
            <!-- 活动图标和头像框 -->
            <el-image
              v-if="field.prop === 'Icon'"
              :src="scope.row[field.prop]"
              fit="contain"
              :preview-src-list="[scope.row[field.prop]]"
              class="image-manage-item__image"
            />
            <!-- 活动配置：格式为：活动名称-[活动ID] -->
            <template v-else-if="field.prop === 'ActivityConfig'">
              <span v-if="scope.row.ActivityName">{{
                `${getActivityConfigNasme(scope.row)}-[${scope.row.ActivityConfigId}]`
              }}</span>
              <span v-else>暂无</span>
            </template>
            <!-- 日期处理 -->
            <template v-else-if="field.prop === 'ActivityTime'">
              <span v-if="scope.row.ActivityTime">
                {{ parseTime(scope.row.ActivityTime[0], '{y}-{m}-{d}') }} <br> {{ parseTime(scope.row.ActivityTime[1], '{y}-{m}-{d}') }}
              </span>
            </template>
            <!-- 成就：格式为：[头像框][名称]: [达成条件] -->
            <template v-else-if="field.prop === 'AchievementList'">
              <div v-if="scope.row.AchievementList && scope.row.AchievementList.length > 0">
                <div v-for="(achievement, index) in scope.row.AchievementList" :key="index">
                  <div v-if="achievement.AchievementName">
                    <el-image
                      v-if="achievement.Avatar"
                      :src="achievement.Avatar"
                      fit="contain"
                      :preview-src-list="[achievement.Avatar]"
                      class="image-manage-item__image"
                      style="width: 60px;"
                    />
                    <div style="display: inline-block; width: 260px; vertical-align: top;position: relative; top: 6px">
                      <div style="display: -webkit-box; width: 100%; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                        <!-- {{
                          `[${index + 1}]`
                        }} -->
                        {{ achievement.AchievementName }}: {{ achievement.AchievementCondition }}
                      </div>
                    </div>
                  </div>
                  <span v-else>暂无</span>
                </div>
              </div>
              <span v-else>暂无</span>
            </template>
            <!-- 游戏列表，格式为：名称(id)-热度 -->
            <template v-else-if="field.prop === 'GameList'">
              <div v-if="scope.row.GameList && scope.row.GameList.length > 0">
                <div v-for="(game, index) in scope.row.GameList" :key="index">
                  <span v-if="game.label">
                    {{
                      `${game.label}(${game.id})`
                    }}：
                    <span style="color: #1890FF">{{ game.hot }}</span>
                  </span>
                  <span v-else>暂无</span>
                </div>
              </div>
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
        v-if="detailsList.length > 0"
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
    <FormDialog
      :activity-options="activityOptions"
      :update-data="formDialog.updateData"
      :visible="formDialog.visible"
      @update:visible="handleUpdateDialogVisible"
      @save="handleSave"
    />
  </div>
</template>

<script>

import { $libShow } from '@/utils/common'
import FormDialog from './components/FormDialog.vue'
import { parseTime } from '@/utils/index'
export default {
  name: 'DetailsConfig',
  components: {
    FormDialog
  },
  props: {
    activityOptions: {
      type: Array,
      default: () => []
    },
    detailsList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchForm: {
        activityId: '',
        configName: ''
      },
      formData: {
        ActivityId: '',
        ActivityName: '',
        ConfigName: '',
        Content: {}
      },
      libShow: $libShow,
      fields: [
        { label: '配置ID', prop: 'ID', width: 100, required: true },
        { label: '活动名称', prop: 'ActivityName', width: 200, required: true },
        { label: '活动配置', prop: 'ActivityConfig', width: 200, required: true },
        { label: '活动金额', prop: 'Amount', width: 100 },
        // { label: '头像框', prop: 'Avatar', width: 120 },
        { label: '活动图标', prop: 'Icon', width: 120 },
        { label: '玩法简要', prop: 'Description', width: 150 },
        { label: '活动时间', prop: 'ActivityTime', width: 110 },
        { label: '游戏热度', prop: 'GameList', width: 200 },
        { label: '成就', prop: 'AchievementList', width: 360 }
        // { label: '成就个数', prop: 'AchievementNumber' },
        // { label: '成就名称', prop: 'AchievementName' },
        // { label: '成就完成条件', prop: 'AchievementCondition', width: 120 }
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
    detailsList: {
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
    // 由父组件控制数据加载
    getList() {
      if (!this.detailsList || this.detailsList.length === 0) {
        this.tableData = []
        this.pagination.total = 0
        return
      }

      this.tableData = this.detailsList.slice(
        (this.pagination.currentPage - 1) * this.pagination.pageSize,
        this.pagination.currentPage * this.pagination.pageSize
      )
      this.pagination.total = this.detailsList.length
    },
    /**
     * 新增或编辑配置
     * @param row
     */
    onSearch() {
      this.$emit('reload')
    },
    async handleSave(data) {
      this.$emit('update', data)
    },
    handleEdit(row = null) {
      this.formDialog.updateData = row
      this.formDialog.visible = true
    },
    handleDelete(row) {
      this.$confirm(
        `确定要删除[ ${row.ActivityName} ]吗？`,
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
    getActivityConfigNasme(row) {
      const selectedActivity = this.activityOptions.find(option => option.id === row.ActivityConfigId)
      return (selectedActivity ? selectedActivity.name : '')
    },
    handleUpdateDialogVisible(visible) {
      this.formDialog.visible = visible
      this.formDialog.updateData = null

      this.getList()
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
