<template>
  <div class="app-container">
    <el-row>
      <publish
        primary-key="id"
        key-id="PropsConfig"
        :env-empty="true"
        :make-content="makeContent"
        :attr-names="AttrNames"
        :head-attrs="['id']"
      />
    </el-row>
    <el-row style="padding: 20px 0 12px;">
      <el-form :model="form" label-width="100px" :inline="true" size="mini">
        <!-- <el-form-item label="道具类别：" :required="true">
          <el-select v-model="form.itemOfType" style="width: 200px;" placeholder="请选择道具分类">
            <el-option label="全部" :value="0" />
            <el-option
              v-for="item in itemTypeCfgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item> -->
        <el-button size="mini" type="primary" @click="selectPageData">查询</el-button>
        <el-button size="mini" type="success" icon="el-icon-plus" style="float: right;" @click="onCreateDistribution">批量发放</el-button>
      </el-form>

    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        border
        stripe
        :header-cell-style="libShow.DefaultTableHeadClass"
        :cell-style="libShow.TableCell(10)"
        style="width: 100%"
      >
        <el-table-column prop="id" label="道具ID" sortable width="100" />
        <el-table-column prop="item_name" label="道具名称" show-overflow-tooltip />
        <!-- <el-table-column prop="item_type" label="道具分类">
          <template slot-scope="scope">
            {{ getItemTypeName(scope.row.item_type) }}
          </template>
</el-table-column>

<el-table-column prop="image" label="ICON">
  <template slot-scope="{row}">
            <el-image
              style="width: 60px; height: 60px"
              :src="row.image"
              lazy
            />
          </template>
</el-table-column> -->
        <el-table-column prop="item_cost" label="道具价值" />

        <el-table-column prop="modifier" label="操作人" />

        <el-table-column prop="sort" label="排序" />

        <el-table-column fixed="right" width="250px" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" @click="onCreateDistribution(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status == 2" size="mini" type="danger" @click="handleDelete(scope.row.id, false)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="center">
      <div class="block">
        <el-pagination
          :current-page="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="limit"
          layout="slot, total, sizes, prev, next"
          prev-text="上一页"
          next-text="下一页"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <span class="pageSizeInput" style="padding-right: 10px">
            当前页：{{ page }}/{{ Math.ceil(total / limit) }}
          </span>
        </el-pagination>
      </div>
    </el-row>
    <!--对比组件-->
    <compare ref="compare" />

    <FormDialog :visible="editForm.visible" @close="onCloseFormDialog" />
  </div>

</template>
<script>
import store from '@/store'
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { $libDate, $libShow } from '@/utils/common'
import FormDialog from './components/FormDialog.vue'

export default {
  name: 'PropsConfig',
  components: { Compare, Publish, FormDialog },
  data() {
    return {
      libShow: $libShow,
      pickerOptions: $libShow.DefaultDatePickerOptions(),
      selectTime: [$libDate.GetDayBegin(new Date().setSeconds(0)), $libDate.GetDayEnd(new Date().setSeconds(0))],
      imagePickerVisible: false,

      raw: {},
      tableData: [],
      deleteData: [],
      limit: 10,
      total: 0,
      page: 1,
      form: {
        itemOfType: 0
      },
      editForm: {
        visible: false,
        data: {
          ID: 0,
          itemName: '',
          itemCost: 0,
          itemType: 0,
          describe: '',
          expireTime: '',
          image: '',
          sort: 0,
          status: 0,
          quality: 0,
          timeType: []
        },
        itemEndDate: $libDate.GetDayBegin(new Date().setSeconds(0))
      },

      AttrNames: {
        propName: '道具名称',
        propCost: '道具价值',
        propType: '道具分类',
        describe: '道具描述',
        image: 'ICON链接',
        expireTime: '过期时间',
        sort: '排序',
        propStatus: '上架状态',
        createTime: '创建时间',
        id: '道具ID',
        propExtra: '拓展信息'
      }
    }
  },
  created() {
    this.name = store.getters.name
    this.env = store.getters.env || this.env
  },
  mounted() {
    this.getList()
  },
  methods: {
    onCreateDistribution(data) {
      this.editForm.data = data
      this.editForm.visible = true
    },
    onCloseFormDialog() {
      this.editForm.visible = false
      this.editForm.data = null
    },
    getList() {
      request({
        url: '/propsconfig/props/config/list',
        method: 'get',
        data: {
          Env: this.env,
          PageNum: this.page,
          PageSize: this.limit,
          PropType: this.form.itemOfType
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          if (objs.total > 0) {
            this.tableData = []
            if (this.form.itemOfType === 0) {
              this.tableData = objs.list
              this.total = objs.total
            } else {
              let n = 0
              for (let i = 0; i < objs.list.length; i++) {
                if (objs.list[i].item_type === this.form.itemOfType) {
                  this.tableData.push(objs.list[i])
                  n++
                }
              }
              this.total = n
            }
            this.$refs.compare.SetOldVal(response.Data.Data)
          }
        } else {
          this.total = 0
          this.tableData = []
        }
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    makeContent(key, addData, delData, editData) {
      // console.log(key, JSON.stringify(addData), JSON.stringify(delData), JSON.stringify(editData))
      const change = new Set()
      const add = new Set()
      const del = new Set()
      // 新增取newVal
      if (addData) {
        console.log('addData', addData)
        for (var i = 0; i < addData.length; i++) {
          for (const ele of addData[i]) {
            add.add(ele.newVal)
          }
        }
      }
      if (delData) {
        console.log('delData', delData)
        for (let i = 0; i < delData.length; i++) {
          for (const ele of delData[i]) {
            del.add(ele.oldVal)
          }
        }
      }
      if (editData) {
        // console.log("editData",editData)
        for (const edit of editData) {
          change.add(edit.Head.id)
          console.log(edit.Head.id)
        }
      }
      if (change.size + del.size + add.size === 0) {
        console.log('no change return')
        return '没有修改!'
      }

      let str = ''
      let has = false
      for (let i = 0; i < this.tableData.length; i++) {
        const row = this.tableData[i]
        if (change.has(row.id)) {
          // console.log(JSON.stringify(row))
          has && (str += '\r\n---'); has = true
          str += `\r\n修改:ID:【${row.id}】, ${row.item_name}, ${this.getItemTypeName(row.item_type)}`
          str += `\r\n${this.getStatusName(row.status)} 价值:【${row.item_cost}】, ${new Date(row.expire_time * 1000).toLocaleString()}, ${row.image}`
        }
        if (add.has(row.id)) {
          // console.log(JSON.stringify(row))
          has && (str += '\r\n---\r\n'); has = true
          str += `\r\n新增:ID:【${row.id}】, ${row.item_name}, ${this.getItemTypeName(row.item_type)}`
          str += `\r\n${this.getStatusName(row.status)} 价值:【${row.item_cost}】, ${new Date(row.expire_time * 1000).toLocaleString()}, ${row.image}`
        }
      }
      for (let i = 0; i < this.deleteData.length; i++) {
        const row = this.deleteData[i]
        if (del.has(row.id)) {
          // console.log(JSON.stringify(row))
          has && (str += '\r\n---\r\n'); has = true
          str += `\r\n删除:ID:【${row.id}】, ${row.item_name}, ${this.getItemTypeName(row.item_type)}`
          str += `\r\n${this.getStatusName(row.status)} 价值:【${row.item_cost}】, ${new Date(row.expire_time * 1000).toLocaleString()}, ${row.image}`
        }
      }
      return str
    },
    formatNum(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    handleDelete(id) {
      this.$confirm('您确定要将该道具删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const newList = []
        const deleteList = []
        for (const key in this.editForm.tableData) {
          if (this.editForm.tableData[key].id === id) {
            continue
          }
          newList.push(this.editForm.tableData[key])
        }
        for (const key in this.tableData) {
          if (this.tableData[key].id === id) {
            deleteList.push(this.tableData[key])
          }
        }
        this.editForm.tableData = newList
        this.deleteData = deleteList
        request({
          url: '/propsconfig/props/config/delete',
          method: 'post',
          data: {
            Env: this.env,
            ID: id
          }
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('删除道具成功')
            this.getList()
          } else {
            Message.error('删除道具失败！')
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    selectPageData() {
      this.page = 1
      this.getList()
    },

    errmsg(txt) {
      this.$alert(txt, '', {
        type: 'error',
        center: true,
        showConfirmButton: false
      })
    },
    timeToSec(time) {
      var s = ''
      var hour = time.split(':')[0]
      var min = time.split(':')[1]
      var sec = time.split(':')[2]

      s = Number(hour * 3600) + Number(min * 60) + Number(sec)

      return s
    }
  }
}
</script>
