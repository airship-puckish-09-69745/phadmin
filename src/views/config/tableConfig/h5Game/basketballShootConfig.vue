<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <!--公共配置-->
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="8" :offset="4">
        <el-form ref="form" label-position="left">
          <el-row>
            <el-col :span="24">
              <el-form-item label="分享链接：">
                <el-input v-model.number="item.ShareLink" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="防刷设置-间隔时间">
                <el-input v-model="item.GuardTime" placeholder="请设置防刷的时间间隔，单位为秒">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="防刷设置-最大兑奖券数量">
                <el-input v-model="item.RedeemMax" placeholder="请设置同IP在指定时间段内能够产生的最大兑奖券数量">
                  <template slot="append">个</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="游戏时长">
                <el-input v-model="item.GameDuration" placeholder="请设置游戏时长，单位为秒">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col style="margin-top:16px;" :offset="7" :span="8">
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
      item: {},
      load: false,
      form: {
      },
      libShow: $libShow,
      subKey: 'basketball_shoot',
      AttrNames: {
        'Data.ShareLink': '分享链接',
        'Data.GuardTime': '防刷设置-间隔时间',
        'Data.RedeemMax': '防刷设置-最大兑奖券数量',
        'Data.GameDuration': '游戏时长',
        types: {
          Data: 'jsonString' // 整个数据项的类型
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
            const cfg = JSON.parse(response.Data.Data)
            this.item = cfg

            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
            // this.load = true
          }
        }
      })
    },
    getPostData() {
      const ret = {}
      Object.assign(ret, this.item)

      return ret
    },
    setData() {
      // 检验
      this.form.Data = JSON.stringify(this.getPostData())
      const $this = this
      // 设置修改后数据
      // console.log(this.form.Data)
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
            console.log('base cfg response', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
<style>
.symbol-img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
.symbol-img:hover, .symbol-img.active {
  border: 3px solid red;
}

</style>
