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
          <el-select v-model="form.PropDetails.prop_id" placeholder="请选择道具" @focus="onItemSelectorFocus" @change="handleItemChange">
            <el-option
              v-for="item in itemOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="disableByPropId(item.value)"
            />
          </el-select>
        </div>
        <div v-show="isShowFreeSpinGame" class="form-item-item">
          游戏：
          <el-select v-model="form.PropDetails.gids" multiple clearable filterable default-first-option placeholder="请选择道具" @focus="onItemSelectorFocus">
            <el-option
              v-for="item in FreeSpinGames"
              :key="'FreeSpinGames'+item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="form-item-item">
          数量：
          <el-input
            v-model.number="form.PropDetails.prop_num"
            type="number"
            placeholder="请输入道具数量"
            style="width: calc(100% - 80px);"
            :disabled="[7,8,9].includes(itemType)"
            @input="form.PropDetails.prop_num = form.PropDetails.prop_num < 0 ? 0 : form.PropDetails.prop_num"
          />
        </div>
        <div class="form-item-item" v-if="checkPropNeedExpireDays(itemType)" >
          过期天数：
          <el-select v-model="form.PropDetails.prop_expire_days" placeholder="请选择过期时间" style="width: calc(100% - 100px);" @focus="onItemSelectorFocus">
            <el-option
              v-for="item in ITEM_DAY_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled === propValidExpireDays(itemType, item.value)"
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
import { ITEM_TYPE_OPTIONS, APPID_OPTIONS, ITEM_DAY_TYPE_OPTIONS, PROP_TYPE_OPTIONS } from '@/utils/options'
import request from '@/utils/request'
import { Message } from 'element-ui'
import {GetMatchTicketRightsIdList, MATCH_TICKET_RIGHTS_ID_CFG_PROD, MATCH_TICKET_RIGHTS_ID_CFG_DEV} from "@/utils/prop";
import {IsProd} from "@/utils/env";
export default {
  props: {
    title: {
      type: String,
      default: '批量发放'
    },
    visible: {
      type: Boolean,
      default: false
    },
    updateForm: {
      type: Object,
      default: () => ({})
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
          prop_id: '', // 道具ID
          prop_name: '', // 道具名称
          prop_num: 1,
          prop_expire_days: 1, // 过期天数
          gids: [],
          prop_scene_id:0,   // 道具发放场景ID
        },
        Remark: '',
        SendDetails: {
          app_id: 0, // 应用ID
          account_details: [] // 玩家id列表 [{"account":"lfb","status":0},{"account":"lfb11","status":0}] status//0:未发放；1:成功; -1:失败
        }
      },
      itemList: [], // 道具列表
      itemOptions: [], // 道具下拉框选项, 根据道具类型从道具列表中筛选得到
      gameMap: {},
      isShowFreeSpinGame: false,
      FreeSpinGames: []
    }
  },
  watch: {
    visible(val) {
      if (val) {
        // 编辑模式下必须对后端传过来的字段重命名
        if (this.updateForm) {
          this.form = {
            AccountType: this.updateForm.account_type,
            PropDetails: this.updateForm.prop_details,
            Remark: this.updateForm.remark,
            SendDetails: this.updateForm.send_details
          }
          // 解析account
          this.account = this.form.SendDetails.account_details.map(item => item.account).join(',')
          // 根据prop_id从itemList获取道具类型
          this.itemType = this.itemList.find(item => item.id === this.form.PropDetails.prop_id)?.item_type
          // 根据道具类型筛选道具下拉框选项
          const filteredItems = this.itemList.filter(item => item.item_type === this.itemType)
          this.updateItemOption(filteredItems)
          console.log(this.itemOptions)
        } else {
          this.form = {
            AccountType: 2,
            PropDetails: {
              prop_id: 0,
              prop_name: '',
              prop_num: 1,
              prop_expire_days: 1,
              gids: []
            },
            Remark: '',
            SendDetails: {
              app_id: 0,
              account_details: []
            }
          }
          this.itemType = ''
          this.account = ''
        }
      }
    }
  },
  mounted() {
    this.getItemList()
    this.getGameList()
  },
  methods: {
    /**
     * 提交先进行前端表单校验
     */
    onSubmit() {
      if (this.checkoutForm()) {
        if (this.checkoutId()) {
          // 将粘贴id通过英文逗号分隔成数组，格式为[{"account":"lfb","status":0},{"account":"lfb11","status":0}]
          const account_details = this.account.split(',').map(id => {
            return {
              account: id.trim(),
              status: 0
            }
          })
          this.form.SendDetails.account_details = account_details
          console.log('11111', this.form.SendDetails.account_details)

          // 调用新增或者编辑接口
          if (this.updateForm) {
            this.updateBatchDistribution()
          } else {
            this.createBatchDistribution()
          }
        }
      }
    },
    /**
     * 新增道具发放
     */
    createBatchDistribution() {
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
    },
    /**
     * 编辑道具发放
     */
    updateBatchDistribution() {
      const params = this.getRequestParams()
      console.log('提交参数', params)
      request({
        url: '/propsbatchapply/update',
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
    },
    /**
     * 校验表单各项输入
     */
    checkoutForm() {
      if (!this.itemType) {
        this.$message.error('请选择道具类型')
        return false
      } else if (this.form.PropDetails.prop_id <= 0) {
        this.$message.error('请选择道具名称')
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
     */
    checkoutId() {
      if (this.account.includes('，')) {
        this.$message.error('请使用英文逗号分隔id')
        return false
      }
      const accountArr = this.account.split(',')
      const repeatArray = this.hasDuplicates(accountArr)
      if (repeatArray.length > 0) {
        this.$message.error(repeatArray.join(',') + ' 账号重复请检查')
        return false
      }
      return true
    },
    /**
     * 获取道具列表
     * 由于没有提供道具下拉框接口，这里使用列表的接口，size为100
     */
    getItemList() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/match/props/config/list',
          PropType: 0
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            var timestamp = Date.parse(new Date()) / 1000
            this.total = objs.total
            this.itemList = []
            for (let i = 0; i < objs.total; i++) {
              if (objs.list[i].status === 1 && this.isTicketProp(objs.list[i].item_type) && objs.list[i].expire_time > timestamp) {
                this.itemList.push(objs.list[i])
              }
              if (objs.list[i].status === 1 && (this.isAvatarFrameProp(objs.list[i].item_type) || objs.list[i].item_type === PROP_TYPE_OPTIONS.PROP_TYPE_SLOT_FREE_SPIN)) {
                this.itemList.push(objs.list[i])
              }
              // 新版道具
              if(objs.list[i].status === 1 && this.isNewTicketProp(objs.list[i].item_type)){
                this.itemList.push(objs.list[i])
              }
            }
          }
        } else {
          this.total = 0
          this.itemList = []
        }
      })
    },
    getGameList() {
      const $this = this
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          for (let i = 0; i < objs.length; i++) {
            $this.gameMap[objs[i].Gid] = objs[i].Name
          }
        }
      })
    },
    /**
     * 选择道具类型之后更新道具下拉框数据
     * @param value 道具类型
     */
    onItemTypeChange(value) {
      this.itemType = value
      this.form.PropDetails.prop_id = ''
      this.form.PropDetails.prop_name = ''
      this.form.PropDetails.prop_num = 1
      this.form.PropDetails.prop_expire_days = 1
      let filteredItems = this.itemList.filter(item => item.item_type === value)
      if(this.isNewTicketProp(value)){
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
      this.checkShowFreeSpinGame()
    },
    /**
     * 当点击道具下拉框选项时，检查道具类型是否已经选择
     * 如果没有选择道具类型，则提示错误
     */
    onItemSelectorFocus() {
      if (!this.itemType) {
        this.$message.warning('请先选择道具类型')
        this.form.PropDetails.prop_id = ''
        this.form.PropDetails.prop_name = ''
        this.form.PropDetails.prop_num = 1
        this.form.PropDetails.prop_expire_days = 1
      }
    },
    handleItemChange(val) {
      //新版本门票默认值1
      if(this.isNewTicketProp(this.itemType)){
        this.form.PropDetails.prop_num = 1
      }
      this.checkShowFreeSpinGame()
    },
    checkShowFreeSpinGame() {
      this.isShowFreeSpinGame = false
      if (!this.form.PropDetails.prop_id) { return false }
      for (let i = 0; i < this.itemList.length; i++) {
        if (this.itemList[i].id === this.form.PropDetails.prop_id && this.itemList[i].item_type === PROP_TYPE_OPTIONS.PROP_TYPE_SLOT_FREE_SPIN) {
          if (!this.itemList[i].item_extra) { return false }
          // json 解析 item_extra
          const extra = JSON.parse(this.itemList[i].item_extra)
          if (!extra) { return false }
          if (!extra.gid) { return false }
          // 排序
          extra.gid.sort()
          this.FreeSpinGames = []
          this.form.PropDetails.gids = []
          for (let j = 0; j < extra.gid.length; j++) {
            // 默认全选
            this.form.PropDetails.gids.push(extra.gid[j])
            this.FreeSpinGames.push({
              value: extra.gid[j],
              label: this.showGameName(extra.gid[j])
            })
          }
          this.isShowFreeSpinGame = true
          return true
        }
      }
      return false
    },
    /**
     * 将form参数转换为后端接口需要的参数
     */
    getRequestParams() {
      const params = { ...this.form }
      const selectedItem = this.itemList.find(item => item.id === this.form.PropDetails.prop_id)
      // 获取道具名称
      params.PropDetails.prop_name = selectedItem.item_name
      //判断发放的是否是新版比赛门票 道具，若是则获取对应的比赛门票权益id

      if (this.isNewTicketProp(selectedItem.item_type)) {
        //根据当前道具类型获取对应的门票配置
        const ticketsConfig = IsProd() ? MATCH_TICKET_RIGHTS_ID_CFG_PROD : MATCH_TICKET_RIGHTS_ID_CFG_DEV
        if(ticketsConfig && typeof ticketsConfig === 'object'){
          for(const appId in ticketsConfig){
            if(ticketsConfig[appId] && Array.isArray(ticketsConfig[appId]) && ticketsConfig[appId].some(ticket => ticket.ticketId === selectedItem.id)){
              params.PropDetails.prop_scene_id = ticketsConfig[appId].find(ticket => ticket.ticketId === selectedItem.id).sceneId
            }
          }
        }
      }
      // 将粘贴id转换成数组格式
      // 将PropDetails和SendDetails转成字符串格式
      params.PropDetails = JSON.stringify(params.PropDetails)
      params.SendDetails = JSON.stringify(params.SendDetails)
      // 如果是编辑模式，需要添加ID
      if (this.updateForm) {
        params.ID = this.updateForm.id
      }
      return params
    },
    // 根据道具id禁用某些道具选项
    disableByPropId(propId) {
      // for(let i=0; i < this.itemList.length;i++){
      //   if(this.itemList[i].id === propId && this.itemList[i].item_type ===  PROP_TYPE_OPTIONS.PROP_TYPE_TICKET){
      //     if(this.itemList[i].item_extra !== null && JSON.parse(this.itemList[i].item_extra).specialAttr=== 1 ){ //如果是邀请函
      //       return true
      //     }
      //   }
      // }
      return false
    },
    /**
     * 切换id类型时，清空应用id
     */
    onChangeAccount(val) {
      if (val === 2) {
        this.form.SendDetails.app_id = ''
      }
    },

    // 是否是门票类型道具
    isTicketProp(itemType) {
      return itemType === PROP_TYPE_OPTIONS.PROP_TYPE_TICKET || itemType === PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET || itemType === PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET
    },
    // 是否是头像框道具
    isAvatarFrameProp(itemType) {
      return itemType === PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME || itemType === PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_AVATAR
    },
    //是否是新版道具
    isNewTicketProp(itemType) {
      return [PROP_TYPE_OPTIONS.PROP_TYPE_TICKET_NEW,PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW,PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET_NEW].includes(itemType)
    },
    checkPropNeedExpireDays(itemType) {
      return [PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME, PROP_TYPE_OPTIONS.PROP_TYPE_SLOT_FREE_SPIN,PROP_TYPE_OPTIONS.PROP_TYPE_TICKET_NEW,
        PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW,PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET_NEW].includes(itemType);
    },
    // 道具过期时间是否合法
    propValidExpireDays(propType, expireDays) {
      switch (propType) {
        case PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME:
        case PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_AVATAR:
          // 頭像框：不能為負數
          if (expireDays < 0) {
            return false
          }
          break;
        case PROP_TYPE_OPTIONS.PROP_TYPE_TICKET_NEW:
        case PROP_TYPE_OPTIONS.PROP_TYPE_TEXAS_TICKET_NEW:
        case PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET_NEW:
          // 新版票券：不能為0、365或負數
          if (expireDays === 0 || expireDays === 365 || expireDays < 0) {
            return false
          }
          break;
        default:
          // 其他道具類型：默認有效
          break;
      }
      return true
    },
    showGameName(gid) {
      return this.gameMap.hasOwnProperty(gid) ? this.gameMap[gid] : '未知游戏' + gid
    },
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
