<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="24">
        <div style="padding-top: 10px">
          <el-table
            :data="tableData"
            stripe
            border
            style="width: 100%"
          >
              <el-table-column
                prop="AiConfigId"
                label="级别"
                width="70"
              />
              <el-table-column
                prop="AiConfigName"
                label="级别"
                width="250"
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
            <el-tab-pane label="机器人挑战">
              <robot-ai-setting-fight v-model="edit"></robot-ai-setting-fight>
            </el-tab-pane>
            <el-tab-pane label="机器人面对挑战">
              <robot-ai-setting-challenge v-model="edit"></robot-ai-setting-challenge>
            </el-tab-pane>
            <el-tab-pane label="放牌配置">
              <robot-ai-setting-drop v-model="edit"></robot-ai-setting-drop>
            </el-tab-pane>
            <el-tab-pane label="出牌配置">
              <robot-ai-setting-out-card v-model="edit"></robot-ai-setting-out-card>
            </el-tab-pane>
            <el-tab-pane label="好牌配置">
              <robot-ai-setting-build-card v-model="edit"></robot-ai-setting-build-card>
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
import robotAiSettingFight from './tongits/robotAiSettingFight'
import robotAiSettingChallenge from './tongits/robotAiSettingChallenge'
import robotAiSettingDrop from './tongits/robotAiSettingDrop'
import robotAiSettingOutCard from './tongits/robotAiSettingOutCard'
import robotAiSettingBuildCard from './tongits/robotAiSettingBuildCard'

export default {
  components: { Compare, Publish,robotAiSettingFight,robotAiSettingChallenge,robotAiSettingDrop,robotAiSettingOutCard,robotAiSettingBuildCard},
  data() {
    return {
      subKey:"tongits_ai",
      load:false,
      form: {
      },
      tableData:[],
      editVisible:false,
      edit:{},
      item:{}
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
          console.log('response==>', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            let cfg = JSON.parse(response.Data.Data)
            console.log('cfg==>', cfg)
            this.item = cfg
            this.tableData = this.item.Config;
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
            this.load = true
          }
        }
      })
    },
    handleUpdate(row){
      this.editVisible = true
      console.log("row==>",row)
      this.edit = row
    },
    setData() {

      this.form.Data = JSON.stringify(this.item)
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
    saveData() {
      this.form.Data = JSON.stringify(this.item)

      request({
        url: 'customizeconfig/update',
        method: 'post',
        data: this.form
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('saveData response', response)
          this.$message.success('保存成功')
        }
      })
    }
    
  }
}
</script>
