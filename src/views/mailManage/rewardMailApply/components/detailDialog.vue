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
      <el-descriptions-item label="奖励内容" :span="6">
      <el-table
        :data="form.rewardItems"
      >
        <el-table-column label="物品类型" prop="itemSubType">
          <template slot-scope="scope">
            {{ getPropTypeText(scope.row.itemType, scope.row.itemSubType) }}
          </template>
        </el-table-column>
        <el-table-column label="物品数量" prop="itemNum" >
          <template slot-scope="scope">
            {{ getPropNumText(scope.row.itemType, scope.row.itemNum) }}
          </template>
        </el-table-column>
        <el-table-column label="物品名称" prop="itemId">
          <template slot-scope="scope">
            {{ getPropNameText(scope.row.itemId) }}
          </template>
        </el-table-column>
        <el-table-column label="物品图标" prop="itemId" align="left">
          <template slot-scope="scope">
            <img v-if="scope.row.itemId !== 0" :src="getPropIcon(scope.row.itemId)" alt="物品图标" style="width: 50px; height: 50px;">
          </template>
        </el-table-column>
      </el-table>
      </el-descriptions-item>
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
        rewardItems: [],
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
      this.form.rewardItems = JSON.parse(this.detailForm.rewardItems)
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
        content += `<div><span>${propTypeName}</span>：${propName} x ${item.itemNum}</div>`
      })
      content = content.slice(0, -1)
      return content
    },
    // 获取物品数量文本
    getPropNumText(itemType, itemNum) {
      if ([1,2,3].includes(itemType)) { // 金币
        return `${itemNum / 1000}（₱）`
      }
      return itemNum
    },
    // 获取道具类型文本
    getPropTypeText(itemType, propType) {
      if ([1,2,3].includes(itemType)) {
        return '投注金'
      }
      const prop = ITEM_TYPE_OPTIONS.find(item => item.value === propType)
      return prop ? prop.label : '未知道具类型:' + propType
    },
    // 获取道具名称文本
    getPropNameText(propId) {
      if (propId === 0) {
        return ''
      }
      const prop = this.propList.find(item => item.id === propId)
      return prop ? prop.item_name : '未知ID:' + propId
    },
    // 获取道具图标
    getPropIcon(propId) {
      const prop = this.propList.find(item => item.id === propId)
      return prop ? prop.image : ''
    }
  }
}
</script>

<style scoped>

</style>
