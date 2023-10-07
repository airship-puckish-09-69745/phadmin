<template>
  <div>
    <el-table :data="rangeList" border>
      <el-table-column :label="getLabelName(1)">
        <template scope="scope">
          <el-input v-model.number="scope.row.Start" />
        </template>
      </el-table-column>
      <el-table-column :label="getLabelName(2)">
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
            type="danger"
            @click="delRow(scope.$index,scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px">
      <el-button type="primary" @click="addRow()">添加</el-button>
    </div>
  </div>
</template>
<script>

export default {
  name: 'TongitsTableRange',
  model: {
    prop: 'rangeList',
    event: 'cc'
  },
  // eslint-disable-next-line vue/require-prop-types
  props: {
    rangeList: {
      type: Array,
      default: function() {
        return []
      }
    },
    labelName: {
      type: String,
      default: '点数'
    }
  },
  data() {
    return {

    }
  },
  watch: {
  	'rangeList': {
      deep: true,
      handler: function(val) {

      }
    },
    'labelName': {
      deep: true,
      handler: function(val) {

      }
    }
  },
  created() {

  },
  methods: {
    getLabelName(flag) {
      if (flag == 1) {
        return this.labelName + '最小'
      }
      return this.labelName + '最大'
    },
    delRow(index, row) {
      this.rangeList.splice(index, 1)
    },
    addRow() {
      this.rangeList.push({
        Start: 0,
        End: 0,
        Percent: 0
      })
    }
  }
}
</script>
