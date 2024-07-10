<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :attr-names="AttrNames" />
    </el-row>
    <!--公共配置-->
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="14" :offset="3">
        <el-form ref="form" label-position="left">

          <!--
          <template>
            <el-alert type="success" description="多个应用英文逗号(,)分开,开放所有应用留空" />
          </template>
          <el-row>
            <el-col :span="24">
              <el-form-item label="开放的应用列表">
                <el-input v-model="item.AppsStr" type="textarea" :rows="5" placeholder="多个应用英文逗号(,)分开,开放所有应用留空" />
              </el-form-item>
            </el-col>
          </el-row>
          -->

          <el-row>
            <el-col :span="6">
              <el-form-item label="日赛榜单最大名次：">
                <el-input v-model.number="item.RankMaxDay" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="1">
              <el-form-item label="周赛榜单最大名次：">
                <el-input v-model.number="item.RankMaxWeek" placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <fieldset style="margin-top:10px">
              <legend>日赛奖励配置</legend>
              <el-alert
                type="success"
                description="开始=结束，说明是同一名"
              />
              <el-row style="margin-top:10px">
                <el-button type="primary" size="mini" @click="addRewardRow(1)">添加</el-button>
              </el-row>
              <el-row>
                <template>
                  <el-table :data="item.DayPrizeList" border>
                    <el-table-column label="范围开始(第N名)">
                      <template scope="scope">
                        <el-input v-model.number="scope.row.Start" />
                      </template>
                    </el-table-column>
                    <el-table-column label="范围结束(第N名)">
                      <template scope="scope">
                        <el-input v-model.number="scope.row.End" />
                      </template>
                    </el-table-column>
                    <el-table-column label="奖励">
                      <template scope="scope">
                        <el-input v-model.number="scope.row.Reward" />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template scope="scope">
                        <el-popconfirm title="确定删除吗？" @confirm="removeRewardRow(scope.$index, 1)">
                          <el-button slot="reference" size="mini" type="danger">删除</el-button>
                        </el-popconfirm>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-row>
            </fieldset>
          </el-row>

          <el-row>
            <fieldset style="margin-top:10px">
              <legend>周赛奖励配置</legend>
              <el-alert
                type="success"
                description="开始=结束，说明是同一名"
              />
              <el-row style="margin-top:10px">
                <el-button type="primary" size="mini" @click="addRewardRow(2)">添加</el-button>
              </el-row>
              <el-row>
                <template>
                  <el-table :data="item.WeekPrizeList" border>
                    <el-table-column label="范围开始(第N名)">
                      <template scope="scope">
                        <el-input v-model.number="scope.row.Start" />
                      </template>
                    </el-table-column>
                    <el-table-column label="范围结束(第N名)">
                      <template scope="scope">
                        <el-input v-model.number="scope.row.End" />
                      </template>
                    </el-table-column>
                    <el-table-column label="奖励">
                      <template scope="scope">
                        <el-input v-model.number="scope.row.Reward" />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template scope="scope">
                        <el-popconfirm title="确定删除吗？" @confirm="removeRewardRow(scope.$index, 2)">
                          <el-button slot="reference" size="mini" type="danger">删除</el-button>
                        </el-popconfirm>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-row>
            </fieldset>
          </el-row>

        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col style="margin-top:16px;" :offset="3" :span="8">
        <el-button type="primary" @click="setData()">保存</el-button>
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
import { $libShow, $libType, DataRule } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      item: {
        RankMaxDay: 0,
        RankMaxWeek: 0,
        DayPrizeList: [],
        WeekPrizeList: []
  	  },
      load: false,
      form: {
      },
      libShow: $libShow,
      subKey: 'PointRaceCommonConfig2',
      AttrNames: {
        'Data.AppsStr': '开放的应用列表',
        'Data.DayPrizeList': '日赛奖励',
        'Data.WeekPrizeList': '周赛奖励',
        types: {
          Data: 'jsonString' // 整个数据项的类型
        }
      }
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
    getData() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('cfg', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
          	const cfg = JSON.parse(response.Data.Data)

            for (const k in cfg.DayPrizeList) {
              cfg.DayPrizeList[k].Reward /= 1000
            }
            for (const k in cfg.WeekPrizeList) {
              cfg.WeekPrizeList[k].Reward /= 1000
            }
            this.item = cfg

            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
            // this.load = true
          }
        }
      })
    },
    getPostData() {
      const ret = JSON.parse(JSON.stringify(this.item))

      for (const k in ret.DayPrizeList) {
        ret.DayPrizeList[k].Reward *= 1000
      }
      for (const k in ret.WeekPrizeList) {
        ret.WeekPrizeList[k].Reward *= 1000
      }

      // console.log(this.item)
      return ret
    },
    setData() {
      if (!this.checkPrizeList(this.item.DayPrizeList)) {
        Message.error('日赛奖励不符合，请检查')
        return
      }
      if (!this.checkPrizeList(this.item.WeekPrizeList)) {
        Message.error('周赛奖励不符合，请检查')
        return
      }

    	// 检验
      this.form.Data = JSON.stringify(this.getPostData())
      const $this = this
      // 设置修改后数据
      // console.log(this.form.Data)
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
            console.log('base cfg response', response)
            Message.success('保存成功')
          }
        })
      })
    },
    // 添加奖励
    addRewardRow(typ) {
      const newRow = {
        Start: 0,
        End: 0,
        Reward: 0
      }
      if (typ === 1) {
        this.item.DayPrizeList.push(newRow)
      } else {
        this.item.WeekPrizeList.push(newRow)
      }
    },
    removeRewardRow(index, typ) {
      if (typ === 1) {
        this.item.DayPrizeList.splice(index, 1)
      } else {
        this.item.WeekPrizeList.splice(index, 1)
      }
    },
    checkPrizeList(list) {
      for (const k in list) {
        if (list[k].Start > list[k].End) {
          return false
        }
        if (list[k].Reward <= 0) {
          return false
        }
      }
      return true
    }
  }
}
</script>
<style>
.symbol-img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
.symbol-img:hover, .symbol-img.active {
  border: 3px solid red;
}

</style>
