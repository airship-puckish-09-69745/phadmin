<template>
  <div class="data-table-container">
    <!-- 操作按鈕區域 -->
    <div class="table-actions">
      <el-button 
        size="mini" 
        icon="el-icon-setting" 
        @click="handleShowDevTools"
      >
        开发工具
      </el-button>
      <el-button 
        size="mini" 
        icon="el-icon-plus" 
        type="primary"
        @click="handleAddMatch"
      >
        添加比赛
      </el-button>
      <el-button 
        size="mini" 
        icon="el-icon-document-copy" 
        @click="handleCopyAll"
      >
        复制整日
      </el-button>
      <el-button 
        size="mini" 
        icon="el-icon-delete" 
        type="warning"
        @click="handleExpireAll"
      >
        下架过往
      </el-button>
      <el-button 
        size="mini" 
        icon="el-icon-delete" 
        type="danger"
        @click="handleDeleteAllOff"
      >
        清理下架
      </el-button>
    </div>

    <!-- 數據表格 -->
    <el-table
      :data="tableData"
      stripe
      :header-cell-style="libShow.DefaultTableHeadClass"
      :cell-style="libShow.TableCell(10)"
      style="width: 100%"
      :loading="loading"
      empty-text="暂无数据"
    >
      <el-table-column
        prop="show_appinfo"
        label="APP信息"
        show-overflow-tooltip
        min-width="120"
      />
      <el-table-column
        prop="id"
        label="比赛ID"
        sortable
        width="100"
      />
      <el-table-column
        prop="name"
        label="比赛名称"
        show-overflow-tooltip
        min-width="150"
      />
      <el-table-column
        prop="game_id"
        label="游戏名称"
        width="100"
      >
        <template slot-scope="scope">
          {{ getGameName(scope.row.game_id) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="start_time"
        label="开始时间"
        width="180"
      >
        <template slot-scope="{row}">
          <DateTimeShow :show-type="2" :timestamp="row.start_time" />
        </template>
      </el-table-column>
      <el-table-column
        prop="end_time"
        label="结束时间"
        width="180"
      >
        <template slot-scope="{row}">
          <DateTimeShow :show-type="2" :timestamp="row.end_time" />
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="比赛排序"
        width="100"
        sortable
      />
      <el-table-column
        prop="repeat_type"
        label="赛事类型"
        width="120"
      >
        <template slot-scope="scope">
          {{ getRepeatTypeShow(scope.row.repeat_type) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="modifier"
        label="修改人"
        width="100"
      />
      <el-table-column
        prop="update_time"
        label="修改時間"
        width="180"
      >
        <template slot-scope="scope">
          {{ formatTime(scope.row.update_time) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="开关"
        width="100"
      >
        <template slot-scope="scope">
          <el-button 
            v-if="scope.row.openShow == false" 
            size="mini" 
            type="success" 
            @click="handleUpdateStatus(scope.row.id, true)"
          >
            上架
          </el-button>
          <el-button 
            v-if="scope.row.openShow == true" 
            size="mini" 
            type="danger" 
            @click="handleUpdateStatus(scope.row.id, false)"
          >
            下架
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="250px"
      >
      <template slot-scope="scope">
          <div class="action-buttons">
            <el-button 
              v-if="scope.row.Status != 2"
              size="mini" 
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button 
              v-if="showDevTool && scope.row.openShow == false"
              size="mini" 
              type="danger" 
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
            <el-button
              v-else="showDevTool"
              size="mini"
              type="success"
              icon="el-icon-document-copy"
              @click="handleCopy(scope.row.id)"
            >
              复制
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁組件 -->
    <el-pagination
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="pagination"
    />
  </div>
</template>

<script>
import DateTimeShow from '@/components/DatetimeShow'
import { $libShow } from '@/utils/common'
import { getGameName, getRepeatTypeShow, formatTime } from '../utils/matchConfigUtils'

export default {
  name: 'DataTable',
  components: {
    DateTimeShow
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 100
    },
    total: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    gameCfgs: {
      type: Array,
      default: () => []
    },
    repeatCfgs: {
      type: Array,
      default: () => []
    },
    showDevTool: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      libShow: $libShow
    }
  },
  methods: {
    /**
     * 獲取遊戲名稱
     * @param {number} gameId - 遊戲ID
     * @returns {string} 遊戲名稱
     */
    getGameName(gameId) {
      return getGameName(gameId, this.gameCfgs)
    },
    
    /**
     * 獲取重複類型顯示名稱
     * @param {number} repeatType - 重複類型
     * @returns {string} 顯示名稱
     */
    getRepeatTypeShow(repeatType) {
      return getRepeatTypeShow(repeatType, this.repeatCfgs)
    },
    
    /**
     * 格式化時間
     * @param {number} timestamp - 時間戳
     * @returns {string} 格式化後的時間
     */
    formatTime(timestamp) {
      return formatTime(timestamp)
    },
    
      /**
       * 显示开发工具
     */
    handleShowDevTools() {
      this.$emit('show-dev-tools')
    },
    
      /**
       * 添加比赛
     */
    handleAddMatch() {
      this.$emit('add-match')
    },
    
      /**
       * 复制整日
     */
    handleCopyAll() {
      this.$emit('copy-all')
    },
    
      /**
       * 下架过往
     */
    handleExpireAll() {
      this.$emit('expire-all')
    },
    
    /**
     * 清理下架
     */
    handleDeleteAllOff() {
      this.$emit('delete-all-off')
    },
    
    /**
     * 更新狀態
     * @param {number} id - 比賽ID
     * @param {boolean} status - 狀態
     */
    handleUpdateStatus(id, status) {
      this.$emit('update-status', id, status)
    },
    
      /**
       * 编辑比赛
     * @param {Object} row - 比賽數據
     */
    handleEdit(row) {
      this.$emit('edit', row)
    },
    
      /**
       * 删除比赛
     * @param {number} id - 比賽ID
     */
    handleDelete(id) {
      this.$emit('delete', id)
    },
    
      /**
       * 复制比赛
     * @param {number} id - 比賽ID
     */
    handleCopy(id) {
      this.$emit('copy', id)
    },
    
    /**
     * 頁面大小改變
     * @param {number} val - 新的頁面大小
     */
    handleSizeChange(val) {
      this.$emit('size-change', val)
    },
    
    /**
     * 當前頁改變
     * @param {number} val - 新的頁碼
     */
    handleCurrentChange(val) {
      this.$emit('current-change', val)
    }
  }
}
</script>

<style scoped>
.data-table-container {
  padding: 20px;
}

.table-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 16px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}

.el-button {
  margin-left: 0;
  margin-right: 8px;
}

.el-button:last-child {
  margin-right: 0;
}

.action-buttons {
  display: flex !important;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
}

.action-buttons .el-button {
  margin: 0 !important;
  flex-shrink: 0;
  display: inline-block !important;
  float: none !important;
  clear: none !important;
}

.action-buttons .el-button + .el-button {
  margin-left: 8px !important;
}
</style>
