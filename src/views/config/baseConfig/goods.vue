<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" key-id="GoodsConfig" :env-empty="true" :attr-names="AttrNames" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="2">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加配置项
        </el-button>
      </el-col>
      <el-col :span="4" :offset="10">
        <TableSort :items="dragItems" :on-success="sortSucc" post-url="/goods/update/sort" />
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <div style="padding-top: 10px">
      <el-table
        ref="filterTable"
        :data="tableData"
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
          prop="Sort"
          label="排序"
          sortable
          width="80"
        />
        <el-table-column
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
          prop="Name"
          label="名称"
          min-width="150"
        />
        <el-table-column
          prop="ItemID"
          label="物品"
          sortable="custom"
          width="100"
        >
          <template slot-scope="scope">
            {{ getItemName(scope.row.ItemID) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Count"
          label="数量"
          width="150"
        />
        <el-table-column
          prop="Price"
          label="价格"
          width="100"
        />
        <el-table-column
          prop="BonusRate"
          label="Bonus比例"
          width="100"
        />
        <el-table-column
          prop="IsRecommend"
          label="是否推荐"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.IsRecommend === 1 ? '是' : '否' }}
          </template>
        </el-table-column>

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
        <el-table-column
          prop="Status"
          label="状态"
          width="100"
        >
          <template v-slot:header>
            <el-select v-model="clientDB.FilterValueMap['Status']" size="mini" @change="handleFilter">
              <el-option label="状态" :value="0" />
              <el-option v-for="(o,key) in clientDB.FilterMap['Status']" :key="key" :label="o" :value="key" />
            </el-select>
          </template>
          <template slot-scope="scope">
            {{ clientDB.GetShowValue('Status', scope.row.Status) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-document-copy"
              @click="handleCopy(scope.row)"
            >复制
            </el-button>
            <el-button
              v-if="scope.row.Status!=2"
              size="mini"
              type="success"
              icon="el-icon-upload2"
              @click="handlePrepare(scope.row)"
            >上架
            </el-button>
            <el-button
              v-if="scope.row.Status!=2"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            />
            <el-button
              v-if="scope.row.Status==2"
              size="mini"
              type="danger"
              icon="el-icon-download"
              @click="handleOffline(scope.row)"
            >下架
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetPage().GetCurrentPage()"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="clientDB.GetPage().GetPageNum()"
            layout="total, sizes, prev, pager, next, jumper"
            :total="clientDB.GetPage().GetTotalCount()"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </div>
    <el-dialog
      :title="getEditTitle()"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="edit" label-width="150px" size="small">
        <el-row>
          <el-col :span="11">
            <el-form-item label="商品名称：" :required="true" prop="item.Name" :rules="dataRule(true,{type:'s',range:'2'})">
              <el-input v-model="edit.item.Name" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="商品类型："
              :required="true"
              prop="item.Type"
            >
              <el-select v-model.number="edit.item.Type" placeholder="请选择">
                <el-option label="金币" :value="1" />
                <el-option label="首充金币" :value="2" />
                <el-option label="月卡" :value="10" />
                <el-option label="签到商品" :value="12" />
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="物品ID："
              :required="true"
              prop="item.ItemID"
              :rules="dataRule(true,{type:'n',range:'1'})"
            >
              <el-select v-model="edit.item.ItemID" size="mini" filterable>
                <el-option v-for="o in items" :key="o.ID" :value="o.ID" :label="o.Name">
                  <span style="float: left">{{ o.ID }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ o.Name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="物品数量：" :required="true" prop="item.Count" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.Count" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="价格：" :required="true" prop="item.Price" :rules="dataRule(true,{type:'n',range:'1'})">
              <el-input v-model.number="edit.item.Price" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="商城推荐位：">
              <el-radio v-model="edit.item.IsRecommend" :label="1" border size="mini">推荐</el-radio>
              <el-radio v-model="edit.item.IsRecommend" :label="0" border size="mini">不推荐</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="Bonus比例：" prop="item.BonusRate" :rules="dataRule(true,{type:'n',range:'0-200'})">
              <el-col :span="16">
                <el-input v-model.number="edit.item.BonusRate" placeholder="请输入"><template slot="append">%</template></el-input>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item label="展示场景：" prop="item.ShowScene">
              <el-select v-model="edit.item.ShowScene2" multiple placeholder="请选择">
                <el-option label="add" :value="1" />
                <el-option label="add cash" :value="2" />
                <el-option label="sell" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="场景推荐位：" prop="item.ShowScene">
              <el-select v-model="edit.item.SceneRecommend2" multiple placeholder="请选择">
                <el-option label="add" :value="1" />
                <el-option label="add cash" :value="2" />
                <el-option label="sell" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
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
import { $libDate, $libShow, ClientTableData, DataRule } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import TableSort from '@/components/TableSort'
import SelectGoods from '@/components/SelectGoods'

const filterMap = {
  'Status': { 1: '草稿', 2: '上架', 3: '废弃', 6: '下架' },
  'Type': { 1: '金币', 2: '首充金币', 10: '月卡', 12: '签到商品' }
}

function newItem() {
  return {
    ID: '',
    App: 1,
    PayChannel: 1,
    Os: 1,
    Sort: 1,
    ItemID: '',
    Count: '',
    Name: '',
    Type: '',
    Icon: '',
    Price: '',
    PlatformItemID: '',
    BuyGiveCount: 0,
    Blacklist: '',
    FirstBuyCount: 0,
    IsRecommend: 0,
    BonusRate: 0,
    ShowScene: '',
    ShowScene2: [],
    SceneRecommend: '',
    SceneRecommend2: []
  }
}

export default {
  components: { Compare, Publish, TableSort, SelectGoods },
  data() {
    return {
      tableData: [],
      clientDB: new ClientTableData([], 1, filterMap),
      search: '',
      libShow: $libShow,
      env: 'test',
      items: [],
      dragItems: [],

      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
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
    this.getList()
    this.getItems()
    console.log(1)
  },
  methods: {
    sortSucc(items) {
      for (const o in items) {
        this.clientDB.UpdateData(items[o])
      }
    },
    initDragItems() {
      this.dragItems = []
      for (const i in this.clientDB.TotalData) {
        const ob = this.clientDB.TotalData[i]
        if (ob.Status === 2) {
          this.dragItems.push({ ID: ob.ID, Sort: ob.Sort, Name: ob.Name })
        }
      }
      this.dragItems.sort(function(a, b) {
        return a.Sort - b.Sort
      })
    },
    getItemName(id) {
      for (const i in this.items) {
        if (this.items[i].ID === id) {
          return this.items[i].Name
        }
      }
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter() {
      this.clientDB.FilterData()
      this.refreshShow()
    },
    // 分页处理
    refreshShow() {
      this.tableData = this.clientDB.GetCurrentPageData()
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },

    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    // 操作类函数
    clickData(row, column, event) {
      if (column.columnKey !== 'op') {
        this.initFormData(true, row.ID)
        console.log('edit item', this.edit.item)
        console.log(this.edit.item.ShowScene2)
        this.edit.visible = true
      }
    },

    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    handleCopy(ob) {
      this.initFormData(false, ob.ID)
      this.edit.visible = true
    },
    getItems() {
      request({
        url: '/item/all',
        method: 'get',
        data: {
          Status: 2
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.items = response.Data || []
          this.items.sort(function(a, b) {
            return b.ID - a.ID
          })
        }
      })
    },
    getList() {
      request({
        url: '/goods/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          for (const i in objs) {
            if (objs[i].ShowScene) {
              objs[i].ShowScene2 = JSON.parse(objs[i].ShowScene)
            } else {
              objs[i].ShowScene2 = []
            }
            if (objs[i].SceneRecommend) {
              objs[i].SceneRecommend2 = JSON.parse(objs[i].SceneRecommend)
            } else {
              objs[i].SceneRecommend2 = []
            }
          }
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
          this.initDragItems()
        }
      })
    },
    handlePrepare(ob) {
      this.changeStatus(ob.ID, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handleOffline(ob) {
      this.changeStatus(ob.ID, 6, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleDelete(ob) {
      this.changeStatus(ob.ID, 3, '您确定要将记录状态修改为废弃吗？')
    },
    changeStatus(id, status, msg) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/goods/update/status',
          method: 'post',
          data: {
            ID: id,
            status: status
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('修改记录状态成功！')
            this.clientDB.UpdateData({ ID: id, Status: status })
          }
        })
      }).catch(() => {
        console.log('取消')
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
        console.log('_data', _data)

        if (_data) {
          Object.assign(this.edit.item, _data)

          if (bEdit) {
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(_data)
          }
        }
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    createSave(postData) {
      request({
        url: '/goods/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.AddData(response.Data)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    editSave(postData) {
      request({
        url: 'goods/update',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.UpdateData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    save() {
      if (this.edit.item.ShowScene2.length > 0) {
        this.edit.item.ShowScene = JSON.stringify(this.edit.item.ShowScene2)
      } else {
        this.edit.item.ShowScene = ''
      }
      if (this.edit.item.SceneRecommend2.length > 0) {
        this.edit.item.SceneRecommend = JSON.stringify(this.edit.item.SceneRecommend2)
      } else {
        this.edit.item.SceneRecommend = ''
      }

      if (this.edit.isEdit) {
        // 设置修改后数据
        this.$refs.compare.SetNewVal(this.edit.item)
        const $this = this
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
      this.edit.visible = false
    }
  }
}
</script>
