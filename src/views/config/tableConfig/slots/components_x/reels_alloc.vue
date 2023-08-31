<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px" class="row-alloc">
      <h3 style="text-align:center;">主游戏(修改后立即保存)</h3>
      <el-col :span="18" :offset="3">
        <el-form :inline="true">
          <el-form-item label="分配列表">
            <el-select v-model="mainConfigId" placeholder="选择分配列表" @change="onChangeId(1)">
              <el-option label="非掉落" value="Normal" />
              <el-option label="第一次掉落" value="Fall1" />
              <el-option label="第二次掉落" value="Fall2" />
              <el-option label="第三次掉落" value="Fall3" />
              <el-option label="掉落默认配置" value="Final" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-table
          :data="mainTableData"
          :summary-method="getSummary"
          show-summary
          border
          style="width: 100%"
        >
          <el-table-column
            label="配置"
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row.ReelsConfigId">
                <el-option
                  v-for="item in slotsData.ReelsRateConfigDistribution"
                  :key="item.Config.Id"
                  :label="item.Config.Name"
                  :value="item.Config.Id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="概率(%)"
          >
            <template slot-scope="scope">
              <ratio-input v-model="scope.row.ReelsConfigRatio" :is-sample="true" />
            </template>
          </el-table-column>
          <el-table-column
            align="right"
          >
            <template slot="header" slot-scope="scope">
              <el-button type="primary" @click="onCreate(1)">添加</el-button>
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(1,scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :push="11" style="margin: 30px 0">
        <el-button type="success" @click="submitFrm(1)">保存</el-button>
      </el-col>
    </el-row>

    <!--free spins-->
    <el-row :gutter="10" style="margin-top: 30px" class="row-alloc">
      <h3 style="text-align:center;">Scatter/Free spins (修改后立即保存)</h3>
      <el-col :span="18" :offset="3">
        <el-form :inline="true">
          <el-form-item label="分配列表">
            <el-select v-model="scatterConfigId" placeholder="选择分配列表" @change="onChangeId(2)">
              <el-option label="非掉落" value="Normal" />
              <el-option label="第一次掉落" value="Fall1" />
              <el-option label="第二次掉落" value="Fall2" />
              <el-option label="第三次掉落" value="Fall3" />
              <el-option label="掉落默认配置" value="Final" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-table
          :data="scatterTableData"
          :summary-method="getSummary"
          show-summary
          border
          style="width: 100%"
        >
          <el-table-column
            label="配置"
          >
            <template slot-scope="scope">
              <el-select v-model="scope.row.ReelsConfigId">
                <el-option
                  v-for="item in slotsData.ReelsRateConfigDistribution"
                  :key="item.Config.Id"
                  :label="item.Config.Name"
                  :value="item.Config.Id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="概率(%)"
          >
            <template slot-scope="scope">
              <ratio-input v-model="scope.row.ReelsConfigRatio" :is-sample="true" />
            </template>
          </el-table-column>
          <el-table-column
            align="right"
          >
            <template slot="header" slot-scope="scope">
              <el-button type="primary" @click="onCreate(2)">添加</el-button>
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(2,scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :push="11" style="margin: 30px 0">
        <el-button type="success" @click="submitFrm(2)">保存</el-button>
      </el-col>
    </el-row>
    <!--对比组件-->
    <compare ref="compare" />
  </div>

</template>
<style>
  .row-alloc{
    border-radius: 4px;
    border-style:dashed;
  }
</style>
<script>
import RatioInput from '@/components/RatioInput'
import Compare from '@/components/Compare'

export default {
  name: 'SlotsReelsAlloc',
  components: { Compare, RatioInput },
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
      mainConfigId: '',
      scatterConfigId: '',
      mainTableData: [
      ],
      scatterTableData: [],
      lock: false
    }
  },
  watch: {
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
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm(typeName) {
      // 检测配置
      for (const k in this.slotsData.ReelsConfigAlloc) {
        const obj = this.slotsData.ReelsConfigAlloc[k]
        for (const w in obj) {
          if (k == 'MainConfig') {
            if (w == this.mainConfigId) {
              this.slotsData.ReelsConfigAlloc[k][w] = this.mainTableData
              obj[w] = this.mainTableData
            }
          } else {
            if (w == this.scatterConfigId) {
              this.slotsData.ReelsConfigAlloc[k][w] = this.scatterTableData
              obj[w] = this.scatterTableData
            }
          }
          const cfg = obj[w]
          if (cfg.length === 0) {
            continue
          }
          let totalRatio = 0
          for (const d in cfg) {
            if (cfg[d].ReelsConfigId <= 0) {
              this.$message.error('有配置错误，请检查配置')
              return
            }
            totalRatio += cfg[d].ReelsConfigRatio
          }
          if (totalRatio != 10000) {
            this.$message.error('概率之和不为100%，请检查配置')
            return
          }
        }
      }
      // this.slotsData.ReelsConfigAlloc.MainConfig = this.mainTableData
      // this.slotsData.ReelsConfigAlloc.ScatterConfig = this.scatterTableData
      console.log('this.slotsData.ReelsConfigAlloc:', this.slotsData.ReelsConfigAlloc)
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

    initData() {
      // console.log('reels icon init data ', this.tableData)
      if (this.slotsData) {
        this.$refs.compare.SetOldVal(this.getDiffData())
        console.log('set old alloc value')
      }
    },
    onCreate(typeName) {
      const one = {
        ReelsConfigId: 0,
        ReelsConfigRatio: 0
      }
      if (typeName == 1) {
        this.mainTableData.push(one)
      } else {
        this.scatterTableData.push(one)
      }
    },

    getSummary(param) {
      console.log('summary', param)
      let ratio = 0
      for (const i in param.data) {
        ratio += param.data[i]['ReelsConfigRatio']
      }
      return ['总计', (ratio / 100).toFixed(2), '-']
    },
    handleDelete(typeName, index, row) {
      console.log('delete:', typeName, index, row)
      this.$confirm('是否删除配置, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let searchObj = this.mainTableData
        if (typeName != 1) {
          searchObj = this.scatterTableData
        }
        const newObj = []
        for (let i = 0; i < searchObj.length; i++) {
          if (i != index) {
            newObj.push(searchObj[i])
          }
        }
        if (typeName == 1) {
          this.mainTableData = newObj
        } else {
          this.scatterTableData = newObj
        }
      }).catch(() => {
      })
    },
    onChangeId(typeName) {
      console.log('on change type:', typeName, this.mainConfigId)
      if (typeName == 1) {
        for (const k in this.slotsData.ReelsConfigAlloc.MainConfig) {
          if (k == this.mainConfigId) {
            this.mainTableData = this.slotsData.ReelsConfigAlloc.MainConfig[k]
          }
        }
      } else {
        for (const k in this.slotsData.ReelsConfigAlloc.ScatterConfig) {
          if (k == this.scatterConfigId) {
            this.scatterTableData = this.slotsData.ReelsConfigAlloc.ScatterConfig[k]
          }
        }
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
