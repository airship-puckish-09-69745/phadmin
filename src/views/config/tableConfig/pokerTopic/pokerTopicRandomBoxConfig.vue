<template>
  <div class="app-container">

    <publish
        primary-key="Volume"
        :key-id="getFullKey(this.subKey)"
        :env-empty="false"
        compare-type="Object"
        :attr-names="AttrNames"
    />
    <el-row :gutter="10" style="margin-top: 30px">

      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
      </el-col>
      <el-row>
        <el-col :span="8">
          <el-form>
            <el-form-item label="活动时间"  label-width="20%" required>
                <el-input v-model="showData.BoxActiveTime" ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-form>
            <el-form-item label="差异比例(%)" label-width="20%" required>
              <el-input v-model="showData.DisparityRatio"  ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form>
            <el-form-item label="开始时间"  label-width="20%" required>
              <el-input v-model="showData.StartTime"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-form>
            <el-form-item label="结束时间" label-width="20%" required>
              <el-input v-model="showData.EndTime"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form>
            <el-form-item label="发布间隔(S)"  label-width="20%" required>
              <el-input v-model="showData.IssueInterval"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-form>
            <el-form-item label="更新时间" label-width="20%" required>
              {{showData.UpdateTime}}
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-col :span="22">
        <el-button type="primary" size="mini" @click="addOne">添加</el-button>
      </el-col>
      <el-col :span="24">
        <el-form ref="allCfg" v-model="showData.Boxes" label-width="150px">
          <el-table
              :data="showData.Boxes"
              style="width: 95%"
              border
          >
            <el-table-column
                prop="IssueAmount"
                label="奖券"
            >
              <template slot-scope="scope">
                  {{scope.row.IssueAmount}}
              </template>
            </el-table-column>

            <el-table-column
                prop="IssuePlayers"
                label="奖券2"
            >
              <template slot-scope="scope">
                {{scope.row.IssuePlayers}}
              </template>
            </el-table-column>

            <el-table-column label="操作" width="120px">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <!--            <el-table-column label="操作">-->
            <!--              <template slot-scope="scope">-->
            <!--                <el-button type="success" size="mini" @click="editRow(scope.$index, scope.row)">修改</el-button>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
          </el-table>
          <br>
          <br>
          <br>
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare"/>

  </div>
</template>

<script>
const filterMap = {}

import {Message} from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput'
import {copyObj} from 'codemirror/src/util/misc'
import {ClientTableData} from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {Compare, Publish, MoneyInput},
  data() {
    return {
      form: {},
      postData: {},
      subKey: 'poker_topic_random_box_setting',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      showData:{},
      allCfg: [],
      appInfo: [],
      item: {
        Gid: 0,
        Type: 0,
        Score: 0,
        Description: '',
      },
      selectGid: 0,

      gameOptions: {},
    }
  },
  created() {
    this.getGameList()
    this.getData()
  },
  methods: {

    refresh() {

      this.showData = this.allCfg
      return

    },


    newItem() {
      return this.item
    },
    addOne() {
      this.showData.push(this.newItem())
    },
    deleteRow(idx,row){
      this.showData.splice(idx,1)
    },

    getFullKey(k) {
      return 'CustomizeCfg_' + k
    },
    getData() {
      const $this = this
      // 加载基础数值配置
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || {}
          $this.postData = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const cfg = JSON.parse(response.Data.Data)
            $this.allCfg = cfg
            console.log("=======",cfg)
            this.$refs.compare.SetOldVal(response.Data.Data)
            this.refresh()
          }
        }
      })
    },
    setData() {
      const cfg = this.getCfg()
      console.log('saveData ===> ', cfg)
      if (!this.checkData(cfg)) {
        return false
      }

      // this.form.Data = JSON.stringify(cfg)
      this.postData.Data = JSON.stringify(cfg)
      const $this = this
      // 设置修改后数据
      // this.$refs.compare.SetNewVal(this.form)
      this.$refs.compare.SetNewVal(this.postData.Data)
      this.$refs.compare.Compare(function (isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        request({
          url: 'customizeconfig/update',
          method: 'post',
          // data: $this.form
          data: $this.postData
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功')
          }
        })
      })
    },
    getCfg() {
      const cfg = []
      for (const i in this.clientDB.TotalData) {
        const item = {}
        copyObj(this.clientDB.TotalData[i], item)
        cfg.push(item)
      }
      return cfg
    },
    checkData(cfg) {

      return true
    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            this.gameOptions[response.Data[i].Gid] = response.Data[i].Name
          }
        }
      })
    }
  }
}
</script>
