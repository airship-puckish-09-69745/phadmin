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
            v-model="formData.AppIdList"
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
          <SiteSelect v-model="formData.SiteIdList" multiple placeholder="请选择" style="width: 400px" />
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
import SiteSelect from '@/components/SiteSelect/index.vue'

export default {
  name: 'WhiteListConfig',
  components: {
    SiteSelect
  },
  props: {
    config: {
      type: Object,
      default: () => ({
        // 白名单开关
        IsWhite: false,
        // AppId白名单
        AppIdList: [],
        // SiteId白名单
        SiteIdList: []
      })
    }
  },
  data() {
    return {
      formData: {
        IsWhite: false,
        AppIdList: [],
        SiteIdList: []
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
      this.formData.AppIdList = value
    },
    onSiteIdOptionsChange(value) {
      this.formData.SiteIdList = value
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    handleUpdateConfigData() {
      this.$emit('update', 'WhiteList', this.formData)
    }
  }
}
</script>
