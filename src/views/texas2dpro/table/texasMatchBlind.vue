<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row style="margin-top: 30px">
      <el-col :span="1">
        <el-button size="mini" type="primary" @click="editData()">修改</el-button>
      </el-col>
      <el-col :span="1">
        <el-button size="mini" type="primary" @click="addRows()">添加</el-button>
      </el-col>
      <el-col :span="18">
        <el-button size="mini" type="primary" @click="saveData()">保存</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
      </el-col>
    </el-row>
    <el-table ref="tb" :data="tableData" height="640" stripe border :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'10px'}" :cell-style="libShow.DefaultTableCell" style="width:420px; padding-top: 10px">
      <el-table-column prop="BlindLevel" label="级别" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.blind_level }}
        </template>
      </el-table-column>
      <el-table-column prop="SmallBlind" label="盲注" align="center" width="100">
        <template slot-scope="scope">
          <el-input v-if="isEdit" v-model.number="scope.row.small_blind" />
          <p v-else>{{ scope.row.small_blind }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="Ante" label="前注" align="center" width="100">
        <template slot-scope="scope">
          <el-input v-if="isEdit" v-model.number="scope.row.ante" />
          <p v-else>{{ scope.row.ante }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="RaiseBlindTime" label="升盲" align="center" width="100">
        <template slot-scope="scope">
          <el-input v-if="isEdit" v-model.number="scope.row.raise_blind_time" />
          <p v-else>{{ scope.row.raise_blind_time }}</p>
        </template>
      </el-table-column>
    </el-table>
    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { $libShow } from '@/utils/common'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'

export default {
  components: { Compare, Publish },
  data() {
    return {
      libShow: $libShow,
      form: {},
      subKey: 'texasMttBlindConfig',
      isEdit: false,
      checkedDetail: [],
      tableData: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    addRows() {
      var blind_level = this.tableData.length + 1
      this.tableData.push(
        {
          blind_level: blind_level,
          small_blind: 0,
          ante: 0,
          raise_blind_time: 0
        }
      )
      this.isEdit = true
    },
    checkRow() {
      var newData = []
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i]['blind_level'] * this.tableData[i]['small_blind'] * this.tableData[i]['raise_blind_time'] === 0) {
          continue
        }
        this.tableData[i]['blind_level'] = newData.length + 1
        newData.push(this.tableData[i])
      }
      this.tableData = newData
    },
    editData() {
      this.isEdit = true
    },
    getData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || { Data: '{}' }
          console.log(response.Data)
          const v = JSON.parse($this.form.Data)
          this.tableData = v
        }
      })
    },
    saveData() {
      this.isEdit = false
      this.checkRow()
      const postData = JSON.parse(JSON.stringify(this.tableData))
      this.form.Data = JSON.stringify(postData)
      console.log(this.form.Data)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
