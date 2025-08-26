<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="18" :offset="3">
        <el-form :inline="true">
          <el-form-item label="首行符号相同概率(普通)">
            <el-input v-model.number="cfg.RowsSymSameRateNormal" ><template slot="append">‰</template></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="18" :offset="3">
        <el-form :inline="true">
          <el-form-item label="首行符号相同概率(免费)">
            <el-input v-model.number="cfg.RowsSymSameRateFree" ><template slot="append">‰</template></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="18" :offset="3">
        <el-form :inline="true">
          <el-form-item label="配置列表">
            <el-select v-model="configId" placeholder="配置列表" @change="onChangeId()">
              <el-option
                v-for="item in cfg.RowsSymSameRateCfgDistribution"
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
                    <el-input v-model.number="scope.row['reels' + col]" :disabled="scope.row['disabled' + col]" />
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
  name: 'SlotsRowSymbolsSame',
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
    'cfg.RowReelsRateConfigDistribution': {
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
      if (this.cfg.RowsSymSameRateNormal > 700){
        this.$message.error(`首行符号相同概率(普通) 不能大于500‰ 防止无限旋转`);
        return;
      }
      if (this.cfg.RowsSymSameRateFree > 700){
        this.$message.error(`首行符号相同概率(免费) 不能大于500‰ 防止无限旋转`);
        return;
      }
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
      return '行' + col
    },
    initSymbolMap() {
      this.symbolMap = {}
      for (const i in this.SymbolList) {
        /*
        if (this.SymbolList[i]['Type'] === 3) {
          continue
        }
        */
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
      for (let c = 1; c <= 1; c++) {
        this.cols.push(c)
      }
      this.initSymbolMap()

      if (!this.cfg.hasOwnProperty('RowsSymSameRateCfgDistribution')) {
        this.cfg.RowsSymSameRateCfgDistribution = []
        const lose = this.createReelsRateConfigDistribution('输配置')
        this.cfg.RowsSymSameRateCfgDistribution.push(lose)
        const win = this.createReelsRateConfigDistribution('赢配置')
        this.cfg.RowsSymSameRateCfgDistribution.push(win)
      }

      this.item = []
      if (this.configId === 0) {
        for (const i in this.cfg.RowsSymSameRateCfgDistribution) {
          this.configId = this.cfg.RowsSymSameRateCfgDistribution[i].Config.Id
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
      for (const x in this.cols) {
        const tmp = []
        const key = 'reels' + this.cols[x]
        const disable = 'disabled' + this.cols[x]
        for (const k in this.items) {
          if (this.items[k][disable]) {
            tmp.push({
              Symbol: this.items[k]['value'],
              Number: this.items[k][key],
              Disabled: true
            })
          } else {
            tmp.push({
              Symbol: this.items[k]['value'],
              Number: this.items[k][key]
            })
          }
        }
        changeItems.push({
          'Reels': this.cols[x] - 1,
          'Symbol': tmp
        })
      }
      for (const i in this.cfg.RowsSymSameRateCfgDistribution) {
        if (this.cfg.RowsSymSameRateCfgDistribution[i].Config.Id == this.configId) {
          this.cfg.RowsSymSameRateCfgDistribution[i].Items = changeItems
        }
      }
      // this.$message.success('当前页面保存成功')
    },
    onCreate() {
      // this.dialogVisible = true
      // this.dialogName = ''
      this.$prompt('配置名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: ''
      }).then(({ value }) => {
        console.log('wtf ', value)
        const one = this.createRowsSymSameRateCfgDistribution(value)
        this.cfg.RowsSymSameRateCfgDistribution.push(one)
        console.log('new config :', this.cfg)
        this.$message.success('添加成功')
        this.configId = one.Config.Id
        this.onChangeId()
      }).catch(() => {

      })
    },
    createRowsSymSameRateCfgDistribution(name) {
      let id = 1
      let maxId = 0
      for (const i in this.cfg.RowsSymSameRateCfgDistribution) {
        if (this.cfg.RowsSymSameRateCfgDistribution[i].Config.Id > maxId) {
          maxId = this.cfg.RowsSymSameRateCfgDistribution[i].Config.Id
        }
      }
      id = maxId + 1
      const newItem = {
        Config: {
          Id: id,
          Name: name
        },
        Items: []
      }
      for (let c = 0; c < 1; c++) {
        const one = {
          Reels: c,
          Symbol: []
        }
        for (const i in this.SymbolList) {
          if (this.SymbolList[i]['Type'] === 3) {
            continue
          }
          const value = this.SymbolList[i]['Value']
          one.Symbol.push({
            Number: 100,
            Symbol: value
          })
        }
        newItem.Items.push(one)
      }
      return newItem
    },
    onEdit() {
      let dialogName = ''
      for (const i in this.cfg.RowsSymSameRateCfgDistribution) {
        if (this.cfg.RowsSymSameRateCfgDistribution[i].Config.Id == this.configId) {
          dialogName = this.cfg.RowsSymSameRateCfgDistribution[i].Config.Name
        }
      }
      this.$prompt('配置名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: dialogName
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        if (value === dialogName) {
          return
        }
        for (const i in this.cfg.RowsSymSameRateCfgDistribution) {
          if (this.cfg.RowsSymSameRateCfgDistribution[i].Config.Id == this.configId) {
            this.cfg.RowsSymSameRateCfgDistribution[i].Config.Name = value
            break
          }
        }
      }).catch(() => {
      })
    },
    onDelete() {
      this.$confirm('是否删除配置, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.cfg.RowsSymSameRateCfgDistribution.length <= 1) {
          this.$message({
            type: 'info',
            message: '必须保留一个配置!'
          })
          return
        }
        const obj = []
        let configId = 0
        for (const i in this.cfg.RowsSymSameRateCfgDistribution) {
          if (this.cfg.RowsSymSameRateCfgDistribution[i].Config.Id != this.configId) {
            configId = configId > 0 ? configId : this.cfg.RowsSymSameRateCfgDistribution[i].Config.Id
            obj.push(this.cfg.RowsSymSameRateCfgDistribution[i])
          }
        }
        this.cfg.RowsSymSameRateCfgDistribution = obj
        this.configId = configId
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.onChangeId()
      }).catch(() => {
      })
    },
    onChangeId() {
      console.log('onChangeId.....')
      this.item = []
      for (const i in this.cfg.RowsSymSameRateCfgDistribution) {
        if (this.cfg.RowsSymSameRateCfgDistribution[i].Config.Id != this.configId) {
          continue
        }
        const tmp = this.cfg.RowsSymSameRateCfgDistribution[i]
        const item = this.getItem()

        tmp['Items'].sort(function(a, b) {
          return a.Reels - b.Reels
        })

        for (const k in tmp['Items']) {
          const col = tmp['Items'][k]['Reels']
          const key = 'reels' + (col + 1)
          const disable = 'disabled' + (col + 1)

          if (this.cols.indexOf(col + 1) === -1) {
            continue
          }

          for (const v in tmp['Items'][k]['Symbol']) {
            for (const x in item) {
              if (item[x]['value'] === tmp['Items'][k]['Symbol'][v]['Symbol']) {
                item[x][key] = tmp['Items'][k]['Symbol'][v]['Number']
                if (tmp['Items'][k]['Symbol'][v]['Disabled']) {
                  item[x][disable] = true
                }
                break
              }
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
