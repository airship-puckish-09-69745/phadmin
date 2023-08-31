<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :span="18" :offset="3">
        <el-form ref="frm1" :inline="true" label-width="80px">
          <el-table
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              label="图标\数量"
              width="100"
            />
            <template v-for="col in cols">
              <el-table-column
                :prop="getKey(col)"
                :label="getLabel(col)"
                width="100"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row['rate' + col]" />
                </template>
              </el-table-column>
            </template>
          </el-table>
        </el-form>
      </el-col>
    </el-row>

    <el-row style="margin: 30px 0">
      <el-col :offset="3">
        <el-button type="success" @click="submitFrm">保存</el-button>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import Compare from '@/components/Compare'

export default {
  name: 'SlotsPayTable',
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
    }
  },
  data() {
    return {
      cols: [3, 4, 5, 6, 7, 8],
      tableData: [
      ],
      symbolMap: {},
      lock: false
    }
  },
  watch: {
    'slotsData.SymbolList': {
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
    submitFrm() {
      this.setData()

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
    getKey(col) {
      return 'rate' + col
    },
    getLabel(col) {
      if (col == this.cols[this.cols.length - 1]) {
        return col + '+'
      } else {
        return col + '个'
      }
    },
    initSymbolMap() {
      // console.log('symbol list', this.slotsData.SymbolList)
      this.symbolMap = {}
      for (const i in this.slotsData.SymbolList) {
        const value = this.slotsData.SymbolList[i]['Value']
        this.symbolMap[value] = this.slotsData.SymbolList[i]['Name']
      }
    },
    initData() {
      if (!this.slotsData || !this.slotsData.PayTable) {
        return
      }
      this.initSymbolMap()

      this.slotsData.PayTable.sort(function(a, b) {
        return a.SymbolValue - b.SymbolValue
      })

      this.tableData = []
      for (const i in this.slotsData.PayTable) {
        const value = this.slotsData.PayTable[i]['SymbolValue']
        const name = this.symbolMap[value]
        if (!name) {
          continue
        }

        const row = {
          name: name,
          value: value
        }

        for (const k in this.slotsData.PayTable[i]['Rates']) {
          if (this.cols.indexOf(this.slotsData.PayTable[i]['Rates'][k]['SymbolNumber']) >= 0) {
            const key = 'rate' + this.slotsData.PayTable[i]['Rates'][k]['SymbolNumber']
            row[key] = this.slotsData.PayTable[i]['Rates'][k]['Rate'] / 100
          }
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
            Rate: parseInt(this.tableData[i][key] * 100)
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
