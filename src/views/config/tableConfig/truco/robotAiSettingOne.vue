<template>
  <div>
    <el-row style="padding-top: 5px">
      <hr class="dashed-line">

      <el-tab-pane label="机器人等级">
         

         <el-row style="padding-top: 5px">
             <fieldset>
               <legend>第一回合</legend>
               <el-table
                 ref="Truco基础概率"  
                 :data="item.RoundCfg.RoundOne.Truco"
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
                   label="Truco概率"
                   width="200"
                 >
                   <template slot-scope="scope">
                     <el-input-number v-model.number="scope.row.Ratio" size="mini" type="number"  :precision="0"><template slot="append">%</template></el-input-number>
                   </template>
                 </el-table-column>
               
               </el-table>
             </fieldset>
           </el-row>
       </el-tab-pane>

    </el-row>
  </div>
</template>
<script>
import tongitsTableRange from '@/components/TongitsTableRange'
import { DataRule } from '@/utils/common'

function newTruco(x,y) {
  return {
   Score: x,
   Ratio: y,
  }
}



export default {
  name: 'RobotAiSettingOne',
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
      RoundCfg:{
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
            OneRounWinRatio: 30
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

        if (!newVal.RoundCfg) {
          this.editRoundCfg = JSON.parse(JSON.stringify(this.RoundCfg)) 
           newVal.RoundCfg= this.editRoundCfg 
          console.log('common truco:', this.AiConfig)       
        }
      }
    }
  },
  methods: {
    
  },
 
}
</script>
