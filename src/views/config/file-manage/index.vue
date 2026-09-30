<!--
  File: src\views\config\file-manage\index.vue
  Date: 2024-10-18 10:22:27
  Description: 配置管理/图片管理
-->
<template>
  <div class="file-manage">
    <div class="file-manage-operation">
      <FileUploadForm class="file-manage-form" :options="FILE_CATEGORIES" :default-category="condition.category"
        @success="handleUploadSuccess" />
      <FileCategoryMenu v-model="condition.category" class="file-manage-menu" :options="FILE_CATEGORIES"
        @select="handleCategorySelect" />
    </div>
    <div class="file-manage-container">
      <div class="file-manage__header">
        <div class="file-manage__header__title">{{ !title ? '全部' : title }}</div>
        <div class="file-manage__header__operations">
          <el-input v-model="keyword" placeholder="请输入关键字" @input="handleKeywordChange">
            <template #append />
          </el-input>
          <!-- <i :class="['el-icon-refresh file-manage__header__refresh', { 'is-rotating': loading }]"
              @click="handleRefresh" /> -->
          <el-button type="primary" @click="handleRefresh">刷新</el-button>
        </div>
      </div>
      <div v-loading="loading" element-loading-text="Loading..." element-loading-spinner="el-icon-loading"
        class="file-manage-content">
        <template v-if="Array.isArray(filteredList) && filteredList.length > 0">
          <div class="file-manage-list">
            <div v-for="item in filteredList" :key="item.url" class="file-manage-item" @click="copyFileUrl(item)">
              <div v-if="item.file_name.endsWith('.zip')" class="file-manage-item__icon">
                <svg t="1790754926276" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1259" width="48" height="48"><path d="M659.72 64.81H270.4c-78.06 0-141.33 63.28-141.33 141.33v612.95c0 78.06 63.28 141.33 141.33 141.33h485.49c78.06 0 141.33-63.28 141.33-141.33V302.3c0-31.83-12.64-62.35-35.15-84.85l-117.5-117.5a120.008 120.008 0 0 0-84.85-35.14z" fill="#FFC757" p-id="1260"></path><path d="M304.85 196.81h71.52c7.86 0 14.24-6.38 14.24-14.24v-71.52c0-7.87-6.38-14.24-14.24-14.24h-71.52c-7.86 0-14.24 6.38-14.24 14.24v71.52c0 7.86 6.38 14.24 14.24 14.24zM476.37 196.81h-71.52c-7.86 0-14.24 6.38-14.24 14.24v71.52c0 7.87 6.38 14.24 14.24 14.24h71.52c7.86 0 14.24-6.38 14.24-14.24v-71.52c0-7.86-6.38-14.24-14.24-14.24zM304.85 396.81h71.52c7.86 0 14.24-6.38 14.24-14.24v-71.52c0-7.87-6.38-14.24-14.24-14.24h-71.52c-7.86 0-14.24 6.38-14.24 14.24v71.52c0 7.86 6.38 14.24 14.24 14.24zM476.37 396.81h-71.52c-7.86 0-14.24 6.38-14.24 14.24v71.52c0 7.87 6.38 14.24 14.24 14.24h71.52c7.86 0 14.24-6.38 14.24-14.24v-71.52c0-7.86-6.38-14.24-14.24-14.24zM455.65 552.02H321.52c-17.07 0-30.91 13.84-30.91 30.91v155.48c0 17.07 13.84 30.91 30.91 30.91h134.13c17.07 0 30.91-13.84 30.91-30.91V582.93c0-17.07-13.84-30.91-30.91-30.91z m-4.93 164.59c0 13.72-11.12 24.84-24.84 24.84h-74.6c-13.72 0-24.84-11.12-24.84-24.84v-27.36c0-13.72 11.12-24.84 24.84-24.84h74.6c13.72 0 24.84 11.12 24.84 24.84v27.36zM862.07 217.45l-117.5-117.5a120.001 120.001 0 0 0-61.75-32.9v131.88c0 41.87 33.94 75.81 75.81 75.81H894a120.021 120.021 0 0 0-31.93-57.29z" fill="#F79F2B" p-id="1261"></path><path d="M304.85 184.81h71.52c7.86 0 14.24-6.38 14.24-14.24V99.05c0-7.87-6.38-14.24-14.24-14.24h-71.52c-7.86 0-14.24 6.38-14.24 14.24v71.52c0 7.86 6.38 14.24 14.24 14.24zM476.37 184.81h-71.52c-7.86 0-14.24 6.38-14.24 14.24v71.52c0 7.87 6.38 14.24 14.24 14.24h71.52c7.86 0 14.24-6.38 14.24-14.24v-71.52c0-7.86-6.38-14.24-14.24-14.24zM304.85 384.81h71.52c7.86 0 14.24-6.38 14.24-14.24v-71.52c0-7.87-6.38-14.24-14.24-14.24h-71.52c-7.86 0-14.24 6.38-14.24 14.24v71.52c0 7.86 6.38 14.24 14.24 14.24zM476.37 384.81h-71.52c-7.86 0-14.24 6.38-14.24 14.24v71.52c0 7.87 6.38 14.24 14.24 14.24h71.52c7.86 0 14.24-6.38 14.24-14.24v-71.52c0-7.86-6.38-14.24-14.24-14.24zM455.65 540.02H321.52c-17.07 0-30.91 13.84-30.91 30.91v155.48c0 17.07 13.84 30.91 30.91 30.91h134.13c17.07 0 30.91-13.84 30.91-30.91V570.93c0-17.07-13.84-30.91-30.91-30.91z m-4.93 164.59c0 13.72-11.12 24.84-24.84 24.84h-74.6c-13.72 0-24.84-11.12-24.84-24.84v-27.36c0-13.72 11.12-24.84 24.84-24.84h74.6c13.72 0 24.84 11.12 24.84 24.84v27.36z" fill="#FFFFFF" p-id="1262"></path></svg>
              </div>
              <div v-else-if="item.file_name.endsWith('.jpg') || item.file_name.endsWith('.jpeg') || item.file_name.endsWith('.png') || item.file_name.endsWith('.gif') || item.file_name.endsWith('.webp')" class="file-manage-item__icon">
                <svg t="1790755159471" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1583" width="48" height="48"><path d="M788.14 928.23h-550c-77.32 0-140-62.68-140-140v-550c0-77.32 62.68-140 140-140h550c77.32 0 140 62.68 140 140v550c0 77.32-62.68 140-140 140z" fill="#FFC757" p-id="1584"></path><path d="M770.19 644.92l-67.56-117.01c-15.4-26.68-53.91-26.68-69.31 0l-64.01 110.88L450.3 432.65c-15.4-26.67-53.89-26.67-69.29 0L258.45 644.94c-15.4 26.67 3.85 60.01 34.65 60.01h442.44c30.8-0.01 50.05-33.35 34.65-60.03z" fill="#EF9F2B" p-id="1585"></path><path d="M595.103921 388.209544a55.27 55.27 0 1 0 100.661393-45.676862 55.27 55.27 0 1 0-100.661393 45.676862Z" fill="#EF9F2B" p-id="1586"></path><path d="M770.19 632.92l-67.56-117.01c-15.4-26.68-53.91-26.68-69.31 0l-64.01 110.88L450.3 420.65c-15.4-26.67-53.89-26.67-69.29 0L258.45 632.94c-15.4 26.67 3.85 60.01 34.65 60.01h442.44c30.8-0.01 50.05-33.35 34.65-60.03z" fill="#FFFFFF" p-id="1587"></path><path d="M595.104335 376.209454a55.27 55.27 0 1 0 100.661392-45.676862 55.27 55.27 0 1 0-100.661392 45.676862Z" fill="#FFFFFF" p-id="1588"></path></svg>
              </div>
              <div v-else class="file-manage-item__icon">
                <svg t="1790755030143" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1420" width="48" height="48"><path d="M659.72 64.19H270.4c-78.06 0-141.33 63.28-141.33 141.33v612.95c0 78.06 63.28 141.33 141.33 141.33h485.49c78.06 0 141.33-63.28 141.33-141.33V301.69c0-31.83-12.64-62.35-35.15-84.85l-117.5-117.5a120.017 120.017 0 0 0-84.85-35.15z" fill="#C7DADD" p-id="1421"></path><path d="M862.07 216.84l-117.5-117.5a120.001 120.001 0 0 0-61.75-32.9v131.88c0 41.87 33.94 75.81 75.81 75.81H894a119.975 119.975 0 0 0-31.93-57.29zM512.53 295.92c-82.1 0-148.9 66.8-148.9 148.9 0 12.53 10.15 22.68 22.68 22.68s22.68-10.15 22.68-22.68c0-57.09 46.45-103.54 103.54-103.54 27.63 0 53.62 10.78 73.19 30.35s30.35 45.57 30.35 73.19c0 21.11-6.31 41.41-18.24 58.71-11.68 16.92-27.89 29.89-46.9 37.48-37.11 14.83-61.08 49.9-61.08 89.33V632c0 12.53 10.15 22.68 22.68 22.68s22.68-10.15 22.68-22.68v-1.66c0-20.78 12.78-39.31 32.56-47.21 27.33-10.92 50.63-29.54 67.4-53.84 17.18-24.9 26.26-54.11 26.26-84.47 0-39.74-15.5-77.13-43.64-105.27-28.13-28.13-65.52-43.63-105.26-43.63z" fill="#9DC0C9" p-id="1422"></path><path d="M500.973351 750.25961a30.24 30.24 0 1 0 23.144694-55.876234 30.24 30.24 0 1 0-23.144694 55.876234Z" fill="#9DC0C9" p-id="1423"></path><path d="M618.4 327.31c-28.14-28.14-65.52-43.64-105.26-43.64-82.1 0-148.9 66.8-148.9 148.9 0 12.53 10.15 22.68 22.68 22.68s22.68-10.15 22.68-22.68c0-57.09 46.45-103.54 103.54-103.54 27.63 0 53.62 10.78 73.19 30.35s30.35 45.57 30.35 73.19c0 21.11-6.31 41.41-18.24 58.71-11.68 16.92-27.89 29.89-46.9 37.48-37.11 14.83-61.08 49.9-61.08 89.33v1.66c0 12.53 10.15 22.68 22.68 22.68s22.68-10.15 22.68-22.68v-1.66c0-20.78 12.78-39.31 32.56-47.21 27.33-10.92 50.63-29.54 67.4-53.84 17.18-24.9 26.26-54.11 26.26-84.47 0-39.74-15.5-77.12-43.64-105.26z" fill="#FFFFFF" p-id="1424"></path><path d="M513.14 710.09m-30.24 0a30.24 30.24 0 1 0 60.48 0 30.24 30.24 0 1 0-60.48 0Z" fill="#FFFFFF" p-id="1425"></path></svg>
              </div>
              <el-tooltip placement="top">
                <template #content>
                  <div>文件名：{{ item.file_name }}</div>
                  <div>创建时间：{{ formatTime(item.create_time) }}</div>
                </template>
                <div class="file-manage-item__text">
                    {{ item.file_name }}
                </div>
              </el-tooltip>
            </div>
          </div>
          <div class="file-manage-pagination-container">
            <el-pagination class="file-manage-pagination" :page-sizes="[10, 20, 30, 50, 100]"
            :current-page="condition.current" :page-size="condition.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @current-change="handleCurrentChange"
            @size-change="handleSizeChange" />
          </div>
        </template>
        <!-- <el-empty v-else :image-size="200" /> -->
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import { FILE_CATEGORIES } from '@/constants/image'
import FileCategoryMenu from './components/FileCategoryMenu/FileCategoryMenu.vue'
import FileUploadForm from './components/FileUploadForm/FileUploadForm.vue'

export default {
  components: {
    FileUploadForm,
    FileCategoryMenu
  },
  data() {
    return {
      FILE_CATEGORIES: Object.freeze(FILE_CATEGORIES),

      condition: {
        category: FILE_CATEGORIES[0]?.value,
        current: 1,
        pageSize: 30
      },
      keyword: '',

      list: [],
      filteredList: [],
      total: 0,

      loading: false
    }
  },

  computed: {
    title() {
      return this.FILE_CATEGORIES.find((item) => item.value === this.condition.category)?.label
    }
  },

  created() {
    this.loadFileList(this.condition.category)
  },

  methods: {
    loadFileList(category) {
      this.fetchList({ category }).then((data) => {
        this.setList(data)
        this.getFilterList(this.condition)
      })
    },
    /**
     * @description 格式化时间
     * @param {string|number} time 时间字符串或时间戳
     */
    formatTime(time) {
      if (!time) return '--'

      try {
        let date
        if (typeof time === 'number' && String(time).length === 10) {
          date = new Date(time * 1000)
        } else {
          date = new Date(time)
        }

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')

        return `${year}-${month}-${day} ${hours}:${minutes}`
      } catch (e) {
        return time
      }
    },

    /**
     * @description 处理图片上传成功事件
     */
    handleUploadSuccess() {
      this.setCondition({ ...this.condition, current: 1 })
      this.loadFileList(this.condition.category)
    },

    /**
     * @description 处理图片分类选中事件
     * @param {object} selectedValue 选中值
     * @param {string} selectedValue.value 选中值
     * @param {string} selectedValue.label 选中名称
     */
    handleCategorySelect(selectedValue) {
      this.setCondition({ category: selectedValue.value, current: 1 })
      this.loadFileList(selectedValue.value)
    },

    /**
     * @description 刷新
     */
    handleRefresh() {
      if (this.loading) {
        return
      }

      this.setCondition({ ...this.condition, current: 1 })
      this.loadFileList(this.condition.category)
    },

    /**
     * @description 设置查询条件
     * @param {object} value 查询条件
     */
    setCondition(value) {
      this.condition = value
    },

    /**
     * @description 设置加载状态
     * @param {boolean} value 是否加载中
     */
    setLoading(value) {
      this.loading = value
    },

    /**
     * @description 设置列表数据
     */
    setList(value) {
      if (Array.isArray(value)) {
        this.list = value
      }
    },

    /**
     * @description 获取列表数据
     * @param {object} data 参数
     * @prop {string} data.category 图片类型
     */
    fetchList(data) {
      this.setLoading(true)
      return request({
        url: '/file/list',
        method: 'get',
        data
      }).then(res => {
        if (res.RetCode === 0) {
          return res.Data
        }
        return Promise.reject(res)
      }).finally(() => this.setLoading(false))
    },

    /**
     * @description 过滤列表数据
     * @param {Array} list 整个数组
     * @param {Object} query 查询条件
     * @param {string} query.category 类型
     * @param {number} query.current 当前页码
     * @param {number} query.pageSize 每页记录数
     * @returns {Object} 返回分页结果
     */
    filterList(list, query) {
      // 判空
      if (!Array.isArray(list)) {
        return {
          list: [],
          total: 0
        }
      }

      const { current = 1, pageSize = 30 } = query || {}

      const filteredList = list.filter(el => !this.keyword || el.file_name.toLowerCase().includes(this.keyword.toLowerCase()))

      // 计算总数
      const total = filteredList.length

      // 计算分页
      const startIndex = (current - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedList = filteredList.slice(startIndex, endIndex)

      // 返回结果
      return {
        list: paginatedList,
        total: total
      }
    },

    /**
     * @description 获取过滤列表数据
     * @param {Object} query 查询条件
     * @param {string} query.category 类型
     * @param {number} query.current 当前页码
     * @param {number} query.pageSize 每页记录数
     * @returns {Object} 返回分页结果
     */
    getFilterList(query) {
      const data = this.filterList(this.list, query)
      const { list, total } = data

      this.setFilteredList(list)
      this.setTotal(total)
    },

    /**
     * @description 设置过滤后的列表数据
     * @param {Array} value 过滤后的数组
     */
    setFilteredList(value) {
      if (Array.isArray(value)) {
        this.filteredList = value
      }
    },

    /**
     * @description 设置总数
     * @param {number} value 总数
     */
    setTotal(value) {
      this.total = value
    },

    /**
     * @description 处理页码改变事件
     * @param {number} current 当前页码
     */
    handleCurrentChange(current) {
      this.setCondition({ ...this.condition, current })
      this.getFilterList(this.condition)
    },

    /**
     * @description 处理每页记录数改变事件
     * @param {number} pageSize 每页记录数
     */
    handleSizeChange(pageSize) {
      this.setCondition({ ...this.condition, current: 1, pageSize })
      this.getFilterList(this.condition)
    },

    handleKeywordChange(value) {
      this.getFilterList(this.condition)
    },

    copyFileUrl(item) {
      // 创建隐藏输入框
      const tempInput = document.createElement('textarea');
      tempInput.value = item.url;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      this.$message({
        message: '复制URL成功',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.file-manage {
  width: 100%;
  padding: 20px;
  min-height: 100%;
  display: flex;

  &-operation {
    flex: 0 0 360px;
    height: 100%;
    background-color: #f9fafc;
    border: 1px solid #DCDFE6;
  }

  &-menu {
    padding-top: 12px;
    overflow: auto;
    border-top: 1px solid #DCDFE6;
  }

  &-container {
    flex: 1;
    margin-left: 20px;
  }

  &__header {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__title {
      font-size: 24px;
      font-weight: bold;
      color: #303133;
      width: 100px;
    }

    &__operations {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: space-around;
    }

    // &__refresh {
    //   font-size: 16px;
    //   color: #606266;
    //   margin-left: 8px;
    //   cursor: pointer;

    //   &.is-rotating {
    //     cursor: default;
    //     animation: spin .3s linear infinite;
    //   }

    //   @keyframes spin {
    //     from {
    //       transform: rotate(0deg);
    //     }

    //     to {
    //       transform: rotate(360deg);
    //     }
    //   }
    // }
  }

  &-content {
    height: calc(100% - 40px);
    border: 1px solid #DCDFE6;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }

  &-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  &-item {
    width: 300px;
    border-radius: 4px;
    border: 1px solid #E4E7ED;
    transition: all .3s ease;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    &__icon {
      width: 48px;
      height: 48px;
      margin: 10px 10px;
    }

    &__text {
      width: 100%;
      color: #303133;
      text-align: left;
      word-wrap: break-word;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__time {
      color: #909399;
      font-size: 12px;
    }
  }

  &-pagination-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: row;
  }

  &-pagination {
    margin-top: 12px;
    text-align: right;
  }
}
</style>
