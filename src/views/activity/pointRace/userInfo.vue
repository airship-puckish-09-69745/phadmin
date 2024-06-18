<template>
  <div class="app-container">

    <el-row :gutter="10" style="margin-top: 10px">
      <el-form label-width="90px" :inline="true" size="small">
        <el-form-item label="UID：" :required="true" label-width="150px">
          <UidInput @setUid="function(iUid){courseInfo.Uid=iUid}" />
        </el-form-item>

        <el-form-item label="周期：">

          <el-select v-model="courseInfo.ActId" placeholder="周期" @change="itemLevelOneChanged">
            <el-option
              v-for="item in itemOneList"
              :key="item.Id"
              :label="item.Title"
              :value="item.Id"
            />
          </el-select>

          <el-select v-model="courseInfo.ItemId" placeholder="请选择赛段" style="width: 280px;">
            <el-option
              v-for="item in itemTwoList"
              :key="item.Id"
              :label="item.Title"
              :value="item.Id"
            />
          </el-select>

        </el-form-item>

        <el-form-item>
          <el-button type="success" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-descriptions class="margin-top" :column="1" border>
        <el-descriptions-item>
          <template slot="label">
            添加或扣减虚拟币
          </template>
          <el-col>
            <el-form inline>
              <el-form-item>
                <el-input v-model="addVirtualCoin" size="mini" style="width: 200px" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="updateUserVirtualCoin">更新虚拟币</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            添加或扣减积分(只提供开发环境)
          </template>
          <el-col>
            <el-form inline>
              <el-form-item>
                <el-input v-model="addPoint" size="mini" style="width: 200px" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="updateUserPoint">更新积分</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            当前虚拟币
          </template>
          {{ virtualCoin | toRupee }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            当前积分
          </template>
          {{ point | toRupee }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            当前排名(0表示未上榜)
          </template>
          {{ rank }}
        </el-descriptions-item>

      </el-descriptions>
    </el-row>

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare/index.vue'
import request from '@/utils/request'
import UidInput from '@/components/UidInput'
import MoneyInput from '@/components/MoneyInput/index.vue'
import { getInfo } from '@/api/user'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, MoneyInput, UidInput, getInfo },
  data() {
    return {
      rank: 0,
      uid: '',
      point: 0,
      virtualCoin: 0,
      addVirtualCoin: 0,
      addPoint: 0,
      courseInfo: {
        ItemId: '',
        ActId: '',
        Uid: ''
      },
      itemOneList: [],
      itemTwoList: []
    }
  },
  created() {
    this.getSelectOpt()
  },
  methods: {
    getSelectOpt() {
      request({
        url: '/pointracerule/select/opt',
        method: 'get',
        data: { }
      }).then(response => {
        if (response.RetCode === 0) {
          this.itemOneList = response.Data
          console.log('itemOneList', this.itemOneList)
        } else {
          Message.error('查询失败')
        }
      })
    },
    itemLevelOneChanged(value) {
      for (var i = 0; i < this.itemOneList.length; i++) {
        var oneitem = this.itemOneList[i]
        if (value === oneitem.Id) {
          this.itemTwoList = oneitem.Child
          this.courseInfo.ItemId = ''
        }
      }
    },
    updateUserVirtualCoin() {
      if (this.courseInfo.Uid == '') {
        Message.error('请输入UID')
        return
      }
      if (this.courseInfo.ActId == '') {
        Message.error('请选择周期')
        return
      }
      if (this.courseInfo.ItemId == '') {
        Message.error('请选择赛段')
        return
      }
      if (parseInt(this.addVirtualCoin) === 0) {
        Message.error('变化的值不能为0')
        return
      }

      request({
        url: 'pointracerule/update/user',
        method: 'post',
        data: {
          Uid: this.courseInfo.Uid,
          ActId: this.courseInfo.ActId,
          ItemId: this.courseInfo.ItemId,
          VirtualCoin: parseInt(this.addVirtualCoin) * 1000,
          Point: 0,
          Path: '/millonpointrace/update/user'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log(response.data)
          if (response.RetCode !== 0) {
            Message.error('更新失败')
            return
          }
          Message.success('更新成功')
          this.getData()
        } else {
          Message.error('查询失败')
        }
      })
    },
    updateUserPoint() {
      if (this.courseInfo.Uid == '') {
        Message.error('请输入UID')
        return
      }
      if (this.courseInfo.ActId == '') {
        Message.error('请选择周期')
        return
      }
      if (this.courseInfo.ItemId == '') {
        Message.error('请选择赛段')
        return
      }
      if (parseInt(this.addPoint) === 0) {
        Message.error('变化的值不能为0')
        return
      }

      request({
        url: 'pointracerule/update/user',
        method: 'post',
        data: {
          Uid: this.courseInfo.Uid,
          ActId: this.courseInfo.ActId,
          ItemId: this.courseInfo.ItemId,
          VirtualCoin: 0,
          Point: parseInt(this.addPoint) * 1000,
          Path: '/pointrace/update/user'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log(response.data)
          if (response.RetCode !== 0) {
            Message.error('更新失败')
            return
          }
          Message.success('更新成功')
          this.getData()
        } else {
          Message.error('查询失败')
        }
      })
    },

    getData() {
      if (this.courseInfo.Uid == '') {
        Message.error('请输入UID')
        return
      }
      if (this.courseInfo.ActId == '') {
        Message.error('请选择周期')
        return
      }
      if (this.courseInfo.ItemId == '') {
        Message.error('请选择赛段')
        return
      }
      const $this = this
      // 加载基础数值配置
      request({
        url: '/pointracerule/user/detail',
        method: 'get',
        data: {
          Uid: this.courseInfo.Uid,
          ActId: this.courseInfo.ActId,
          ItemId: this.courseInfo.ItemId,
          Path: '/pointrace/user/detail'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          var obj = JSON.parse(response.Data)
          console.log(obj)
          if (obj.RetCode != 0) {
            Message.error('查询失败')
            return
          }
          this.virtualCoin = obj.Data.userData.VirtualCoin
          this.point = obj.Data.userData.Point
          this.rank = obj.Data.rank.Rank
        } else {
          Message.error('查询失败')
        }
      })
    }
  }
}

</script>
<style scoped>
.el-descriptions__body {
  width: 50%;
}
</style>
