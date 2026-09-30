<!--
  File: src\views\config\file-manage\components\FileUploadForm\FileUploadForm.vue
  Date: 2024-10-18 13:48:42
  Description: --
-->
<template>
  <div class="file-upload-form">
    <el-form ref="formRef" v-loading="loading" :element-loading-text="loadingText" element-loading-spinner="el-icon-loading"
      :model="formData" :rules="formRules">
      <el-form-item label="文件列表" prop="fileList" class="file-upload-form__item-file">
        <div v-show="!isFilesDropped" class="file-upload-form__upload">
          <div class="file-upload-form__upload-container" :class="{ 'dragging': isDragging }"
            @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop"
            @click="triggerFileInput">
            <i class="el-icon-upload file-upload-form__upload__icon" />
            <div class="file-upload-form__upload__text">将文件拖到此处，或<em
                class="file-upload-form__upload__text__em">点击上传</em></div>
            <input ref="fileRef" type="file" class="file-upload-form__upload__input" :accept="fileAccept" multiple
              @change="handleFileSelected">
          </div>
          <div class="file-upload-form__tip">{{ `只能上传 zip 格式的文件，且大小不超过 ${fileMaxSize}MB` }}</div>
        </div>
        <div v-show="isFilesDropped" class="file-upload-form__preview" :class="{ 'dragging': isDragging }" @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop">
          <div v-for="item in formData.fileList" class="file-upload-form__preview__item">
            <div class="file-upload-form__preview__item__file-container">
              <svg t="1790665910343" class="file-upload-form__preview__item__file-container__icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7956" width="32" height="32" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M252.928 0a166.912 166.912 0 0 0-166.912 166.656v691.2A166.912 166.912 0 0 0 252.928 1024h520.448a166.912 166.912 0 0 0 166.912-166.912V343.296a63.232 63.232 0 0 0-18.688-44.8L641.792 18.432A63.488 63.488 0 0 0 596.992 0z" fill="#FF803F" p-id="7957"></path><path d="M921.6 298.496L641.792 18.432A61.952 61.952 0 0 0 609.28 1.28a6.144 6.144 0 0 0-7.168 6.4v135.424a195.072 195.072 0 0 0 194.816 195.072h135.68a6.144 6.144 0 0 0 6.144-7.168 63.488 63.488 0 0 0-17.152-32.512z" fill="#F3671E" p-id="7958"></path><path d="M804.096 307.2h124.672a55.296 55.296 0 0 0-6.912-8.448L641.792 18.432a71.168 71.168 0 0 0-8.448-6.912v124.416A171.008 171.008 0 0 0 804.096 307.2z" fill="#FECEB4" p-id="7959"></path><path d="M300.032 623.104l96.512-133.888h-87.296v-31.232h137.728v22.272L350.976 614.4h97.024v31.488h-147.968zM484.608 457.984h41.216v187.648h-41.216zM576.768 457.984h67.84c54.016 0 80.896 19.456 80.896 58.88a54.016 54.016 0 0 1-23.296 46.336 96.256 96.256 0 0 1-56.576 15.104h-27.648v66.56h-41.216z m66.048 91.392c28.16 0 42.24-11.008 42.24-32.512a25.6 25.6 0 0 0-11.264-23.04 65.28 65.28 0 0 0-32.256-6.144h-23.552v61.696z" fill="#F5F6FA" p-id="7960"></path></svg>
              <div class="file-upload-form__preview__item__file-container__name">{{ item.name }}</div>
            </div>
            <div>
              <div class="file-upload-form__preview__item__actions">
                <i class="el-icon-delete file-upload-form__preview__item__actions__icon" @click="removeSelectedFile(item)" />
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <span v-if="!formData.category" style="color:red; margin-left:5px">请选择类型</span>
        <el-select v-model="formData.category" placeholder="请选择类型" style="width: 100%">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
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
import { FILE_ACCEPT, FILE_MAX_SIZE } from '@/constants/image'

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
        fileList: [],
        category: '',
      },

      formRules: {
        category: [{ required: true, message: '请选择类型' }],
        fileList: [{ required: true, message: '请上传文件' }]
      },

      fileAccept: FILE_ACCEPT,
      fileMaxSize: FILE_MAX_SIZE,

      isDragging: false,

      loading: false,
      loadingText: '文件上传中...',
    }
  },
  computed: {
    isFilesDropped() {
      return this.formData.fileList.length > 0
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
        (file) => this.validateFileType(file, this.fileAccept),
        this.validateFileSize
      ])
    },

    /**
     * @description 处理文件
     * @param {File[]} files
     */
    handleFiles(files) {
      const warningFiles = []
      files.forEach(file => {
        const idx = this.formData.fileList.findIndex(item => item.name === file.name)
        if (idx < 0) {
          this.formData.fileList.push(file)
        } else {
          warningFiles.push(file)
        }
      })
      if (warningFiles.length > 0) {
        this.$message.warning(`文件 ${warningFiles.map(item => item.name).join(',')} 已存在，无法重复添加`)
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
          .map(format => format.split('/')[1])
          .join(', ')

        return {
          success: false,
          message: `请上传 ${formattedFormats} 格式的文件`
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
    validateFileSize(file, maxSize = FILE_MAX_SIZE * 1024 * 1024) {
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
     * @description 移除所选文件
     * @param {File} item 文件对象
     */
    removeSelectedFile(item) {
      for (let i = 0; i < this.formData.fileList.length; i++) {
        if (this.formData.fileList[i] === item) {
          this.formData.fileList.splice(i, 1)
          break
        }
      }
    },

    /**
     * @description 上传
     */
    handleUpload() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) {
          // 校验不通过
          this.$message.error('请填写完整信息')
          return
        }
        // 校验通过
        let cntOfSuccess = 0 // 成功上传文件数
        let cntOfError = 0 // 失败上传文件数
        let errFiles = []
        this.setLoading(true, '开始上传文件')
        for (let i = 0; i < this.formData.fileList.length; i++) {
          const result = await this.uploadFile(this.formData.fileList[i], i, this.formData.fileList.length)
          if (result.isSuccess) {
            cntOfSuccess++
          } else {
            await new Promise(resolve => setTimeout(resolve, 500))
            this.setLoading(true, `文件 ${this.formData.fileList[i].name} 上传失败`)
            cntOfError++
            errFiles.push(this.formData.fileList[i])
          }
        }
        let str = `所有文件上传成功`
        if (cntOfError > 0) {
          str = `所有文件处理完成，文件 ${errFiles.map(item => item.name).join(',')} 上传失败`
        } else {
          str = `所有文件上传成功`
        }
        this.setLoading(true, str)
        this.$emit('success')
        setTimeout(() => {
          this.setLoading(false)
          cntOfError === 0 ? this.$message.success(str) : this.$message.error(str)
          this.formData.fileList = []
        }, 500)
      })
    },

    /**
     * @description 设置 loading 状态和消息
     * @param {boolean} value loading 状态
     * @param {string} message 消息内容
     */
    setLoading(value, message) {
      this.loading = value
      this.loadingText = message || '文件上传中...'
    },
    /**
     * @description 上传文件
     * @param {File} file 文件对象
     * @param {number} current 当前文件索引
     * @param {number} total 总文件数
     */
    async uploadFile(file, current, total) {
      this.setLoading(true, `上传文件 ${current + 1} / ${total}`)
      const formData = new FormData()
      formData.append('Env', this.$store.getters.env)
      formData.append('category', this.formData.category)
      formData.append('file', file, file.name)

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
      return new Promise((resolve) => {
        axios.post(url, formData, config).then(res => {
          const { status, data } = res || {}
          const { RetCode, Data } = data || {}
          resolve({
            isSuccess: status === 200 && RetCode === 0,
            file,
            current,
            total,
            data: Data,
          })
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.file-upload-form {
  padding: 12px;

  &__item-file {
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
    height: 220px;
    overflow: hidden;
    position: relative;
    overflow: auto;


    &.dragging {
      border-color: #2196F3;
      background-color: #E3F2FD;
    }

    &__item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: row;
      padding: 4px 0;
      border-bottom: 1px solid #E4E7ED;

      &__file-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        &__name {
          margin-left: 10px;
          color: #303133;
        }

      }

      &__actions {
        display: flex;

        &__icon {
          color: #303133;
          cursor: pointer;
          font-size: 16px;
            margin-right: 20px;

          &+& {
            margin-left: 20px;
          }
        }
      }

    }
  }
}
</style>
