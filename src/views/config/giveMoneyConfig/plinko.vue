<template>
  <div class="app-container">
    <publish primary-key="Volume" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    <el-row style="margin-top: 30px">
      <el-col :span="8" :offset="4">
        <el-form ref="form" :model="form" label-width="300px">
          <el-row>
            <money-input v-model.number="cfg.MinBetMoney" label="最小下注金额" />
          </el-row>
          <el-row>
            <money-input v-model.number="cfg.MaxBetMoney" label="最大下注金额" />
          </el-row>
          <el-row>
            <money-input v-model.number="cfg.DefaultBetMoney" label="默认下注金额" />
          </el-row>
          <el-row>
            <el-form-item label="赢钱转换可提现金额比例：">
              <el-input v-model.number="cfg.TransferRate" placeholder=""><template slot="append">%</template></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="自己的记录数量：">
              <el-input v-model.number="cfg.MyRecordCount" placeholder=""><template slot="append">条</template></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="中奖记录数量：">
              <el-input v-model.number="cfg.RewardRecordCount" placeholder=""><template slot="append">条</template></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px">
      <el-col :span="16" :offset="3">
        <h3>通道配置(赔率支持3位小数) <el-button @click="addChannel(-1)" size="mini">添加新通道</el-button></h3>
        <el-row>
          <el-table :data="cfg.Channels" border style="width: 100%" :header-cell-style="tableHeadStyle" :cell-style="tableCellStyle">
            <el-table-column prop="ID" label="通道ID" width="100">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.ID" placeholder=""></el-input>
              </template>
            </el-table-column>
            <el-table-column label="红色">
              <el-table-column prop="Red" label="赔率" style="background-color: #ffbbbb;">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.Red.Odds" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="Red" label="概率">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Red.HitRates" placeholder=""></el-input>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="绿色">
              <el-table-column prop="Red" label="赔率">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.Green.Odds" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="Red" label="概率">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Green.HitRates" placeholder=""></el-input>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="蓝色">
              <el-table-column prop="Red" label="赔率">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.Blue.Odds" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="Red" label="概率">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.Blue.HitRates" placeholder=""></el-input>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="ID" label="操作" width="160">
              <template slot-scope="scope">
                <el-button @click="addChannel(scope.$index)" size="mini">追加</el-button>
                <el-button type="danger" @click="delChannel(scope.$index)" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <el-button type="primary" @click="setData" style="margin-top:30px;">保存</el-button>
        </el-row>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import MoneyInput from '@/components/MoneyInput'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Publish, Compare, MoneyInput },
  data() {
    return {
      cfg: {
        MinBetMoney: 0,
        MaxBetMoney: 0,
        DefaultBetMoney: 0,
        MyRecordCount: 0,
        RewardRecordCount: 0,
        TransferRate: 0,
        Channels: [
          {
            ID: 0,
            Red: {
              Color: 1,
              Odds: 0,
              HitRates: 0
            },
            Green: {
              Color: 2,
              Odds: 0,
              HitRates: 0
            },
            Blue: {
              Color: 3,
              Odds: 0,
              HitRates: 0
            }
          }
        ]
      },
      form: {
      },
      txt: '',
      subKey: 'plinko_cfg',
      AttrNames: {
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    addChannel(idx) {
      this.cfg.Channels.splice(idx+1, 0, {
        ID: 0,
        Red: {
          Color: 1,
          Odds: 0,
          HitRates: 0
        },
        Green: {
          Color: 2,
          Odds: 0,
          HitRates: 0
        },
        Blue: {
          Color: 3,
          Odds: 0,
          HitRates: 0
        }
      })
    },
    delChannel(idx) {
      this.$delete(this.cfg.Channels, idx)
    },
    tableHeadStyle(data) {
      if (data.rowIndex == 0) {
        switch (data.columnIndex) {
          case 1:
            return 'background-color: #FFBFBF;'
          case 2:
            return 'background-color: #BFFFBF;'
          case 3:
            return 'background-color: #9FBFFF;'
          default:
            return ''
        }
      } else if (data.rowIndex == 1) {
        switch (data.columnIndex) {
          case 0:
            return 'background-color: #FFBFBF;'
          case 1:
            return 'background-color: #FFBFBF;'
          case 2:
            return 'background-color: #BFFFBF;'
          case 3:
            return 'background-color: #BFFFBF;'
          case 4:
            return 'background-color: #9FBFFF;'
          case 5:
            return 'background-color: #9FBFFF;'
          default:
            return ''
        }
      } else {
        return ''
      }
    },
    tableCellStyle(data) {
      switch (data.columnIndex) {
        case 1:
          return 'background-color: #FFBFBF;'
        case 2:
          return 'background-color: #FFBFBF;'
        case 3:
          return 'background-color: #BFFFBF;'
        case 4:
          return 'background-color: #BFFFBF;'
        case 5:
          return 'background-color: #9FBFFF;'
        case 6:
          return 'background-color: #9FBFFF;'
        default:
          return ''
      }
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
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            $this.cfg = JSON.parse(response.Data.Data);
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(response.Data);
          }
        }
      })
    },
    getPostData() {
      const postData = {}
      Object.assign(postData, this.cfg)
      return postData
    },
    setData() {
      const postData = this.getPostData()
      for (let i = 0; i < postData.Channels.length; i++) {
        postData.Channels[i].Red.Odds = parseFloat(postData.Channels[i].Red.Odds)
        postData.Channels[i].Green.Odds = parseFloat(postData.Channels[i].Green.Odds)
        postData.Channels[i].Blue.Odds = parseFloat(postData.Channels[i].Blue.Odds)
      }
      this.form.Data = JSON.stringify(postData)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form)
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
    }
  }
}
</script>
