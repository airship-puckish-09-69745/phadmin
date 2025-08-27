<template>
  <div>
    <el-row style="padding-top: 5px">
      <h3 style="text-align:center;">第一回合</h3>
      <el-row style="padding-top: 5px">
          <fieldset>
            <legend>Truco基础概率</legend>
            <el-table
              :data="AiConfig.OneSitCfg.RoundOne.Truco"
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
   
              <el-form ref="AiConfig.OneSitCfg.RoundOne.TrucoMax" :model="AiConfig.OneSitCfg.RoundOne.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="我方最大的2张牌得分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.OneSitCfg.RoundOne.TrucoMax.MaxScore" type="number"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="且对方最大的2张牌得分" :required="true">
                    
                        <template>
                          <el-input-number
                            v-model="AiConfig.OneSitCfg.RoundOne.TrucoMax.OtherScore" type="number"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                  </el-form-item>
                </el-col>
                </el-row>
              </el-form>
              <el-form ref="AiConfig.OneSitCfg.RoundOne.TrucoMax" :model="AiConfig.OneSitCfg.RoundOne.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="且我方落后分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.OneSitCfg.RoundOne.TrucoMax.AfterScore"  type="number"
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
                            v-model="AiConfig.OneSitCfg.RoundOne.TrucoMax.Ratio"  type="number"
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
              :data="AiConfig.OneSitCfg.RoundOne.TrucoOther.ScoreFactors"
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
     
    </el-row>
    <el-row style="padding-top: 5px">
      <h3 style="text-align:center;">第二回合</h3>
      <el-row style="padding-top: 5px">
          <fieldset>
            <legend>Truco基础概率</legend>
            <el-table
              :data="AiConfig.OneSitCfg.RoundTwo.Truco"
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
   
              <el-form ref="AiConfig.OneSitCfg.RoundTwo.TrucoMax" :model="AiConfig.OneSitCfg.RoundTwo.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="我方最大的2张牌得分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.OneSitCfg.RoundTwo.TrucoMax.MaxScore" type="number"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="且对方最大的2张牌得分" :required="true">
                    
                        <template>
                          <el-input-number
                            v-model="AiConfig.OneSitCfg.RoundTwo.TrucoMax.OtherScore" type="number"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                  </el-form-item>
                </el-col>
                </el-row>
              </el-form>
              <el-form ref="AiConfig.OneSitCfg.RoundTwo.TrucoMax" :model="AiConfig.OneSitCfg.RoundTwo.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="且我方落后分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.OneSitCfg.RoundTwo.TrucoMax.AfterScore"  type="number"
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
                            v-model="AiConfig.OneSitCfg.RoundTwo.TrucoMax.Ratio"  type="number"
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
              :data="AiConfig.OneSitCfg.RoundTwo.TrucoOther.ScoreFactors"
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
                <el-form ref="AiConfig.OneSitCfg.RoundTwo.TrucoOther" :model="AiConfig.OneSitCfg.RoundTwo.TrucoOther" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="第一回合输概率" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.OneSitCfg.RoundTwo.TrucoOther.OneRoundLoseRatio"  type="number" 
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="第一回合赢概率" :required="true">
                    
                        <template>
                          <el-input-number
                            v-model="AiConfig.OneSitCfg.RoundTwo.TrucoOther.OneRoundWinRatio"  type="number" 
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                  </el-form-item>
                </el-col>
                </el-row>
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
              :data="AiConfig.OneSitCfg.RoundThree.Truco"
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
   
              <el-form ref="AiConfig.OneSitCfg.RoundThree.TrucoMax" :model="AiConfig.OneSitCfg.RoundThree.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="我方最大的1张牌得分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.OneSitCfg.RoundThree.TrucoMax.MaxScore"  type="number"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="且对方最大的1张牌得分" :required="true">
                    
                        <template>
                          <el-input-number
                            v-model="AiConfig.OneSitCfg.RoundThree.TrucoMax.OtherScore"  type="number"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                  </el-form-item>
                </el-col>
                </el-row>
              </el-form>
              <el-form ref="AiConfig.OneSitCfg.RoundThree.TrucoMax" :model="AiConfig.OneSitCfg.RoundThree.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="且我方落后分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.OneSitCfg.RoundThree.TrucoMax.AfterScore"  type="number"
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
                            v-model="AiConfig.OneSitCfg.RoundThree.TrucoMax.Ratio"  type="number"
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
              :data="AiConfig.OneSitCfg.RoundThree.TrucoOther.ScoreFactors"
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
  name: 'RobotAiSettingOne',
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
      OneSitCfg:{
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
            }]
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
            OneRoundWinRatio: 30
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
      handler(newVal) {

        if (!newVal.One) {
          this.editRoundCfg = JSON.parse(JSON.stringify(this.OneSitCfg)) 
           newVal.OneSitCfg= this.editRoundCfg 
          console.log('common truco:', this.AiConfig)       
        }
      }
    }
  },
  methods: {
    
  },
 
}
</script>
