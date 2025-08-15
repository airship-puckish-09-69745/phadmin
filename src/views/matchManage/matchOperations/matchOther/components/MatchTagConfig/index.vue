<template>
  <div>
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
import {MATCH_GAME_ID_CFG_OPTIONS, MATCH_LIST_TAG_OPTIONS} from '@/utils/options'
import source from "echarts/src/data/Source";
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
      MATCH_GAME_ID_CFG_OPTIONS,
      MATCH_LIST_TAG_OPTIONS,
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
    }
  },
  methods: {
    source,
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
      console.log(" 编辑 ",this.formDialog)
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
  }
}
</script>
