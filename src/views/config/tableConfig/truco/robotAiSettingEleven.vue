<template>
  <div>
    <el-row style="padding-top: 5px">
        
        <el-table
              :data="AiConfig.ElevenScore"
              border
              style="width: 100%"
            >
            <el-table-column
                label="我方最大2张牌得分(>=)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.Score" size="mini" type="number"  :precision="0"></el-input-number>
                </template>
              </el-table-column>

              <el-table-column
                label="《高牌力 || 当前对手得分<8》 接受本次发牌概率 (%)"
                width="200"
              >
                <template slot-scope="scope">
                  <el-input-number v-model.number="scope.row.AcceptRatio" size="mini" type="number"  :precision="0"></el-input-number>
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
  name: 'RobotAiSettingEleven',
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
      ElevenScore:[{
        Score: 90,
        AcceptRatio: 100,
        }, {
          Score: 70,
          AcceptRatio: 60,
        }, {
          Score: 50,
          AcceptRatio: 10,
        }
    ],
 
      editElevenScore:{}
      

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

        if (!newVal.ElevenScore) {
          this.editElevenScore = JSON.parse(JSON.stringify(this.ElevenScore)) 
           newVal.ElevenScore= this.editElevenScore 
          console.log('common truco:', this.AiConfig)       
        }
      }
    }
  },
  methods: {
    
  },
 
}
</script>
