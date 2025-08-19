<template>
  <div>
    <el-row style="padding-top: 5px">
      <h3 style="text-align:center;">第一回合</h3>
      <el-row style="padding-top: 5px">
          <fieldset>
            <legend>Truco基础概率</legend>
            <el-table
              :data="AiConfig.TwoSitCfg.RoundOne.Truco"
              border
              style="width: 100%"
            >
              <el-table-column
                label="我方最大的2张牌得分"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.Score" size="mini" type="number"  :precision="0"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="Truco概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.Ratio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>
            
            </el-table>
   
              <el-form ref="AiConfig.TwoSitCfg.RoundOne.TrucoMax" :model="AiConfig.TwoSitCfg.RoundOne.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="我方最大的2张牌得分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.TwoSitCfg.RoundOne.TrucoMax.MaxScore"   type="number"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="且对方最大的2张牌得分" :required="true">
                    
                        <template>
                          <el-input-number
                            v-model="AiConfig.TwoSitCfg.RoundOne.TrucoMax.OtherScore"   type="number"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                  </el-form-item>
                </el-col>
                </el-row>
              </el-form>
              <el-form ref="AiConfig.TwoSitCfg.RoundOne.TrucoMax" :model="AiConfig.TwoSitCfg.RoundOne.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="且我方落后分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.TwoSitCfg.RoundOne.TrucoMax.AfterScore" 
                            placeholder="且我方落后分"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Truco概率(%)" :required="true">
                    
                        <template>
                          <el-input-number
                            v-model="AiConfig.TwoSitCfg.RoundOne.TrucoMax.Ratio" 
                            placeholder="概率"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                  </el-form-item>
                </el-col>
                </el-row>
              </el-form>

            
          </fieldset>

          <fieldset>
            <legend>Truco额外概率</legend>
            <fieldset>
              <legend>比分因素</legend>
              <el-row>
                <el-table
              :data="AiConfig.TwoSitCfg.RoundOne.TrucoOther.ScoreFactors"
              border
              style="width: 100%"
            >
              <el-table-column
                label="我方落后分数大于等于（>=）"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.Behind" size="mini" type="number"  :precision="0"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="Truco 额外概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.Ratio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>
            
            </el-table>
              </el-row>
              <el-row>
                <el-form ref="AiConfig.TwoSitCfg.RoundOne.TrucoOther" :model="AiConfig.TwoSitCfg.RoundOne.TrucoOther" width="70%">
                  <el-col :span="8">
                    <el-form-item label="对手已经绝对大牌Truco概率(%)" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.TwoSitCfg.RoundOne.TrucoOther.OutMaxRato"  type="number"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
              
              </el-form>
              </el-row>
            </fieldset>
        </fieldset>
      </el-row>
     
    </el-row>
    <el-row style="padding-top: 5px">
      <h3 style="text-align:center;">第二回合</h3>
      <el-row style="padding-top: 5px">
          <fieldset>
            <legend>Truco基础概率</legend>
            <el-table
              :data="AiConfig.TwoSitCfg.RoundTwo.Truco"
              border
              style="width: 100%"
            >
              <el-table-column
                label="我方最大的2张牌得分"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.Score" size="mini" type="number"  :precision="0"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="Truco概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.Ratio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>
            
            </el-table>
   
              <el-form ref="AiConfig.TwoSitCfg.RoundTwo.TrucoMax" :model="AiConfig.TwoSitCfg.RoundTwo.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="我方最大的2张牌得分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.TwoSitCfg.RoundTwo.TrucoMax.MaxScore" 
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="且对方最大的2张牌得分" :required="true">
                    
                        <template>
                          <el-input-number
                            v-model="AiConfig.TwoSitCfg.RoundTwo.TrucoMax.OtherScore" 
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                  </el-form-item>
                </el-col>
                </el-row>
              </el-form>
              <el-form ref="AiConfig.TwoSitCfg.RoundTwo.TrucoMax" :model="AiConfig.TwoSitCfg.RoundTwo.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="且我方落后分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.TwoSitCfg.RoundTwo.TrucoMax.AfterScore" 
                            placeholder="且我方落后分"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Truco概率(%)" :required="true">
                    
                        <template>
                          <el-input-number
                            v-model="AiConfig.TwoSitCfg.RoundTwo.TrucoMax.Ratio" 
                            placeholder="概率"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                  </el-form-item>
                </el-col>
                
                </el-row>

              </el-form>
       

          </fieldset>
          <fieldset>
            <legend>Truco额外概率</legend>
            <fieldset>
              <legend>比分因素</legend>
              <el-row>
                <el-table
              :data="AiConfig.TwoSitCfg.RoundTwo.TrucoOther.ScoreFactors"
              border
              style="width: 100%"
            >
              <el-table-column
                label="我方落后分数大于等于（>=）"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.Behind" size="mini" type="number"  :precision="0"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="Truco 额外概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.Ratio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>
            
            </el-table>
          </el-row>
          </fieldset>
          <fieldset>
            <legend>回合输赢因素</legend>
              <el-row>
                <el-form ref="AiConfig.TwoSitCfg.RoundTwo.TrucoOther" :model="AiConfig.TwoSitCfg.RoundTwo.TrucoOther" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="第一回合输概率" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.TwoSitCfg.RoundTwo.TrucoOther.OneRoundLoseRatio"  type="number" 
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="第一回合赢概率" :required="true">
                    
                        <template>
                          <el-input-number
                            v-model="AiConfig.TwoSitCfg.RoundTwo.TrucoOther.OneRoundWinRatio"  type="number" 
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                  </el-form-item>
                </el-col>
                </el-row>
              </el-form>
            </el-row>
            <el-row>
                <el-form ref="AiConfig.TwoSitCfg.RoundTwo.TrucoOther" :model="AiConfig.TwoSitCfg.RoundTwo.TrucoOther" width="70%">
                  <el-col :span="8">
                    <el-form-item label="对手已经绝对大牌Truco概率(%)" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.TwoSitCfg.RoundTwo.TrucoOther.OutMaxRato"  type="number"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
              
              </el-form>
              </el-row>
          </fieldset>
        </fieldset>
        
        </el-row>
        <hr class="dashed-line">

    </el-row>

    <el-row style="padding-top: 5px">
      <h3 style="text-align:center;">第三回合</h3>
      <el-row style="padding-top: 5px">
          <fieldset>
            <legend>Truco基础概率</legend>
            <el-table
              :data="AiConfig.TwoSitCfg.RoundThree.Truco"
              border
              style="width: 100%"
            >
              <el-table-column
                label="我方最大的1张牌得分"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.Score" size="mini" type="number"  :precision="0"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="Truco概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.Ratio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>
            
            </el-table>
   
              <el-form ref="AiConfig.TwoSitCfg.RoundThree.TrucoMax" :model="AiConfig.TwoSitCfg.RoundThree.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="我方最大的1张牌得分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.TwoSitCfg.RoundThree.TrucoMax.MaxScore" 
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="且对方最大的1张牌得分" :required="true">
                    
                        <template>
                          <el-input-number
                            v-model="AiConfig.TwoSitCfg.RoundThree.TrucoMax.OtherScore" 
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                  </el-form-item>
                </el-col>
                </el-row>
              </el-form>
              <el-form ref="AiConfig.TwoSitCfg.RoundThree.TrucoMax" :model="AiConfig.TwoSitCfg.RoundThree.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="且我方落后分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.TwoSitCfg.RoundThree.TrucoMax.AfterScore" 
                            placeholder="且我方落后分"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Truco概率(%)" :required="true">
                    
                        <template>
                          <el-input-number
                            v-model="AiConfig.TwoSitCfg.RoundThree.TrucoMax.Ratio" 
                            placeholder="概率"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                  </el-form-item>
                </el-col>
                </el-row>
              </el-form>
       

          </fieldset>
          <fieldset>
            <legend>Truco额外概率</legend>
            <fieldset>
              <legend>比分因素</legend>
              <el-row>
                <el-table
              :data="AiConfig.TwoSitCfg.RoundThree.TrucoOther.ScoreFactors"
              border
              style="width: 100%"
            >
              <el-table-column
                label="我方落后分数大于等于（>=）"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.Behind" size="mini" type="number"  :precision="0"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="Truco 额外概率(%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.Ratio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                </template>
              </el-table-column>
            
            </el-table>
          </el-row>
          </fieldset>
        </fieldset>
        
        </el-row>
        <hr class="dashed-line">

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
  name: 'RobotAiSettingTwo',
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
      TwoSitCfg:{
        RoundOne:{
          Truco:[{
            Score: 90,
            Ratio: 100,
          },{
            Score: 90,
            Ratio: 100,
          },{
            Score: 90,
            Ratio: 100,
          },{
            Score: 90,
            Ratio: 100,
          }],
          TrucoMax:{
            MaxScore: 30,
            OtherScore: 30,
            AfterScore: 6,
            Ratio: 100
          },
          TrucoOther:{
            ScoreFactors:[{
              Behind: 6,
              Ratio: 40,
            },{
              Behind: 3,
              Ratio: 20,
            }],
            OutMaxRato:20,
          }
        },
        RoundTwo:{
          Truco:[{
            Score: 90,
            Ratio: 100,
          },{
            Score: 90,
            Ratio: 100,
          },{
            Score: 90,
            Ratio: 100,
          },{
            Score: 90,
            Ratio: 100,
          }],
          TrucoMax:{
            MaxScore: 30,
            OtherScore: 30,
            AfterScore: 6,
            Ratio: 50
          },
          TrucoOther:{
            ScoreFactors:[{
              Behind: 6,
              Ratio: 40,
            },{
              Behind: 3,
              Ratio: 20,
            }],
            OneRoundLoseRatio: -30,
            OneRoundWinRatio: 30,
            OutMaxRato:20,
          }
        },
        RoundThree:{
          Truco:[{
            Score: 90,
            Ratio: 100,
          },{
            Score: 90,
            Ratio: 100,
          },{
            Score: 90,
            Ratio: 100,
          },{
            Score: 90,
            Ratio: 100,
          }],
          TrucoMax:{
            MaxScore: 30,
            OtherScore: 30,
            AfterScore: 6,
            Ratio: 50
          },
          TrucoOther:{
            ScoreFactors:[{
              Behind: 6,
              Ratio: 40,
            },{
              Behind: 3,
              Ratio: 20,
            }],
          }
        }

      },
      editRoundCfg:{}
      

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

        if (!newVal.TwoSitCfg) {
          this.editRoundCfg = JSON.parse(JSON.stringify(this.TwoSitCfg)) 
           newVal.TwoSitCfg= this.editRoundCfg 
          console.log('common truco:', this.AiConfig)       
        }
      }
    }
  },
  methods: {
    
  },
 
}
</script>
