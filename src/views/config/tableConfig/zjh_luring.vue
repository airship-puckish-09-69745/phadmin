<template>
  <div class="app-container">
    <h2 style="text-align: center;">[正常] 钓鱼牌局配置</h2>
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 50px">
      <el-col :span="12" :offset="4">
        <el-form ref="form" :model="item" label-width="300px">
          <el-form-item label="功能开关">
            <el-switch
              v-model="item.Enabled"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>

          <el-form-item label="AppID白名单:">
            <el-input v-model="item.AppStr" type="textarea" :rows="5" placeholder="多个应用英文逗号（,）隔开" />
          </el-form-item>

          <money-input v-model="item.MinPayAmount" label="充值金额 &gt;="></money-input>

          <money-input v-model="item.MaxPayAmount" label="充值金额 &lt;"></money-input>

          <el-form-item label="(用户资产 / 最大底池) &lt;">
            <el-input v-model.number="item.MaxMoneyRate" placeholder="单位百分比" style="width:200px;"><template slot="append">%</template></el-input>
          </el-form-item>

          <el-form-item label="触发概率:">
            <el-input v-model.number="item.OccurOdds" placeholder="单位万分比" style="width:200px;"><template slot="append">‱</template></el-input>
          </el-form-item>

          <el-form-item label="最多触发次数:">
            <el-input v-model.number="item.MaxOccurTimes" placeholder="最多触发次数" style="width:200px;"></el-input>
          </el-form-item>

          <el-form-item label="两次触发时间间隔:">
            <el-input v-model.number="item.OccurDelay" placeholder="单位秒" style="width:200px;"><template slot="append">秒</template></el-input>
          </el-form-item>

          <el-form-item label="赢钱转入winnings比例:">
            <el-input v-model.number="item.WinningsTransferRate" placeholder="placeholder" style="width:200px;"><template slot="append">%</template></el-input>
          </el-form-item>

          <el-form-item label="真实玩家分配的最小三条:">
            <el-select v-model.number="item.MinTripleCard4User" placeholder="placeholder" style="width:200px;">
              <el-option
                v-for="item in Card4UserOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="A组机器人分配到三条的概率:">
            <el-input v-model.number="item.TripleRate4RobotsA" placeholder="placeholder" style="width:200px;"><template slot="append">%</template></el-input>
          </el-form-item>

          <el-form-item label="A组机器人分配到的最小同花顺:">
            <el-select v-model.number="item.MinStraightFlush4FRobotsA" placeholder="placeholder" style="width:200px;">
              <el-option
                v-for="item in Flush4FOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="B组机器人分配到对子的概率:">
            <el-input v-model.number="item.PairRate4RobotsB" placeholder="placeholder" style="width:200px;"><template slot="append">%</template></el-input>
          </el-form-item>

          <el-form-item label="连续几局未付费调整机器人逻辑: &gt;=">
            <el-input v-model.number="item.FailedTimes4Warning" placeholder="placeholder" style="width:200px;"><template slot="append">局</template></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-form>

        <p>提示：A组机器人最多2人，手牌为三条和同花顺；其它机器人为B组，手牌为对子和高牌。</p>
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
import MoneyInput from '@/components/MoneyInput'
import request from '@/utils/request'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput },
  data() {
    return {
      item: {
        'Enabled': true, // 是否启用
        'Apps': [1, 2], // 应用ID白名单列表
        'MinPayAmount': 100000, //充值金额下限
        'MaxPayAmount': 1000000, // 充值金额上限
        'MaxMoneyRate': 15, // 资产与场次最大底池比例上限(单位百分之一)
        'MaxOccurTimes': 10, // 触发次数上限
        'OccurOdds': 1000, // 触发概率(单位万分之一)
        'OccurDelay': 1800, //两次触发之间的间隔时间(秒)
        'WinningsTransferRate': 20, // 赢钱转winnings比例(单位百分之一)
        'MinTripleCard4User': 13, // 真实玩家分配的最小三条
        'TripleRate4RobotsA': 50, // A组机器人分配到三条的概率(单位百分之一)
        'MinStraightFlush4FRobotsA': 10, // A组机器人分配到的最小同花顺
        'PairRate4RobotsB': 50, // B组机器人分配到对子的概率(单位百分之一)
        'FailedTimes4Warning': 2 // 连续未付费几局需要特殊处理
      },
      Card4UserOptions: [
        { label: 'A, A, A', value: 14 },
        { label: 'K, K, K', value: 13 },
        { label: 'Q, Q, Q', value: 12 },
        { label: 'J, J, J', value: 11 },
        { label: '10, 10, 10', value: 10 },
        { label: '9, 9, 9', value: 9 },
        { label: '8, 8, 8', value: 8 },
        { label: '7, 7, 7', value: 7 },
        { label: '6, 6, 6', value: 6 },
        { label: '5, 5, 5', value: 5 },
        { label: '4, 4, 4', value: 4 },
        { label: '3, 3, 3', value: 3 },
        { label: '2, 2, 2', value: 2 }
      ],
      Flush4FOptions: [
        { label: 'A, K, Q', value: 1 },
        { label: 'K, Q, J', value: 13 },
        { label: 'Q, J, 10', value: 12 },
        { label: 'J, 10, 9', value: 11 },
        { label: '10, 9, 8', value: 10 },
        { label: '9, 8, 7', value: 9 },
        { label: '8, 7, 6', value: 8 },
        { label: '7, 6, 5', value: 7 },
        { label: '6, 5, 4', value: 6 },
        { label: '5, 4, 3', value: 5 },
        { label: '4, 3, 2', value: 4 },
        { label: '3, 2, A', value: 3 }
      ],
      form: {
      },
      txt: '',
      subKey: 'zjh_luring_game_cfg'
    }
  },
  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    decodeApps() {
      if (this.item.Apps && this.item.Apps.length > 0) {
        this.item.AppStr = this.item.Apps.join(',')
      } else {
        this.item.AppStr = ''
      }
    },
    encodeApps() {
      this.item.Apps = []
      if (this.item.AppStr) {
        const apps = this.item.AppStr.split(',')
        for (const i in apps) {
          this.item.Apps.push(parseInt(apps[i]))
        }
      }
    },
    getData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const data = JSON.parse(response.Data.Data)
            $this.item = data
            $this.decodeApps()
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(data)
          }
        }
      })
    },
    setData() {
      this.encodeApps()
      this.form.Data = JSON.stringify(this.item)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
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
