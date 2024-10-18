<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <!--公共配置-->
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="14" :offset="3">
        <el-form ref="form" label-position="left">
          <template>
            <el-alert type="success" description="多个白名单用英文逗号(,)分开,没有时保留一个默认值： dd。发布配置后，有最长一分钟的延时" />
          </template>

          <el-row>
            <el-col :span="24">
              <el-form-item label="开放的Uid列表">
                <el-input v-model="item.Data" type="textarea" :rows="5" placeholder="多个白名单用英文逗号(,)分开,没有时保留一个默认值： dd" />
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col style="margin-top:16px;" :offset="8" :span="8">
        <el-button type="primary" size="mini" @click="setData()">保存</el-button>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libShow } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      item: {
      },
      load: false,
      form: {
      },
      libShow: $libShow,
      subKey: 'GameReturnWhiteListConfig',
      AttrNames: {
        'whiteStr': '白名单',
        types: {
          Data: 'string' // 整个数据项的类型
        }
      }
    }
  },

  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getData() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('cfg', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            this.item = response.Data
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
            // this.load = true
          }
        }
      })
    },
    getPostData() {
      return this.item
    },
    setData() {
      // 检验
      // this.item.whiteStr 去掉空格
      this.item.Data = this.item.Data.trim()
      // this.item.whiteStr 判空
      if (this.item.Data === '') {
        Message.error('请输入白名单')
        return
      }
      const $this = this
      // 设置修改后数据
      // console.log(this.form.Data)
      this.$refs.compare.SetNewVal(this.item.Data)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.item
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('base cfg response', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
