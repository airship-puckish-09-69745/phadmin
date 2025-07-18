<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
     <el-row style="margin-top: 30px">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate()">添加配置项</el-button>
        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="getData()">刷新</el-button>
     </el-row>
    <el-table
         :data="tableData"
         stripe
         :header-cell-style="libShow.DefaultTableHeadClass"
         :cell-style="libShow.TableCell(10)"
         style="width: 100%;margin-top: 20px"
       >
         <el-table-column prop="reward_id" label="ID" sortable="custom" align="center" width="200"/>
         <el-table-column  prop="reward_name" label="奖励名称" align="center" width="200"/>

         <el-table-column
           label="操作"
           width="200px"
         >
           <template slot-scope="scope">
             <el-button
               size="mini"
               icon="el-icon-edit"
               @click="showForm(scope.row.reward_id)"
             >编辑</el-button>
             <el-button  type="danger" size="mini" @click="handleDelete(scope.row.reward_id)">删除</el-button>
           </template>
         </el-table-column>
       </el-table>
     <el-dialog :title="getEditTitle()" :visible.sync="edit.visible" :close-on-click-modal="false" :close-on-press-escape="false"  width="900px">

       <el-form ref="edit" :model="edit"  label-width="200px" size="small">
         <el-row>
           <el-col :span="11">
             <el-form-item label="奖励ID:" :required="true">
               <el-input v-model.number="edit.item.reward_id" placeholder="请输入" />
             </el-form-item>
           </el-col>
           <el-col :span="11">
             <el-form-item label="奖励名称">
               <el-input v-model="edit.item.reward_name" placeholder="请输入" />
             </el-form-item>
           </el-col>
         </el-row>
         <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">
           <legend>奖励信息</legend>
           <el-button  style="margin-bottom: 10px;" type="normal" size="mini" @click="addRankRewards()">添加</el-button>
           <el-table

             :data="edit.item.reward_content"
             border
             stripe
             :header-cell-style="libShow.DefaultTableHeadClass"
             :row-style="{height:'35px'}"
             :cell-style="libShow.TableCell(0)"
             style="width: 100%;line-height:35px;"
           >
             <el-table-column
               prop="index"
               label="序号"
               width="50"
             />
             <el-table-column
               prop="rewardItems"
               label="奖励"
               width="400"
             >
               <template slot-scope="scope">
                 <li v-if="scope.row.rewardItems != null" style="list-style: none;">
                     <span>金币奖励：</span>
                     <el-select v-model="scope.row.rewardItems.getType" placeholder="请选择" size="mini" style="width:80px">
                       <el-option
                         v-for="item in REWARD_CURRENCY_OPTIONS"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"
                       />
                     </el-select>
                     <el-select v-if="scope.row.rewardItems.getType === 2" v-model="scope.row.rewardItems.sceneId" placeholder="请选择投注金" size="mini" style="width:150px">
                       <el-option
                         v-for="scene in selfBuildBetScenesCfgs"
                         :key="scene.value"
                         :label="scene.label"
                         :value="scene.value"
                       />
                     </el-select>
                     <el-select v-if="scope.row.rewardItems.getType === 3" v-model="scope.row.rewardItems.sceneId" placeholder="请选择返水金" size="mini" style="width:150px">
                       <el-option
                         v-for="scene in REBATE_SCENES_CFG_OPTIONS"
                         :key="scene.value"
                         :label="scene.label"
                         :value="scene.value"
                       />
                     </el-select>
                     <el-input v-model.number="scope.row.rewardItems.getNum" style="width: 80px;" size="mini" placeholder="请填写获得数量" />
                   </li>
                  <li v-if="scope.row.propsReward != null" style="list-style: none;">
                     <span>道具奖励：</span>
                     <el-select v-model="scope.row.propsReward.propsId" placeholder="道具" size="mini" style="width:200px">
                       <el-option
                         v-for="item in matchPropsCfgs"
                         :key="item.propsId"
                         :label="item.propsName"
                         :value="item.propsId"
                       >
                         <img v-if="item.propsIcon !== '' " :src="item.propsIcon" style="height:36px;vertical-align: middle;"/>
                         <span>{{ item.propsName }}</span>
                       </el-option>
                     </el-select>
                     <el-input v-model.number="scope.row.propsReward.propsNum" style="width: 100px;" size="mini" placeholder="填数量" />
                   </li>
                   <li v-if="scope.row.propsReward != null && getPropsRewardItem(scope.row.propsReward.propsId,0,0).propsType === 2" style="list-style: none;">
                     <span>过期天数：</span>
                     <el-select  v-model="scope.row.propsReward.propExpireDays" placeholder="过期天数" size="mini" style="width:200px">
                       <el-option
                         v-for="item in ITEM_DAY_TYPE_OPTIONS"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"
                       >
                       </el-option>
                     </el-select>
                   </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column
              prop="startRank"
              label="名次区间"
            >
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.startRank" style="width: 80px;" size="mini" placeholder="开始名次" />至
                <el-input v-model.number="scope.row.endRank" style="width: 80px;" size="mini" placeholder="结束名次" />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="removeRewardItme(scope.$index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
        <el-form-item>

              <el-button size="medium" type="primary" icon="el-icon-s-order" @click="saveData()">保存奖励配置</el-button>

        </el-form-item>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import {$libShow, ClientTableData, MoneyShow} from '@/utils/common'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'

function newItem() {
  return {
    reward_id: 0,
    reward_name: '',
    reward_content: [
      {
        index: 1,
        startRank: 1,
        endRank: 1,
        rewardItems: {
            getType: 1,
            getPid: 0,
            getNum: 0,
            sceneId: 0 // 返水金投注金场景类型（调用营销接口时用）
          },
        propsReward: {
          propsId: 0,
          propsType: 0,
          propsName: '',
          propsIcon: '',
          propsAttr: '',
          propsNum: 0,
          propExpireDays:-1
        }
      }
    ]
  }
}
import { ITEM_TYPE_OPTIONS, APPID_OPTIONS,PROP_TYPE_OPTIONS ,REWARD_CURRENCY_OPTIONS} from '@/utils/options'
import { REBATE_SCENES_CFG_OPTIONS, BET_SCENES_CFG_OPTIONS,ITEM_DAY_TYPE_OPTIONS} from '@/utils/options'
import store from '@/store'
import {IsMars} from "@/utils/env";
const filterMap = {}
export default {
  components: { Compare, Publish },
  data() {
    return {
      libShow: $libShow,
      form: {},
      subKey: 'selfBuildMatchConfig',
      tableData: [],
      matchPropsCfgs: [],   //比赛道具信息
      propsTypeList:[1,2], //门票 头像框
      matchTicketsCfgs:[],  //Tongits门票
      REWARD_CURRENCY_OPTIONS,
      REBATE_SCENES_CFG_OPTIONS,
      BET_SCENES_CFG_OPTIONS,
      ITEM_DAY_TYPE_OPTIONS,
      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },
      selfBuildBetScenesCfgs: [
        { 'value': 19, 'label': '仅限GZ任意游戏投注【Tongits自建赛奖励】'}
      ],
    }

  },
  created() {
    this.env = store.getters.env || this.env
    this.getData()
    if(!IsMars()) {
      this.getMatchProps()
    }
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    showForm(reward_id) {
      let editData = {}
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].reward_id === reward_id) {
          editData = this.tableData[i]
          break
        }
      }
      this.edit.item = editData
      this.edit.isEdit = true
      this.edit.visible = true
    },

    handleDelete(reward_id) {
      this.$confirm('您确定要将该奖励配置删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const newList = []
        for (const key in this.tableData) {
          if (this.tableData[key].reward_id === reward_id) {
            continue
          }
          newList.push(this.tableData[key])
        }
        this.tableData = newList
        this.form.Data = JSON.stringify(this.tableData)
        const $this = this
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('删除配置成功！')
            this.getData()
          } else {
            Message.error('删除配置失败！')
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    addRankRewards() {
      let index = 0;
      let maxRank = 0;
      if (this.edit.item.reward_content.length > 0) {
        index = this.edit.item.reward_content.length
        for (var i = 0; i < this.edit.item.reward_content.length; i++) {
          if (this.edit.item.reward_content[i].endRank > maxRank) {
            maxRank = this.edit.item.reward_content[i].endRank
          }
        }
      }
      index++
      maxRank++
      this.edit.item.reward_content.push({
        index: index,
        startRank: maxRank,
        endRank: maxRank,
        rewardItems:{
            getType: 1,
            getPid: 0,
            getNum: 0,
            sceneId: 0 // 返水金投注金场景类型（调用营销接口时用）
          },
        propsReward: {
          propsId: 0,
          propsType: 0,
          propsName: '',
          propsIcon: '',
          propsAttr: '',
          propExpireDays: -1,
        }
      })
    },

    removeRewardItme(index) {
      this.edit.item.reward_content.splice(index, 1)
      if (this.edit.item.reward_content.length > 0) {
        for (var i = 0; i < this.edit.item.reward_content.length; i++) {
          this.edit.item.reward_content[i].index = i + 1
        }
      }
    },
    getData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || {Data: '{}'}
          const v = JSON.parse($this.form.Data)
          this.tableData = v
        }
      })
    },

    async checkRewardCfg(rewards) {
      if (rewards.length <= 0) {
        Message.success('请添加固定奖励配置')
        return false
      }
      //前三名单独检测
      var topThree = []
      for (let index = 0; index < rewards.length; index++) {
        const element = rewards[index]
        if (element.startRank === element.endRank && element.startRank <= 3) {
          topThree.push(element.startRank)
        }
        if (element.startRank >= 4 && topThree.length < 3) {
          Message.success('前三名必须配,且请以1-1,2-2,3-3的格式配')
          return false
        }
      }
      // 遍历配置项
      for (let index = 0; index < rewards.length; index++) {
        const element = rewards[index]
        if (element.startRank <= 0 || element.endRank < element.startRank) {
          Message.success('请填写正确的排名')
          return false
        }
        if (element.startRank <= 3 && element.startRank !== element.endRank) {
          Message.success('奖励前三名需要单独配，名次区间请配置成：1-1  2-2 3-3')
          return false
        }
        if (element.hasOwnProperty('propsReward') && element.hasOwnProperty('rewardItems') && element.propsReward.propsId <= 0 && element.rewardItems.getNum <= 0) {
          Message.success("当前名次没有配任何奖励,请检查")
          return false
        }
        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0 && (element.propsReward.propsNum === 0 || element.propsReward.propsNum === undefined)) {
          Message.success('名次[' + element.startRank + '-' + element.endRank + ']' + '项请填写道具数量')
          return false
        }
        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0 &&
          this.getPropsRewardItem(element.propsReward.propsId, 0, 0).propsType === PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME && element.propsReward.propExpireDays < 0) {
          Message.success('请选择头像框过期时间')
          return false
        }

        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0) {
          if (!await this.propTakeEffectCheck(element.propsReward.propsId)) {
            this.errmsg('所选择的道具不生效,请检查')
            return false
          }
        }
        if (element.rewardItems === undefined) {
          Message.success('请添加奖励配置')
          return false
        }
        // 遍历奖励配置项
          if (element.rewardItems.getType === 1) {
            element.rewardItems.sceneId = 0
          } else if (element.rewardItems.getType === 2) {
            if (!this.isInBetScenes(element.rewardItems.sceneId)) {
              Message.success('名次[' + element.startRank + '-' + element.endRank + ']第' +'请正确选择投注金')
              return false
            }
          } else if (element.rewardItems.getType === 3) {
            if (!this.isInRebateScenes(element.rewardItems.sceneId)) {
              Message.success('名次[' + element.startRank + '-' + element.endRank + ']第' + '请正确选择返水金')
              return false
            }
          }
        }
      return true
    },
    //检测投注金
    isInBetScenes(scene) {
      for (let index = 0; index < this.selfBuildBetScenesCfgs.length; index++) {
        if (this.selfBuildBetScenesCfgs[index].value === scene) {
          return true
        }
      }
      return false
    },
    //检测返水金
    isInRebateScenes(scene) {
      for (let index = 0; index < this.rebateScenesCfgs.length; index++) {
        if (this.REBATE_SCENES_CFG_OPTIONS[index].value === scene) {
          return true
        }
      }
      return false
    },
    async configCheck() {
      if (this.edit.item.reward_name.length <= 0) {
        Message.success("请填写模版标题")
        return false
      }
      if (this.edit.item.reward_id <= 0) {
        Message.success("请填写模版ID")
        return false
      }
      let sameRewardCnt = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].reward_id === this.edit.item.reward_id) {
          sameRewardCnt += 1
        }
      }
      if ((sameRewardCnt > 0 &&  !this.edit.isEdit) ||(sameRewardCnt > 1 && this.edit.isEdit)) {
        Message.success("已经存在有相同的模版ID")
        return false
      }
      return await this.checkRewardCfg(this.edit.item.reward_content);
    },
    async saveData() {
      if (!await this.configCheck()) {
        return
      }

      // 修复道具
      for (let i = 0; i < this.edit.item.reward_content.length; i++) {
        const element = this.edit.item.reward_content[i]
        if (element.hasOwnProperty('propsReward') && element.propsReward.propsId > 0) {
          element.propsReward = this.getPropsRewardItem(element.propsReward.propsId, element.propsReward.propsNum,element.propsReward.propExpireDays)
        }
      }

      if (this.edit.isEdit === false) {
        this.tableData.push({
          "reward_id": this.edit.item.reward_id,
          "reward_name": this.edit.item.reward_name,
          "reward_content": this.edit.item.reward_content,
        })
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].reward_id === this.edit.item.reward_id) {
            this.tableData[i] = this.edit.item
            break
          }
        }
      }
      this.edit.isEdit = false
      this.form.Data = JSON.stringify(this.tableData)
      const $this = this
      request({
        url: 'customizeconfig/update',
        method: 'post',
        data: $this.form
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功')
        }
      })
      this.edit.visible = false
    },
    getPropsRewardItem(pid, propsNum, expireDays) {
      const one = {
        propsId: 0,
        propsType: 0,
        propsName: '',
        propsIcon: '',
        propsAttr: '',
        propsNum: propsNum,
        propCost: 0,
        propExpireDays: expireDays,
      }
      for (let i = 0; i < this.matchPropsCfgs.length; i++) {
        const element = this.matchPropsCfgs[i]
        if (element.propsId === pid) {
          one.propsId = element.propsId
          one.propsType = element.propsType
          one.propsName = element.propsName
          one.propsIcon = element.propsIcon
          one.propsAttr = element.propsAttr
          one.propCost = element.propsCost
          break
        }
      }
      return one
    },
    async propTakeEffectCheck(propId) {
      await this.getMatchProps();
      return await this.PropIsPublish(propId)
    },
    async PropIsPublish(propId) {
      if (propId > 0) {
        for (let i = 0; i < this.matchPropsCfgs.length; i++) {
          if (propId === this.matchPropsCfgs[i].propsId) {
            return true
          }
        }
      }
      return false
    },
    async getMatchProps() {
      try {
        const response = await request({
          url: '/dataProxy/info',
          method: 'get',
          data: {
            Env: this.env,
            Path: '/match/props/config/list',
            PropType: 0,
          }
        })
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            this.matchPropsCfgs = [
              {
                'propsId': 0,
                'propsType': 0,
                'propsName': '无',
                'propsIcon': '',
                'propsAttr': '',
                'propsCost': '',
              }
            ]
            this.matchTicketsCfgs = []
            var timestamp = Date.parse(new Date()) / 1000
            for (let i = 0; i < objs.list.length; i++) {
              if (this.propsTypeList.includes(objs.list[i].item_type)) {
                if (objs.list[i].status === 1 && ((objs.list[i].item_type === PROP_TYPE_OPTIONS.PROP_TYPE_TICKET && objs.list[i].expire_time > timestamp) ||
                  objs.list[i].item_type === PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME)) {
                  this.matchPropsCfgs.push({
                    'propsType': objs.list[i].item_type,
                    'propsId': objs.list[i].id,
                    'propsName': objs.list[i].item_name,
                    'propsIcon': objs.list[i].image,
                    'propsAttr': objs.list[i].item_describe,
                    'propsCost': objs.list[i].item_cost,
                  })
                  if (objs.list[i].item_type === PROP_TYPE_OPTIONS.PROP_TYPE_TICKET) { //Tongits 门票
                    this.matchTicketsCfgs.push({
                      'label': objs.list[i].item_name,
                      'value': objs.list[i].id,
                    })
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
      }
    }
  },
}
</script>
