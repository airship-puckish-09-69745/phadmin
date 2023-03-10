<template>
  <el-form-item label="支付渠道">
    <el-select v-model="payChannel" :multiple="mul" :filterable="filter" size="mini" @change="change">
      <el-option label="所有" :value="0" />
      <el-option
        v-for="item in options"
        :key="item.ID"
        :label="item.Name"
        :value="item.ID"
      >
        <span style="float: left">{{ item.Name }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.Plat }}</span>
      </el-option>
    </el-select>

  </el-form-item>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'PayChannel',
  model: {
    prop: 'payChannel',
    event: 'cc'
  },
  props: {
    payChannel: {
      type: Number,
      default: 0
    },
    mul: {
      type: Boolean,
      default: false
    },
    filter: {
      type: Boolean,
      default: false
    },
    channelMap: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      options: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const $this = this
      request({
        url: '/payconfig/all',
        method: 'get',
        data: {
          Type: 0,
          platform: ""
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const items = response.Data || []
          $this.options = []
          for (const i in items) {
            $this.options.push({ Plat: items[i].platform, ID: items[i].payChannel, Name: items[i].payChannelName })
            $this.channelMap[items[i].payChannel] = items[i].payChannelName
          }
        }
      })
    },
    change() {
      console.log('select channel ', this.payChannel)
      this.$emit('cc', this.payChannel)
    }
  }
}
</script>
