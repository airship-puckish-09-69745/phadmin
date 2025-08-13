<template>
  <div>
    <el-row style="padding-top: 5px">
      <h3 style="text-align:center;">第一回合</h3>
      <el-row style="padding-top: 5px">
          <fieldset>
            <legend>Truco基础概率</legend>
            <el-table
              :data="AiConfig.FourSitCfg.RoundOne.Truco"
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
   
              <el-form ref="AiConfig.FourSitCfg.RoundOne.TrucoMax" :model="AiConfig.FourSitCfg.RoundOne.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="我方最大的2张牌得分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.FourSitCfg.RoundOne.TrucoMax.MaxScore" type="number"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="且对方最大的2张牌得分" :required="true">
                    
                        <template>
                          <el-input-number
                            v-model="AiConfig.FourSitCfg.RoundOne.TrucoMax.OtherScore" type="number"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                  </el-form-item>
                </el-col>
                </el-row>
              </el-form>
              <el-form ref="AiConfig.FourSitCfg.RoundOne.TrucoMax" :model="AiConfig.FourSitCfg.RoundOne.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="且我方落后分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.FourSitCfg.RoundOne.TrucoMax.AfterScore" type="number"
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
                            v-model="AiConfig.FourSitCfg.RoundOne.TrucoMax.Ratio" type="number"
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
              :data="AiConfig.FourSitCfg.RoundOne.TrucoOther.ScoreFactors"
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
                <el-row>
          <fieldset>
            <legend>对手因素</legend>
                <el-form ref="AiConfig.FourSitCfg.RoundOne.TrucoOther" :model="AiConfig.FourSitCfg.RoundOne.TrucoOther" width="70%">
                  <el-col :span="8">
                    <el-form-item label="对手已经绝对大牌且第一回合自己赢Truco概率(%)" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.FourSitCfg.RoundOne.TrucoOther.OutMaxRato"  type="number"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
              
              </el-form>

          </fieldset>
        </el-row>
        </fieldset>

        <fieldset>
          <legend>出牌</legend>
          <el-row>
            <el-form ref="AiConfig.FourSitCfg.RoundOne.OutCard" :model="AiConfig.FourSitCfg.RoundOne.OutCard" width="70%">
                  <el-col :span="8">
                    <el-form-item label="队友已出牌得分(>=)" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.FourSitCfg.RoundOne.OutCard.TeamOuCardScore"  type="number"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
              
              </el-form>
          </el-row>
        </fieldset>
      </el-row>
     
    </el-row>
    <el-row style="padding-top: 5px">
      <h3 style="text-align:center;">第二回合</h3>
      <el-row style="padding-top: 5px">
          <fieldset>
            <legend>Truco基础概率</legend>
            <el-table
              :data="AiConfig.FourSitCfg.RoundTwo.Truco"
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
   
              <el-form ref="AiConfig.FourSitCfg.RoundTwo.TrucoMax" :model="AiConfig.FourSitCfg.RoundTwo.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="我方最大的2张牌得分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.FourSitCfg.RoundTwo.TrucoMax.MaxScore" type="number"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="且对方最大的2张牌得分" :required="true">
                    
                        <template>
                          <el-input-number
                            v-model="AiConfig.FourSitCfg.RoundTwo.TrucoMax.OtherScore" type="number"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                  </el-form-item>
                </el-col>
                </el-row>
              </el-form>
              <el-form ref="AiConfig.FourSitCfg.RoundTwo.TrucoMax" :model="AiConfig.FourSitCfg.RoundTwo.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="且我方落后分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.FourSitCfg.RoundTwo.TrucoMax.AfterScore" type="number"
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
                            v-model="AiConfig.FourSitCfg.RoundTwo.TrucoMax.Ratio" type="number"
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
              <el-row>
                <fieldset>
                  <legend>比分因素</legend>
            
                <el-table
              :data="AiConfig.FourSitCfg.RoundTwo.TrucoOther.ScoreFactors"
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
            </fieldset>
          </el-row>
          <fieldset>
            <legend>回合输赢因素</legend>
              <el-row>
                <el-form ref="AiConfig.FourSitCfg.RoundTwo.TrucoOther" :model="AiConfig.FourSitCfg.RoundTwo.TrucoOther" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="第一回合输概率" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.FourSitCfg.RoundTwo.TrucoOther.OneRoundLoseRatio"  type="number" 
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="第一回合赢概率" :required="true">
                    
                        <template>
                          <el-input-number
                            v-model="AiConfig.FourSitCfg.RoundTwo.TrucoOther.OneRoundWinRatio"  type="number" 
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                  </el-form-item>
                </el-col>
                </el-row>
              </el-form>
            </el-row>
          </fieldset>

          <fieldset>
            <legend>对手因素</legend>
              <el-row>
                <el-form ref="AiConfig.FourSitCfg.RoundTwo.TrucoOther" :model="AiConfig.FourSitCfg.RoundTwo.TrucoOther" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="对手已出绝对大牌Truco概率" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.FourSitCfg.RoundTwo.TrucoOther.OneWinAndOutMaxRatio"  type="number" 
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
              <el-form ref="AiConfig.FourSitCfg.RoundThree.TrucoMax" :model="AiConfig.FourSitCfg.RoundThree.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="我方最大的1张牌得分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.FourSitCfg.RoundThree.TrucoMax.MaxScore"  type="number" 
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="且对方最大的1张牌得分" :required="true">
                    
                        <template>
                          <el-input-number
                            v-model="AiConfig.FourSitCfg.RoundThree.TrucoMax.OtherScore"  type="number" 
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                  </el-form-item>
                </el-col>
                </el-row>
              </el-form>
              <el-form ref="AiConfig.FourSitCfg.RoundThree.TrucoMax" :model="AiConfig.FourSitCfg.RoundThree.TrucoMax" width="70%">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-form-item label="且我方落后分" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.FourSitCfg.RoundThree.TrucoMax.AfterScore"  type="number" 
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
                            v-model="AiConfig.FourSitCfg.RoundThree.TrucoMax.Ratio"  type="number" 
                            placeholder="概率"
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                  </el-form-item>
                </el-col>
                </el-row>
              </el-form>
              <el-form ref="AiConfig.FourSitCfg.RoundThree" :model="AiConfig.FourSitCfg.RoundThree" width="70%">
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="队友已出牌或自己手牌比对手牌大Truco概率" :required="true">
                        <template>
                          <el-input-number
                            v-model="AiConfig.FourSitCfg.RoundThree.MaxCardRatio"  type="number" 
                            style="width: 100%"> 
                          </el-input-number>
                        </template>
                    </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :span="12">
                  <el-form-item label="队友已出牌或自己手牌比对手牌小或等于Truco概率" :required="true">
                    
                        <template>
                          <el-input-number
                          v-model="AiConfig.FourSitCfg.RoundThree.MinCardRatio"  type="number" 
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
              :data="AiConfig.FourSitCfg.RoundThree.TrucoOther.ScoreFactors"
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
  name: 'RobotAiSettingThree',
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
      FourSitCfg:{
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
            OutMaxRato: 20,
          },
          OutCard:{
            TeamOuCardScore:20,
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
            OneWinAndOutMaxRatio: 20,
          },
        },
        RoundThree:{
          Truco:[],
          MaxCardRatio: 30,
          MinCardRatio: 30,
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

        if (!newVal.FourSitCfg) {
          this.editRoundCfg = JSON.parse(JSON.stringify(this.FourSitCfg)) 
           newVal.FourSitCfg= this.editRoundCfg 
          console.log('common truco:', this.AiConfig)       
        }
      }
    }
  },
  methods: {
    
  },
 
}
</script>
