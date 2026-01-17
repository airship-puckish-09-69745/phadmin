<script>
import Compare from '@/components/Compare/index.vue'
import Publish from '@/components/Publish/index.vue'
import request from '@/utils/request'
import { Message } from 'element-ui'

export default {
  components: { Compare, Publish },
  data() {
    return {
      subKey: 'pusoywild_cheat_cfg', // 子key
      CheatCfg: {
        ShootAllTwo: 30, // 做局全垒打（2人做小）
        ShootAllOne: 20, // 做局全垒打（1人做小）
        ExtraAddScore: 10, // 4人局躲加分牌
        ThreeSmall: 8, // 3人局做小牌
        ThreeCrack: 2, // 3人局全crack
        ThreeZero: 10, // 3人局全0分
        ThreeTwoCrack: 1, // 3人局2人crack
        AutoBlack: 10,
        AutoMaybe: 10,
        Reduce: 10,
        AutoWhite: 10,
        IsAutoWhite: true
      },
      IsAutoWhite: true,
      form: {
        Data: {}
      },
      NearIdCfg: []
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
      // console.log(ttt)
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('robotSetting', response.Data)
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            $this.CheatCfg = JSON.parse(response.Data.Data)
            if ($this.CheatCfg.AutoWhite === undefined) {
              $this.CheatCfg.AutoWhite = 10 // 默认值
            }
            if ($this.CheatCfg.IsAutoWhite === undefined) {
              $this.IsAutoWhite = true // 默认值
            } else {
              $this.IsAutoWhite = $this.CheatCfg.IsAutoWhite // 是否开启自动洗白
            }
            this.NearIdCfg = this.CheatCfg.NearID || []
            for (let i = 0; i < this.NearIdCfg.length; i++) {
              this.NearIdCfg[i].TableMoney /= 1000
            }
            const old = JSON.parse(response.Data.Data)
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(old)
          }
        }
      })
    },
    encodeData() {
      const cpy = {}
      this.CheatCfg.ShootAllTwo = parseInt(this.CheatCfg.ShootAllTwo)
      this.CheatCfg.ShootAllOne = parseInt(this.CheatCfg.ShootAllOne)
      this.CheatCfg.ExtraAddScore = parseInt(this.CheatCfg.ExtraAddScore)
      this.CheatCfg.ThreeSmall = parseInt(this.CheatCfg.ThreeSmall)
      this.CheatCfg.ThreeCrack = parseInt(this.CheatCfg.ThreeCrack)
      this.CheatCfg.ThreeZero = parseInt(this.CheatCfg.ThreeZero)
      this.CheatCfg.ThreeTwoCrack = parseInt(this.CheatCfg.ThreeTwoCrack)
      this.CheatCfg.AutoBlack = parseInt(this.CheatCfg.AutoBlack)
      this.CheatCfg.AutoMaybe = parseInt(this.CheatCfg.AutoMaybe)
      this.CheatCfg.Reduce = parseInt(this.CheatCfg.Reduce)
      this.CheatCfg.AutoWhite = parseInt(this.CheatCfg.AutoWhite)
      this.CheatCfg.IsAutoWhite = this.IsAutoWhite
      this.CheatCfg.NearID = []
      for (let i = 0; i < this.NearIdCfg.length; i++) {
        this.CheatCfg.NearID.push({
          TableMoney: this.NearIdCfg[i].TableMoney * 1000,
          NearId: this.NearIdCfg[i].NearId
        })
      }
      Object.assign(cpy, this.CheatCfg)
      return JSON.stringify(cpy)
    },
    setData() {
      console.log('setData', this.CheatCfg)
      const $this = this
      this.form.Data = this.encodeData()
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
    },
    addNearId() {
      this.NearIdCfg.push({
        TableMoney: 1,
        NearId: []
      })
      console.log(this.NearIdCfg)
    },
    addNearIdToCfg(row) {
      row.NearId.push({
        ScoreMin: 0,
        ScoreMax: 0,
        MaybeAdd: 0
      })
      console.log(row.NearId)
    },
    delNearIdFromCfg(row, index) {
      row.NearId.splice(index, 1)
    }
  }
}
</script>

<template>
  <div id="app" class="page-container" style="padding: 10px">
    <div style="margin-bottom: 20px;">
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" />
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="作弊行为相关">
        <el-divider>作弊行为分值配置相关</el-divider>
        <el-form :model="CheatCfg" label-width="150px">
          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="全垒打2人做小" prop="ShootAllTwo">
                <el-input v-model="CheatCfg.ShootAllTwo" size="medium" type="number" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="全垒打1人做小" prop="ShootAllOne">
                <el-input v-model="CheatCfg.ShootAllOne" size="medium" type="number" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="4人局躲加分牌" prop="ExtraAddScore">
                <el-input v-model="CheatCfg.ExtraAddScore" size="medium" type="number" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="3人局做小牌" prop="ThreeSmall">
                <el-input v-model="CheatCfg.ThreeSmall" size="medium" type="number" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="3人局全crack" prop="ThreeCrack">
                <el-input v-model="CheatCfg.ThreeCrack" size="medium" type="number" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="3人局全0分" prop="ThreeZero">
                <el-input v-model="CheatCfg.ThreeZero" size="medium" type="number" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="3人局2人crack" prop="ThreeTwoCrack">
                <el-input v-model="CheatCfg.ThreeTwoCrack" size="medium" type="number" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider>自动配置相关</el-divider>
          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="自动拉黑" prop="AutoBlack">
                <el-input v-model="CheatCfg.AutoBlack" size="medium" type="number" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="自动疑似" prop="AutoMaybe">
                <el-input v-model="CheatCfg.AutoMaybe" size="medium" type="number" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="正常减分" prop="Reduce">
                <el-input v-model="CheatCfg.Reduce" size="medium" type="number" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label="自动洗白开关">
                <!--            <el-input v-model="CheatCfg.IsAutoWhite" size="medium" type="number" />-->
                <el-switch
                  v-model="IsAutoWhite"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="自动洗白" prop="AutoWhite">
                <el-input v-model="CheatCfg.AutoWhite" size="medium" type="number" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider />
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="ID相近相关">
        <el-button type="primary" @click="addNearId()">添加</el-button>

        <el-table :data="NearIdCfg" border label-width="150px">
          <el-table-column label="场次" prop="TableMoney">
            <template #default="scope">
              <el-input v-model.number="scope.row.TableMoney" />
            </template>
          </el-table-column>
          <el-table-column label="详细数据">
            <template #default="scope">
              <el-button type="primary" @click="addNearIdToCfg(scope.row)">添加</el-button>
              <el-table
                :data="scope.row.NearId"
                size="mini"
                border
                style="width: 100%"
              >
                <el-table-column label="最小值(包含)" prop="ScoreMin">
                  <template #default="scopeNearID">
                    <el-input v-model.number="scopeNearID.row.ScoreMin" />
                  </template>
                </el-table-column>
                <el-table-column label="最大值(不包含)" prop="ScoreMin">
                  <template #default="scopeNearID">
                    <el-input v-model.number="scopeNearID.row.ScoreMax" />
                  </template>
                </el-table-column>
                <el-table-column label="疑似分" prop="ScoreMin">
                  <template #default="scopeNearID">
                    <el-input v-model.number="scopeNearID.row.MaybeAdd" />
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="scopeNearID">
                    <el-button type="danger" @click="delNearIdFromCfg(scope.row, scopeNearID.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-button type="primary" @click="setData()">保存</el-button>
    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<style>

</style>
