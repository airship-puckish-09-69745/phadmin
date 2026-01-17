<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form ref="frm2" :model="cfg" label-width="200px">

          <el-form-item label="免费模式购买倍数">
            <el-input v-model.number="cfg.BuyFreeOdds" placeholder="请输入内容" />
          </el-form-item>

          <el-form-item label="Bonus羽毛个数权重">
            <el-input v-model="cfg.BonusFeatherWeight" placeholder="请输入内容" ><template slot="append">分别对应1,2,3,4只羽毛</template> </el-input>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>


     <el-row>
      <el-col :span="12" :offset="3">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="Bonus配置" name="script">
            <el-button type="primary" @click="addBonusConfigRow(bonusCfg)">添加</el-button>
            <span style="margin-left:10px;color:#909399">(MINOR、MAJOR、GRAND的标识需要放到最后并从小到大排序)</span>
            <el-table :data="bonusCfg">
              <el-table-column prop="BonusSign" label="Bonus标识" width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.BonusSign" :required="true" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="MinOdds" label="Bonus倍数" width="240">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.BonusOdds" :required="true" placeholder="请输入内容,如10,100"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="WeightStr" label="倍数权重">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.BonusOddsWeight" :required="true" placeholder="请输入内容,如1,2,4">
                    <template slot="append">用 , 连接</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <el-button type="danger" @click="removeBonusConfigRow(bonusCfg, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>


    <el-row style="margin-top: 30px">
      <el-col :offset="3">
        <el-button type="success" @click="submitFrm">保存</el-button>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import RatioInput from '@/components/RatioInput'
import Compare from '@/components/Compare'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsPhoenixmarsExt',
  components: { RatioInput, Compare },
  model: {
    prop: 'slotsData',
    event: 'cc'
  },
  props: {
    slotsData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      cfg: {
      },
      activeTab: 'script',
      bonusCfg: [{ BonusSign: '', BonusOdds: '', BonusOddsWeight: '' }]
    }
  },
  created() {
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm() {
      const $this = this
      this.setBonusConfigRow()
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }

        $this.$emit('saveData')
        $this.lock = false
      })
    },
    hasHit(cols, col) {
      return cols.indexOf(col) >= 0
    },
    initData() {
      // this.initSymbolMap()
      if (this.slotsData) {
        this.cfg = this.slotsData
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
        this.initBonusConfigRow()
      }
    },
    initBonusConfigRow() {
      let bonus = { BonusSign: '', BonusOdds: [], BonusOddsWeight: [] }
      this.bonusCfg = []
      for (let i = 0; i < this.cfg.BonusCfg.length; i++) {
        if (bonus.BonusSign === '' || bonus.BonusSign === this.cfg.BonusCfg[i].BonusSign) {
          bonus.BonusSign = this.cfg.BonusCfg[i].BonusSign
          bonus.BonusOdds.push(this.cfg.BonusCfg[i].BonusOdds)
          bonus.BonusOddsWeight.push(this.cfg.BonusCfg[i].BonusOddsWeight)
        } else {
          this.bonusCfg.push({
            BonusSign: bonus.BonusSign,
            BonusOdds: bonus.BonusOdds.join(','),
            BonusOddsWeight: bonus.BonusOddsWeight.join(',')
          })
          bonus = { BonusSign: this.cfg.BonusCfg[i].BonusSign,
            BonusOdds: [this.cfg.BonusCfg[i].BonusOdds],
            BonusOddsWeight: [this.cfg.BonusCfg[i].BonusOddsWeight] }
        }
      }
      // 处理最后一条数据
      if (bonus.BonusSign !== '') {
        this.bonusCfg.push({
          BonusSign: bonus.BonusSign,
          BonusOdds: bonus.BonusOdds.join(','),
          BonusOddsWeight: bonus.BonusOddsWeight.join(',')
        })
      }
    },
     setBonusConfigRow() {
      this.cfg.BonusCfg = []
      for (let i = 0; i < this.bonusCfg.length; i++) {
        const bonusOdds = this.bonusCfg[i].BonusOdds.split(',')
        const bonusOddsWeight = this.bonusCfg[i].BonusOddsWeight.split(',')
        for (let j = 0; j < bonusOdds.length; j++) {
          this.cfg.BonusCfg.push({
            BonusSign: this.bonusCfg[i].BonusSign,
            BonusOdds: parseInt(bonusOdds[j]),
            BonusOddsWeight: parseInt(bonusOddsWeight[j])
          })
        }
      }
    },
    addBonusConfigRow(bonusCfg) {
      bonusCfg.push({
        BonusSign: '',
        BonusOdds: '',
        BonusOddsWeight: ''
      })
    },
    removeBonusConfigRow(bonusCfg, index) {
      // 弹窗确认是否删除
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        bonusCfg.splice(index, 1)
        console.log('removeConfigRow index', index)
      })
    }
  }
}
</script>
