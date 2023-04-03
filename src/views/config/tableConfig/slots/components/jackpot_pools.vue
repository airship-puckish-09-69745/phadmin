<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="6">
        <el-form label-width="150px">
          <template v-for="(item, key) in jackpotPools">
            <el-form-item :label="key">
              <el-input :value="item" :label="key" :readonly="true" :disabled="disabled"></el-input>
            </el-form-item>
          </template>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col style="margin-left:150px;">
        <el-button @click="reload">刷新数据</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import request from "@/utils/request";

export default {
  name: 'SlotsJackpotPools',
  model: {
    prop: 'slotId',
    event: 'cc'
  },
  data: function() {
    return {
      disabled: false,
      jackpotPools: {
        'Jackpot1': 0,
        'Jackpot2': 0,
        'Jackpot3': 0,
        'Jackpot4': 0,
        'Jackpot5': 0,
        'Jackpot6': 0
      }
    }
  },
  props: {
    slotId: Number
  },
  created() {
    this.reload()
  },
  methods: {
    reload: function() {
      this.disabled = true
      request({
        url: '/other/slots/jackpot/pools',
        method: 'get',
        data: {
          SlotType: this.slotId
        }
      }).then(response => {
        this.disabled = false
        if (response.RetCode === 0) {
          for (let k in response.Data) {
            this.jackpotPools[k] = response.Data[k] / 1000
          }
        } else {
          this.$message.error(response.Data)
        }
      })
    }
  }
}
</script>
