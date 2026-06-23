<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :span="18" :offset="3">
        <p>额外赔付图标</p>
        <el-form ref="frm1" :inline="true" label-width="80px">
          <el-table
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              label=""
              width="100"
            />
<!--            <el-table-column-->
<!--              prop="value"-->
<!--              label=""-->
<!--              width="200"-->
<!--            />-->
              <el-table-column
                prop="value"
                width="100"
              >
                <template slot-scope="scope">
                <el-input v-model.number="scope.row.value" disabled />
                </template>
              </el-table-column>

          </el-table>
        </el-form>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px">
      <el-col :offset="3">
        <el-button type="success" @click="submitFrm(false)">保存</el-button>
        <el-button v-if="version === 'V2'" type="success" @click="submitFrm(true)">多APP保存</el-button>
      </el-col>
    </el-row>
    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import {number} from "echarts/lib/export";
import store from '@/store'

export default {
  name: 'SlotsPayTableExt',
  components: { Compare },
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
    SymbolList: {
      type: Array,
      default: function() {
        return []
      }
    },
    labelMap: {
      type: Object,
      default: function() {
        return {}
      }
    },
    startCol: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      cols: [1],
      tableData: [
      ],
      symbolMap: {},
      lock: false,
      version: store.getters.version || 'V1',
      oldData: JSON.parse(JSON.stringify(this.slotsData))
    }
  },
  watch: {
    'slotsData': {
      deep: true,
      handler: function(val) {
        this.initData()
      }
    }
  },
  updated() {
    if (this.lock === false) {
      this.$refs.compare.SetOldVal(this.getDiffData())
      this.lock = true
    }
  },

  created() {
    this.initData()
  },
  methods: {
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm(isMultiApp = false) {
      const multiAppMode = isMultiApp === true
      this.setData()

      const $this = this
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function(isEdit) {
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
    getKey(col) {
      return col
    },
    getLabel(col) {
      return col + '种'
    },
    initSymbolMap() {
      // console.log('symbol list', this.SymbolList)
      this.symbolMap = {}
      for (const i in this.SymbolList) {
        const value = this.SymbolList[i]['Value']
        this.symbolMap[value] = this.SymbolList[i]['Name']
      }
    },
    initData() {
      if (!this.slotsData || !this.slotsData.PayLineExt) {
        return
      }
      this.cols = []
      for (let c = this.startCol; c <= this.slotsData.Clos; c++) {
        this.cols.push(c)
      }
      this.initSymbolMap()

      this.tableData = []
      for (const i in this.slotsData.PayLineExt) {
        const value = this.slotsData.PayLineExt[i]['Rate']
        let name = ''
        const str = this.slotsData.PayLineExt[i]['Symbol']

        const arr = str.split(',')
        if (arr.length > 0) {
          for (let y = 0; y < arr.length; y++) {
            name += this.SymbolList[arr[y]-1].Name + ','
          }
        }
        if (!name) {
          continue
        }

        const row = {
          name: name,
          value: value,
          key: i
        }
        this.tableData.push(row)
      }

      // console.log('pay table init data ', this.tableData)
    },
    setData() {
      const data = []
      for (const i in this.tableData) {
        const row = {
          SymbolValue: this.tableData[i]['value'],
          Rates: []
        }
        for (const x in this.cols) {
          const key = 'rate' + this.cols[x]
          row.Rates.push({
            SymbolNumber: this.cols[x],
            Rate: this.tableData[i][key]
          })
        }

        data.push(row)
      }

      // console.log('pay table get data', data)
      this.slotsData.PayTable = data
      // this.$message.success('当前页面保存成功')
    }
  }
}
</script>
