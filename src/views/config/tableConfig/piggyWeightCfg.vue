<template>
  <div class="app-container">

    <p>{{ title }}</p>
    <el-button
        size="mini"
        type="primary"
        @click="doAdd"
        v-if="piggyCfg.length<=0"
    >添加</el-button>
    <el-table
      ref="filterTable"
      :data="piggyCfg"
      border
      :header-cell-style="libShow.DefaultTableHeadClass"
      :row-style="{height:'10px'}"
      :cell-style="libShow.DefaultTableCell"
      style="width: 100%"
    >
      <el-table-column :label="tableTitle">
        <el-table-column
          type="index"
        />
        <el-table-column
          prop="Weight"
          :label="weightName"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Weight" size="mini" oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};" />
          </template>
        </el-table-column>

        <el-table-column v-if="selectType" label="类型">
          <template slot-scope="scope" >
          <el-select v-model.number="scope.row.Typ" placeholder="请选择" size="mini">
            <el-option label="次数" :value="4" />
            <el-option label="倍数" :value="5" />
          </el-select>
          </template>
        </el-table-column>

        <!--val:类型 / 值-->
        <el-table-column
          v-if="valType=='0'||valType=='1'"
          prop="Val"
          :label="valName"
        >
          <template slot-scope="scope">
            <span v-if="valType=='0'">
              <el-select v-model.number="scope.row.Val" placeholder="请选择" size="mini">
                <el-option label="空" :value="0" />
                <el-option label="金币" :value="1" />
                <el-option label="磁铁" :value="2" />
                <el-option v-if="valName!=='中奖类型'" label="闪电" :value="3" />
                <el-option v-if="valName!=='中奖配置'" label="F次数" :value="4" />
                <el-option v-if="valName!=='中奖配置'" label="N倍数" :value="5" />
                <el-option label="JP" :value="10" />
              </el-select>
            </span>
            <span v-if="valType=='1'">
              <el-input v-model.number="scope.row.Val" type="number" size="mini" oninput="if(value == '' || value == null || value == 'NAN'){value = 0;};" />
            </span>
          </template>
        </el-table-column>

        <!--val:区间-->
        <el-table-column
            v-if="valType=='2'"
            prop="Val"
            :label="valNameMin"
        >
          <template slot-scope="scope">
            <span>
              <el-input v-model.number="scope.row.ValMin" type="number" size="mini" oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};" />
            </span>
          </template>
        </el-table-column>
        <el-table-column
            v-if="valType=='2'"
            prop="Val"
            :label="valNameMax"
        >
          <template slot-scope="scope">
            <span>
              <el-input v-model.number="scope.row.ValMax" type="number" size="mini" oninput="if(value < 0 || value == '' || value == null || value == 'NAN'){value = 0;};" />
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="doAdd"
            >添加</el-button>
            <el-button type="danger" size="mini" @click="delRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>

import { $libShow } from '@/utils/common'
import { Message } from 'element-ui'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'PiggyWeightCfg',
  components: {},
  props: {
    tableTitle: {
      type: String,
      default: function() {
        return ''
      }
    },
    valName: {
      type: String,
      default: function() {
        return '中奖配置'
      }
    },
    valNameMin: {
      type: String,
      default: function() {
        return '[min'
      }
    },
    valNameMax: {
      type: String,
      default: function() {
        return 'max]'
      }
    },
    valType: {
      type: String,
      default: function() {
        return '0'
      }
    },
    weightName: {
      type: String,
      default: function() {
        return '权重'
      }
    },
    title: {
      type: String,
      default: function() {
        return ''
      }
    },
    piggyCfg: {
      type: Array,
      default: function() {
        return []
      }
    },
    selectType: {
      type: Boolean,
      default: function() {
        return false
      }
    }
  },
  data() {
    return {
      libShow: $libShow
    }
  },

  watch: {
    'piggyCfg': {
      deep: true,
      handler: function(val) {
        this.initData(val)
      }
    },
    'tableTitle': {
      deep: true,
      handler: function(val) {
        this.initData(val)
      }
    },
    'valType': {
      deep: true,
      handler: function(val) {
        this.initData(val)
      }
    },
    'weightName': {
      deep: true,
      handler: function(val) {
        this.initData(val)
      }
    },
    'valName': {
      deep: true,
      handler: function(val) {
        this.initData(val)
      }
    },
    'title': {
      deep: true,
      handler: function(val) {
        this.initData(val)
      }
    },
    'selectType': {
      deep: true,
      handler: function(val) {
        this.initData(val)
      }
    },
  },
  created() {
    this.initData()
  },
  methods: {
    initData(val) {
    },
    doAdd() {
      this.piggyCfg.push({ Weight: 0, Val: 0 })
    },
    delRow(index) {
      if (this.piggyCfg.length <= 1) {
        Message.error('再删就没了')
        return
      }
      this.piggyCfg.splice(index, 1)
    }
  }
}
</script>
