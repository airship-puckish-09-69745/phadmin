<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="Volume" :key-id="getFullKey(this.subKey)" :env-empty="false" compare-type="Object"
               :attr-names="AttrNames"/>

    </el-row>


    <el-row :gutter="10" style="margin-top: 30px">

      <el-col :span="15"/>
      <el-col :span="22">
        <el-form inline>
          <el-form-item>
            <el-button type="primary" size="mini" @click="openConfig">添加配置项</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="setData" size="mini">保存</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" size="mini" icon="el-icon-refresh" @click="refresh()">刷新</el-button>
          </el-form-item>
          <el-form-item label="分享链接">
            <el-input size="mini" v-model="shareLink" style="width: 200px;"></el-input>
          </el-form-item>
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

        </el-row>
        <el-row>

          <template>
            <el-table :data="allCfg" border>
              <el-table-column label="开始名次">
                <template scope="scope">
                  <el-input v-model="scope.row.Start" type="number" oninput="value=value.replace(/[^\d.]/g,'')"
                            @input="usernameInput(scope.$index)"/>
                </template>
              </el-table-column>
              <el-table-column label="结束名次">
                <template scope="scope">
                  <el-input v-model.number="scope.row.End" type="number" oninput="value=value.replace(/[^\d.]/g,'')"
                            @input="usernameInput(scope.$index)"/>
                </template>
              </el-table-column>
              <el-table-column label="奖励">
                <template scope="scope">
                  <el-input v-model.number="scope.row.Reward" type="number" oninput="value=value.replace(/[^\d.]/g,'')"
                            @input="usernameInput(scope.$index)"/>
                </template>
              </el-table-column>
              <el-table-column label="最后更新时间">
                <template scope="scope">
                  <span>{{ scope.row.Update * 1000 > 0 ? new Date(scope.row.Update * 1000).Format("yyyy-MM-dd HH:mm:ss") : '' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="最后更新人">
                <template scope="scope">
                  <span>{{ scope.row.Updater }}</span>
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


  </div>
</template>

<script>
import {Message} from 'element-ui'
import Compare from '@/components/Compare/index.vue'
import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput/index.vue'
import {copyObj} from 'codemirror/src/util/misc'
import {getInfo} from "@/api/user";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {Compare, Publish, MoneyInput},
  data() {
    return {
      userName: "",
      form: {},
      Visible: false,
      postData: {},
      subKey: 'PointRaceCommonConfig',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      allCfg: [],
      comonItem: {
        Start: 0,
        End: 0,
        Reward: 0,
        Update: 0,
        Updater: "",
      },
      user: {},
      gameOptions: [],
      dialogGameOptions: [],
      selectGameVisible: false,
      oldData: {},
      shareLink:"",
    }
  },
  created() {
    this.getData()
    getInfo().then((res) => {
      if (res.RetCode == 0) {
        this.userName = res.Data.name
      }
    })
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
    usernameInput(idx) {
      this.allCfg[idx].Updater = this.userName
      this.allCfg[idx].Update = Date.parse(new Date()) / 1000
    },
    addConfig() {
      if (this.comonItem.Start == 0) {
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
      this.comonItem.Update = Date.parse(new Date())/1000
      this.comonItem.Updater = this.userName
      this.allCfg.push(this.comonItem)
      this.Visible = false
    },

    editRow(idx, row) {
      this.idx = idx
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
      this.allCfg.splice(this.idx, 1, cfg)
      Message.success('修改成功！')
      this.selectGameVisible = false
    },

    getFullKey(k) {
      return 'CustomizeCfg_' + k
    },
    openConfig() {
      this.Visible = true
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
            $this.allCfg = cfg.PrizeList
            $this.shareLink=cfg.ShareLink
          }
        }
      })
    },
    refresh() {
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
        this.allCfg[i].Start = parseInt(this.allCfg[i].Start)
        this.allCfg[i].End = parseInt(this.allCfg[i].End)
        this.allCfg[i].Reward = parseInt(this.allCfg[i].Reward)
        const item = {}
        copyObj(this.allCfg[i], item)
        cfg.push(item)
      }
      const data ={
        "PrizeList":cfg,
        "ShareLink":this.shareLink
      }
      return data
    },
    checkData(cfg) {
      for (const i in cfg.PrizeList) {
        if (cfg.PrizeList[i].Start > cfg.PrizeList[i].End) {
          Message.error('开始名次不能大于结束名次')
          return false
        }
        // if (!cfg.PrizeList[i].Start || !cfg.PrizeList[i].End || !cfg[i].PrizeList.Reward) {
        //   Message.error('请查看配置是否有漏')
        //   return false
        // }
      }
      if (cfg.ShareLink==""){
        Message.error('ShareLink不能为空')
        return false
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


  }
}

</script>
