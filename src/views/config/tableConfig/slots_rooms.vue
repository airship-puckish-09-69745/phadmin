<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 50px">
      <el-col :span="22" :offset="1">
        <el-form ref="form" :model="form" size="mini" :inline="true">
          <slots-select v-model="slotsType" :st-map="stMap" />
          <el-button type="primary" size="mini" @click="getData">查询</el-button>
        </el-form>
      </el-col>
      <el-col :span="22" :offset="1">
        <el-table
          :data="tableData"
          border
        >
          <el-table-column prop="Bet" label="房间" :formatter="toRupee" />
          <el-table-column prop="Pool" label="水池" :formatter="toRupee" />
          <el-table-column prop="TotalBet" label="总下注" :formatter="toRupee" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="edit(scope.row)">修改水池</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

    </el-row>

    <el-dialog
      title="修改水池"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="老虎机：">
          <el-input v-model="form.Name" size="medium" disabled />
        </el-form-item>
        <el-form-item label="房间：">
          <el-input v-model="form.Bet2" size="medium" disabled />
        </el-form-item>

        <money-input v-model="form.Pool" label="水池" />

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
import Compare from '@/components/Compare'
import SlotsSelect from '@/components/SlotsSelect'
import MoneyInput from '@/components/MoneyInput'
import request from '@/utils/request'
import store from '@/store'
import { $libShow, DataRule } from '@/utils/common'

export default {
  components: { Compare, SlotsSelect, MoneyInput },
  data() {
    return {
      tableData: [],
      slotsType: 76,
      stMap: {},
      form: {
        SlotsType: 0,
        Bet: 0,
        Pool: 0
      },
      row: {},
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
      this.row = row

      this.form.SlotsType = row.SlotsType
      this.form.Bet = row.Bet
      this.form.Bet2 = this.toRupee(0, 0, row.Bet, 0)
      this.form.Pool = row.Pool
      this.form.Name = this.getSlotsName(row.SlotsType)
      this.dialogVisible = true
    },
    handleClose(done) {
      this.dialogVisible = false
      done()
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    toRupee(row, col, val, idx) {
      return val / 1000
    },
    getData() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/slotsStat/rooms',
          Env: store.getters.env,
          slots_type: this.slotsType
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
    getSlotsName(gid) {
      return this.stMap[gid]
    },
    async writeLog() {
      const op = this.form.Pool > 0 ? '累加' : '累减'
      const env = this.$store.getters.env === 'test' ? '测试' : '线上'
      const txt = env + ': ' + this.getSlotsName(this.form.SlotsType) + '水池' + op + this.toRupee(0, 0, this.form.Pool, 0)

      const response = await request({
        url: '/adminuser/write/log',
        method: 'post',
        data: {
          'txt': txt,
          'path': 'slots/rooms',
          'stype': 'update_rooms_pool',
          'optype': 3
        }
      })

      console.log('write log', response)
    },
    setData() {
      const $this = this

      this.row.Pool = this.form.Pool

      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.row)
      this.$refs.compare.Compare(function(isEdit) {
        console.log('isEdit....', isEdit)
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }

        $this.writeLog()

        const param = {
          Path: '/slotsStat/reset/room/pool',
          Env: $this.$store.getters.env,
          slots_type: $this.form.SlotsType,
          bet: $this.form.Bet,
          pool: $this.form.Pool
        }

        request({
          url: '/dataProxy/info',
          method: 'post',
          data: param
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
