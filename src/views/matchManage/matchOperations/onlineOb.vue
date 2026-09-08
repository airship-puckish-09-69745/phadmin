<template>
  <div class="app-container">
      <el-row>
        <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" :on-compare="onCompare" />
      </el-row>

  <el-form ref="item" label-width="300px">


    <el-form-item label="全局ID选择:" :required="true">
      <el-checkbox-group v-model="editForm.unique_id_list" style="width: 700px" >
        <el-checkbox v-for="item in OB_MATCH_UNIQUE_ID_CFG" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
      </el-checkbox-group>
      <span  style="color: #409eff; margin-left: 10px;">
              注意:全局ID选择，勾选后OB直播才能看到该全局ID关联的比赛。
            </span>
    </el-form-item>


    <el-form-item label="延迟播放时间:" :required="true">
      <el-input v-model.number="editForm.delay_time" style="width: 200px;" placeholder="请填写延迟播放时间" />
      <span  style="color: #409eff; margin-left: 10px;">
              注意:单位为秒
            </span>
      <span v-if="editForm.delay_time === 0" style="color: #E6A23C; margin-left: 10px;">
              0秒延迟有风险，请慎重填写
            </span>
    </el-form-item>

    <el-form-item label="主播UID:" :required="true">
      <div style="display: flex; align-items: center; gap: 10px;">
        <el-input-number
          v-model="whiteUidInput"
          :min="0"
          :step="1"
          :precision="0"
          style="width: 260px;"
          size="mini"
        />
        <el-button type="primary" size="mini" @click="addWhitelistUid">添加</el-button>
      </div>

      <el-table
        :data="watch_uid_list"
        border
        :fit="true"
        size="mini"
        style="margin-top: 10px; width: 330px;"
      >
        <el-table-column label="UID">
          <template slot-scope="scope">
            {{ scope.row }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="removeWhitelistUid(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-col>
      <el-button type="primary" @click="save">保存配置</el-button>
    </el-col>
  </el-form>
  </div>
</template>


<script>
  import Compare from '@/components/Compare'
  import Publish from '@/components/Publish'
  import request from '@/utils/request'
  import {APPID_OPTIONS, MATCH_UNIQUE_ID_CFG, CHANNEL_OPTIONS, PROP_TYPE_OPTIONS} from "@/utils/options";
  import {$libDate, $libShow} from "@/utils/common";

  export default {
    components: { Compare, Publish,CHANNEL_OPTIONS},
    data() {
      return {
        baseForm: {},
        editForm: {
            "unique_id_list":[],  //可直播全局ID列表
            "watch_uid_list":[], //白名单列表，int 数组
            "delay_time":0,      //延迟时间 单位s
        },
        // 用于对比延迟时间是否发生变动
        originDelayTime: 0,
        originS5DelayTime: 0,
        whiteUidInput: null,
        // UI 展示用白名单列表（int 数组）
        unique_id_list: [],
        watch_uid_list:[],
        subKey: 'match_online_ob_config',
        AttrNames:{},
        MATCH_UNIQUE_ID_CFG,
        CHANNEL_OPTIONS,
        OB_MATCH_UNIQUE_ID_CFG:[],

      }
    },
    created() {
      this.getData()
     // 去掉MATCH_UNIQUE_ID_CFG 第一个下标原始
      //note 临时版本 仅开放S5的赛事
     //this.OB_MATCH_UNIQUE_ID_CFG = this.MATCH_UNIQUE_ID_CFG.slice(1)
      this.OB_MATCH_UNIQUE_ID_CFG=[
        { 'value': 10003, 'label': 'P10' },
        { 'value': 11102, 'label': 'S5 Daily' },
        { 'value': 11103, 'label': 'S5 Daily Plus' },
        { 'value': 11104, 'label': 'S5 SemiFinal' },]
    },
    methods: {
      getFullKey() {
        return 'CustomizeCfg_' + this.subKey
      },

      getData() {
        request({
          url: '/customizeconfig/one',
          method: 'get',
          data: {
            SubKey: this.subKey
          }
        }).then(response => {
          if (response.RetCode === 0) {
            this.baseForm = response.Data || {}
            if (response.Data && response.Data.Data !== '') {
              const cfg = JSON.parse(response.Data.Data)
              Object.assign(this.editForm, cfg)
              if (!Array.isArray(this.editForm.unique_id_list)) {
                this.editForm.unique_id_list = []
              }

              // 后端 hunter_list 现在是 int 数组，这里转换成数组供表格展示
              this.watch_uid_list = this.parseWatchUidList(this.editForm.watch_uid_list)
              // 统一：页面内数据用 number[]，不在 editForm 里保留后端逗号字符串
              this.editForm.watch_uid_list = [...this.watch_uid_list]
              this.originDelayTime = Number(this.editForm.delay_time) || 0
              //this.$refs.compare.SetOldVal(response.Data.Data)

            } else {
              // 无配置时清空白名单，避免残留上一次数据
              this.unique_id_list = []
              this.editForm.unique_id_list = []
              this.originDelayTime = 0
              this.originS5DelayTime = 0
            }
            this.baseForm = response.Data
          }
        })
      },


      parseWatchUidList(input) {
        // 后端 hunter_list 为 int[]：解析成去重后的 number[] 供表格展示
        if (!Array.isArray(input)) return []
        const seen = new Set()
        const res = []
        for (const uid of input) {
          const uidNum = Number(uid)
          if (!Number.isInteger(uidNum) || uidNum < 0) continue
          if (seen.has(uidNum)) continue
          seen.add(uidNum)
          res.push(uidNum)
        }
        return res
      },

      addWhitelistUid() {
        if (this.whiteUidInput === null || this.whiteUidInput === undefined) {
          this.$message.error('UID不能为空')
          return
        }

        const uidNum = this.whiteUidInput
        if (!Number.isInteger(uidNum) || uidNum <= 0) {
          this.$message.error('UID不正确')
          return
        }

        if (this.watch_uid_list.includes(uidNum)) {
          this.$message.error('UID已经存在')
          return
        }

        this.watch_uid_list.push(uidNum)
        this.editForm.watch_uid_list = [...this.watch_uid_list]
        this.whiteUidInput = null
      },

      removeWhitelistUid(uid) {
        this.watch_uid_list = this.watch_uid_list.filter(x => x !== uid)
        this.editForm.watch_uid_list = [...this.watch_uid_list]
      },

      saveCheck() {
        return true
      },

      save() {
        console.log("save: ",this.editForm)
        if (!this.saveCheck()) {
          return
        }
        const delayTimeChanged = this.editForm.delay_time !== this.originDelayTime
        const needConfirm = (delayTimeChanged && this.editForm.delay_time === 0)
        if (needConfirm) {
          this.$confirm('0秒延迟有风险，请慎重填写，确认是否要保存', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.doSave()
          }).catch(() => {
            this.getData()
          })
          return
        }
        this.doSave()
      },

      doSave() {
        console.log("this.editForm.delay_time",this.editForm.delay_time)
        // UI 内保持 number[]，直接提交给后端（int 数组）
        this.editForm.watch_uid_list = [...this.watch_uid_list]

        const payload = {
          watch_uid_list: this.editForm.watch_uid_list,
          unique_id_list : this.editForm.unique_id_list,
          delay_time : this.editForm.delay_time,
        }

        this.baseForm = this.baseForm || {}
        this.baseForm.Data = JSON.stringify(payload)
        //保存配置
        request({
          url: '/customizeconfig/update',
          method: 'post',
          data: this.baseForm,
        }).then(response => {
          console.log("response",response)
          if (response.RetCode === 0) {
            this.$message.success('保存成功')
            this.getData()
          } else {
            this.$message.error('保存失败: ' + response.Data)
          }
        })
      },

      onCompare(pre,pro) {
        const preVal = JSON.parse(pre.Data)
        const proVal = JSON.parse(pro.Data)

        let str = ""
        if (preVal.delay_time !== proVal.delay_time) {
          str += "延迟播放时间由" + proVal.delay_time + "s调整为" + preVal.delay_time + "s\n"
        }
          if(JSON.stringify(preVal.watch_uid_list) !== JSON.stringify(proVal.watch_uid_list)) {
            //新增
            if (preVal.watch_uid_list.length > proVal.watch_uid_list.length) {
              //查找差异项
              str += "新增主播UID:"
              for (const uid of preVal.watch_uid_list) {
                if (!proVal.watch_uid_list.includes(uid)) {
                  str += uid + "，"
                }
              }
              str += "\n"
            }
            //删除
            if (preVal.watch_uid_list.length < proVal.watch_uid_list.length) {
              //查找差异项
              str += "删除主播UID:"
              for (const uid of proVal.watch_uid_list) {
                if (!preVal.watch_uid_list.includes(uid)) {
                  str += uid + "，"
                }
              }
              str += "\n"
            }
          }
        if(JSON.stringify(preVal.unique_id_list) !== JSON.stringify(proVal.unique_id_list)) {
          //新增
          if (preVal.unique_id_list.length > proVal.unique_id_list.length) {
            //查找差异项
            str += "新增全局ID:"
            for (const uid of preVal.unique_id_list) {
              if (!proVal.unique_id_list.includes(uid)) {
                //查找OB_MATCH_UNIQUE_ID_CFG 中的label
                const label = this.OB_MATCH_UNIQUE_ID_CFG.find(item => item.value === uid)?.label
                str += label + "，"
              }
            }
            str += "\n"
          }
          //删除
          if (preVal.unique_id_list.length < proVal.unique_id_list.length) {
            //查找差异项
            str += "删除全局ID:"
            for (const uid of proVal.unique_id_list) {
              if (!preVal.unique_id_list.includes(uid)) {
                const label = this.OB_MATCH_UNIQUE_ID_CFG.find(item => item.value === uid)?.label
                str += label + "，"
              }
            }
            str += "\n"
          }

        }
        return str
      },
    }
  }
</script>
