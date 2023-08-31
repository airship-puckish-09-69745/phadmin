<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="18" :offset="3">
        <el-card class="box-card" style="padding: 20px">
          <el-form ref="frm1" :inline="true" label-width="80px">
            <el-table
              :data="lenTable"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                label="格子长度"
                width="100"
                header-align="center"
              />
              <template v-for="(col, key) in cols">
                <el-table-column
                  :key="key"
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

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="18" :offset="3">
        <el-card class="box-card" style="padding: 20px">
          <el-form ref="frm1" :inline="true" label-width="80px">
            <el-table
              :data="frameTable"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                label="格子边框"
                width="100"
                header-align="center"
              />
              <template v-for="(col, key) in cols">
                <el-table-column
                  :key="key"
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
      lenTable: [// 格子长度table
        {
          name: '占1格',
          value: 1,
          reels1: 20,
          reels2: 20,
          reels3: 20,
          reels4: 20,
          reels5: 20,
          reels6: 20
        }
      ],
      frameTable: [// 格子边框table
        {
          name: '木框',
          value: 1,
          reels1: 20,
          reels2: 20,
          reels3: 20,
          reels4: 20,
          reels5: 20,
          reels6: 20
        }
      ],
      cols: [1, 2, 3, 4, 5, 6],
      lenMap: {
        1: '占1格',
        2: '占2格',
        3: '占3格',
        4: '占4格'
      },
      frameMap: {
        1: '木框',
        2: '银框',
        3: '金框'
      },
      lock: false
    }
  },
  updated() {
    if (this.lock === false) {
      this.$refs.compare.SetOldVal(this.getDiffData())
      this.lock = true
    }
  },
  created() {
    this.initLenTable()
    this.initFrameTable()
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
      return 'reels' + col
    },
    getLabel(col) {
      return '轴' + col
    },
    initLenTableItem() {
      const items = []
      for (const i in this.lenMap) {
        const row = {
          name: this.lenMap[i],
          value: parseInt(i)
        }
        for (const x in this.cols) {
          const key = 'reels' + this.cols[x]
          row[key] = 0
        }
        items.push(row)
      }

      // 保证顺序
      items.sort(function(a, b) {
        return a.value - b.value
      })

      return items
    },
    initLenTable() {
      this.cols = []
      for (let c = 1; c <= this.slotsData.Clos; c++) {
        this.cols.push(c)
      }

      const tmp = this.slotsData.ReelsCellLengthRate
      const item = this.initLenTableItem()

      tmp.sort(function(a, b) {
        return a.Reels - b.Reels
      })

      for (const k in tmp) {
        const col = tmp[k]['Reels']
        const key = 'reels' + (col + 1)

        if (this.cols.indexOf(col + 1) === -1) {
          continue
        }

        for (const v in tmp[k]['Symbol']) {
          for (const x in item) {
            if (item[x]['value'] === tmp[k]['Symbol'][v]['Symbol']) {
              item[x][key] = tmp[k]['Symbol'][v]['Number']
              break
            }
          }
        }
      }

      this.lenTable = item
    },
    initFrameTableItem() {
      const items = []
      for (const i in this.frameMap) {
        const row = {
          name: this.frameMap[i],
          value: parseInt(i)
        }
        for (const x in this.cols) {
          const key = 'reels' + this.cols[x]
          row[key] = 0
        }
        items.push(row)
      }

      // 保证顺序
      items.sort(function(a, b) {
        return a.value - b.value
      })

      return items
    },
    initFrameTable() {
      this.cols = []
      for (let c = 1; c <= this.slotsData.Clos; c++) {
        this.cols.push(c)
      }

      const tmp = this.slotsData.ReelsCellBorderRate
      const item = this.initFrameTableItem()

      tmp.sort(function(a, b) {
        return a.Reels - b.Reels
      })

      for (const k in tmp) {
        const col = tmp[k]['Reels']
        const key = 'reels' + (col + 1)

        if (this.cols.indexOf(col + 1) === -1) {
          continue
        }

        for (const v in tmp[k]['Symbol']) {
          for (const x in item) {
            if (item[x]['value'] === tmp[k]['Symbol'][v]['Symbol']) {
              item[x][key] = tmp[k]['Symbol'][v]['Number']
              break
            }
          }
        }
      }

      this.frameTable = item
    },
    setData() {
      const lenData = []
      for (const x in this.cols) {
        const tmp = []
        const key = 'reels' + this.cols[x]
        for (const k in this.lenTable) {
          tmp.push({
            Symbol: this.lenTable[k]['value'],
            Number: this.lenTable[k][key]
          })
        }
        lenData.push({
          'Reels': this.cols[x] - 1,
          'Symbol': tmp
        })
      }
      this.slotsData.ReelsCellLengthRate = lenData

      const frameData = []
      for (const x in this.cols) {
        const tmp = []
        const key = 'reels' + this.cols[x]
        for (const k in this.frameTable) {
          tmp.push({
            Symbol: this.frameTable[k]['value'],
            Number: this.frameTable[k][key]
          })
        }
        frameData.push({
          'Reels': this.cols[x] - 1,
          'Symbol': tmp
        })
      }
      this.slotsData.ReelsCellBorderRate = frameData
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
