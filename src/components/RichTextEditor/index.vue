<template>
  <el-dialog
    title="富文本编辑器"
    :visible.sync="dialogVisible"
    width="800px"
    top="5vh"
    append-to-body
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="cocos-rich-editor">
      <div class="toolbar">
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button size="small">
            字号 <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="s in sizeOptions" :key="s.value" :command="{ type: 'size', value: s.value }">
              {{ s.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown trigger="click" @command="handleCommand">
          <el-button size="small">
            颜色 <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="c in colorOptions" :key="c.value" :command="{ type: 'color', value: c.value }">
              <span class="color-preview" :style="{ backgroundColor: c.value }" />
              {{ c.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown trigger="click" @command="handleCommand">
          <el-button size="small">
            描边 <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="o in outlineOptions" :key="o.label" :command="{ type: 'outline', value: o.value }">
              {{ o.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-button-group>
          <el-button size="small" @click="handleCommand({ type: 'b' })">
            <b>B</b>
          </el-button>
          <el-button size="small" @click="handleCommand({ type: 'i' })">
            <i>I</i>
          </el-button>
          <el-button size="small" @click="handleCommand({ type: 'u' })">
            <u>U</u>
          </el-button>
        </el-button-group>

        <el-button-group>
          <el-button size="small" icon="el-icon-picture" @click="showImgDialog = true">图片</el-button>
          <el-button size="small" icon="el-icon-refresh-left" :disabled="!canUndo" @click="undo">撤销</el-button>
          <el-button size="small" icon="el-icon-refresh-right" :disabled="!canRedo" @click="redo">重做</el-button>
          <el-button size="small" icon="el-icon-delete" @click="clearContent">清空</el-button>
        </el-button-group>

        <el-button size="small" icon="el-icon-document-copy" @click="copyContent">复制代码</el-button>
      </div>

      <div class="editor-area">
        <el-input
          ref="textarea"
          v-model="content"
          type="textarea"
          :autosize="{ minRows: 8, maxRows: 20 }"
          placeholder="在此输入或粘贴 Cocos RichText 标签代码..."
          class="editor-textarea"
        />
      </div>

      <div class="preview-section">
        <div class="preview-header">
          <span>预览效果</span>
          <el-tag size="mini" type="info">RichText</el-tag>
        </div>
        <div ref="previewBox" class="preview-box">
          <div class="preview-content" v-html="renderedHtml" />
        </div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认并填入</el-button>
    </div>

    <el-dialog
      title="插入图片标签"
      :visible.sync="showImgDialog"
      width="400px"
      append-to-body
    >
      <el-form :model="imgForm" label-width="80px" size="small">
        <el-form-item label="图片地址">
          <el-input v-model="imgForm.src" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="图片宽度">
          <el-input v-model.number="imgForm.width" placeholder="如 100" />
        </el-form-item>
        <el-form-item label="图片高度">
          <el-input v-model.number="imgForm.height" placeholder="如 50" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="showImgDialog = false">取消</el-button>
        <el-button size="small" type="primary" @click="insertImgTag">插入</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { ToRawHtml } from '@/utils/common'

export default {
  name: 'CocosRichTextEditor',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    initialContent: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      content: '',
      showImgDialog: false,
      imgForm: {
        src: '',
        width: 0,
        height: 0
      },
      undoStack: [],
      redoStack: [],
      lastContent: '',
      ignoreWatch: false,
      sizeOptions: [
        { label: '12', value: 12 },
        { label: '14', value: 14 },
        { label: '16', value: 16 },
        { label: '18', value: 18 },
        { label: '20', value: 20 },
        { label: '24', value: 24 },
        { label: '28', value: 28 },
        { label: '32', value: 32 },
        { label: '36', value: 36 },
        { label: '40', value: 40 },
        { label: '48', value: 48 },
        { label: '56', value: 56 },
        { label: '64', value: 64 }
      ],
      colorOptions: [
        { label: '白色', value: '#ffffff' },
        { label: '黑色', value: '#000000' },
        { label: '黄色', value: '#ffff00' },
        { label: '金色', value: '#fffc00' },
        { label: '青色', value: '#00ffd2' },
        { label: '红色', value: '#ff0000' },
        { label: '蓝色', value: '#2553b3' },
        { label: '绿色', value: '#00ff00' },
        { label: '灰色', value: '#808080' },
        { label: '橙色', value: '#ff8c00' },
        { label: '紫色', value: '#9b59b6' },
        { label: '粉色', value: '#ff69b4' }
      ],
      outlineOptions: [
        { label: '蓝色描边(width=3)', value: { color: '#2553b3', width: 3 }},
        { label: '黑色描边(width=2)', value: { color: '#000000', width: 2 }},
        { label: '白色描边(width=2)', value: { color: '#ffffff', width: 2 }},
        { label: '白色描边(width=3)', value: { color: '#ffffff', width: 3 }},
        { label: '深色描边(width=4)', value: { color: '#1a1a1a', width: 4 }}
      ]
    }
  },
  computed: {
    renderedHtml() {
      return this.cocosToHtml(this.content)
    },
    canUndo() {
      return this.undoStack.length > 0
    },
    canRedo() {
      return this.redoStack.length > 0
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (val) {
        this.content = this.initialContent || ''
        this.lastContent = this.content
        this.undoStack = []
        this.redoStack = []
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
    },
    content(val, oldVal) {
      if (this.ignoreWatch) {
        this.ignoreWatch = false
        return
      }
      if (val === oldVal) return
      this.pushHistory(oldVal)
    }
  },
  methods: {
    pushHistory(prevVal) {
      const MAX_HISTORY = 50
      if (prevVal !== undefined && prevVal !== this.content) {
        this.undoStack.push(prevVal)
        if (this.undoStack.length > MAX_HISTORY) {
          this.undoStack.shift()
        }
      }
      this.redoStack = []
      this.lastContent = this.content
    },
    undo() {
      if (this.undoStack.length === 0) return
      const prev = this.undoStack.pop()
      this.redoStack.push(this.content)
      this.ignoreWatch = true
      this.content = prev
      this.lastContent = prev
      this.$nextTick(() => {
        const textarea = this.$refs.textarea && this.$refs.textarea.$el.querySelector('textarea')
        if (textarea) textarea.focus()
      })
    },
    redo() {
      if (this.redoStack.length === 0) return
      const next = this.redoStack.pop()
      this.undoStack.push(this.content)
      this.ignoreWatch = true
      this.content = next
      this.lastContent = next
      this.$nextTick(() => {
        const textarea = this.$refs.textarea && this.$refs.textarea.$el.querySelector('textarea')
        if (textarea) textarea.focus()
      })
    },
    handleCommand(cmd) {
      if (!cmd || !cmd.type) return
      const textarea = this.$refs.textarea && this.$refs.textarea.$el.querySelector('textarea')
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selected = this.content.substring(start, end)

      let before = ''
      let after = ''

      switch (cmd.type) {
        case 'size':
          before = `<size=${cmd.value}>`
          after = '</size>'
          break
        case 'color':
          before = `<color=${cmd.value}>`
          after = '</color>'
          break
        case 'b':
          before = '<b>'
          after = '</b>'
          break
        case 'i':
          before = '<i>'
          after = '</i>'
          break
        case 'u':
          before = '<u>'
          after = '</u>'
          break
        case 'outline':
          before = `<outline color=${cmd.value.color} width=${cmd.value.width}>`
          after = '</outline>'
          break
      }

      const newContent = this.content.substring(0, start) + before + (selected || '文本') + after + this.content.substring(end)
      this.content = newContent

      this.$nextTick(() => {
        textarea.focus()
        const newStart = start + before.length
        const newEnd = newStart + (selected || '文本').length
        textarea.setSelectionRange(newStart, newEnd)
      })
    },
    insertImgTag() {
      const { src, width, height } = this.imgForm
      if (!src) {
        this.$message.warning('请输入图片地址')
        return
      }
      const textarea = this.$refs.textarea && this.$refs.textarea.$el.querySelector('textarea')
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      let imgTag = `<img src='${src}'`
      if (width) imgTag += ` width=${width}`
      if (height) imgTag += ` height=${height}`
      imgTag += '/>'

      const newContent = this.content.substring(0, start) + imgTag + this.content.substring(end)
      this.content = newContent
      this.showImgDialog = false
      this.imgForm = { src: '', width: 0, height: 0 }
    },
    copyContent() {
      if (!this.content) {
        this.$message.warning('没有内容可复制')
        return
      }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.content).then(() => {
          this.$message.success('已复制到剪贴板')
        }).catch(() => {
          this.fallbackCopy()
        })
      } else {
        this.fallbackCopy()
      }
    },
    fallbackCopy() {
      const textarea = document.createElement('textarea')
      textarea.value = this.content
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        this.$message.success('已复制到剪贴板')
      } catch (e) {
        this.$message.error('复制失败，请手动复制')
      }
      document.body.removeChild(textarea)
    },
    clearContent() {
      this.content = ''
    },
    handleConfirm() {
      this.$emit('confirm', this.content, this.cocosToHtml(this.content))
      this.dialogVisible = false
    },
    handleClose() {
      this.$emit('close')
    },

    cocosToHtml(text) {
      return ToRawHtml(text)
    }
  }
}
</script>

<style scoped>
.cocos-rich-editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

.color-preview {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 8px;
  border: 1px solid #dcdfe6;
  vertical-align: middle;
}

.editor-area {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.editor-textarea >>> textarea {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  padding: 12px;
}

.preview-section {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fafafa;
  border-bottom: 1px solid #ebeef5;
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.preview-box {
  padding: 20px;
  background: #ffffff;
  min-height: 150px;
  max-height: 300px;
  overflow-y: auto;
}

.preview-content {
  color: #303133;
  line-height: 1.6;
  word-break: break-word;
}
</style>
