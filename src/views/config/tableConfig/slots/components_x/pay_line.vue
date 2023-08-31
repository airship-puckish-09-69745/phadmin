<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col v-for="(item,idx) in tableData" :span="6">
        <el-card class="box-card" style="margin-bottom: 20px">
          <div slot="header" class="clearfix">
            <span>第 {{ idx + 1 }} 线</span>
            <el-button type="text" style="float: right; padding: 3px 0; color: red" :disabled="editDisabled" @click="colDel(idx)">删除</el-button>
          </div>
          <div>
            <el-table
              :data="item"
              :row-style="{height: '80px'}"
              :cell-style="{padding: '0px'}"
              style="width: 401px"
              :show-header="false"
              border
              @cell-click="colClick"
            >
              <template v-for="k of cols">
                <el-table-column
                  :prop="getColKey(k)"
                  align="center"
                  width="80"
                >
                  <template slot-scope="scope">
                    <el-button v-if="hasHit(scope.row, k)" type="primary" icon="el-icon-check" circle :disabled="editDisabled" />
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 30px">
      <el-col>
        <el-button type="primary" :disabled="editDisabled" @click="addRow">添加</el-button>
        <el-button type="success" :disabled="editDisabled" @click="submitFrm">保存</el-button>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import Compare from '@/components/Compare'

export default {
  name: 'SlotsPayLine',
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
    rows: Number,
    cols: Number
  },
  data() {
    return {
      editDisabled: true,
      tableData: [],
      lock: false
    }
  },
  watch: {
    'slotsData': {
      deep: true,
      handler: function(val) {
        this.initData()
      }
    },
    'rows': {
      deep: true,
      handler: function(val) {
        this.initData()
      }
    },
    'cols': {
      deep: true,
      handler: function(val) {
        this.initData()
      }
    }
  },
  created() {
    this.initData()
  },
  updated() {
    if (this.lock === false) {
      this.$refs.compare.SetOldVal(this.getDiffData())
      this.lock = true
    }
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
    getColKey(idx) {
      return 'col' + idx
    },
    hasHit(row, idx) {
      const k = 'col' + idx
      return parseInt(row[k]) === 1
    },
    colDel(idx) {
      this.tableData.splice(idx, 1)
    },
    colClick(row, column, cell, event) {
      if (parseInt(row[column['property']]) === 1) {
        row[column['property']] = 0
      } else {
        row[column['property']] = 1
      }
    },
    initTable() {
      const data = []
      for (let row = 1; row <= this.rows; row++) {
        const arr = {}
        for (let col = 1; col <= this.cols; col++) {
          arr['col' + col] = 0
        }
        data.push(arr)
      }

      return data
    },
    addRow() {
      this.tableData.push(this.initTable())
    },
    fillTableData(arr) {
      const data = this.initTable()
      for (const i in arr) {
        const row = arr[i]['Row']
        const col = 'col' + (parseInt(arr[i]['Col']) + 1)
        // eslint-disable-next-line no-prototype-builtins
        if (data.hasOwnProperty(row) && data[row].hasOwnProperty(col)) {
          data[row][col] = 1
        }
      }

      return data
    },
    setData() {
      const data = {
        'Type': 0,
        'Items': []
      }
      for (const i in this.tableData) {
        const rowData = {
          'Id': parseInt(i) + 1,
          'Lists': []
        }
        for (const row in this.tableData[i]) {
          for (const col in this.tableData[i][row]) {
            if (this.tableData[i][row][col] === 1) {
              rowData['Lists'].push({
                'Row': parseInt(row),
                'Col': (parseInt(col.substr(3, 4)) - 1)
              })
            }
          }
        }

        data['Items'].push(rowData)
      }

      data['Items'].sort(function(a, b) {
        if (a.Row === b.Row) {
          return a.Col - b.Col
        }

        return a.Row - b.Row
      })

      this.slotsData.PayLine = data
      // this.$message.success('保存成功')
    },
    initData() {
      if (!this.slotsData || !this.slotsData.PayLine) {
        return
      }
      this.tableData = []
      for (const i in this.slotsData.PayLine.Items) {
        this.tableData.push(this.fillTableData(this.slotsData.PayLine.Items[i].Lists))
      }
    }
  }
}
</script>
<style>
.el-card__body {
  padding: 0 0 0 2px;
}
</style>
