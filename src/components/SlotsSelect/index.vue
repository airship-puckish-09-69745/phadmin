<template class="slots-select">
  <el-form-item label="老虎机类型">
    <el-select v-model.number="slotsType" filterable @change="onChange">
      <el-option v-for="opt in options" :key="opt.value" :label="opt.label" :value="opt.value" />
    </el-select>
  </el-form-item>
</template>
<script>
export default {
  name: 'SlotsSelect',
  model: {
    prop: 'slotsType',
    event: 'cc'
  },
  props: {
    slotsType: {
      type: Number,
      default: 0
    },
    stMap: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      options: [
        /*
        { label: '凤凰老虎机', value: 51 },
        { label: '睡美人老虎机', value: 52 },
        { label: '小丑老虎机', value: 53 },
        { label: '黄金列车老虎机', value: 54 },
        { label: '澳洲老虎机', value: 55 },
        { label: '象鼻神老虎机', value: 56 },
        { label: '黄金矿工老虎机', value: 57 },
        { label: '阿拉丁老虎机', value: 58 },
        { label: '芝加哥黑手党老虎机', value: 59 },
        { label: '粮果派对老虎机', value: 60 },
        { label: 'FireKick老虎机', value: 61 },
        { label: '侏罗纪老虎机', value: 62 },
        { label: '夺宝奇兵老虎机', value: 63 },
        { label: '植物大战僵尸老虎机', value: 64 },
        */
        { label: '糖果传奇Way', value: 76 },
        { label: '糖果传奇Allline', value: 77 },
        { label: 'SuperGems', value: 78 },
        { label: 'SuperGemsMars', value: 81 },
        { label: 'CandyCrazeMars', value: 79 },
        { label: 'CandyCraze', value: 80 },
        { label: 'Millionaire', value: 82 },
        { label: 'MillionaireMars', value: 83 },
        { label: 'FortuneAce', value: 84 },
        { label: 'SuperAce1000', value: 277 },
        { label: 'FortuneAceMars', value: 85 }
      ]
    }
  },
  mounted() {
    this.genMap()
  },
  methods: {
    genMap() {
      for (const i in this.options) {
        this.stMap[this.options[i].value] = this.options[i].label
      }
      console.log('stmap', this.stMap)
    },
    onChange() {
      this.$emit('cc', this.slotsType)
    }
  }
}
</script>
