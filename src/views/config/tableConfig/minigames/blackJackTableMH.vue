<template>
    <div class="app-container">
      <el-row>
        <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
      </el-row>

      <el-row v-if="isDevelopment()" type="flex" justify="center">
        <el-button
          type="primary"
          plain
          style="transform: translateX(150px);"
          @click="openTool"
          >
          21点多手牌配牌工具
        </el-button>
      </el-row>

      <el-row :gutter="5" style="margin-top: 30px">
      <el-form ref="item" :model="item" label-width="200px">

        <el-col :span="8" :offset="1">
          <el-form-item label="保底奖池抽水比例：">
            <el-input v-model.number="item.feeRate"><template slot="append">%</template></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="1">
          <el-form-item label="用户长时间未下注踢出(s):">
            <el-input v-model.number="item.kickTime" :required="true" />
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="1">
          <el-form-item label="操作时长(s):">
            <el-input v-model.number="item.actionTime" :required="true" />
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="1">
          <el-form-item label="按钮1(底注倍数):">
            <el-input v-model.number="item.betAreas[0].odds" :required="true" />
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="1">
          <el-form-item label="按钮2(底注倍数):">
            <el-input v-model.number="item.betAreas[1].odds" :required="true" />
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="1">
          <el-form-item label="按钮3(底注倍数):">
            <el-input v-model.number="item.betAreas[2].odds" :required="true" />
          </el-form-item>
        </el-col>

        <el-col :span="16" :offset="3">
          <fieldset style="margin-top:10px">
            <legend>底注档位配置</legend>

            <el-descriptions class="margin-top" border>
              <el-descriptions-item>
                <span style="color:red;"> 说明: 对应客户端可切换底注列表，只能有一个初始底注档位 </span>
              </el-descriptions-item>
            </el-descriptions>
            <el-row>
              <el-table
                ref="filterTable"
                :data="item.anteSwitch"
                border
                :header-cell-style="libShow.DefaultTableHeadClass"
                :row-style="{height:'10px'}"
                :cell-style="libShow.DefaultTableCell"
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                  label="底注档位"
                />

                <el-table-column
                  prop="minBetNum"
                  label="min底注"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.minBetNum" size="mini" />
                  </template>
                </el-table-column>

                <el-table-column
                  prop="maxBetNum"
                  label="max底注"
                >
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.maxBetNum" size="mini" />
                  </template>
                </el-table-column>

                <el-table-column
                  prop="isInit"
                  label="是否初始底注档位"
                >
                  <template slot-scope="scope">
                    <el-checkbox
                      v-model="scope.row.isInit"
                      size="mini"
                      @change="onSelectInit(scope.row)"
                    />
                  </template>
                </el-table-column>

              </el-table>
            </el-row>
          </fieldset>
        </el-col>
        
        <el-col style="margin-top:16px;" :offset="8" :span="8">
          <el-form-item>
            <el-button type="primary" @click="setData">保存</el-button>
          </el-form-item>
        </el-col>
      </el-form>
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
  import { $libShow, ValidateVueItem } from '@/utils/common'
  
  export default {
    // eslint-disable-next-line vue/no-unused-components
    components: { Compare, Publish },
    data() {
      return {
        item: {
          feeRate: 3,
          actionTime: 15,
          kickTime: 300,
          minBet: 1000,
          maxBet: 50000,
          betAreas: [
            { id: 0, moneyOption: 1000, odds: 1},
            { id: 1, moneyOption: 1000, odds: 2},
            { id: 2, moneyOption: 1000, odds: 3},
          ],
          anteSwitch: [
            { minBetNum: 0.2, maxBetNum: 6, isInit: false },
            { minBetNum: 1, maxBetNum: 30, isInit: false },
            { minBetNum: 5, maxBetNum: 150, isInit: false },
            { minBetNum: 10, maxBetNum: 300, isInit: true },
            { minBetNum: 20, maxBetNum: 600, isInit: false },
            { minBetNum: 50, maxBetNum: 1500, isInit: false },
            { minBetNum: 100, maxBetNum: 3000, isInit: false },
            { minBetNum: 200, maxBetNum: 6000, isInit: false },
          ],
        },
        form: {},
        subKey: 'blackjackmh_cfg',
        libShow: $libShow,
        envProjectName: process.env.VUE_APP_PROJECT
      }
    },
    created() {
      console.log(process.env.VUE_APP_PROJECT_NAME)
      this.getData()
    },
    methods: {
      getFullKey() {
        return 'CustomizeCfg_' + this.subKey
      },
      isDevelopment() {
        return process.env.NODE_ENV === 'development'
      },
      openTool() {
        window.open('http://192.168.6.16/blackjackmh.php', '_blank');
      },
      preProcess() {
        for (let i = 0; i < this.item.betAreas.length; i++) {
          this.item.betAreas[i].moneyOption /= 1000
        }
  
        for (let i = 0; i < this.item.anteSwitch.length; i++) {
          this.item.anteSwitch[i].minBetNum /= 1000
          this.item.anteSwitch[i].maxBetNum /= 1000

          if (this.item.anteSwitch[i].isInit === true) {
              // 设置初始底注
              this.item.minBet = this.item.anteSwitch[i].minBetNum
              this.item.maxBet = this.item.anteSwitch[i].maxBetNum
          }
        }
      },
      getPostData() {
        const ret = JSON.parse(JSON.stringify(this.item))
  
        // 计算底注档位选项
        ret.anteSwitch = []
        for (let i = 0; i < this.item.anteSwitch.length; i++) {
          const obj = JSON.parse(JSON.stringify(this.item.anteSwitch[i]))
          obj.minBetNum *= 1000
          obj.maxBetNum *= 1000

          if (this.item.anteSwitch[i].isInit === true) {
              // 设置初始底注
              ret.minBet = obj.minBetNum
              ret.maxBet = obj.maxBetNum
          }

          ret.anteSwitch.push(obj)
        }

        // 计算按钮选项
        ret.betAreas = []
        for (let i = 0; i < this.item.betAreas.length; i++) {
          const obj = JSON.parse(JSON.stringify(this.item.betAreas[i]))
          obj.moneyOption = ret.minBet * obj.odds * 1000
          ret.betAreas.push(obj)
        }

        return ret
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
            this.form = response.Data || {}
            if (response.Data && response.Data.Data !== '') {
              const betAreas = this.item.betAreas
              const anteSwitch = this.item.anteSwitch
              const item = JSON.parse(response.Data.Data)
              Object.assign(this.item, item)
              this.preProcess()
              // 设置修改之前数据
              this.$refs.compare.SetOldVal(response.Data)
              if (this.item.betAreas.length === 0) {
                this.item.betAreas = betAreas
              }
              if (this.item.anteSwitch.length === 0) {
                this.item.anteSwitch = anteSwitch
              }
            }
          }
        })
      },
      setData() {
        if (!ValidateVueItem(this.$refs['item'])) 
          return false
  
        this.form.Data = JSON.stringify(this.getPostData())
  
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
      },
      onSelectInit(row) {
        // 把其他行置为 false
        this.item.anteSwitch.forEach(r => {
        if (r !== row) r.isInit = false
        })
        // 当前行保持 true（v-model 已经生效，不用再赋值）
      },
    }
  }
  </script>
  
  