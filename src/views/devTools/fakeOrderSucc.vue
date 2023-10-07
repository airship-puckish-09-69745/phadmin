<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="12" :offset="3">
        <el-form label-width="150px">
          <el-form-item label="Uid：">
            <el-input v-model.number="Uid" placeholder="placeholder" />
          </el-form-item>
          <el-form-item label="订单号：">
            <el-input v-model.number="OrderID" placeholder="placeholder" />
          </el-form-item>
          <el-col :offset="16" :span="8">
            <el-form-item>
              <el-button type="primary" @click="setData">提交</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      Uid: '',
      OrderID: ''
    }
  },
  created() {
    console.log(1)
  },
  methods: {
    setData() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Path: '/other/order/test',
          Uid: this.Uid,
          OrderID: this.OrderID
        }
      }).then(response => {
        Message.success('设置成功！')
      })
    }
  }
}
</script>
