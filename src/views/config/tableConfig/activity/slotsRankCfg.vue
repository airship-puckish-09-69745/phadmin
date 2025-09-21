<template>
  <el-col class="app-container">
    <el-row>
      <!-- 发布和对比的功能 -->
      <publish
          primary-key="ID"
          :key-id="getFullKey()"
          :env-empty="false"
          compare-type="Object"
          :on-compare="onCompare"
      />
    </el-row>

    <el-row>
      <br />
      <el-tabs type="border-card">
        <!-- 排行榜游戏设置 -->
        <el-tab-pane label="排行榜游戏设置">
          <el-row :gutter="5">
            <el-col :span="16">
              <el-form ref="item" label-width="150px">
                <el-col :span="24">
                  <el-form-item label="------排行榜总开关">
                    <el-switch v-model="slotsRankCfg.Open" :active-value="1" :inactive-value="0" />
                  </el-form-item>
                </el-col>

                <el-col :span="300">
                  <el-form-item label="支持跳转的App：">
                    <el-select v-model="slotsRankCfg.AppsCanSkip" multiple placeholder="请选择" style="width: 300px">
                      <el-option v-for="item in appidInfoCfgs" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            <el-form ref="slotsRankCfg" v-model="slotsRankCfg" label-width="150px">
              <el-table
                  :data="slotsRankCfg.GameCfg"
                  border
                  style="width: 100%"
                  :cell-style="libShow.DefaultTableCell"
              >
                <el-table-column prop="Gid" label="gid" width="200" />
                <el-table-column label="游戏名" width="200">
                  <template slot-scope="scope">
                    {{ showGameName(scope.row.Gid) }}
                  </template>
                </el-table-column>

                <el-table-column label="免费模式" width="200">
                  <template #default="{ row }">
                    <el-select v-model="row.FreeTyp" placeholder="请选择" style="width: 120px">
                      <el-option
                          v-for="item in freeTypes"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                      />
                    </el-select>
                  </template>
                </el-table-column>

                <el-table-column prop="Open" label="排行榜开关" width="200">
                  <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.Open"
                        :active-value="1"
                        :inactive-value="0"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="Icon" label="icon" width="200">
                  <template slot-scope="scope">
                    <ImagePicker v-model="scope.row.Icon" />
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <el-row>
        <br />
        <el-button type="primary" @click="setData">保存</el-button>
      </el-row>
    </el-row>

    <!-- 对比组件 -->
    <compare ref="compare" />
  </el-col>
</template>


<script>
import Publish from '@/components/Publish/index.vue'
import {$libShow} from '@/utils/common'
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import {Message} from 'element-ui'
import request from '@/utils/request'
import Compare from '@/components/Compare/index.vue'

export default {
  components: { Compare, ImagePicker, Publish },
  data() {
    return {
      libShow: $libShow,

      subKey: 'slots_rank',
      form: {},
      slotsRankCfg: { //排行榜游戏配置
        Open: 1,
        AppsCanSkip: [],
        GameCfg: [{Gid:1, Icon:"", Open:0, FreeTyp: 0}],
      },
      gameNameMap: {},
      gameDataMap: {},
      appidInfoCfgs: [
        { 'value': 1000002, 'label': 'dayusenlin' },
        { 'value': 1000003, 'label': 'testaccount' },
        { 'value': 1000004, 'label': 'testkey' },
        { 'value': 1000005, 'label': 'BingoPlusTongits' },
        { 'value': 1000006, 'label': 'BingoPlusTest' },
        { 'value': 1000007, 'label': 'br' },
        { 'value': 1100000, 'label': 'xworld' }
      ],
      freeTypes: [
        { 'value': 0, 'label': 'free game' },
        { 'value': 1, 'label': 'bonus' },
      ],
    }
  },
  created() {
    this.getData()
    this.getGameAll()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getData() { //获取排行榜自定义配置
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: { SubKey: this.subKey },
      }).then((response) => {
        if (response.RetCode === 0 && response.Data?.Data) {
          const cfg = JSON.parse(response.Data.Data)

          this.form = response.Data || {}

          this.slotsRankCfg = cfg
          const gameDataMap = {}
          const cfgGameCfg = cfg.GameCfg || []
          for (let i = 0; i < cfgGameCfg.length; i++) {
            const obj = cfg.GameCfg[i]
            gameDataMap[obj.Gid] = {Open: obj.Open, Icon: obj.Icon, FreeTyp: obj.FreeTyp}
          }
          this.gameDataMap = gameDataMap

          this.$refs.compare.SetOldVal(cfg)
        }
      })
    },
    getGameAll() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {},
        params: {status : 2}
      }).then(response => {
        if (response.RetCode === 0) {
          const games = []
          const gameNameMap = {}
          for (let i = 0; i < response.Data.length; i++) {
            if (response.Data[i].Gid < 50 || response.Data[i].Gid >= 100 && response.Data[i].Gid < 150 || response.Data[i].Gid > 499) {
              continue
            }
            const obj = response.Data[i]
            const gameData = this.gameDataMap[obj.Gid] || {}
            const icon = gameData.Icon || ""
            const open = gameData.Open !== undefined ? gameData.Open : 0
            const freeTyp = gameData.FreeTyp !== undefined ? gameData.FreeTyp : 0
            const game = {Gid:obj.Gid, Name:obj.Name, Icon:icon, Open:open, FreeTyp:freeTyp}
            games.push(game)

            gameNameMap[obj.Gid] = obj.Name
          }
          games.sort((a, b) => b.Gid - a.Gid)
          this.slotsRankCfg.GameCfg = games
          this.gameNameMap = gameNameMap
        }
      })
    },
    setData() { //保存自定义配置
      this.form.Data = JSON.stringify(this.slotsRankCfg)
      const $this = this
      this.$refs.compare.SetNewVal(this.form.Data)
      this.$refs.compare.Compare((isEdit) => {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form,
        }).then((response) => {
          if (response.RetCode === 0) {
            Message.success('保存成功')
          }
        })
      })
    },
    showGameName(gid) {
      return this.gameNameMap[gid]
    },
    onCompare(pre, pro) {
      const preVal = JSON.parse(pre.Data)
      const proVal = JSON.parse(pro.Data)
      if (JSON.stringify(preVal.slotsRankCfg) !== JSON.stringify(proVal.slotsRankCfg)) {
        return '修改了:【排行榜游戏配置】的配置'
      }
      return ''
    },
  },
}
</script>

<style>
.custom-dropdown .el-select-dropdown__wrap {
  max-height: 900px; /* 设置下拉框的最大高度 */
  max-width: 270px; /* 设置下拉框的最大宽度 */
  width: 270px; /* 设置下拉框的宽度 */
}
.custom-dropdown .el-select-dropdown__list {
  max-height: calc(900px - 40px); /* 根据需要减去可能的滚动条高度 */
}
.custom-dropdown1 .el-select-dropdown__wrap {
  max-height: 900px; /* 设置下拉框的最大高度 */
  max-width: 500px; /* 设置下拉框的最大宽度 */
}
.custom-dropdown1 .el-select-dropdown__list {
  max-height: calc(900px - 40px); /* 根据需要减去可能的滚动条高度 */
}
</style>
