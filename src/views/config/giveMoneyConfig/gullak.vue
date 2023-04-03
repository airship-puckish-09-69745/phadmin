<template>
  <div class="app-container">
    <publish primary-key="Volume" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-row style="margin-top: 30px">
      <el-col :span="12" :offset="4">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-form-item label="功能开关：" label-width="150px">
              <el-switch
                v-model="isValid"
                active-text="开"
                inactive-text="关"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="每日支付上限：" label-width="150px">
              <el-col :span="2">
                <el-input v-model.number="item.BuyLimit" size="mini" />
              </el-col>次
            </el-form-item>
          </el-row>
          <fieldset>
            <legend>等级配置</legend>
            <el-row v-for="(o,idx) in item.Items" :key="idx">
              <el-col :span="2">
                <el-form-item label="等级：">
                  {{ idx+1 }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="容量：">
                  <el-input v-model.number="o.Volume" :required="true" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="Price：">
                  <el-input v-model.number="o.Price" :required="true" />
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>
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
      isValid: true,
      item: {
        IsValid: 1,
        BuyLimit: 2,
        Items: [{ Volume: 1, GoodID: 1, PreStore: 1, Rate: 1 }, { Volume: 1, GoodID: 1, PreStore: 1, Rate: 1 }]
      },
      form: {
      },
      txt: '',
      subKey: 'gullak',

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
            for (const o in $this.item.Items) {
              $this.item.Items[o].Price /= 1000
              $this.item.Items[o].Volume /= 1000
            }
            $this.isValid = ($this.item.IsValid === 1)
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    getPostData(){
      this.item.IsValid = (this.isValid ? 1 : 0)
      const postData = {}
      Object.assign(postData, this.item)
      postData.Items = []
      for (const o in this.item.Items) {
        const ob = {}
        Object.assign(ob, this.item.Items[o])
        ob.Price *= 1000
        ob.Volume *= 1000
        postData.Items.push(ob)
      }
      return postData
    },
    setData() {
      const postData = this.getPostData()
      this.form.Data = JSON.stringify(postData)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form)
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
            console.log('sign reward save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
