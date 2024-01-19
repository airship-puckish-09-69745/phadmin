<template>
  <div class="app-container">
<el-row>
  <publish primary-key="Volume" :key-id="getFullKey(this.subKey)" :env-empty="false" compare-type="Object"
           :attr-names="AttrNames" />

</el-row>


    <el-row :gutter="10" style="margin-top: 30px">

      <el-col :span="15"/>
      <el-col :span="22">
        <el-button type="primary" size="mini" @click="openConfig">添加配置项</el-button>
        <el-button type="primary" @click="setData"  size="mini">保存</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="refresh()">刷新</el-button>
      </el-col>

    </el-row>
    <el-row>

      <fieldset style="margin-top:10px">
        <legend>公共配置</legend>
        <!--          <el-alert-->
        <!--            type="success"-->
        <!--            description="根据分布概率随机取出其中一张牌"-->
        <!--          />-->
        <el-row style="margin-top:10px">
        </el-row>
        <el-row>
          <template>
            <el-table :data="allCfg" border>
              <el-table-column label="开始名次">
                <template scope="scope">
                  <el-input v-model="scope.row.Start"/>
                </template>
              </el-table-column>
              <el-table-column label="结束名次">
                <template scope="scope">
                  <el-input v-model.number="scope.row.End"/>
                </template>
              </el-table-column>
              <el-table-column label="奖励">
                <template scope="scope">
                  <el-input v-model.number="scope.row.Reward"/>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template scope="scope">
                  <el-button size="mini" type="danger" @click="removeConfigRow(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-row>
      </fieldset>
    </el-row>
    <el-dialog
      title="选择游戏"
      :visible.sync="Visible"
      width="650px"
    >
      <el-form label-width="150px">
        <el-form-item label="开始名次">
          <el-input v-model="comonItem.Start" placeholder="请输入" size="mini" STYLE="width: 220px"></el-input>
        </el-form-item>

        <el-form-item label="结束名次">
          <el-input v-model="comonItem.End" placeholder="请输入" size="mini" STYLE="width: 220px"></el-input>
        </el-form-item>

        <el-form-item label="奖励">
          <el-input v-model="comonItem.Reward" placeholder="请输入" size="mini" STYLE="width: 220px"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addConfig">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--对比组件-->
    <compare ref="compare"/>

    <el-dialog
      title="选择游戏"
      :visible.sync="selectGameVisible"
      width="650px"
    >
      <el-form label-width="150px">
        <el-form-item label="活动ID">
          <el-input v-model="item.ActId" placeholder="请输入" size="mini" STYLE="width: 220px"></el-input>

        </el-form-item>
        <el-form-item label="游戏类型">
          <el-select v-model="item.Type" placeholder="请选择" size="mini">
            <el-option
              v-for="item in gameOptions"
              :key="item.key"
              :label="item.label+'-'+item.key"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="item.StartTime" type="datetime" placeholder="选择开始时间" size="mini">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间">
          <el-date-picker v-model="item.EndTime" type="datetime" placeholder="选择结束时间" size="mini">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="需要的虚拟币">
          <el-input v-model="item.NeedVirtualCoin" placeholder="请输入" size="mini" STYLE="width: 220px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="showBtn==0" type="primary" @click="addGameItem">确定</el-button>
          <el-button v-if="showBtn==1" type="primary" @click="saveEdit">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import {Message} from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput'
import {copyObj} from 'codemirror/src/util/misc'
import {getInfo} from "@/api/user";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {Compare, Publish, MoneyInput, getInfo},
  data() {
    return {
      form: {},
      Visible: false,
      postData: {},
      subKey: 'PointRaceCommonConfig',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      appInfo: [],
      channel: "Dev",
      appId: 1000002,

      isReturnOptions: [
        {key: 0, label: '否'},
        {key: 1, label: '是'},
      ],
      allCfg: [],
      comonItem: {
        Start: 0,
        End: 0,
        Reward: 0,
      },
      item: {
        ActId: 0,
        Type: 0,
        StartTime: Date.parse(new Date()),
        EndTime: Date.parse(new Date()),
        NeedVirtualCoin: 0,
        Update: 0,
        Updater: "",
      },
      user: {},
      gameOptions: [],
      dialogGameOptions: [],
      selectGameVisible: false,
      oldData: {},
      selectedGid: 0,
      DuplicateData: [],
      maxId: 0,
      idx:0,
      showBtn:false,
    }
  },
  created() {
    this.getAppInfo()
    this.getData()
    this.getList()
    this.getData()
  },
  methods: {
    newItem() {
      return this.item
    },
    addOne() {
      this.selectedGid = 0
      this.showBtn = 0
      this.selectGameVisible = true
    },

    addConfig() {
      if (this.comonItem.Start== 0) {
        Message.error('请输入开始名次！')
        return false
      }
      if (this.comonItem.End == 0) {
        Message.error('请输入结束名词！')
        return false
      }
      if (this.comonItem.Reward == 0) {
        Message.error('请输入奖励！')
        return false
      }
      this.allCfg.push(this.comonItem)
      this.Visible = false
    },
    addGameItem() {
      if (this.item.ActId == 0) {
        Message.error('请输入活动ID！')
        return false
      }
      if (this.item.Type == 0) {
        Message.error('请输游戏ID！')
        return false
      }
      if (this.item.NeedVirtualCoin == 0) {
        Message.error('请输需要的虚拟币！')
        return false
      }

      this.item.Update = Date.parse(new Date()) / 1000
      const cfg = {}
      copyObj(this.newItem(), cfg)
      this.allCfg.push(cfg)

      this.selectGameVisible = false

    },
    editRow(idx, row) {
      this.idx=idx
      this.oldData = row
      this.showBtn = 1
      this.item.ActId = row.ActId
      this.item.Type = row.Type
      this.item.StartTime = row.StartTime
      this.item.EndTime = row.EndTime
      this.item.NeedVirtualCoin = row.NeedVirtualCoin
      this.item.EndTime = Date.parse(new Date()) / 1000
      this.selectGameVisible = true
    },
    saveEdit() {
      if (this.item.ActId == 0) {
        Message.error('请输入活动ID！')
        return false
      }
      if (this.item.Type == 0) {
        Message.error('请输游戏ID！')
        return false
      }
      if (this.item.NeedVirtualCoin == 0) {
        Message.error('请输需要的虚拟币！')
        return false
      }
      const cfg = {}
      copyObj(this.newItem(), cfg)
      this.allCfg.splice(this.idx,1,cfg)
      Message.success('修改成功！')
      this.selectGameVisible = false
    },

    getFullKey(k) {
      return 'CustomizeCfg_' + k
    },
    openConfig(){
      this.Visible=true
    },
    removeConfigRow(idx) {
      this.allCfg.splice(idx, 1)
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
          }
        }
      })
    },
    refresh(){
      this.getData()
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
      this.$refs.compare.SetNewVal(this.postData)
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
      for (const i in this.allCfg) {
        const item = {}
        copyObj(this.allCfg[i], item)
        cfg.push(item)
      }
      return cfg
    },
    checkData(cfg) {
      for (const i in cfg) {
        if (!cfg[i].Start || !cfg[i].End || !cfg[i].Reward) {
          Message.error('请查看配置是否有漏')
          return false
        }
      }
      return true
    },
    checkDuplicate(data) {
      if (this.DuplicateData.includes(data.channel + "" + data.game_id + "" + data.app_id)) {
        return false
      }
      return true
    },
    updateDuplicate(newData, oldData) {
      var newKey = newData.channel + "" + newData.game_id + "" + newData.app_id
      var oldKey = oldData.channel + "" + oldData.game_id + "" + oldData.app_id
      for (let i = 0; i < this.DuplicateData.length; i++) {
        if (this.DuplicateData[i] == oldKey) {
          this.DuplicateData.splice(i, 1, newKey)
          return
        }
      }
      this.DuplicateData.push(newKey)
    },
    getAppInfo() {
      request({
        url: '/thirdparties/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          // const objs = response.Data || []
          for (let i = 0; i < response.Data.length; i++) {
            this.appInfo.push({
              key: response.Data[i].ID,
              label: response.Data[i].Account
            })
          }
        }
      })
    },
    getList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            this.gameOptions.push({
              key: response.Data[i].Gid,
              label: response.Data[i].Name
            })
          }
        }
      })
    },
  }
}

</script>
