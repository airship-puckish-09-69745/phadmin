<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="比赛record分享">
          <el-row :gutter="5">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreateMatchShare()">
              添加配置
            </el-button>
            <el-form ref="matchShareData" v-model="matchShareData" label-width="150px" style="margin-top: 10px">
              <el-table
                :data="matchShareData"
                border
                style="width: 100%"
                :cell-style="libShow.DefaultTableCell"
                @row-click="clickMatchShareRecord"
              >
                <el-table-column
                  label="分享内容"
                  width="200"
                >
                  <template slot-scope="scope">
                    {{ showGameName(scope.row.id) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="share_link"
                  label="分享链接"
                  width="600"
                >
                </el-table-column>
                <el-table-column
                  label="操作"
                  column-key="op"
                  width="250"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleEditMathShareRecord(scope.row)"
                    >编辑
                    </el-button>
                    <el-button
                      size="mini"
                      type="warning"
                      @click="handleDeleteMatchShere(scope.row)"
                    >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>

          </el-row>
        </el-tab-pane>
      </el-tabs>

      <el-row>
        <br>
        <el-button type="primary" @click="setData">保存</el-button>
      </el-row>
    </el-row>

    <el-dialog
      :title="getEditTitle()"
      :visible.sync="editMatchShare.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >

      <el-form ref="editMatchShare.item" :model="editMatchShare.item" label-width="150px" size="small">

        <el-form-item label="分享类型：" :required="true">
          <el-select v-model="editMatchShare.item.id" placeholder="请选择" size="mini">
            <el-option
              v-for="item in matchShareRecordCfg"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="链接地址" :required="true">
          <el-col :span="15">
            <el-input v-model="editMatchShare.item.share_link" style="width: 400px;" placeholder="填写链接地址" />
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-row>
            <el-col :span="10" :offset="6">
              <el-button type="primary" size="medium" @click="saveMatchShareRecord">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" />
  </el-col>
</template>

<script>

import Publish from '@/components/Publish/index.vue'
import { $libShow, DataRule } from '@/utils/common'
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import { Message } from 'element-ui'
import request from '@/utils/request'
import Compare from '@/components/Compare/index.vue'

function newItemMatchShare() {
  return { id: 1, share_link: '', appId: 1000002 }
}
export default {
  components: { Compare, ImagePicker, Publish },
  data() {
    return {
      subKey: 'match_other_config',
      libShow: $libShow,
      form: {
        Data: {}
      },
      edit: {
        visible: false,
        isEdit: false
      },

      editMatchShare: {
        visible: false,
        item: newItemMatchShare(),
        isEdit: false
      },
      matchShareData: [],
      matchShareRecordCfg: [
        { 'value': 1, 'label': '赛事record分享' },
        { 'value': 2, 'label': '其他分享' }
      ],
      item: {
        matchShareData: []
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
    dataRule(required, config) {
      return DataRule(required, config)
    },

    handleCreateMatchShare() {
      this.editMatchShare.item = newItemMatchShare()
      this.editMatchShare.isEdit = false
      this.editMatchShare.visible = true
    },

    getEditTitle() {
      this.isDisabled = this.edit.isEdit
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },

    clickMatchShareRecord(row, column, event) {
      if (column.columnKey === 'op') {
        return
      }
      this.editMatchShare.visible = true
      this.editMatchShare.isEdit = true
      this.handleEditMathShareRecord(row)
    },

    handleEditMathShareRecord(ob) {
      this.initFormDataMatchShareRecoard(true, ob.id)
      this.editMatchShare.visible = true
    },

    handleEdit(ob) {
      this.initFormData(true, ob.Gid)
      this.edit.visible = true
    },

    saveMatchShareRecord() {
      const newData = this.editMatchShare.item
      const index = this.matchShareData.findIndex(item => item.id === this.editMatchShare.item.id)
      if (this.editMatchShare.isEdit) {
        this.matchShareData.splice(index, 1, newData)
      } else {
        // 如果是新增，检查是否有重复的档次
        if (index >= 0) {
          this.$alert(`[已存在，不能重复添加]`, '提示', {type: 'warning'})
          return
        }
        // 新增到
        this.matchShareData.push(newData)
      }
      this.editMatchShare.visible = false
      this.editMatchShare.isEdit = false

      console.log("保存数据  ",this.matchShareData)
    },
    initFormData(bEdit, gid) {
      this.edit.isEdit = bEdit
      if (gid) {
        const _data = this.getDataByGid(gid)
        if (_data) {
          Object.assign(this.edit.item, _data)
        }
      }
    },
    initFormDataMatchShareRecoard(bEdit, id) {
      this.editMatchShare.isEdit = bEdit
      if (id) {
        const _data = this.getMatchShareDataByGid(id)
        if (_data) {
          Object.assign(this.editMatchShare.item, _data)
          for (var i = 0; i < this.matchShareData.length; i++) {
            this.matchShareData[i] = _data
          }
        }
      }
    },
    getMatchShareDataByGid(id) {
      for (let i = 0; i < this.matchShareData.length; i++) {
        const data = this.matchShareData[i]
        if (data.id === id) {
          return data
        }
      }
      return null
    },

    handleDeleteMatchShere(ob) {
      this.$confirm('是否确认删除?', '提示', {type: 'warning'}).then(() => {
        const delIndex = this.matchShareData.findIndex(item => item.id === ob.id)
        this.matchShareData.splice(delIndex, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    showGameName(id) {
      console.log("id  ",id)
      for (var i = 0;i < this.matchShareRecordCfg.length; i++) {
        if (id === this.matchShareRecordCfg[i].value) {
          return this.matchShareRecordCfg[i].label
        }
      }
      return ''
    },
    encodeData() {
      const cpy = {}
      this.item.matchShareData = this.matchShareData
      Object.assign(cpy, this.item)
      return JSON.stringify(cpy)
    },
    setData() {
      this.form.Data = this.encodeData()
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
      this.$refs.compare.Compare(function (isEdit) {
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
            console.log('save', response)
            Message.success('保存成功')
          }
        })
      })
    },
    getData(){
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            $this.item = JSON.parse(response.Data.Data)
            this.matchShareData = $this.item.matchShareData
            const old = JSON.parse(response.Data.Data)
            this.$refs.compare.SetOldVal(old)
          }
        }
      })
    },
  }
}
</script>

<style>

</style>
