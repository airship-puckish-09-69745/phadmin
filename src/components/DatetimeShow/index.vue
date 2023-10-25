<template>
  <el-popover
    placement="right"
    width="250"
    trigger="hover"
  >
    <el-row>北京时间：<span style="color: blue">{{ time1 }}</span></el-row>
    <!--    <el-row>{{ zoneName }}：{{ time2 }}</el-row>-->
    <span slot="reference">{{ time1 }}</span>
  </el-popover>
</template>

<script>
import { $libDate, $libType } from '@/utils/common'
import Cookies from 'js-cookie'

// 修改对比工具
export default {
  name: 'DateTimeShow',
  props: {
    timestamp: { // 时间戳（秒）
      type: Number,
      default: 0
    },
    showType: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      zoneName: '印度时间',
      zone: 'in'
    }
  },
  computed: {
    showTime() {
      return $libDate.FormateMilisecondStr(this.timestamp * 1000, this.showType)
    },
    time1() {
      return $libDate.FormateMilisecondStrByZone(this.timestamp * 1000, this.showType, 'cn')
    },
    time2() {
      return $libDate.FormateMilisecondStrByZone(this.timestamp * 1000, this.showType, this.zone)
    }
  },
  created() {
    this.initZone()
  },
  mounted() {
  },
  methods: {
    initZone() {
      if (process.env.VUE_APP_PROJECT === 'br') {
        this.zone = 'br'
        this.zoneName = '巴西时间'
      } else {
        this.zone = 'in'
        this.zoneName = '印度时间'
      }
    }
  }
}
</script>

