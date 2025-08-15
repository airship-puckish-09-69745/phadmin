<template>
  <el-form ref="item" label-width="220px">
    <el-row>
      <el-col :span="11">
        <el-form-item label="AppId白名单：">
          <el-select
            v-model="formData.AppIdList"
            placeholder="请选择"
            style="width: 400px"
            multiple
            @change="onAppIdOptionsChange">
            <el-option v-for="item in APPID_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="SiteId白名单dd：">
          <el-select
            v-model="formData.SiteIdList"
            placeholder="请选择"
            style="width: 400px"
            multiple
            @change="onSiteIdOptionsChange"
          >
            <el-option v-for="item in CHANNEL_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
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
import { APPID_OPTIONS, CHANNEL_OPTIONS } from '@/utils/options'
export default {
  name: 'MatchFreeGuideConfig',
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
      APPID_OPTIONS,
      CHANNEL_OPTIONS
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
      this.$emit('update', 'MatchFreeGuideConfig', this.formData)
    }
  }
}
</script>
