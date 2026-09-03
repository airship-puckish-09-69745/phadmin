<template>
  <el-dialog :title="updateData && updateData.ID ? '编辑配置' : '新增配置'" :visible.sync="dialogVisible" width="540px" :close-on-click-modal="false" @close="handleClose(false)">
    <el-form :model="formData" label-width="100px">
      <el-form-item label="类型" required>
        <el-select v-model="formData.BroadcastType" placeholder="请选择类型" style="width: 360px;" @change="handleSetTime">
          <el-option v-for="option in broadcastTypeOptions" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" required>
        <el-input v-model="formData.Title" style="width: 360px;" />
      </el-form-item>
      <el-form-item label="AppID" required>
        <el-select v-model="formData.AppId" placeholder="请选择AppID" :disabled="formData.ID" style="width: 360px;">
          <el-option v-for="option in appIdOptions" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="渠道" required>
        <el-select v-model="formData.Channel" placeholder="请选择渠道" style="width: 360px;" multiple>
          <el-option v-for="option in channelOptions" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="内容" required>
        <el-input v-model="formData.Content" type="textarea" style="width: 360px;" />
        <template>
          <button @click="goToExternalSite">预览</button>
        </template>
      </el-form-item>
      <el-form-item v-if="formData.BroadcastType === 1" label="播报来源" required>
        <el-select v-model="formData.Origin" placeholder="请选择播报来源" style="width: 360px;" multiple>
          <el-option v-for="option in matchUniqueIdCfgs" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="显示位置" required>
        <el-select v-model="formData.ShowPosition" placeholder="请选择显示位置" style="width: 360px;">
          <el-option v-for="option in positionOptions" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="有效期" required>
        <el-date-picker
          v-model="formData.BroadcastTimeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 360px;"
          value-format="timestamp"
          format="yyyy-MM-dd HH:mm"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item label="频率(秒)" required>
        <el-input v-model="formData.BroadcastFrequency" style="width: 360px;" />
      </el-form-item>
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
// import request from '@/utils/request'

import store from '@/store'
export default {
  props: {
    appId: {
      type: Number,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    },
    updateData: {
      type: Object,
      default: () => ({})
    },
    /**
     * 广播类型选项
     */
    broadcastTypeOptions: {
      type: Array,
      default: () => []
    },
    channelOptions: {
      type: Array,
      default: () => []
    },
    positionOptions: {
      type: Array,
      default: () => []
    },
    matchUniqueIdCfgs: {
      type: Array,
      required: true
    },
    // 比赛第一名的配置列表，用于保存时校验有效期不能有交叉
    // 不包含updateData的数据
    matchFirstRankCfgs: {
      type: Array,
      default: () => []
    },
    jpFirstRankCfgs: {
      type: Array,
      default: () => []
    },
    appIdOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 字段参考resetForm
      formData: {}
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        if (!val) this.$emit('close')
      }
    }
  },
  watch: {
    // updateData(newData) {
    //   if (newData) {
    //     this.formData = { ...newData }
    //   }
    // },
    visible(val) {
      if (!val) {
        this.resetForm()
      } else {
        console.log(this.matchFirstRankCfgs)
        if (this.updateData) {
          this.formData = { ...this.updateData }
          // 日期 * 1000
          this.formData.BroadcastTimeRange = this.formData.BroadcastTimeRange.map(item => item * 1000)
          this.formData.CreateTime *= 1000
          this.formData.UpdateTime *= 1000
          console.log('this.updateData', this.updateData)
        } else {
          this.resetForm()
          console.log('this.formData', this.formData)
        }
      }
    }
  },
  methods: {
    /**
     * 校验表单数据
     */
    checkoutForm() {
      if (!this.formData.Title) {
        this.$message.warning('标题不能为空!')
        return false
      }

      if (!this.formData.Channel || this.formData.Channel.length === 0) {
        this.$message.warning('渠道不能为空!')
        return false
      }
      if (!this.formData.Content) {
        this.$message.warning('内容不能为空!')
        return false
      }
      if (this.formData.AppId <= 0) {
        this.$message.warning('AppId选择错误!')
        return false
      }

      if (this.formData.BroadcastType === 4) {
        let nCount = this.handleContentLength(this.formData.Content)
        let diffCount = this.formData.Content.length - nCount
        if (diffCount > 200) {
          this.$message.warning('内容不能超过200!')
          return false
        }
      }

      if (!this.formData.BroadcastType) {
        this.$message.warning('类型不能为空!')
        return false
      }
      // 播报来源只在类型为比赛第一名时才需要
      if (this.formData.BroadcastType === 1 && this.formData.Origin.length === 0) {
        this.$message.warning('播报来源不能为空!')
        return false
      }
      if (!this.formData.ShowPosition) {
        this.$message.warning('展示位置不能为空!')
        return false
      }
      if (!this.formData.BroadcastTimeRange) {
        this.$message.warning('有效期不能为空!')
        return false
      }
      // 频率必须大于0
      if (!this.formData.BroadcastFrequency || this.formData.BroadcastFrequency < 0) {
        this.$message.warning('频率不能为空，且大于0秒!')
        return false
      }
      // 如果是比赛第一名类型，必须校验有效期不能有交叉
      if (this.formData.BroadcastType === 1) {
        let isUpdate = false
        for (let i = 0; i < this.matchFirstRankCfgs.length; i++) {
          if (this.matchFirstRankCfgs[i].ID !== this.formData.ID) {
            if (this.matchFirstRankCfgs[i].AppId === this.formData.AppId) {
              let [start, end] = this.matchFirstRankCfgs[i].BroadcastTimeRange
              start *= 1000
              end *= 1000
              const [start2, end2] = this.formData.BroadcastTimeRange
              if ((start <= start2 && end >= start2) || (start <= end2 && end >= end2)) {
                isUpdate = true
                break
              }
              if (start <= start2 && end2 <= end) {
                isUpdate = true
                break
              }
            }
          }
        }
        if (isUpdate) {
          this.$message.warning('比赛第一名类型的有效期冲突!')
          return false
        }
      }

      if (this.formData.BroadcastType === 2) {
        let isUpdate = false
        for (let i = 0; i < this.jpFirstRankCfgs.length; i++) {
          if (this.jpFirstRankCfgs[i].ID !== this.formData.ID) {
            if (this.jpFirstRankCfgs[i].AppId === this.formData.AppId) {
              let [start, end] = this.jpFirstRankCfgs[i].BroadcastTimeRange
              start *= 1000
              end *= 1000
              const [start2, end2] = this.formData.BroadcastTimeRange
              if ((start <= start2 && end >= start2) || (start <= end2 && end >= end2)) {
                isUpdate = true
                break
              }
              if (start <= start2 && end2 <= end) {
                isUpdate = true
                break
              }
            }
          }
        }
        if (isUpdate) {
          this.$message.warning('jp类型的有效期冲突!')
          return false
        }
      }
      return true
    },
    async handleSave() {
      if (!this.checkoutForm()) {
        return
      }

      const data = { ...this.formData }
      data.AppId = this.formData.AppId
      data.Operator = store.getters.name
      data.BroadcastTimeRange = data.BroadcastTimeRange.map(item => parseInt(item / 1000))
      if (!data.ID) {
        data.ID = Date.now().toString()
        data.CreateTime = parseInt(Date.now() / 1000)
      } else {
        data.CreateTime = parseInt(data.CreateTime / 1000)
      }
      data.UpdateTime = parseInt(Date.now() / 1000)
      // 如果不是比赛第一名类型，清空播报来源
      if (data.BroadcastType !== 1) {
        data.Origin = []
      }
      // 频率转换为数字类型
      data.BroadcastFrequency = parseInt(data.BroadcastFrequency)
      this.$emit('save', data)
      this.handleClose()
    },
    resetForm() {
      this.formData = {
        ID: 0,
        // 应用id
        AppId: 0,
        // 渠道
        Channel: '',
        // 播报类型
        BroadcastType: '',
        // 内容
        Content: '',
        // 标题
        Title: '',
        // 播报来源
        Origin: [],
        // 展示位置
        ShowPosition: 1,
        // 状态
        Status: false,
        // 播报有效期
        BroadcastTimeRange: [],
        // 频率：单位秒
        BroadcastFrequency: 60,
        // 创建时间
        CreateTime: 0,
        // 修改时间
        UpdateTime: 0,
        // 操作人
        Operator: ''
      }
    },
    handleClose(reload = false) {
      this.resetForm()
      this.$emit('close')
      if (reload) {
        this.$emit('reload')
      }
    },
    handleSetTime() {
      if (this.formData.BroadcastType === 4) {
        if (this.formData.BroadcastTimeRange.length === 0) {
          this.formData.Content = ''
          const currTime = new Date()
          currTime.setHours(0, 0, 0, 0)
          let startTime = currTime.getTime()
          let endTime = startTime + 24 * 60 * 60 * 1000 * 7 - 1000
          this.formData.BroadcastTimeRange = [startTime, endTime]
        }
      } else {
        if (this.formData.ID === 0) {
          this.formData.BroadcastTimeRange = []
        }
        this.formData.Content = ''
        if (this.formData.Content.length === 0) {
          if (this.formData.BroadcastType === 1) {
            const textString = `<size=36><b><outline color=#2553B3 width=3>Congratulations the <color=#FFFC00>__name__</color> to get the <color=#00FFD2>__rank__</color> in <color=#FFFC00>__title__</color> with <color=#FFFC00>__rewards__</color>!</outline></b></size>`;
            this.formData.Content = textString
          } else if (this.formData.BroadcastType === 2) {
            const textString = `<size=36><b><outline color=#2553B3 width=3>Congratulations to <color=#FFFC00>__name__</color> on winning the jackpot <color=#00FFD2>__extraJackpotType__</color> of <color=#FFFC00>__rewards__</color>!</outline></b></size>`;
            this.formData.Content = textString
          }
        }
      }
    },
    handleContentLength(str) {
      const matches = str.match(/<[^>]+>/g);
      if (!matches) {
        return 0
      }
      let totalLength = 0;
      matches.forEach(match => {
        totalLength += match.length; // 减去<和>的长度
      });
      return totalLength;
    },
    goToExternalSite() {
      window.open('http://192.168.6.69:4000/', '_blank');
    }
  }
}
</script>
