<template>
  <el-form ref="item" label-width="220px">
    <el-row>
      <el-col>
        <el-form-item label="白名单开关：" :rules="dataRule(true, { type: 'n', range: '0' })">
          <el-switch v-model="formData.IsWhite" :active-value="true" :inactive-value="false" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item label="AppId白名单：">
          <el-select
            v-model="formData.AppId"
            placeholder="请选择"
            style="width: 400px"
            @change="onAppIdOptionsChange"
          >
            <el-option v-for="item in appIdOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="SiteId白名单：">
          <el-select
            v-model="formData.SiteId"
            placeholder="请选择"
            style="width: 400px"
            @change="onSiteIdOptionsChange"
          >
            <el-option v-for="item in siteIdOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col>
        <el-button type="primary" @click="handleUpdateConfigData">保存配置</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { DataRule } from '@/utils/common'
export default {
  name: 'WhiteListConfig',
  props: {
    config: {
      type: Object,
      default: () => ({
        // 白名单开关
        IsWhite: false,
        // AppId白名单
        AppId: [],
        // SiteId白名单
        SiteId: ''
      })
    }
  },
  data() {
    return {
      formData: {
        IsWhite: false,
        AppId: '',
        SiteId: ''
      },
      appIdOptions: [
        {
          value: 1000002,
          label: '内部1000002'
        },
        {
          value: 1000003,
          label: '提审1000003'
        },
        {
          value: 1000005,
          label: '正式1000005'
        }
      ],
      siteIdOptions: [
        { value: 'BP', label: 'BP' },
        { value: 'AP', label: 'AP' },
        { value: 'GP', label: 'GP' },
        { value: 'TP', label: 'TP' },
        { value: 'PG', label: 'PG' },
        { value: 'Dev', label: 'Dev' }
      ]
    }
  },
  watch: {
    config: {
      handler(newVal) {
        this.formData = { ...newVal }
      },
      immediate: true
    }
  },
  methods: {
    onAppIdOptionsChange(value) {
      this.formData.AppId = value
    },
    onSiteIdOptionsChange(value) {
      this.formData.Sites = value
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    handleUpdateConfigData() {
      this.$emit('update', 'WhiteListConfig', this.formData)
    }
  }
}
</script>
