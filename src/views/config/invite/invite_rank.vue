<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 50px">
      <el-col :span="8" :offset="6">

        <el-form ref="item" :model="item" label-width="150px">

          <el-button type="primary" size="mini" @click="addRankPrize">添加排名奖励</el-button>
          <el-table
            :data="item.RankInfo"
            style="width: 100%"
            border
          >
            <el-table-column
              prop="Ratio"
              label="排名"
              width="150"
            >
              <template slot-scope="scope">
                <el-form-item label-width="0" :prop="`RankInfo[${scope.$index}].Rank`" :rules="dataRule(true,{type:'n'})">
                  <el-input v-model.number="scope.row.Rank" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              prop="Prize"
              label="奖励"
            >
              <template slot-scope="scope">
                <money-input v-model="scope.row.Prize" label-width="0" label="" :is-require="false" />
              </template>
            </el-table-column>

            <el-table-column
              prop="IsShow"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="delRankPrize(scope.$index)">删除</el-button>
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
import request from '@/utils/request'
import { DataRule, ValidateVueItem } from '@/utils/common'
import MoneyInput from '@/components/MoneyInput'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish, MoneyInput },
  data() {
    return {
      item: {
        'RankInfo': [
          {
            'Rank': 1,
            'Prize': 4000000
          }
        ]
      },
      form: {
      },
      txt: '',
      subKey: 'invite_rank'
    }
  },
  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    dataRule(required, config) {
      return DataRule(required, config)
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    addRankPrize() {
      this.item.RankInfo.push({ Rank: 0, Prize: 0 })
    },
    rankPrizeSort() {
      this.item.RankInfo.sort(function(a, b) {
        return a.Rank - b.Rank
      })
    },
    delRankPrize(index) {
      const $this = this
      this.$confirm('确定要删除吗？', '提醒')
        .then(function() {
          $this.item.RankInfo.splice(index, 1)
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
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            const data = JSON.parse(response.Data.Data)
            $this.item = this.DeepCopy(data)
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(data)
          }
        }
      })
    },
    setData() {
      if (!ValidateVueItem(this.$refs['item'])) return false
      this.rankPrizeSort()
      this.form.Data = JSON.stringify(this.item)
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
