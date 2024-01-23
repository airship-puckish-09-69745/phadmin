<template>
  <div class="app-container">


    <el-row :gutter="10" style="margin-top: 30px">

      <el-col :span="15"/>
      <el-col :span="22">
        <el-form inline>
          <el-form-item label="活动ID">
            <el-input v-model="queryData.ID" size="mini" placeholder="活动ID"/>
          </el-form-item>
          <el-form-item label="类型：">
            <el-select v-model="queryData.Type" placeholder="请选择" size="mini">
              <el-option label="全部" :value="0"/>
              <el-option
                  v-for="item in activityTypeOptions"
                  :key="item.key"
                  :label="item.value+'-'+item.key"
                  :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="开始日期：">
            <el-date-picker
                v-model="queryData.StartTime"
                value-format="timestamp"
                type="date"
                placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="结束日期：">
            <el-date-picker
                v-model="queryData.EndTime"
                value-format="timestamp"
                type="date"
                placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryData.Status" size="mini">
              <el-option label="全部" :value="0"/>
              <el-option v-for="(o,k) in statusOption" :label="o" :value="k"/>
            </el-select>
            <el-button type="success" @click="getData">查询</el-button>
          </el-form-item>
        </el-form>

      </el-col>
      <el-col :span="22">
        <el-button type="primary" size="mini" @click="openCreated">添加置项</el-button>
        <el-button type="success" size="mini" @click="publishData">发布配置</el-button>
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
              <template scope="scope">
                <el-button v-if="scope.row.Status==1" type="success" size="mini" @click="updateStatus(2, scope.row)">
                  上架
                </el-button>
                <el-button v-else-if="scope.row.Status==2||scope.row.Status==0" type="danger" size="mini"
                           @click="updateStatus(1, scope.row)">下架
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
                prop=""
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
        <el-row>
          <div class="block" style="text-align: center">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="offset"
                :page-sizes="[20, 50, 100, 200,300]"
                :page-size="limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
          </div>
        </el-row>
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
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput/index.vue'
import {getInfo} from "@/api/user";

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {Compare, MoneyInput, getInfo},
  data() {
    return {
      dataList: [],
      total: 0,
      showVisible: false,
      types: {1: '转出', 2: '转入'},
      activityTypeOptions: [
        {'key': 1, 'value': "Tongits"}],
      statusOption: {1: '上架', 2: '下架'},
      item: {
        ID: 0,
        ActivityType: 0,
        EndTime: 0,
        StartTime: 0,
        Title: "",
        NeedVirtualCoin: 0,
        TaskVirtualCoin: 0,
        Status: 0,
      },
      offset: 1,
      limit: 20,
      queryData: {
        ID: 0,
        Type: 0,
        StartTime: Date.parse(new Date()) - (60 * 60 * 24 * 30 * 1000),
        EndTime: Date.parse(new Date().toString()),
        Status: 0,
      },
      showBtn: false,
      startTime: Date.parse(new Date().toString()),
      endTime: Date.parse(new Date().toString()),

    }
  },

  created() {
    this.getData()
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
    },
    saveNew() {
      this.showVisible = false
      this.item.EndTime = this.startTime / 1000
      this.item.StartTime = this.endTime / 1000

      request({
        url: '/millionpointracerule/create',
        method: 'post',
        data: {
          ID: 1,
          Status: this.item.Status,
          ActivityType: this.item.ActivityType,
          StartTime: this.item.StartTime,
          EndTime: this.item.EndTime,
          NeedVirtualCoin: this.item.NeedVirtualCoin,
          TaskVirtualCoin: this.item.TaskVirtualCoin,
          Title: this.item.Title
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
    publishData() {
      request({
        url: '/millionpointracerule/publish',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('推送成功')
        } else {
          Message.error('推送失败')
        }
      })
    },
    saveEdit() {
      this.showVisible = false
      request({
        url: '/millionpointracerule/update',
        method: 'get',
        data: {
          ID: this.item.ID,
          Status: this.item.Status,
          ActivityType: this.item.ActivityType,
          StartTime: this.item.StartTime,
          EndTime: this.item.EndTime,
          NeedVirtualCoin: this.item.NeedVirtualCoin,
          TaskVirtualCoin: this.item.TaskVirtualCoin,
          Title: this.item.Title
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功')
        }
      })
    },
    updateStatus(status, row) {
      request({
        url: '/millionpointracerule/update',
        method: 'post',
        data: {
          ID: row.ID,
          Status: status,
          ActivityType: row.ActivityType,
          StartTime: row.StartTime,
          EndTime: row.EndTime,
          NeedVirtualCoin: row.NeedVirtualCoin,
          TaskVirtualCoin: row.TaskVirtualCoin,
          Title: row.Title
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.getData()
          Message.success('保存成功')
        }
      })
    },
    openEdit(idx, row) {
      this.item = row
      this.startTime = row.StartTime * 1000
      this.endTime = row.EndTime * 1000
      this.showBtn = true
      this.showVisible = true
    },
    openCreated() {
      this.showBtn = false
      this.showVisible = true
    },
    getData() {
      const $this = this
      if (this.queryData.ID == "") {
        this.queryData.ID = 0
      }
      // 加载基础数值配置
      request({
        url: '/millionpointracerule/config/all',
        method: 'get',
        data: {
          ID: this.queryData.ID,
          ActivityType: this.queryData.Type,
          Status: this.queryData.Status,
          StartTime: this.queryData.StartTime / 1000,
          EndTime: this.queryData.EndTime / 1000,
          Offset: this.offset,
          Limit: this.limit,
        }
      }).then(response => {
        if (response.RetCode === 0) {
          $this.dataList = response.Data.Data || []
          $this.total = response.Data.Count
          console.log(this.dataList)
          console.log(this.total)
          console.log(this.dataList)

        } else {
          Message.error('查询失败')
        }
      })
    },
  }
}

</script>
