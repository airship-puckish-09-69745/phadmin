<template>
  <div class="app-container">
    <publish primary-key="Volume" :key-id="getFullKey(this.subKey)" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-row :gutter="10" style="margin-top: 30px">
      <div style="color: yellowgreen;font-weight: bolder;">
        <p>显示人数计算公式：场次真实在线人数 * 在线倍数% + 随机人数。（随机人数：【随机最小人数】与【随机最大人数】之间的随机值； 如果两个随机配置的差值为0，则不随机）</p>
      </div>
      <br>
      <el-col :span="22">
        <el-button type="primary" size="mini" @click="addOne">添加游戏配置项</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
      </el-col>
      <el-col :span="24">
        <el-form ref="allCfg" v-model="allCfg.gameCfg" label-width="150px">
          <el-table
            :data="allCfg.gameCfg"
            style="width: 95%"
            border
          >
            <el-table-column
              prop="gid"
              label="游戏"
              min-width="180"
            >
              <template slot-scope="scope">
                {{ showGameName(scope.row.gid) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="randMin"
              label="最小随机数"
              min-width="180"
            >
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-input v-model.number="scope.row.randMin" type="text" placeholder="最小随机数" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="randMax"
              label="最大随机数"
              min-width="180"
            >
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-input v-model.number="scope.row.randMax" type="text" placeholder="最大随机数" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="mul"
              label="在线倍数（百分比）"
              min-width="200"
            >
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-input v-model.number="scope.row.mul" type="text" placeholder="在线倍数：100%" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="delRow(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
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
      width="600px"
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

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      form: {},
      subKey: 'game_online_config',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      allCfg: {},
      listData: [],
      games: {
        // 0: '应用在线',
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
        31: 'Tongits-Classic',
        28: 'Tongits-Joker',
        29: 'Tongits-Quick',
        34: 'PusoyDos',
        // 47: 'Billiard-8ball',
        // 48: 'Billiard-9ball'
        113: 'Pusoy-Swap',
        111: 'Domino QiuQiu',
        120: 'Tongits-Swap',
        126: 'Pusoy-Wild',
        128: 'Tongits-Jackpot',
        134: 'Pusoy-JP'
      },

      selectedGid: -1,
      gameOptions: [],
      selectGameVisible: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    newGameItem(gid) {
      return {
        gid: parseInt(gid),
        randMin: 0,
        randMax: 0,
        mul: 100
      }
    },
    addOne() {
      const gameIds = [] // 已经有配置的 gid
      for (const i in this.allCfg.gameCfg) {
        gameIds.push(this.allCfg.gameCfg[i].gid)
      }
      this.gameOptions = []
      this.selectedGid = -1
      for (const i in this.games) {
        if (!gameIds.includes(parseInt(i))) {
          this.gameOptions.push({
            value: parseInt(i),
            label: this.games[i]
          })
        }
      }
      if (this.gameOptions.length < 1) {
        Message.error('现有游戏都已经有配置')
        return false
      }
      this.selectedGid = this.gameOptions[0].value
      this.selectGameVisible = true
    },
    addGameItem() {
      if (this.selectedGid === -1) {
        Message.error('请选择游戏！')
        return false
      }
      // console.log('addGameItem selectedGid ', this.selectedGid)
      this.allCfg.gameCfg.push(this.newGameItem(this.selectedGid))
      // console.log('addGameItem ---> ', this.allCfg)
      this.selectGameVisible = false
    },
    doAdd(gid) {
      console.log('gid===>', gid)
      for (let i = 0; i < this.allCfg.gameCfg.length; i++) {
        if (this.allCfg.gameCfg[i].GameId === gid) {
          this.allCfg.gameCfg[i].Config.push(
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
    delRow(idx, row) {
      console.log('idx:' + idx + ' row:', row)
      for (let i = 0; i < this.allCfg.gameCfg.length; i++) {
        if (this.allCfg.gameCfg[i].gid === row.gid) {
          this.allCfg.gameCfg.splice(idx, 1)
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
      for (const i in this.allCfg.gameCfg) {
        this.allCfg.gameCfg[i].gid = parseInt(this.allCfg.gameCfg[i].gid)
        this.allCfg.gameCfg[i].randMin = parseInt(this.allCfg.gameCfg[i].randMin)
        this.allCfg.gameCfg[i].randMax = parseInt(this.allCfg.gameCfg[i].randMax)
        this.allCfg.gameCfg[i].mul = parseInt(this.allCfg.gameCfg[i].mul)
      }
    },
    checkData() {
      for (const i in this.allCfg.gameCfg) {
        if (this.allCfg.gameCfg[i].gid < 0) {
          Message.error('gid 不能小于0')
          return false
        }
        if (this.allCfg.gameCfg[i].randMin < 0 || this.allCfg.gameCfg[i].randMax < 0 || this.allCfg.gameCfg[i].randMin > this.allCfg.gameCfg[i].randMax) {
          Message.error('randMin 不能小于0，randMax 不能小于0，randMin 不能大于randMax')
          return false
        }
        if (this.allCfg.gameCfg[i].mul < 0) {
          Message.error('mul 不能小于0')
          return false
        }
      }
      return true
    }
  }
}
</script>
