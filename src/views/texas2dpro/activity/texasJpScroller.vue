<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />

    <el-row :gutter="10" style="margin-top: 50px">
      <el-col :span="14" :offset="3">
        <el-form ref="ScrollerConf" :model="ScrollerConf" label-width="150px">

          <fieldset style="margin-top:10px">
            <legend>Jackpot中奖跑马灯配置</legend>

            <el-form-item label="触发牌型：" :required="true" style="margin-top:20px">
              <el-checkbox-group v-model="ScrollerConf.CardTypeList">
                <el-checkbox v-for="item in CardTypeCfg" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="触发场景：" :required="true">
              <el-checkbox-group v-model="ScrollerConf.SceneList">
                <el-checkbox v-for="item in SceneCfg" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>


            <el-form-item label="轮播次数：" style="width: 240px;" :required="true">
              <el-input v-model="ScrollerConf.ScrollerCnt" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="文案配置：" style="width: 720px;" :required="true">
              <el-input v-model="ScrollerConf.Content" type="textarea" placeholder="" />
            </el-form-item>

            <el-form-item label="是否支持跳转：" :required="true">
              <el-select v-model.number="ScrollerConf.CanJump" placeholder="请选择">
                <el-option label="否" :value="0" />
                <el-option label="是" :value="1" />
              </el-select>
            </el-form-item>
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
      editShow: false,
      editHdRow: -1,
      ScrollerConf: {
        CardTypeList: [],
        SceneList: [],
        ScrollerCnt: 0,
        Content: "",
        CanJump: 0,
      },
      CardTypeCfg: [
        { 'value': '8', 'label': '金刚' },
        { 'value': '9', 'label': '同花顺' },
        { 'value': '10', 'label': '皇家同花顺' },
      ],
      SceneCfg: [
        { 'value': '32', 'label': 'NLH房间' },
        { 'value': '2032', 'label': 'MTT房间' },
        { 'value': '0', 'label': '大厅' },
      ],
      form: {
      },
      subKey: 'texasNlhJpScroller'
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
          $this.form = response.Data || {}
          const v = JSON.parse($this.form.Data)
          $this.ScrollerConf = v
          console.log($this.ScrollerConf)
          // 设置修改之前数据
          $this.$refs.compare.SetOldVal($this.ScrollerConf)
        }
      })
    },
    saveData() {
      this.form.Data = JSON.stringify(this.ScrollerConf)
      console.log(this.form)
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
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
