<template>
  <div>
    <el-dropdown trigger="click" @command="handleSetEnv">
      <span class="el-dropdown-link">
        {{ showEnv() }}<i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item of envOptions" :key="item.value" :disabled="env===item.value" :command="item.value">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-select
      v-if="isNewVersion()"
      v-model="selectedAppId"
      filterable
      placeholder="选择AppId"
      class="app-id-select"
      @change="handleSetAppId"
    >
      <el-option
        v-for="item in appOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="selectedAppId===item.value"
      />
    </el-select>
  </div>
</template>

<script>
import request from '@/utils/request'
import { isNewVersion, switchNewAppEnv, switchOldAppEnv, switchAppId, getAppId } from '@/utils/app'

export default {
  data() {
    return {
      envOptions: [
        { label: '旧版测试', value: 'test' },
        { label: '旧版线上', value: 'pro' },
        { label: '新版测试', value: 'new-test' },
        { label: '新版线上', value: 'new-pro' }
      ],
      oldEnv: '',
      appOptions: [
        // { label: '1000002-内部平台', value: '1000002' },
        // { label: '1000003-testaccount', value: '1000003' },
        // { label: '1000005-BingoPlusTongits', value: '1000005' }
      ],
      selectedAppId: isNewVersion() ? parseInt(getAppId()) : ''
    }
  },
  computed: {
    env() {
      if (this.isNewVersion()) {
        return 'new-' + this.$store.getters.env
      }
      return this.$store.getters.env
    }
  },
  mounted() {
    this.oldEnv = this.env
    this.getAppIdOptions()
  },
  methods: {
    isNewVersion,
    getAppIdOptions() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Status !== 2) {
              continue
            }
            this.appOptions.push({
              value: response.Data[i].ID,
              label: response.Data[i].ID + '-' + response.Data[i].Account
            })
          }
        }
      })
    },
    showEnv() {
      for (const item of this.envOptions) {
        if (item.value === this.env) {
          return item.label
        }
      }
      return '-'
    },
    handleSetEnv(env) {
      if (env.indexOf('-') >= 0) {
        // 切到新版环境
        const newEnv = env.split('-')[1]
        const defaultAppId = this.appOptions ? this.appOptions[0].value : 1000002
        switchNewAppEnv(newEnv, defaultAppId, this)
      } else {
        // 切到旧版环境
        switchOldAppEnv(env, this)
      }

      console.log('handleSetEnv env', env)
    },
    handleSetAppId(appId) {
      switchAppId(appId, this)
    }
  }

}
</script>

<style lang="scss" scoped>.app-id-select {
  display: inline-block;
  margin-left: 10px;

  ::v-deep .el-input__inner {
    border: none;
    background: transparent;
    padding-left: 0;
    padding-right: 20px;
    height: auto;
    line-height: inherit;
  }

  ::v-deep .el-input__suffix {
    right: 0;
  }
}

//.el-dropdown-link {
//  cursor: pointer;
//  color: #409eff;
//}
</style>
