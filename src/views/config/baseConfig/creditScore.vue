<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="5" style="margin-top: 30px">
      <el-form ref="item" :model="item" label-width="200px">
        <el-col :span="16" :offset="3">
          <el-button type="primary" size="mini" @click="statDialog=true">查看获取统计信息</el-button>
          <fieldset style="margin-top:10px">
            <legend>信誉用户参考值</legend>
            <el-input placeholder="请输入内容" v-model.number="item.value">
              <template slot="prepend">信誉用户达标信誉分值：</template>
            </el-input>
            <el-input v-if="false" placeholder="请输入内容" v-model.number="item.updateDelta">
              <template slot="prepend">信誉分刷新时刻：</template>
              <template slot="append">
                <el-time-select
                  size="mini"
                  @change="printChange"
                  v-model="item.updateDelta"
                  :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '20:30'
                  }"
                  placeholder="选择时间">
                </el-time-select>
              </template>
            </el-input>
          </fieldset>
          <fieldset style="margin-top:10px">
            <legend>封顶配置</legend>
            <el-row>
              <el-table
                ref="filterTable"
                :data="item.limitConf"
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column prop="name" label="">
                </el-table-column>
                <el-table-column prop="dayTop" label="每日封顶值">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.dayTop" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column prop="valTop" label="单项封顶值">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.valTop" size="mini" />
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </fieldset>

          <fieldset style="margin-top:10px">
            <legend>场次系数配置</legend>
            <el-descriptions class="margin-top" border>
              <el-descriptions-item>
                <!--                <span style="color:red;"> 说明: 1.倍率不支持小数填写real*100或者real*10 [*10就是只支持1位小数 *100只支持两位小数]，例如*100时期望是2.06 填写206 </span>-->
              </el-descriptions-item>
            </el-descriptions>
            <el-row>
              <el-table
                ref="filterTable"
                :data="item.glconf"
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
                height="600"
              >
                <el-table-column
                  type="index"
                />
                <el-table-column
                  prop="gid"
                  label="游戏"
                >
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.gid" @change="onChange">
                      <el-option v-for="opt in item.GameOptions" :key="opt.gid" :label="opt.name" :value="opt.gid" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="blind"
                  label="盲注"
                >
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.blind" @change="onChange">
                      <el-option v-for="opt in item.BlindOptions" :key="opt.val" :label="opt.name" :value="opt.val" />
                    </el-select>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="radio"
                  label="有效下注换算系数"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.radio" />
                  </template>
                </el-table-column>

                <el-table-column
                  prop="score"
                  label="局数分"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.score" />
                  </template>
                </el-table-column>

                <el-table-column
                  label="操作"
                >
                  <template slot-scope="scope">
                    <el-button type="danger" @click="delRow(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <el-row>
              <el-button type="primary" @click="addRow()">添加</el-button>
            </el-row>
          </fieldset>
        </el-col>

        <el-col style="margin-top:16px;" :offset="8" :span="8">
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <!-- 【dialog】数据统计 -->
    <el-dialog
      title="好友列表"
      :visible.sync="statDialog"
      width="60%"
    >
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-date-picker
          v-model="daterange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-form-item>
          <el-button type="primary" @click="getStat">查询</el-button>
        </el-form-item>
      </el-form>
      <span>
        <el-table
          ref="filterTable"
          :data="stat"
          stripe
          border
          :header-cell-style="libShow.DefaultTableHeadClass"
          :row-style="{height:'10px'}"
          :cell-style="libShow.DefaultTableCell"
          style="width: 100%"
        >
          <el-table-column
            prop="date"
            label="日期"
            sortable
            width="120"
          />
          <el-table-column
            prop="userCount"
            label="历史总用户数量"
            sortable
          />
          <el-table-column
            prop="kycCount"
            label="已KYC验证用户数量"
          />
          <el-table-column
            prop="creditCount"
            label="信誉分达标用户数量"
          />
          <el-table-column
            prop="gid21"
            label="Pusoy黑名单用户数量"
          />
          <el-table-column
            prop="gid113"
            label="PusoySwap黑名单用户数量"
          />
          <el-table-column
            prop="gid22"
            label="Tongits黑名单用户数量"
          />
          <el-table-column
            prop="gid28"
            label="TongitsLaizi黑名单用户数量"
          />
          <el-table-column
            prop="gid29"
            label="TongitsQuick黑名单用户数量"
          />
        </el-table>
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
import { $libDate,$libShow, DataRule, ValidateVueItem } from '@/utils/common'
import BetAmount from '@/components/BetAmount'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, BetAmount },
  data() {
    return {
      daterange: [
        $libDate.GetDayBegin(new Date().getTime()-86400*8*1000),
        $libDate.GetDayBegin(new Date().getTime()-86400*1*1000)
      ],
      statDialog: false,
      item: {
        updateDelta: 86400,
        value: 20000,
        limitConf: [
          { name: '有效流水分', dayTop: 1000000, valTop: 5000000 },
          { name: '玩牌局数分', dayTop: 1000000, valTop: 5000000 },
          { name: 'GGR贡献分', dayTop: 500000, valTop: 0 }
        ],
        GameOptions: [
          { name: 'Pusoy', gid: 21},
          { name: 'Pusoy Swap', gid: 113},
          { name: 'Tongits', gid: 22},
          { name: 'Tongits Laizi', gid: 28},
          { name: 'Tongits Quick', gid: 29}
        ],
        BlindOptions: [
          { name: '1分', val: 1000},
          { name: '5分', val: 5000},
          { name: '10分', val: 10000},
          { name: '20分', val: 20000},
          { name: '50分', val: 50000},
          { name: '100分', val: 100000},
          { name: '200分', val: 200000},
          { name: '500分', val: 500000},
        ],
        glconf: [
          { blind: 1000, gid: 21, radio: 1, score: 1 },
          { blind: 2000, gid: 21, radio: 1, score: 1 },
          { blind: 3000, gid: 21, radio: 1, score: 1 },
          { blind: 2000, gid: 22, radio: 1, score: 1 },
          { blind: 2000, gid: 22, radio: 1, score: 1 },
          { blind: 2000, gid: 22, radio: 1, score: 1 },
          { blind: 2000, gid: 28, radio: 1, score: 1 },
          { blind: 2000, gid: 28, radio: 1, score: 1 },
          { blind: 2000, gid: 28, radio: 1, score: 1 },
          { blind: 2000, gid: 28, radio: 1, score: 1 }
        ],
      },
      isHidden: true, // 默认隐藏
      testCards: '',
      form: {},
      stat: [],
      BetOddsList: [],
      subKey: 'credit_score_cfg',
      libShow: $libShow,
      showSetResultPage: false,
      resultForm: {
        one: 0,
        two: 0,
        three: 0
      },
      envProjectname: process.env.VUE_APP_PROJECT
    }
  },
  watch: {
    // 监听json数据变化，重新渲染文件夹内容
    BetOddsList(newVal) {
      this.file_is_show = false
      if (true) {
        this.$nextTick(() => { // $nextTick 是在 DOM 更新循环结束之后执行延迟回调
          this.file_is_show = true
        })
      }
    }
  },
  created() {
    console.log(process.env.VUE_APP_PROJECT_name)
    if (process.env.VUE_APP_PROJECT_name == '菲1-开发环境' || process.env.VUE_APP_PROJECT_name == '菲1-线上环境' || process.env.VUE_APP_PROJECT_name == 'Zoo-线上环境') {
      this.isHidden = false
    }
    this.getData()
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getData() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const item = JSON.parse(response.Data.Data)
            Object.assign(this.item, item)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
            console.log("xxxxxx")
            this.item.value /= 1000
            for (const v of this.item.limitConf) {
              v.dayTop /= 1000
              v.valTop /= 1000
            }
            for (const v of this.item.glconf) {
              v.radio /= 100
            }
          }
        }
      })
    },
    getStat() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/credit/stat',
          From: this.daterange[0]/1000,
          To: this.daterange[1]/1000,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log(response.Data)
          this.stat = response.Data || {}
          if (response.Data !== '') {
            this.stat = response.Data
          }
        }
      })
    },
    onChange(value) {
      
    },
    change(event) {
      this.$forceUpdate()
    },
    setData() {
      if (!ValidateVueItem(this.$refs['item'])) return false
      const limits =this.item.limitConf
      let glconf = []
      for (const v of this.item.glconf) {
        let item = Object.assign({},v)
        item.radio *= 100
        glconf.push(item)
      }

      this.form.Data = JSON.stringify({
        value: this.item.value*1000,
        glconf: glconf,
        flowLimit: {dayTop:limits[0].dayTop*1000, valTop:limits[0].valTop*1000},
        playLimit: {dayTop:limits[1].dayTop*1000, valTop:limits[1].valTop*1000},
        ggrLimit: {dayTop:limits[2].dayTop*1000, valTop:limits[2].valTop*1000},
        updateDelta: this.item.updateDelta,
      })

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
    addRow() {
      this.item.glconf.push({ blind: 2000, gid: 28, radio: 1, score: 1 })
    },
    delRow(index) {
      this.item.glconf.splice(index, 1)
    },
    printChange() {
      console.log(this.item.updateDelta, typeof this.item.updateDelta)
    }
  }
}
</script>
