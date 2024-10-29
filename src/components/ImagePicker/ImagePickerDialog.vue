<!--
  File: src\components\ImagePicker\ImagePickerDialog.vue
  Date: 2024-10-22 10:15:50
  Description: 图片选择弹框
-->
<template>
  <el-dialog
    title="图片选择"
    :visible.sync="show"
    width="70%"
    top="5vh"
    :modal="false"
    class="image-picker-dialog"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <!-- <div
      v-loading="loading"
      class="image-picker-dialog-content"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-form class="image-picker-dialog-form">
        <el-form-item label="分类" prop="category" class="image-picker-form-item">
          <el-select
            :value="condition.category"
            placeholder="请选择"
            @change="handleCategoryChange"
          >
            <el-option
              v-for="item in IMAGE_CATEGORIES"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="image-picker-dialog-container">
          <div
            v-if="Array.isArray(filteredList) && filteredList.length > 0"
            class="image-picker-dialog-list"
          >
            <div
              v-for="item in filteredList"
              :key="item.url"
              :class="[
                'image-picker-dialog-item',
                {
                  'image-picker-dialog-item--active':
                    item.url === active.value,
                },
              ]"
              @click="handleSelect(item)"
            >
              <el-image
                :src="item.url"
                fit="contain"
                class="image-picker-dialog-item__image"
              />
              <div class="image-picker-dialog-item__text">
                {{ item.file_name }}
              </div>
              <span
                v-if="item.url === active.value"
                class="image-picker-dialog-item__selected"
              >
                <i
                  class="el-icon-upload-success el-icon-check image-picker-dialog-item__selected-icon"
                />
              </span>
            </div>
          </div>
          <el-empty v-else />
        </div>
      </el-scrollbar>
      <el-pagination
        class="image-picker-dialog-pagination"
        :page-sizes="[10, 20, 50, 100]"
        :current-page="condition.current"
        :page-size="condition.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div> -->
    <div class="image-picker-dialog-content">
      <div class="image-picker-dialog-operation">
        <div class="image-picker-dialog-preview">
          <div>当前图片：</div>
          <div class="image-picker-dialog-preview__container">
            <div v-if="!active.value" class="image-picker-dialog-preview__empty">
              请选择右侧图片
            </div>
            <div v-else class="image-picker-dialog-preview__block">
              <el-image
                :src="active.value"
                fit="contain"
                :preview-src-list="[active.value]"
                class="image-picker-dialog-preview__image"
              />
              <div class="image-picker-dialog-preview__text">{{ active.name }}</div>
            </div>
          </div>
        </div>
        <div class="image-picker-dialog-category">
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <div class="image-picker-dialog-category__inner">
              <ImageCategoryMenu
                v-model="condition.category"
                :options="IMAGE_CATEGORIES"
                @change="handleCategoryChange"
              />
            </div>
          </el-scrollbar>
        </div>
        <div class="image-picker-dialog-entry">
          <el-button type="text" @click="handleAddImage">添加图片</el-button>
        </div>
      </div>
      <div class="image-picker-dialog-block">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div class="image-picker-dialog-container">
            <div
              v-if="Array.isArray(filteredList) && filteredList.length > 0"
              class="image-picker-dialog-list"
            >
              <div
                v-for="item in filteredList"
                :key="item.url"
                :class="[
                  'image-picker-dialog-item',
                  {
                    'image-picker-dialog-item--active':
                      item.url === active.value,
                  },
                ]"
                @click="handleSelect(item)"
              >
                <el-image
                  :src="item.url"
                  fit="contain"
                  class="image-picker-dialog-item__image"
                />
                <div class="image-picker-dialog-item__text">
                  {{ item.file_name }}
                </div>
                <span
                  v-if="item.url === active.value"
                  class="image-picker-dialog-item__selected"
                >
                  <i
                    class="el-icon-upload-success el-icon-check image-picker-dialog-item__selected-icon"
                  />
                </span>
              </div>
            </div>
            <el-empty v-else class="image-picker-dialog-empty" />
          </div>
        </el-scrollbar>
        <el-pagination
          class="image-picker-dialog-pagination"
          :page-sizes="[10, 20, 50, 100]"
          :current-page="condition.current"
          :page-size="condition.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <span slot="footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
import { IMAGE_CATEGORIES } from '@/constants/image'
import ImageCategoryMenu from './ImageCategoryMenu.vue'

const DEFAULT_PAGE_SIZE = 20

export default {
  name: 'ImagePickerDialog',

  components: {
    ImageCategoryMenu
  },

  props: {
    // 弹框是否显示 (.sync)
    visible: {
      type: Boolean,
      default: false
    },

    // 图片 URL (v-model)
    value: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      IMAGE_CATEGORIES: Object.freeze(IMAGE_CATEGORIES),

      // 当前选中的图片对象
      active: {
        value: '', // 图片 URL/图片路径
        name: '', // 图片名称
        url: '' // 图片 URL
      },

      condition: {
        category: IMAGE_CATEGORIES[0]?.value,
        current: 1,
        pageSize: DEFAULT_PAGE_SIZE
      },

      list: [],
      filteredList: [],
      total: 0,
      loading: false
    }
  },

  computed: {
    show: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },

  methods: {
    /**
     * @description 设置当前选中的图片
     * @param {object} image 选中的图片对象
     * @prop {string} image.value 图片 URL/图片路径
     * @prop {string} image.name 图片名称
     * @prop {string} image.url 图片 URL
     */
    setActive(image) {
      this.active = image
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
     * @description 设置总数
     * @param {number} value 总数
     */
    setTotal(value) {
      this.total = value
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

      const { current = 1, pageSize = DEFAULT_PAGE_SIZE } = query || {}

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

    /**
     * @description 处理图片分类改变事件
     * @param {string} value 选中值
     */
    handleCategoryChange(value) {
      this.setCondition({ ...this.condition, category: value, current: 1 })
      this.fetchList({ category: value }).then((data) => {
        this.setList(data)
        this.getFilterList(this.condition)
      })
    },

    /**
     * @description 切换弹框的显示
     * @param {boolean} visible 弹框是否显示
     */
    toggleVisible(visible) {
      this.show = visible
    },

    /**
     * @description 重置数据
     */
    reset() {
      this.setActive({ value: '', url: '', name: '' })
      this.setCondition({ category: IMAGE_CATEGORIES[0]?.value, current: 1, pageSize: DEFAULT_PAGE_SIZE })
      this.setList([])
      this.setFilteredList([])
      this.setTotal(0)
      this.setLoading(false)
    },

    /**
     * @description 处理弹框打开事件
     */
    handleOpen() {
      this.setActive({
        value: this.value,
        url: this.value,
        name: ''
      })
      this.fetchList({ category: this.condition.category }).then((data) => {
        this.setList(data)
        this.getFilterList(this.condition)
      })
    },

    /**
     * @description 处理弹框关闭事件
     */
    handleClosed() {
      this.reset()
    },

    /**
     * @description 处理图片选中事件
     * @param {object} image 图片对象
     */
    handleSelect(image) {
      const { url, file_name } = image

      if (url === this.active.value) {
        return
      }

      this.setActive({
        value: url,
        name: file_name,
        url
      })
    },

    /**
     * @description 取消
     */
    handleCancel() {
      this.$emit('cancel')
      this.toggleVisible(false)
    },

    /**
     * @description 确定
     */
    handleConfirm() {
      const { active } = this
      const { url, name } = active

      if (!url) {
        this.$message.error('请选择图片')
        return
      }

      this.$emit('input', url)
      this.$emit('change', url)

      this.$emit('pick', {
        value: url,
        url,
        name
      })

      this.toggleVisible(false)
    },

    /**
     * @description 添加图片
     */
    handleAddImage() {
      const { href } = this.$router.resolve({
        path: '/config/image-manage'
      })

      window.open(href, '_blank')
    }
  }
}
</script>

<style scoped lang="scss">
.image-picker-dialog {
  &-content {
    display: flex;
  }

  &-operation {
    flex: 0 0 180px;
    border: 1px solid #DCDFE6;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 8px;
  }

  &-preview {
    padding: 8px;
    flex: 0 0 320px;

    &__block {
      width: 100%;
      border-radius: 4px;
      border: 1px solid #E4E7ED;
      transition: all .3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &__empty,
    &__image {
      border-radius: 4px;
      border-radius: 4px;
      width: 150px;
      height: 218px;
    }

    &__empty {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #F5F7FA;
      color: #C0C4CC;
    }

    &__text {
      width: 100%;
      padding: 8px;
      color: #303133;
      text-align: center;
      word-wrap: break-word;
    }
  }

  &-category {
    width: 100%;
    flex: 0 0 300px;
    border-top: 1px solid #DCDFE6;

    &__inner {
      width: 100%;
      max-height: 300px;
    }
  }

  &-entry {
    width: 100%;
    text-align: center;
    border-top: 1px solid #DCDFE6;
  }

  &-block {
    flex: 1;
    margin-left: 20px;
  }

  &-container {
    height: 600px;
  }

  &-list {
    gap: 12px;
    padding: 8px;
    display: flex;
    flex-wrap: wrap;
  }

  &-item {
    width: 150px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.3s ease-in-out;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
      transform: scale(1.05);
      background-color: rgba(255, 255, 255, 0.2);
      border-color: #409eff;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    }

    &--active {
      cursor: default;
      border-color: #409eff;
    }

    &__selected {
      position: absolute;
      right: -17px;
      top: -7px;
      width: 46px;
      height: 26px;
      background: #13ce66;
      text-align: center;
      transform: rotate(45deg);
      box-shadow: 0 1px 1px #ccc;

      &-icon {
        color: #ffffff;
        font-size: 12px;
        margin-top: 12px;
        transform: rotate(-45deg);
      }
    }

    &__image {
      border-radius: 4px;
      width: 150px;
      height: 218px;
    }

    &__text {
      width: 100%;
      padding: 8px;
      color: #303133;
      text-align: center;
      word-wrap: break-word;
    }
  }

  &-pagination {
    text-align: right;
    margin-top: 8px;
  }

  &-empty {
    height: 100%;
  }
}
</style>
