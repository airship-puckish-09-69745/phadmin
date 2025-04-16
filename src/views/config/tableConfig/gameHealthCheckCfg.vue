<template>
  <div class="app-container">
    <publish primary-key="Volume" :key-id="getFullKey(this.subKey)" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-row :gutter="10" style="margin-top: 30px">
      <div style="color: yellowgreen;font-weight: bolder;">
        <p> </p>
      </div>
      <br>
      <el-col :span="22">
        <el-button type="primary" size="mini" @click="addOne">添加游戏配置项</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
      </el-col>
      <el-col :span="24">
        <el-form ref="allCfg" v-model="allCfg.items" label-width="150px">
          <el-table
            :data="allCfg.items"
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
              prop="min"
              label="最小值（x%）"
              min-width="180"
            >
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-input v-model.number="scope.row.min" type="text" placeholder="最小值（x%）" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="max"
              label="最大值（x%）"
              min-width="180"
            >
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-input v-model.number="scope.row.max" type="text" placeholder="最大值（x%）" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="warn_cd_minute"
              label="告警CD时间（分钟）"
              min-width="180"
            >
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-input v-model.number="scope.row.warn_cd_minute" type="text" placeholder="告警CD时间（分钟）" />
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
          <el-select v-model="selectedGid" filterable placeholder="请选择" size="mini">
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
      subKey: 'game_health_check',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      },
      allCfg: {},
      listData: [],
      games: {},

      selectedGid: -1,
      gameOptions: [],
      selectGameVisible: false
    }
  },
  created() {
    this.getAllGames()
    this.getData()
  },
  methods: {
    newGameItem(gid) {
      return {
        gid: parseInt(gid),
        min: 0,
        max: 0,
        warn_cd_minute: 0,
        name: this.showGameName(parseInt(gid))
      }
    },
    addOne() {
      const gameIds = [] // 已经有配置的 gid
      for (const i in this.allCfg.items) {
        gameIds.push(this.allCfg.items[i].gid)
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
      this.allCfg.items.push(this.newGameItem(this.selectedGid))
      // console.log('addGameItem ---> ', this.allCfg)
      this.selectGameVisible = false
    },
    doAdd(gid) {
      console.log('gid===>', gid)
      for (let i = 0; i < this.allCfg.items.length; i++) {
        if (this.allCfg.items[i].GameId === gid) {
          this.allCfg.items[i].Config.push(
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
      for (let i = 0; i < this.allCfg.items.length; i++) {
        if (this.allCfg.items[i].gid === row.gid) {
          this.allCfg.items.splice(idx, 1)
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
      for (const i in this.allCfg.items) {
        this.allCfg.items[i].gid = parseInt(this.allCfg.items[i].gid)
        this.allCfg.items[i].min = parseInt(this.allCfg.items[i].min)
        this.allCfg.items[i].max = parseInt(this.allCfg.items[i].max)
        this.allCfg.items[i].warn_cd_minute = parseInt(this.allCfg.items[i].warn_cd_minute)
        this.allCfg.items[i].name = this.showGameName(parseInt(this.allCfg.items[i].gid))
      }
    },
    checkData() {
      for (const i in this.allCfg.items) {
        if (this.allCfg.items[i].gid < 0) {
          Message.error('gid 不能小于0')
          return false
        }
        if (this.allCfg.items[i].min < 0 || this.allCfg.items[i].max < 0) {
          Message.error('最小值 不能小于0，最大值 不能小于0')
          return false
        }
        if (this.allCfg.items[i].warn_cd_minute < 0) {
          Message.error('告警CD时间 不能小于0')
          return false
        }
      }
      return true
    },
    getAllGames() {
      const $this = this
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          for (let i = 0; i < objs.length; i++) {
            $this.games[objs[i].Gid] = objs[i].Name
          }
        }
      })
    }
  }
}
</script>
