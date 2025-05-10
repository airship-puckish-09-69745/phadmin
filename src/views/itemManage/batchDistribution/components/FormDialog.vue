<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="1200px"
    :before-close="onClose"
  >
    <el-form ref="formRef" :model="form" label-width="100px">
      <el-form-item label="id类型" required>
        <el-radio-group v-model="form.AccountType">
          <el-radio :label="2">UID账号</el-radio>
          <el-radio :label="1">App和Account账号</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.AccountType === 1" label="应用id" required>
        <el-select v-model="form.SendDetails.app_id" placeholder="请选择应用id">
          <el-option
            v-for="item in APPID_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="粘贴id" required>
        <el-input v-model="account" type="textarea" placeholder="此处粘贴id，各id用英文,隔开" rows="5" />
      </el-form-item>
      <el-form-item label="道具类型" required>
        <el-select v-model="itemType" placeholder="请选择道具类型" @change="onItemTypeChange">
          <el-option
            v-for="item in ITEM_TYPE_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="form-item-item">
          道具：
          <el-select v-model="form.PropDetails.prop_id" placeholder="请选择道具" @focus="onItemSelectorFocus">
            <el-option
              v-for="item in itemOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="form-item-item">
          数量：
          <el-input v-model.number="form.PropDetails.prop_num" type="number" placeholder="请输入道具数量" style="width: calc(100% - 80px);" />
        </div>
        <div class="form-item-item">
          过期时间：
          <el-select v-model="form.PropDetails.prop_expire_days" placeholder="请选择过期时间" style="width: calc(100% - 100px);" @focus="onItemSelectorFocus">
            <el-option
              v-for="item in ITEM_DAY_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.Remark" type="textarea" placeholder="此发放用于什么活动" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose()">取 消</el-button>
      <el-button type="primary" @click="onSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { ITEM_TYPE_OPTIONS, APPID_OPTIONS, ITEM_DAY_TYPE_OPTIONS } from '@/utils/options'
import request from '@/utils/request'
import { Message } from 'element-ui'
export default {
  props: {
    title: {
      type: String,
      default: '批量发放'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ITEM_TYPE_OPTIONS,
      APPID_OPTIONS,
      ITEM_DAY_TYPE_OPTIONS,
      itemType: '', // 道具类型, 不提交到接口所以没有放在form.PropDetails里
      account: '', // 粘贴id，最后会将其转换成数组提交到接口
      form: {
        AccountType: 2, // 1:account 2:uid
        PropDetails: {
          prop_id: 0, // 道具ID
          prop_name: '', // 道具名称
          prop_num: 1,
          prop_expire_days: 0 // 过期天数
        },
        Remark: '',
        SendDetails: {
          app_id: 0, // 应用ID
          account_details: [] // 玩家id列表 [{"account":"lfb","status":0},{"account":"lfb11","status":0}] status//0:未发放；1:成功; -1:失败
        }
      },
      itemList: [], // 道具列表
      itemOptions: [] // 道具下拉框选项, 根据道具类型从道具列表中筛选得到
    }
  },
  mounted() {
    this.getItemList()
  },
  methods: {
    /**
     * 提交先进行前端表单校验
     * 然后调用后端接口进行校验
     */
    onSubmit() {
      if (this.checkoutForm()) {
        this.checkoutId()
          .then(() => {
            // 将粘贴id通过英文逗号分隔成数组，格式为[{"account":"lfb","status":0},{"account":"lfb11","status":0}]
            const account_details = this.account.split(',').map(id => {
              return {
                account: id.trim(),
                status: 0
              }
            })
            this.form.SendDetails.account_details = account_details
            // 提交后端接口
            const params = this.getRequestParams()
            console.log('提交参数', params)
            request({
              url: '/propsbatchapply/create',
              method: 'POST',
              data: params
            }).then(response => {
              if (response.RetCode === 0) {
                Message.success('提交成功！')
                this.onClose()
              } else {
                Message.error('提交失败！')
              }
            })
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },
    onReset() {
      this.$refs.formRef.resetFields()
    },
    onCancel() {
      this.onClose()
    },
    onClose() {
      this.onReset()
      this.$emit('close')
      this.$emit('reload')
    },
    /**
     * 校验表单各项输入
     */
    checkoutForm() {
      if (!this.itemType) {
        this.$message.error('请选择道具类型')
        return false
      } else if (!this.account) {
        this.$message.error('请输入id')
        return false
      } else if (!this.form.PropDetails.prop_num) {
        this.$message.error('请输入道具数量')
        return false
      } else if (this.form.PropDetails.prop_num <= 0) {
        this.$message.error('道具数量必须大于0')
        return false
      } else if (!this.form.Remark) {
        this.$message.error('请输入备注')
        return false
      }
      if (this.form.AccountType === 1 && !this.form.SendDetails.app_id) {
        this.$message.error('请选择应用id')
        return false
      }
      return true
    },
    /**
     * 检查输入的id是否符合要求
     * 前端校验是否含有中文逗号，如果有则提示错误
     * 前端检验完成之后，提交后端会再次校验
     */
    async checkoutId() {
      return new Promise((resolve, reject) => {
        if (this.account.includes('，')) {
          this.$message.error('请使用英文逗号分隔id')
          reject(new Error('请使用英文逗号分隔id'))
        } else {
          // 通过后端接口进一步校验
          resolve()
        }
      })
    },
    /**
     * 获取道具列表
     * 由于没有提供道具下拉框接口，这里使用列表的接口，size为100
     */
    getItemList() {
      request({
        url: '/propsconfig/props/config/list',
        method: 'get',
        data: {
          Env: this.env,
          PageNum: 1,
          PageSize: 100
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            this.total = objs.total
            this.itemList = []
            this.itemList = objs.list
            console.log('道具列表', this.itemList)
          }
        } else {
          this.total = 0
          this.tableData = []
        }
      })
    },
    /**
     * 选择道具类型之后更新道具下拉框数据
     * @param value 道具类型
     */
    onItemTypeChange(value) {
      this.itemType = value
      this.form.PropDetails.prop_id = 0
      this.form.PropDetails.prop_name = ''
      this.form.PropDetails.prop_num = 1
      this.form.PropDetails.prop_expire_days = 0
      const filteredItems = this.itemList.filter(item => item.item_type === value)
      this.itemOptions = filteredItems.map(item => ({
        value: item.id,
        label: item.item_name
      }))
      console.log('道具下拉框选项', this.itemOptions)
    },
    /**
     * 当点击道具下拉框选项时，检查道具类型是否已经选择
     * 如果没有选择道具类型，则提示错误
     */
    onItemSelectorFocus() {
      if (!this.itemType) {
        this.$message.warning('请先选择道具类型')
        this.form.PropDetails.prop_id = 0
        this.form.PropDetails.prop_name = ''
        this.form.PropDetails.prop_num = 1
        this.form.PropDetails.prop_expire_days = 0
      }
    },
    /**
     * 将form参数转换为后端接口需要的参数
     */
    getRequestParams() {
      const params = { ...this.form }
      const selectedItem = this.itemList.find(item => item.id === this.form.PropDetails.prop_id)
      // 获取道具名称
      params.PropDetails.prop_name = selectedItem.item_name
      // 计算道具过期时间，单位为天。根据选择的道具expire_time来计算，expire_time为秒需要转换为天
      params.PropDetails.prop_expire_days = Math.ceil(selectedItem.expire_time / (24 * 60 * 60))
      // 将PropDetails和SendDetails转成字符串格式
      params.PropDetails = JSON.stringify(params.PropDetails)
      params.SendDetails = JSON.stringify(params.SendDetails)
      return params
    }
  }
}
</script>

<style scoped>
.form-item-item {
  display: inline-block;
  width: 250px;
  margin-left: 12px;
}
</style>
