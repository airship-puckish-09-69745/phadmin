<template>
  <div class="app-container">
    <!--    奖池增长  -->
    <el-table
      ref="filterTable"
      :data="PoolIncrArr"
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="width: 100%"
    >
      <el-table-column label="Id" prop="Id" />
      <el-table-column label="奖池范围">
        <template slot-scope="scope">
          {{ getJackpotPoolTitle(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column label="[0,2)点" prop="MinRobotNum">
        <template slot-scope="scope">
          {{ getJackpotIncrShow(scope.row, 0, 1) }}
        </template>
      </el-table-column>
      <el-table-column label="[2,7)点" prop="MinRobotNum">
        <template slot-scope="scope">
          {{ getJackpotIncrShow(scope.row, 2, 6) }}
        </template>
      </el-table-column>
      <el-table-column label="[7,9)点" prop="MinRobotNum">
        <template slot-scope="scope">
          {{ getJackpotIncrShow(scope.row, 7, 8) }}
        </template>
      </el-table-column>
      <el-table-column label="[9,18)点" prop="MinRobotNum">
        <template slot-scope="scope">
          {{ getJackpotIncrShow(scope.row, 9, 17) }}
        </template>
      </el-table-column>
      <el-table-column label="[18,24)点" prop="MinRobotNum">
        <template slot-scope="scope">
          {{ getJackpotIncrShow(scope.row, 18, 23) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="normal" icon="el-icon-edit" size="mini" @click="showIncrJackpotForm(scope.row,scope.$index)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 【dialog】Jackpot奖池增长 -->
    <el-dialog
      :title="incrJackpotForm.title"
      :modal="false"
      :visible.sync="incrJackpotForm.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="robotForm" :model="incrJackpotForm.data.TimeArr">
        <el-form-item>
          <el-table
            ref="filterTable"
            :data="incrJackpotForm.data"
            border
            :header-cell-style="libShow.DefaultTableHeadClass"
            :row-style="{height:'10px'}"
            :cell-style="libShow.DefaultTableCell"
            style="width: 100%"
          >
            <el-table-column type="index" />
            <el-table-column label="时间段">
              <template slot-scope="scope">
                [{{ scope.row.StartHour }},{{ scope.row.EndHour+1 }})点
              </template>
            </el-table-column>
            <el-table-column label="每小时增长">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.PerHourIncr" style="width: 100px;" size="mini" :required="true" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-bottom:10px;" type="primary" size="mini" @click="saveIncrJackpotDialog()">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

import { $libShow } from '@/utils/common'
import { Message } from 'element-ui'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'JackpotIncrease',
  components: {},
  props: {
    PoolIncrArr: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      JpTypeMap: {
        1: 'Grand',
        2: 'Major',
        3: 'Minor'
      },
      incrJackpotForm: {
        dataIdx: 0,
        id: 0,
        title: '',
        visible: false,
        data: []
      },
      libShow: $libShow,
      dayLimitChange: {
        visible: false,
        data: [],
        jackpotType: 0,
        title: ''
      },
      poolNumChange: {
        visible: false,
        data: [],
        jackpotType: 0
      }
    }
  },

  watch: {
    'PoolIncrArr': {
      deep: true,
      handler: function(val) {
        this.initData(val)
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
    },
    saveIncrJackpotDialog() {
      console.log('THIS', this.incrJackpotForm.dataIdx, this.PoolIncrArr)
      this.PoolIncrArr[this.incrJackpotForm.dataIdx].TimeArr = this.incrJackpotForm.data

      for (const o of this.PoolIncrArr[this.incrJackpotForm.dataIdx].TimeArr) {
        o.PerHourIncr *= 1000
      }

      this.incrJackpotForm.visible = false
    },
    // 展示jackpot每小时增长值
    getJackpotIncrShow(row, startHour, endHour) {
      let showNum = 0
      for (let i = 0; i < row.TimeArr.length; i++) {
        if (row.TimeArr[i].StartHour == startHour && row.TimeArr[i].EndHour == endHour) {
          showNum = row.TimeArr[i].PerHourIncr / 1000
          break
        }
      }
      return showNum.toLocaleString()
    },
    getJackpotPoolTitle(row) {
      if (row.MaxPool == -1) {
        return Math.floor(row.MinPool / 10000000) + '万以上每小时增长'
      } else {
        return Math.floor(row.MinPool / 10000000) + '~' + Math.floor(row.MaxPool / 10000000) + '万每小时增长'
      }
    },
    showIncrJackpotForm(data, index) {
      console.log('show====', data, index)
      this.incrJackpotForm.dataIdx = index
      this.incrJackpotForm.id = data.Id
      this.incrJackpotForm.data = []
      for (const i in data.TimeArr) {
        this.incrJackpotForm.data.push({
          EndHour: data.TimeArr[i].EndHour,
          Index: data.TimeArr[i].Index,
          StartHour: data.TimeArr[i].StartHour,
          PerHourIncr: data.TimeArr[i].PerHourIncr / 1000
        })
      }

      this.incrJackpotForm.title = '编辑' + this.getJackpotPoolTitle(data)
      this.incrJackpotForm.visible = true
    },
    delRow(index) {
      if (this.piggyCfg.length <= 1) {
        Message.error('再删就没了')
        return
      }
      this.piggyCfg.splice(index, 1)
    }
  }
}
</script>
