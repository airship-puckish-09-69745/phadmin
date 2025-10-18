<template>
  <div>
    <el-row style="padding-top: 5px">
      <hr class="dashed-line">
      <el-col :span="24">
      <el-form ref="AiConfig.Decision.DecisionFight" :model="AiConfig.Decision.DecisionFight" width="70%">
          <!-- 离桌对局数配置 - 单行展示 -->
          <el-form-item label="单张牌分数：" :required="true">
            <el-row :gutter="16">
              <el-col :span="16">
                <template>
                  <el-input-number
                    v-model="AiConfig.Decision.DecisionFight.SingleCardScore" 
                    :min="0"
                    placeholder="分数"
                    style="width: 100%"> 
      
                  </el-input-number>
                </template>
              </el-col>
             
            </el-row>
          </el-form-item>

        </el-form>
      </el-col>
  
      <el-col :span="24">
        <h3 style="text-align:center;">上家有效牌张数分数配置</h3>
        <div style="padding-top: 10px">
          <el-table
            :data="AiConfig.Decision.DecisionFight.FrontPlayerCardScore"
            stripe
            border
            style="width: 100%"
          >

          <el-table-column
              label="序号"
               width="120"
            >
              <template slot-scope="scope">
                区间{{ getFrontLabel(scope.$index) }} <!-- 从 1 开始计数 -->
              </template>
            </el-table-column>
    
          
            <el-table-column label="分数" align="center">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.Score" size="mini"   :min="0" :max="100"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>


      <el-col :span="24">
        <h3 style="text-align:center;">有效牌张分数区间</h3>
        <div style="padding-top: 10px">
          <el-table
            :data="AiConfig.Decision.DecisionFight.FightList"
            stripe
            border
            style="width: 100%"
          >

          <el-table-column
              label="序号"
               width="120"
            >
              <template slot-scope="scope">
                区间{{ scope.$index + 1 }} <!-- 从 1 开始计数 -->
              </template>
            </el-table-column>
    
          
            <el-table-column label="下限" align="center">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.CardNumBegin" size="mini" :min="0" :max="1000"></el-input-number>
              </template>
            </el-table-column>
            
            <el-table-column label="上限" align="center">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.CardNumEnd" size="mini" :min="0" :max="1000"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>

      <el-col :span="24">
        <h3 style="text-align:center;">轮数概率配置</h3>
        <div style="padding-top: 10px">
          <el-table
            :data="AiConfig.Decision.DecisionFight.DecisionRound"
            stripe
            border
            style="width: 100%"
          >

          <el-table-column
              label="轮数"
               width="120"
            >
              <template slot-scope="scope">
                {{ getRoundName(scope.row.RoundId) }}
              </template>
            </el-table-column>

            <el-table-column label="每轮Tongits减少Fight概率" align="center" >
              <template slot-scope="scope">
                <el-table :data="scope.row.ContributeCardList" border style="width: 100%">
                  <el-table-column
                    label="非可贴散牌张数"
                    width="120"
                  >
                    <template slot-scope="subScope">
                      <span v-if="subScope.row.NoContributeCardNum >= 4"> >= </span>
                      {{ subScope.row.NoContributeCardNum }} 张
                    </template>
                  </el-table-column>
                
                  <el-table-column label="有效牌张分数区间（概率%）" align="center">
                    <el-table-column prop="range1" :label="getColumnLabel(AiConfig.Decision.DecisionFight.FightList[0].CardNumBegin,AiConfig.Decision.DecisionFight.FightList[0].CardNumEnd)" width="170" align="center">
                      <template slot-scope="subScope">
                        <el-input-number v-model="subScope.row.FightRatioList[0]" size="mini" :min="0" :max="100"></el-input-number>
                      </template>
                    </el-table-column>
                    <el-table-column prop="range2" :label="getColumnLabel(AiConfig.Decision.DecisionFight.FightList[1].CardNumBegin,AiConfig.Decision.DecisionFight.FightList[1].CardNumEnd)" width="170" align="center">
                      <template slot-scope="subScope">
                        <el-input-number v-model="subScope.row.FightRatioList[1]" size="mini" :min="0" :max="100" ></el-input-number>
                      </template>
                    </el-table-column>
                    <el-table-column prop="range3" :label="getColumnLabel(AiConfig.Decision.DecisionFight.FightList[2].CardNumBegin,AiConfig.Decision.DecisionFight.FightList[2].CardNumEnd)" width="170" align="center">
                      <template slot-scope="subScope">
                        <el-input-number v-model="subScope.row.FightRatioList[2]" size="mini" :min="0" :max="100"></el-input-number>
                      </template>
                    </el-table-column>
                    <el-table-column prop="range4" :label="getColumnLabel(AiConfig.Decision.DecisionFight.FightList[3].CardNumBegin,AiConfig.Decision.DecisionFight.FightList[3].CardNumEnd)" width="170" align="center">
                      <template slot-scope="subScope">
                        <el-input-number v-model="subScope.row.FightRatioList[3]" size="mini" :min="0" :max="100"></el-input-number>
                      </template>
                    </el-table-column>

                    
                </el-table-column>
              </el-table>
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
  name: 'RobotAiSettingDecisionFight',
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
      DecisionFight:
      {
        SingleCardScore: 3,
        FrontPlayerCardScore:[{Score: 0},{Score: 1},{Score: 2},{Score: 3}],
        FightList:[
          {
            CardNumBegin: 3, // 除以10 实际是1/3
            CardNumEnd: 5,
          },
          {
            CardNumBegin: 5,
            CardNumEnd: 10,
          },
          {
            CardNumBegin: 10,
            CardNumEnd: 20,
          },
          {
            CardNumBegin: 20,
            CardNumEnd: 100,
          }],
        DecisionRound:[
          { 
            RoundId: 2,
            ContributeCardList: [ 
            {
              NoContributeCardNum: 1,
              FightRatioList:[60,60,60,60]
            },
            {
              NoContributeCardNum: 2,
              FightRatioList:[60,60,60,60]
            },
            {
              NoContributeCardNum: 3,
              FightRatioList:[60,60,60,60]
            }, {
              NoContributeCardNum: 4,
              FightRatioList:[60,60,60,60]
            },
          ]
        },
        { RoundId:3,
          ContributeCardList: [ 
            {
              NoContributeCardNum: 1,
              FightRatioList:[60,60,60,60]
            },
            {
              NoContributeCardNum: 2,
              FightRatioList:[60,60,60,60]
            },
            {
              NoContributeCardNum: 3,
              FightRatioList:[60,60,60,60]
            }, {
              NoContributeCardNum: 4,
              FightRatioList:[60,60,60,60]
            },
          ]
        },{ RoundId: 4,
          ContributeCardList: [ 
            {
              NoContributeCardNum: 1,
              FightRatioList:[60,60,60,60]
            },
            {
              NoContributeCardNum: 2,
              FightRatioList:[60,60,60,60]
            },
            {
              NoContributeCardNum: 3,
              FightRatioList:[60,60,60,60]
            }, {
              NoContributeCardNum: 4,
              FightRatioList:[60,60,60,60]
            },
          ]
        },{ RoundId: 5,
          ContributeCardList: [ 
            {
              NoContributeCardNum: 1,
              FightRatioList:[60,60,60,60]
            },
            {
              NoContributeCardNum: 2,
              FightRatioList:[60,60,60,60]
            },
            {
              NoContributeCardNum: 3,
              FightRatioList:[60,60,60,60]
            }, {
              NoContributeCardNum: 4,
              FightRatioList:[60,60,60,60]
            },
          ]
        },{ RoundId: 6,
          ContributeCardList: [ 
            {
              NoContributeCardNum: 1,
              FightRatioList:[60,60,60,60]
            },
            {
              NoContributeCardNum: 2,
              FightRatioList:[60,60,60,60]
            },
            {
              NoContributeCardNum: 3,
              FightRatioList:[60,60,60,60]
            }, {
              NoContributeCardNum: 4,
              FightRatioList:[60,60,60,60]
            },
          ]
        },
        ],
      },
      editFightCfg:{}
      

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

        if (!newVal.Decision.DecisionFight) {
          this.editDecision = JSON.parse(JSON.stringify(this.DecisionFight)) 
          newVal.Decision.DecisionFight = this.DecisionFight 
          console.log('common DecisionFight:', this.AiConfig)       
        }
      }
    }
  },
  methods: {
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
    getColumnLabel(start, end) {
      return `[${start},${end})`;
    },
    getFrontLabel(index) {
      switch (index) {
        case 0:return  "上家有效牌分数1-3";
        case 1:return  "上家有效牌分数4-6"
        case 2:return  "上家有效牌分数7-9"
        case 3:return  "上家有效牌分数10-k"
      }
    }
  },
 
}
</script>
