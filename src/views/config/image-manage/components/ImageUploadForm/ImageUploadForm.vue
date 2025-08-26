<!--
  File: src\views\config\image-manage\components\ImageUploadForm\ImageUploadForm.vue
  Date: 2024-10-18 13:48:42
  Description: --
-->
<template>
  <div class="image-upload-form">
    <el-form
      ref="formRef"
      v-loading="loading"
      element-loading-text="图片上传中..."
      element-loading-spinner="el-icon-loading"
      :model="formData"
      :rules="formRules"
    >
      <el-form-item label="图片" prop="dataUrl" class="image-upload-form__item-image">
        <div
          v-show="!formData.file"
          class="image-upload-form__upload"
        >
          <div
            class="image-upload-form__upload-container"
            :class="{ 'dragging': isDragging }"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
          >
            <i class="el-icon-upload image-upload-form__upload__icon" />
            <div class="image-upload-form__upload__text">将文件拖到此处，或<em class="image-upload-form__upload__text__em">点击上传</em></div>
            <input
              ref="fileRef"
              type="file"
              class="image-upload-form__upload__input"
              :accept="imageAccept"
              @change="handleFileSelected"
            >
          </div>
          <div class="image-upload-form__tip">只能上传 jpg/jpeg/png 格式的图片，且大小不超过 1M</div>
        </div>
        <div
          v-show="formData.file"
          class="image-upload-form__preview"
        >
          <el-image
            :src="formData.dataUrl"
            fit="contain"
            class="image-upload-form__preview__image"
          />
          <div class="image-upload-form__preview__overlay">
            <div class="image-upload-form__preview__actions">
              <i class="el-icon-edit image-upload-form__preview__actions__icon" @click="triggerFileInput" />
              <i class="el-icon-delete image-upload-form__preview__actions__icon" @click="removeSelectedFile" />
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <span style="color:red; margin-left:5px">请选择类型</span>
        <el-select v-model="formData.category" placeholder="请选择类型" style="width: 100%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-button type="primary" style="width: 100%" @click="handleUpload">上传</el-button>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
/**
 * @description 创建文件校验器工厂函数
 * @param {Function[]} fns 校验规则数组
 */
function createFileValidatorFactory(fns) {
  return (file) => {
    for (const fn of fns) {
      const result = fn(file)
      if (!result.success) {
        return result
      }
    }

    return { success: true, message: '' }
  }
}

export default {
  name: 'ImageUploadForm',
  props: {
    options: {
      type: Array,
      default: () => []
    },

    defaultCategory: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formData: {
        file: null,
        dataUrl: '',
        category: ''
      },

      formRules: {
        dataUrl: [{ required: true, message: '请选择图片' }],
        category: [{ required: true, message: '请选择类型' }]
      },

      imageAccept: 'image/png, image/jpeg',

      isDragging: false,

      loading: false
    }
  },
  created() {
    //this.setDefaultCategory(this.defaultCategory)
  },
  methods: {
    setDefaultCategory(category) {
      if (category) {
        this.formData.category = category
        console.log("this.formData.category", this.formData.category)
      }
    },

    handleDragOver() {
      this.isDragging = true
    },

    handleDragLeave() {
      this.isDragging = false
    },

    /**
     * @description 文件拖拽事件
     * @param {Event} e
     */
    handleDrop(e) {
      this.isDragging = false
      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        this.handleFiles(files)
      }
    },

    /**
     * @description 点击上传
     */
    triggerFileInput() {
      this.$refs.fileRef.click()
    },

    /**
     * @description 清除文件
     */
    clearFile() {
      this.$refs.fileRef.value = ''
    },

    /**
     * @description 文件选择事件
     * @param {Event} e
     */
    handleFileSelected(e) {
      const files = e.target.files
      if (files && files.length > 0) {
        this.handleFiles(files)
      }
      this.clearFile()
    },

    /**
     * @description 创建文件校验器
     * @returns {Function} 文件校验器函数
     */
    createFileValidator() {
      return createFileValidatorFactory([
        this.validateFileName,
        (file) => this.validateFileType(file, this.imageAccept),
        this.validateFileSize
      ])
    },

    /**
     * @description 处理文件
     * @param {File[]} files
     */
    handleFiles(files) {
      const file = files[0]

      if (file) {
        const fileValidator = this.createFileValidator()
        const validationResult = fileValidator(file)
        if (!validationResult.success) {
          this.$message.error(validationResult.message)
          return
        }

        this.setSelectedFile(file)
      }
    },

    /**
     * @description 校验文件名称
     * @param {File} file 文件对象
     * @returns {{ success: true, message: '' }} 返回校验结果，`success=true` 表示校验通过，反之，则不通过；`message` 的值为错误消息
     */
    validateFileName(file) {
      if (file && !file.name.match(/^[A-Za-z0-9_\-\.]+$/)) {
        return {
          success: false,
          message: '文件名只能包含：「字母、数字、_、-、.」'
        }
      }

      return {
        success: true,
        message: ''
      }
    },

    /**
     * @description 校验文件格式
     * @param {File} file 文件对象
     * @param {string} format 允许的文件格式
     * @returns {{ success: true, message: '' }} 返回校验结果，`success=true` 表示校验通过，反之，则不通过；`message` 的值为错误消息
     */
    validateFileType(file, format) {
      const allowedFormats = format.split(',').map(format => format.trim())

      if (!allowedFormats.includes(file.type)) {
        const formattedFormats = allowedFormats
          .map(format => format.replace('image/', ''))
          .join(', ')

        return {
          success: false,
          message: `请上传 ${formattedFormats} 格式的图片`
        }
      }

      return {
        success: true,
        message: ''
      }
    },

    /**
   * @description 校验文件大小
   * @param {File} file 文件对象
   * @param {number} [maxSize] 可选，文件大小上限，单位 byte，默认 1MB
   * @returns {{ success: true, message: '' }} 返回校验结果，`success=true` 表示校验通过，反之，则不通过；`message` 的值为错误消息
   */
    validateFileSize(file, maxSize = 1 * 1024 * 1024) {
      let unit = 'MB' // 默认单位是 MB
      let maxSizeFormatted = (maxSize / (1024 * 1024)).toFixed(2) // 默认以 MB 格式化 maxSize
      let fileSizeFormatted = (file.size / (1024 * 1024)).toFixed(2) // 默认以 MB 格式化 file.size

      if (maxSize < 1 * 1024 * 1024) {
        // 如果 maxSize 小于 1MB，则使用 KB 作为单位
        unit = 'KB'
        maxSizeFormatted = (maxSize / 1024).toFixed(2) // 以 KB 格式化 maxSize
        fileSizeFormatted = (file.size / 1024).toFixed(2) // 以 KB 格式化 file.size
      }

      if (file.size > maxSize) {
        return {
          success: false,
          message: `文件大小不能超过 ${maxSizeFormatted}${unit}。当前文件大小：${fileSizeFormatted}${unit}`
        }
      }

      return {
        success: true,
        message: ''
      }
    },

    /**
     * @description 设置选中的文件
     * @param {File} file 文件对象
     */
    setSelectedFile(file) {
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const formData = this.formData

          formData.file = file
          formData.dataUrl = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },

    /**
     * @description 移除所选文件
     */
    removeSelectedFile() {
      const formData = this.formData

      formData.file = null
      formData.dataUrl = ''
    },

    /**
     * @description 上传
     */
    handleUpload() {
      this.$refs.formRef.validate((valid) => {
        // 校验通过
        if (valid) {
          this.uploadFile()
        }
      })
    },

    /**
     * @description 设置 loading
     * @param {boolean} value
     */
    setLoading(value) {
      this.loading = value
    },

    /**
     * @description 上传文件
     */
    uploadFile() {
      const formData = new FormData()
      formData.append('Env', this.$store.getters.env)
      formData.append('category', this.formData.category)
      formData.append('file', this.formData.file)
      console.log("formData", this.$store.getters.env)

      const url = process.env.VUE_APP_BASE_API + '/file/upload'
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      }
      if (store.getters.token) {
        // let each request carry token
        // ['X-Token'] is a custom headers key
        // please modify it according to the actual situation
        config.headers['X-Token'] = getToken()
      }
      this.setLoading(true)
      axios.post(url, formData, config).then(res => {
        const { status, data } = res || {}
        const { RetCode, Data } = data || {}

        // 上传成功
        if (status === 200 && RetCode === 0) {
          this.$message.success('图片上传成功')
          this.formData.file = null
          this.formData.dataUrl = ''
          this.$emit('success')
        } else {
          this.$message.error(Data)
          this.$emit('error', res)
        }
      }).finally(() => this.setLoading(false))
    }
  }
}
</script>

<style scoped lang="scss">
.image-upload-form {
  padding: 12px;

  &__item-image {
    height: 240px;
  }

  &__upload {
    &-container {
      background-color: #fff;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      box-sizing: border-box;
      width: 360px;
      height: 180px;
      text-align: center;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;

      &:hover {
        border-color: #1890ff;
      }

      &.dragging {
        border-color: #2196F3;
        background-color: #E3F2FD;
      }
    }

    &__icon {
      font-size: 67px;
      color: #C0C4CC;
      margin: 40px 0 16px;
      line-height: 50px;
    }

    &__text {
      color: #606266;
      font-size: 14px;
      text-align: center;

      &__em {
        color: #1890ff;
        font-style: normal;
      }
    }

    &__input {
      display: none;
    }
  }

  &__tip {
    margin-top: 4px;
    font-size: 12px;
    color: #606266;
    line-height: 20px;
  }

  &__preview {
    width: 360px;
    height: 180px;
    overflow: hidden;
    position: relative;

    &:hover {
      .image-upload-form__preview__overlay {
        opacity: 1;
      }
    }

    &__image {
      width: 100%;
      height: 100%;
    }

    &__overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &__actions {
      display: flex;

      &__icon {
        color: #ffffff;
        cursor: pointer;
        font-size: 16px;

        & + & {
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
