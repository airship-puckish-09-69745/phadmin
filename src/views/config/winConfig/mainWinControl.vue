<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="'CustomizeCfg_' + subKey" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />

    <el-form ref="item3" :model="item" label-width="80px">
      <el-row style="margin-top: 30px">
        <el-col :span="5" :offset="3">
          <fieldset>
            <legend>TeenPatti</legend>
            <el-form-item label="系统【赢】时启用" label-width="150px">
              <el-switch v-model="item.TeenPattiWinFlag"></el-switch>
            </el-form-item>
            <el-form-item label="系统【输】时启用" label-width="150px">
              <el-switch v-model="item.TeenPattiLoseFlag"></el-switch>
            </el-form-item>
            <el-form-item label="抽水计算比例" label-width="120px">
              <el-input v-model.number="item.TeenPattiSchemaRate" placeholder="" style="width:80px;" />‰
            </el-form-item>
          </fieldset>
        </el-col>
        <el-col :span="5" :offset="1">
          <fieldset>
            <legend>Rummy</legend>
            <el-form-item label="系统【赢】时启用" label-width="150px">
              <el-switch v-model="item.RummyWinFlag"></el-switch>
            </el-form-item>
            <el-form-item label="系统【输】时启用" label-width="150px">
              <el-switch v-model="item.RummyLoseFlag"></el-switch>
            </el-form-item>
            <el-form-item label="抽水计算比例" label-width="120px">
              <el-input v-model.number="item.RummySchemaRate" placeholder="" style="width:80px;" />‰
            </el-form-item>
          </fieldset>
        </el-col>
        <el-col :span="5" :offset="1">
          <fieldset>
            <legend>AK47</legend>
            <el-form-item label="系统【赢】时启用" label-width="150px">
              <el-switch v-model="item.AKWinFlag"></el-switch>
            </el-form-item>
            <el-form-item label="系统【输】时启用" label-width="150px">
              <el-switch v-model="item.AKLoseFlag"></el-switch>
            </el-form-item>
            <el-form-item label="抽水计算比例" label-width="120px">
              <el-input v-model.number="item.AKSchemaRate" placeholder="" style="width:80px;" />‰
            </el-form-item>
          </fieldset>
        </el-col>
      </el-row>
      <el-row style="margin-top: 30px">
        <el-col :span="5" :offset="3">
          <fieldset>
            <legend>其它小游戏</legend>
            <el-form-item label="抽水计算比例" label-width="120px">
              <el-input v-model.number="item.OtherSchemaRate" placeholder="" style="width:80px;" />‰
            </el-form-item>
          </fieldset>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="16" :offset="3">
        <div style="padding: 10px">
          <span style="color: blue;font-weight: bold">A：</span>总控的目标为玩家有效下注的总和*5% <br>
          <span style="color: blue;font-weight: bold">B：</span>玩家输 + 系统税 - 玩家赢
        </div>
        <el-col :span="12">
          <div style="padding: 10px;">当B>A,(B-A)/A作为参数，大于配置，则升N级:</div>
          <el-form ref="item1" :model="item" label-width="80px">
            <el-form-item
              v-for="(o,idx) in item.Win"
              :key="'win'+idx"
              :prop="'Win[' + idx + ']'"
              :label="'升' + (idx+1) +'级：'"
              :rules="dataRule(true,{type:'n',range:'0'})"
            >
                <el-input style="width: 150px" v-model.number="item.Win[idx]" placeholder="placeholder" ><template slot="append">%</template></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <div style="padding: 10px;">当B<=A，(A-B)/A作为参数，大于配置，则降N级:</div>
          <el-form ref="item2" :model="item" label-width="80px" >
            <el-form-item v-for="(o,idx) in item.Lose" :key="'lose'+idx" :prop="'Lose[' + idx + ']'" :label="'降' + (idx+1) +'级：'" :rules="dataRule(true,{type:'n',range:'0'})">
                <el-input style="width: 150px" v-model.number="item.Lose[idx]" placeholder="placeholder" ><template slot="append">%</template></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="setData">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
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
import { DataRule, ValidateVueItem } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      item: {
        Win: [], Lose: [],
        TeenPattiWinFlag: true, TeenPattiLoseFlag: true, TeenPattiSchemaRate: 50,
        RummyWinFlag: true, RummyLoseFlag: true, RummySchemaRate: 50,
        AKWinFlag: true, AKLoseWinFlag: true, AKSchemaRate: 50,
        OtherSchemaRate: 50
      }, // 总控配置
      form: {},
      subKey: 'MainWinControl',

      AttrNames: {
        'Data.Win': '总体赢',
        'Data.Lose': '总体输',
        'Data.TeenPattiWinFlag': '赢时TeenPatti开关',
        'Data.TeenPattiLoseFlag': '输时TeenPatti开关',
        'Data.TeenPattiSchemaRate': 'TeenPatti调控比例',
        'Data.RummyWinFlag': '赢时Rummy开关',
        'Data.RummyLoseFlag': '输时Rummy开关',
        'Data.RummySchemaRate': 'Rummy调控比例',
        'Data.AKWinFlag': '赢时AK开关',
        'Data.AKLoseWinFlag': '输时AK开关',
        'Data.AKSchemaRate': 'AK调控比例',
        'Data.OtherSchemaRate': '小游戏调控比例',
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }

      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
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
          this.form = response.Data || { Data: '[]' }
          if (response.Data && response.Data.Data !== '') {
            this.item = JSON.parse(response.Data.Data)

            // 设置修改之前数据
            this.$refs.compare.SetOldVal(this.form)
          }
        }
      })
    },
    setData() {
      if (!ValidateVueItem(this.$refs['item1'])) return false
      if (!ValidateVueItem(this.$refs['item2'])) return false
      if (!ValidateVueItem(this.$refs['item3'])) return false
      this.form.Data = JSON.stringify(this.item)
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
            console.log('总控配置', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
