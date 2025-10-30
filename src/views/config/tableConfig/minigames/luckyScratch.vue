<template>
  <div class="app-container">
    <el-row>
      <!-- <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" /> -->
      <!-- <el-button type="warning" round @click="showUserArea">用户在玩图案</el-button> -->
    </el-row>
    <!--公共配置-->
   <el-row>
     <el-tab-pane label="奖金配置">
         <h2 style="text-align:center;">10面值单个格子奖金出现权重</h2>
     </el-tab-pane>
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
import { $libShow, $libType } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      
      load: false,
      form: {
      },
      showArea: {
        visible: false,
        uid: 0,
        showUlReslt: false
      },
      envProjectName: process.env.VUE_APP_PROJECT,
      towerData: '',
      JackpotTypeCfg: {
        1: '一等奖',
        2: '二等奖',
        3: '三等奖',
        4: '3Bet中奖'
      },
      subKey: 'tower_cfg',
     
    }
  },

  created() {
    this.getData()
  },
  methods: {
  	getLabelName(k) {
  		return this.levelCfg[k]
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
          console.log('tower cfg', response)
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
    },
   
  }
}
</script>

