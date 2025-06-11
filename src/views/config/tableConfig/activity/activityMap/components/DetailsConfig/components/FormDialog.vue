<template>
  <el-dialog :title="updateData && updateData.ID ? '编辑配置' : '新增配置'" :visible.sync="dialogVisible" width="560px" :close-on-click-modal="false" @close="handleClose(false)">
    <el-form :model="formData" label-width="120px">
      <el-form-item label="活动名称" required>
        <el-select v-model="formData.ActivityId" placeholder="请选择活动" style="width: 360px;" @change="onChangeActivityId">
          <el-option v-for="option in activityOptions" :key="option.id" :label="`${option.name}-${option.id}`" :value="option.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动金额" :rules="{ required: true, message: '请输入活动金额', trigger: 'blur' }">
        <el-input v-model="formData.Amount" type="number" style="width: 360px;" />
      </el-form-item>
      <el-form-item label="活动图标" :rules="{ required: true, message: '请选择活动图标', trigger: 'blur' }">
        <ImagePicker v-model="formData.Icon" />
      </el-form-item>
      <el-form-item label="头像框" :rules="{ required: true, message: '请选择头像框', trigger: 'blur' }">
        <ImagePicker v-model="formData.Avatar" />
      </el-form-item>
      <el-form-item label="玩法简要" prop="Description" :rules="{ required: true, message: '请输入玩法简要', trigger: 'blur' }">
        <el-input v-model="formData.Description" type="textarea" />
      </el-form-item>
      <el-form-item label="活动时间" prop="ActivityTime" :rules="{ required: true, message: '请选择活动时间', trigger: 'blur' }">
        <el-date-picker v-model="formData.ActivityTime" value-format="timestamp" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item label="选择游戏">
        <GameTreeSelector :selected-games-id="selectedGamesId" @change="handleGamesChange" />
      </el-form-item>
      <!-- 通过表格的方式显示游戏列表，可以编辑游戏热度 -->
      <el-form-item label="游戏热度">
        <el-table :data="formData.GameList" border style="width: 100%;">
          <el-table-column prop="id" label="游戏ID" width="80" />
          <el-table-column prop="label" label="游戏名称" width="180" />
          <el-table-column prop="hot" label="热度">
            <template slot-scope="scope">
              <el-input v-model="scope.row.hot" type="number" style="width: 100%;" @blur="onGameHotChange" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-divider>
        成就
      </el-divider>
      <div class="achievement-list">
        <div v-for="(achievementItem, index) in formData.AchievementList" :key="index" class="achievement-list-item">
          <div class="achievement-list-item-row">
            <span class="achievement-list-item-row-name">成就名称</span>：
            <el-input v-model="achievementItem.AchievementName" />
          </div>
          <div class="achievement-list-item-row">
            <span class="achievement-list-item-row-name">完成条件</span>：
            <el-input v-model="achievementItem.AchievementCondition" type="textarea" />
          </div>

          <div class="achievement-list-item-btns">
            <el-button v-if="index < 2" type="success" icon="el-icon-plus" size="mini" class="btn-plus" @click="addAchievement(index)" />
            <el-button v-if="index !== 0" type="danger" icon="el-icon-delete" size="mini" class="btn-delete" @click="deleteAchievement(index)" />
          </div>
        </div>
      </div>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose(false)">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import GameTreeSelector from './GamesTreeSelector.vue'
export default {
  components: {
    ImagePicker,
    GameTreeSelector
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    updateData: {
      type: Object,
      default: () => ({})
    },
    activityOptions: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      // 和index列表组件保持一致的表单数据结构
      formData: {
        ID: '',
        ActivityId: '',
        ActivityName: '',
        Amount: 0,
        Icon: '',
        Avatar: '',
        Description: '',
        ActivityTime: [],
        // AchievementNumber: 0,
        // AchievementName: '',
        // AchievementCondition: ''
        AchievementList: [
          this.getBlankAchievementItem()
        ],
        GameList: [] // 选择的游戏列表，回传过来之后会添加热度属性hot,
      },
      selectedGamesId: []
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    updateData(newData) {
      if (newData) {
        this.formData = { ...newData }
        this.formData.ActivityTime = [
          newData.ActivityTime[0] * 1000,
          newData.ActivityTime[1] * 1000
        ]
        this.selectedGamesId = newData.GameList.map(game => game.id)
        console.log('updateData', this.selectedGamesId)
      } else {
        this.resetForm()
      }
    },
    visible(val) {
      if (!val) {
        this.resetForm()
      }
    }
  },
  methods: {
    /**
     * 游戏热度改变时对列表进行排序，热度大的排前面
     * 将热度转化为整数类型
     */
    onGameHotChange() {
      this.$nextTick(() => {
        this.formData.GameList.sort((a, b) => b.hot - a.hot)
        // 遍历GameList，将hot转化为整数类型
        for (let i = 0; i < this.formData.GameList.length; i++) {
          this.formData.GameList[i].hot = parseInt(this.formData.GameList[i].hot)
        }
      })
    },
    /**
     * 点击按钮增加成就
     * @param {*} index
     */
    addAchievement(index) {
      this.formData.AchievementList.splice(index + 1, 0, this.getBlankAchievementItem())
    },
    handleGamesChange(selectedGames) {
      const gameList = selectedGames.map(game => {
        // 判断GameList是不是已经含有这个游戏，如果有则直接返回，否则添加热度属性
        const existingGame = this.formData.GameList ? this.formData.GameList.find(g => g.id === game.id) : null
        return {
          ...game,
          hot: existingGame ? existingGame.hot : 0
        }
      })
      this.formData.GameList = gameList || []
      this.onGameHotChange()
      // console.log('handleGamesChange', this.formData.GameList)
    },
    /**
     * 点击按钮删除成就
     * @param {*} index
     */
    deleteAchievement(index) {
      this.formData.AchievementList.splice(index, 1)
    },
    getBlankAchievementItem() {
      return {
        AchievementName: '',
        AchievementCondition: ''
      }
    },
    onChangeActivityId(val) {
      const selectedActivity = this.activityOptions.find(option => option.id === val)
      this.formData.ActivityName = selectedActivity ? selectedActivity.name : ''
      console.log('onChangeActivityId', val, this.formData.ActivityName)
    },
    handleSave() {
      if (!this.checkoutForm()) {
        return
      }
      const { ...submitData } = this.formData
      // 日期/1000
      submitData.ActivityTime = [
        Math.floor(submitData.ActivityTime[0] / 1000),
        Math.floor(submitData.ActivityTime[1] / 1000)
      ]
      // 金额和成就个数转换为整数类型
      submitData.Amount = parseInt(submitData.Amount)
      // submitData.AchievementNumber = parseInt(submitData.AchievementNumber)
      this.$emit('save', submitData)
      this.resetForm()
    },
    resetForm() {
      this.formData = {
        ID: '',
        ActivityId: '',
        ActivityName: '',
        Amount: 0,
        Icon: '',
        Avatar: '',
        Description: '',
        ActivityTime: '',
        AchievementList: [
          this.getBlankAchievementItem()
        ]
      }
      this.$emit('update:visible', false)
    },
    handleClose(reload = false) {
      this.resetForm()
      this.$emit('update:visible', false)
    },
    /**
     * 检查表单数据
     * 所有的输入框都不能为空
     * 成就必须1-3个，每个成就的名称和条件都不能为空
     * @returns {boolean}
     */
    checkoutForm() {
      if (!this.formData.ActivityName) {
        this.$message.error('请选择活动名称')
        return false
      }
      if (!this.formData.Amount) {
        this.$message.error('请输入活动金额')
        return false
      }
      if (!this.formData.Icon) {
        this.$message.error('请选择活动图标')
        return false
      }
      if (!this.formData.Avatar) {
        this.$message.error('请选择头像框')
        return false
      }
      if (!this.formData.Description) {
        this.$message.error('请输入玩法简要')
        return false
      }
      if (!this.formData.ActivityTime || this.formData.ActivityTime.length !== 2) {
        this.$message.error('请选择活动时间')
      }
      for (let i = 0; i < this.formData.AchievementList.length; i++) {
        const achievement = this.formData.AchievementList[i]
        if (!achievement.AchievementName) {
          this.$message.error(`请输入第${i + 1}个成就的名称`)
          return false
        } else if (!achievement.AchievementCondition) {
          this.$message.error(`请输入第${i + 1}个成就的条件`)
          return false
        }
      }
      return true
    }
  }
}
</script>

<style scoped lang="scss">
.achievement-list {
  &-item {
    padding: 8px;
    border: 1px solid #ccc;
    width: calc(100% - 24px);
    margin-left: 12px;
    position: relative;
    margin-bottom: 8px;

    &-row {
      display: flex;
      margin-bottom: 8px;
      &-name {
        width: 80px;
        text-align: right;
        margin-right: 8px;
        &::before {
          content: '*';
          color: red;
          margin-right: 4px;
        }
      }
    }

    &-btns {
      width: auto;
      margin: 8px auto 0;
      padding-left: calc(50% - 50px);
    }

    // .btn-delete,
    // .btn-plus {

    // }

    .el-input,
    .el-textarea {
      width: calc(100% - 130px);
    }
  }
}
</style>
