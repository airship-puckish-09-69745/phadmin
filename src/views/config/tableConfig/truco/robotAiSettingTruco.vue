<template>
  <div>
    <el-row style="padding-top: 5px">
      <h3 style="text-align:center;">第一回合</h3>
      <el-row style="padding-top: 5px">
        
        <el-table
              :data="AiConfig.ResponseTruco.RoundOne"
              border
              style="width: 100%"
            >
              <el-table-column
                label="我方最大的2张牌得分(>=)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.Score" size="mini" type="number"  :precision="0"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="反加注概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.AddRatio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>

              <el-table-column
                label="接受Truco概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.AcceptRatio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>

              <el-table-column
                label="比对手牌小接受Truco概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.LessAcceptRatio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>
            
            </el-table>
   


      </el-row>
     
    </el-row>
    <el-row style="padding-top: 5px">
      <h3 style="text-align:center;">第二回合</h3>
      <el-table
              :data="AiConfig.ResponseTruco.RoundTwo"
              border
              style="width: 100%"
            >
              <el-table-column
                label="我方最大的2张牌得分(>=)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.Score" size="mini" type="number"  :precision="0"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="反加注概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.AddRatio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>

              <el-table-column
                label="接受Truco概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.AcceptRatio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>

              <el-table-column
                label="比对手牌小接受Truco概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.LessAcceptRatio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>
            
            </el-table>

    </el-row>

    <el-row style="padding-top: 5px">
      <h3 style="text-align:center;">第三回合</h3>
      <el-table
              :data="AiConfig.ResponseTruco.RoundThree"
              border
              style="width: 100%"
            >
              <el-table-column
                label="我方最大的1张牌得分(>=)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.Score" size="mini" type="number"  :precision="0"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="反加注概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.AddRatio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>

              <el-table-column
                label="接受Truco概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.AcceptRatio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>

              <el-table-column
                label="比对手牌小接受Truco概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.LessAcceptRatio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>
            
            </el-table>
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
      ResponseTruco:{
        RoundOne:[{
          Score: 90,
          AddRatio: 90,
          AcceptRatio: 80,
          NoRatio: 0,
          LessAcceptRatio: 0,
        },{
          Score: 70,
          AcceptRatio: 30,
          AddRatio: 20,
          NoRatio: 50,
          LessAcceptRatio: 50,
        },{
          Score: 0,
          AddRatio: 0,
          AcceptRatio: 20,
          LessAcceptRatio:0,
          NoRatio: 0,
        }
      ],
      RoundTwo:[{
        Score: 90,
          AddRatio: 90,
          AcceptRatio: 0,
          LessAcceptRatio:50,
          NoRatio: 0,
          LessAcceptRatio: 0,
        },{
          Score: 70,
          AddRatio: 90,
          AcceptRatio: 20,
          LessAcceptRatio:50,
        },{
          Score: 0,
          AddRatio: 0,
          AcceptRatio: 20,
          LessAcceptRatio:50,
        }
      ],
      RoundThree:[{
        Score: 90,
          AddRatio: 90,
          AcceptRatio: 0,
          LessAcceptRatio:50,
        },{
          Score: 70,
          AddRatio: 90,
          AcceptRatio: 20,
          LessAcceptRatio:50,
        },{
          Score: 0,
          AddRatio: 0,
          AcceptRatio: 20,
          LessAcceptRatio:50,
        }
      ],


      },
 
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
