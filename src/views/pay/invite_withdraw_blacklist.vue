<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="8" :offset="1">
        <el-alert
          title="在邀请提现黑名单的用户，无法使用分享提现"
          type="error">
        </el-alert>
        <br/>
        <br/>
        <el-form ref="form" :model="form" label-width="150px">
          <el-table
            :data="uids"
            border
            style="width: 100%">
            <el-table-column
              label="uid">
              <template slot-scope="scope">
                <el-input v-model="scope.row.uid" placeholder="输入用户uid"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="op"
              label="操作">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="del(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <br/>
          <br/>
          <el-button type="primary" @click="add">添加用户</el-button>
          <el-button type="success" @click="setData">保存</el-button>
        </el-form>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />

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
      form: {
      },
      uids: [],
      txt: '',
      subKey: 'invite_withdraw_blacklist'
    }
  },
  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    add() {
      this.uids.push({
        uid: ''
      })
    },
    del(idx) {
      this.uids.splice(idx, 1)
    },
    decode(data) {
      this.uids = []
      for (const i in data) {
        this.uids.push({
          uid: data[i]
        })
      }
    },
    encode() {
      const uids = []
      for (const i in this.uids) {
        uids.push(this.uids[i]['uid'])
      }
      return JSON.stringify(uids)
    },
    getData() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('response', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const uids = JSON.parse(response.Data.Data)
            this.decode(uids)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
      })
    },
    setData() {
      this.form.Data = this.encode()
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
            console.log('set data response', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
