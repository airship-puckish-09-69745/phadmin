<template>
  <div>
    <el-row :gutter="5">
      <el-col :span="16">
        <el-form ref="item" label-width="220px">
          <el-col>
            <el-form-item label="活动名称" :required="true">
              <el-input v-model="formData.activityName" style="width: 500px;" placeholder="请输入活动名称"/>
            </el-form-item>
          </el-col>
          <el-col xs="24" :span="12">
            <el-form-item label="活动开关">
              <el-switch v-model="formData.isOpen" :active-value="true" :inactive-value="false"/>
            </el-form-item>
          </el-col>
          <el-col xs="24" :span="12">
            <el-form-item label="消息推送开关">
              <el-switch v-model="formData.isSend" :active-value="true" :inactive-value="false"/>
              <el-tooltip class="item" effect="light" placement="right-start">
                <template #content>
                  <div>控制推送红包任务进度</div>
                </template>
                <i class="el-icon-info"/>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col xs="24" :span="12">
            <el-form-item label="活动开始时间">
              <el-date-picker
                v-model="formData.startTime"
                type="datetime"
                placeholder="选择开始时间"
                value-format="timestamp"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col xs="24" :span="12">
            <el-form-item label="活动结束时间">
              <el-date-picker
                v-model="formData.endTime"
                type="datetime"
                placeholder="选择结束时间"
                value-format="timestamp"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col xs="24" :span="12">
            <el-form-item label="每日活动开始时间">
              <el-date-picker
                v-model="formData.everyDayStartTime"
                type="datetime"
                placeholder="选择结束时间"
                format="HH:mm"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col xs="24" :span="12">
            <el-form-item label="每日活动结束时间">
              <el-date-picker
                v-model="formData.everyDayEndTime"
                type="datetime"
                placeholder="选择结束时间"
                format="HH:mm"
                size="mini"
              />
            </el-form-item>
          </el-col>
          <el-col xs="24" :span="12">
            <el-form-item label="限制红包发送金币额度" :required="true">
              <el-input v-model="formData.limitMaxNum" style="width: 200px;" placeholder="请输入限制数量"/>
            </el-form-item>
          </el-col>
          <el-col xs="24" :span="12">
            <el-form-item label="活动展示金额">
              <el-input v-model.number="formData.showGold" style="width: 200px;" placeholder="请输入显示金额数量"/>
            </el-form-item>
          </el-col>
          <el-col xs="24" :span="12">
            <el-form-item label="单日弹窗次数">
              <el-input v-model.number="formData.showTimes" style="width: 200px;" placeholder="请输入限制数量"/>
              <el-tooltip class="item" effect="light" placement="right-start">
                <template #content>
                  <div>配置1则所有用户单日只弹出1次该弹窗，配置0则该弹窗不主动弹出，配置-1则该弹窗次数为无限</div>
                </template>
                <i class="el-icon-info"/>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col xs="24" :span="12" v-if="store.getters.env == 'test'">
            <el-form-item label="时间偏移(秒)">
              <el-input v-model="formData.timeS" style="width: 200px;" placeholder="请输入限制数量"/>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="参与活动用户类型" :required="true">
              <el-select v-model="formData.userType" placeholder="请选择" style="width:280px" @change="onUserTypeChange">
                <el-option
                  v-for="item in userTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="formData.userType == 5">
            <el-form-item label="标签子类">
              <el-select v-model="formData.userLabel" placeholder="请选择标签子类">
                <el-option
                  v-for="item in userTagIdOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

<!--          <el-col>-->
<!--            <el-form-item label="奖励类型">-->
<!--              <el-radio-group v-model="formData.rewardType">-->
<!--                <el-radio :label="1">投注金</el-radio>-->
<!--                <el-radio :label="2">返水金</el-radio>-->
<!--                <el-radio :label="3">道具</el-radio>-->
<!--              </el-radio-group>-->
<!--            </el-form-item>-->
<!--          </el-col>-->

          <el-col>
            <el-form-item label="玩法大类型">
              <el-radio-group v-model="formData.gameType" @change="handleGameTypeChange">
                <el-radio :label="1">Slot</el-radio>
                <el-radio :label="2">Poker</el-radio>
                <el-radio :label="3">Casino</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-form label-width="220px">
        <el-col :span="12">
          <el-form-item label="勾选支持的游戏" :required="true">
            <el-input
              v-model="filterText"
              placeholder="输入关键字进行过滤"
            />
            <el-tree
              ref="tree"
              :data="treeData"
              show-checkbox
              node-key="id"
              highlight-current
              :props="defaultProps"
              :filter-node-method="filterNode"
              @check-change="handleCheckChange"
            />
          </el-form-item>
          <el-form-item label="给选中游戏排序" :required="true">
            <el-button size="mini" type="primary" @click="showGamesSortDialog">
              排序
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <!-- 游戏排序弹窗 -->
    <el-dialog
      title="给选中游戏排序"
      :visible.sync="gamesSortDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
    >
      <el-table
        :data="gamesSorted"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="gameId"
          label="游戏Id"
          width="200"
        />
        <el-table-column
          prop="name"
          label="游戏名称"
          width="200"
        />
        <el-table-column
          prop="orderNo"
          label="排序编号"
          width="200"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.orderNo"
              size="mini"
              oninput=" if(value < 0 || value === '' || value == null){value = 0;} "
              @change="onOrderNoChange"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-row style="top: 10px">
        <el-button type="primary" @click="saveGamesSort">保存</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import store from "@/store";

export default {
  name: 'ActivityBaseConfig',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userTypes: [
        {'value': 2, 'label': '所有用户'},
        {'value': 5, 'label': '用户标签'}
      ],
      userTagIdOptions: [
        {value: 50001, label: 'Slots新增用户'},
        {value: 50002, label: 'Slots登录天数'},
        {value: 50008, label: 'Slots回归用户'}
      ],
      filterText: '',
      allTreeData: [],
      treeData: [],
      defaultProps: {
        label: 'label',
        children: 'children',
        disabled: 'disabled'
      },
      gamesSorted: [],
      gamesSortDialogVisible: false
    }
  },
  computed: {
    store() {
      return store
    },
    // 计算属性 formData 用于实现 v-model 的双向绑定
    formData: {
      // formData 作为 v-model 的代理，get 返回父组件传递的 value，
      get() {
        return this.value
      },
      // set 通过 input 事件通知父组件更新 value
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree && this.$refs.tree.filter(val)
    },
    // 监听整个 value 对象的替换（如从编辑切换到新增时），重置缓存并重新过滤
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.gamesSorted = []
        this.$nextTick(() => {
          this.applyGameTypeFilter()
        })
      }
    },
    'formData.gameIdCfg': {
      handler() {
        if (this.isEdit && this.$refs.tree) {
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(this.formData.gameIdCfg || [])
            this.updateGamesSorted()
          })
        }
      },
      immediate: true
    },
    // 监听用户类型变化，自动设置用户标签默认值
    'formData.userType'(val) {
      if (val === 5 && !this.formData.userLabel && this.userTagIdOptions.length > 0) {
        this.formData.userLabel = this.userTagIdOptions[0].value
      }
    }
  },
  mounted() {
    this.getGameAll()
  },
  methods: {
    // 游戏树筛选方法
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleGameTypeChange() {
      // 切换玩法大类型时，清除已选游戏和排序缓存
      this.formData.gameIdCfg = []
      this.gamesSorted = []
      this.applyGameTypeFilter()
    },
    applyGameTypeFilter() {
      const selectedKey = 'p-' + this.formData.gameType
      this.treeData = this.allTreeData.filter(cty => cty.id === selectedKey)

      this.$nextTick(() => {
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys(this.formData.gameIdCfg || [])
        }
        this.updateGamesSorted()
      })
    },
    // 游戏树选中变化
    handleCheckChange(data, checked) {
      if (data.label === 'Slot' || data.label === 'Poker' || data.label === 'Casino') {
        return
      }

      // 确保 gameIdCfg 存在
      if (!this.formData.gameIdCfg) {
        this.formData.gameIdCfg = []
      }
      const gameIdCfg = this.formData.gameIdCfg
      const index = gameIdCfg.indexOf(data.id)
      if (checked) {
        if (index < 0) {
          gameIdCfg.push(data.id)
        }
      } else {
        if (index >= 0) {
          gameIdCfg.splice(index, 1)
        }
      }

      this.formData.gameIdCfg = gameIdCfg
      this.updateGamesSorted()
    },
    onUserTypeChange(val) {
      // this.$set(this.formData.userType, val);
    },
    // 更新选中游戏的排序列表
    updateGamesSorted() {
      const gamesSorted = []
      const gameIdCfg = this.formData.gameIdCfg || []
      // 遍历所有游戏树，找到选中的游戏
      this.treeData.forEach(category => {
        if (category.children) {
          category.children.forEach(game => {
            if (gameIdCfg.includes(game.id)) {
              const existIndex = gamesSorted.findIndex(g => g.gameId === game.id)
              if (existIndex < 0) {
                gamesSorted.push({
                  gameId: game.id,
                  name: game.label,
                  orderNo: gameIdCfg.indexOf(game.id) + 1
                })
              }
            }
          })
        }
      })
      // 按 orderNo 排序
      gamesSorted.sort((a, b) => a.orderNo - b.orderNo)
      this.gamesSorted = gamesSorted
    },
    // 显示游戏排序弹窗
    showGamesSortDialog() {
      this.updateGamesSorted()
      this.gamesSortDialogVisible = true
    },
    // 保存游戏排序
    saveGamesSort() {
      this.gamesSortDialogVisible = false
      // 根据排序编号重新排序
      this.gamesSorted.sort((a, b) => {
        return a.orderNo - b.orderNo
      })
      // 保存排序
      const gameIdCfg = []
      this.gamesSorted.forEach(item => {
        gameIdCfg.push(item.gameId)
      })
      this.formData.gameIdCfg = gameIdCfg
    },
    // 排序号变化时自动排序
    onOrderNoChange() {
      this.gamesSorted.sort((a, b) => {
        return a.orderNo - b.orderNo
      })
    },
    // 获取游戏列表
    getGameAll() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {},
        params: {status: 2}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          const data = {}
          for (let i = 0; i < objs.length; i++) {
            const obj = objs[i]
            if (obj.ShowDatacenter !== 1) {
              continue
            }

            const game = {Gid: obj.Gid, Name: obj.Name, Description: obj.Description}
            if (Object.prototype.hasOwnProperty.call(data, obj.CategoryID)) {
              data[obj.CategoryID].push(game)
            } else {
              data[obj.CategoryID] = [game]
            }
          }

          this.treeData = []
          const categories = {1: 'Slot', 2: 'Poker', 3: 'Casino'}

          const builtTree = []
          for (const key in data) {
            const games = data[key]
            const cty = {id: 'p-' + key, label: categories[key], children: []}

            for (let i = 0; i < games.length; i++) {
              const game = games[i]
              cty.children.push({id: game.Gid, label: game.Name})
            }
            builtTree.push(cty)
          }

          this.allTreeData = builtTree
          this.applyGameTypeFilter()

          // 如果是编辑模式，设置已选中的游戏
          if (this.isEdit && this.$refs.tree && this.formData.gameIdCfg) {
            this.$nextTick(() => {
              this.$refs.tree.setCheckedKeys(this.formData.gameIdCfg)
              this.updateGamesSorted()
            })
          }
        }
      })
    },
    // 设置选中的游戏（供父组件调用）
    setCheckedGames() {
      if (this.$refs.tree && this.formData.gameIdCfg) {
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.formData.gameIdCfg)
          this.updateGamesSorted()
        })
      }
    }
  }
}
</script>

