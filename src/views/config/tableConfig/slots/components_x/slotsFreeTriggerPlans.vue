<template>
  <div>
    <el-row>
      <el-col :span="12" :offset="3">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="进入免费方案配置" name="script">
            <el-button type="primary" @click="showDialog">局数配置</el-button>
            <span style="margin-left:10px;color:#909399"></span>

            <el-table :data="cfg.ScatterTriggerPlans">
              <el-table-column prop="bet" label="局数" width="120">
                <template slot-scope="scope">
                  <el-button type="text" @click="editConfig(scope.row)">
                    {{ scope.row.PlayTimesMin }}
                    至
                    {{ scope.row.PlayTimesMax }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" header-align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click="editConfig(scope.row)">编辑</el-button>
                  <el-button type="danger" @click="removeConfig(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-dialog
      :title="ScatterTriggerPlans.dialogTitle"
      :visible.sync="ScatterTriggerPlans.dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
    >
      <el-form label-width="180px">
        <el-form-item label="局数配置">
          <template #label>
            <span>
              局数配置
              <el-tooltip
                content="设置最小和最大旋转次数范围;前面一栏设置最小旋转次数,后面一栏设置最大旋转次数"
                placement="top"
                effect="light">
                <i class="el-icon-question" style="margin-left: 5px; color: #909399;"></i>
              </el-tooltip>
            </span>
          </template>
          <div style="display: flex; gap: 30px;">
            <el-input
              v-model.number="ScatterTriggerPlans.PlayTimesMin"
              placeholder="请输入最小旋转次数"
              maxlength="10"
              style="width: 200px;">
            </el-input>
            <el-input
              v-model.number="ScatterTriggerPlans.PlayTimesMax"
              placeholder="请输入最大旋转次数"
              maxlength="10"
              style="width: 200px;">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="免费旋转触发次数">
          <div style="display: flex; gap: 30px;">
            <el-select v-model="ScatterTriggerPlans.FreeTimesCompareOperator" placeholder="请选择活动区域">
              <el-option label="小于等于" :value="1"></el-option>
              <el-option label="大于等于" :value="2"></el-option>
            </el-select>
            <el-input v-model="ScatterTriggerPlans.FreeTimesCompareValue" placeholder="请输入内容" class="input-with-select"
                      style="width: 200px"/>
          </div>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="addConfigRow">添加</el-button>
      <el-table :data="ScatterTriggerPlans.currentConf">
        <el-table-column prop="OddsMin" label="最小倍数" width="120">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.OddsMin" :required="true" placeholder="请输入内容,如10"/>
          </template>
        </el-table-column>
        <el-table-column prop="OddsMax" label="最大倍数" width="120">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.OddsMax" :required="true" placeholder="请输入内容,如10"/>
          </template>
        </el-table-column>
        <el-table-column prop="WeightStr" label="触发scatter的概率(百分比)">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Rates" :required="true" placeholder="请输入内容,如4"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="danger" @click="removeConfigRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="ScatterTriggerPlans.dialogVisible = false">取消</el-button>
        <el-button type="primary" size="medium" @click="saveConfig">保存</el-button>
      </span>
    </el-dialog>

    <el-row style="margin-top: 30px">
      <el-col :offset="3">
        <el-button type="success" @click="submitFrm">保存</el-button>
      </el-col>
    </el-row>
    <!--对比组件-->
    <compare ref="compare"/>
  </div>
</template>

<script>
import {Message} from 'element-ui';
import Compare from '@/components/Compare/index.vue';

export default {
  name: 'SlotsFreeTriggerPlans',
  components: {Compare},
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
    },
    scatterTriggerPlans: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      cfg: {},
      activeTab: 'script',
      ScatterTriggerPlans: {
        PlayTimesMin: 0,
        PlayTimesMax: 0,
        FreeTimesCompareOperator: 1,
        FreeTimesCompareValue: 1,
        dialogTitle: '局数配置',
        dialogVisible: false,
        currentConf: []
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    showDialog() {
      this.ScatterTriggerPlans.dialogTitle = '添加配置'
      this.ScatterTriggerPlans.PlayTimesMin = 0
      this.ScatterTriggerPlans.PlayTimesMax = 0
      this.ScatterTriggerPlans.currentConf = [{OddsMin: 0, OddsMax: 0, Rates: 0}]
      this.ScatterTriggerPlans.editIndex = -1
      this.ScatterTriggerPlans.dialogVisible = true
    },
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    editConfig(row) {
      this.ScatterTriggerPlans.PlayTimesMin = row.PlayTimesMin
      this.ScatterTriggerPlans.PlayTimesMax = row.PlayTimesMax
      this.ScatterTriggerPlans.FreeTimesCompareOperator = row.FreeTimesCompareOperator
      this.ScatterTriggerPlans.FreeTimesCompareValue = row.FreeTimesCompareValue
      this.ScatterTriggerPlans.dialogTitle = '编辑配置'
      this.ScatterTriggerPlans.currentConf = JSON.parse(JSON.stringify(row.Ranges))
      // eslint-disable-next-line no-self-compare
      this.ScatterTriggerPlans.editIndex = this.cfg.ScatterTriggerPlans.findIndex(item => item.PlayTimesMin === row.PlayTimesMin && item.PlayTimesMax === item.PlayTimesMax)
      this.ScatterTriggerPlans.dialogVisible = true
    },
    submitFrm() {
      const $this = this
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
    addConfigRow() {
      this.ScatterTriggerPlans.currentConf.push({OddsMin: 0, OddsMax: 0, Rates: 0})
    },
    removeConfigRow(index) {
      this.ScatterTriggerPlans.currentConf.splice(index, 1)
    },
    removeConfig(index) {
      this.cfg.ScatterTriggerPlans.splice(index, 1)
    },
    saveConfig() {
      if (!this.cfg.ScatterTriggerPlans) {
        this.cfg.ScatterTriggerPlans = []
      }

      // 最小局数与最大局数的校验
      // eslint-disable-next-line no-self-compare
      if (this.ScatterTriggerPlans.PlayTimesMax < this.ScatterTriggerPlans.PlayTimesMin) {
        Message.error(`最小局数不能大于最大局数`)
        return
      }
      if (this.ScatterTriggerPlans.PlayTimesMin === 0 && this.ScatterTriggerPlans.PlayTimesMax === 0) {
        Message.error('最小局数与最大局数不能都设置为0')
        return
      }

      // eslint-disable-next-line no-undef
      let isNumError = false
      this.ScatterTriggerPlans.currentConf.forEach((item) => {
        if (item.OddsMin > item.OddsMax) {
          isNumError = true
        }
      })
      if (isNumError) {
        Message.error('最小倍数不能大于最大倍数')
        return
      }
      if (this.ScatterTriggerPlans.editIndex >= 0) {
        this.$set(this.cfg.ScatterTriggerPlans, this.ScatterTriggerPlans.editIndex, {
          PlayTimesMin: this.ScatterTriggerPlans.PlayTimesMin,
          PlayTimesMax: this.ScatterTriggerPlans.PlayTimesMax,
          FreeTimesCompareOperator: this.ScatterTriggerPlans.FreeTimesCompareOperator,
          FreeTimesCompareValue: this.ScatterTriggerPlans.FreeTimesCompareValue,
          Ranges: this.ScatterTriggerPlans.currentConf
        })
      } else {
        this.cfg.ScatterTriggerPlans.push({
          PlayTimesMin: this.ScatterTriggerPlans.PlayTimesMin,
          PlayTimesMax: this.ScatterTriggerPlans.PlayTimesMax,
          FreeTimesCompareOperator: this.ScatterTriggerPlans.FreeTimesCompareOperator,
          FreeTimesCompareValue: this.ScatterTriggerPlans.FreeTimesCompareValue,
          Ranges: this.ScatterTriggerPlans.currentConf
        })
      }
      this.ScatterTriggerPlans.dialogVisible = false
    },
    initData() {
      // this.initSymbolMap()
      if (this.slotsData) {
        this.cfg = this.slotsData
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    }
  }
}
</script>

<style scoped>

</style>
