<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="18" :offset="3">
        <el-form :inline="true">
          <el-form-item label="配置列表">
            <el-select v-model="configId" placeholder="配置列表" @change="onChangeId()">
              <el-option
                v-for="item in cfg.SymbolCount"
                :key="item.Config.Id"
                :label="item.Config.Name"
                :value="item.Config.Id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="18" :offset="3">
        <el-card class="box-card" style="padding: 20px">
          <el-form ref="frm1" :inline="true" label-width="80px">
            <el-table
              :data="items"
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
  name: 'SlotsSymbolCountReels',
  components: { Compare },
  model: {
    prop: 'cfg',
    event: 'cc'
  },
  props: {
    cfg: {
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
    }
  },
  data() {
    return {
      items: [
      ],
      configId: 0,
      cols: [1, 2, 3, 4, 5],
      symbolMap: {},
      lock: false,
      dialogVisible: false,
      dialogName: ''
    }
  },
  watch: {
    'SymbolList': {
      deep: true,
      handler: function(val) {
        // console.log('reels icon symbol list watch', val)
        this.initData()
      }
    },
    'cfg.SymbolCount': {
      // deep: true,
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
      return JSON.parse(JSON.stringify(this.cfg))
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
      return '数量' + col
    },
    initSymbolMap() {
      this.symbolMap = {}
      for (const i in this.SymbolList) {
        const value = this.SymbolList[i]['Value']
        this.symbolMap[value] = this.SymbolList[i]['Name']
      }
    },
    getItem() {
      const items = []
      for (const i in this.symbolMap) {
        const row = {
          name: this.symbolMap[i],
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
    initData() {
      this.cols = []
      let num = 0
      for (const i in this.cfg.PayTable) {
        for (const j in this.cfg.PayTable[i].Rates) {
          if (num < this.cfg.PayTable[i].Rates[j].SymbolNumber) {
            num = this.cfg.PayTable[i].Rates[j].SymbolNumber
          }
        }
      }
      for (let c = 1; c <= num; c++) {
        this.cols.push(c)
      }
      this.initSymbolMap()

      this.item = []
      if (this.configId === 0) {
        for (const i in this.cfg.SymbolCount) {
          this.configId = this.cfg.SymbolCount[i].Config.Id
          break
        }
      }
      this.onChangeId()
      // console.log('reels icon init data ', this.tableData)
    },
    setData() {
      if (this.items.length === 0) {
        return
      }
      const changeItems = []
      for (const k in this.items) {
        const tmp = []
        for (const x in this.cols) {
          const key = 'reels' + this.cols[x]
          tmp.push(this.items[k][key])
        }
        changeItems.push({
          'Symbol': this.items[k]['value'],
          'Number': tmp
        })
      }

      for (const i in this.cfg.SymbolCount) {
        if (this.cfg.SymbolCount[i].Config.Id === this.configId) {
          this.cfg.SymbolCount[i].Items = changeItems
        }
      }
      // this.$message.success('当前页面保存成功')
    },
    onChangeId() {
      console.log('onChangeId.....')
      this.item = []
      for (const i in this.cfg.SymbolCount) {
        if (this.cfg.SymbolCount[i].Config.Id !== this.configId) {
          continue
        }
        const tmp = this.cfg.SymbolCount[i]
        const item = this.getItem()

        // eslint-disable-next-line no-prototype-builtins
        if (!tmp.hasOwnProperty('Items')) {
          this.items = item
          continue
        }

        tmp['Items'].sort(function(a, b) {
          return a.Symbol - b.Symbol
        })

        for (const k in tmp['Items']) {
          for (const x in item) {
            if (item[x]['value'] === tmp['Items'][k]['Symbol']) {
              for (const n in tmp['Items'][k]['Number']) {
                const key = 'reels' + (Number(n) + 1)
                item[x][key] = tmp['Items'][k]['Number'][n]
              }
              break
            }
          }
        }

        this.items = item
      }
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
