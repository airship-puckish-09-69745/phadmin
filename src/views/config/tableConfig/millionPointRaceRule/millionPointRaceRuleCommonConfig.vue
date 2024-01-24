<template>
  <div class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" />
    </el-row>
    <!--公共配置-->
    <el-row style="margin-top: 30px">
      <el-form ref="form" label-position="left">
        <el-row>
          <el-col :span="7">
            <el-form-item label="分享链接：">
              <el-input v-model.number="item.ShareLink" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <fieldset style="margin-top:10px">
            <legend>奖励配置</legend>
            <el-alert
              type="success"
              description="开始=结束，说明是同一名"
            />
            <el-row style="margin-top:10px">
              <el-button type="primary" size="mini" @click="addRewardRow">添加</el-button>
            </el-row>
            <el-row>
              <template>
                <el-table :data="item.PrizeList" border>
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
                      <el-button size="mini" type="danger" @click="removeRewardRow(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-row>
          </fieldset>
        </el-row>

      </el-form>
    </el-row>

    <el-row>
      <el-col style="margin-top:16px;" :offset="8" :span="8">
        <el-button type="primary" size="mini" @click="setData()">保存</el-button>
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
import { $libShow, $libType } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      item: {
        PrizeList: [],
  	  },
      load: false,
      form: {
      },
      libShow: $libShow,
      subKey: 'PointRaceCommonConfig'
    }
  },

  created() {
    this.getData()
    console.log(1)
  },
  methods: {
  	getLabelName(k) {
  		return this.levelCfg[k]
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
            this.item = cfg

            /*
            for (const k in this.item.PrizeList) {
              this.item.PrizeList[k].Reward /= 1000
            }
            */
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
            // this.load = true
          }
        }
      })
    },
    getPostData() {
      const ret = {}
      Object.assign(ret, this.item)

      return ret
    },
    setData() {
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
    addRewardRow() {
      const newRow = {
        Start: 0,
        End: 0,
        Reward: 0
      }
      this.item.PrizeList.push(newRow)
    },
    // 删除奖励
    removeRewardRow(index) {
      this.item.PrizeList.splice(index, 1)
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
