<template>
  <div class="app-container">

    <template v-for="(oneCfg, oneCfgIdx) in slotsData.Plate">
      <el-card class="box-card" style="margin:40px auto;">

        <div slot="header" class="clearfix">
          <h3 style="text-align:center">---------- [ 轮盘赔率控制 - 第{{oneCfg.Level}}层 ] ----------</h3>
        </div>

        <el-table :data="oneCfg.Config" show-summary :summary-method="getSummaries" border>
          <el-table-column label="类型">
            <template scope="scope">
              <el-radio-group v-model="scope.row.IsGoNextPlate" :change="selectType(scope.row)">
                <el-radio-button :label="true">雪花</el-radio-button>
                <el-radio-button :label="false">倍率</el-radio-button>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="倍率">
            <template scope="scope">
              <el-input v-model.number.number="scope.row.Odds" :disabled="isDisableOdds(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="概率">
            <template scope="scope">
              <el-input v-model.number.number="scope.row.Ratio"><template slot="append">%</template></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

   
  </template>
   <el-row>
      <el-col style="text-align:center;">
        <el-button type="primary" @click="submitFrm">保存</el-button>
      </el-col>
    </el-row>
    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>

<script>
import RatioInput from '@/components/RatioInput'
import Compare from '@/components/Compare'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'SlotsJokerPlate',
  components: { RatioInput, Compare },
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
      cfg: {
      },
    }
  },
  created() {
  },
  methods: {
    isDisableOdds(row){
        if(row.IsGoNextPlate){
          row.Odds = 0;
        }
        return row.IsGoNextPlate?true:false;
    },
    selectType(row,event){
    },
    getDiffData() {
      return JSON.parse(JSON.stringify(this.slotsData))
    },
    submitFrm() {
      //if (!this.setData()) {
      //  return
      //}

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
    setData() {
      this.slotsData.ExtConfig = JSON.stringify(this.slotsData)
      // this.$message.success('保存到当前页面成功')

      return true
    },
    getSummaries(param){
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0 ) {
            sums[index] = '总计';
            return;
          }else if (index === 1){
            sums[index] = 'N/A';
            return;
          }
          let total = 0;
          for (let key in data){
            total += data[key].Ratio;
          }
          sums[index] = total+' %';
        });

        return sums;
    }
  }
}
</script>
