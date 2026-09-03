<template>
  <div>
    <!-- Pusoy页签白名单 
    <el-row>
      <el-col :span="11">
        <el-form>
          <el-form-item label="Pusoy页签白名单：" style="margin-bottom: 10px;">
            <el-switch
              v-model="pusoyWhiteConfig.switch"
              active-text="开启"
              inactive-text="关闭"
              @change="handleSwitchChange">
            </el-switch>
          </el-form-item>
          <el-form-item v-if="pusoyWhiteConfig.switch" label="UID列表：" style="margin-bottom: 10px;">
            <el-input
              v-model="pusoyWhiteConfig.uidList"
              style="width: 800px;"
              placeholder="多个uid用,分开"
              @blur="handleUidInputChange(pusoyWhiteConfig.uidList, 'uidList')"/>
          </el-form-item>
          <el-form-item  style="margin-bottom: 0;">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-check"
              style="margin-left: 10px;"
              @click="saveUIdList"
              :loading="saveLoading">
              保存
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    -->

    <el-row style="padding-bottom: 12px;">
      <el-button size="mini" type="success" icon="el-icon-plus" style="float: right;" @click="handleEdit()">添加配置</el-button>
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        border
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%;overflow-y: auto;"
      >
        <!-- 序号 -->
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column
          v-for="field in fields"
          :key="field.prop"
          :label="field.label"
          :prop="field.prop"
          :width="field.width"
        >
          <template slot-scope="scope">
          <!-- 默认显示 -->
          <template v-if="!['TagName','Display', 'GameId'].includes(field.prop)">
            {{ scope.row[field.prop] }}
          </template>

            <template v-if="field.prop === 'TagName'">
              {{getTagNameByTagId(scope.row.TagId)}}
            </template>

            <template v-if="field.prop === 'Display'">
                {{getDisplayStatus(scope.row.Display)}}
            </template>
            <template v-if="field.prop === 'GameId'">
              <span v-if="scope.row.GameId">
                {{getMatchNameByGameId(scope.row.GameId)}}
              </span>
            </template>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 添加|编辑配置弹窗 -->
    <FormDialog :update-data="formDialog.updateData" :tag-config="tableData" :visible="formDialog.visible" @update:visible="handleUpdateDialogVisible" @update="handleUpdateConfig" />
  </div>
</template>

<script>
import { $libShow } from '@/utils/common'
import FormDialog from './components/FormDialog.vue'
import {MATCH_GAME_ID_CFG_OPTIONS, MATCH_LIST_TAG_OPTIONS,APPID_OPTIONS} from '@/utils/options'
import {validateUidInput, handleUidInputChange, setNestedProperty } from '@/utils/common-game-config'
export default {
  name: 'MatchTagConfig',
  components: {
    FormDialog
  },
  props: {
    tagConfig: {
      type: Array,
      default: () => []
    },
    pusoyWhiteListConfig: {
      type: Object,
      default: () => ({
        switch: false,
        uidList: []
      })
    },
  },
  data() {
    return {
      libShow: $libShow,
      fields: [
        { label: 'TagID', prop: 'TagId', width: 130 },
        { label: 'Tag名称', prop: 'TagName',width: 130 },
        { label: '游戏名称', prop: 'GameId', width: 160 },
        { label: '展示开关', prop: 'Display', width: 160 },
        { label: '排序', prop: 'Sort', width: 100 },
      ],
      formDialog: {
        updateData: null,
        visible: false
      },
      // 主键
      subKey: 'match_other_config',
      tableData: [],
      pusoyWhiteConfig:{
        switch: false,
        uidList: []
      },
      saveLoading: false,
      MATCH_GAME_ID_CFG_OPTIONS,
      MATCH_LIST_TAG_OPTIONS,
      APPID_OPTIONS,
    }
  },
  watch: {
    tagConfig: {
      handler(newVal) {
        //console.log('mapList changed:', newVal)
        this.$nextTick(() => {
          this.getList()
        })
      },
      immediate: true
    },
    pusoyWhiteListConfig: {
      handler(newVal) {
        // 處理從父組件傳來的對象數據
        if (newVal && typeof newVal === 'object') {
          this.pusoyWhiteConfig.switch = newVal.switch || false
          this.pusoyWhiteConfig.uidList = newVal.uidList ? newVal.uidList.map(uid => String(uid)).join(',') : ''
        } else {
          // 默認情況
          this.pusoyWhiteConfig.switch = false
          this.pusoyWhiteConfig.uidList = ''
        }
      },
      immediate: true
    }
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },

    /**
     * TagConfig中获取数据
     */
    getList() {
      if (!this.tagConfig || this.tagConfig.length === 0) {
        this.tableData = []
        return
      }

      this.tableData = this.tagConfig
    },
    /**
     * 新增或编辑配置
     * @param row
     */
    handleEdit(row = null) {
      this.formDialog.updateData = row ? { ...row } : null
      this.formDialog.visible = true
      //console.log(" 编辑 ",this.formDialog)
    },
    handleDelete(row) {
      this.$confirm(
        `确定要删除[ ${row.Name} ]吗？`,
        '删除提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$emit('delete', row.ID)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleUpdateConfig(data) {
      this.$emit('update', data)
    },
    handleUpdateDialogVisible(visible) {
      this.formDialog.visible = visible
      this.formDialog.updateData = null
    },

    getTagNameByTagId(tagId){
      const name = ''
      for(let i= 0; i < this.tableData.length; i++){
        if(tagId===this.tableData[i].TagId){
          return this.tableData[i].TagName
        }
      }
      return name
    },
    getMatchNameByGameId(gameId){
      const name = ''
      for(let i= 0; i < MATCH_GAME_ID_CFG_OPTIONS.length; i++){
        if(gameId === MATCH_GAME_ID_CFG_OPTIONS[i].value){
          return MATCH_GAME_ID_CFG_OPTIONS[i].label
        }
      }
      return name
    },
    getDisplayStatus(status){
      if(status=== 0){
        return "关闭"
      }
      if (status === 1){
        return "打开"
      }
    },

    saveUIdList() {

      // 如果開關關閉，直接保存空配置
      if (!this.pusoyWhiteConfig.switch) {
        this.$emit('save-uid-list', {
          switch: false,
          uidList: []
        })
        this.$message({
          type: 'success',
          message: 'Pusoy页签白名单已关闭'
        })
        return
      }

      // 如果開關開啟，驗證UID
      const uidObValidation = validateUidInput(this.pusoyWhiteConfig.uidList)
      if (!uidObValidation.valid) {
        this.$message.error('UID错误：' + uidObValidation.message)
        return
      }

      this.saveLoading = true

      // 模擬保存操作
      setTimeout(() => {
        this.saveLoading = false

        // 計算實際的UID數量（按逗號分割）
        const uidCount = this.pusoyWhiteConfig.uidList ? this.pusoyWhiteConfig.uidList.split(',').filter(uid => uid.trim()).length : 0

        this.$message({
          type: 'success',
          message: `Pusoy页签白名单保存成功！已设置 ${uidCount} 个UID`
        })

        // 可以通過emit向父組件傳遞保存的數據
        this.$emit('save-uid-list', this.pusoyWhiteConfig)
      }, 1000)
    },

    handleSwitchChange(value) {
      // 如果關閉開關，清空UID列表
      if (!value) {
        this.pusoyWhiteConfig.uidList = ''
      }
    },
     //处理UID输入变化
     handleUidInputChange(input, fieldPath) {
      const result = handleUidInputChange(input)
      if (!result.success) {
        this.$message.error(result.message)
        return false
      }
      //如果验证通过,格式化输入
      this.$nextTick(() => {
        setNestedProperty(this.pusoyWhiteConfig, fieldPath, result.formattedInput)
      })

      return true
    },
  }
}
</script>
