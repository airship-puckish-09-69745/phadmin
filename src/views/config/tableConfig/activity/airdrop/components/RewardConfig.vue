<template>
  <div class="reward-config">
    <!-- 大奖系数配置 -->
    <fieldset v-if="showRewardRangesConfig" style="margin-top: 10px">
      <legend>大奖系数配置</legend>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-plus"
        :disabled="formData.rewardConfig.rewardRanges.length >= MAX_REWARD_RANGES"
        @click="addRewardRange"
      >
        添加配置 ({{ formData.rewardConfig.rewardRanges.length }}/{{ MAX_REWARD_RANGES }})
      </el-button>
      <el-row :gutter="5">
        <el-col>
          <el-table
            :data="formData.rewardConfig.rewardRanges"
            border
            style="width: 100%; margin-top: 10px"
            :cell-style="cellStyle"
          >
            <el-table-column prop="minScore" label="积分区间开始">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.minScore" oninput="if(value < 0 || value === '' || value == null){value = 0;}" />
              </template>
            </el-table-column>
            <el-table-column prop="maxScore" label="积分区间结束">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.maxScore" oninput="if(value < 0 || value === '' || value == null){value = 0;}" />
              </template>
            </el-table-column>
            <el-table-column prop="minCoefficient" label="系数区间开始">
              <template slot-scope="scope">
                <el-input v-model="scope.row.minCoefficient" oninput="if(value < 0 || value === '' || value == null){value = 0;}" />
              </template>
            </el-table-column>
            <el-table-column prop="maxCoefficient" label="系数区间结束">
              <template slot-scope="scope">
                <el-input v-model="scope.row.maxCoefficient" oninput="if(value < 0 || value === '' || value == null){value = 0;}" />
              </template>
            </el-table-column>
            <el-table-column label="操作" column-key="op" width="130">
              <template slot-scope="scope">
                <el-button
                  v-if="formData.rewardConfig.rewardRanges.length > 1"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="removeRewardRange(scope.$index)"
                />
                <el-tooltip v-else content="至少保留一行配置" placement="top">
                  <el-button size="mini" type="info" icon="el-icon-delete" circle disabled />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </fieldset>

    <!-- 进度奖励配置 -->
    <fieldset style="margin-top: 20px">
      <legend>进度奖励配置</legend>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-plus"
        :disabled="formData.progressPrizes.length >= MAX_PROGRESS_PRIZES"
        @click="addProgressPrize"
      >
        添加配置 ({{ formData.progressPrizes.length }}/{{ MAX_PROGRESS_PRIZES }})
      </el-button>
      <el-row :gutter="5">
        <el-col>
          <el-table
            :data="formData.progressPrizes"
            border
            style="width: 100%; margin-top: 10px"
            :cell-style="cellStyle"
          >
            <el-table-column v-if="gameType !== 3" prop="taskValueRequired" label="进度要求">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.taskValueRequired" oninput="if(value < 0 || value === '' || value == null){value = 0;}" />
              </template>
            </el-table-column>
            <el-table-column prop="propType" label="道具类型" width="200">
              <template slot-scope="scope">
                <el-select v-model.number="scope.row.propType" placeholder="请选择道具类型" @change="updatePropOptions(scope.row.propType, scope.$index)">
                  <el-option
                    v-for="item in propTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="propId" label="道具名称" width="200">
              <template slot-scope="scope">
                <el-select v-model.number="scope.row.propId" placeholder="请选择道具">
                  <el-option
                    v-for="item in propOptions[scope.$index]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="propExpireDays" label="可用时间">
              <template slot-scope="scope">
                <el-select v-if="showPropTimeOptions(scope.row.propType)" v-model.number="scope.row.propExpireDays" placeholder="请选择可用时间">
                  <el-option
                    v-for="item in propDayTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="propNum" label="道具数量">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.propNum" oninput="if(value < 0 || value === '' || value == null){value = 0;}" />
              </template>
            </el-table-column>
            <el-table-column prop="propNumMax" label="道具上限">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.propNumMax" oninput="if(value < 0 || value === '' || value == null){value = 0;}" />
              </template>
            </el-table-column>
            <el-table-column label="操作" column-key="op" width="130">
              <template slot-scope="scope">
                <el-button
                  v-if="formData.progressPrizes.length > 1"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="removeProgressPrize(scope.$index)"
                />
                <el-tooltip v-else content="至少保留一行配置" placement="top">
                  <el-button size="mini" type="info" icon="el-icon-delete" circle disabled />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </fieldset>
  </div>
</template>

<script>
import { $libShow } from '@/utils/common'
import { Message } from 'element-ui'
import request from '@/utils/request'
import store from '@/store'

const MAX_REWARD_RANGES = 20
const MAX_PROGRESS_PRIZES = 20

export default {
  name: 'RewardConfig',
  props: {
    value: { type: Object, required: true },
    gameType: { type: Number, default: 2 }
  },
  data() {
    return {
      MAX_REWARD_RANGES,
      MAX_PROGRESS_PRIZES,
      cellStyle: $libShow.DefaultTableCell,
      env: 'test',
      // 道具数据列表
      propList: [],
      // 道具选项列表
      propOptions: {},
      // 道具类型选项列表
      propTypeOptions: [
        { 'value': 1, 'label': 'Tongits门票', disabled: false },
        { 'value': 2, 'label': '头像框', disabled: false },
        { 'value': 3, 'label': '德州门票', disabled: false },
        { 'value': 4, 'label': '德州头像框', disabled: false },
        { 'value': 5, 'label': 'SlotFreeSpin', disabled: false }
      ],
      // 道具有效时长选项列表
      propDayTypeOptions: [
        { 'value': 1, 'label': '1天', disabled: false },
        { 'value': 3, 'label': '3天', disabled: false },
        { 'value': 7, 'label': '7天', disabled: false },
        { 'value': 30, 'label': '30天', disabled: false }
      ]
    }
  },
  computed: {
    formData: {
      get() { return this.value },
      set(val) { this.$emit('input', val) }
    },
    showRewardRangesConfig() {
      return this.gameType === 2 // 1=Slot, 2=Poker, 3=Casino 时显示大奖系数配置
    }
  },
  created() {
    this.env = store.getters.env || this.env
  },
  mounted() {
    this.getPropList()
  },
  methods: {
    // ************************ 领奖配置 ************************
    addRewardRange() {
      if (this.formData.rewardConfig.rewardRanges.length >= MAX_REWARD_RANGES) {
        Message.warning(`最多只能添加${MAX_REWARD_RANGES}行配置`)
        return
      }
      // 检查是否有填写内容
      if (this.formData.rewardConfig.rewardRanges.length === 0) {
        const item = {
          minScore: 1,
          maxScore: 100,
          minCoefficient: 0.5,
          maxCoefficient: 1
        }
        this.formData.rewardConfig.rewardRanges.push(item)
      } else {
        const item = {
          minScore: 1,
          maxScore: 100,
          minCoefficient: 0.5,
          maxCoefficient: 1
        }
        this.formData.rewardConfig.rewardRanges.push(item)
      }
    },
    removeRewardRange(index) {
      // 如果有填写内容，最少要一行
      if (this.formData.rewardConfig.rewardRanges.length <= 1) {
        Message.warning('至少保留一行配置')
        return
      }
      this.formData.rewardConfig.rewardRanges.splice(index, 1)
    },
    addProgressPrize() {
      if (this.formData.progressPrizes.length >= MAX_PROGRESS_PRIZES) {
        Message.warning(`最多只能添加${MAX_PROGRESS_PRIZES}行配置`)
        return
      }
      const item = {
        propId: 0,
        propType: 0,
        propNum: 0,
        propNumMax: 0,
        taskValueRequired: 1
      }
      this.formData.progressPrizes.push(item)
    },
    removeProgressPrize(index) {
      // 如果有填写内容，最少要一行
      if (this.formData.progressPrizes.length <= 1) {
        Message.warning('至少保留一行配置')
        return
      }
      this.formData.progressPrizes.splice(index, 1)
    },
    // ************************ 道具配置 ************************
    getPropList() {
      request({
        url: '/propsconfig/props/config/list',
        method: 'get',
        data: {
          Env: this.env,
          PageNum: 1,
          PageSize: 1000
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            this.propList = objs.list
          }
        } else {
          this.propList = []
        }
      })
    },
    updatePropOptions(propType, index) {
      this.propOptions[index] = []
      const currTime = new Date().getTime()
      for (let i = 0; i < this.propList.length; i++) {
        const prop = this.propList[i]
        if (prop.item_type === propType && prop.status === 1) {
          if (prop.item_type !== 2 && prop.item_type !== 4 && prop.item_type !== 5) {
            const expTime = prop.expire_time * 1000
            if (currTime < expTime) {
              const option = { 'value': prop.id, 'label': prop.item_name, disabled: false }
              this.propOptions[index].push(option)
            }
          } else {
            const option = { 'value': prop.id, 'label': prop.item_name, disabled: false }
            this.propOptions[index].push(option)
          }
        }
      }

      if (this.formData.progressPrizes[index] && this.propOptions[index].length > 0) {
        this.formData.progressPrizes[index].propId = this.propOptions[index][0].value
      }
      this.$forceUpdate()
    },
    showPropTimeOptions(propType) {
      return [2, 5].includes(propType)
    }
  }
}
</script>

<style scoped>
fieldset {
  border: 1px solid #dcdfe6;
  padding: 15px;
  border-radius: 4px;
}

legend {
  padding: 0 10px;
  font-weight: bold;
  color: #303133;
  font-size: 14px;
}
</style>
