<template>
  <div class="app-container">
    <el-row>
      <el-form :model="searchForm" label-width="120px" :inline="true" size="small">
        <el-form-item label="日期：">
          <div class="block">
            <el-date-picker
              v-model="searchForm.dayStr"
              value-format="timestamp"
              type="date"
              placeholder="选择十五天内的日期"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="search">查询</el-button>
          <el-button type="danger" size="mini" @click="showControl">上帝之手</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <table class="formTable" style="width: 60%">
        <tr>
          <td colspan="5">日期： {{ showRet.showDay }}</td>
        </tr>
        <tr>
          <td>列名</td>
          <td>局数</td>
          <td>出现概率</td>
          <td>参考概率</td>
          <td>偏差</td>
        </tr>
        <tr>
          <td>总局数：</td>
          <td>{{ showRet.totalNum }}</td>
          <td>100%</td>
          <td>100%</td>
          <td />
        </tr>
        <tr>
          <td>= 1.00</td>
          <td>{{ retData.Rate100 }}</td>
          <td>{{ showData.Rate100.toFixed(2) }}%</td>
          <td>{{ showData.Rate100STD }}%</td>
          <td v-html="getDiffShow(showData.Rate100, showData.Rate100STD)" />
        </tr>
        <tr>
          <td>= 1.01</td>
          <td>{{ retData.Rate101 }}</td>
          <td>{{ showData.Rate101.toFixed(2) }}%</td>
          <td>{{ showData.Rate101STD }}%</td>
          <td v-html="getDiffShow(showData.Rate101, showData.Rate101STD)" />
        </tr>
        <tr>
          <td>< 1.10</td>
          <td>{{ retData.RateLess110 }}</td>
          <td>{{ showData.RateLess110.toFixed(2) }}%</td>
          <td>{{ showData.RateLess110STD }}%</td>
          <td v-html="getDiffShow(showData.RateLess110, showData.RateLess110STD)" />
        </tr>
        <tr>
          <td>= 1.10</td>
          <td>{{ retData.Rate110 }}</td>
          <td>{{ showData.Rate110.toFixed(2) }}%</td>
          <td>{{ showData.Rate110STD }}%</td>
          <td v-html="getDiffShow(showData.Rate110, showData.Rate110STD)" />
        </tr>
        <tr>
          <td>< 1.20</td>
          <td>{{ retData.RateLess120 }}</td>
          <td>{{ showData.RateLess120.toFixed(2) }}%</td>
          <td>{{ showData.RateLess120STD }}%</td>
          <td v-html="getDiffShow(showData.RateLess120, showData.RateLess120STD)" />
        </tr>
        <tr>
          <td>= 1.20</td>
          <td>{{ retData.Rate120 }}</td>
          <td>{{ showData.Rate120.toFixed(2) }}%</td>
          <td>{{ showData.Rate120STD }}%</td>
          <td v-html="getDiffShow(showData.Rate120, showData.Rate120STD)" />
        </tr>
        <tr>
          <td>(1.2, 2]</td>
          <td>{{ showRet.lessThanTwo }}</td>
          <td>{{ showRet.lessThanTwoRate }}%</td>
          <td>{{ showData.Less200STD }}%</td>
          <td v-html="getDiffShow(showRet.lessThanTwoRate, showData.Less200STD)" />
        </tr>
        <tr>
          <td>(2, 3]</td>
          <td>{{ showRet.lessThanThree }}</td>
          <td>{{ showRet.lessThanThreeRate }}%</td>
          <td>{{ showData.Less300STD }}%</td>
          <td v-html="getDiffShow(showRet.lessThanThreeRate, showData.Less300STD)" />
        </tr>
        <tr>
          <td>(3, 8]</td>
          <td>{{ showRet.moreThanThree }}</td>
          <td>{{ showRet.moreThanThreeRate }}%</td>
          <td>{{ showData.Less800STD }}%</td>
          <td v-html="getDiffShow(showRet.moreThanThreeRate, showData.Less800STD)" />
        </tr>
        <tr>
          <td>> 8</td>
          <td>{{ showRet.moreThanEight }}</td>
          <td>{{ showRet.moreThanEightRate }}%</td>
          <td>{{ showData.MoreThan800STD }}%</td>
          <td v-html="getDiffShow(showRet.moreThanEightRate, showData.MoreThan800STD)" />
        </tr>
      </table>
    </el-row>
    <el-dialog
      title="上帝之手"
      :modal="false"
      :visible.sync="controlForm.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-form :model="controlForm" label-width="120px" size="small">
          <el-form-item label="Uid：">
            <el-input v-model.number="controlForm.uid" size="11" placeholder="请输入Uid" />
          </el-form-item>
          <el-form-item label="下注金额：">
            <el-input v-model.number="controlForm.score" size="11" placeholder="0表示任何金额" /> 0表示任意金额
          </el-form-item>
          <el-form-item label="赔率(>=100)：">
            <el-input v-model.number="controlForm.bet" size="11" placeholder="请输入赔率" />
          </el-form-item>
          <el-form-item>
            <font style="color:red;">赔率需要放大100倍，值范围： [100,10000]，设置之后，一天内有效，只生效一次。</font>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="control">保存</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>
    <div style="width:600px">
      <fieldset>
        <legend>当前大额奖池</legend>
        <p>当前余额：{{ bigBetPool }}</p>
        <p><el-button size="mini" type="primary" @click="refrashPool">刷新</el-button><el-button size="mini" @click="operatePool">加减</el-button></p>
      </fieldset>
    </div>
    <el-dialog
      title="调整大注奖池"
      modal="false"
      :visible.sync="operateForm.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="operateForm" label-width="120px" size="small">
        <el-form-item label="当前奖池：">
          {{ bigBetPool }}
        </el-form-item>
        <el-form-item label="变化值：">
          <el-input v-model.number="operateForm.change" size="11" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="operate">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>
<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import LineChart from './components/LineChart'
import request from '@/utils/request'
import { $libDate, $libShow, $libType, ClientTableData, MoneyShow } from '@/utils/common'
import store from '@/store'

export default {
  name: 'RocketRet',
  components: { Compare, Publish, UidInput, LineChart },
  data() {
    return {
      searchForm: {
        dayStr: $libDate.GetDayBegin(new Date().getTime())
      },
      showRet: {
        totalNum: 0,
        lessThanOnePointTwo: 0,
        lessThanTwo: 0,
        lessThanThree: 0,
        moreThanThree: 0,
        moreThanEight: 0,
        showDay: '',
        lessThanOnePointTwoRate: 0,
        lessThanTwoRate: 0,
        lessThanThreeRate: 0,
        moreThanThreeRate: 0,
        moreThanEightRate: 0
      },
      showData: {
        Rate100: 0,
        Rate101: 0,
        Rate110: 0,
        Rate120: 0,
        RateLess110: 0,
        RateLess120: 0,
        Rate100STD: 0,
        Rate101STD: 0,
        Rate110STD: 0,
        Rate120STD: 0,
        RateLess110STD: 0,
        RateLess120STD: 0,
        Less200STD: 0,
        Less300STD: 0,
        Less800STD: 0,
        MoreThan800STD: 0
      },
      bigBetPool: 0,
      operateForm: {
        visible: false,
        change: 0
      },
      retData: {

      },
      controlForm: {
        visible: false,
        score: 0,
        uid: 0,
        bet: 0
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  created() {
    this.search()
  },
  methods: {
    getDiffShow(val, std) {
      if (val >= std) {
        return "<span style='color:green'>" + (val - std).toFixed(2) + '%</span>'
      } else {
        return "<span style='color:red'>" + (val - std).toFixed(2) + '%</span>'
      }
    },
    search() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/game/rocketret',
          DayStr: $libDate.SelectTimeToIndia(this.searchForm.dayStr) / 1000
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || []
          $this.retData = response.Data

          $this.showData.Rate100 = $this.retData.Rate100 * 100 / $this.retData.Total
          $this.showData.Rate101 = $this.retData.Rate101 * 100 / $this.retData.Total
          $this.showData.Rate110 = $this.retData.Rate110 * 100 / $this.retData.Total
          $this.showData.Rate120 = $this.retData.Rate120 * 100 / $this.retData.Total
          $this.showData.RateLess110 = $this.retData.RateLess110 * 100 / $this.retData.Total
          $this.showData.RateLess120 = $this.retData.RateLess120 * 100 / $this.retData.Total

          this.showRet.totalNum = data.Total
          this.showRet.lessThanOnePointTwo = data.LessThanOnePointTwo
          this.showRet.lessThanTwo = data.Total - data.LessThanOnePointTwo - data.LessThanThree - data.MoreThanThree - data.MoreThanEight
          this.showRet.lessThanThree = data.LessThanThree
          this.showRet.moreThanThree = data.MoreThanThree
          this.showRet.moreThanEight = data.MoreThanEight

          if (data.Total > 0) {
            this.showRet.lessThanOnePointTwoRate = ((this.showRet.lessThanOnePointTwo * 100) / data.Total).toFixed(2)
            this.showRet.lessThanTwoRate = ((this.showRet.lessThanTwo * 100) / data.Total).toFixed(2)
            this.showRet.lessThanThreeRate = ((this.showRet.lessThanThree * 100) / data.Total).toFixed(2)
            this.showRet.moreThanThreeRate = ((this.showRet.moreThanThree * 100) / data.Total).toFixed(2)
            this.showRet.moreThanEightRate = ((this.showRet.moreThanEight * 100) / data.Total).toFixed(2)
          }
          this.showData.Rate100STD = data.ck_100_rate.toFixed(2)
          this.showData.Rate101STD = data.ck_101_rate.toFixed(2)
          this.showData.Rate110STD = data.ck_110_rate.toFixed(2)
          this.showData.Rate120STD = data.ck_120_rate.toFixed(2)
          this.showData.RateLess110STD = data.ck_less_110_rate.toFixed(2)
          this.showData.RateLess120STD = data.ck_less_120_rate.toFixed(2)
          this.showData.Less200STD = data.ck_less_200_rate.toFixed(2)
          this.showData.Less300STD = data.ck_less_300_rate.toFixed(2)
          this.showData.Less800STD = data.ck_less_800_rate.toFixed(2)
          this.showData.MoreThan800STD = data.ck_more_800_rate.toFixed(2)

          this.showRet.showDay = $libDate.FormateMilisecondStr($libDate.SelectTimeToIndia(this.searchForm.dayStr), 1)
          this.bigBetPool = data.big_pool / 1000
        }
      })
    },
    showControl() {
      this.controlForm.visible = true
    },
    control() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/game/rocketbet',
          Uid: this.controlForm.uid,
          Bet: this.controlForm.bet,
          Score: this.controlForm.score * 1000
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    refrashPool() {
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/vupmonitor/rocketret',
          DayStr: $libDate.SelectTimeToIndia(this.searchForm.dayStr) / 1000
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || []
          this.bigBetPool = data.big_pool / 1000
        }
      })
    },
    operatePool() {
      this.operateForm.visible = true
    },
    operate() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/vupmonitor/rocket/big/pool',
          Pool: this.operateForm.change * 1000
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.bigBetPool = response.Data / 1000
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this.operateForm.visible = false
        } else {
          this.$message.error('操作失败')
        }
      })
    }
  }
}
</script>

<style scoped>
    .formTable{
        border-collapse: collapse;
        width: 100%;
        text-align: center;
        margin-bottom: 10px;
    }
    .formTable td{
        border: 1px solid #eee;
        height: 31px;
        line-height: 31px;
        padding: 2px;
    }
</style>
