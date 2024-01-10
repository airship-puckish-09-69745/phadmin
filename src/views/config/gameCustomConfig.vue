<template>
  <div class="app-container">

    <publish primary-key="Volume" :key-id="getFullKey(this.subKey)" :env-empty="false" compare-type="Object"
             :attr-names="AttrNames"/>
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="15">
        <el-form inline>
          <el-form-item label="应用id">
            <el-select v-model="appId">
              <el-option
                v-for="item in appIdOptions"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              />
            </el-select>
            <el-form-item label="渠道">
              <el-select v-model="channel">
                <el-option
                  v-for="item in channelOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="查询">
              <el-button type="primary" size="mini" @click="refresh">查询</el-button>
            </el-form-item>
          </el-form-item>
        </el-form>

      </el-col>
      <el-col :span="15">
      </el-col>
      <el-col :span="22">
        <el-button type="primary" size="mini" @click="addOne">添加游戏返回配置项</el-button>
      </el-col>

      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
      </el-col>
      <el-col :span="24">
        <el-form ref="allCfg" v-model="showData" label-width="150px">
          <el-table
            :data="showData"
            style="width: 95%"
            border
          >

            <el-table-column
              prop="app_id"
              label="应用"
            ></el-table-column>

            <el-table-column
              prop="game_id"
              label="游戏"
            >

            </el-table-column>

            <el-table-column
              prop="channel"
              label="站点渠道"
            >

            </el-table-column>

            <el-table-column
              prop="is_return"
              label="是否需要返回"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.is_return"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                  @change="editIsReturn(scope.$index,scope.row)"
                >
                </el-switch>
                <el-form-item v-model="scope.row.is_return" label-width="0">
                </el-form-item>
              </template>
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
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare"/>

    <el-dialog
      title="选择游戏"
      :visible.sync="selectGameVisible"
      width="650px"
    >
      <el-form label-width="150px">
        <el-form-item label="游戏">
          <el-select v-model="item.game_id" placeholder="请选择" size="mini">
            <el-option
              v-for="item in gameOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>

        </el-form-item>
        <el-form-item label="应用">
          <el-select v-model="item.app_id" placeholder="请选择" size="mini">
            <el-option
              v-for="item in appIdOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道">
          <el-select v-model="item.channel" placeholder="请选择" size="mini">
            <el-option
              v-for="item in channelOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否需要返回">
          <el-select v-model="item.is_return" placeholder="请选择" size="mini">
            <el-option
              v-for="item in isReturnOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
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

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {Compare, Publish, MoneyInput},
  data() {
    return {
      form: {},
      postData: {},
      subKey: 'GameReturnConfig',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      allCfg: [],
      appInfo: [],
      channel: "DEV",
      appId: 100002,

      channelOptions: [
        // {key: "0", label: '请选择'},
        {key: "DEV", label: 'DEV'},
        {key: "BP", label: 'BP'},
        {key: "GP", label: 'GP'},
      ],
      isReturnOptions: [
        {key: 0, label: '否'},
        {key: 1, label: '是'},
      ],
      appIdOptions: [
        // {key: "0", label: '请选择'},
        {key: 100002, label: '100002'},
        {key: 100003, label: '100003'},
        {key: 100004, label: '100004'},
        {key: 100005, label: '100005'},
        {key: 100006, label: '100006'}
      ],
      showData: [],
      games: {
        // 2: 'Andar Bahar',
        // 3: 'Dragon VS Tiger',
        // 5: 'Car Roulette',
        // 9: 'Baccarat',
        // 10: 'Crash',
        15: 'Texas Poker',
        // 20: 'MINES',
        21: 'Pusoy',
        22: 'Tongits-Pot',
        23: 'Lucky9',
        // 25: 'Color Game',
       31: 'Tongits-Classic'
        // 52: 'Sleeping Beauty',
        // 51: 'Phoenix'
      },
      item: {
        app_id: 100002,
        channel: "DEV",
        game_id: 0,
        is_return: 0,
      },
      gameOptions: [
        {key: 0, label: '请选择'},
        {key: 15, label: 'Texas Poker'},
        {key: 21, label: 'Pusoy'},
        {key: 22, label: 'Tongits-Pot'},
        {key: 23, label: 'Lucky9'},
        {key: 31, label: 'Tongits-Classic'}
      ],
      dialogGameOptions: [],
      selectGameVisible: false,
      showBtn: 0,
      oldData: {},
      selectedGid: 0,
      DuplicateData:[]
    }
  },
  created() {
    this.getAppInfo()
    this.getData()
  },
  methods: {
    editIsReturn(idx,row){
      const cfg = {}
      copyObj(row, cfg)
      if (row.is_return==1){
        cfg.is_return=0
      }else {
        cfg.is_return=1
      }
      if (!this.checkDuplicate(row)){
        Message.error('已经有重复的游戏配置了！')
          row.is_return=cfg.is_return
        return
      }
      for (let i = 0; i < this.allCfg.length; i++) {
        // 确定哪一行是一样的
        if (row.game_id == this.allCfg[i].game_id && row.app_id == this.allCfg[i].app_id && row.channel == this.allCfg[i].channel &&cfg.is_return == this.allCfg[i].is_return) {

          this.allCfg.splice(i, 1, row)
          this.selectGameVisible = false
          this.refresh()
          return
        }
      }
      this.updateDuplicate(row,cfg)

    },
    refresh() {
      if (this.channel == 0 && this.appId == 0) {
        this.showData = this.allCfg
        return
      }
      var data = this.allCfg
      if (this.channel != 0) {
        var data2 = data.filter(ele => ele.channel == this.channel)
      }
      if (this.appId != 0) {
        var data3 = data2.filter(ele => ele.app_id == this.appId)
      }
      this.showData = data3
    },

    newItem() {
      return this.item
    },
    addOne() {
      this.selectedGid = 0
      this.showBtn = 0
      this.selectGameVisible = true
    },
    addGameItem() {
      if (this.item.game_id == 0) {
        Message.error('请选择游戏！')
        return false
      }
      if (this.item.app_id == 0) {
        Message.error('请选择应用id！')
        return false
      }
      if (this.item.channel == 0) {
        Message.error('请选择渠道！')
        return false
      }

      if (!this.checkDuplicate( this.item)){
        Message.error('已经有重复的游戏配置了！')
        this.selectGameVisible = false
        return
      }
      const cfg = {}
      copyObj(this.newItem(), cfg)
      this.allCfg.push(cfg)
      this.selectGameVisible = false
      this.updateDuplicate(this.item,this.oldData)
      this.refresh()
    },
    editRow(idx, row) {
      this.oldData = row
      this.showBtn = 1
      this.item.game_id = row.game_id
      this.item.channel = row.channel
      this.item.app_id = row.app_id
      this.item.is_return = row.is_return
      this.selectGameVisible = true
    },
    saveEdit() {
      if (this.item.game_id == 0) {
        Message.error('请选择游戏！')
        return false
      }
      if (this.item.app_id == 0) {
        Message.error('请选择应用id！')
        return false
      }
      if (this.item.channel == 0) {
        Message.error('请选择渠道！')
        return false
      }
      if (!this.checkDuplicate( this.item)){
        Message.error('已经有重复的游戏配置了！')
        this.selectGameVisible = false
        return
      }

      for (let i = 0; i < this.allCfg.length; i++) {
        // 确定哪一行是一样的
        if (this.oldData.game_id == this.allCfg[i].game_id && this.oldData.app_id == this.allCfg[i].app_id && this.oldData.channel == this.allCfg[i].channel && this.oldData.is_return == this.allCfg[i].is_return) {
          const cfg = {}
          copyObj(this.newItem(), cfg)
          this.allCfg.splice(i, 1, cfg)
          this.selectGameVisible = false
          this.refresh()
          this.updateDuplicate(this.item,this.oldData)
          return
        }
      }
      Message.error('修改失败！')
      this.selectGameVisible = false
    },
    showGameName(gid) {
      return this.games[gid] || gid
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
            for (let i = 0; i < $this.allCfg.length; i++) {
              $this.DuplicateData.push( $this.allCfg[i].channel+ $this.allCfg[i].game_id+ $this.allCfg[i].app_id+ $this.allCfg[i].is_return)
            }
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
        if (!cfg[i].game_id || !cfg[i].app_id || !cfg[i].channel) {
          Message.error('请查看配置是否有漏')
          return false
        }
      }
      return true
    },
    checkDuplicate(data){
      if (this.DuplicateData.includes(data.channel+""+data.game_id+""+data.app_id+""+data.is_return)){
        return false
      }
      return true
    },
    updateDuplicate(newData,oldData){
    var newKey=  newData.channel+""+newData.game_id+""+newData.app_id+""+newData.is_return
    var oldKey=  oldData.channel+""+oldData.game_id+""+oldData.app_id+""+oldData.is_return
      for (let i = 0; i < this.DuplicateData.length; i++) {
        if (this.DuplicateData[i]==oldKey){
          this.DuplicateData.splice(i,1,newKey)
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
    }
  }
}
</script>
