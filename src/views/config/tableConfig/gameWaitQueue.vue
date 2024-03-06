<template>
  <div class="app-container">
    <publish primary-key="Volume" :key-id="getFullKey(this.subKey)" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-row :gutter="10" style="margin-top: 30px">

      <div style="color: red;font-weight: bolder;">
        不支持桌子人数大于 9 的游戏!!!
      </div>
      <br>

      <el-col :span="22">
        <el-button type="primary" size="mini" @click="addOne">添加游戏配置项</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
      </el-col>
      <el-col :span="24">
        <el-form ref="allCfg" v-model="allCfg.All" label-width="150px">
          <div v-for="item in allCfg.All">
            <fieldset>
              <legend>{{ showGameName(item.GameId) }}</legend>
              <el-row v-if="item.GameId===22">
                <div style="margin-bottom:20px;">
                  <p style="color:rgb(211,8,8, 1.0);font-size:18px;">TongitsPot 发车说明</p>
                  <span style="font-size:14px;font-weight: bolder;">
                    1. 开启机器人进桌后，如果在等待时间内没有凑满发车人数，则补充机器人到发车人数，然后随机打乱队列发车<br>
                    2. 1等2时全进机器人: 是指某桌出现1个玩家等待2个玩家加入时，如果开启则发2个机器人进该桌 <br>
                    3. 2等1时进机器人: 是指某桌出现2个玩家等待1个玩家加入时，如果开启则发1个机器人进该桌 <br>
                    4. 如果1等2和2等1未开启，则空位入桌逻辑从队列里面按顺序取出用户发车到空位桌上<br>
                  </span>
                </div>
              </el-row>
              <el-row v-if="item.GameId===31">
                <div style="margin-bottom:20px;">
                  <p style="color:rgb(211,8,8, 1.0);font-size:18px;">Tongits经典场 发车说明</p>
                  <span style="font-size:14px;font-weight: bolder;">
                    1. 真人优先发有人的桌子<br>
                    2. 开启机器人进桌后，分配机器人进新桌<br>
                    3. 开启机器人进新桌后分配方案<br>
                  </span>
                  <el-table
                    :data="tongitsClassicProp"
                    border
                    style="width: 100%"
                  >
                    <el-table-column
                      prop="pn"
                      label="人数"
                      width="180"
                    />
                    <el-table-column
                      prop="tn"
                      label="桌子数"
                      width="180"
                    />
                    <el-table-column
                      prop="rn"
                      label="补充机器人"
                    />
                  </el-table>
                </div>
              </el-row>
              <el-table
                :data="item.Config"
                style="width: 95%"
                border
              >
                <el-table-column
                  prop="TableMoney"
                  label="底注"
                  width="180"
                >
                  <template slot-scope="scope">
                    <money-input v-model="scope.row.TableMoney" label="" label-width="0" />
                  </template>
                </el-table-column>

                <el-table-column
                  prop="PlayerNum"
                  label="发车人数"
                  width="180"
                >
                  <template slot-scope="scope">
                    <el-form-item label-width="0">
                      <el-input v-model="scope.row.PlayerNum" type="text" placeholder="发车人数" />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="WaitTime"
                  label="等待时间（秒）"
                >
                  <template slot-scope="scope">
                    <el-form-item label-width="0">
                      <el-input v-model="scope.row.WaitTime" type="text" placeholder="等待时间" />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="FreeSeatNum"
                  label="空座位发车值"
                >
                  <template slot-scope="scope">
                    <el-form-item label-width="0">
                      <el-input v-model="scope.row.FreeSeatNum" type="text" placeholder="空座位发车值" />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column
                  v-if="item.GameId===22"
                  prop="IsOpenRobot"
                  label="是否开启机器人进桌"
                >
                  <template slot-scope="scope">
                    <el-form-item label-width="0">
                      <el-switch v-model="scope.row.IsOpenRobot" active-color="#13ce66" inactive-color="#ff4949" />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column
                  v-if="item.GameId===31"
                  prop="IsOpenRobot"
                  label="是否开启机器人进桌"
                >
                  <template slot-scope="scope">
                    <el-form-item label-width="0">
                      <el-switch v-model="scope.row.IsOpenRobot" active-color="#13ce66" inactive-color="#ff4949" />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column
                  v-if="item.GameId === 22"
                  prop="IsTableFree2RobotJoin"
                  label="1等2时全进机器人"
                >
                  <template slot-scope="scope">
                    <el-form-item label-width="0">
                      <el-switch v-model="scope.row.IsTableFree2RobotJoin" active-color="#13ce66" inactive-color="#ff4949" />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column
                  v-if="item.GameId==22"
                  prop="IsTableFree1RobotJoin"
                  label="2等1时进机器人"
                >
                  <template slot-scope="scope">
                    <el-form-item label-width="0">
                      <el-switch v-model="scope.row.IsTableFree1RobotJoin" active-color="#13ce66" inactive-color="#ff4949" />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="IsOpen"
                  label="是否开启"
                >
                  <template slot-scope="scope">
                    <el-form-item label-width="0">
                      <el-switch v-model="scope.row.IsOpen" active-color="#13ce66" inactive-color="#ff4949" />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column label="操作" :render-header="(h,obj)=>addTableHeaderButton(h,obj,item.GameId)">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delRow(item.GameId, scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </fieldset>
          </div>
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
    <compare ref="compare" />

    <el-dialog
      title="选择游戏"
      :visible.sync="selectGameVisible"
      width="350px"
    >
      <el-form ref="selectedGid" v-model="selectedGid" label-width="150px">
        <el-form-item label-width="0">
          <el-select v-model="selectedGid" placeholder="请选择" size="mini">
            <el-option
              v-for="item in gameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addGameItem">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput },
  data() {
    return {
      form: {},
      subKey: 'game_wait_queue',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      allCfg: {},
      listData: [],
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

      selectedGid: 0,
      gameOptions: [],
      selectGameVisible: false,
      tongitsClassicProp: [
        { 'pn': 1, 'tn': 1, 'rn': 2 },
        { 'pn': 2, 'tn': 2, 'rn': 4 },
        { 'pn': 4, 'tn': 2, 'rn': 2 },
        { 'pn': 5, 'tn': 2, 'rn': 1 },
        { 'pn': 7, 'tn': 3, 'rn': 2 },
        { 'pn': 8, 'tn': 3, 'rn': 1 }
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    newGameItem(gid) {
      return {
        GameId: gid,
        Config: []
      }
    },
    addTableHeaderButton(h, data, gid) {
      console.log('h:', h)
      console.log('data:', data)
      console.log('gid:', gid)
      return (
        <div>
          <span>操作</span>
          <el-button type='primary' size='mini' style='padding:5px;margin-left:5px;' onClick={() => this.doAdd(gid)}>添加底注配置</el-button>
        </div>
      )
    },
    addOne() {
      const gameIds = [] // 已经有配置的 gid
      for (const i in this.allCfg.All) {
        gameIds.push(this.allCfg.All[i].GameId)
      }
      this.gameOptions = []
      console.log('gameIds ---> ', gameIds)
      for (const i in this.games) {
        if (!gameIds.includes(parseInt(i))) {
          this.gameOptions.push({
            value: i,
            label: this.games[i]
          })
        }
      }
      if (this.gameOptions.length < 1) {
        Message.error('现有游戏都已经有配置')
        return false
      }
      this.selectGameVisible = true
    },
    addGameItem() {
      if (this.selectedGid == 0) {
        Message.error('请选择游戏！')
        return false
      }
      console.log('addGameItem selectedGid ', this.selectedGid)
      this.allCfg.All.push(this.newGameItem(this.selectedGid))
      console.log('addGameItem ---> ', this.allCfg)
      this.selectGameVisible = false
    },
    doAdd(gid) {
      console.log('gid===>', gid)
      for (let i = 0; i < this.allCfg.All.length; i++) {
        if (this.allCfg.All[i].GameId === gid) {
          this.allCfg.All[i].Config.push(
            {
              TableMoney: 0,
              PlayerNum: 0,
              WaitTime: 0,
              FreeSeatNum: 0,
              IsOpen: false
            }
          )
        }
      }
    },
    delRow(gid, idx, row) {
      console.log('gid: ' + gid + 'idx:' + idx + ' row:', row)
      for (let i = 0; i < this.allCfg.All.length; i++) {
        if (this.allCfg.All[i].GameId === gid) {
          this.allCfg.All[i].Config.splice(idx, 1)
        }
      }
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
          $this.listData = []
          if (response.Data && response.Data.Data !== '') {
            $this.allCfg = JSON.parse(response.Data.Data)
            console.log('$this.allCfg >>> ', $this.allCfg)
            $this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },
    setData() {
      this.formatCfg()
      console.log('saveData ===> ', this.allCfg)
      if (!this.checkData()) {
        return false
      }
      this.form.Data = JSON.stringify(this.allCfg)
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
    formatCfg() {
      for (const i in this.allCfg.All) {
        this.allCfg.All[i].GameId = parseInt(this.allCfg.All[i].GameId)
        if (this.allCfg.All[i].Config.length < 1) {
          continue
        }
        for (const j in this.allCfg.All[i].Config) {
          this.allCfg.All[i].Config[j].TableMoney = parseInt(this.allCfg.All[i].Config[j].TableMoney)
          this.allCfg.All[i].Config[j].PlayerNum = parseInt(this.allCfg.All[i].Config[j].PlayerNum)
          this.allCfg.All[i].Config[j].WaitTime = parseInt(this.allCfg.All[i].Config[j].WaitTime)
          this.allCfg.All[i].Config[j].FreeSeatNum = parseInt(this.allCfg.All[i].Config[j].FreeSeatNum)
        }
      }
    },
    checkData() {
      for (const i in this.allCfg.All) {
        if (this.allCfg.All[i].Config.length < 1) {
          continue
        }
        for (const j in this.allCfg.All[i].Config) {
          if (this.allCfg.All[i].Config[j].TableMoney <= 0) {
            Message.error('必须有底注值')
            return false
          }
          if (this.allCfg.All[i].Config[j].IsOpen && (this.allCfg.All[i].Config[j].PlayerNum == 0 && this.allCfg.All[i].Config[j].WaitTime == 0)) {
            Message.error('开启的时候，必须配置【发车人数】和【等待时间】')
            return false
          }
          // tongits 判断发车人数有配置的时候，必须大于等于 3
          if ((this.allCfg.All[i].GameId == 22 || this.allCfg.All[i].GameId == 31) && this.allCfg.All[i].Config[j].IsOpen && this.allCfg.All[i].Config[j].PlayerNum > 0 && this.allCfg.All[i].Config[j].PlayerNum < 3) {
            Message.error('Tongits 的【发车人数】必须大于等于 3')
            return false
          }
        }
      }
      return true
    }
  }
}
</script>
