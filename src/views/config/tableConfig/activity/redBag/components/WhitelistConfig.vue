<template>
  <el-form ref="whitelistForm" label-width="220px">
    <el-row>
      <el-col>
        <el-form-item label="白名单开关">
          <el-switch v-model="formData.isWhite" :active-value="true" :inactive-value="false" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item label="AppId白名单" prop="appIdList">
          <el-select
            v-model="formData.appIdList"
            multiple
            placeholder="请选择"
            style="width: 400px"
            @change="onAppIdOptionsChange"
          >
            <el-option
              v-for="item in appIdOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="SiteId白名单" prop="siteIdList">
          <SiteSelect
            v-model="formData.siteIdList"
            multiple
            placeholder="请选择"
            style="width: 400px"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <el-form-item label="A/B测试开关" prop="abTest">
          <el-switch
            v-model="formData.abTest.switch"
            :active-value="true"
            :inactive-value="false"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="9">
        <el-form-item label="B分组比例" prop="bPercent">
          <el-input
            v-model.number="formData.abTest.bPercent"
            placeholder="请输入B分组比例"
            style="width: 400px"
          >
            <template slot="append">
              %
            </template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import SiteSelect from '@/components/SiteSelect/index.vue'

export default {
  name: 'WhitelistConfig',
  components: { SiteSelect },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      appIdOptions: [
        { value: 1000002, label: '内部1000002' },
        { value: 1000003, label: '提审1000003' },
        { value: 1000005, label: '正式1000005' }
      ]
    }
  },
  computed: {
    formData: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    onAppIdOptionsChange() {
      console.log('onAppIdOptionsChange', this.formData.appIdList)
    }
  }
}
</script>

