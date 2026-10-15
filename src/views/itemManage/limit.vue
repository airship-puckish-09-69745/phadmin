<template>
  <div class="app-container">
      <el-row>
        <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :on-compare="onCompare" />
      </el-row>

  <el-form ref="item" :model="editForm" label-width="120px" size="mini">
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="道具发放限制" name="base">
        <el-table
          :data="editForm.grant_limit"
          border
          size="mini"
          style="width: 100%;"
        >

          <el-table-column label="道具类型" width="200">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.propType"
                placeholder="请选择"
                size="mini"
                style="width: 180px;"
              >
                <el-option
                  v-for="item in FIT_ITEM_TYPE_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="isTimeTypeUsed(item.value, scope.$index)"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="单日发放最大值" min-width="240">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.limit"
                :min="0"
                :precision="0"
                :step="1"
                step-strictly
                controls-position="right"
                size="mini"
                placeholder="请输入整数"
                style="width: 200px;"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="removeTimeCfg(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button style="margin-top: 10px;" size="mini" @click="addPropLimteCfg()">添加限制配置</el-button>
      </el-tab-pane>
    </el-tabs>
    <el-col style="margin-top: 15px;">
      <el-button type="primary" @click="save">保存配置</el-button>
    </el-col>
  </el-form>
  </div>
</template>


<script>
  import Compare from '@/components/Compare'
  import Publish from '@/components/Publish'
  import request from '@/utils/request'
  import {
    ITEM_TYPE_OPTIONS,
    PROP_TYPE_OPTIONS,
  } from "@/utils/options";
  import {getCustomize, updateCustomize} from "@/api/custome_configV2";
  import {Message} from "element-ui";


  export default {
    name: 'PropGrantLimitConfig',
    components: { Compare, Publish },
    data() {

      return {
        activeTab: 'base',
        baseForm: {},
        editForm: {
          "grant_limit":[], //{propType,limit}
        },
        PROP_TYPE_OPTIONS,
        ITEM_TYPE_OPTIONS,
        FIT_ITEM_TYPE_OPTIONS: [],
        subKey:"prop_grant_limit",
      }
    },
    computed() {

    },
    created() {
      this.FIT_ITEM_TYPE_OPTIONS = this.ITEM_TYPE_OPTIONS.filter(item => item.value === PROP_TYPE_OPTIONS.PROP_TONGITS_POT_COIN)
      this.getData()
    },
    methods: {
      getFullKey() {
        return 'CustomizeCfg_' + this.subKey
      },

      saveCheck() {
        const list = this.editForm.grant_limit || []
        for (let i = 0; i < list.length; i++) {
          const limit = Number(list[i].limit)
          if (!Number.isInteger(limit) || limit <= 0) {
            this.$message.error('发放限额数值不能填0')
            return false
          }
        }
        return true
      },

      save() {
        const active = document.activeElement
        if (active && typeof active.blur === 'function') {
          active.blur()
        }
        this.$nextTick(() => {
          if (!this.saveCheck()) {
            return
          }
          const payload = JSON.parse(JSON.stringify(this.editForm))
          payload.grant_limit = (payload.grant_limit || []).map(item => ({
            ...item,
            limit: Math.round(Number(item.limit) * 1000)
          }))
          this.baseForm = this.baseForm || {}
          this.baseForm.Data = JSON.stringify(payload)

          updateCustomize(this.baseForm).then(response => {
            if (response.RetCode === 0) {
              Message.success('保存成功')
              this.getData()
            }
          })
        })
      },

      getData() {
        getCustomize(this.subKey).then(response => {
          // console.log("response",response)
          if (response.RetCode === 0) {
            this.baseForm = response.Data || {}
            if (response.Data && response.Data.Data !== '') {
              const cfg = JSON.parse(response.Data.Data)
              if (Array.isArray(cfg.grant_limit)) {
                cfg.grant_limit.forEach(item => {
                  item.limit = Math.round(Number(item.limit) / 1000)
                })
              }
              Object.assign(this.editForm, cfg)
            }
            this.baseForm = response.Data
          }
        })
      },
      addPropLimteCfg() {
        if (!Array.isArray(this.editForm.grant_limit)) {
          this.$set(this.editForm, 'grant_limit', [])
        }
        if (this.editForm.grant_limit.length >= this.FIT_ITEM_TYPE_OPTIONS.length) {
          this.$message.warning('全部配置已全部添加')
          return
        }
        const usedTypes = new Set(this.editForm.grant_limit.map(item => item.propType))
        const nextOption = this.FIT_ITEM_TYPE_OPTIONS.find(opt => !usedTypes.has(opt.value))
        this.editForm.grant_limit.push({
          propType: nextOption ? nextOption.value : undefined,
          limit: 0
        })
      },
      removeTimeCfg(index) {
        this.editForm.grant_limit.splice(index, 1)
      },
      isTimeTypeUsed(type, currentIndex) {
        return this.editForm.grant_limit.some((item, index) => index !== currentIndex && item.propType === type)
      },
      getPropTypeLabel(type) {
        const item = this.FIT_ITEM_TYPE_OPTIONS.find(opt => opt.value === type)
        return item ? item.label : `类型${type}`
      },
      parseCompareCfg(val) {
        if (!val) {
          return {}
        }
        if (typeof val === 'string') {
          try {
            return this.parseCompareCfg(JSON.parse(val))
          } catch (e) {
            return {}
          }
        }
        if (typeof val !== 'object' || Array.isArray(val)) {
          return {}
        }
        if (typeof val.Data === 'string' && val.Data) {
          try {
            const parsed = JSON.parse(val.Data)
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
              return parsed
            }
          } catch (e) {
            return val
          }
        }
        return val
      },
      formatLimit(limit) {
        return Math.round(Number(limit) / 1000)
      },
      //pre 新 pro 旧
      onCompare(pre, pro) {
        const preVal = this.parseCompareCfg(pre)
        const proVal = this.parseCompareCfg(pro)
        const preTimeList = Array.isArray(preVal.grant_limit) ? preVal.grant_limit : []
        const proTimeList = Array.isArray(proVal.grant_limit) ? proVal.grant_limit : []
        let str = ''
        if (JSON.stringify(preTimeList) === JSON.stringify(proTimeList)) {
          return str
        }
        const preTimeListSet = new Set(preTimeList.map(item => item.propType))
        const proTimeListSet = new Set(proTimeList.map(item => item.propType))
        const deleteTimeList = proTimeList.filter(item => !preTimeListSet.has(item.propType))
        const addTimeList = preTimeList.filter(item => !proTimeListSet.has(item.propType))
        for (let i = 0; i < addTimeList.length; i++) {
          str += '新增: ' + this.getPropTypeLabel(addTimeList[i].propType) + ' 发放阈值为: ' + this.formatLimit(addTimeList[i].limit) + '\n'
        }
        for (let i = 0; i < deleteTimeList.length; i++) {
          str += '删除: ' + this.getPropTypeLabel(deleteTimeList[i].propType) + '\n'
        }
        for (let i = 0; i < proTimeList.length; i++) {
          const proItem = proTimeList[i]
          const preItem = preTimeList.find(item => item.propType === proItem.propType)
          if (preItem && preItem.limit !== proItem.limit) {
            str += this.getPropTypeLabel(proItem.propType) + ' 发放阈值由: ' + this.formatLimit(proItem.limit) + ' 调整为: ' + this.formatLimit(preItem.limit) + '\n'
          }
        }
        return str
      },
    }
  }
</script>
