<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <el-row>
      <el-form :inline="true" size="mini" class="demo-form-inline">
        <el-form-item label="UID" required>
          <el-input v-model="searchForm.uid" placeholder="请输入UID" style="width: 150px" clearable />
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.timeRange"
            :default-time="['00:00:00', '23:59:59']"
            type="datetimerange"
            value-format="timestamp"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            align="right"
          />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="searchForm.opType" placeholder="请选择操作类型" style="width: 150px" clearable>
            <el-option v-for="prop in opTypeOptions" :key="prop.value" :label="prop.label" :value="prop.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="道具类型">
          <el-select v-model="searchForm.itemType" placeholder="请选择道具类型" style="width: 150px" clearable @change="onItemTypeChange">
            <el-option v-for="prop in itemTypeOptions" :key="prop.value" :label="prop.label" :value="prop.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="道具">
          <el-select v-model="searchForm.propId" placeholder="请选择道具" style="width: 150px" clearable @focus="onPropSelectorFocus">
            <el-option v-for="prop in propOptions" :key="prop.value" :label="prop.label" :value="prop.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <div style="color: red; margin: 12px">数据有五分钟延迟</div>

    <!-- 数据表格 -->
    <el-row>
      <el-table :data="tableData" border stripe style="width: 100%">
        <!-- 移除原来的 expand 列 -->

        <el-table-column prop="upTime" label="更新时间" width="160">
          <template slot-scope="scope">
            {{ formatTime(scope.row.upTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="propId" label="道具ID" width="80" />
        <el-table-column prop="propType" label="道具类型" width="160">
          <template slot-scope="scope">
            {{ getItemTypeText(scope.row.propType) }}
          </template>
        </el-table-column>
        <el-table-column prop="propName" label="道具名称" width="180" />
        <el-table-column prop="propNum" label="数量" width="80">
          <template slot-scope="scope">
            {{ scope.row.propNum === -1 && !scope.row.propName.includes('门票') && !scope.row.propName.includes('Ticket') && !scope.row.propName.includes('TICKET')? '永久' : scope.row.propNum }}
          </template>
        </el-table-column>
        <el-table-column prop="preNum" label="变化前" width="80" />
        <el-table-column prop="afterNum" label="变化后" width="80" />
        <el-table-column label="详情" width="80">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 添加详情弹窗 -->
    <el-dialog title="详细信息" :visible.sync="detailDialogVisible" width="600px">
      <el-form label-position="left" inline class="demo-table-expand">
<!--        <el-form-item label="应用">-->
<!--          <span>{{ getAppName(currentRow.appId) }}</span>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="站点ID">-->
<!--          <span>{{ currentRow.siteId }}</span>-->
<!--        </el-form-item>-->
        <el-form-item label="道具价值">
          <span>{{ currentRow.propCost }}</span>
        </el-form-item>
        <el-form-item label="变化类型">
          <span>{{ getOptionTypeText(currentRow.channelType) }}</span>
        </el-form-item>
        <el-form-item label="玩法ID">
          <span>{{ currentRow.gid }}</span>
        </el-form-item>
        <el-form-item label="比赛列表ID">
          <span>{{ currentRow.ListId }}</span>
        </el-form-item>
        <el-form-item label="比赛名称">
          <span>{{ currentRow.matchName }}</span>
        </el-form-item>
        <el-form-item label="后台操作者">
          <span>{{ currentRow.handlers }}</span>
        </el-form-item>
        <el-form-item label="备注">
          <span>{{ currentRow.remarks }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>


    <el-row type="flex" justify="center">
      <div class="block">
        <el-pagination
          :current-page="pagination.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pagination.limit"
          layout="slot, total, sizes, prev, next"
          prev-text="上一页"
          next-text="下一页"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <span class="pageSizeInput" style="padding-right: 10px">
            <!-- 当前页：{{ pagination.page }}/{{ Math.ceil(pagination.total / pagination.limit) }} -->
            {{ paginationText }}
          </span>
        </el-pagination>
      </div>
    </el-row>
  </div>
</template>

<script>
import { $libDate, $libShow } from '@/utils/common'
import { PROP_SOURCE_OPTIONS, ITEM_TYPE_OPTIONS, APPID_OPTIONS } from '@/utils/options' // 引入操作类型等常量配置
import request from '@/utils/request'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      searchForm: {
        uid: '',
        timeRange: [],
        opType: '',
        itemType: '',
        propName: '',
        propId: ''
      },
      opTypeOptions: PROP_SOURCE_OPTIONS,
      itemTypeOptions: ITEM_TYPE_OPTIONS,
      propOptions: [], // 道具下拉框选项
      tableData: [],
      detailDialogVisible: false, // 添加详情弹窗可见性控制
      currentRow: {}, // 添加当前行数据存储
      pagination: {
        limit: 20,
        total: 0,
        page: 1
      }
    }
  },
  computed: {
    paginationText() {
      return `当前页：${this.pagination.page}/${Math.ceil(this.pagination.total / this.pagination.limit)}`
    }
  },
  methods: {
    // 时间格式化
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    /**
     * 将应用ID转换成对应的名称
     * @param appId
     */
    getAppName(appId) {
      const app = APPID_OPTIONS.find(item => item.value === appId)
      return app ? app.label : appId
    },
    /**
     * 道具类型转换成对应文字
     */
    getItemTypeText(type) {
      const item = this.itemTypeOptions.find(item => item.value === type)
      return item ? item.label : ''
    },
    getOptionTypeText(type) {
      const item = this.opTypeOptions.find(item => item.value === type)
      return item ? item.label : ''
    },
    /**
     * 选择道具类型之后更新道具下拉框数据
     */
    onItemTypeChange() {
      this.getPropOptions()
    },
    /**
     * 当点击道具下拉框选项时，检查道具类型是否已经选择
     * 如果没有选择道具类型，则提示错误
     */
    onPropSelectorFocus() {
      if (this.searchForm.itemType !== 0 && !this.searchForm.itemType) {
        this.$message.warning('请先选择道具类型')
        this.searchForm.propName = ''
      }
    },
    showDetail(row) {
      this.currentRow = row
      this.detailDialogVisible = true
    },
    /**
     * 格式化请求参数
     * uid，opType，propType，propName，startTime，endTime，pageNum，pageSize
     */
    getRequestParams() {
      const selectedProp = this.propOptions.find(item => item.id === this.searchForm.propId)
      // console.log(selectedProp)
      const params = {
        Path: '/log/proplog',
        uid: this.searchForm.uid,
        opType: this.searchForm.opType || 0,
        propType: this.searchForm.itemType || 0,
        propName: selectedProp ? selectedProp.item_name : '',
        startTime: this.searchForm.timeRange[0] ? Math.round(this.searchForm.timeRange[0] / 1000) : 0,
        endTime: this.searchForm.timeRange[1] ? Math.round(this.searchForm.timeRange[1] / 1000) : 0,
        pageNum: this.pagination.page,
        pageSize: this.pagination.limit
      }
      return params
    },
    /**
     * 检查搜索条件
     * UID必填
     */
    checkSearchForm() {
      if (!this.searchForm.uid) {
        this.$message.warning('UID不能为空')
        return false
      }

      return true
    },
    /**
     * 获取表格数据
     */
    getList() {
      if (!this.checkSearchForm()) {
        return
      }

      const params = this.getRequestParams()
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: params
      }).then(response => {
        if (response.RetCode === 0) {
          this.tableData = []
          this.pagination.total = 0
          const data = response.Data
          console.log('道具流水数据', data.list)
          if (data === 'no Data') {
            this.pagination.total = 0
            Message.success('查询结果为空')
            return
          }
          if (data.list.length > 0) {
            this.pagination.total = data.total
            this.tableData = data.list || []
          } else {
            this.pagination.total = 0
          }
        }
      })
    },
    // 查询数据
    handleSearch() {
      this.pagination.page = 1
      this.getList()
    },
    getPropOptions() {
      if (this.searchForm.itemType === 0 || !this.searchForm.itemType) {
        return
      }

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/match/props/config/list',
          PropType: this.searchForm.itemType
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            // console.log('道具列表', this.itemList)
            this.propOptions = objs.list.map(prop => ({
              value: prop.id,
              label: prop.item_name
            }))
          } else {
            this.propOptions = []
          }
        } else {
          this.propOptions = []
        }
      })
    },
    // 重置搜索条件
    handleReset() {
      this.searchForm = {
        uid: '',
        timeRange: [],
        opType: '',
        itemType: '',
        propId: ''
      }
      this.currentPage = 1
      this.handleSearch()
    },
    // 分页大小变化
    handleSizeChange(val) {
      this.pagination.limit = val
      this.pagination.page = 1
      this.handleSearch()
    },
    // 当前页变化
    handleCurrentChange(val) {
      this.pagination.page = val
      this.getList()
    }
  }
}
</script>

<style scoped>
/* 可根据项目现有样式调整 */
.demo-form-inline {
  margin-bottom: 20px;
}
</style>"
