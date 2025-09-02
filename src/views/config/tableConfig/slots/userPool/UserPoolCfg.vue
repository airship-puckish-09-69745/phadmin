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
            <el-form-item
              label="最小发放倍数"
              :rules="[{ required: true, message: '最小发放倍数不能小于0'}]">
              <el-input v-model.number="cfg.addOddsMin" placeholder="请输入内容" class="elInput"/>
            </el-form-item>
            <el-form-item
              label="命中概率(百分比)"
              :rules="[{ required: true, message: '命中概率不能为空'}]">
              <el-input v-model.number="cfg.hitRates" placeholder="请输入内容" class="elInput"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="玩牌局数最大值" :rules="[{ required: true, message: '玩牌局数最大值不能为空'}]">
              <el-input
                v-model.number="cfg.playTimesMax"
                placeholder="请输入内容"
                class="elInput"/>
            </el-form-item>
            <el-form-item
              label="发放金额与下注金额的最大倍数"
              :rules="[{ required: true, message: '发放金额与下注金额的最大倍数不能为空'}]">
              <el-input
                v-model.number="cfg.betOddsMax"
                placeholder="请输入内容"
                class="elInput"/>
            </el-form-item>
            <el-form-item
              label="最大发放倍数"
              :rules="[{ required: true, message: '最大发放倍数不能小于最小发放倍数'}]">
              <el-input v-model.number="cfg.addOddsMax" placeholder="请输入内容" class="elInput"/>
            </el-form-item>
            <el-form-item label="抽水比例(万分之一)" :rules="[{ required: true, message: '抽水比例不能为空'}]">
              <el-input v-model.number="cfg.taxed" placeholder="请输入内容" class="elInput"/>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="启用的老虎机列表" :rules="[{ required: true, message: '启用的老虎机列表不能为空'}]">
              <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                全选
              </el-checkbox>
              <div style="margin: 15px 0;" />

              <el-checkbox-group v-model="cfg.taxedSlots" @change="handleCheckedGamesChange">
                <table class="checkbox-table">
                  <tbody>
                    <tr v-for="(row, ri) in chunkedLabels" :key="ri">
                      <td v-for="(label, ci) in row" :key="`${ri}-${ci}`" class="checkbox-cell">
                        <template v-if="label">
                          <el-checkbox :label="label">{{ label }}</el-checkbox>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
        playTimesMax: 0,
        hitRates: 0,
        addOddsMin: 0,
        addOddsMax: 0
      },
      gameIdMap: {},
      reqData: {},
      // 复选框相关
      checkAll: false,
      //
      allGames: [],
      isIndeterminate: true,
    }
  },
  computed: {
    // 仍然按 gid 数字升序
    sortedAllGames() {
      return (this.allGames || []).slice().sort((a, b) => {
        const nameA = a.split('(')[0].trim().toLowerCase() // 游戏名部分
        const nameB = b.split('(')[0].trim().toLowerCase()
        return nameA.localeCompare(nameB) // 按字母顺序排序
      });
    },
    // 列优先分布：先填满第1列(从上到下)，再第2列...
    chunkedLabels() {
      const cols = 3; // 列数
      const list = this.sortedAllGames;
      const rows = Math.ceil(list.length / cols); // 每列的行数
      const grid = Array.from({ length: rows }, () => Array(cols).fill(null));

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const i = r + c * rows; // 列优先索引
          if (i < list.length) grid[r][c] = list[i];
        }
      }
      return grid; // => [[row0col0,row0col1,row0col2], [row1col0,...], ...]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleCheckAllChange(val) {
      this.cfg.taxedSlots = val ? this.sortedAllGames.slice() : []
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
      return request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: 'slots_user_pool_cfg'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          if (response.Data && response.Data.Data !== '') {
            const jsonData = JSON.parse(response.Data.Data)
            this.cfg.betOddsMax = jsonData.betOddsMax
            this.cfg.betOddsMin = jsonData.betOddsMin
            this.cfg.playTimesMin = jsonData.playTimesMin
            this.cfg.playTimesMax = jsonData.playTimesMax
            this.cfg.taxed = jsonData.taxed
            this.cfg.hitRates = jsonData.hitRates
            this.cfg.addOddsMin = jsonData.addOddsMin
            this.cfg.addOddsMax = jsonData.addOddsMax
            this.cfg.taxedSlots = this.formatTaxedSlots(jsonData.taxedSlots)
            this.reqData = response.Data
            if (this.cfg.taxedSlots.length === this.allGames.length) {
              this.isIndeterminate = false
              this.checkAll = true
            }
          }
        }
      })
    },
    formatTaxedSlots(gameIds) {
      const formatNames = []
      for (const gameId of gameIds) {
        // const str = gameId + '|' + this.gameIdMap[Number(gameId)]
        const str = this.gameIdMap[Number(gameId)] + '(' + gameId + ')'
        formatNames.push(str)
      }
      return formatNames
    },
    getGameList() {
      return request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Gid < 50 || response.Data[i].Gid > 100 && response.Data[i].Gid < 150 || response.Data[i].Gid > 499) {
              continue
            }
            this.allGames.push(response.Data[i].Name + '(' + response.Data[i].Gid + ')')
            this.gameIdMap[Number(response.Data[i].Gid)] = response.Data[i].Name
          }
        }
      })
    },
    splitGames(pickGames) {
      const games = []
      for (const gameStr of pickGames) {
        games.push(Number(gameStr.split('(')[1].replace(')', '')))
      }
      return games
    },
    checkInput() {
      if (
        this.cfg.taxed === '' ||
        this.cfg.taxedSlots.length === 0 ||
        this.cfg.betOddsMin === '' ||
        this.cfg.betOddsMax === '' ||
        this.cfg.playTimesMin === '' ||
        this.cfg.playTimesMax === '' ||
        this.cfg.addOddsMin === '' ||
        this.cfg.addOddsMax === '' ||
        this.cfg.hitRates === undefined ||
        this.cfg.hitRates === '') {
        Message.error('请填写完整')
        return false
      }
      if (this.cfg.playTimesMin < 0) {
        Message.error('玩牌局数最小值不能小于0')
        return false
      }
      if (this.cfg.playTimesMax < 0) {
        Message.error('玩牌局数最大值不能小于0')
        return false
      }
      if (this.cfg.taxed < 0) {
        Message.error('抽水比例不能小于0')
        return false
      }
      if (this.cfg.taxed > 10000) {
        Message.error('抽水比例不能大于10000')
        return false
      }
      if (this.cfg.hitRates > 100) {
        Message.error('命中概率不能大于100')
        return false
      }
      if (this.cfg.hitRates < 0) {
        Message.error('命中概率不能小于0')
        return false
      }
      if (this.cfg.addOddsMin < 0) {
        Message.error('最小发放倍数不能小于0')
        return false
      }
      if (this.cfg.addOddsMax < this.cfg.addOddsMin) {
        Message.error('最大发放倍数不能小于最小发放倍数')
        return false
      }
      return true
    },
    saveEdit() {
      if (!this.checkInput()) {
        return
      }
      const newCfg = {
        taxed: this.cfg.taxed,
        taxedSlots: this.splitGames(this.cfg.taxedSlots),
        betOddsMin: this.cfg.betOddsMin,
        betOddsMax: this.cfg.betOddsMax,
        hitRates: this.cfg.hitRates,
        playTimesMin: this.cfg.playTimesMin,
        playTimesMax: this.cfg.playTimesMax,
        addOddsMin: this.cfg.addOddsMin,
        addOddsMax: this.cfg.addOddsMax
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

.checkbox-table {
  width: 100%;
  border-collapse: collapse;
}

.checkbox-cell {
  width: 33.33%; /* 三列 */
  border: 1px solid #dcdfe6;
  padding: 8px 12px;
  text-align: left;
  vertical-align: middle;
}

</style>
