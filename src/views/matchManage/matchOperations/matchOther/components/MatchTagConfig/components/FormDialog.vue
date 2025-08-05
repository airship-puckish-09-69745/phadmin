<template>
  <el-dialog :title="updateData && updateData.ID ? '编辑配置' : '新增配置'" :visible.sync="dialogVisible" width="540px" :close-on-click-modal="false" @close="handleClose(false)">
    <el-form :model="formData" label-width="100px">
      <el-form-item label="游戏选择" required>
        <el-select v-model="formData.GameId" placeholder="请选择" style="width: 360px;" :disabled="isEdit()" >
          <el-option v-for="option in MATCH_GAME_ID_CFG_OPTIONS" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="TagId" required>
        <el-select v-model="formData.TagId" placeholder="请选择" style="width: 360px; " :disabled="isEdit()">
          <el-option v-for="option in MATCH_LIST_TAG_OPTIONS" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="Tag名称" required>
        <el-input v-model="formData.TagName"  style="width: 360px;" placeholder="请填写Tag名称"/>
      </el-form-item>
      <el-form-item label="Tag排序" required>
        <el-input v-model.number="formData.Sort"  style="width: 360px;" placeholder="请填写Tag排序" @input="checkTagSort()"/>
        <span v-show="showTip" style="color:red; margin-left:10px">注意有相同的排序值</span>
      </el-form-item>
      <el-form-item label="展示开关：" :required="true">
        <el-switch
          style="display: block"
          v-model="formData.Display"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value='1'
          :inactive-value='0'
          active-text="开"
          inactive-text="关">
        </el-switch>
      </el-form-item>
      </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose(false)">取消</el-button>
        <el-button type="primary" @click="handleSave()">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {MATCH_GAME_ID_CFG_OPTIONS, MATCH_LIST_TAG_OPTIONS} from '@/utils/options'
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
export default {
  components: {
    ImagePicker
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    updateData: {
      type: Object,
      default: () => ({})
    },
    tagConfig: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: {
        ID: '',
        TagName: '',
        TagId: 0,
        Display: 1,   //展示开关 1:打开 0:关闭
        GameId:0,
        Sort:0,     //排序字段
      },
      tableData: [],
      MATCH_LIST_TAG_OPTIONS,
      MATCH_GAME_ID_CFG_OPTIONS,
      showTip:false,
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    updateData(newData) {
      if (newData) {
        this.formData = { ...newData }
      } else {
        this.resetForm()
      }
    },
    visible(val) {
      if (!val) {
        this.resetForm()
      }
    },
    tagConfig(val) {
      if(val){
        this.tableData = val
      }else{
        this.formData = []
      }
    }
  },
  methods: {
    /**
     * 校验表单数据
     */
    checkoutForm() {
      if (!this.formData.TagName) {
        this.$message.error('Tag名称不能为空')
        return false
      }
      if (this.formData.GameId <= 0) {
        this.$message.error('请选择游戏ID')
        return false
      }
      console.log("111 ",this.formData)
      if(this.formData.Sort <= 0) {
        this.$message.error('请填写排序')
        return false
      }
      return true
    },
    checkHasSameTagId(){
        for(let i=0;i<this.tableData.length;i++){
          if(this.tableData[i].TagId===this.formData.TagId && this.tableData[i].GameId===this.formData.GameId){
            this.$message.error("已经存在相同的TagId,请重新选择")
            return false
          }
        }
        return true
    },
    handleSave() {
      if (!this.checkoutForm()) {
        return
      }
      if(!this.isEdit() && !this.checkHasSameTagId()){
        return
      }
      if(!this.checkTagSort()){
        return
      }
      const formData = {...this.formData}
      this.$emit('update', formData)
      this.handleClose()
    },
    resetForm() {
      this.formData = {
        ID:'',
        TagName: '',
        TagId: 0,
        Display: 1,
        GameId: 0,
        Sort:0,
      }
      this.$emit('update:visible', false)
    },
    handleClose(reload = false) {
      this.resetForm()
      this.$emit('update:visible', false)
    },
    isEdit(){
      return this.formData.ID !== ''
    },
    checkTagSort(){
      for(let i=0;i<this.tableData.length;i++){
        if(this.isEdit()){
          if(this.tableData[i].GameId===this.formData.GameId && this.tableData[i].ID!== this.formData.ID && this.tableData[i].Sort===this.formData.Sort){
            this.$message.error("已经存在相同的排序值,请重新选择")
            this.showTip = true
            return false
          }
        }else {
          if (this.tableData[i].Sort === this.formData.Sort && this.tableData[i].GameId === this.formData.GameId) {
            this.$message.error("已经存在相同的排序值,请重新选择")
            this.showTip = true
            return false
          }
        }
      }
      this.showTip = false
      return true
    },
  }
}
</script>
