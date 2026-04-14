<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <el-col :span="2" :offset="20">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加配置项
        </el-button>
        <el-button
          v-if="itemEnv === 'development'"
          size="mini"
          type="success"
          icon="el-icon-setting"
          @click="showSync"
        >配置同步
        </el-button>
      </el-col>
      <el-col :span="4">
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入关键字搜索"
          @input="searchChange"
        />
      </el-col>
    </el-row>
    <div style="padding-top: 10px">
      <el-table
        ref="filterTable"
        :data="clientDB.ShowData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        @row-click="clickData"
        @sort-change="sortChange"
      >
        <el-table-column
          prop="ID"
          label="ID"
          sortable="custom"
          width="70"
        />
        <el-table-column
          prop="Name"
          label="名称"
          min-width="100"
        />
        <el-table-column
          prop="RedisSubkey"
          label="SubKey"
          min-width="100"
        />
        <el-table-column
          prop="Type"
          label="类型"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['Type']" size="mini" @change="handleFilter">
              <el-option label="类型" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['Type']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('Type', scope.row.Type) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Subtype"
          label="子类型"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['Subtype']" size="mini" @change="handleFilter">
              <el-option label="子类型" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['Subtype']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('Subtype', scope.row.Subtype) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Description"
          label="描述"
          min-width="200"
        />
        <el-table-column
          prop="LastModify"
          label="最近修改"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.LastModify) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="ModifyUser"
          label="最后修改人"
          width="100"
        />
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="clientDB.GetPage().GetPageNum()"
            layout="total, sizes, prev, pager, next, jumper"
            :total="clientDB.GetPage().GetTotalCount()"
            @size-change="clientDB.OnPageSizeChange"
            @current-change="clientDB.OnPageNoChange"
          />
        </div>
      </el-col>
    </div>
    <el-dialog :title="getEditTitle()" :visible.sync="edit.visible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row v-if="edit.isEdit">
        <el-col :span="4" :offset="3">
          <el-button v-if="env=='test'" type="primary" size="medium" @click="test">发布测试</el-button>
          <el-button v-else type="primary" size="medium" @click="pro">发布外网</el-button>
        </el-col>
      </el-row>
      <el-form ref="form" :model="edit" label-width="150px" size="small">
        <el-form-item label="配置类型：" :required="true" prop="item.Type">
          <el-radio-group v-model="edit.item.Type" :disabled="edit.isEdit" @change="typeChange">
            <el-radio :label="1">字符串</el-radio>
            <el-radio :label="2">哈希表</el-radio>
            <el-radio :label="3">集合</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="值类型：" :required="true" prop="item.Subtype">
          <el-radio-group v-model="edit.item.Subtype" :disabled="edit.isEdit">
            <el-radio :label="1">整型</el-radio>
            <el-radio :label="2">字符串</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称：" :required="true" prop="item.Name" :rules="dataRule(true,{type:'s',range:'2-20'})">
          <el-col :span="20">
            <el-input v-model="edit.item.Name" placeholder="方便管理用" />
          </el-col>
        </el-form-item>
        <el-form-item
          label="描述："
          prop="item.Description"
          :required="true"
          :rules="dataRule(true,{type:'s',range:'2-100'})"
        >
          <el-col :span="20">
            <el-input
              v-model="edit.item.Description"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 8}"
              placeholder="物品描述 2-100个字符"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="Redis子键："
          :required="true"
          prop="item.RedisSubkey"
          :rules="dataRule(true,{type:'s',range:'2-20'})"
        >
          <el-col :span="20">
            <el-input v-if="!edit.isEdit" v-model="edit.item.RedisSubkey" />
            <span v-else>{{ edit.item.RedisSubkey }}</span>
          </el-col>
        </el-form-item>
        <template v-if="edit.item.Type==1 && edit.item.Subtype==1">
          <el-form-item label="数值：" :required="true" prop="val" :rules="dataRule(true,{type:'n'})">
            <el-col :span="20">
              <el-input v-model.number="edit.val" placeholder="整数" />
            </el-col>
          </el-form-item>
        </template>
        <template v-if="edit.item.Type==1 && edit.item.Subtype==2">
          <el-form-item label="值：" :required="true" prop="val" :rules="dataRule(true,{type:'s',range:'1'})">
            <el-input
              v-model="edit.val"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 8}"
            />
          </el-form-item>
        </template>
        <el-form-item v-if="edit.item.Type!=1" label="填写方式：">
          <el-radio-group v-model="edit.writeType">
            <el-radio :label="1">JSON填写</el-radio>
            <el-radio :label="2">详细填写</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="edit.item.Type==2">
          <el-form-item
            v-if="edit.writeType==1"
            label="JSON完整内容"
            :required="true"
            prop="val"
            :rules="dataRule(true,{type:'s',range:'1'})"
          >
            <el-col :span="20">
              <el-input
                v-model="edit.val"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 10}"
              />
            </el-col>
          </el-form-item>
          <el-form-item v-if="edit.writeType==2" label="健值对：">
            <el-row v-for="(o,idx) in edit.vals" :key="idx">
              <el-col :span="4">
                <el-form-item :required="true" :prop="'vals.' + idx + '.k'" :rules="dataRule(true)">
                  <el-input v-model="o.k" />
                </el-form-item>
              </el-col>
              <el-col :span="2">
                &nbsp;:
              </el-col>
              <el-col :span="10">
                <el-form-item
                  :required="true"
                  :prop="'vals.' + idx + '.v'"
                  :rules="dataRule(true,getDataRuleConfig())"
                >
                  <el-input v-if="IsNumber" v-model.number="o.v" />
                  <el-input v-else v-model="o.v" />
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button v-if="idx==0" class="el-icon-plus" size="mini" @click="AddHashValue()" />
                <el-button v-else class="el-icon-minus" size="mini" @click="DelHashValue(idx)" />
              </el-col>
            </el-row>
          </el-form-item>

        </template>
        <template v-if="edit.item.Type==3">
          <el-form-item
            v-if="edit.writeType==1"
            label="JSON完整内容"
            :required="true"
            prop="val"
            :rules="dataRule(true,{type:'s',range:'1'})"
          >
            <el-col :span="20">
              <el-input
                v-model="edit.val"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 10}"
              />
            </el-col>
          </el-form-item>
          <el-form-item v-if="edit.writeType==2" label="值列表：">
            <el-row v-for="(o,idx) in edit.vals" :key="idx">
              <el-col :span="16">
                <el-form-item
                  :required="true"
                  :prop="'vals.' + idx + '.v'"
                  :rules="dataRule(true,{type:'s',range:'1'})"
                >
                  <el-input v-model="o.v" />
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button v-if="idx==0" class="el-icon-plus" size="mini" @click="AddSetValue()" />
                <el-button v-else class="el-icon-minus" size="mini" @click="DelSetValue(idx)" />
              </el-col>
            </el-row>
          </el-form-item>

        </template>
        <el-form-item>
          <el-row>
            <el-col :span="4" :offset="16">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="success" size="medium" @click="showJson">Json查看</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-drawer
      title="JSON查看"
      :visible.sync="edit.drawer.visible"
      direction="ltr"
    >
      <json-viewer
        :value="edit.drawer.jsonData"
        :expand-depth="5"
        copyable
        sort
      />
    </el-drawer>

    <el-drawer
      title="配置同步"
      :visible.sync="sync.show"
      direction="rtl"
      size="50%"
    >
      <span>
        <el-alert
          title="只有开发服可以同步；同步不存在的配置；同步只是往表里面插入数据，并没有发布"
          type="success"
        />
        <br>
        <el-form ref="sync" :model="sync" :inline="true" label-width="80px">
          <el-form-item label="项目">
            <el-select v-model="sync.item" @change="changeEnvOption">
              <el-option
                v-for="item in sync.itemOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="环境">
            <el-select v-model="sync.env">
              <el-option
                v-for="item in sync.envOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="getTargetList">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="sync.data"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            label="名称"
          />
          <el-table-column
            prop="key"
            label="SubKey"
          />
          <el-table-column
            prop="type"
            label="类型"
          >
            <template slot-scope="scope">
              {{ clientDB.GetShowValue('Type', scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="subType"
            label="数值类型"
          >
            <template slot-scope="scope">
              {{ clientDB.GetShowValue('Subtype', scope.row.subType) }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="syncConfig(scope.row.key)">同步</el-button>
            </template>
          </el-table-column>
        </el-table>
      </span>
    </el-drawer>

    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<script>
import { ClientTableData, DataRule, $libDate, $libShow } from '@/utils/common'
import { getAllCustomizes } from '@/api/custome_config'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import JsonViewer from 'vue-json-viewer'

const filterMap = {
  Type: { 1: 'String类型', 2: 'Hash类型', 3: '集合类型' },
  Subtype: { 1: '整数值', 2: '字符串值' }
}

function newItem() {
  return { ID: 0, Type: 1, Name: '', Subtype: 1, Description: '', Data: '', RedisSubkey: '' }
}

export default {
  components: { Compare, JsonViewer },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',

      edit: {
        visible: false,
        drawer: {
          visible: false,
          jsonData: {}
        },
        item: newItem(),
        val: '',
        vals: [],
        keyID: 136,
        opType: 1,
        writeType: 2,
        isEdit: false
      },

      itemEnv: process.env.NODE_ENV, // 项目环境
      itemName: process.env.VUE_APP_PROJECT, // 项目名称

      // 配置同步
      sync: {
        show: false,
        item: 'id', // 项目
        itemOptions: [
          { label: '印度', value: 'id' },
          { label: '巴西', value: 'br' }
        ],
        env: 'test',
        envOptions: [
          { label: '测试', value: 'test' },
          { label: '正式', value: 'pro' }
        ],
        envOptionsNot: [ // 不包含开发服
          { label: '测试', value: 'test' },
          { label: '正式', value: 'pro' }
        ],
        envOptionsDev: [ // 包含开发服
          { label: '开发', value: 'dev' },
          { label: '测试', value: 'test' },
          { label: '正式', value: 'pro' }
        ],
        data: [
          {
            'key': '',
            'name': '',
            'type': '', // redis存储类型 1字符串 2哈希 3集合
            'subType': '', // 数值类型 1整型 2字符串
            'originData': '', // 源
            'targetData': '' // 目标
          }
        ],
        originMap: {}, // 源列表
        targetMap: {} // 目标列表
      }
    }
  },
  computed: {
    IsNumber() {
      return this.edit.item.Subtype === 1
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.sync.item = this.itemName // 优先相同项目
    this.sync.envOptions = this.sync.envOptionsNot
    this.getList()
  },
  methods: {
    changeEnvOption() {
      if (this.sync.item === this.itemName) {
        this.sync.envOptions = this.sync.envOptionsNot
      } else {
        this.sync.envOptions = this.sync.envOptionsDev
      }
    },
    showSync() {
      this.sync.show = true
    },
    showJson() {
      let ret = {}
      try {
        ret = JSON.parse(this.edit.item.Data)
      } catch (e) {
        console.log(this.edit.item.Data)
        Message.warning('内容解析为JSON格式失败')
      }
      this.edit.drawer.jsonData = ret
      this.edit.drawer.visible = true
    },
    getDataRuleConfig() {
      if (this.edit.item.Subtype === 1) {
        return { type: 'n', range: '1' }
      } else {
        return { type: 's', range: '1' }
      }
    },
    // 筛选相关逻辑
    searchChange() {
      this.clientDB.Search(this.search, ['Name', 'ID', 'RedisSubkey'])
    },
    handleFilter() {
      this.clientDB.FilterData()
      this.refreshShow()
    },
    // 显示类处理函数
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
    },
    // 操作类函数
    clickData(row, column, event) {
      this.initFormData(true, row.ID)
      this.edit.visible = true
    },

    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    syncConfig(key) {
      request({
        url: '/customizeconfig/sync/config',
        method: 'post',
        data: {
          item: this.sync.item,
          env: this.sync.env,
          subKey: key,
          operator: this.$store.getters.name
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.getTargetList()
          this.$message.success('同步成功')
        } else {
          this.$message.error(response.Data)
        }
      })
    },
    syncConfigMerge() {
      this.sync.data = []
      for (const key in this.sync.originMap) {
        // 暂时只同步不存在
        if (this.sync.targetMap[key]) {
          // op = 'update'
          // targetData = this.sync.targetMap[key]['Data']
          // if (this.sync.originMap[key]['Data'] === targetData) {
          //   continue
          // }
          continue
        }
        this.sync.data.push({
          'key': key,
          'name': this.sync.originMap[key]['Name'],
          'type': this.sync.originMap[key]['Type'], // redis存储类型 1字符串 2哈希 3集合
          'subType': this.sync.originMap[key]['Subtype'], // 数值类型 1整型 2字符串
          'originData': this.sync.originMap[key]['Data'], // 源
          'targetData': ''
        })
      }
    },
    getTargetList() {
      request({
        url: '/customizeconfig/all/config',
        method: 'get',
        data: {
          item: this.sync.item,
          env: this.sync.env
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // 同步
          const objs = response.Data || {}
          this.sync.targetMap = {}
          for (const i in objs) {
            this.sync.targetMap[objs[i]['RedisSubkey']] = objs[i]
          }

          this.syncConfigMerge()
        } else {
          this.$message.error(response.Data)
        }
      })
    },
    getList() {
      getAllCustomizes(this.env).then(response => {
        const objs = response.Data || {}

        // 同步
        this.sync.originMap = {}
        this.sync.data = []
        for (const i in objs) {
          this.sync.originMap[objs[i]['RedisSubkey']] = objs[i]
        }
        this.getTargetList()

        this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
      })
    },
    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    initFormData(bEdit, ID) {
      this.edit.isEdit = bEdit
      if (ID) {
        const _data = this.clientDB.GetDataByID(ID)
        if (_data) {
          Object.assign(this.edit.item, _data)
          switch (this.edit.item.Type) {
            case 1:
              this.edit.val = this.edit.item.Data
              break
            case 2:
              this.edit.val = this.edit.item.Data
              this.edit.vals = []
              var obs = JSON.parse(this.edit.item.Data)
              for (const k1 in obs) {
                this.edit.vals.push({ k: k1, v: obs[k1] })
              }
              break
            case 3:
              this.edit.val = this.edit.item.Data
              this.edit.vals = []
              obs = JSON.parse(this.edit.item.Data)
              for (let j = 0; j < obs.length; j++) {
                const ob = obs[j]
                this.edit.vals.push({ v: ob })
              }
              break
          }

          if (bEdit) {
            this.edit.item.Env = this.env
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(_data)
          }
        }
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    typeChange() {
      if (this.edit.item.Type === 2) {
        this.edit.vals = [{ k: '', v: '' }]
      } else if (this.edit.item.Type === 3) {
        this.edit.vals = [{ v: '' }]
      }
    },
    AddHashValue() {
      this.edit.vals.push({ k: '', v: '' })
    },
    DelHashValue(idx) {
      this.edit.vals.splice(idx, 1)
    },
    AddSetValue() {
      this.edit.vals.push({ v: '' })
    },
    DelSetValue(idx) {
      this.edit.vals.splice(idx, 1)
    },
    test() {
      this.opType = 2
      this.publish()
    },
    pro() {
      this.opType = 6
      this.publish()
    },
    createSave(postData) {
      request({
        url: '/customizeconfig/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.AddData(response.Data)
          this.refreshShow()
          Message.success('保存成功！若要发布到redis，请点击发布。')
        }
      })
    },
    editSave(postData) {
      request({
        url: 'customizeconfig/update',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.UpdateData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！若要发布到redis，请点击发布。')
        }
      })
    },
    save() {
      switch (this.edit.item.Type) {
        case 1:
          this.edit.item.Data = this.edit.val
          break
        case 2:
          if (this.edit.writeType === 1) {
            this.edit.item.Data = this.edit.val
          } else {
            const tMap = {}
            for (let i = 0; i < this.edit.vals.length; i++) {
              const ob = this.edit.vals[i]
              tMap[ob.k] = ob.v
            }
            this.edit.item.Data = this.edit.val = JSON.stringify(tMap)
          }
          break
        case 3:
          if (this.edit.writeType === 1) {
            this.edit.item.Data = this.edit.val
          } else {
            const tMap = []
            for (let i = 0; i < this.edit.vals.length; i++) {
              const ob = this.edit.vals[i]
              tMap.push(ob.v + '')
            }
            this.edit.item.Data = this.edit.val = JSON.stringify(tMap)
          }
          break
      }

      this.edit.item.Env = this.env
      const $this = this
      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(this.edit.item)
        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          } else {
            $this.editSave($this.edit.item)
          }
        })
      } else {
        this.createSave(this.edit.item)
      }
    },
    publish() {
      request({
        url: '/customizeconfig/publish',
        method: 'post',
        data: {
          Env: this.env,
          recordID: this.edit.item.ID,
          opType: this.opType
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('发布成功！')
        }
      })
    }
  }
}
</script>
