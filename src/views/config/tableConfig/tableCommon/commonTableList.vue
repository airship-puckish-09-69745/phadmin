<!-- components/PusoyDosTable.vue -->
<template>
  <div class="common-table-container">
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加配置项
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <!-- 表格主体（源自 commonTable） -->
    <el-table
        ref="table"
        :data="displayData"
        stripe
        border
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
        :row-style="{height:'10px'}"
        :cell-style="cellStyle"
        :highlight-current-row="true"
        size="medium"
        style="width: 100%"
        @row-click="handleRowClick"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
    >
      <!-- 动态列 -->
        <el-table-column
          v-for="(column, idx) in resolvedColumns"
          :key="'col-' + (column.prop || idx)"
          :prop="column.prop"
          :label="column.label"
          :width="column.fixed && column.width"
          :min-width="column.minWidth"
          :align="column.align || 'center'"
          :fixed="column.fixed"
          :show-overflow-tooltip="column.tooltip !== false"
          :sortable="column.sortable || false"
        >
          <template slot-scope="scope">
            <template v-if="column.formatter">
              {{ column.formatter(scope.row, scope.column, scope.$index) }}
            </template>
            <template v-else-if="column.type === 'date'">
              {{ formatDate(scope.row[column.prop], column.dateFormat) }}
            </template>
            <template v-else-if="column.type === 'money'">
              {{ scope.row[column.prop] }}
            </template>
            <template v-else-if="column.type === 'carry'">
              {{ scope.row["CarryLower"] }} / {{ scope.row["CarryUpper"] }}
            </template>
            <template v-else-if="column.type === 'enum'">
              {{ getEnumLabel(scope.row[column.prop], column.enumMap) }}
            </template>
            <template v-else-if="column.type === 'status'">
              <el-tag :type="getStatusType(scope.row[column.prop])">
                {{ getStatusText(scope.row[column.prop]) }}
              </el-tag>
            </template>
            <!--操作-->
            <template v-else-if="column.type === 'operation'">
              <el-button-group>
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-document-copy"
                  @click="handleCopy(scope.row)"
                >复制
                </el-button>
                <el-button
                  v-if="scope.row.Status!=2"
                  size="mini"
                  type="success"
                  icon="el-icon-upload2"
                  @click="handlePrepare(scope.row)"
                >上架
                </el-button>
                <el-button
                  v-if="scope.row.Status!=2"
                  size="mini"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                />
                <el-button
                  v-if="scope.row.Status==2"
                  size="mini"
                  type="danger"
                  icon="el-icon-download"
                  @click="handleOffline(scope.row)"
                >下架
                </el-button>
              </el-button-group>
            </template>
            <template v-else>
              {{ scope.row[column.prop] }}
            </template>
          </template>
        </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="table-pagination">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout='total, sizes, prev, pager, next, jumper'
        :total="total"
        :background="paginationBackground"
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="!displayData.length" class="table-empty">
      <slot name="empty">
        <el-empty description="暂无桌子配置数据">
          <el-button type="primary" @click="handleCreate">添加配置</el-button>
        </el-empty>
      </slot>
    </div>
  </div>
</template>

<script>
import { formatNumber } from '@/utils/common'
import request from '@/utils/request'
import { Message } from 'element-ui'
import { ClientTableData } from '@/utils/common'
import { sort } from 'mock/user';

export default {
  name: 'CommonTableList',

  props: {
    // 源数据
    tableData: {
      type: Array,
      default: () => []
    },

    // 简化列配置：可以传字符串数组（只写 prop），也可以传完整列对象数组
    ColumnCfg: {
      type: Object,
      default: {}
    },

    // 保留原有控制项
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },

    // 通用表格选项
    rowKey: { type: String, default: 'id' },
    cellStyle: { type: [Function, Object], default: () => ({ padding: '8px 0' }) },

    pageSizes: { type: Array, default: () => [10, 20, 50, 100] },
    paginationLayout: { type: String, default: 'total, sizes, prev, pager, next, jumper' },
    paginationBackground: { type: Boolean, default: true },

    defaultSort: { type: Object, default: null },
    loading: { type: Boolean, default: false }
  },

  data() {
    return {
      // 默认完整列定义（当传入 columnsConfig 为字符串数组时使用）
      columns: [
        { prop: 'ID', label: 'ID', width: '80', align: 'center' },
        { prop: 'Level', label: 'Level', width: '100', align: 'center' },
        { prop: 'TableMoney', label: '底注', width: '100', type: 'money', align: 'center',sortable: true,
          formatter: (row) => this.formatMoney(row.TableMoney) },
        { prop: 'Carry', label: '携带', width: '200', type: 'carry', align: 'center' },
        { prop: 'HideCarry', label: '隐藏目标值', width: '120', type: 'money', align: 'center' },
        { prop: 'ObjectCount', label: '桌子数', width: '100', align: 'center' },
        { prop: 'MaxPlayerCount', label: '座位数', width: '120', type: 'number', align: 'center' },
        { prop: 'RemainAlarm', label: '剩余警报', width: '120', align: 'center' },
        { prop: 'PotScore', label: 'Pot配置', width: '120', align: 'center' },
        { prop: 'AllocScheme', label: '配桌方案', width: '120', align: 'center', 
          formatter: (row) => this.getAllocSchemeName(row.AllocScheme) },
        { prop: 'Status', label: '状态', width: '100', align: 'center', type: 'status'},
        { prop: 'operation', label: '操作', type: 'operation', width: '280', fixed: 'right' }
      ],

      // 状态映射
      statusMap: {
        2: { text: '上架', type: 'success' },
        6: { text: '下架', type: 'info' },
        7: { text: '预上架', type: 'warning' },
        8: { text: '预下架', type: 'danger' }
      },

      sortProp: this.defaultSort?.prop || '',
      sortOrder: this.defaultSort?.order || '',
      selectedRows: [],

      clientDB: null
      ,
      // 响应式：当屏幕宽度超过该阈值时，取消 fixed 行为以避免大屏显示问题
      isLargeScreen: false,
      fixedBreakpoint: 1400
    }
  },

  computed: {
    // 将简化的 columnsConfig（字符串数组）解析成完整列定义
    resolvedColumns() {
      // 如果没有 ColumnCfg，直接返回默认列
      if (!this.ColumnCfg || Object.keys(this.ColumnCfg).length === 0) {
        return this.columns.slice()
      }

      const seen = new Set()
      const list = []
      for (let i = 0; i < this.columns.length; i++) {
        const one = this.columns[i]
        if (!one || !one.prop) continue
        if (!this.ColumnCfg.hasOwnProperty(one.prop)) continue
        if (seen.has(one.prop)) continue
        seen.add(one.prop)
        list.push(one)
      }
      return list
    },

    // 如果内部存在 clientDB，则优先使用它提供的数据
    displayData() {
      if (this.clientDB) {
        return this.clientDB.GetCurrentPageData()
      }
      return this.tableData || []
    }
  },

  methods: {
    // 格式化
    formatNumber(num) {
      return num?.toLocaleString?.() || num
    },

    // 从 commonTable 拷贝的工具
    formatDate(ts) {
      try {
        return $libDate.FormateSecondStr(ts, 2)
      } catch (e) {
        return ts
      }
    },

    formatMoney(amount) {
      return amount / 1000
    },

    getEnumLabel(value, enumMap) {
      return enumMap?.[value] || value
    },

    // 状态相关
    getStatusType(status) {
      return this.statusMap[status]?.type || 'info'
    },

    getStatusText(status) {
      console.log("getStatusText:",status);
      return this.statusMap[status]?.text || '未知'
    },

    // 配桌方案
    getAllocSchemeName(plan) {
      const map = { 0: '常规', 1: '班车', 2: '信誉分' }
      return map[plan] || plan
    },

    // 事件处理
    handleRowClick(row) {
      this.$emit('row-click', row.ID)
    },

    handleSortChange({ column, prop, order }) {
      this.sortProp = prop
      this.sortOrder = order
      this.$emit('sort-change', { column, prop, order })
    },

    handleSelectionChange(selection) {
      this.selectedRows = selection
      this.$emit('selection-change', selection)
    },

    handlePageSizeChange(size) {
      this.$emit('update:page-size', size)
      this.$emit('size-change', size)
    },

    handlePageChange(page) {
      this.$emit('update:current-page', page)
      this.$emit('current-change', page)
    },
    handleCallback(id,status) {
      if (this.clientDB) this.clientDB.UpdateData({ ID: id, Status: status })
    },
    // 操作按钮事件（保持和之前一致的事件名）
    handleCopy(row) { 
      this.$emit('copy', row) 
    },
    handlePreOn(row) { this.$emit('pre-on', row) },
    handleOn(row) { this.$emit('on', row) },
    handlePreOff(row) { this.$emit('pre-off', row) },
    handleOffline(row) { this.$emit('offline', row) },
    handleDelete(row) { this.$emit('delete', row) },
    handleCreate() { this.$emit('create') },

    // 公共方法代理到 table ref
    setCurrentRow(row) { this.$refs.table?.setCurrentRow && this.$refs.table.setCurrentRow(row) },
    clearFilter(columnKey) { this.$refs.table?.clearFilter && this.$refs.table.clearFilter(columnKey) },
    doLayout() { this.$refs.table?.doLayout && this.$refs.table.doLayout() },
    sort(prop, order) { this.$refs.table?.sort && this.$refs.table.sort(prop, order) },

    

    // ----- clientDB API -----
    setClientData(arr, pageSize = 10, filter = {}, rowKey = 'ID', defaultSort = -1) {
      this.clientDB = new ClientTableData(arr || [], pageSize, filter, rowKey, defaultSort)
      // ensure pagination aligns with props
      try {
        this.clientDB.GetPage().SetPageNum(this.pageSize)
        this.clientDB.GetPage().SetPageNo(this.currentPage)
      } catch (e) {}
    },

    getDataByID(id) {
      return this.clientDB ? this.clientDB.GetDataByID(id) : null
    },

    addData(item) {
      if (this.clientDB) {
        this.clientDB.AddData(item)
      }
    },

    updateData(item) {
      if (this.clientDB) {
        this.clientDB.UpdateData(item)
      }
    },

    updateDataByPayload(payload) {
      if (this.clientDB) this.clientDB.UpdateData(payload)
    },

    clearFilterMap() {
      if (this.clientDB && this.clientDB.ClearFilterMap) this.clientDB.ClearFilterMap()
    },

    filterData() {
      if (this.clientDB && this.clientDB.FilterData) this.clientDB.FilterData()
    },

    getCurrentPageData() {
      return this.clientDB ? this.clientDB.GetCurrentPageData() : []
    },

    getTotal() {
      try { return this.clientDB ? this.clientDB.GetPage().GetTotalCount() : 0 } catch (e) { return 0 }
    },

    setPageSize(size) {
      if (this.clientDB) this.clientDB.GetPage().SetPageNum(size)
      this.$emit('update:page-size', size)
    },

    setPageNo(page) {
      if (this.clientDB) this.clientDB.GetPage().SetPageNo(page)
      this.$emit('update:current-page', page)
    },

    sortByProp(prop, order) {
      if (this.clientDB) this.clientDB.SortByProp(prop, order)
    },
    // ----- end clientDB API -----
    updateIsLargeScreen() {
      try {
        this.isLargeScreen = window.innerWidth >= this.fixedBreakpoint
      } catch (e) {
        this.isLargeScreen = false
      }
    }
  },
  watch: {
    tableData: {
      handler() {
        this.$nextTick(() => { this.doLayout() })
      },
      deep: true
    },

    loading: {
      handler(val) {
        if (this.$refs.table) this.$refs.table.loading = val
      },
      immediate: true
    }
  }

  ,
  mounted() {
    // 初始化并监听窗口变更，保证 isLargeScreen 正确
    this.updateIsLargeScreen()
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('resize', this.updateIsLargeScreen)
    }
  },
  beforeDestroy() {
    if (typeof window !== 'undefined' && window.removeEventListener) {
      window.removeEventListener('resize', this.updateIsLargeScreen)
    }
  }
}
</script>