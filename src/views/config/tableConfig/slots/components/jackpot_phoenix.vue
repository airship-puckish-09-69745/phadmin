<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="6">
        <el-form>
          <el-form-item label="每秒最小增加值">
            <el-input v-model="cfg.JackpotExtendConfig.PerHourAddMoneyMin"></el-input>
          </el-form-item>
          <el-form-item label="每秒最大增加值">
            <el-input v-model="cfg.JackpotExtendConfig.PerHourAddMoneyMax"></el-input>
          </el-form-item>
        </el-form>
        <el-col style="margin-left:150px;">
          <el-button @click="submitFrm">保存</el-button>
        </el-col>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form style="margin-top: 50px;">
          <el-form-item label="筹码级别">
            <el-select v-model="hitBet" placeholder="请选择">
              <el-option
                v-for="item in slotsData.BetList"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-button @click="hit">机器人命中</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>
<script>
import request from "@/utils/request";
import Compare from '@/components/Compare'
import store from "@/store";

export default {
  name: 'SlotsJackpotPhoenix',
  components: { Compare },
  model: {
    prop: 'slotsData',
    event: 'cc'
  },
  props: {
    slotsData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  watch: {
    'slotsData.ExtendConfig': {
      deep: true,
      handler: function(val) {
        // console.log('wild pattern symbol list watch', val)
        this.initData()
      }
    },
  },
  data: function() {
    return {
      disabled: false,
      form:{
        min:0,
        max:0,
      },
      hitBet:0,
      jackpotRecord: [],
      cfg:{
        JackpotExtendConfig:{
          PerHourAddMoneyMin:0,
          PerHourAddMoneyMax:0
        }
      }
    }
  },
  created() {
    // this.initData()
  },
  methods: {
    getDiffData() {
      if (this.slotsData.ExtConfig) {
        const tmp = JSON.parse(this.slotsData.ExtConfig)
        return tmp.JackpotExtendConfig
      } else {
        return {}
      }
    },
    initData() {
      if (this.slotsData.ExtConfig) {
        this.cfg = JSON.parse(this.slotsData.ExtConfig)
        this.$refs.compare.SetOldVal(this.getDiffData())
        this.lock = true
      }
      console.log("slots data999999",this.slotsData);
      // this.betLists = this.slotsData.BetList;
    },
    submitFrm() {
      if (!this.setData()) {
        return
      }

      const $this = this
      this.$refs.compare.SetNewVal(this.getDiffData())
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          $this.$message.error('没有任何修改，不需要提交')
          return
        }

        $this.$emit('saveData')
        $this.lock = false
      })
    },
    hit: function() {
      if(this.hitBet == 0){
        this.$message.error("筹码级别为0")
        return
      }
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Path: '/slotsStat/robot/hit',
          Env: store.getters.env,
          Bet: this.hitBet*1000,
          SlotsType:51,
        }
      }).then(response => {
        console.log("robot hit response:",response)
        if (response.RetCode === 0) {
          this.$message.success("命中成功")
        } else {
          this.$message.error(response.Data)
        }
      })
    },
    setData() {
      this.slotsData.ExtConfig = JSON.stringify(this.cfg)
      return true
    }
  }
}
</script>
