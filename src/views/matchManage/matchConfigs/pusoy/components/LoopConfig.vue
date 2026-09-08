<template>
  <fieldset style="margin:20px auto;max-height: max-content;min-width: inherit;">
    <legend>开赛时间</legend>
    <el-form-item label="比赛类型：" :required="true">
      <el-select v-model="editForm.data.repeatType" placeholder="请选择" size="mini">
        <el-option
          v-for="item in repeatCfgs"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="checkRepeatDisable(item.value)"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-if="editForm.data.repeatType == 0" :label="getMatchStartTimeLabel()" :required="true">
      <el-date-picker
        v-model="editForm.loopDetail.onceTime"
        format="yyyy-MM-dd HH:mm"
        size="mini"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      />
      <el-tooltip v-if="editForm.data.opentMatchType == 1" class="item" effect="dark" content="人满开赛时结束时间无意义，但必须大于开始时间" placement="right-start">
        <i class="el-icon-info" />
      </el-tooltip>
    </el-form-item>
    <el-form-item v-if="editForm.data.repeatType != 0" label="比赛开始日期：" :required="true">
      <el-date-picker
        v-model="editForm.loopDetail.loopStartDate"
        size="mini"
        type="date"
        placeholder="选择开始日期"
        :disabled="repeatLoopDisabled()"
      />
      <span style="color:black; margin-left:10px">[00:00:00]</span>
    </el-form-item>
    <el-form-item v-if="editForm.data.repeatType != 0" label="比赛结束日期：" :required="true">
      <el-date-picker
        v-model="editForm.loopDetail.loopEndDate"
        size="mini"
        type="date"
        placeholder="选择结束日期"
      />
      <span style="color:black; margin-left:10px">[23:59:59]</span>
    </el-form-item>
    <el-form-item v-if="editForm.data.repeatType != 0" label="间隔天数（0为每天创建）：" :required="true">
      <el-input v-model.number="editForm.loopDetail.intervalDay" style="width: 200px;" placeholder="请填写间隔天数，0为每天创建" :disabled="repeatLoopDisabled()" />
    </el-form-item>
    <el-form-item v-if="editForm.data.repeatType == 1" label="开赛时间：" :required="true">
      <el-time-picker
        v-model="editForm.loopDetail.single.stime"
        arrow-control
        format="HH:mm"
        value-format="HH:mm:ss"
        placeholder="开始时间"
      />
      <el-time-picker
        v-model="editForm.loopDetail.single.etime"
        arrow-control
        format="HH:mm"
        value-format="HH:mm:ss"
        placeholder="结束时间"
      />
    </el-form-item>
    <el-form-item v-if="editForm.data.repeatType == 2" label="循环时间段：" :required="true">
      <el-button type="normal" size="mini" @click="addLoopItem()">添加时段</el-button>
      <el-table
        :data="editForm.loopDetail.loopData"
        border
        stripe
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'35px'}"
        :cell-style="libShow.TableCell(0)"
        style="width: 100%;line-height:35px;"
      >
        <el-table-column
          prop="index"
          label="第X段"
        />
        <el-table-column
          prop="stime"
          label="开始时间"
        >
          <template slot-scope="scope">
            <el-time-picker
              v-model="scope.row.stime"
              arrow-control
              format="HH:mm"
              value-format="HH:mm:ss"
              placeholder="开始时间"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="stime"
          label="结束时间"
        >
          <template slot-scope="scope">
            <el-time-picker
              v-model="scope.row.etime"
              arrow-control
              format="HH:mm"
              value-format="HH:mm:ss"
              placeholder="结束时间"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="intervalSeconds"
          label="间隔时间(秒)"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.intervalSeconds" style="width: 80px;" placeholder="请填写间隔时间" :disabled="repeatLoopDisabled()" />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="removeLoopItem(scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item v-if="editForm.data.opentMatchType==2" label="提前显示时间(秒)：" :required="true">
      <el-input v-model.number="editForm.data.preShowSeconds" style="width: 200px;" placeholder="请填写提前显示时间" />
      <span v-if="(editForm.data.opentMatchType === 2)&&(editForm.data.repeatType === 0 || editForm.data.repeatType === 1) && getCalculatedStartTime()" style="color: #409eff; margin-left: 10px;">
              提前显示时间: {{ getCalculatedStartTime() }}
      </span>
    </el-form-item>
    <el-form-item v-if="editForm.data.opentMatchType==1" label="创建时间(秒)" :required="true">
      <el-input v-model.number="editForm.data.preShowSeconds" style="width: 200px;" placeholder="请填写创建时间" />
      <el-tooltip v-if="editForm.data.opentMatchType == 1" class="item" effect="dark" content="比赛开始时间=最后开赛时间-创建时间" placement="right-start">
        <i class="el-icon-info" />
      </el-tooltip>
    </el-form-item>
    <el-form-item v-if="editForm.data.opentMatchType==2" label="提前进入时间(秒)：" :required="true">
      <el-input v-model.number="editForm.data.preEnterSeconds" style="width: 200px;" placeholder="请填写提前进入时间" />
    </el-form-item>
    <!--<el-form-item v-if="editForm.data.opentMatchType==2" label="延迟进入时间(秒)：" :required="true">
      <el-input v-model.number="editForm.data.delayEnterSeconds" style="width: 200px;" placeholder="请填写延迟进入时间" />
    </el-form-item> -->
    <el-form-item v-if="editForm.data.opentMatchType===2" label="延迟报名时间(秒)：" :required="true">
         <el-input v-model.number="editForm.listExtra.delaySignUpSeconds" style="width: 200px;" placeholder="请填写延迟报名时间" />
      <span style="color: #409eff; margin-left: 10px;"> 延迟报名时间需要小于等于Rebuy时间加额外的10秒 </span>
    </el-form-item>
  </fieldset>
</template>

<script>
import { $libShow, $libDate } from '@/utils/common'

export default {
  name: 'LoopConfig',
  props: {
    editForm: {
      type: Object,
      required: true
    },
    repeatCfgs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions()
    }
  },
  methods: {
    // 检查重复类型是否禁用
    checkRepeatDisable(val) {
      if (this.editForm.data.id > 0) {
        return true
      }
      if (this.editForm.data.opentMatchType == 1) {
        if (val == 1 || val == 2) {
          return true
        }
      }
      return false
    },

    // 獲取比賽開始時間標籤
    getMatchStartTimeLabel() {
      if (this.editForm.data.opentMatchType == 2) {
        return '开赛时间'
      } else {
        return '最后开赛时间'
      }
    },

    // 检查循环是否禁用
    repeatLoopDisabled() {
      if (this.editForm.data.repeatType === 2 && !this.editForm.isAdd && !this.editForm.singleCopyExtr.isCopy) {
        return true
      }
      return false
    },

    // 添加循環時段
    addLoopItem() {
      var index = 0
      if (this.editForm.loopDetail.loopData.length > 0) {
        index = this.editForm.loopDetail.loopData.length
      }
      index++
      this.editForm.loopDetail.loopData.push({
        index: index,
        stime: '',
        etime: '',
        intervalSeconds: 0
      })
    },

    // 移除循環時段
    removeLoopItem(index) {
      this.editForm.loopDetail.loopData.splice(index, 1)
      if (this.editForm.loopDetail.loopData.length > 0) {
        for (var i = 0; i < this.editForm.loopDetail.loopData.length; i++) {
          this.editForm.loopDetail.loopData[i].index = i + 1
        }
      }
    },
    getCalculatedStartTime() {
      try {
        let baseTime = null
        // repeatType = 0: 单场，使用 onceTime[0]
        if (this.editForm.data.repeatType === 0) {
          if (this.editForm.loopDetail.onceTime && this.editForm.loopDetail.onceTime[0]) {
            baseTime = new Date(this.editForm.loopDetail.onceTime[0])
          }
        }
        // repeatType = 1: 单天单场循环，使用 loopStartDate + single.stime
        else if (this.editForm.data.repeatType === 1) {
          if (this.editForm.loopDetail.loopStartDate && this.editForm.loopDetail.single.stime) {
            const date = new Date(this.editForm.loopDetail.loopStartDate)
            const timeParts = this.editForm.loopDetail.single.stime.split(':')
            if (timeParts.length >= 2) {
              date.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), parseInt(timeParts[2] || 0))
              baseTime = date
            }
          }
        }

        if (!baseTime) {
          return ''
        }

        // 減去提前显示时间
        const preShowSeconds = this.editForm.data.preShowSeconds || 0
        const calculatedTimestamp = Math.floor(baseTime.getTime() / 1000) - preShowSeconds

        // 使用項目中已有的時間格式化方法
        return $libDate.FormateSecondStr(calculatedTimestamp, 2)
      } catch (e) {
        console.error('计算开赛时间错误:', e)
        return ''
      }
    },
  }
}
</script>

<style scoped>
fieldset {
  margin: 20px auto;
  max-height: max-content;
  min-width: inherit;
}

.el-form-item {
  margin-bottom: 15px;
}

.el-time-picker {
  margin-right: 10px;
}
</style>
