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
          <div class="image-upload-form__tip">只能上传jpg/jpeg/png文件，且不超过 1M</div>
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
      <el-form-item label="分类" prop="type">
        <el-select v-model="formData.type" placeholder="请选择" style="width: 100%">
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

export default {
  name: 'ImageUploadForm',
  props: {
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: {
        file: null,
        dataUrl: '',
        type: ''
      },

      formRules: {
        dataUrl: [{ required: true, message: '请选择图片' }],
        type: [{ required: true, message: '请选择类型' }]
      },

      imageAccept: 'image/png, image/jpeg',

      isDragging: false,

      loading: false
    }
  },
  methods: {
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
     * @description 处理文件
     * @param {File[]} files
     */
    handleFiles(files) {
      const file = files[0]

      if (file) {
        // 校验文件格式
        const formatValidRes = this.validateFileFormat(file, this.imageAccept)
        if (!formatValidRes.success) {
          this.$message.error(formatValidRes.message)
          return
        }

        // 校验文件大小
        const sizeValidRes = this.validateFileSize(file)
        if (!sizeValidRes.success) {
          this.$message.error(sizeValidRes.message)
          return
        }

        this.setSelectedFile(file)
      }
    },

    /**
     * @description 校验文件大小
     * @param {File} file 文件对象
     * @param {number} [maxSize] 可选，文件大小上限，单位 byte，默认 1MB
     * @returns {{ success: true, message: '' }} 返回校验结果，`success=true` 表示校验通过，反之，则不通过；`message` 的值为错误消息
     */
    validateFileSize(file, maxSize = 1 * 1024 * 1024) {
      if (file.size > maxSize) {
        const sizeInMB = maxSize / (1024 * 1024)
        const fileSizeInMB = file.size / (1024 * 1024)

        return {
          success: false,
          message: `文件大小不能超过 ${sizeInMB.toFixed(2)}MB。当前文件大小：${fileSizeInMB.toFixed(2)}MB`
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
    validateFileFormat(file, format) {
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
      formData.append('category', this.formData.type)
      formData.append('file', this.formData.file)

      const url = process.env.VUE_APP_BASE_API + '/file/upload'
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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
