<script>
import request from "@/utils/request";
import {$libDate, DataRule} from "@/utils/common";
import Publish from "@/components/Publish/index.vue";
import Compare from '@/components/Compare/index.vue'
import {Message} from "element-ui";

export default {
  components: {Publish,Compare},
  data() {
    return {
      subKey: 'pusoy_black_cfg',
      blacks: [],
      totalCount: 0,
      currentPage: 1,
      pageNum: 20,
      Uid:0,
      Gid:21,
      options: [{
        value: 21,
        label: 'PUSOY'
      }, {
        value: 126,
        label: 'PUSOYWILD'
      }],
      item: {
        IsOpen: false,
      }
    }
  },
  created() {
    this.getData()
    this.getBlack()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getBlack(){
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/misc/pusoy/black',
          Page: this.currentPage,
          Limit: this.pageNum,
          Uid: this.Uid,
          Gid: this.Gid
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const data = response.Data || {}
          $this.blacks = data.Items || []
          $this.totalCount = data.Total || 0
        }
      })
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatGameId(gameId) {
      if (gameId == 21) {
        return 'Pusoy'
      }else {
        return 'PusoyWild'
      }
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageNum = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getInfo()
    },
    encodeData() {
      const cpy = {}
      Object.assign(cpy, this.item)
      return JSON.stringify(cpy)
    },
    setData() {
      this.form.Data = this.encodeData()
      console.log('setData', this.form.Data)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('save', response)
            Message.success('保存成功')
          }
        })
      })
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
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            $this.item = JSON.parse(response.Data.Data)
            const old = JSON.parse(response.Data.Data)
            this.$refs.compare.SetOldVal(old)
          }
        }
      })
    },
  }
}
</script>

<template>

  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>
    <el-row :span="1">
      <template>
        {{ "开关说明：一桌是否可以进1个黑名单" }}
      </template>
    </el-row>
    <el-row :span="6">
      <el-form :model="item" label-width="150px" size="small">
        <el-col :span="6">
          <el-form-item label="黑名单进桌开关" :rules="dataRule(true,{type:'n',range:'0'})">
            <el-switch
              v-model="item.IsOpen"
              :active-value="true"
              :inactive-value="false"
            >
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="mini" @click="setData">保存</el-button>
        </el-col>
      </el-form>
    </el-row>


    <el-row :span="6">
      <el-form label-width="150px" size="small">
        <el-col :span="6">
          <el-form-item label="UID：" :required="true">
            <el-input v-model.number="Uid" placeholder="请输入uid" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="游戏：" :required="true">
            <el-select v-model.number="Gid" placeholder="请选择">
              <el-option
                v-for="itemGid in options"
                :key="itemGid.value"
                :label="itemGid.label"
                :value="itemGid.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="mini" @click="getBlack">查询</el-button>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        :data="blacks"
        border
        style="width: 100%">
        <el-table-column
          prop="Uid1"
          label="玩家1"
          width="400">
        </el-table-column>

        <el-table-column
          prop="Uid2"
          label="玩家2"
          width="400">
        </el-table-column>

        <el-table-column
          prop="Uid3"
          label="玩家3"
          width="400">
        </el-table-column>
        <el-table-column
          prop="Gid"
          label="游戏"
          width="400">
          <template slot-scope="scope">
            {{ formatGameId(scope.row.Gid) }}
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <div class="block">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[20, 40, 60, 80]"
            :page-size="pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<style>

</style>
