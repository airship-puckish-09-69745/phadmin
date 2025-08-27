<template>
  <div>
    <el-row style="padding-top: 5px">
      <h3 style="text-align:center;">优先决策配置</h3>
      <el-row :gutter="12">
        <el-col :span="16">
          <el-row>
            <el-form-item 
            label="自己必胜fight/Challenge概率："  
            :rules="dataRule(true,{type:'n',range:'0'})" 
            >
              <el-input v-model.number="AiConfig.Decision.Priority.WinRatio" size="mini" style="width: 200px"  placeholder="0-100" type="number"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item 
            label="自己必败不fight/Challenge概率："  
            :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="AiConfig.Decision.Priority.LoseRato" size="mini" style="width: 200px"  placeholder="0-100" type="number" ><template slot="append">%</template></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item 
            label="第2轮决策全场未亮fight概率："
            :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="AiConfig.Decision.Priority.TwoRoundFightRatio" size="mini" style="width: 200px"  placeholder="0-100" type="number"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item 
            label="第3轮决策全场未亮fight概率："
            :rules="dataRule(true,{type:'n',range:'0'})"
            >
              <el-input v-model.number="AiConfig.Decision.Priority.ThreeRoundFightRatio" size="mini" style="width: 200px"  placeholder="0-100" type="number" ><template slot="append">%</template></el-input>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-row>
    <el-row style="padding-top: 5px">
      <hr class="dashed-line">
      <h3 style="text-align:center;">决策修正配置</h3>
      <el-row :gutter="12">
        <el-col :span="16">
          <el-row>
            <el-form-item 
              label="Fight修正"
              :rules="dataRule(true,{type:'n',range:'0'})"
              >
              <el-input v-model.number="AiConfig.Decision.RobotCorrect.FightRatio" size="mini" style="width: 200px"  placeholder="0-100"  type="number" ><template slot="append">%</template></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item 
              label="Challenge修正"   
              :rules="dataRule(true,{type:'n',range:'0'})"
              >
              <el-input v-model.number="AiConfig.Decision.RobotCorrect.ChallengeRatio" size="mini" style="width: 200px"  placeholder="0-100" type="number" ><template slot="append">%</template></el-input>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-row>
    <el-row style="padding-top: 5px">
      <hr class="dashed-line">
      <h3 style="text-align:center;">常规决策配置</h3>
      <el-col :span="24">
        <div style="padding-top: 10px">
        
          <el-table
            :data="AiConfig.Decision.Standard"
            stripe
            border
            style="width: 100%"
          >
            <el-table-column
              label="条件"
               width="120"
            >
              <template slot-scope="scope">
                {{ getRoundName(scope.row.RoundId) }}
              </template>
            </el-table-column>

            <el-table-column
              label="配置分数（注: 每行操作概率为机器人手牌总分<=“配置分数”的操作概率）"
            >
              <template slot-scope="scope">
                <el-table :data="scope.row.List" border>
                  <el-table-column label="分数">
                    <template scope="subScope">
                      <el-input v-model.number="subScope.row.Score"  placeholder="0-100" type="number" />
                    </template>
                  </el-table-column>
                  <el-table-column label="Fight">
                    
                    <template scope="subScope" >
                        <el-input v-model.number="subScope.row.FightRatio" placeholder="0-100" type="number"><template slot="append">%</template></el-input>
                    </template>
                  
                  </el-table-column>
                  <el-table-column label="Challenge">
                    <template scope="subScope">
                      <el-input v-model.number="subScope.row.ChallengeRatio" placeholder="0-100" type="number"><template slot="append">%</template></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作">
                    <template slot-scope="subScope">
                      <div style="display: flex; gap: 8px">
                        <el-button
                        size="mini"
                        type="primary"
                        @click="addRobotDecisionButton(scope.row.RoundId)"
                        >
                          添加
                        </el-button>
                        <el-button
                          size="mini"
                          type="danger"
                          @click="delRobotDecisionRow(scope.row.RoundId, subScope.$index)"
                        >删除</el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <el-row style="padding-top: 5px">
      <hr class="dashed-line">
      <h3 style="text-align:center;">其他因素配置</h3>
      <el-col :span="24">
        <div style="padding-top: 10px">
          <el-table
            :data="AiConfig.Decision.Other"
            stripe
            border
            style="width: 100%"
          >
          <el-table-column
              label="类型"
                width="80"
            >
              <template slot-scope="scope">
                {{ scope.row.DecisionType }}
              </template>
            </el-table-column>
            <el-table-column
              label="条件"
                width="200"
            >
              <template slot-scope="scope">
                {{ getOtherName(scope.row.DecisionType) }}
              </template>
            </el-table-column>

            <el-table-column
              label="Fight"
              column-key="op"
              width="150"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.FightRatio" placeholder="0-100" type="number"><template slot="append">%</template></el-input>
              </template>
            </el-table-column>

            <el-table-column
              label="Challenge"
              column-key="op"
              width="150"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.ChallengeRatio" placeholder="0-100" type="number" ><template slot="append">%</template></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row> 

  </div>
</template>
<script>
import tongitsTableRange from '@/components/TongitsTableRange'
import { DataRule } from '@/utils/common'



export default {
  name: 'RobotAiSettingDecision',
  components: { tongitsTableRange },
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
      RoundNameList:[
        { RoundId: 2, RoundName: "第2轮决策" },
        { RoundId: 3, RoundName: "第3轮决策"},
        { RoundId: 4, RoundName: "第4轮决策"},
        { RoundId: 5, RoundName: "第5轮决策"},
        { RoundId: 6, RoundName: "第>=6轮决策"},
      ],
      otherList:[
          {DecisionType: 1, Name: "敌人手牌比自己的散牌少（每少1张）"},
          {DecisionType: 2, Name: "敌人手牌比自己的散牌多（每多1张）"},
          {DecisionType: 3, Name: "手中Bonus牌数"},
          {DecisionType: 4, Name: "每个未放牌敌人"}
      ],
      Decision:{ // 机器人决策配置
        Priority:{
          WinRatio: 90,
          LoseRato: 90,
          TwoRoundFightRatio: 90,
          ThreeRoundFightRatio: 90,
        },
        Standard:[
          { RoundId: 2,List:[
            {
              Score: 60,
              FightRatio: 60,
              ChallengeRatio:60

            }]
          },
          { RoundId: 3 ,List:[
            {
              Score: 60,
              FightRatio: 60,
              ChallengeRatio:60

            }]
          },
          { RoundId: 4 ,List:[
            {
              Score: 60,
              FightRatio: 60,
              ChallengeRatio:60

            }]
          },
          { RoundId: 5 , List:[
            {
              Score: 60,
              FightRatio: 60,
              ChallengeRatio:60

            }]
          },
          { RoundId: 6,List:[
            {
              Score: 60,
              FightRatio: 60,
              ChallengeRatio:60

            }]
          },
        ],
        Other:[
          {DecisionType: 1, FightRatio: 60, ChallengeRatio:60},
          {DecisionType: 2, FightRatio: 60, ChallengeRatio:60},
          {DecisionType: 3, FightRatio: 60, ChallengeRatio:60},
          {DecisionType: 4, FightRatio: 60, ChallengeRatio:60}
        ],
        RobotCorrect:{
          FightRatio: 60, ChallengeRatio:60
        },
      },
      editDecision:{}
    }
   
  },

  created() {
  
    this.$nextTick(() => {
      // if (!this.AiConfig.hasOwnProperty('Decision')) {
      //   this.AiConfig.Decision = this.Decision
      // }

      console.log('common plugin decision tongitsConfig:', this.AiConfig)       
      
    })
  },
  watch: {
    AiConfig: {
      immediate: true,
      handler(newVal) {
        if (!newVal.Decision) {
          this.editDecision = JSON.parse(JSON.stringify(this.Decision)) 
          newVal.Decision = this.editDecision 
          console.log('common plugin ffffff tongitsConfig:', this.AiConfig)       
        }
      }
    }
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },

    delRobotDecisionRow(roundId, index) {
      console.log("row",roundId)
      console.log("index",index)
      for (let i = 0; i < this.AiConfig.Decision.Standard.length; i++) {
        const tmp = this.AiConfig.Decision.Standard[i]
        if (tmp.RoundId == roundId) {
          this.AiConfig.Decision.Standard[i].List.splice(index, 1)
        }
      }
    },
    addRobotDecisionButton(roundId) {
      for (let i = 0; i < this.AiConfig.Decision.Standard.length; i++) {
        const tmp = this.AiConfig.Decision.Standard[i]
        if (tmp.RoundId === roundId) {
          this.AiConfig.Decision.Standard[i].List.push({
            Score: 0,
            FightRatio: 0,
            ChallengeRatio: 0
          })
          break
        }
      }
    },

    getRoundName(roundId) {
      let RoundName = ""
      for (let i = 0; i < this.RoundNameList.length; i++) {
        if (roundId === this.RoundNameList[i].RoundId) {
          RoundName =  this.RoundNameList[i].RoundName
          break
        }
      }
      return RoundName
    },
    getOtherName(decisionType) {
      let name = ""
      for (let i = 0; i < this.otherList.length; i++) {
        if (decisionType === this.otherList[i].DecisionType) {
          name =  this.otherList[i].Name
          break
        }
      }
      return name
    }
 
    
  }
}
</script>
