<template>
  <div class="app-container">
    <el-row>
      <el-form :model="item" label-width="150px" size="small">
        <el-col :span="3" :offset="4">
          <el-select v-model.number="item.iType" size="mini" placeholder="请选择" @change="item.Value=''">
            <el-option label="按设备" :value="1" />
            <el-option label="按Uid" :value="2" />
            <el-option label="按IP" :value="3" />
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-form-item v-if="item.iType==2" label="UID：" :required="true">
            <UidInput @setUid="function(iUid){item.Uid=iUid}" />
          </el-form-item>
          <el-form-item v-else label="" :required="true">
            <el-input v-model="item.Value" size="mini" />
          </el-form-item>
        </el-col>
        <el-col :offset="1" :span="2">
          <el-button type="primary" size="mini" @click="getInfo">查询</el-button>
        </el-col>
      </el-form>
    </el-row>
    <el-col :offset="4" :span="12">
      <el-descriptions
        class="margin-top"
        :column="2"
        size="medium"
        :label-style="{'text-align': 'right', 'font-weight':'bold','padding':'5px'}"
        border
      >
        <el-descriptions-item v-if="item.iType===2" label="Uid：">{{ ret.uid===0?item.Uid:ret.uid }}</el-descriptions-item>
        <el-descriptions-item v-if="item.iType===1" label="设备：">{{ ret.deviceCode===''?item.Value:ret.deviceCode }}</el-descriptions-item>
        <el-descriptions-item v-if="item.iType===3" label="IP：">{{ ret.ip===''?item.Value:ret.ip }}</el-descriptions-item>
        <el-descriptions-item label="结论：">{{ ret.operator===''?'否':'是' }}</el-descriptions-item>
        <template v-if="ret.operator!==''">
          <el-descriptions-item label="操作者：">{{ ret.operator }}</el-descriptions-item>
          <el-descriptions-item label="更新时间：">{{ formatTime(ret.updateTime) }}</el-descriptions-item>
          <el-descriptions-item label="原因：" span="2">{{ getReason(ret.reason) }}</el-descriptions-item>
          <el-descriptions-item label="说明：" span="2">{{ ret.note }}</el-descriptions-item>
        </template>
      </el-descriptions>
      <el-button v-if="canDelete" size="mini" @click="delInfo">删除</el-button>
    </el-col>
  </div>
</template>

<script>
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import UidInput from '@/components/UidInput'
import request from '@/utils/request'
import { $libDate, $libShow, ClientTableData, MoneyShow } from '@/utils/common'
import store from '@/store'
import { Message } from 'element-ui'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, UidInput },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 10, {}),
      libShow: $libShow,

      item: {
        iType: 2,
        Uid: 0,
        Value: ''
      },
      ret: {}
    }
  },
  computed: {
    canDelete() {
      return this.$store.state.user.name === 'howard'
    }
  },
  created() {
    this.env = store.getters.env || this.env
    console.log(1)
  },
  methods: {
    getReason(iType) {
      switch (iType) {
        case 1:
        case 31:
          return '管理员操作'
        case 2:
        case 32:
          return '审核期间访问'
        case 3:
        case 33:
          return 'SIM卡非印度'
        case 4:
        case 34:
          return '中国IP'
        case 5:
        case 35:
          return '美国IP'
        case 6:
        case 36:
          return '非印度IP'
        default:
          return '错误类型：' + iType
      }
    },
    // 显示相关
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    getInfo() {
      if (this.item.iType === 2) {
        if (this.item.Uid === 0) {
          Message.error('请输入正确的Uid')
          return
        }
        this.$EventBus.$emit('uid-change', this.item.Uid)
      }

      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          Path: '/other/black/info',
          Type: this.item.iType,
          Uid: this.item.Uid,
          Device: this.item.Value,
          IP: this.item.Value
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.ret = response.Data || {}
        }
      })
    },
    delInfo() {
      this.$confirm('确定要删除此黑名单数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: this.env,
            Path: '/safe/black/info/del',
            Type: this.item.iType,
            Uid: this.item.Uid,
            Device: this.item.Value,
            IP: this.item.Value
          }
        }).then(response => {
          if (response.RetCode === 0) {
            this.ret = response.Data || {}
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    }
  }
}
</script>

