<template>
  <div class="app-container">
    <el-row v-for="(row, idx) in tableData" :gutter="10" style="margin-top: 30px">
      <el-col :span="18" :offset="3">
        <el-card class="box-card" style="padding: 20px">
          <el-form ref="frm1" :inline="true" label-width="80px">
            <el-form-item label="名称">
              <el-input v-model="row.adaptTo.name" />
            </el-form-item>
            <el-form-item label="最大次数">
              <el-input v-model="row.adaptTo.maxPlayTimes" />
            </el-form-item>
            <el-table
              :data="row.items"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                label="图标"
                width="100"
                header-align="center"
              />
              <template v-for="col in cols">
                <el-table-column
                  :prop="getKey(col)"
                  :label="getLabel(col)"
                  width="100"
                  header-align="center"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row['reels' + col]" />
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </el-form>
        </el-card>
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
  name: 'SlotsReelsIcon',
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
      tableData: [
        {
          adaptTo: {
            name: '所有人',
            maxPlayTimes: -1
          },
          items: [
            { symbol: 1, name: '数字9', reels1: 0, reels2: 0, reels3: 0, reels4: 0, reels5: 0 }
          ]
        }
      ],
      cols: [1, 2, 3, 4, 5],
      symbolMap: {},
      lock: false
    }
  },
  watch: {
    'slotsData.Rows': {
      deep: true,
      handler: function(val) {
        // console.log('reels icon rows watch', val)
        this.initData()
      }
    },
    'slotsData.Clos': {
      deep: true,
      handler: function(val) {
        // console.log('reels icon cols watch', val)
        this.initData()
      }
    },
    'slotsData.SymbolList': {
      deep: true,
      handler: function(val) {
        // console.log('reels icon symbol list watch', val)
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
      return JSON.parse(JSON.stringify(this.slotsData.ReelsRateConfig))
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
      return 'reels' + col
    },
    getLabel(col) {
      return '轴' + col
    },
    initSymbolMap() {
      this.symbolMap = {}
      for (const i in this.slotsData.SymbolList) {
        if (this.slotsData.SymbolList[i]['Type'] === 3) {
          continue
        }
        const value = this.slotsData.SymbolList[i]['Value']
        this.symbolMap[value] = this.slotsData.SymbolList[i]['Name']
      }
    },
    getItem() {
      const item = {
        adaptTo: {
          name: '所有人',
          maxPlayTimes: -1
        },
        items: []
      }
      for (const i in this.symbolMap) {
        const row = {
          name: this.symbolMap[i],
          value: parseInt(i)
        }
        for (const x in this.cols) {
          const key = 'reels' + this.cols[x]
          row[key] = 0
        }
        item.items.push(row)
      }

      // 保证顺序
      item.items.sort(function(a, b) {
        return a.value - b.value
      })

      return item
    },
    initData() {
      this.cols = []
      for (let c = 1; c <= this.slotsData.Clos; c++) {
        this.cols.push(c)
      }
      this.initSymbolMap()

      this.tableData = []
      for (const i in this.slotsData.ReelsRateConfig) {
        const tmp = this.slotsData.ReelsRateConfig[i]
        const item = this.getItem()
        item.adaptTo.name = tmp['AdaptTo']['name'] ? tmp['AdaptTo']['name'] : '所有人'
        item.adaptTo.maxPlayTimes = tmp['AdaptTo']['MaxPlayTimes']

        tmp['Items'].sort(function(a, b) {
          return a.Reels - b.Reels
        })

        for (const k in tmp['Items']) {
          const col = tmp['Items'][k]['Reels']
          const key = 'reels' + (col + 1)

          if (this.cols.indexOf(col + 1) === -1) {
            continue
          }

          for (const v in tmp['Items'][k]['Symbol']) {
            for (const x in item.items) {
              if (item.items[x]['value'] === tmp['Items'][k]['Symbol'][v]['Symbol']) {
                item.items[x][key] = tmp['Items'][k]['Symbol'][v]['Number']
                break
              }
            }
          }
        }

        this.tableData.push(item)
      }

      // console.log('reels icon init data ', this.tableData)
    },
    setData() {
      const frm = []
      for (const i in this.tableData) {
        const data = {
          AdaptTo: {
            Name: this.tableData[i].adaptTo.name,
            MaxPlayTimes: this.tableData[i].adaptTo.maxPlayTimes
          },
          Items: []
        }

        for (const x in this.cols) {
          const tmp = []
          const key = 'reels' + this.cols[x]
          for (const k in this.tableData[i]['items']) {
            tmp.push({
              Symbol: this.tableData[i]['items'][k]['value'],
              Number: this.tableData[i]['items'][k][key]
            })
          }
          data.Items.push({
            'Reels': this.cols[x] - 1,
            'Symbol': tmp
          })
        }

        frm.push(data)
      }

      this.slotsData.ReelsRateConfig = frm
      // this.$message.success('当前页面保存成功')
    }
  }
}
</script>
<style>
.symbol-img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
.symbol-img:hover, .symbol-img.active {
  border: 3px solid red;
}
</style>
