<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top:50px">
      <el-col :span="18" :offset="2">

        <el-form>
          <el-table ref="filterTable" :data="Items" stripe border style="width:100%;margin:10px auto;">
            <el-table-column prop="AppsStr" label="应用ID列表，使用英文逗号间隔">
              <template slot-scope="scope">
                <el-input v-model="scope.row.AppsStr" placeholder="多个应用英文逗号（,）隔开" />
              </template>
            </el-table-column>
            <el-table-column prop="TransferRate" label="Winnings转化比例" width="200">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.TransferRate" placeholder="默认100%"><template slot="append">%</template></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="AppsStr" label="操作" width="200">
              <template slot-scope="scope">
               <el-button type="success" @click="addItem(scope.$index)">添加</el-button>
               <el-button type="danger" @click="delItem(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
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
import MoneyInput from '@/components/MoneyInput'
import request from '@/utils/request'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput },
  data() {
    return {
      Items: [
        {
          'Apps': [1],
          'AppsStr': '1',
          'TransferRate': 100
        }
      ],
      form: {
      },
      subKey: 'zjh_transfer_cfg'
    }
  },
  created() {
    this.getData()
  },
  methods: {
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
            for (let i = 0; i < data.Items.length; i++) {
              data.Items[i].AppsStr = data.Items[i].Apps.join(',')
            }
            $this.Items = data.Items
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
      })
    },
    setData() {
      for (let i = 0; i < this.Items.length; i++) {
        let apps = this.Items[i].AppsStr.split(',')
        this.Items[i].Apps = []
        for (let j = 0; j < apps.length; j++) {
          this.Items[i].Apps.push(parseInt(apps[j]))
        }
      }
      this.form.Data = JSON.stringify({'Items': this.Items})
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
            Message.success('保存成功')
          }
        })
      })
    },
    addItem(idx) {
      this.Items.splice(idx+1, 0, {'Apps': [], 'AppsStr': '', 'TransferRate': 0})
    },
    delItem(idx) {
      this.$delete(this.Items, idx)
    }
  }
}
</script>
