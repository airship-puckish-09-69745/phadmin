<template>
  <div class="zip-uploader">
    <h2>ZIP 文件上传与解压</h2>
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

        // 逐个上传文件
        for (const file of this.extractedFiles) {
          try {
            const formData = new FormData();
            formData.append('Env', this.$store.getters.env);
            formData.append('category', 'audit/');
            formData.append('file', file.blob, file.name);
            formData.append('ife', 1); //是否覆盖原文件

            const url = process.env.VUE_APP_BASE_API + '/file/upload';

            const response = await axios.post(url, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              onUploadProgress: (progressEvent) => {
                // 计算整体进度
                const fileProgress = progressEvent.loaded / progressEvent.total;
                this.progress = Math.round(
                  ((uploadedCount + fileProgress) / totalFiles) * 100
                );
              }
            });

            this.uploadStatus.push({
              filename: file.name,
              status: 'success',
              message: '上传成功'
            });
          } catch (err) {
            this.uploadStatus.push({
              filename: file.name,
              status: 'error',
              message: err.response?.data?.message || err.message
            });
          }

          uploadedCount++;
        }

        this.message = `文件上传完成 (${uploadedCount}/${totalFiles})`;
        this.error = this.uploadStatus.some(s => s.status === 'error');
      } catch (err) {
        this.message = '上传过程中出错: ' + err.message;
        this.error = true;
        console.error('上传错误:', err);
      } finally {
        this.isUploading = false;
        this.progress = 0;
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
