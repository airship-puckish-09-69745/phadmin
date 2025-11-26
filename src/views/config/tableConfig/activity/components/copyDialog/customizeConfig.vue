<template>
  <div>
    <el-row>
      <el-dialog
        title="复制配置到目标AppId"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="onClose"
        width="400px"
      >
        <el-alert
          v-if="toAppIdExisted"
          type="warning"
          description="目标AppId已存在配置，是否覆盖？"
          show-icon
          :closable="false"
          style="margin-bottom: 8px"
        />
        <el-select
          v-model="toAppId"
          placeholder="请选择目标AppId"
          @change="getData"
          style="width: 250px;"
        >
          <el-option label="请选择" :value="0"></el-option>
          <el-option v-for="item in appList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-button type="primary" style="margin-left: 12px;" @click="onSave">确认复制</el-button>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>

import request from "@/utils/request";
import {copyCustomize, existCustomize} from "@/api/custome_configV2";

export default {
  name: 'CustomizeConfigCopyDialog',
  props: {
    configKey: {
      type: String,
      default: ''
    },
    fromAppId: {
      type: Number,
      default: 0
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible: {
      handler(newVal) {
        if (newVal) {
          this.$nextTick(() => this.getApps())
        }
        this.dialogVisible = newVal
      },
      immediate: true
    }
  },
  data() {
    return {
      appList: [],
      toAppId: 0,
      dialogVisible: false,
      toAppIdExisted: false
    }
  },
  methods: {
    getData() {
      existCustomize(this.configKey, this.toAppId).then(response => {
        if (response.RetCode === 0) {
          if (response.Data) {
            this.toAppIdExisted = true
            this.$message({
              message: '目标AppId配置已存在',
              type: 'warning'
            })
          } else {
            this.toAppIdExisted = false
          }
        }
      })
    },
    async getApps() {
      await request({
        url: '/adminuser/apps',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          this.appList = []
          const list = response.Data || []
          for (const item of list) {
            if (item.id !== this.fromAppId) {
              this.appList.push({
                id: item.id,
                name: item.id + '-' + item.name
              })
            }
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    onSave() {
      console.log('onSave customizeConfigDialog this.toAppId', this.toAppId)

      if (this.toAppId === 0) {
        this.$message({
          message: '请选择目标AppId',
          type: 'warning'
        })
        return
      }

      // 是否确认复制
      this.$confirm('确认复制配置到目标AppId吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认复制
        copyCustomize(this.configKey, this.fromAppId, this.toAppId).then(response => {
          if (response.RetCode === 0) {
            this.$message({
              message: '复制成功',
              type: 'success'
            })
          }
        }).catch(err => {
          console.log(err)
        })
        this.$emit('save', this.configKey, this.toAppId)
        this.$emit('close')
      }).catch(() => {
        // 取消复制
      })
    },
    onClose() {
      console.log('onClose customizeConfigDialog')
      this.toAppId = 0
      this.toAppIdExisted = false
      this.$emit('close')
    }
  }
}

</script>

<style scoped>

</style>
