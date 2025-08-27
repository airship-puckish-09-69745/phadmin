<template>
  <div>
    <el-row style="padding-top: 5px">
      <el-form ref="AiConfig.CheatCfg" :model="AiConfig.CheatCfg" width="70%">
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="作弊概率(%)" :required="true">
                  <template>
                    <el-input-number
                      v-model="AiConfig.CheatCfg.Ratio" type="number"
                      style="width: 100%"> 
                    </el-input-number>
                  </template>
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
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
      CheatCfg:{
        Ratio: 20,
      },
 
      editCheatCfg:{}
      

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

        if (!newVal.CheatCfg) {
          this.editCheatCfg = JSON.parse(JSON.stringify(this.CheatCfg)) 
           newVal.CheatCfg= this.editCheatCfg 
          console.log('common truco:', this.AiConfig)       
        }
      }
    }
  },
  methods: {
    
  },
 
}
</script>
