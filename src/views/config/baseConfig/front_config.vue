<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="FrontConfig" :env-empty="true" :attr-names="AttrNames" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-form :model="form" label-width="100px" :inline="true">
        <el-form-item label="应用：">
          <el-select v-model="form.app" placeholder="请选择" size="medium">
            <el-option
              v-for="app in appInfo"
              :label="app.name"
              :value="app.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getInfo">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown @command="handleAdd">
            <el-button type="success">
              添加操作<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="ap">AP</el-dropdown-item>
              <el-dropdown-item command="process">Process</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item>
          <el-dropdown @command="handleDel">
            <el-button type="warning">
              删除操作<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="ap">AP</el-dropdown-item>
              <el-dropdown-item command="process">Process</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </el-row>
    <div style="padding-top: 10px">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="App"
          label="App"
          width="180"
        />
        <el-table-column
          prop="Ap"
          label="Ap"
          width="180"
        />
        <el-table-column
          prop="Process"
          label="Process"
        />
      </el-table>
    </div>
    <el-dialog
      title="添加AP"
      :visible.sync="addApVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="apAddItem" label-width="150px" size="small">
        <el-row>
          <el-col :span="11">
            <el-form-item label="Ap名称：">
              <el-input v-model="apAddItem.Name" placeholder="请输入，如不填则使用AP-x.x.x.x" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="Ap IP：">
              <el-input v-model="apAddItem.IP" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="addAp">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" :attr-names="AttrNames" />
  </div>
</template>
<script>
import { $libShow } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'

export default {
  components: { Compare, Publish },
  data() {
    return {
      appInfo: [],
      aps: [],
      tableData: [],
      libShow: $libShow,
      form: {
        app: ''
      },
      addApVisible: false,
      apAddItem: {
        Name: '',
        IP: ''
      },

      AttrNames: {
        Sort: '排序',
        ItemID: '物品ID',
        Count: '数量',
        Name: '商品名称',
        Type: `商品类型`,
        Price: '价格',
        BonusRate: 'Bonus比例',
        PlatformItemID: '平台ID',
        IsRecommend: '商城推荐位',
        ShowScene: '展示场景',
        SceneRecommend: '场景推荐位'
      }

    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getAppInfo()
  },
  methods: {
    getInfo() {
      console.log('form', this.form)
    },
    // 操作类函数
    handleAdd(command) {
      if (command == 'ap') {
        this.addApVisible = true
        this.apAddItem = {
          Name: '',
          IP: ''
        }
      } else {

      }
    },
    addAp() {
      this.addApVisible = false
    },
    handleDel(command) {
      console.log('del command', command)
    },
    getAppInfo() {
      request({
        url: '/appinfo/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          // { 1: '审核中', 2: '通过未推广', 3: '未通过下架', 4: '推广中', 5: '推广后下架' }
          const sortInfo = ['', 4, 1, 3, 5, 2] // 定义排序规则
          for (let i = 0; i < objs.length; i++) {
            this.appInfo.push(
              {
                'name': objs[i].AppName + '-' + objs[i].AppID,
                'id': objs[i].AppID
              }
            )
            objs[i]['Platform'] = parseInt(objs[i].AppID) > 100000 ? 2 : 1
          }
          this.appInfo.sort(function(a, b) {
            return sortInfo[a.Status] - sortInfo[b.Status]
          })
        }
      })
    }
  }
}
</script>
