<template>
  <div>
    <el-row style="padding-top: 5px">
      <hr class="dashed-line">
      <h3 style="text-align:center;">TongitsFight配置</h3>
      <el-col :span="24">
        <div style="padding-top: 10px">
          <el-table
            :data="AiConfig.Decision.DecisionFight"
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

            <el-table-column label="牌张配置" align="center" >
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
                
                  <el-table-column label="有效牌张数" align="center">
                    <el-table-column prop="range1" label="[1/3,1/2)" width="170" align="center">
                      <template slot-scope="subScope">
                        <el-input-number v-model="subScope.row.List[0].FightRatio" size="mini" :min="0" :max="100"></el-input-number>
                      </template>
                    </el-table-column>
                    <el-table-column prop="range2" label="[1/2,1)" width="170" align="center">
                      <template slot-scope="subScope">
                        <el-input-number v-model="subScope.row.List[1].FightRatio" size="mini" :min="0" :max="100" ></el-input-number>
                      </template>
                    </el-table-column>
                    <el-table-column prop="range3" label="[1,2)" width="170" align="center">
                      <template slot-scope="subScope">
                        <el-input-number v-model="subScope.row.List[2].FightRatio" size="mini" :min="0" :max="100"></el-input-number>
                      </template>
                    </el-table-column>
                    <el-table-column prop="range4" label=">=2" width="170" align="center">
                      <template slot-scope="subScope">
                        <el-input-number v-model="subScope.row.List[3].FightRatio" size="mini" :min="0" :max="100"></el-input-number>
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
      DecisionFight:[
          { RoundId: 2,
            ContributeCardList: [ 
              {
                NoContributeCardNum: 0,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
              {
                NoContributeCardNum: 1,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
              {
                NoContributeCardNum: 2,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
              {
                NoContributeCardNum: 3,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              }, {
                NoContributeCardNum: 4,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
            ]
          },
          { RoundId:3,
            ContributeCardList: [ 
              {
                NoContributeCardNum: 0,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
              {
                NoContributeCardNum: 1,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
              {
                NoContributeCardNum: 2,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
              {
                NoContributeCardNum: 3,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              }, {
                NoContributeCardNum: 4,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
            ]
          },{ RoundId: 4,
            ContributeCardList: [ 
              {
                NoContributeCardNum: 0,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
              {
                NoContributeCardNum: 1,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
              {
                NoContributeCardNum: 2,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
              {
                NoContributeCardNum: 3,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              }, {
                NoContributeCardNum: 4,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
            ]
          },{ RoundId: 5,
            ContributeCardList: [ 
              {
                NoContributeCardNum: 0,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
              {
                NoContributeCardNum: 1,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
              {
                NoContributeCardNum: 2,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
              {
                NoContributeCardNum: 3,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              }, {
                NoContributeCardNum: 4,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
            ]
          },{ RoundId: 6,
            ContributeCardList: [ 
              {
                NoContributeCardNum: 0,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
              {
                NoContributeCardNum: 1,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
              {
                NoContributeCardNum: 2,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
              {
                NoContributeCardNum: 3,
                List:[
                  {
                    CardNumBegin: 3,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    FightRatio: 60,
                  }

                ]
              }, {
                NoContributeCardNum: 4,
                List:[
                  {
                    CardNumBegin: 3, // 除以10 实际是1/3
                    CardNumEnd: 5,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 5,
                    CardNumEnd: 10,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 10,
                    CardNumEnd: 20,
                    FightRatio: 60,
                  },
                  {
                    CardNumBegin: 20,
                    CardNumEnd: 100,
                    FightRatio: 60,
                  }

                ]
              },
            ]
          },
      ],

    
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
      deep: true,
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
  }
}
</script>
