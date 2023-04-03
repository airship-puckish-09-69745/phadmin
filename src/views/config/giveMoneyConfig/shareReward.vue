<template>
  <div class="app-container">
    <publish primary-key="Volume" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="8" :offset="3">
        <el-form ref="form" :model="form" label-width="200px">
          <el-row>
            <el-form-item label="邀请账号初始金币：">
              <el-input v-model.number="item.register" :required="true" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="成功后邀请人获得：">
              <el-input v-model.number="item.bind_master" :required="true" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="成功后被邀请人获得：">
              <el-input v-model.number="item.bind_apprentice" :required="true" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="首充邀请人(师父)获得：">
              <el-input v-model.number="item.first_recharge_master" :required="true" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="首充被邀请人(徒弟)获得：">
              <el-input v-model.number="item.first_recharge_apprentice" :required="true" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="充值邀请人(师父)获得百分比：">
              <el-input v-model.number="item.recharge_master_ratio" :required="true" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="师父从单个徒弟获得返利上限：">
              <el-input v-model.number="item.recharge_master_limit" :required="true" />
            </el-form-item>
          </el-row>
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
  components: { Compare, Publish },
  data() {
    return {
      item: {
        'register': 100,
        'bind_master': 100,
        'bind_apprentice': 100,
        'first_recharge_master': 10,
        'first_recharge_apprentice': 10,
        'recharge_master_ratio': 5,
        'recharge_master_limit': 2500
      },
      form: {
      },
      txt: '',
      subKey: 'invite_cfg',
      AttrNames: {
        'Data.register': '邀请账号初始金币',
        'Data.bind_master': '成功后邀请人获得',
        'Data.bind_apprentice': '成功后被邀请人获得',
        'Data.first_recharge_master': '首充邀请人(师父)获得',
        'Data.first_recharge_apprentice': '首充被邀请人(徒弟)获得：',
        'Data.recharge_master_ratio': '充值邀请人(师父)获得百分比',
        'Data.recharge_master_limit': '师父从单个徒弟获得返利上限',
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
    toRupee(tmp, key) {
      if (tmp.hasOwnProperty(key)) {
        return parseInt(tmp[key] / 1000)
      }

      return 0
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
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const tmp = JSON.parse(response.Data.Data)
            this.item = {
              'register': this.toRupee(tmp, 'register'),
              'bind_master': this.toRupee(tmp, 'bind_master'),
              'bind_apprentice': this.toRupee(tmp, 'bind_apprentice'),
              'first_recharge_master': this.toRupee(tmp, 'first_recharge_master'),
              'first_recharge_apprentice': this.toRupee(tmp, 'first_recharge_apprentice'),
              'recharge_master_ratio': tmp.hasOwnProperty('recharge_master_ratio') ? parseInt(tmp['recharge_master_ratio']) : 0,
              'recharge_master_limit': this.toRupee(tmp, 'recharge_master_limit')
            }
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    getItemData() {
      const cfg = {
        'register': parseInt(this.item.register) * 1000,
        'bind_master': parseInt(this.item.bind_master) * 1000,
        'bind_apprentice': parseInt(this.item.bind_apprentice) * 1000,
        'first_recharge_master': parseInt(this.item.first_recharge_master) * 1000,
        'first_recharge_apprentice': parseInt(this.item.first_recharge_apprentice) * 1000,
        'recharge_master_ratio': parseInt(this.item.recharge_master_ratio),
        'recharge_master_limit': parseInt(this.item.recharge_master_limit) * 1000
      }

      return JSON.stringify(cfg)
    },
    setData() {
      this.form.Data = this.getItemData()
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
