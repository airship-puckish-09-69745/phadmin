<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="18" :offset="3">
        <el-form :inline="true">
          <el-form-item label="配置列表">
            <el-select v-model="configId" placeholder="配置列表" @change="onChangeId()">
              <el-option
                v-for="item in slotsData.ReelsRateConfigDistribution"
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
                prop="value"
                label="值"
                width="100"
                header-align="center"
              />
              <el-table-column
                prop="name"
                label="符号"
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
import store from "@/store";

export default {
  name: 'SlotsReelsDouble',
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
      dialogName: '',
      version: store.getters.version || 'V1',
      oldData: JSON.parse(JSON.stringify(this.slotsData))
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
	  'slotsData.ReelsRateConfigDistribution': {
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
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm(isMultiApp) {
      this.setData()

      const $this = this
      if (this.slotsData.SlotsType === 180) {
        for (const ReelsRate_idx in this.slotsData.ReelsRateConfigDistribution) {
          const ReelsRate = this.slotsData.ReelsRateConfigDistribution[ReelsRate_idx]
          if (ReelsRate['Config']['Id']===2){
            const Items = ReelsRate.Items
            for (const Item_idx in Items){
              const Item = Items[Item_idx]
              let sum = 0;
              let wild = 0
              for (const Symbol_idx in Item.Symbol){
                const Symbol = Item.Symbol[Symbol_idx]
                sum = sum + Symbol.Number
                if (Symbol.Symbol == 10){
                  wild = Symbol.Number
                }
              }
              const prop = 5
              if (wild/sum > prop/100){
                this.$message.error(`免费模式 轴${Item.Reels+1} wild权重占比大于${prop}% wild:${wild} sum:${sum} 占比:${wild/sum*100}%`);
                return;
              }
            }
          }
        }
      }
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }

        if (!isMultiApp) {
          $this.$emit('saveData')
        } else {
          $this.$emit('multiAppSave', $this.oldData, $this.slotsData)
        }
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
      for (let c = 1; c <= this.slotsData.Clos; c++) {
        this.cols.push(c)
      }
      this.initSymbolMap()

      if (!this.slotsData.hasOwnProperty('ReelsRateConfigDistribution')) {
        this.slotsData.ReelsRateConfigDistribution = []
        const lose = this.createReelsRateConfigDistribution('输配置')
        this.slotsData.ReelsRateConfigDistribution.push(lose)
        const win = this.createReelsRateConfigDistribution('赢配置')
        this.slotsData.ReelsRateConfigDistribution.push(win)
      }

      this.item = []
      if (this.configId === 0) {
        for (const i in this.slotsData.ReelsRateConfigDistribution) {
          this.configId = this.slotsData.ReelsRateConfigDistribution[i].Config.Id
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
      for (const i in this.slotsData.ReelsRateConfigDistribution) {
        if (this.slotsData.ReelsRateConfigDistribution[i].Config.Id == this.configId) {
          this.slotsData.ReelsRateConfigDistribution[i].Items = changeItems
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
        const one = this.createReelsRateConfigDistribution(value)
        this.slotsData.ReelsRateConfigDistribution.push(one)
        console.log('new config :', this.slotsData)
        this.$message.success('添加成功')
        this.configId = one.Config.Id
        this.onChangeId()
      }).catch(() => {

      })
    },
    createReelsRateConfigDistribution(name) {
      let id = 1
      let maxId = 0
      for (const i in this.slotsData.ReelsRateConfigDistribution) {
        if (this.slotsData.ReelsRateConfigDistribution[i].Config.Id > maxId) {
          maxId = this.slotsData.ReelsRateConfigDistribution[i].Config.Id
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
      for (let c = 0; c < this.slotsData.Clos; c++) {
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
      for (const i in this.slotsData.ReelsRateConfigDistribution) {
        if (this.slotsData.ReelsRateConfigDistribution[i].Config.Id == this.configId) {
          dialogName = this.slotsData.ReelsRateConfigDistribution[i].Config.Name
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
        for (const i in this.slotsData.ReelsRateConfigDistribution) {
          if (this.slotsData.ReelsRateConfigDistribution[i].Config.Id == this.configId) {
            this.slotsData.ReelsRateConfigDistribution[i].Config.Name = value
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
        if (this.slotsData.ReelsRateConfigDistribution.length <= 1) {
          this.$message({
            type: 'info',
            message: '必须保留一个配置!'
          })
          return
        }
        const obj = []
        let configId = 0
        for (const i in this.slotsData.ReelsRateConfigDistribution) {
          if (this.slotsData.ReelsRateConfigDistribution[i].Config.Id != this.configId) {
            configId = configId > 0 ? configId : this.slotsData.ReelsRateConfigDistribution[i].Config.Id
            obj.push(this.slotsData.ReelsRateConfigDistribution[i])
          }
        }
        this.slotsData.ReelsRateConfigDistribution = obj
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
      for (const i in this.slotsData.ReelsRateConfigDistribution) {
        if (this.slotsData.ReelsRateConfigDistribution[i].Config.Id != this.configId) {
          continue
        }
        const tmp = this.slotsData.ReelsRateConfigDistribution[i]
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
