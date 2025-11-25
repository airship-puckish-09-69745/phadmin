<template>
  <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">
    <legend>奖励信息</legend>

    <!-- 奖励模型选择 -->
    <el-form-item label="奖励模型：" :required="true">
      <el-radio v-for="item in prizeModleCfgs" :key="item.value" v-model="prizeExtra.awardType" :label="item.value" @change="handleAwardTypeChange">{{ item.label }}</el-radio>
    </el-form-item>

    <!-- 添加名次奖励按钮 - 固定奖励和动态奖励模式都显示 -->
    <el-button style="margin-bottom: 10px;" type="normal" size="mini" @click="addRankReward">添加</el-button>

    <!-- 奖励表格 - 固定奖励和动态奖励模式都显示 -->
    <el-table
      :data="rankRewards"
      border
      stripe
      :header-cell-style="libShow.DefaultTableHeadClass"
    >
      <el-table-column
        prop="index"
        label="序号"
        width="50"
      />
      <el-table-column
        prop="rewardItems"
        label="奖励"
        width="450"
      >
        <template slot-scope="scope">
          <ul style="list-style: none;padding-inline-start: 0;">
            <!-- 固定奖励模式 - 金币奖励 -->
            <li v-for="(gItem, itemIndex) in scope.row.rewardItems" v-if="prizeExtra.awardType===0" :key="itemIndex" style="list-style: none;">
              <span>金币奖励：</span>
              <el-select v-model="gItem.getType" placeholder="请选择" size="mini" style="width:80px" @change="handleRewardTypeChange(scope.$index, itemIndex, $event)">
                <el-option
                  v-for="item in getTypeCfgs"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select v-if="gItem.getType === 2" v-model="gItem.sceneId" placeholder="请选择投注金" size="mini" style="width:200px">
                <el-option
                  v-for="scene in betScenesCfgs"
                  :key="scene.value"
                  :label="scene.label"
                  :value="scene.value"
                />
              </el-select>
              <el-select v-if="gItem.getType === 3" v-model="gItem.sceneId" placeholder="请选择返水金" size="mini" style="width:200px">
                <el-option
                  v-for="scene in rebateScenesCfgs"
                  :key="scene.value"
                  :label="scene.label"
                  :value="scene.value"
                />
              </el-select>
              <el-input v-model.number="gItem.getNum" style="width: 80px;" size="mini" placeholder="请填写获得数量" @input="handleRewardNumChange(scope.$index, itemIndex, $event)" />
            </li>

            <!-- 固定奖励模式 - 道具奖励 -->
            <li v-if="prizeExtra.awardType === 0 && scope.row.propsReward != null" style="list-style: none;">
              <span>道具奖励：</span>
              <el-select v-model="scope.row.propsReward.propsId" placeholder="道具" size="mini" style="width:200px" @change="handlePropsChange(scope.$index, $event)">
                <el-option
                  v-for="item in matchPropsCfgs"
                  :key="item.propsId"
                  :label="item.propsName"
                  :value="item.propsId"
                  :disabled="checkNewTicketPropDisable(item.propsType,item.propsAppId)"
                >
                  <img v-if="item.propsIcon != '' " :src="item.propsIcon" style="height:36px;vertical-align: middle;">
                  <span>{{ item.propsShowName }}</span>
                </el-option>
              </el-select>
              <el-input v-model.number="scope.row.propsReward.propsNum" style="width: 100px;" size="mini" placeholder="填数量" @input="handlePropsNumChange(scope.$index, $event)" />
            </li>

            <!-- 道具过期天数 - 固定奖励模式 -->
            <li v-if="prizeExtra.awardType === 0 && scope.row.propsReward != null && checkPropNeedExpireDays(scope.row.propsReward.propsId, scope.row.propsReward.propsNum, scope.row.propsReward.propExpireDays)" style="list-style: none;">
              <span>过期天数：</span>
              <el-select v-model="scope.row.propsReward.propExpireDays" placeholder="请选择" size="mini" style="width:150px" @change="handlePropsExpireChange(scope.$index, $event)">
                <el-option
                  v-for="item in ITEM_DAY_TYPE_OPTIONS()"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled===propValidExpireDays(scope.row.propsReward.propsId, item.value)"
                />
              </el-select>
            </li>

            <!-- 动态奖励模式 - 道具奖励 -->
            <li v-if="prizeExtra.awardType === 1 && scope.row.propsReward != null" style="list-style: none;">
              <span>道具奖励：</span>
              <el-select v-model="scope.row.propsReward.propsId" placeholder="道具" size="mini" style="width:200px" @change="handlePropsChange(scope.$index, $event)">
                <el-option
                  v-for="item in matchPropsCfgs"
                  :key="item.propsId"
                  :label="item.propsName"
                  :value="item.propsId"
                  :disabled="checkNewTicketPropDisable(item.propsType,item.propsAppId)"
                >
                  <img v-if="item.propsIcon != '' " :src="item.propsIcon" style="height:36px;vertical-align: middle;">
                  <span>{{ item.propsShowName }}</span>
                </el-option>
              </el-select>
              <el-input v-model.number="scope.row.propsReward.propsNum" style="width: 100px;" size="mini" placeholder="填数量" @input="handlePropsNumChange(scope.$index, $event)" />
            </li>

            <!-- 道具过期天数 -->
            <li v-if="prizeExtra.awardType === 1 && scope.row.propsReward != null && checkPropNeedExpireDays(scope.row.propsReward.propsId, scope.row.propsReward.propsNum, scope.row.propsReward.propExpireDays)" style="list-style: none;">
              <span>过期天数：</span>
              <el-select v-model="scope.row.propsReward.propExpireDays" placeholder="请选择" size="mini" style="width:150px" @change="handlePropsExpireChange(scope.$index, $event)">
              <el-option
                v-for="item in ITEM_DAY_TYPE_OPTIONS()"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled===propValidExpireDays(scope.row.propsReward.propsId, item.value)"
              />
              </el-select>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column
        prop="startRank"
        label="名次区间"
      >
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.startRank" style="width: 80px;" size="mini" placeholder="开始名次" @input="handleStartRankChange(scope.$index, $event)" />至
          <el-input v-model.number="scope.row.endRank" style="width: 80px;" size="mini" placeholder="结束名次" @input="handleEndRankChange(scope.$index, $event)" />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="removeRewardItme(scope.$index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 动态奖励配置 -->
    <el-form-item v-if="prizeExtra.awardType === 1" label="选择模板：" :required="true">
      <el-select v-model="prizeExtra.prizeTemplateId" placeholder="请选择" size="mini" @change="handlePrizeTemplateChange">
        <el-option
          v-for="item in prizeTemplateCfg"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item v-if="prizeExtra.awardType === 1" label="手续费率[百分比]：" :required="true">
      <el-input v-model.number="prizeExtra.prizeRate" style="width: 200px;" size="mini" placeholder="请填写手续费率数值" @input="handlePrizeRateChange($event)" />
    </el-form-item>

    <el-form-item v-if="prizeExtra.awardType === 1" label="奖励类型" :required="true">
      <el-radio v-model.number="prizeExtra.rewardType" :label="1" @change="handleRewardTypeRadioChange">金币</el-radio>
      <el-radio v-model.number="prizeExtra.rewardType" :label="3" @change="handleRewardTypeRadioChange">返水金（无限制）</el-radio>
    </el-form-item>
  </fieldset>
</template>

<script>
import { $libShow } from '@/utils/common'
import { ITEM_DAY_TYPE_OPTIONS, PROP_TYPE_OPTIONS } from '@/utils/options'
import { matchUtilsMixin } from '../mixins/matchUtilsMixin'

export default {
  name: 'RewardConfig',
  mixins: [matchUtilsMixin],
  props: {
    rankRewards: {
      type: Array,
      default: () => []
    },
    prizeExtra: {
      type: Object,
      required: true
    },
    getTypeCfgs: {
      type: Array,
      default: () => []
    },
    betScenesCfgs: {
      type: Array,
      default: () => []
    },
    rebateScenesCfgs: {
      type: Array,
      default: () => []
    },
    matchPropsCfgs: {
      type: Array,
      default: () => []
    },
    prizeModleCfgs: {
      type: Array,
      default: () => []
    },
    prizeTemplateCfg: {
      type: Array,
      default: () => []
    },
    editForm: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      libShow: $libShow
    }
  },
  mounted() {
    // 组件已挂载
  },
  watch: {
    rankRewards: {
      handler(newVal, oldVal) {
        // rankRewards 发生变化
      },
      deep: true
    }
  },
  methods: {
    ITEM_DAY_TYPE_OPTIONS() {
      return ITEM_DAY_TYPE_OPTIONS
    },
    addRankReward() {
      this.$emit('add-rank-reward')
    },
    removeRewardItme(index) {
      this.$emit('remove-rank-reward', index)
    },
    handleRewardTypeChange(rankIndex, itemIndex, value) {
      // 當選擇金幣時，設置 sceneId 為 0
      if (value === 1) {
        this.rankRewards[rankIndex].rewardItems[itemIndex].sceneId = 0
      }
      this.$emit('reward-type-change', rankIndex, itemIndex, value)
    },
    handleRewardNumChange(rankIndex, itemIndex, value) {
      this.$emit('reward-num-change', rankIndex, itemIndex, value)
    },
    handlePropsChange(rankIndex, value) {
      this.$emit('props-change', rankIndex, value)
    },
    handlePropsNumChange(rankIndex, value) {
      this.$emit('props-num-change', rankIndex, value)
    },
    handlePropsExpireChange(rankIndex, value) {
      this.$emit('props-expire-change', rankIndex, value)
    },
    handleStartRankChange(rankIndex, value) {
      this.$emit('start-rank-change', rankIndex, value)
    },
    handleEndRankChange(rankIndex, value) {
      this.$emit('end-rank-change', rankIndex, value)
    },

    // 奖励模型相关事件处理
    handleAwardTypeChange(value) {
      // 先更新本地的 prizeExtra
      this.prizeExtra.awardType = value
      // 然后通知父组件进行数据重置
      this.$emit('award-type-change', value)
    },

    handlePrizeTemplateChange(value) {
      this.$emit('prize-template-change', value)
    },

    handlePrizeRateChange(value) {
      const num = Number(value)
      this.$emit('prize-rate-change', isNaN(num) ? 0 : num)
    },

    handleRewardTypeRadioChange(value) {
      this.$emit('reward-type-radio-change', value)
    },

    // 获取道具奖励项信息
    getPropsRewardItem(propsId, propsNum, propExpireDays) {
      for (let i = 0; i < this.matchPropsCfgs.length; i++) {
        if (this.matchPropsCfgs[i].propsId === propsId) {
          return {
            propsId: propsId,
            propsType: this.matchPropsCfgs[i].propsType,
            propsName: this.matchPropsCfgs[i].propsName,
            propsIcon: this.matchPropsCfgs[i].propsIcon,
            propsAttr: this.matchPropsCfgs[i].propsAttr,
            propCost:this.matchPropsCfgs[i].propsCost,
            propsNum: propsNum,
            propExpireDays: propExpireDays,
            propsSceneId: this.matchPropsCfgs[i].propsSceneId,
          }
        }
      }
      return {
        propsId: 0,
        propsType: 0,
        propsName: '',
        propsIcon: '',
        propsAttr: '',
        propsNum: 0,
        propExpireDays: -1,
        propCost: 0,
        propsSceneId: 0,
      }
    },
    // 道具是否需要过期时间
    checkPropNeedExpireDays(propsId, propsNum, propExpireDay) {
      const prop = this.getPropsRewardItem(propsId, propsNum, propExpireDay)
      return [PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME, PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET_NEW].includes(prop.propsType)
    },
    // 道具过期时间是否合法
    propValidExpireDays(propsId, expireDays) {
      const prop = this.getPropsRewardItem(propsId, 0, 0)
      switch (prop.propsType) {
        case PROP_TYPE_OPTIONS.PROP_TYPE_AVATAR_FRAME:
          if (expireDays < 0) {
            return false
          }
          break;
        case PROP_TYPE_OPTIONS.PROP_TYPE_PUSOY_TICKET_NEW:
          if (expireDays === 0 || expireDays === 365 || expireDays < 0) {
            return false
          }
          break;
        default:
          break;
      }
      return  true
    }
  }
}
</script>

