<template>
  <div style="margin-top: 30px">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object"/>
    <el-row :gutter="20" style="margin-top: 30px;margin-left: 30px">
      <el-form ref="frm2" :model="cfg" label-width="230px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="玩牌局数最小值" :rules="[{ required: true, message: '玩牌局数最小值不能为空'}]">
              <el-input
                v-model.number="cfg.playTimesMin"
                placeholder="请输入内容"
                class="elInput"
                :rules="[{ required: true, message: '玩牌局数最小值不能为空'}]"/>
            </el-form-item>
            <el-form-item
              label="发放金额与下注金额的最小倍数"
              :rules="[{ required: true, message: '发放金额与下注金额的最小倍数不能为空'}]">
              <el-input v-model.number="cfg.betOddsMin" placeholder="请输入内容" class="elInput"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="玩牌局数最大值" :rules="[{ required: true, message: '玩牌局数最大值不能为空'}]">
              <el-input
                v-model.number="cfg.playTimesMax"
                placeholder="请输入内容"
                class="elInput"
                :rules="[{ required: true, message: '玩牌局数最大值不能为空'}]"/>
            </el-form-item>
            <el-form-item label="发放金额与下注金额的最大倍数">
              <el-input
                v-model.number="cfg.betOddsMax"
                placeholder="请输入内容"
                class="elInput"
                :rules="[{ required: true, message: '发放金额与下注金额的最大倍数不能为空'}]"/>
            </el-form-item>
            <el-form-item label="抽水比例1(万分之一)" :rules="[{ required: true, message: '抽水比例不能为空'}]">
              <el-input v-model.number="cfg.taxed" placeholder="请输入内容" class="elInput"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              label="启用的老虎机列表"
              :rules="[{ required: true, message: '启用的老虎机列表不能为空'}]">
              <!--              <el-input v-model="cfg.taxedSlots" placeholder="请输入内容" class="elInput"/>-->
              <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                全选
              </el-checkbox>
              <div style="margin: 15px 0;"/>
              <el-checkbox-group v-model="cfg.taxedSlots" @change="handleCheckedGamesChange">
                <el-checkbox v-for="game in allGames" :key="game" :label="game">{{ game }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>
    </el-row>
    <div class="dialog-footer">
      <el-button type="primary" @click="saveEdit">保 存</el-button>
    </div>
  </div>
</template>

<script>

import Publish from '@/components/Publish/index.vue';
import request from '@/utils/request';
import {Message} from "element-ui";
import {number} from "echarts/lib/export";

// const cityOptions = ['上海', '北京', '广州', '深圳'];
export default {
  name: 'UserPoolCfg',
  components: {Publish},
  data() {
    return {
      cfg: {
        taxed: 0,
        taxedSlots: [],
        betOddsMin: 0,
        betOddsMax: 0,
        playTimesMin: 0,
        playTimesMax: 0
      },
      gameIdMap: {},
      reqData: {},
      // 复选框相关
      checkAll: false,
      // cities: cityOptions,
      //
      allGames: [],
      // pickGames: [],
      isIndeterminate: true,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleCheckAllChange(val) {
      this.cfg.taxedSlots = val ? this.allGames : []
      this.isIndeterminate = false
    },
    handleCheckedGamesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.allGames.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allGames.length
    },
    getFullKey() {
      return 'CustomizeCfg_slots_user_pool_cfg'
    },
    async fetchData() {
      await this.getGameList()
      await this.getData()
    },
    getData() {
      // 加载基础数值配置
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: 'slots_user_pool_cfg'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          if (response.Data && response.Data.Data !== '') {
            const jsonData = JSON.parse(response.Data.Data)
            // this.tableData = jsonData.items
            // console.log('this.tableData:============>', this.tableData)
            // this.tableDataBak = jsonData.items
            console.log('response ========>:', response)
            console.log('jsonData ========>:', jsonData)
            this.cfg.betOddsMax = jsonData.betOddsMax
            this.cfg.betOddsMin = jsonData.betOddsMin
            this.cfg.playTimesMin = jsonData.playTimesMin
            this.cfg.playTimesMax = jsonData.playTimesMax
            this.cfg.taxed = jsonData.taxed
            // this.cfg.taxedSlots = jsonData.taxedSlots.join(',')
            this.cfg.taxedSlots = this.formatTaxedSlots(jsonData.taxedSlots)
            // console.log('this.cfg.taxedSlots:', this.cfg.taxedSlots);
            this.reqData = response.Data
          }
        }
      })
    },
    formatTaxedSlots(gameIds) {
      const formatNames = []
      console.log('formatTaxedSlots(gameIds)中this.gameIdMap:', this.gameIdMap)
      console.log('formatTaxedSlots(gameIds)中gameIds:', gameIds)
      console.log('formatTaxedSlots(gameIds)中this.gameIdMap[158]:', this.gameIdMap[158])
      for (const gameId of gameIds) {
        const str = gameId + '|' + this.gameIdMap[Number(gameId)]
        formatNames.push(str)
      }
      console.log('formatTaxedSlots(gameIds)formatNames:', formatNames)
      return formatNames
    },
    getGameList() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Gid < 50 || response.Data[i].Gid > 100 && response.Data[i].Gid < 150 || response.Data[i].Gid > 499) {
              continue
            }
            this.allGames.push(response.Data[i].Gid + '|' + response.Data[i].Name)
            this.gameIdMap[Number(response.Data[i].Gid)] = response.Data[i].Name
          }
        }
      })
    },
    splitGames(pickGames) {
      const games = []
      for (const game of pickGames) {
        games.push(Number(game.split('|')[0]))
      }
      return games
    },
    saveEdit() {
      if (
        this.cfg.taxed === '' ||
        this.cfg.taxedSlots.length === 0 ||
        this.cfg.betOddsMin === '' ||
        this.cfg.betOddsMax === '' ||
        this.cfg.playTimesMin === '' ||
        this.cfg.playTimesMax === '') {
        Message.error('请填写完整')
        return
      }
      const newCfg = {
        taxed: this.cfg.taxed,
        taxedSlots: this.splitGames(this.cfg.taxedSlots),
        betOddsMin: this.cfg.betOddsMin,
        betOddsMax: this.cfg.betOddsMax,
        playTimesMin: this.cfg.playTimesMin,
        playTimesMax: this.cfg.playTimesMax
      }
      this.reqData.Data = JSON.stringify(newCfg)
      request({
        url: 'customizeconfig/update',
        method: 'post',
        data: this.reqData
      }).then(response => {
        if (response.RetCode === 0) {
          this.$message.success('保存成功')
        }
      })
    }
  }
}
</script>

<style scoped>
.elInput {
  width: 550px
}

.dialog-footer {
  margin-left: 90%;
}
</style>
