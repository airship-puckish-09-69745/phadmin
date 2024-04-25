<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 50px">
      <el-col :span="22" :offset="1">
        <el-button type="success" size="mini" @click="getData">刷新</el-button>
      </el-col>
      <el-col :span="22" :offset="1">
        <el-table
          :data="tableData"
          border
        >
          <el-table-column
            prop="Gid"
            label="子游戏"
            width="150"
          >
            <template slot-scope="scope">
              {{ getGameName(scope.row.Gid) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="PrizePool"
            label="奖池"
            width="200"
          >
            <template slot-scope="scope">
              <span :style="scope.row.PrizePool/1000>1000000?'color:red':''">{{ Math.floor(scope.row.PrizePool/1000).toLocaleString() }}</span>

            </template>
          </el-table-column>
          <el-table-column
            prop="RecountRate"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

    </el-row>

    <el-dialog
      title="修改"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="子游戏：">
          <el-input v-model="form.Name" size="medium" />
        </el-form-item>
        <el-form-item label="增减奖池：" prop="PrizePool">
          <el-input v-model.number="form.PrizePool" size="medium" :required="true" :placeholder="form.LotteryPool" />
        </el-form-item>
          <el-form-item label="低注：" prop="PrizePool" v-if="form.Gid==37">
              <el-input v-model.number="form.Ante" size="medium" :required="true" :placeholder="form.Ante" />
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setData">确 定</el-button>
      </span>
    </el-dialog>

    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import store from '@/store'
import { $libShow, DataRule, ValidateVueItem } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      tableData: [],
      form: {
        Gid: 1,
        PrizePool: 0,
        LotteryPool: 0, // 坚持现在值
        FeeRate: 0,
        RecountRate: 0,
        Name: '',
        Ante: 0
      },
      libShow: $libShow,
      dialogVisible: false
    }
  },
  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    edit(row) {
      // 设置修改之前数据
      this.$refs.compare.SetOldVal(row)

      this.form.Gid = row.Gid
      this.form.PrizePool = 0
      this.form.LotteryPool = row.PrizePool
      this.form.FeeRate = row.FeeRate
      this.form.RecountRate = row.RecountRate
      this.form.Name = this.getGameName(row.Gid)
      this.form.Ante = row.Ante
      this.dialogVisible = true
      console.log(row.Gid,this.form.Gid)
    },
    handleClose(done) {
      this.dialogVisible = false
      done()
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getData() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/user/game/prize/pool/list',
          Env: store.getters.env,

        }
      }).then(response => {
        console.log('list response', response)
        if (response.RetCode === 0) {
          $this.tableData = response.Data
        } else {
          $this.$message.error(response.Data)
        }
      })
    },
    getGameName(gid) {
      const id = parseInt(gid)
      return $libShow.GameNames[id]
    },
    writeLog() {
      const op = this.form.PrizePool > 0 ? '累加' : '累减'
      const env = this.$store.getters.env === 'test' ? '测试' : '线上'
      const txt = env + ': ' + this.getGameName(this.form.Gid) + '奖池' + op + this.form.PrizePool

      request({
        url: '/adminuser/write/log',
        method: 'post',
        data: {
          'txt': txt,
          'path': 'online/prize_pool',
          'stype': 'prizepool',
          'optype': 3
        }
      }).then(response => {
        console.log('write log', response)
      })
    },
    setData() {
      if (!ValidateVueItem(this.$refs['form'])) return false
      console.log('form', this.form)
      const $this = this

      if (this.form.PrizePool === 0) {
        this.$message.error('增减奖池值不能为0')
        return
      }

      const submitData = {
        'Gid': this.form.Gid,
        'PrizePool': parseInt(this.form.LotteryPool) + parseInt(this.form.PrizePool * 1000),
        'FeeRate': this.form.FeeRate,
        'RecountRate': this.form.RecountRate,
        'Ante': this.form.Ante
      }

      // 设置修改后数据
      this.$refs.compare.SetNewVal(submitData)
      this.$refs.compare.Compare(function(isEdit) {
        console.log('isEdit....', isEdit)
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        $this.writeLog()
        // 上面设置的值，只是为了对比
        submitData.PrizePool = parseInt($this.form.PrizePool) * 1000
        submitData.Path = '/user/update/game/prize/pool'
        submitData.Env = $this.$store.getters.env

        request({
          url: '/dataProxy/info',
          method: 'post',
          data: submitData
        }).then(response => {
          console.log('list response', response)
          if (response.RetCode === 0) {
            $this.$message.success('更新成功')
            $this.dialogVisible = false
            $this.getData()
          } else {
            $this.$message.error(response.Data)
          }
        })
      })
    }
  }
}
</script>
