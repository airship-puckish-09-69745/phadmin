<template>
  <div class="slots_free_trigger_plans">
    <el-row>
      <el-col :span="12" :offset="3">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="进入免费方案配置" name="script">
            <el-button type="primary" @click="showDialog">今日已玩牌局数配置</el-button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-tooltip content="1.需要首行标题;2.导入覆盖" effect="dark" placement="top">
              <input type="file" accept=".xlsx, .xls" size="small" @change="handleFileUpload">
            </el-tooltip>
            <span style="margin-left:10px;color:#909399"></span>

            <el-table :data="cfg.ScatterTriggerPlans">
              <el-table-column prop="bet" label="今日已玩牌次数范围" width="240">
                <template slot-scope="scope">
                  <el-button type="text" @click="editConfig(scope.row)">
                    {{ scope.row.PlayTimesMin }}
                    至
                    {{ scope.row.PlayTimesMax }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column prop="bet" label="今日已进入免费次数" width="240">
                <template slot-scope="scope">
                  {{ scope.row.FreeTimesCompareOperator === 1 ? '小于等于' : '大于等于' }}
                  {{ scope.row.FreeTimesCompareValue }}
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
        <el-form-item label="今日已玩牌局数配置">
          <template #label>
            <span>
              今日已玩牌局数配置
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
          <template #label>
            <span>
              今日已玩牌局数配置
              <el-tooltip
                content="小于等于被标识为1,大于等于被标识为2"
                placement="top"
                effect="light">
                <i class="el-icon-question" style="margin-left: 5px; color: #909399;"></i>
              </el-tooltip>
            </span>
          </template>
          <div style="display: flex; gap: 30px;">
            <el-select v-model="ScatterTriggerPlans.FreeTimesCompareOperator" placeholder="请选择活动区域">
              <el-option label="小于等于" :value="1"></el-option>
              <el-option label="大于等于" :value="2"></el-option>
            </el-select>
            <el-input
              v-model.number="ScatterTriggerPlans.FreeTimesCompareValue"
              placeholder="请输入内容"
              class="input-with-select"
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
        <el-button type="success" @click="submitFrm(false)">保存</el-button>
        <el-button v-if="version === 'V2'" type="success" @click="submitFrm(true)">多APP保存</el-button>
      </el-col>
    </el-row>
    <!--对比组件-->
    <compare ref="compare"/>
  </div>
</template>

<script>
import {Message} from 'element-ui';
import Compare from '@/components/Compare/index.vue';
import XLSX from 'xlsx'
import store from "@/store";

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
      default: function () {
        return {}
      }
    },
    scatterTriggerPlans: {
      type: Array,
      default: function () {
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
      },
      edit: {
        fileList: []
      },
      version: store.getters.version || 'V1',
      oldData: {}
    }
  },
  created() {
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      // eslint-disable-next-line no-empty
      if (file !== undefined) {
        this.removeAllConfig()
        this.resetScatterTriggerPlans()
      }
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, {type: 'array'});
          const sheetNames = workbook.SheetNames;
          sheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, {header: 1});
            this.resetScatterTriggerPlans()
            json.forEach((row, index) => {
              if (index > 0) {
                this.ScatterTriggerPlans.PlayTimesMin = json[1][0]
                this.ScatterTriggerPlans.PlayTimesMax = json[1][1]
                this.ScatterTriggerPlans.FreeTimesCompareOperator = json[1][2]
                this.ScatterTriggerPlans.FreeTimesCompareValue = json[1][3]
                this.ScatterTriggerPlans.currentConf.push({OddsMin: row[4], OddsMax: row[5], Rates: row[6]})
              }
            })
            this.ScatterTriggerPlans.editIndex = undefined//
            this.saveConfig()
          })
        }
        reader.readAsArrayBuffer(file)
        this.$forceUpdate()
      }
    },
    resetScatterTriggerPlans() {
      this.ScatterTriggerPlans.PlayTimesMin = 0
      this.ScatterTriggerPlans.PlayTimesMax = 0
      this.ScatterTriggerPlans.FreeTimesCompareOperator = 0
      this.ScatterTriggerPlans.FreeTimesCompareValue = 0
      this.ScatterTriggerPlans.currentConf = []
    },
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
    submitFrm(isMultiApp = false) {
      const multiAppMode = isMultiApp === true
      const $this = this
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function (isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }

        if (!multiAppMode) {
          $this.$emit('saveData')
        } else {
          $this.$emit('multiAppSave', $this.oldData, $this.slotsData)
        }
        $this.lock = false
      })
    },
    addConfigRow() {
      this.ScatterTriggerPlans.currentConf.push({OddsMin: 0, OddsMax: 0, Rates: 0})
    },
    removeConfigRow(index) {
      this.ScatterTriggerPlans.currentConf.splice(index, 1)
    },
    removeAllConfig() {
      this.cfg.ScatterTriggerPlans = []
    },
    removeConfig(index) {
      this.cfg.ScatterTriggerPlans.splice(index, 1)
    },
    checkConfig() {
      if (this.ScatterTriggerPlans.PlayTimesMax < 0 ||
        this.ScatterTriggerPlans.PlayTimesMin < 0 ||
        this.ScatterTriggerPlans.FreeTimesCompareOperator < 0 ||
        // eslint-disable-next-line no-empty
        this.ScatterTriggerPlans.FreeTimesCompareValue < 0) {
        Message.error(`数值不能小于0,请检查`)
        return false
      }

      // 最小局数与最大局数的校验
      // eslint-disable-next-line no-self-compare
      if (this.ScatterTriggerPlans.PlayTimesMax < this.ScatterTriggerPlans.PlayTimesMin) {
        Message.error(`最小局数不能大于最大局数,请检查`)
        return false
      }
      if (this.ScatterTriggerPlans.PlayTimesMin === 0 && this.ScatterTriggerPlans.PlayTimesMax === 0) {
        Message.error('最小局数与最大局数不能都设置为0,请检查')
        return false
      }
      if (this.ScatterTriggerPlans.FreeTimesCompareOperator !== 1 && this.ScatterTriggerPlans.FreeTimesCompareOperator !== 2) {
        Message.error('大于小于输入错误,请检查')
        return false
      }
      // eslint-disable-next-line no-undef
      let isNumError = false
      let isNumNeg = false
      let isRatesGte100 = false
      this.ScatterTriggerPlans.currentConf.forEach((item) => {
        if (item.OddsMin > item.OddsMax) {
          isNumError = true
        }
        if (item.OddsMin < 0 || item.Rates < 0 || item.OddsMax < 0) {
          isNumNeg = true
        }
        if (item.Rates > 100) {
          isRatesGte100 = true
        }
      })
      if (isNumNeg) {
        Message.error('配置的数值小于0')
        return false
      }
      if (isRatesGte100) {
        Message.error('触发scatter的概率大于100')
        return false
      }
      if (isNumError) {
        Message.error('最小倍数不能大于最大倍数,请检查')
        return false
      }
      return true
    },
    saveConfig() {
      if (!this.cfg.ScatterTriggerPlans) {
        this.cfg.ScatterTriggerPlans = []
      }

      // 校验
      if (!this.checkConfig()) {
        return
      }
      if (this.ScatterTriggerPlans.editIndex >= 0) { // 编辑模式的保存
        this.$set(this.cfg.ScatterTriggerPlans, this.ScatterTriggerPlans.editIndex, {
          PlayTimesMin: this.ScatterTriggerPlans.PlayTimesMin,
          PlayTimesMax: this.ScatterTriggerPlans.PlayTimesMax,
          FreeTimesCompareOperator: this.ScatterTriggerPlans.FreeTimesCompareOperator,
          FreeTimesCompareValue: this.ScatterTriggerPlans.FreeTimesCompareValue,
          Ranges: this.ScatterTriggerPlans.currentConf
        })
      } else { // 新增模式的保存
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
        this.oldData = this.getDiffData()
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
    }
  }
}
</script>

<style scoped>
.slots_free_trigger_plans {
  margin-top: 60px;
}
</style>
