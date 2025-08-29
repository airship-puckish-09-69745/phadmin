<template>
  <div class="zip-uploader">
    <h2>头像资源ZIP文件上传与解压</h2>
    <div class="upload-area" @dragover.prevent="dragover" @drop.prevent="drop">
      <input
        type="file"
        id="zip-upload"
        accept=".zip"
        @change="handleFileChange"
        ref="fileInput"
      />
      <label for="zip-upload" class="upload-label">
        <div v-if="!file">
          <p>点击选择或拖拽 ZIP 文件到此处</p>
          <p class="hint">(仅支持 .zip 格式)</p>
        </div>
        <div v-else>
          <p>已选择文件: {{ file.name }}</p>
          <p>大小: {{ formatFileSize(file.size) }}</p>
          <p v-if="extractedFiles.length > 0">
            包含 {{ extractedFiles.length }} 个文件
          </p>
        </div>
      </label>
    </div>

    <button
      @click="uploadExtractedFiles"
      :disabled="!file || isUploading || extractedFiles.length === 0"
      class="upload-btn"
    >
      {{ isUploading ? `上传中... ${progress}%` : '解压并上传文件' }}
    </button>

    <div v-if="message" :class="['message', error ? 'error' : 'success']">
      {{ message }}
    </div>

    <!-- 上传进度和文件列表 -->
    <div v-if="uploadStatus.length > 0" class="upload-status">
      <h3>上传状态</h3>
      <div v-for="(status, index) in uploadStatus" :key="index" class="file-status">
        <span>{{ status.filename }}</span>
        <span :class="status.status">{{ status.status }}</span>
        <span v-if="status.message"> - {{ status.message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import JSZip from 'jszip';
import axios from 'axios';
import store from "@/store";
import {getToken} from "@/utils/auth";

export default {
  data() {
    return {
      file: null,
      progress: 0,
      message: '',
      error: false,
      isUploading: false,
      extractedFiles: [], // 存储解压后的文件
      uploadStatus: [], // 上传状态跟踪
    };
  },
  methods: {
    handleFileChange(event) {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile.name.endsWith('.zip')) {
        this.file = selectedFile;
        this.message = '';
        this.error = false;
        this.extractZipFile();
      } else {
        this.message = '请选择有效的 ZIP 文件';
        this.error = true;
      }
    },

    async extractZipFile() {
      if (!this.file) return;
     if (this.file.size >= 1024*1024*512){
        this.message = '文件过大,大于512M'
        this.error = true;
        this.isUploading = false;
        return;
      }
      try {
        this.isUploading = true;
        this.message = '正在解压ZIP文件...';

        const zip = await JSZip.loadAsync(this.file);
        this.extractedFiles = [];

        // 获取ZIP中所有文件
        const filePromises = [];
        zip.forEach((relativePath, zipEntry) => {
          if (!zipEntry.dir) { // 忽略目录
            filePromises.push(
              zipEntry.async('blob').then(blob => {
                return {
                  name: zipEntry.name,
                  blob: blob,
                  size: zipEntry._data.uncompressedSize
                };
              })
            );
          }
        });

        this.extractedFiles = await Promise.all(filePromises);
        this.message = `解压完成，共 ${this.extractedFiles.length} 个文件`;
        this.error = false;
      } catch (err) {
        this.message = '解压失败: ' + err.message;
        this.error = true;
        console.error('解压错误:', err);
      } finally {
        this.isUploading = false;
      }
    },

    // async uploadExtractedFiles() {
    //   if (this.extractedFiles.length === 0) return;
    //
    //   try {
    //     this.isUploading = true;
    //     this.progress = 0;
    //     this.message = '开始上传文件...';
    //     this.error = false;
    //     this.uploadStatus = [];
    //
    //     const totalFiles = this.extractedFiles.length;
    //     let uploadedCount = 0;
    //     let successCount = 0;
    //     let warningCount = 0;
    //     let failedCount = 0
    //     console.log('准备上传的文件:', this.extractedFiles);
    //     // 逐个上传文件
    //     for (const file of this.extractedFiles) {
    //       try {
    //         console.log('正在上传文件:', file.name);
    //         const formData = new FormData();
    //         formData.append('Env', this.$store.getters.env);
    //         formData.append('category', 'audit/');
    //         formData.append('file', file.blob, file.name);
    //         formData.append('ife', 1); // 是否覆盖原文件
    //
    //         console.log('正在上传文件111:', file.name);
    //
    //         const url = process.env.VUE_APP_BASE_API + '/file/upload';
    //         const response = await axios.post(url, formData, {
    //           headers: {
    //             'Content-Type': 'multipart/form-data'
    //           },
    //           onUploadProgress: (progressEvent) => {
    //             const fileProgress = progressEvent.loaded / progressEvent.total;
    //             this.progress = Math.round(
    //               ((uploadedCount + fileProgress) / totalFiles) * 100
    //             );
    //           }
    //         });
    //         // 根据服务器响应判断上传结果
    //         if (response.status === 200 && response.data && response.data.RetCode === 0) {
    //           // 完全成功的响应
    //           this.uploadStatus.push({
    //             filename: file.name,
    //             status: 'success',
    //             message: response.data.message || '上传成功',
    //             data: response.data.data // 保存服务器返回的完整数据
    //           });
    //           successCount++
    //         } else {
    //           console.log('上传警告:', 1111);
    //           this.uploadStatus.push({
    //             filename: file.name,
    //             status: 'fail',
    //             message: response.data.Data,
    //             data: response.data.data
    //           });
    //           failedCount++
    //         }
    //       } catch (err) {
    //         const errorMessage = err.response?.data?.message ||
    //           (err.response?.data?.error || err.message);
    //         console.error('上传错误:', err, '文件:', file.name);
    //         this.uploadStatus.push({
    //           filename: file.name,
    //           status: 'error',
    //           message: errorMessage,
    //           data: err.response?.data || null
    //         });
    //       }
    //       uploadedCount++;
    //     }
    //
    //     // 最终状态汇总
    //
    //     if (failedCount === 0 && warningCount === 0) {
    //       this.message = `所有文件上传成功 (${successCount}/${totalFiles})`;
    //       this.error = false;
    //     } else if (failedCount === 0) {
    //       this.message = `上传完成，${successCount}个成功，${warningCount}个有警告`;
    //       this.error = false;
    //     } else if (successCount > 0 || warningCount > 0) {
    //       this.message = `上传完成，${successCount}个成功，${warningCount}个有警告，${failedCount}个失败`;
    //       this.error = true;
    //     } else {
    //       this.message = '所有文件上传失败';
    //       this.error = true;
    //     }
    //
    //     // 如果有上传结果，可以在这里处理
    //     const successfulUploads = this.uploadStatus.filter(f => f.status === 'success');
    //     if (successfulUploads.length > 0) {
    //       console.log('成功上传的文件数据:', successfulUploads.map(f => f.data));
    //     }
    //
    //   } catch (err) {
    //     this.message = '上传过程中出错: ' + (err.response?.data?.message || err.message);
    //     this.error = true;
    //     console.error('上传错误:', err);
    //   } finally {
    //     this.isUploading = false;
    //     this.progress = 0;
    //
    //     // 可以在这里触发上传完成的事件或回调
    //     this.$emit('upload-complete', {
    //       total: this.extractedFiles.length,
    //       success: this.uploadStatus.filter(f => f.status === 'success').length,
    //       warning: this.uploadStatus.filter(f => f.status === 'warning').length,
    //       failed: this.uploadStatus.filter(f => f.status === 'error').length,
    //       details: this.uploadStatus
    //     });
    //   }
    // },

    async uploadExtractedFiles() {
      if (this.extractedFiles.length === 0) return;

      try {
        this.isUploading = true;
        this.progress = 0;
        this.message = '开始上传文件...';
        this.error = false;
        this.uploadStatus = [];

        const totalFiles = this.extractedFiles.length;
        let uploadedCount = 0;
        let successCount = 0;
        let failedCount = 0;

        // 顺序上传文件（避免并行请求可能的问题）
        for (const file of this.extractedFiles) {
          try {
            const formData = new FormData();
            formData.append('Env', this.$store.getters.env);
            formData.append('category', 'audit/');
            formData.append('file', file.blob, file.name);
            formData.append('ife', 1);

            const url = process.env.VUE_APP_BASE_API + '/file/upload';

            const config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
            }
            if (store.getters.token) {
              config.headers['X-Token'] = getToken()
            }

            // 简化版本：移除进度事件处理
            const response = await axios.post(url, formData,config);

            const { status, data } = response || {};
            const { RetCode } = data || {};

            if (status === 200 && RetCode === 0) {
              this.uploadStatus.push({
                filename: file.name,
                status: 'success',
                message: data.message || '上传成功',
                data: data.data
              });
              successCount++;
            } else {
              this.uploadStatus.push({
                filename: file.name,
                status: 'fail',
                message: data?.Data || '上传失败',
                data: data?.data
              });
              failedCount++;
            }
          } catch (err) {
            const errorMessage = err.response?.data?.message ||
              (err.response?.data?.error || err.message);
            this.uploadStatus.push({
              filename: file.name,
              status: 'error',
              message: errorMessage,
              data: err.response?.data || null
            });
            failedCount++;
          } finally {
            uploadedCount++;
            this.progress = Math.round((uploadedCount / totalFiles) * 100);
          }
        }

        // 最终状态汇总
        if (failedCount === 0) {
          this.message = `所有文件上传成功 (${successCount}/${totalFiles})`;
          this.error = false;
        } else if (successCount > 0) {
          this.message = `上传完成，${successCount}个成功，${failedCount}个失败`;
          this.error = true;
        } else {
          this.message = '所有文件上传失败';
          this.error = true;
        }

      } catch (err) {
        this.message = '上传过程中出错: ' + (err.response?.data?.message || err.message);
        this.error = true;
        console.error('上传错误:', err);
      } finally {
        this.isUploading = false;
        this.progress = 0;

        let successCount = successCount;
        let failedCount = failedCount;
        this.$emit('upload-complete', {
          total: this.extractedFiles.length,
          success: successCount,
          failed: failedCount,
          details: this.uploadStatus
        });
      }
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    dragover(event) {
      event.currentTarget.classList.add('dragover');
    },

    drop(event) {
      event.currentTarget.classList.remove('dragover');
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile && droppedFile.name.endsWith('.zip')) {
        this.file = droppedFile;
        this.message = '';
        this.error = false;
        this.extractZipFile();
      } else {
        this.message = '请拖放有效的 ZIP 文件';
        this.error = true;
      }
    }
  }
};
</script>

<style scoped>
.zip-uploader {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  margin: 20px 0;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover, .upload-area.dragover {
  border-color: #42b983;
  background-color: #f8f8f8;
}

.upload-label {
  display: block;
  cursor: pointer;
}

.hint {
  font-size: 0.8em;
  color: #888;
}

.upload-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  margin-bottom: 20px;
}

.upload-btn:hover:not(:disabled) {
  background-color: #369f6b;
}

.upload-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
}

.success {
  background-color: #dff0d8;
  color: #3c763d;
}

.error {
  background-color: #f2dede;
  color: #a94442;
}

.upload-status {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.file-status {
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
}

.file-status .success {
  color: #3c763d;
}

.file-status .error {
  color: #a94442;
}
</style>
