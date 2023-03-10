<template>
  <el-form-item :label="title">
    <el-select v-model="gid" :multiple="mul" size="mini" :filterable="filter" @change="change">
      <el-option v-for="item in options" :label="showName(item)" :value="item.ID" />
    </el-select>
  </el-form-item>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'SelectGoods',
  model: {
    prop: 'gid',
    event: 'cc'
  },
  props: {
    gid: {
      type: Number,
      default: 0
    },
    type: {
      type: Number,
      default: 1
    },
    title: {
      type: String,
      default: '选择商品'
    },
    mul: {
      type: Boolean,
      default: false
    },
    filter: {
      type: Boolean,
      default: false
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
      request({
        url: '/goods/all',
        type: 'get'
      }).then(response => {
        console.log('response ', response)
        if (this.type === 0) {
          this.options = response.Data
        } else {
          for (const i in response.Data) {
            if (response.Data[i].Type === this.type) {
              this.options.push(response.Data[i])
            }
          }
        }
      })
    },
    showName(goods) {
      return goods ? goods.ID + '.' + goods.Name : '-'
    },
    change() {
      console.log('select gid ', this.gid)
      this.$emit('cc', this.gid)
    }
  }
}
</script>
