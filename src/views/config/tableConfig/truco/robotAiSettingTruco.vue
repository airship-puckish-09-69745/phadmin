<template>
  <div>
    <el-row style="padding-top: 5px">
      <el-row style="padding-top: 5px">
        
        <el-table
              :data="AiConfig.ResponseTruco"
              border
              style="width: 100%"
            >
            <el-table-column
              label="回合数"
              width="200"
            >
              <template slot-scope="scope">
                <!-- 使用 $index + 1 显示回合数（从1开始） -->
                第{{ scope.$index + 1 }}回合
              </template>
            </el-table-column>
              <el-table-column
                label="我方最大的2张牌得分(>=)(对后2项生效)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.FirstScore" size="mini" type="number"  :precision="0"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="反加注概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.FirstAddRatio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>

              <el-table-column
                label="接受Truco概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.FirstAcceptRatio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>

              <el-table-column
                label="当我方最大的2张牌得分(>=)(对后3项生效)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.SecondScore" size="mini" type="number"  :precision="0"></el-input-number>
                </template>
              </el-table-column>
             
              <el-table-column
                label="对手已出最大牌接受Truco概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.SecondAcceptRatio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>

              <el-table-column
                label="对手没有出最大牌反加注概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.SecondAddRatio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>

             

              <el-table-column
                label="对手没有出最大牌没有命中反加注Truco概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.SecondNoAddcceptRatio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>

              <el-table-column
                label="当我方最大的2张牌得分小于前两项时,对手没有出最大牌，接受Truco概率"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.LastAcceptRatio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>
            </el-table>
      </el-row>
     
    </el-row>

   
  </div>
</template>
<script>

function newTruco(x,y) {
  return {
   Score: x,
   Ratio: y,
  }
}



export default {
  name: 'RobotAiSettingTruco',
  components: {  },
  model: {
		    prop: 'AiConfig',
		    event: 'cc'
  },
  props: {
		    AiConfig: {
		      type: Object,
		      default: function() {
		        return {}
		      }
		    }
  },
  data(){
    return {
      ResponseTruco:[
        {
          FirstScore: 90,
          FirstAddRatio: 90,
          FirstAcceptRatio: 80,
          SecondScore: 70,
          SecondAcceptRatio: 30,
          SecondAddRatio: 30,
          SecondNoAddcceptRatio: 50,
          LastAcceptRatio: 20,
        },
        {
          FirstScore: 90,
          FirstAddRatio: 90,
          FirstAcceptRatio: 80,
          SecondScore: 70,
          SecondAcceptRatio: 30,
          SecondAddRatio: 30,
          SecondNoAddcceptRatio: 50,
          LastAcceptRatio: 20,
        },{
          FirstScore: 90,
          FirstAddRatio: 90,
          FirstAcceptRatio: 80,
          SecondScore: 70,
          SecondAcceptRatio: 30,
          SecondAddRatio: 30,
          SecondNoAddcceptRatio: 50,
          LastAcceptRatio: 20,
        },
      ],
 
      editResponseTruco:{}
      

    }
   
  },

  created() {
  
    this.$nextTick(() => {
      // if (!this.AiConfig.hasOwnProperty('Decision')) {
      //   this.AiConfig.Decision = this.Decision
      // }

     // console.log('common plugin decision tongitsConfig:', this.AiConfig)       
      
    })
  },
  watch: {
    AiConfig: {
      immediate: true,
      deep: true,
      handler(newVal) {

        if (!newVal.ResponseTruco) {
          this.editResponseTruco = JSON.parse(JSON.stringify(this.ResponseTruco)) 
           newVal.ResponseTruco= this.editResponseTruco 
          console.log('common truco:', this.AiConfig)       
        }
      }
    }
  },
  methods: {
    
  },
 
}
</script>
