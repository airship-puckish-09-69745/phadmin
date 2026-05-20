<template>
  <el-dialog
    title="选择应用"
    :visible.sync="dialogVisible"
    width="400px"
  >
    <el-tree
      ref="appTree"
      :data="treeData"
      :default-checked-keys="selectedKeys"
      show-checkbox
      node-key="value"
      default-expand-all
      @check-change="onCheckChange"
    />

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="onConfirm">{{ confirmText }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'

export default {
  name: 'MultiAppSelectDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    appOptions: {
      type: Array,
      default: function() {
        return []
      }
    },
    checkedKeys: {
      type: Array,
      default: function() {
        return []
      }
    },
    confirmText: {
      type: String,
      default: '确认'
    },
    cacheNamespace: {
      type: String,
      default: ''
    },
    excludeValues: {
      type: Array,
      default: function() {
        return [0]
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      selectedKeys: [],
      selectAllNodeKey: '__all__',
      hasInitializedSelection: false
    }
  },
  computed: {
    filteredAppOptions() {
      return this.appOptions.filter(app => this.excludeValues.indexOf(app.value) === -1)
    },
    treeData() {
      return [
        {
          label: '全选',
          value: this.selectAllNodeKey,
          children: this.filteredAppOptions.map(app => ({
            label: app.label,
            value: app.value
          }))
        }
      ]
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.dialogVisible = val
        if (val) {
          this.hasInitializedSelection = false
          this.syncSelectedKeys(true)
          this.hasInitializedSelection = true
        }
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
      if (!val) {
        this.hasInitializedSelection = false
      }
    },
    checkedKeys() {
      if (this.dialogVisible && !this.hasInitializedSelection) {
        this.syncSelectedKeys(false)
      }
    },
    appOptions() {
      if (this.dialogVisible) {
        const nextKeys = this.getValidKeys(this.selectedKeys)
        this.selectedKeys = nextKeys
        this.$nextTick(() => {
          if (this.$refs.appTree) {
            this.$refs.appTree.setCheckedKeys(nextKeys)
          }
        })
      }
    }
  },
  methods: {
    getStorageKey() {
      return 'multi-app-select:global'
    },
    getValidKeys(keys) {
      if (!Array.isArray(keys)) {
        return []
      }
      return keys.filter(key => this.filteredAppOptions.some(app => app.value === key))
    },
    getCachedKeys() {
      try {
        const raw = window.localStorage.getItem(this.getStorageKey())
        if (!raw) {
          return []
        }
        return this.getValidKeys(JSON.parse(raw))
      } catch (error) {
        return []
      }
    },
    syncSelectedKeys(preferCache = false) {
      const propKeys = this.getValidKeys(this.checkedKeys)
      const cachedKeys = preferCache ? this.getCachedKeys() : []
      const nextKeys = cachedKeys.length > 0 ? cachedKeys : propKeys
      this.selectedKeys = nextKeys
      this.$nextTick(() => {
        if (this.$refs.appTree) {
          this.$refs.appTree.setCheckedKeys(nextKeys)
        }
      })
    },
    persistSelectedKeys() {
      try {
        window.localStorage.setItem(this.getStorageKey(), JSON.stringify(this.selectedKeys))
      } catch (error) {
        // ignore storage errors
      }
    },
    onCheckChange(node, checked) {
      if (node.value === this.selectAllNodeKey) {
        if (checked) {
          this.selectedKeys = this.filteredAppOptions.map(app => app.value)
        } else {
          this.selectedKeys = []
        }
      } else if (checked) {
        this.selectedKeys = Array.from(new Set(this.selectedKeys.concat(node.value)))
      } else {
        this.selectedKeys = this.selectedKeys.filter(item => item !== node.value)
      }
      this.$emit('update:checkedKeys', this.selectedKeys.slice())
    },
    onConfirm() {
      if (this.selectedKeys.length === 0) {
        Message.warning('请至少选择一个应用')
        return
      }
      this.persistSelectedKeys()
      this.$emit('update:checkedKeys', this.selectedKeys.slice())
      this.$emit('confirm', this.selectedKeys.slice())
      this.dialogVisible = false
    }
  }
}
</script>
