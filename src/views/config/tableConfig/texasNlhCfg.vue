<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="14" :offset="3">
        <el-form ref="cfg" :model="cfg" label-width="150px">

          <fieldset style="margin-top:10px">
            <legend>Jackpot配置</legend>

            <el-row>
              <el-col :span="12">
                <el-form-item label="盲注比例%：">
                  <el-input v-model.number="JackpotConf.BlindRatio" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-button type="primary" size="mini" @click="addJackpotCardTypeConfRow">添加</el-button>
            </el-row>
            <el-row v-for="(value, index) in JackpotConf.JackpotCardTypeConf" :key="index">
              <el-col :span="22">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="牌型" :required="true">
                      <el-input v-model="JackpotConf.JackpotCardTypeConf[index].CardType" size="mini" :required="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="牌型比例%" :required="true">
                      <el-input v-model="JackpotConf.JackpotCardTypeConf[index].Ratio" size="mini" :required="true" />
                    </el-form-item>
                  </el-col>

                </el-row>
              </el-col>
              <el-col :span="2">
                <el-button type="danger" size="mini" @click="removeJackpotCardTypeConfRow(index)">删除</el-button>
              </el-col>
            </el-row>
          </fieldset>

          <el-form-item style="margin-top: 20px;">
            <el-button type="primary" @click="saveData">保存</el-button>
          </el-form-item>

        </el-form>
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

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      cfg: {
      },
      JackpotConf: {
        BlindRatio: 0,
        JackpotCardTypeConf: [
        ]
      },
      form: {},
      subKey: 'gameTexasNlh'
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
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || { Data: '{}' }
          const v = JSON.parse($this.form.Data)
          $this.cfg = v
          $this.JackpotConf = v.JackpotConf
          // 设置修改之前数据
          $this.$refs.compare.SetOldVal($this.form)
        }
      })
    },
    saveData() {
      this.cfg.JackpotConf = this.JackpotConf
      const postData = JSON.parse(JSON.stringify(this.cfg))
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
            Message.success('保存成功')
          }
        })
      })
    },
    addJackpotCardTypeConfRow() {

      this.JackpotConf.JackpotCardTypeConf.push({
        CardType: 1,
        Ratio: 10
      })
      console.log(this.JackpotConf.JackpotCardTypeConf)
    },
    removeJackpotCardTypeConfRow(index) {
      this.JackpotConf.JackpotCardTypeConf.splice(index, 1)
    }
  }
}
</script>
