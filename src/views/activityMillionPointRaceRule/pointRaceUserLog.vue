<template>
  <div class="app-container">


    <el-row :gutter="10" style="margin-top: 30px">

      <el-col :span="15"/>
      <el-col :span="22">
        <el-form inline>
          <el-form-item label="活动ID">
            <el-input v-model="queryData.ActivityId" size="mini" placeholder="活动ID"/>
          </el-form-item>
          <el-form-item label="L">
            <el-input v-model="queryData.LastRank" size="mini" placeholder="活动ID"/>
          </el-form-item>
          <el-form-item label="活动ID">
            <el-input v-model="queryData.ActivityId" size="mini" placeholder="活动ID"/>
          </el-form-item>
<!--          <el-form-item label="类型：">-->
<!--            <el-select v-model="queryData.Type" placeholder="请选择" size="mini">-->
<!--              <el-option label="全部" :value="0"/>-->
<!--              <el-option-->
<!--                  v-for="item in activityTypeOptions"-->
<!--                  :key="item.key"-->
<!--                  :label="item.value+'-'+item.key"-->
<!--                  :value="item.key"-->
<!--              />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="开始日期：">-->
<!--            <el-date-picker-->
<!--                v-model="queryData.StartTime"-->
<!--                value-format="timestamp"-->
<!--                type="date"-->
<!--                placeholder="选择日期"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="结束日期：">-->
<!--            <el-date-picker-->
<!--                v-model="queryData.EndTime"-->
<!--                value-format="timestamp"-->
<!--                type="date"-->
<!--                placeholder="选择日期"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="状态">-->
<!--            <el-select v-model="queryData.Status" size="mini">-->
<!--              <el-option label="全部" :value="0"/>-->
<!--              <el-option v-for="(o,k) in statusOption" :label="o" :value="k"/>-->
<!--            </el-select>-->
<!--            <el-button type="success" @click="getData">查询</el-button>-->
<!--          </el-form-item>-->
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
                prop="Rank"
                label="排名"
            ></el-table-column>

            <el-table-column
                prop="UID"
                label="UID"
            >
            </el-table-column>

            <el-table-column
                prop="Point"
                label="积分"
            >

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
        ActivityId: 0,
        LastRank: 0,
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
    getData() {
      const $this = this
      if (this.queryData.ID == "") {
        this.queryData.ID = 0
      }
      // 加载基础数值配置
      request({
        url: '/millionpointracerule/user/rank',
        method: 'get',
        data: {
          ActivityId: 0,
          LastRank: this.limit,
          PageSize: this.offset,
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
