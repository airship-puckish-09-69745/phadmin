<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="1200px"
    :before-close="onClose"
  >
    <el-descriptions title="邮件发送情况" direction="vertical" :column="6" border>
      <el-descriptions-item label="发送时间">{{ form.sendTime }}</el-descriptions-item>
      <el-descriptions-item label="总发送人数">{{ form.sendUserTotal }}</el-descriptions-item>
      <el-descriptions-item label="已发送人数">{{ form.sendUserCount }}</el-descriptions-item>
      <el-descriptions-item label="未发送人数">{{ form.unsendCount }}</el-descriptions-item>
      <el-descriptions-item label="已领取人数">{{ form.claimUserCount }}</el-descriptions-item>
      <el-descriptions-item label="未领取人数">{{ form.unclaimUserCount }}</el-descriptions-item>
      <el-descriptions-item label="奖励内容" :span="6">{{ form.rewardItemsText }}</el-descriptions-item>
      <el-descriptions-item label="目标用户" :span="6">
        <el-table :data="form.mailAccounts" style="width: 40%">
          <el-table-column label="UID" prop="account" />
          <el-table-column label="发送状态" prop="status">
            <template slot-scope="scope">
              {{ getSendStatusText(scope.row.status) }}
            </template>
          </el-table-column>
        </el-table>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
import { $libDate } from '@/utils/common'
import { PROP_TYPE_OPTIONS, ITEM_STATUSES, ITEM_TYPE_OPTIONS, ITEM_STATUS_OPTIONS } from '@/utils/options'

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
    detailForm: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        sendTime: '',
        sendUserTotal: 0,
        sendUserCount: 0,
        unsendCount: 0,
        claimUserCount: 0,
        unclaimUserCount: 0,
        mailAccounts: [],
        rewardItemsText: '',
      },
      sendStatuses: {
        0: '未发送',
        1: '已发送',
        2: '发送失败'
      }
    }
  },
  watch: {
    visible(val) {
      console.log('visible', val)
      if (!val) {
        return
      }
      if (!this.detailForm.id) {
        return
      }
      // 格式化邮件账号文本
      this.form.mailAccounts = JSON.parse(this.detailForm.mailAccounts)
      // 格式化奖励内容文本
      this.form.rewardItemsText = this.getRewardContentText(this.detailForm.rewardItems)
      // 格式化发送时间
      this.form.sendTime = this.formatTime(this.detailForm.sendTime)
      // 计算发送人数
      this.calcSendUserCount()
      // 查询领取人数
      this.getAttachmentClaimUserCount()
    }
  },
  mounted() {

  },
  computed: {},
  methods: {
    // 格式化时间
    formatTime(ts) {
      if (ts === 0) {
        return ''
      }
      return $libDate.FormateSecondStr(ts, 2)
    },
    onClose() {
      this.$emit('close')
    },
    calcSendUserCount() {
      const mailAccounts = JSON.parse(this.detailForm.mailAccounts)
      this.form.sendUserTotal = mailAccounts.length
      // 计算未发人数
      this.form.unsendCount = mailAccounts.filter(item => item.status === 0).length
      // 计算已发人数
      this.form.sendUserCount = this.form.sendUserTotal - this.form.unsendCount
    },
    getAttachmentClaimUserCount() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          ApplyId: this.detailForm.id,
          Path: '/mail/attachment/claim/user/count'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('getAttachmentClaimUserCount', response.Data)
          this.form.claimUserCount = response.Data
          this.form.unclaimUserCount = this.form.sendUserTotal - this.form.claimUserCount
        }
      })
    },
    getSendStatusText(status) {
      return this.sendStatuses[status]
    },
    // 获取奖励内容文本
    getRewardContentText(rewardItems) {
      const items = JSON.parse(rewardItems)
      let content = ''
      items.forEach(item => {
        if ([1, 2, 3].includes(item.itemType)) { // 金币
          content += `${item.itemNum / 1000}（₱）|`
          return
        }
        const propId = item.itemId
        const propType = item.itemSubType
        const propTypeName = this.getPropTypeText(propType)
        const propName = this.getPropNameText(propId)
        content += `${propTypeName}：${propName} x ${item.itemNum}|`
      })
      content = content.slice(0, -1)
      return content
    },
    // 获取道具类型文本
    getPropTypeText(propType) {
      const prop = ITEM_TYPE_OPTIONS.find(item => item.value === propType)
      return prop ? prop.label : '未知道具类型:' + propType
    },
    getPropNameText(propId) {
      const prop = this.propList.find(item => item.id === propId)
      return prop ? prop.item_name : '未知ID:' + propId
    }
  }
}
</script>

<style scoped>

</style>
