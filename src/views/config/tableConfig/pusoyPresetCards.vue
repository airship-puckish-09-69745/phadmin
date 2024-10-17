<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <el-col :span="20" :offset="1">
        <h5>牌局结束补机器人配置 <el-button type="text" @click="addUserCfg">添加用户</el-button></h5>
        <el-table :data="item.users" border>
          <el-table-column label="UID" width="200">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.uid" size="mini" />
            </template>
          </el-table-column>
          <el-table-column label="是否启用" width="200">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.enableFlag" />
            </template>
          </el-table-column>
          <el-table-column label="配牌概率(%)" width="300">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.enableOdds" size="mini"><template slot="append">%</template></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="delUserCfg(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <br />
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="5" :offset="1">
        <el-button type="primary" @click="setData">保存</el-button>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />
  </el-col>

</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { DataRule } from '@/utils/common'
import MoneyInput from '@/components/MoneyInput'

function newUserCfg(uid, flag, odds) {
  return {
    uid: uid,
    enableFlag: flag,
    enableOdds: odds
  }
}

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput },
  data() {
    return {
      subKey: 'pusoy_preset_cards',
      item: {
        'users': [newUserCfg(0, false, 0)]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    addUserCfg() {
      this.item.users.push(newUserCfg(0, false, 0))
    },
    delUserCfg(idx) {
      this.$confirm('要删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.item.users, idx)
      })
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
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
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const data = JSON.parse(response.Data.Data)
            const old = JSON.parse(JSON.stringify(data))
            $this.item = this.DeepCopy(data)
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(old)
          }
        }
      })
    },
    encodeData() {
      const cpy = {}
      Object.assign(cpy, this.item)
      return JSON.stringify(cpy)
    },
    setData() {
      this.form.Data = this.encodeData()
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
    }
  }
}
</script>
