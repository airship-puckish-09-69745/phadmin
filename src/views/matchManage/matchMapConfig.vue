<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>
    <el-row style="margin: 10px 0;">
      <el-form inline>
        <el-form-item label="活动状态：">
          <el-radio v-model="open" label="1">启用</el-radio>
          <el-radio v-model="open" label="0">关闭</el-radio>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row :gutter="10">
      <el-form inline>
        <el-form-item label="map内容：">
          <ImagePicker v-model="item.ImageLink" />
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <br>
      <el-button type="primary" @click="setData">保存</el-button>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </el-col>
</template>

<script>
import Publish from '@/components/Publish/index.vue'
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import { Message } from 'element-ui'
import request from '@/utils/request'
import Compare from '@/components/Compare/index.vue'
import { $libShow } from '@/utils/common'

export default {
  components: { Compare, ImagePicker, Publish },
  data() {
    return {
      subKey: 'matchMap_cfg',
      libShow: $libShow,
      form: {
        Data: {}
      },
      item: {
        IsOpen: true,
        ImageLink: ''
      },
      open: '1'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(res => {
        if (res.RetCode === 0) {
          $this.form = res.Data || {}
          if (res.Data && res.Data.Data !== '' && res.Data.Data !== '{}') {
            $this.item = JSON.parse(res.Data.Data)
            $this.open = $this.item.IsOpen ? '1' : '0'
            const old = JSON.parse(res.Data.Data)
            this.$refs.compare.SetOldVal(old)
          }
        }
      })
    },
    encodeData() {
      const cpy = {}
      this.item.IsOpen = this.open === '1'
      Object.assign(cpy, this.item)
      return JSON.stringify(cpy)
    },
    setData() {
      this.form.Data = this.encodeData()
      console.log('setData', this.form.Data)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
