<template>
  <div class="app-container">
    <publish primary-key="Volume" :key-id="getFullKey(this.subKey)" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="24">
        <div style="color: red;font-weight: bolder;">
          不支持桌子人数大于 9 以上的游戏!!!
        </div>
        <br>
        <el-form ref="listData" label-width="150px">

          <el-col :span="22">
            <el-button type="primary" size="mini" @click="addOne">添加配置项</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
          </el-col>
          <el-table
            :data="listData"
            style="width: 100%"
            border
          >
            <el-table-column
              prop="Gid"
              label="游戏"
              width="180"
            >
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-input v-model="scope.row.Gid" type="number" placeholder="游戏id" />
                </el-form-item>
              </template>
            </el-table-column>
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
                  <el-input v-model="scope.row.PlayerNum" type="number" placeholder="发车人数" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              prop="WaitTime"
              label="等待时间"
            >
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-input v-model="scope.row.WaitTime" type="number" placeholder="等待时间" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              prop="FreeSeatNum"
              label="空座位发车值"
            >
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-input v-model="scope.row.FreeSeatNum" controls="false" type="number" placeholder="空座位发车值" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              prop="IsOpen"
              label="是否开启"
            >
              <template slot-scope="scope">
                <el-form-item label-width="0">
                  <el-switch v-model="scope.row.IsOpen" active-color="#13ce66" inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
            >
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="delOne(scope.$index)">删除</el-button>
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
    <compare ref="compare" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput'

function newOne() {
  return {
    'Gid': '',
    'TableMoney': 0,
    'PlayerNum': 0,
    'WaitTime': 0,
    'FreeSeatNum': 0,
    'IsOpen': false
  }
}

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
      listData: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getFullKey(k) {
      return 'CustomizeCfg_' + k
    },
    addOne() {
      this.listData.push(newOne())
    },
    delOne(index) {
      const $this = this
      this.$confirm('确定要删除吗？', '提醒')
        .then(function() {
          $this.listData.splice(index, 1)
        })
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
            const cfg = JSON.parse(response.Data.Data)
            $this.allCfg = cfg
            for (const i in cfg.All) {
              const oneGameCfg = cfg.All[i]
              for (const k in oneGameCfg.Config) {
                console.log('oneGameCfg >>> ', oneGameCfg)
                $this.listData.push({
                  Gid: oneGameCfg.GameId,
                  TableMoney: oneGameCfg.Config[k].TableMoney,
                  PlayerNum: oneGameCfg.Config[k].PlayerNum,
                  WaitTime: oneGameCfg.Config[k].WaitTime,
                  FreeSeatNum: oneGameCfg.Config[k].FreeSeatNum,
                  IsOpen: oneGameCfg.Config[k].IsOpen
                })
              }
            }
            $this.$refs.compare.SetOldVal(response.Data)
          }
        }
      })
    },

    setData() {
      console.log('setData >>> ', this.listData)
      if (this.listData.length < 1) {
        this.$message.error('没有配置项')
        return false
      }
      const allCfg = {}
      const gameIds = []
      for (const i in this.listData) {
        if (this.listData[i].Gid < 1) {
          this.$message.error('游戏id有误')
          return false
        }
        const gid = parseInt(this.listData[i].Gid)
        if (!gameIds.includes(gid)) {
          console.log('gid >>> ', gid)
          allCfg[gid] = []
          gameIds.push(gid)
          console.log('gameIds >>> ', gameIds)
        }
        allCfg[gid].push({
          TableMoney: parseInt(this.listData[i].TableMoney),
          PlayerNum: parseInt(this.listData[i].PlayerNum),
          WaitTime: parseInt(this.listData[i].WaitTime),
          FreeSeatNum: parseInt(this.listData[i].FreeSeatNum),
          IsOpen: this.listData[i].IsOpen
        })
      }
      const data = { All: [] }
      for (const gid in allCfg) {
        data.All.push({
          GameId: parseInt(gid),
          Config: allCfg[gid]
        })
      }
      console.log('data >>> ', data)
      this.form.Data = JSON.stringify(data)
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
    }
  }
}
</script>
