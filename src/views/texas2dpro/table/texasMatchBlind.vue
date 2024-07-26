<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row style="margin-top: 30px">
      <el-col :span="20">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate()">添加配置项</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
      </el-col>
    </el-row>
    <div>
      <el-table ref="tb" :data="tableData" stripe border :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{height:'10px'}" :cell-style="libShow.DefaultTableCell" @row-click="clickData">
        <el-table-column prop="ID" label="ID" sortable="custom" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.blind_id }}
          </template>
        </el-table-column>
        <el-table-column prop="blind_name" label="盲注名称" align="center" width="200">
          <template slot-scope="scope">
            {{ scope.row.blind_name }}
          </template>
        </el-table-column>
        <el-table-column prop="blind_content" label="等级条数" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.blind_content.length }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="getEditTitle()" :visible.sync="edit.visible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="edit" :model="edit" label-width="240px" size="small">
        <el-row>
          <el-col :span="11">
            <el-form-item label="盲注ID:" :required="true">
              <el-input v-model="edit.item.blind_id" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="盲注名称">
              <el-input v-model="edit.item.blind_name" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="升盲时间(秒)">
              <el-input v-model="edit.item.blind_time" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button type="primary" size="mini" @click="addBlindRow">添加盲注</el-button>
        </el-row>
        <el-row v-for="(value, index) in edit.item.blind_content" :key="index">
          <el-col :span="22">
            <el-row>
              <el-col :span="22">
                <el-form-item label="等级" :required="true">
                  <el-input v-model.number="edit.item.blind_content[index].blind_level" size="mini" :required="true" />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="小盲" :required="true">
                  <el-input v-model.number="edit.item.blind_content[index].small_blind" size="mini" :required="true" />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="前注" :required="true">
                  <el-input v-model.number="edit.item.blind_content[index].ante" size="mini" :required="true" />
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button type="danger" size="mini" @click="delBlindRow(index)">删除</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-form-item>
          <el-row style="margin-top: 10px;">
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="saveData">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
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

function newItem() {
  return {
    blind_id: 0,
    blind_name: '',
    blind_time: 0,
    blind_content: []
  }
}

export default {
  components: { Compare, Publish },
  data() {
    return {
      libShow: $libShow,
      form: {},
      subKey: 'texasMttBlindConfig',
      checkedDetail: [],
      tableData: [],
      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i]['blind_id'] === ID) {
          this.edit.item.blind_id = ID
          this.edit.item.blind_name = this.tableData[i]['blind_name']
          this.edit.item.blind_time = this.tableData[i]['blind_content'][0]['raise_blind_time']
          this.edit.item.blind_content = this.tableData[i]['blind_content']
        }
      }
    },
    initTableData() {
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i]['blind_id'] === this.edit.item.BlindId) {
          this.tableData[i]['blind_name'] = this.edit.item.BlindName
          this.tableData[i]['blind_content'] = []

          for (var j = 0; j < this.edit.item.blind_content.length; j++) {
            this.tableData[i]['blind_content'].push(
              {
                blind_level: this.edit.item.blind_content[j].blind_level,
                small_blind: this.edit.item.blind_content[j].small_blind,
                ante: this.edit.item.blind_content[j].ante,
                raise_blind_time: Number(this.edit.item.blind_time)
              }
            )
          }
          console.log(this.tableData[i])
          return
        }
      }
    },
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    clickData(row, column, event) {
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.blind_id)
        this.edit.visible = true
      }
      console.log(this.edit)
    },
    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    addBlindRow() {
      var blind_level = this.edit.item.blind_content.length + 1
      this.edit.item.blind_content.push(
        {
          blind_level: blind_level,
          small_blind: 0,
          ante: 0,
          raise_blind_time: 0
        }
      )
    },
    delBlindRow(index) {
      this.edit.item.blind_content.splice(index, 1)
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
          const v = JSON.parse($this.form.Data)
          this.tableData = v
          console.log(this.tableData)
        }
      })
    },
    saveData() {
      this.initTableData()
      const postData = JSON.parse(JSON.stringify(this.tableData))
      this.form.Data = JSON.stringify(postData)
      const $this = this
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
      this.edit.visible = false
    }
  }
}
</script>
