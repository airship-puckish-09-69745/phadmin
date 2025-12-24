<template>
  <div class="app-container">
    <el-form :model="form" label-width="110px" size="small">
      <el-form-item label="用户ID：">
        <el-input v-model="form.uid" placeholder="请输入查询id" style="width: 200px; display: inline-block;" />
        <el-button type="primary" style="margin-left: 15px;" @click="getInfo">查询</el-button>
      </el-form-item>
      <el-form-item label="老虎机：">
        <el-select v-model="form.tag_gid" placeholder="请选择老虎机">
          <el-option
              v-for="opt in slotsGames"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <div>
      <el-table :data="form.user_tags"
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 1020px;"
                stripe>
        <el-table-column prop="TagId" label="标签">
          <template slot-scope="scope">{{showTagId(scope.row.TagId)}}</template>
        </el-table-column>
        <el-table-column prop="TagValue" label="用户程度">
          <template slot-scope="scope">{{showTagValue(scope.row.TagId, scope.row.TagValue)}}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {Message} from 'element-ui'
import request from '@/utils/request'
import store from '@/store'
import {$libShow} from '@/utils/common'
import ShowTip from "@/components/Tip/showTip.vue";
export default {
  name: 'SlotsUserTag',
  components: {ShowTip},
  data() {
    return {
      form: {
        uid: 0,
        tag_gid: 82,
        user_tags: []
      },
      libShow: $libShow,
      otherTagMap: {
        '10001': '新增用户',
        '10002': '新进用户',
        '10003': '流失用户',
        '10004': '预流失用户',
        '20000': '游戏强度',
        '20001': '登录天数',
        '20002': '日平局局数',
        '20003': '有效下注',
        '30001': '常玩底注',
        '30002': '最高场次',
        '40001': '免费',
        '40002': '付费'
      },
      slotsTagMap: {
        '50001': '新增用户',
        '50002': '登录天数',
        '50003': '携带金额',
        '50004': '下注次数',
        '50005': '下注额度',
        '50006': '日均下注额度',
        '50007': '连续下注天数',
        '50008': '回归用户',
        '50009': '最近中奖上限',
        '50101': '扑克/麻将主题',
        '50102': '经典寻宝/777主题',
        '50103': '传说神话主题',
        '50104': '传统节日主题',
        '50105': '菲律宾本地化主题',
        '50106': '动物与自然',
        '50201': '连线全线',
        '50202': '连线固定线',
        '50203': '无线数量中奖',
        '50204': '无线相连中奖',
        '50205': '其他',
        '50301': '固定大奖(mini固定奖励)',
        '50302': 'JP玩法(滚动全员奖励)',
        '50303': 'BONUS玩法(3次旋转金币)',
        '50304': 'FreeSpin玩法(免费旋转)'
      },
      slotsGames: [],
      gradeOptions: ['', '轻度', '中度', '重度']
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.getGameList()
  },
  methods: {
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].CategoryID === 1) { // 老虎机
              this.slotsGames.push({
                value: response.Data[i].Gid,
                label: response.Data[i].Description
              })
            }
          }
        }
      })
    },
    getInfo() {
      const $this = this
      this.saveFlag = false
      let searchUid = 0
      if (this.form.uid > 0) {
        searchUid = this.form.uid
      } else {
        return
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          uid: searchUid,
          gid: this.form.tag_gid,
          Path: '/slotsStat/user/tags'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.form.user_tags = response.Data
        }
      })
    },
    showTagId(tagId) {
      if (this.slotsTagMap[tagId]) {
        return '#' + tagId + ' ' + this.slotsTagMap[tagId]
      } else if (this.otherTagMap[tagId]) {
        return '#' + tagId + ' ' + this.otherTagMap[tagId] + '<非老虎机标签>'
      } else {
        return '#' + tagId + ' <无效标签>'
      }
    },
    showTagValue(tagId, tagValue) {
      if (this.slotsTagMap[tagId] && tagValue > 0 && tagValue < 4) {
        return this.gradeOptions[tagValue]
      }
      return ''
    }
  }
}
</script>
