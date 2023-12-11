<template>
  <div class="app-container">
    <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :offset="3" :span="16">
        <el-button size="mini" type="success" @click="addRow">添加组合</el-button>
        <el-button size="mini" type="primary" @click="setData">保存</el-button>

        <el-row>
            <el-col :offset="12" span="2">
              <el-button size="mini" @click="clearFilter">清除过滤</el-button>
            </el-col>
            <el-col :span="6">
              <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"
                @input="searchChange"
              />
            </el-col>
        </el-row>
        <el-form ref="form" :model="form" label-width="150px">
          <el-table
            ref="filterTable"
            :data="tableData"
            stripe
            border
            style="padding:10px;width: 100%"
          >
            <el-table-column
              prop="index"
              width="50"
            />
            <el-table-column
              label="同桌"
              width="500"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.showStr" size="mini" @change="changeData(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button size="mini" @click="delRow(scope.row)">删除</el-button>
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
        </el-form>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Compare from '@/components/Compare'
import Publish from '@/components/Publish'
import request from '@/utils/request'
import { ClientTableData } from '@/utils/common'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Compare, Publish },
  data() {
    return {
      item: [{ 'UidList': [1008582, 1008623] }], // 奖励
      showData: [],
      clientDB: new ClientTableData([], 1, {}),
      tableData: [],
      form: {
      },
      txt: '',
      subKey: 'tongits_table_black_list'
    }
  },
  created() {
    this.getData()
    console.log(1)
  },
  methods: {
    searchChange() {
      this.clientDB.Search(this.search, ['showStr'])
      this.refreshShow()
    },
    // 筛选相关逻辑
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
    changeData(ob) {
      const uids = ob.showStr.split(',')
      const ret = []
      for (let i = 0; i < uids.length; i++) {
        const n = parseInt(uids[i])
        if (!n) {
          Message.error('数据内容错误！')
          return
        } else {
          ret.push(n)
        }
      }

      // 检查uid是否存在于别的组合中
      for (let i = 0; i < ret.length; i++) {
        for (let j = 0; j < this.showData.length; j++) {
          if (j == ob.index) {
            continue
          }
          for (let n = 0; n < this.showData[j].items.length; n++) {
            if (ret[i] == this.showData[j].items[n]) {
              Message.error(ret[i] + '已经存在于组合：' + (j + 1) + '中')
            }
          }
        }
      }
      ob.items = ret
    },
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    addRow() {
      this.showData.push({ index: this.showData.length, items: [], showStr: '' })
      this.refreshData()
    },
    delRow(item) {
      this.$confirm('确定要删除黑名单记录：Index:' + (item.index) + "，内容：" + item.showStr, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let delIdx = -1
        for(let i=0;i<this.showData.length;i++){
          if(this.showData[i].index == item.index){
            delIdx = i
          }
        }
        this.showData.splice(delIdx, 1)
        this.refreshData()
      })
    },
    getData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log('sign reward', response)
          this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '') {
            $this.item = JSON.parse(response.Data.Data)
            $this.showData = []
            for (let i = 0; i < $this.item.List.length; i++) {
              $this.showData.push({ index: i, items: $this.item.List[i].UidList, showStr: $this.item.List[i].UidList.join(',') })
            }
            $this.refreshData()
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
      })
    },
    refreshData() {
      this.clientDB = new ClientTableData(this.showData, 10, {}, 'index', 1)
      this.refreshShow()
    },
    setData() {
      const item = { List:[] }
      for (let i = 0; i < this.showData.length; i++) {
        item.List.push({ UidList: this.showData[i].items })
      }
      this.form.Data = JSON.stringify(item)
      const $this = this
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }

        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('sign reward save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>
