<template>
  <div class="app-container">


    <el-row :gutter="10" style="margin-top: 30px">

      <el-col :span="15"/>
      <el-col :span="22">
        <el-button type="primary" size="mini" @click="openCreated">添加置项</el-button>
      </el-col>
      <el-col :span="2">
      </el-col>

      <el-col :span="24">
        <el-form ref="allCfg" label-width="150px">
          <el-table
              :data="dataList"
              style="width: 95%"
              border
          >

            <el-table-column
                prop="ID"
                label="活动ID"
            ></el-table-column>

            <el-table-column
                prop="ActivityType"
                label="游戏类型"
            >
            </el-table-column>

            <el-table-column
                prop="StartTime"
                label="开始时间"
            >
              <template scope="scope">
                {{ new Date(scope.row.StartTime * 1000).Format("yyyy-MM-dd HH:mm:ss") }}
              </template>
            </el-table-column>

            <el-table-column
                prop="EndTime"
                label="结束时间"
            >
              <template scope="scope">
                {{ new Date(scope.row.EndTime * 1000).Format("yyyy-MM-dd HH:mm:ss") }}
              </template>
            </el-table-column>
            <el-table-column
                prop="NeedVirtualCoin"
                label="需求虚拟币"
            >
            </el-table-column>
            <el-table-column
                prop="Status"
                label="状态"
            >
            </el-table-column>
            <el-table-column
                prop="UpdateTime"
                label="最后更新时间"
            >
              <template scope="scope">
                {{ new Date(scope.row.UpdateTime * 1000).Format("yyyy-MM-dd HH:mm:ss") }}
              </template>
            </el-table-column>
            <el-table-column
                prop="ModifyUser"
                label="最后更新人"
            >
              <template scope="scope">
                {{ scope.row.ModifyUser }}
              </template>
            </el-table-column>


            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="success" size="mini" @click="openEdit(scope.$index, scope.row)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <br>
          <br>

        </el-form>
      </el-col>


    </el-row>

    <!--对比组件-->
    <compare ref="compare"/>

    <el-dialog
        title="选择游戏"
        :visible.sync="showVisible"
        width="650px"
    >

      <el-form label-width="150px">
        <!--        <el-form-item label="活动ID">-->
        <!--          <el-input v-model="item.ActId" type="number" placeholder="请输入" size="mini"-->
        <!--                    oninput="value=value.replace(/[^\d.]/g,'')" STYLE="width: 220px"></el-input>-->

        <!--        </el-form-item>-->
        <el-form-item label="标题">
          <el-input v-model="item.Title"
                    placeholder="请输入" size="mini" STYLE="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="游戏类型">
          <el-select v-model="item.ActivityType" placeholder="请选择" size="mini">
            <el-option
                v-for="item in activityTypeOptions"
                :key="item.key"
                :label="item.value+'-'+item.key"
                :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="startTime" type="datetime" placeholder="选择开始时间" value-format="timestamp"
                          size="mini">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间">
          <el-date-picker v-model="endTime" type="datetime" placeholder="选择结束时间" value-format="timestamp"
                          size="mini">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="需要的虚拟币">
          <el-input v-model="item.NeedVirtualCoin" type="number" oninput="value=value.replace(/[^\d.]/g,'')"
                    placeholder="请输入" size="mini" STYLE="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="需要的游戏币">
          <el-input v-model="item.TaskVirtualCoin" type="number" oninput="value=value.replace(/[^\d.]/g,'')"
                    placeholder="请输入" size="mini" STYLE="width: 220px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="showBtn===false" type="primary" @click="saveNew">确定</el-button>
          <el-button v-if="showBtn===true" type="primary" @click="saveEdit">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import {Message} from 'element-ui'
import Compare from '@/components/Compare/index.vue'
import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput/index.vue'
import {getInfo} from "@/api/user";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {Compare, Publish, MoneyInput, getInfo},
  data() {
    return {
      dataList: [],
      total: 0,
      showVisible: false,
      activityTypeOptions: [
        {'key': 1, 'value': 2},
        {"key": 3, "value": "Tongits"},
        {"key": 2, "value": "Tongits2"}],
      item: {
        ID:0,
        ActivityType: 0,
        EndTime: 0,
        StartTime: 0,
        Title: "",
        NeedVirtualCoin: 0,
        TaskVirtualCoin: 0,
      },
      showBtn: false,
      startTime: Date.parse(new Date().toString()),
      endTime: Date.parse(new Date().toString()),

    }
  },
  created() {
    console.log("asd")
    this.getData()
  },
  methods: {
    saveNew() {
      this.showVisible = false
      this.item.EndTime=this.startTime/1000
      this.item.StartTime=this.endTime/1000

      request({
        url: '/millionpointracerule/create',
        method: 'post',
        data: {
          ID:1,
          Status:1,
          ActivityType: this.item.ActivityType,
          StartTime: this.item.StartTime,
          EndTime:  this.item.EndTime,
          NeedVirtualCoin:this.item.NeedVirtualCoin,
          TaskVirtualCoin:this.item.TaskVirtualCoin,
          Title:this.item.Title
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.getData()
        } else {
          Message.error('新增失败')
        }
      })
      console.log(this.item)
    },
    saveEdit() {
      this.showVisible = false
      request({
        url: '/millionpointracerule/update',
        method: 'post',
        data: {
          ID:this.item.ID,
          ActivityType: this.item.ActivityType,
          StartTime: this.item.StartTime,
          EndTime:  this.item.EndTime,
          NeedVirtualCoin:this.item.NeedVirtualCoin,
          // TaskVirtualCoin:this.item.TaskVirtualCoin,
          Title:this.item.Title
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.getData()
        } else {
          Message.error('新增失败')
        }
      })
    },
    openEdit(idx, row) {
      this.item = row
      this.startTime=row.StartTime*1000
      this.endTime=row.EndTime*1000
      this.showBtn = true
      this.showVisible = true
    },
    openCreated() {
      this.showBtn = false
      this.showVisible = true
    },
    getData() {
      const $this = this
      // 加载基础数值配置
      request({
        url: '/millionpointracerule/activity/log',
        method: 'get',
        data: {
          UID: 0,
          ActivityType: 0,
          ActivityId: 0,
          EventType: 0,
          Status: 1,
          StartTime: 1,
          EndTime: 1705593601,
          Offset: 0,
          Limit: 100,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.dataList = response.Data.Data || {}
          $this.total = response.Data.Count || {}
          console.log(this.dataList)
          console.log(this.total)
        } else {
          Message.error('查询失败')
        }
      })
    },
  }
}

</script>
