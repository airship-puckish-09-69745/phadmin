<template>
  <div class="app-container">

    <publish primary-key="Volume" :key-id="getFullKey(this.subKey)" :env-empty="false" compare-type="Object"
             :attr-names="AttrNames"/>
    <el-row :gutter="10" style="margin-top: 30px">

      <el-col :span="15"/>
      <el-col :span="22">
        <el-button type="primary" size="mini" @click="addOne">添加游戏返回配置项</el-button>
        <el-button type="primary" size="mini" @click="setData">保存</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="refresh()">刷新</el-button>
      </el-col>

      <el-col :span="24">
        <el-form ref="allCfg" v-model="allCfg" label-width="150px">
          <el-table
            :data="allCfg"
            style="width: 95%"
            border
          >

            <el-table-column
              prop="ActId"
              label="活动ID"
            ></el-table-column>

            <el-table-column
              prop="Type"
              label="游戏类型"
            >

            </el-table-column>

            <el-table-column
              prop="StartTime"
              label="开始时间"
            >
              <template scope="scope">
                {{ new Date(scope.row.StartTime).Format("yyyy-MM-dd HH:mm:ss") }}
              </template>
            </el-table-column>

            <el-table-column
              prop="EndTime"
              label="结束时间"
            >
              <template scope="scope">
                {{ new Date(scope.row.EndTime).Format("yyyy-MM-dd HH:mm:ss") }}
              </template>
            </el-table-column>
            <el-table-column
              prop="NeedVirtualCoin"
              label="需求虚拟币"
            >
            </el-table-column>
            <el-table-column
              prop="Update"
              label="最后更新时间"
            >
            </el-table-column>
            <el-table-column
              prop="Updater"
              label="最后更新人"
            >
            </el-table-column>


            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="success" size="mini" @click="editRow(scope.$index, scope.row)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <br>
          <br>

        </el-form>
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
          <el-button type="primary" size="mini" @click="openCommonConfig">添加</el-button>
          <el-button type="primary" @click="setCommonData"  size="mini">保存</el-button>
        </el-row>
        <el-row>
          <template>
            <el-table :data="pointRaceRuleList" border>
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
                  <el-button size="mini" type="danger" @click="removeCommonConfigRow(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-row>
      </fieldset>
    </el-row>
    <el-dialog
      title="选择游戏"
      :visible.sync="commonVisible"
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
          <el-button type="primary" @click="addCommonConfig">确定</el-button>
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
      commonVisible: false,
      postData: {},
      postCommonData: {},
      subKey: 'MillionPointRaceConfig',
      PointRaceCommonKey: 'PointRaceCommonConfig',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      allCfg: [],
      appInfo: [],
      channel: "Dev",
      appId: 1000002,

      isReturnOptions: [
        {key: 0, label: '否'},
        {key: 1, label: '是'},
      ],
      pointRaceRuleList: [],
      comonItem: {
        Start: 0,
        End: 0,
        Reward: 0,
      },
      item: {
        ActId: "",
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
      showBtn: 0,
      oldData: {},
      selectedGid: 0,
      DuplicateData: [],
      maxId: 0,
      idx:0,
      showCommonBtn:false,
    }
  },
  created() {
    this.getAppInfo()
    this.getData()
    this.getList()
    this.getCommonData()
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
    check() {
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
      // if (this.item.EndTime>this.item.StartTime) {
      //   Message.error('结束时间不能大于开始时间！')
      //   return false
      // }
    },
    addCommonConfig() {
      this.pointRaceRuleList.push(this.comonItem)
      this.commonVisible = false
    },
    addGameItem() {
      if (!this.check) {
        return
      }

      this.item.Update = Date.parse(new Date()) / 1000
      const cfg = {}
      copyObj(this.newItem(), cfg)
      this.allCfg.push(cfg)

      this.selectGameVisible = false

    },
    editRow(idx, row) {
      this.idx=idx
      console.log(row)
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
      if (!this.check) {
        return
      }
      console.log("this.idx",this.idx)
      const cfg = {}
      copyObj(this.newItem(), cfg)
      this.allCfg.splice(this.idx,1,cfg)
      Message.success('修改成功！')
      this.selectGameVisible = false
    },

    getFullKey(k) {
      return 'CustomizeCfg_' + k
    },
    openCommonConfig(){
      this.commonVisible=true
    },
    removeCommonConfigRow(idx) {
      console.log("======", idx)
      this.pointRaceRuleList.splice(idx, 1)
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
            console.log("====1==",cfg)
            $this.allCfg = cfg
          }
        }
      })
    },
    refresh(){
      this.getCommonData()
      this.getData()
    },
    getCommonData() {
      const $this = this
      // 加载基础数值配置
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.PointRaceCommonKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || {}
          $this.postCommonData = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const cfg = JSON.parse(response.Data.Data)
            console.log("===", cfg)
            // $this.allCfg = cfg
            $this.pointRaceRuleList = cfg
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
        if (!cfg[i].ActId || !cfg[i].Type || !cfg[i].NeedVirtualCoin) {
          console.log(cfg[i])
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
    setCommonData() {
      const cfg = this.getCommonCfg()
      console.log('saveData ===> ', cfg)
      if (!this.checkCommonData(cfg)) {
        return false
      }

      // this.form.Data = JSON.stringify(cfg)
      this.postCommonData.Data = JSON.stringify(cfg)
      const $this = this
      // 设置修改后数据
      // this.$refs.compare.SetNewVal(this.form)
      this.$refs.compare.SetNewVal(this.postCommonData)
      this.$refs.compare.Compare(function (isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        request({
          url: 'customizeconfig/update',
          method: 'post',
          // data: $this.form
          data: $this.postCommonData
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功')
          }
        })
      })
    },
    getCommonCfg() {
      const cfg = []
      for (const i in this.pointRaceRuleList) {
        const item = {}
        copyObj(this.pointRaceRuleList[i], item)
        cfg.push(item)
      }
      return cfg
    },
    checkCommonData(cfg) {
      for (const i in cfg) {
        if (!cfg[i].Start || !cfg[i].End || !cfg[i].Reward) {
          console.log(cfg[i])
          Message.error('请查看配置是否有漏')
          return false
        }
      }
      return true
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
