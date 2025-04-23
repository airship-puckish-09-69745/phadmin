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
        <el-table-column prop="reward_id" label="ID" sortable="custom" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.reward_id }}
          </template>
        </el-table-column>
        <el-table-column prop="reward_name" label="奖励名称" align="center" width="200">
          <template slot-scope="scope">
            {{ scope.row.reward_name }}
          </template>
        </el-table-column>
        <el-table-column prop="reward_content" label="奖励个数" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.reward_content.length }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="getEditTitle()" :visible.sync="edit.visible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="edit" :model="edit" label-width="240px" size="small">
        <el-row>
          <el-col :span="11">
            <el-form-item label="奖励ID:" :required="true">
              <el-input v-model.number="edit.item.reward_id" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="奖励名称">
              <el-input v-model="edit.item.reward_name" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button type="primary" size="mini" @click="addRewardRow">添加奖励</el-button>
        </el-row>
        <el-row v-for="(value, index) in edit.item.reward_content" :key="index">
          <el-col :span="24">
            <el-row>
              <el-col :span="2">
                <el-form-item label="名次" :required="true">
                  <el-input v-model.number="edit.item.reward_content[index].start_reward_rank" size="mini" :required="true" style="width:60px"/>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item label="至"style="margin-left: 10px;">
                  <el-input v-model.number="edit.item.reward_content[index].end_reward_rank" size="mini" :required="true" style="width:60px"/>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="奖励" :required="true" style="margin-left: 60px;">
                  <el-select v-model="edit.item.reward_content[index].reward_type" placeholder="请选择" size="mini" style="width:100px">
                      <el-option
                        v-for="item in getTypeCfgs"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-select v-if="edit.item.reward_content[index].reward_type > 1" v-model="edit.item.reward_content[index].scene_Id" placeholder="请选择" size="mini" style="width:100px">
                      <el-option v-if="edit.item.reward_content[index].reward_type === 2"
                        v-for="item in betScenesCfgs"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                       <el-option v-if="edit.item.reward_content[index].reward_type === 3"
                        v-for="item in rebateScenesCfgs"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  <el-input v-model.number="edit.item.reward_content[index].reward_num" size="mini" :required="true" style="width:80px"/>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button type="danger" size="mini" @click="delRewardRow(index)">删除</el-button>
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
    reward_id: 0,
    reward_name: '',
    reward_content: []
  }
}

export default {
  components: { Compare, Publish },
  data() {
    return {
      libShow: $libShow,
      form: {},
      subKey: 'texasMttFixedAwardConfig',
      checkedDetail: [],
      tableData: [],
      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },
      getTypeCfgs: [
        { 'value': 1, 'label': '金币' },
        { 'value': 2, 'label': '投注金' },
        { 'value': 3, 'label': '返水金' }
      ],
      // 返水金
      rebateScenesCfgs: [
        { 'value': 5, 'label': '没有任何限制的返水金' },
        { 'value': 10, 'label': '没有任何限制的返水金【TexasPlus付费赛】' }
      ],
      // 投注金
      betScenesCfgs: [
        { 'value': 1, 'label': '任意游戏投注' },
        { 'value': 9, 'label': '仅限GZ任意游戏投注金【TexasPlus免费赛】' }
      ],
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
        if (this.tableData[i]['reward_id'] === ID) {
          this.edit.item.reward_id = ID
          this.edit.item.reward_name = this.tableData[i]['reward_name']
          this.edit.item.reward_content = []
          var result = {}
          for (var j = 0; j< this.tableData[i]['reward_content'].length; j++) {
            var keyStr = this.tableData[i]['reward_content'][j].reward_num + "_" + this.tableData[i]['reward_content'][j].reward_type+"_" + this.tableData[i]['reward_content'][j].scene_Id
            if (!(keyStr in result)) {
              result[keyStr] = []
            }
            result[keyStr].push(this.tableData[i]['reward_content'][j].reward_rank)
          }
          console.log(result)
          for (var key in result) {
            var rankList = result[key]
            rankList.sort((a, b) => a - b)
            console.log(rankList)
            var minRank = rankList[0]
            var maxRank = rankList[rankList.length -1]
            var content = key.split("_")
            if (content.length !== 3) {
              continue
            }
            console.log(content)
            this.edit.item.reward_content.push(
              {
                start_reward_rank: minRank,
                end_reward_rank: maxRank,
                reward_num: parseInt(content[0]),
                reward_type: parseInt(content[1]),
                scene_Id: parseInt(content[2]),
              }
            )
            this.edit.item.reward_content.sort((a, b) => a.start_reward_rank - b.start_reward_rank)
            console.log(this.edit.item.reward_content)
          }
        }
      }
    },
    initTableData() {
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i]['reward_id'] === this.edit.item.reward_id) {
          this.tableData[i]['reward_name'] = this.edit.item.reward_name
          this.tableData[i]['reward_content'] = []

          for (var j = 0; j < this.edit.item.reward_content.length; j++) {
            for (var rank= this.edit.item.reward_content[j].start_reward_rank; rank <= this.edit.item.reward_content[j].end_reward_rank; rank++) {
              this.tableData[i]['reward_content'].push(
                {
                  reward_rank: rank,
                  reward_num: this.edit.item.reward_content[j].reward_num,
                  reward_type: this.edit.item.reward_content[j].reward_type,
                  scene_Id: this.edit.item.reward_content[j].scene_Id
                }
              )
            } 
          }
          return
        }
      }
    },
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    clickData(row, column, event) {
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.reward_id)
        this.edit.visible = true
      }
      console.log(this.edit)
    },
    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    addRewardRow() {
      var reward_rank = this.edit.item.reward_content.length + 1
      this.edit.item.reward_content.push(
        {
          reward_rank: reward_rank,
          reward_num: 0,
          reward_type: 1,
          scene_Id: 0,
        }
      )
    },
    delRewardRow(index) {
      this.edit.item.reward_content.splice(index, 1)
    },
    checkRow() {
      var newData = []
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i]['reward_rank'] * this.tableData[i]['reward_num'] === 0) {
          continue
        }
        this.tableData[i]['reward_rank'] = newData.length + 1
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
        }
      })
    },
    saveData() {
      this.initTableData()
      console.log(this.tableData)
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
