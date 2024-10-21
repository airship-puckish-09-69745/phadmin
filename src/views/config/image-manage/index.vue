<!--
  File: src\views\config\image-manage\index.vue
  Date: 2024-10-18 10:22:27
  Description: 配置管理/图片管理
-->
<template>
  <div class="image-manage">
    <div class="image-manage-operation">
      <ImageUploadForm
        class="image-manage-form"
        :options="imageCategories"
        :default-category="condition.category"
        @success="handleUploadSuccess"
      />
      <ImageCategoryMenu
        v-model="condition.category"
        class="image-manage-menu"
        :options="imageCategories"
        @select="handleCategorySelect"
      />
    </div>
    <div class="image-manage-container">
      <div class="image-manage__header">
        <div class="image-manage__header__title">{{ title }}</div>
        <i :class="['el-icon-refresh image-manage__header__refresh', { 'is-rotating': loading }]" @click="handleRefresh" />
      </div>
      <div
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        class="image-manage-content"
      >
        <template
          v-if="Array.isArray(filteredList) && filteredList.length > 0"
        >
          <div
            class="image-manage-list"
          >
            <div v-for="item in filteredList" :key="item.url" class="image-manage-item">
              <el-image
                :src="item.url"
                fit="contain"
                :preview-src-list="[item.url]"
                class="image-manage-item__image"
              />
              <div class="image-manage-item__text">{{ item.file_name }}</div>
            </div>
          </div>
          <el-pagination
            class="image-manage-pagination"
            :page-sizes="[10, 20, 50, 100]"
            :current-page="condition.current"
            :page-size="condition.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </template>

        <el-empty v-else :image-size="200" />
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import ImageUploadForm from './components/ImageUploadForm/ImageUploadForm.vue'
import ImageCategoryMenu from './components/ImageCategoryMenu/ImageCategoryMenu.vue'

export default {
  components: {
    ImageUploadForm,
    ImageCategoryMenu
  },
  data() {
    return {
      imageCategories: [
        { value: 'match', label: '比赛' },
        { value: 'act', label: '活动' },
        { value: 'mission', label: '任务' },
        { value: 'other', label: '其他' }
      ],

      condition: {
        category: 'match',
        current: 1,
        pageSize: 10
      },
      total: 0,

      list: [],
      filteredList: [],

      loading: false
    }
  },

  computed: {
    title() {
      return this.imageCategories.find((item) => item.value === this.condition.category)?.label
    }
  },

  created() {
    this.fetchList({ category: this.condition.category }).then((data) => {
      this.setList(data)
      this.getFilterList(this.condition)
    })
  },

  methods: {
    /**
     * @description 处理图片上传成功事件
     */
    handleUploadSuccess() {
      this.setCondition({ ...this.condition, current: 1 })
      this.fetchList({ category: this.condition.category }).then((data) => {
        this.setList(data)
        this.getFilterList(this.condition)
      })
    },

    /**
     * @description 处理图片分类选中事件
     * @param {object} selectedValue 选中值
     * @param {string} selectedValue.value 选中值
     * @param {string} selectedValue.label 选中名称
     */
    handleCategorySelect(selectedValue) {
      this.setCondition({ category: selectedValue.value, current: 1 })

      this.fetchList({ category: selectedValue.value }).then((data) => {
        this.setList(data)
        this.getFilterList(this.condition)
      })
    },

    /**
     * @description 刷新
     */
    handleRefresh() {
      if (this.loading) {
        return
      }

      this.setCondition({ ...this.condition, current: 1 })

      this.fetchList({ category: this.condition.category }).then((data) => {
        this.setList(data)
        this.getFilterList(this.condition)
      })
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
     * @description 设置列表数据
     */
    setList(value) {
      if (Array.isArray(value)) {
        this.list = value
      }
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

      const { current = 1, pageSize = 10 } = query || {}

      const filteredList = list

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
    }
  }
}
</script>

<style scoped lang="scss">
.image-manage {
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

    &__title {
      font-size: 24px;
      font-weight: bold;
      color: #303133;
    }

    &__refresh {
      font-size: 16px;
      color: #606266;
      margin-left: 8px;
      cursor: pointer;

      &.is-rotating {
        cursor: default;
        animation: spin .3s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    }
  }

  &-content {
    height: calc(100% - 40px);
  }

  &-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 16px;
  }

  &-item {
    width: 200px;
    border-radius: 4px;
    border: 1px solid #E4E7ED;
    transition: all .3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    display: flex;
    flex-direction: column;
    align-items: center;

    &__image {
      width: 200px;
      height: 291px;
    }

    &__text {
      padding: 8px 12px;
      width: 100%;
      color: #303133;
      text-align: center;
      word-wrap: break-word;
    }
  }

  &-pagination {
    margin-top: 12px;
    text-align: right;
  }
}
</style>
