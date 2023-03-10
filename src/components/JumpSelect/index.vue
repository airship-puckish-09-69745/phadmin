<template>
  <div class="jump-select">
    <el-select v-model="jumpToIndex" filterable placeholder="placeholder" @change="onChange">
      <el-option
        v-for="(item,index) in jumpToArray"
        :key="index"
        :label="item[2]"
        :value="index"
      />
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'JumpSelect',
  model: {
    prop: 'jumpTo',
    event: 'cc'
  },
  props: ['jumpTo'],
  data() {
    return {
      jumpToArray: [
        [0, 0, '无'],
        [1, 0, '大厅']
      ],
      jumpToIndex: 0
    }
  },
  watch: { // 监听值变化：map值
    jumpTo: function() {
      if (this.jumpTo == '') {
        this.jumpToIndex = 0
      } else {
        const jumpObj = JSON.parse(this.jumpTo)
        for (let i = 0; i < this.jumpToArray.length; i++) {
          const obs = this.jumpToArray[i]
          if (obs[0] == jumpObj.Main && obs[1] == jumpObj.Sub) {
            this.jumpToIndex = i
          }
        }
      }
    }
  },
  mounted() { // 页面初始化方法
    if (this.jumpTo == '') {
      this.jumpToIndex = 0
    } else {
      const jumpObj = JSON.parse(this.jumpTo)
      for (let i = 0; i < this.jumpToArray.length; i++) {
        const obs = this.jumpToArray[i]
        if (obs[0] == jumpObj.Main && obs[1] == jumpObj.Sub) {
          this.jumpToIndex = i
        }
      }
    }
  },
  methods: {
    onChange() {
      const jumpObj = {}
      jumpObj.Main = this.jumpToArray[this.jumpToIndex][0]
      jumpObj.Sub = this.jumpToArray[this.jumpToIndex][1]
      // console.log('jump index ', this.jumpToIndex)
      this.jumpTo = JSON.stringify(jumpObj)
      this.$emit('cc', this.jumpTo)
    }
  }
}
</script>
