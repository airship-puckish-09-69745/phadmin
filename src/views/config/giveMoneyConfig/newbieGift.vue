<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-row style="margin-top: 30px">
      <el-col :span="12" :offset="4">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-form-item label="输钱返利比例：" label-width="150px">
              <el-col :span="2">
                <el-input v-model.number="item.loseRebateRatio" />
              </el-col>%
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="输钱返利上限：" label-width="150px">
              <el-col :span="2">
                <el-input v-model.number="item.loseRebateLimit" />
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="首充返利上限：" label-width="150px">
              <el-col :span="2">
                <el-input v-model.number="item.rebateUpperLimit" />
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="领取条件bet上限：" label-width="150px">
              <el-col :span="2">
                <el-input v-model.number="item.betLimit" />
              </el-col>
            </el-form-item>
          </el-row>
          <el-table
            :data="item.rechargeItemsCfg"
            style="width: 100%"
            border
          >
            <el-table-column
              prop="lowerLimit"
              label="额度下限"
              width="150"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.lowerLimit" label-width="0" label="" :is-require="true" />
              </template>
            </el-table-column>
            <el-table-column
              prop="upperLimit"
              label="额度上限"
              width="150"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.upperLimit" label-width="0" label="" :is-require="true" />
              </template>
            </el-table-column>
            <el-table-column
              prop="showMoney"
              label="界面显示金额"
              width="150"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.showMoney" label-width="0" label="" :is-require="true" />
              </template>
            </el-table-column>
            <el-table-column
              prop="rebateRatio"
              label="首充返利比例%"
              width="150"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.rebateRatio" label-width="0" label="" :is-require="true" />
              </template>
            </el-table-column>
            <el-table-column
              prop="betLimitRatio"
              label="首充返利比例%"
              width="150"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.betLimitRatio" label-width="0" label="" :is-require="true" />
              </template>
            </el-table-column>

          </el-table>
          <el-col :offset="16" :span="8">
            <el-form-item>
              <el-button type="primary" @click="setData">保存</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Publish, Compare },
  data() {
    return {
      item: {
        rebateUpperLimit: 150,
        betLimit: 100,
        loseRebateRatio: 20,
        loseRebateLimit: 150,
        rechargeItemsCfg: [
          { lowerLimit: 100, upperLimit: 499, showMoney: 100, rebateRatio: 10, betLimitRatio: 20 },
          { lowerLimit: 500, upperLimit: 999, showMoney: 500, rebateRatio: 12, betLimitRatio: 20 },
          { lowerLimit: 1000, upperLimit: 999999, showMoney: 1000, rebateRatio: 15, betLimitRatio: 20 }
        ]
      },
      form: {
      },
      txt: '',
      subKey: 'newbie_gift_cfg',

      AttrNames: {
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
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            $this.item = JSON.parse(response.Data.Data)

            this.item.rebateUpperLimit /= 1000
            this.item.betLimit /= 1000
            this.item.loseRebateLimit /= 1000
            for (const o in $this.item.rechargeItemsCfg) {
              $this.item.Items[o].lowerLimit /= 1000
              $this.item.Items[o].upperLimit /= 1000
              $this.item.Items[o].showMoney /= 1000
            }
            $this.isValid = ($this.item.IsValid === 1)
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    getPostData() {
      const postData = {}
      Object.assign(postData, this.item)
      postData.rebateUpperLimit *= 1000
      postData.betLimit *= 1000
      postData.loseRebateLimit *= 1000
      postData.rechargeItemsCfg = []
      for (const o in this.item.rechargeItemsCfg) {
        const ob = {}
        Object.assign(ob, this.item.rechargeItemsCfg[o])
        ob.lowerLimit *= 1000
        ob.upperLimit *= 1000
        ob.showMoney *= 1000
        postData.rechargeItemsCfg.push(ob)
      }
      return postData
    },
    setData() {
      const postData = this.getPostData()
      console.log(postData)
      this.form.Data = JSON.stringify(postData)
      console.log(this.form.Data)
      console.log(this.form)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        console.log($this.form)
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('sign reward save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
