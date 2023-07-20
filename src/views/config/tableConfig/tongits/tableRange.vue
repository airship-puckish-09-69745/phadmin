<template >
  <el-table :data="rangeList" border>
    <el-table-column label="点数最小" >
      <template scope="scope">
        <el-input v-model.number="scope.row.Start" />
      </template>
    </el-table-column>
    <el-table-column label="点数最大" >
      <template scope="scope">
        <el-input v-model.number="scope.row.End" />
      </template>
    </el-table-column>
    <el-table-column label="概率%">
      <template scope="scope">
        <el-input v-model.number="scope.row.Percent" />
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template scope="scope">
        <el-button
          size="mini"
          type="primary"
            >添加</el-button>
        <el-button
          size="mini"
          type="danger"
            >删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>

export default {
  name: 'TableRange',
  model: {
    prop: 'rangeList',
    event: 'cc'
  },
  // eslint-disable-next-line vue/require-prop-types
  props: {
    rangeList: {
      type: Object,
      default: function() {
        return []
      }
    }
  },
  watch: {
  	'rangeList': {
      deep: true,
      handler: function(val) {

      }
    }
  },
  created() {
    
  },
  data() {
    return {
      rangeList: []
    }
  },
  methods: {
    
  }
}
</script>
