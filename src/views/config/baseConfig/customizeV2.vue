<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <el-row>
        <el-col v-if="edit.isEdit">
          <publish primary-key="ID" :key-id="getFullKey()" :app-id="appId" :env-empty="false" compare-type="Object" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="10" style="padding-top: 10px">
          <el-button type="primary" size="medium" @click="save">保存配置</el-button>
        </el-col>
      </el-row>
      <el-form ref="form" :model="edit" label-width="150px" size="small" style="padding-top: 10px">
        <el-form-item label="所属应用：" :required="true" prop="item.AppId">
          <span>{{ appId > 0 ? appId : '通用配置' }}</span>
        </el-form-item>
        <el-form-item
          label="配置Key："
          :required="!edit.isEdit"
          prop="item.RedisSubkey"
          :rules="dataRule(!edit.isEdit,{type:'s',range:'2-50'})"
        >
          <el-col :span="5">
            <el-select
              v-model="edit.item.RedisSubkey"
              filterable
              placeholder="请选择配置项"
              @change="onSelectConfigKeyChange"
              style="width: 300px"
            >
              <el-option label="新增配置项" value="" />
              <el-option v-for="item in configKeys" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :span="15">
            <el-input v-if="!edit.isEdit" v-model="edit.item.RedisSubkey" />
          </el-col>
        </el-form-item>
        <el-form-item label="内容格式：" :required="true" prop="item.Type">
          <el-radio-group v-model="edit.item.Type" @change="typeChange">
            <el-radio :label="1">JSON</el-radio>
            <el-radio :label="2">普通字符串</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配置名称：" :required="true" prop="item.Name" :rules="dataRule(true,{type:'s',range:'2-20'})">
          <el-col :span="20">
            <el-input v-model="edit.item.Name" placeholder="方便管理用" />
          </el-col>
        </el-form-item>
        <el-form-item
          label="配置描述："
          prop="item.Description"
          :required="true"
          :rules="dataRule(true,{type:'s',range:'2-300'})"
        >
          <el-col :span="20">
            <el-input
              v-model="edit.item.Description"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 8}"
              placeholder="物品描述 2-300个字符"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="配置内容：" :required="true" prop="item.Data" :rules="dataRule(true,{type:'s',range:'1'})">
          <el-col :span="20">
            <json-editor-vue
              v-if="edit.item.Type === 1"
              v-model="edit.item.Data"
              :mode="edit.mode"
            />
            <el-input
              v-if="edit.item.Type === 2"
              v-model="edit.item.Data"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 10}"
            />
          </el-col>
        </el-form-item>
      </el-form>
    </el-row>
    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import {DataRule, $libShow } from '@/utils/common'
import {
  getAllCustomizes,
  updateCustomize,
  createCustomize,
  getCustomize
} from '@/api/custome_configV2'
import store from '@/store'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import VCA from '@vue/composition-api'
import JsonEditorVue from 'json-editor-vue';
import Vue from 'vue'
import Publish from "@/components/Publish/index.vue";
import request from "@/utils/request";

Vue.use(VCA)

const filterMap = {
  Type: { 1: 'JSON', 2: '普通字符串' }
}

function newItem(appId) {
  console.log('newItem appId:', appId)
  return { ID: 0, AppId: appId, Type: 1, Name: '', Description: '', Data: '', RedisSubkey: '' }
}

export default {
  components: {Publish, JsonEditorVue, Compare },
  data() {
    return {
      search: '',
      libShow: $libShow,
      env: 'test',
      configKeys: [],
      appId: 0,
      isGeneral:  true,

      edit: {
        item: {},
        val: '',
        vals: [],
        isEdit: false,
        mode: 'text'
      },

      itemEnv: process.env.NODE_ENV, // 项目环境
      itemName: process.env.VUE_APP_PROJECT, // 项目名称
    }
  },
  computed: {
  },
  created() {
    this.isGeneral = this.$route.meta.isGeneral
    this.appId = this.isGeneral ? 0 : store.getters.appId
    this.env = store.getters.env || this.env
    this.getList()
    this.edit.item = newItem(this.appId)
  },
  methods: {
    getDataRuleConfig() {
      if (this.edit.item.Subtype === 1) {
        return { type: 'n', range: '1' }
      } else {
        return { type: 's', range: '1' }
      }
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.edit.item.RedisSubkey
    },
    getList() {
      const $this = this
      getAllCustomizes(this.env, this.appId).then(response => {
        const objs = response.Data || []
        for (const i in objs) {
          $this.configKeys.push({label: objs[i].RedisSubkey + ' [' + objs[i].Name + ']', value: objs[i].RedisSubkey})
        }
      })
    },
    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    onSelectConfigKeyChange() {
      if (this.edit.item.RedisSubkey === '') {
        this.edit.item = newItem(this.appId)
        this.edit.isEdit = false
      } else {
        getCustomize(this.edit.item.RedisSubkey, this.appId).then(response => {
          if (response.RetCode === 0) {
            Object.assign(this.edit.item, response.Data)
            if (this.edit.item.Data && this.edit.item.Type === 1) {
              try {
                this.edit.item.Data = JSON.parse(this.edit.item.Data)
              } catch (e) {
                console.log(this.edit.item.Data)
                Message.warning('内容解析为JSON格式失败')
              }
            }

            this.edit.isEdit = true
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)
          }
        })
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    typeChange() {
      if (this.edit.item.Type === 1) {
        this.edit.item.Data = typeof this.edit.item.Data === 'string' ? JSON.parse(this.edit.item.Data) : this.edit.item.Data
      } else if (this.edit.item.Type === 2) {
        this.edit.item.Data = typeof this.edit.item.Data === 'string' ? this.edit.item.Data : JSON.stringify(this.edit.item.Data)
      }
    },
    getPostData() {
      const postData = JSON.parse(JSON.stringify(this.edit.item))
      postData.Env = this.env
      if (postData.Type === 1 && typeof this.edit.item.Data === 'object') {
        postData.Data = JSON.stringify(postData.Data)
      }
      return postData
    },
    createSave(postData) {
      createCustomize(postData).then(response => {
        if (response.RetCode === 0) {
          this.edit.isEdit = true
          this.configKeys.push(postData.RedisSubkey)
          Message.success('保存成功！若要发布到redis，请点击发布。')
        }
      })
    },
    editSave(postData) {
      updateCustomize(postData).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功！若要发布到redis，请点击发布。')
        }
      })
    },
    save() {
      const _data = this.getPostData()
      const $this = this
      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(_data)
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          } else {
            $this.editSave(_data)
          }
        })
      } else {
        this.createSave(_data)
      }
    }
  }
}
</script>
