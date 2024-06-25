<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <!--公共配置-->
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="14" :offset="3">
        <el-form ref="form" label-position="left">

          <el-row>
            <el-col :span="24">
          <el-form-item label="活动桌子总开关">
            <el-switch
              v-model="item.ActivityTableSwitch"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开"
              inactive-text="关"
            />
          </el-form-item>

            </el-col>
          </el-row>

        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col style="margin-top:16px;" :offset="3" :span="8">
        <el-button type="primary" @click="setData()">保存</el-button>
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
import { $libShow, $libType, DataRule } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      item: {
        RankMaxDay: 0,
        RankMaxWeek: 0,
        DayPrizeList: [],
        WeekPrizeList: []
  	  },
      load: false,
      form: {
      },
      libShow: $libShow,
      subKey: 'activity_common_config',
      AttrNames: {
        'Data.ActivityTableSwitch': '活动桌子总开关',
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
    dataRule(required, config) {
      return DataRule(required, config)
    },
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
      const ret = JSON.parse(JSON.stringify(this.item))

      // console.log(this.item)
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
