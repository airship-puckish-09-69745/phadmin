<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="1200px"
    :before-close="onClose"
  >
    <el-form ref="formRef" :model="form" label-width="100px">
      <el-form-item label="发送类型" required>
        <el-select v-model="form.accountType" placeholder="请选择发送类型">
          <el-option label="UID账号" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户UID" required>
        <el-input v-model="accounts" type="textarea" placeholder="此处粘贴uid，各uid用英文,隔开" rows="5" />
      </el-form-item>
      <el-form-item label="邮件标题" required>
        <el-input v-model="form.title" placeholder="请输入邮件标题" />
      </el-form-item>
      <el-form-item label="邮件内容" required>
        <el-input v-model="form.content" type="textarea" placeholder="请输入邮件内容" rows="5" />
      </el-form-item>
      <el-row>
        <el-col>
          <el-form-item label="过期时间" required>
            <el-date-picker
              v-model="form.expireTime"
              type="datetime"
              value-format="timestamp"
              placeholder="选择过期时间"
              default-time="23:59:59">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="截止时间" required>
            <el-date-picker
              v-model="form.deadline"
              type="datetime"
              value-format="timestamp"
              placeholder="选择截止时间"
              default-time="23:59:59">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="奖励物品">
          <el-button type="primary" @click="addRewardItem">添加</el-button>
          <el-button type="primary" @click="delRewardItem">移除</el-button>
        </el-form-item>
      </el-row>
      <el-row v-for="(item, index) in form.rewardItems" :key="index">
        <el-col :span="5">
          <el-form-item label="奖励类型" required>
            <el-select v-model="item.itemType" placeholder="请选择奖励类型" @change="onItemTypeChange">
              <el-option label="无" :value="0" />
              <el-option label="投注金" :value="2" />
              <el-option label="道具" :value="4" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="道具类型" required v-if="isShowPropEl(item.itemType)">
            <el-select v-model="item.itemSubType" placeholder="请选择道具类型" @change="onItemSubTypeChange">
              <el-option
                v-for="item in ITEM_TYPE_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="奖励道具" required v-if="isShowPropEl(item.itemType)">
            <el-select v-model="item.itemId" placeholder="请选择奖励道具ID">
              <el-option v-for="item in itemOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="过期天数" required v-if="CheckPropNeedExpireDays(item.itemSubType)">
            <el-select v-model="item.expireDays" placeholder="请选择过期时间">
              <el-option
                v-for="item in ITEM_DAY_TYPE_OPTIONS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :label="rewardNumLabel(item.itemType)" required>
            <el-input
              v-model="item.itemNum"
              type="number"
              placeholder="请输入奖励数量"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span style="margin-left: 43%">
      <el-button type="primary" @click="onSubmit()">确 定</el-button>
      <el-button @click="onClose()">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
import { ITEM_DAY_TYPE_OPTIONS, ITEM_TYPE_OPTIONS, PROP_TYPE_OPTIONS } from '@/utils/options'
import { IsProd } from "@/utils/env";
import {
  CheckPropNeedExpireDays,
  IsNewTicketProp,
  MATCH_TICKET_RIGHTS_ID_CFG_DEV,
  MATCH_TICKET_RIGHTS_ID_CFG_PROD
} from '@/utils/prop'

function newRewardItem() {
  return {
    itemId: 0, // 物品id
    itemNum: 0, // 物品数量
    itemType: '', // 奖励类型，1:金币 2:投注金 3:返水金 4:道具
    itemSubType: '', // 物品子类型
    expireDays: 1, // 过期天数
  }
}

export default {
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    propList: {
      type: Array,
      default: () => []
    },
    updateForm: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      ITEM_TYPE_OPTIONS,
      PROP_TYPE_OPTIONS,
      ITEM_DAY_TYPE_OPTIONS,
      rewardItemType: {
        betCoin: 2, // 投注金
        prop: 4, // 道具
      },
      form: {
        appId: parseInt(this.$store.getters.appId), // appid
        mailAccounts: [], // 账号列表，json字符串 [{"account":"lfb","status":0},{"account":"lfb11","status":0}] status状态，0:未发送 1:成功 2:失败
        accountType: 2, // 账号类型1:account 2:uid
        title: '', // 标题
        content: '', // 内容
        expireTime: '', // 过期时间
        deadline: '', // 截止时间
        rewardItems: [], // 奖励物品，json字符串
      },
      itemType: 0,
      accounts: '',
      itemOptions: [], // 道具下拉框选项, 根据道具类型从道具列表中筛选得到
    }
  },
  watch: {
    visible(val) {
      if (!val) {
        return
      }

      if (this.updateForm) {
        this.form = JSON.parse(JSON.stringify(this.updateForm))
        this.accounts = JSON.parse(this.form.mailAccounts).map(item => item.account).join(',')
        this.form.deadline *= 1000
        this.form.expireTime *= 1000
        this.form.rewardItems = JSON.parse(this.form.rewardItems)
        for (const item of this.form.rewardItems) {
          if (item.itemType === this.rewardItemType.betCoin) {
            item.itemNum /= 1000
          }
        }

        if (this.form.rewardItems.length > 0) {
          this.onItemSubTypeChange(this.form.rewardItems[0].itemSubType, false)
        }

      } else {
        // this.accounts = ''
        this.form = {
          appId: parseInt(this.$store.getters.appId), // appid
          mailAccounts: [], // 账号列表，json字符串 [{"account":"lfb","status":0},{"account":"lfb11","status":0}] status状态，0:未发送 1:成功 2:失败
          accountType: 2, // 账号类型1:account 2:uid
          title: '', // 标题
          content: '', // 内容
          expireTime: '', // 过期时间
          deadline: '', // 截止时间
          rewardItems: [], // 奖励物品，json字符串
        }
      }
    }
  },
  mounted() {

  },
  computed: {

  },
  methods: {
    CheckPropNeedExpireDays,
    isShowPropEl(itemType) {
      return itemType === this.rewardItemType.prop
    },
    rewardNumLabel(itemType) {
      return itemType === this.rewardItemType.betCoin ? '奖励金额' : '奖励数量'
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
     * 添加奖励项
     */
    addRewardItem() {
      if (this.form.rewardItems.length > 0) {
        return
      }
      const rewardItem = newRewardItem()
      this.form.rewardItems.push(rewardItem)
    },
    /**
     * 删除奖励项
     */
    delRewardItem(index) {
      this.form.rewardItems.splice(index, 1)
    },
    onSubmit() {
      if (!this.checkoutForm()) {
        return
      }

      // 将粘贴id通过英文逗号分隔成数组，格式为[{"account":"lfb","status":0},{"account":"lfb11","status":0}]
      this.form.mailAccounts = this.accounts.split(',').map(id => {
        return {
          account: id.trim(),
          status: 0
        }
      })

      if (this.updateForm) {
        this.updateData()
      } else {
        this.createData()
      }
    },
    /**
     * 校验表单各项输入
     */
    checkoutForm() {
      if (!this.accounts) {
        this.$message.error('请输入用户ID')
        return false
      }
      if (!this.checkAccounts()) {
        return false
      }
      if (!this.form.title) {
        this.$message.error('请输入邮件标题')
        return false
      }
      if (!this.form.content) {
        this.$message.error('请输入邮件内容')
        return false
      }
      if (!this.form.expireTime) {
        this.$message.error('请输入过期时间')
        return false
      }
      if (!this.form.deadline) {
        this.$message.error('请输入截止时间')
        return false
      }

      if (this.form.rewardItems.length > 0) {
        const rewardItem = this.form.rewardItems[0]

        if (!rewardItem.itemType) {
          this.$message.error('请选择奖励类型')
          return false
        }
        if (rewardItem.itemType === this.rewardItemType.betCoin) {
          if (!rewardItem.itemNum) {
            this.$message.error('请输入奖励金额')
            return false
          }
        }
        if (rewardItem.itemType === this.rewardItemType.prop) {
          if (!rewardItem.itemSubType) {
            this.$message.error('请选择道具类型')
            return false
          }
          if (!rewardItem.itemId) {
            this.$message.error('请选择道具')
            return false
          }
          if (!rewardItem.itemNum) {
            this.$message.error('请输入道具数量')
            return false
          }
          if (CheckPropNeedExpireDays(rewardItem.itemSubType) && !rewardItem.expireDays) {
            this.$message.error('请选择过期天数')
            return false
          }
        }
      }

      return true
    },
    /**
     * 检查输入的id是否符合要求
     * 前端校验是否含有中文逗号，如果有则提示错误
     */
    checkAccounts() {
      if (this.accounts.includes('，')) {
        this.$message.error('请使用英文逗号分隔id')
        return false
      }
      const accountArr = this.accounts.split(',')
      const repeatArray = this.hasDuplicates(accountArr)
      if (repeatArray.length > 0) {
        this.$message.error(repeatArray.join(',') + ' 账号重复请检查')
        return false
      }
      return true
    },
    /**
     * 检查数组是否有重复元素
     */
    hasDuplicates(arr) {
      const map = new Map()
      const emptyArr = []
      for (const item of arr) {
        if (map.has(item)) {
          emptyArr.push(item)
        }
        map.set(item, true)
      }
      return emptyArr
    },
    /**
     * 将form参数转换为后端接口需要的参数
     */
    getRequestParams() {
      const params = JSON.parse(JSON.stringify(this.form))

      for (const i in params.rewardItems) {
        const item = params.rewardItems[i]
        if (item.itemType === this.rewardItemType.betCoin) {
          item.itemNum *= 1000
        }
        item.itemNum = parseInt(item.itemNum)
      }

      params.expireTime = parseInt(params.expireTime/1000)
      params.deadline = parseInt(params.deadline/1000)
      params.mailAccounts = JSON.stringify(params.mailAccounts)
      params.rewardItems = JSON.stringify(params.rewardItems)

      // 如果是编辑模式，需要添加ID
      if (this.updateForm) {
        params.id = this.updateForm.id
      }
      return params
    },
    /**
     * 新增奖励邮件申请
     */
    createData() {
      const params = this.getRequestParams()
      console.log('提交参数', params)
      request({
        url: '/rewardmailapply/create',
        method: 'POST',
        data: params
      }).then(response => {
        if (response.RetCode === 0) {
          this.$message.success('提交成功！')
          this.onClose()
        } else {
          this.$message.error('提交失败！')
        }
      })
    },
    /**
     * 编辑奖励邮件申请
     */
    updateData() {
      const params = this.getRequestParams()
      console.log('提交参数', params)
      request({
        url: '/rewardmailapply/update',
        method: 'POST',
        data: params
      }).then(response => {
        if (response.RetCode === 0) {
          this.$message.success('提交成功！')
          this.onClose()
        } else {
          this.$message.error('提交失败！')
        }
      })
    },
    onItemTypeChange(itemType) {
      const rewardItem =  this.form.rewardItems[0]
      if (itemType === this.rewardItemType.betCoin) {
        rewardItem.itemSubType = 0
        rewardItem.itemId = 0
        rewardItem.itemNum = 0
        rewardItem.expireDays = 0
        console.log('选择了余额')
      } else {
        rewardItem.itemId = 0
        rewardItem.itemNum = 1
        rewardItem.expireDays = 1
        console.log('选择了道具')
      }
    },
    /**
     * 选择道具类型之后更新道具下拉框数据
     * @param itemSubType 道具类型
     */
    onItemSubTypeChange(itemSubType, isResetRewardItem = true) {
      if (isResetRewardItem) {
        const rewardItem = this.form.rewardItems[0]
        rewardItem.itemId = 0
        rewardItem.expireDays = 0
        if (CheckPropNeedExpireDays(itemSubType)){
          rewardItem.expireDays = 1
        }
      }

      let filteredItems = this.propList.filter(item => item.item_type === itemSubType)
      if(IsNewTicketProp(itemSubType)){
        //根据当前道具类型获取对应的门票配置
        const ticketsConfig = IsProd() ? MATCH_TICKET_RIGHTS_ID_CFG_PROD : MATCH_TICKET_RIGHTS_ID_CFG_DEV
        //console.log('ticketsConfig', ticketsConfig, 'value', value)
        if(ticketsConfig && typeof ticketsConfig === 'object'){
          // 收集所有appId下的ticketId
          const allowedTicketIds = new Set()
          for(const appId in ticketsConfig){
            if(ticketsConfig[appId] && Array.isArray(ticketsConfig[appId])){
              ticketsConfig[appId].forEach(ticket => {
                if(ticket.ticketId){
                  allowedTicketIds.add(ticket.ticketId)
                }
              })
            }
          }
          // 只保留在允許列表中的道具
          if(allowedTicketIds.size > 0){
            filteredItems = filteredItems.filter(item => allowedTicketIds.has(item.id))
          }
        }
      }
      // console.log('筛选后的道具列表', filteredItems)
      this.updateItemOption(filteredItems)
      // console.log('道具下拉框选项', this.itemOptions)
      //this.checkShowFreeSpinGame()
    },
    updateItemOption(filteredItems) {
      if (filteredItems === null) {
        return
      }

      // 先按 item_name 排序
      const sortedItems = [...filteredItems].sort((a, b) => {
        return a.item_name.localeCompare(b.item_name)
      })
      this.itemOptions = []
      for (let i = 0; i < sortedItems.length; i++) {
        let str = sortedItems[i].item_name
        if (sortedItems[i].show_name) {
          str += `(${sortedItems[i].show_name})`
        }
        this.itemOptions.push({
          value: sortedItems[i].id,
          label: str
        })
      }

      console.log('道具下拉框选项', this.itemOptions)
    },
  }
}
</script>

<style scoped>

</style>
