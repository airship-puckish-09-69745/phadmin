<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" />
    </el-row>
    <el-row style="padding-top: 5px">
      <h3 style="text-align:center;">机器人AI配置</h3>
      <el-col :span="24">
        <div style="padding-top: 10px">
          <el-table
            :data="tableData"
            stripe
            border
            style="width: 100%"
          >
            <el-table-column
              prop="AiConfigLevel"
              label="级别"
              width="70"
            />
            <el-table-column
              prop="AiConfigName"
              label="级别"
              width="250"
              :formatter="(row) => getRobotName(row.AiConfigLevel)"
              />
            <el-table-column
              label="操作"
              column-key="op"
              width="250"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-document-copy"
                  @click="handleUpdate(scope.row)"
                >修改
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="机器人配置"
      :visible.sync="editVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="edit" width="70%" label-position="top">
        <el-row>
          <el-tabs type="border-card">
            <el-tab-pane label="1号位">
              <robot-ai-setting-one v-model="edit" />
            </el-tab-pane>
            <el-tab-pane label="2号位">
              <robot-ai-setting-two v-model="edit" />
            </el-tab-pane>
            <el-tab-pane label="3号位">
              <robot-ai-setting-three v-model="edit" />
            </el-tab-pane>
            <el-tab-pane label="4号位">
              <robot-ai-setting-four v-model="edit" />
            </el-tab-pane>
          </el-tabs>
        </el-row>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="setData">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import { $libDate, $libShow, DataRule, MoneyShow } from '@/utils/common'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import MoneyInput from '@/components/MoneyInput'

import robotAiSettingOne from './truco/robotAiSettingOne'
import robotAiSettingTwo from './truco/robotAiSettingTwo'
import robotAiSettingThree from './truco/robotAiSettingThree'
import robotAiSettingFour from './truco/robotAiSettingFour'

export default {
  components: { Compare, Publish, MoneyInput,robotAiSettingOne,robotAiSettingTwo,robotAiSettingThree,robotAiSettingFour},
  data() {
    return {
      subKey: 'truco_ai_config',
      load: false,
      form: {
      },
      tableData: [],
      editVisible: false,
      edit: {},
      item: {},
      robotlvl: [
        {
          value: 1,
          label: '机器人A(强放)'
        },
        {
          value: 2,
          label: '机器人B(弱放)'
        },
        {
          value: 3,
          label: '机器人C(陪玩)'
        },
        {
          value: 4,
          label: '机器人D(弱杀)'
        },
        {
          value: 5,
          label: '机器人E(强杀)'
        }
      ],

      editRobotSync: false
    }
  },
  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    getRobotName(aiLevel) {
      for (let i = 0; i < this.robotlvl.length; i++) {
        if (this.robotlvl[i].value == aiLevel) {
          return this.robotlvl[i].label
        }
      }
      return "未知机器人"
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
          console.log('response==>', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const cfg = JSON.parse(response.Data.Data)
            console.log('cfg==>', cfg)
            this.item = cfg
            this.tableData = this.item.Config
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
            this.moneyProc(false)
            this.load = true
          }
        }
      })
    },


    setData() {
      this.moneyProc(true)
      this.form.Data = JSON.stringify(this.item)
      console.log('this.form.Data:', this.form.Data)
      this.moneyProc(false)
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
            console.log('update response', response)
            Message.success('保存成功')
          }
        })
      })
    },
    handleUpdate(row) {
      this.editVisible = true
      console.log('row==>', row)
      this.edit = row
    },
  }
}
</script>
