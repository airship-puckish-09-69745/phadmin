<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加表格
        </el-button>
      </el-col>
    </el-row>
    <el-dialog
      :title="getEditTitle()"
      width="80%"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >

      <el-form ref="edit" :model="edit" label-width="180px" :inline="true" size="small">
        <el-row v-if="edit.isEdit===false">
          <el-col :offset="9">
            <el-button type="primary" size="mini" @click="save()">保存</el-button>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item v-if="edit.isNewImport===true">
            <upload-excel-component :on-success="importSuccess" :before-upload="checkImport" />
          </el-form-item>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-alert type="error" description="表格要求:1:表格第一行,要求只占用一行,不能占多行 2:第一列:表示Uid|第二列表示Nick|第三列Image(uid.webp)" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-tabs type="border-card">
              <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                  prop="Uid"
                  label="Uid"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="Nick"
                  label="Nick"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="Image"
                  label="Image">
                </el-table-column>
              </el-table>
            </el-tabs>
          </el-col>
        </el-row>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { $libDate, $libShow, $libType, ClientTableData, DataRule } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import UploadExcelComponent from '@/components/UploadExcel/slotsAct.vue'


export default {
  components: {Compare, Publish, UploadExcelComponent },
  data() {
    return {
      tableData: [],
      libShow: $libShow,

      edit: {
        visible: false,
        isEdit: false,
        Configs: {
        },
        isNewImport: false,
      }
    }
  },
  computed: {
  },
  created() {
    this.env = store.getters.env || this.env
  },
  methods: {

    showData(arr) {
      return arr.val / 1000
    },

    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },

    handleCreate() {
      this.tableData = []
      this.edit.isNewImport = true
      this.edit.isEdit = false
      this.edit.visible = true
    },
    configCheck() {

      if (this.tableData.length === 0) {
        this.errmsg("还没有上传表格数据")
        return false
      }
      return true
    },
    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '查看配置' : '新增配置'
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
    },
    createSave() {
      const userData = JSON.stringify(this.tableData)
      const postData = {}
      postData.Env = this.env
      postData.Path = '/match/update/info'
      postData.Data = userData
      request({
        url: '/dataProxy/info',
        method: 'Post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！')
        }
      })
    },
    save() {
      if (!this.configCheck()) {
        return
      }
      this.createSave()
      this.edit.isNewImport = false
      this.edit.visible = false
    },
    checkImport(file) {
      const isLt4M = file.size / 1024 / 1024 < 4
      if (isLt4M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 4m in size.',
        type: 'warning'
      })
      return false
    },
    importSuccess(results) {
      const cndUrl  = this.$store.getters.env === 'test' ? 'http://192.168.6.16:8092/gf/audit/' : 'https://sh-client.tiptop.bet/gf/audit/'
      const keys = this.parseKeys()
      const sheetNames = results['SheetNames']
      const Sheets = results['Sheets']
      if (sheetNames.length > 0){
        const name = sheetNames[0]
        const sheet = Sheets[name]
        for (let j = 2; j < 300; j++) {
          const rows = []
          for (let k = 0; k < keys.length; k++) {  //excel表格列表A B C D ...AA AB 栏目循环
            const sheetKey = keys[k] + j
            if (sheetKey in sheet) {
              rows.push(sheet[sheetKey]['v'])
            } else {
              break
            }
          }
          if (rows.length > 0) {
            if(rows[2]){
              rows[2] = cndUrl + rows[2] +"?="+Date.now()/1000 //加上cdn资源地址前缀
            }
            this.tableData.push({'Uid':rows[0],'Nick':rows[1],'Image':rows[2]
            })
          }
        }
      }
      this.edit.isNewImport = false
    },
    //组合Excel 列表栏目 A B C ... AA
    parseKeys() {
      const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      let res = []
      for (let i = 0; i < arr.length; i ++) {
        res.push(arr[i])
      }
      for (let i = 0; i < arr.length; i ++) {
        for (let j = 0; j < arr.length; j ++) {
          res.push(arr[i] + arr[j])
        }
      }
      return res;
    },

    errmsg(txt) {
      this.$alert(txt, '', {
        type: 'error',
        center: true,
        showConfirmButton: false
      })
    },
  }
}
</script>
