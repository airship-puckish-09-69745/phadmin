<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row style="padding-top: 5px">
      <el-col :span="6">
        <el-input
          v-model="searchKeyword"
          size="mini"
          placeholder="输入玩家名称或ID搜索"
          clearable
          @clear="handleSearch"
        />
      </el-col>
      <el-col :span="2">
        <el-button size="mini" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-col>
      <el-col :span="6">
        <el-select v-model="filterStatus" size="mini" placeholder="筛选状态" clearable @change="getList">
          <el-option label="正常" :value="0" />
          <el-option label="已屏蔽" :value="1" />
        </el-select>
      </el-col>
      <el-col :span="10">
        <el-button type="success" size="mini" style="float: right" icon="el-icon-refresh" @click="getList">刷新</el-button>
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
        @sort-change="sortChange"
      >
        <el-table-column
          prop="userInfo.nick"
          label="玩家名称"
          align="center"
        />
        <el-table-column
          prop="userInfo.uid"
          label="玩家ID"
          align="center"
        />
        <el-table-column
          label="玩家头像"
          align="center"
        >
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.userInfo.avatar"
              :src="scope.row.userInfo.avatar"
              fit="cover"
              style="width: 50px; height: 50px; border-radius: 50%;"
              :preview-src-list="[scope.row.userInfo.avatar]"
            />
            <el-avatar v-else icon="el-icon-user-solid" />
          </template>
        </el-table-column>
        <el-table-column
          prop="userInfo.votesGot"
          label="玩家得票数量"
          sortable="custom"
          align="center"
        />
        <el-table-column
          prop="rank"
          label="玩家排名"
          sortable="custom"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              :type="getRankType(scope.row.rank)"
              size="medium"
            >
              {{ scope.row.rank }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="mini">
              {{ scope.row.status === 0 ? '正常' : '已屏蔽' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 0"
              size="mini"
              type="danger"
              icon="el-icon-lock"
              @click="handleBlock(scope.row)"
            >
              屏蔽
            </el-button>
            <el-button
              v-else
              size="mini"
              type="success"
              icon="el-icon-unlock"
              @click="handleUnblock(scope.row)"
            >
              解除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="16" :span="8">
        <div class="block">
          <el-pagination
            :current-page="clientDB.GetCurrentPage()"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="clientDB.GetPageNum()"
            :total="clientDB.GetTotalCount()"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="clientDB.OnPageSizeChange"
            @current-change="clientDB.OnPageNoChange"
          />
        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
import { $libShow, ClientTableData } from '@/utils/common'
import request from '@/utils/request'
import { Message } from 'element-ui'
import store from '@/store'

const filterMap = {}

export default {
  name: 'UserReview',
  data() {
    return {
      clientDB: new ClientTableData([], 10, filterMap, 'rank', 1, 'uid'),
      searchKeyword: '',
      filterStatus: 0,
      total: 0,
      loading: false,
      sortProp: '',
      sortOrder: '',
      actCfgId: 3,
      env: 'test'
    }
  },
  computed: {
    libShow() {
      return $libShow
    }
  },
  created() {
    this.getList()
    this.env = store.getters.env || this.env
  },
  methods: {
    getList() {
      if (this.filterStatus === 0) {
        this.getRanking()
      } else {
        this.getBlacklist()
      }
    },
    async getRanking() {
      this.loading = true
      try {
        const params = {
          Env: this.env,
          Path: '/activity/flower/festival/phase1/ranking',
          ActCfgId: this.actCfgId
        }

        const response = await request({
          url: '/dataProxy/info',
          method: 'get',
          params
        })

        if (response.RetCode === 0) {
          const rows = response.Data || []
          rows.forEach(item => {
            item.status = item.status || 0
          })
          this.total = rows.length || 0
          this.clientDB = new ClientTableData(rows, 10, filterMap, 'rank', 1, 'uid')
        } else {
          Message.error(response.Data || '获取数据失败')
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
        Message.error('获取数据失败')
        this.tableData = this.getMockData()
        this.total = this.tableData.length
      } finally {
        this.loading = false
      }
    },
    async getBlacklist() {
      this.loading = true
      try {
        const params = {
          Env: this.env,
          Path: '/activity/flower/festival/phase1/blacklist',
          ActCfgId: this.actCfgId
        }

        const response = await request({
          url: '/dataProxy/info',
          method: 'get',
          params
        })

        if (response.RetCode === 0) {
          const rows = response.Data || []
          rows.forEach(item => {
            item.status = item.status || 1
          })
          this.total = rows.length || 0
          this.clientDB = new ClientTableData(rows, 10, filterMap, 'rank', 1, 'uid')
        } else {
          Message.error(response.Data || '获取数据失败')
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
        Message.error('获取数据失败')
        this.tableData = this.getMockData()
        this.total = this.tableData.length
      } finally {
        this.loading = false
      }
    },
    getMockData() {
      return [
        {
          userInfo: {
            nick: '玩家001',
            uid: '100001',
            avatar: 'https://via.placeholder.com/50',
            votesGot: 1250
          },
          rank: 1,
          status: 0
        },
        {
          userInfo: {
            nick: '玩家002',
            uid: '100002',
            avatar: 'https://via.placeholder.com/50',
            votesGot: 980
          },
          rank: 2,
          status: 0
        },
        {
          userInfo: {
            nick: '玩家003',
            uid: '100003',
            avatar: 'https://via.placeholder.com/50',
            votesGot: 856
          },
          rank: 3,
          status: 1
        },
        {
          userInfo: {
            nick: '玩家004',
            uid: '100004',
            avatar: 'https://via.placeholder.com/50',
            votesGot: 723
          },
          rank: 4,
          status: 0
        },
        {
          userInfo: {
            nick: '玩家005',
            uid: '100005',
            avatar: 'https://via.placeholder.com/50',
            votesGot: 654
          },
          rank: 5,
          status: 0
        }
      ]
    },
    handleSearch() {
      if (!this.searchKeyword) {
        this.clientDB.ClearFilterMap()
        return
      }
      const params = ['userInfo.uid', 'userInfo.nick']
      this.clientDB.Search(this.searchKeyword, params)
    },
    sortChange({ prop, order }) {
      this.clientDB.SortByProp(prop, order)
    },
    async handleBlock(row) {
      try {
        await this.$confirm(`确认屏蔽玩家 ${row.userInfo.uid} 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const params = {
          Env: this.env,
          Path: '/activity/flower/festival/phase1/blacklist/add',
          ActCfgId: this.actCfgId,
          uid: row.userInfo.uid
        }

        const response = await request({
          url: '/dataProxy/info',
          method: 'post',
          params
        })

        if (response.RetCode === 0) {
          Message.success('屏蔽成功')
          await this.getList()
        } else {
          Message.error(response.Data || '屏蔽失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('屏蔽失败:', error)
          Message.error('屏蔽失败')
        }
      }
    },
    async handleUnblock(row) {
      try {
        await this.$confirm(`确认解除屏蔽玩家 ${row.userInfo.uid} 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const params = {
          Env: this.env,
          Path: '/activity/flower/festival/phase1/blacklist/remove',
          ActCfgId: this.actCfgId,
          uid: row.userInfo.uid
        }

        const response = await request({
          url: '/dataProxy/info',
          method: 'post',
          params
        })

        if (response.RetCode === 0) {
          Message.success('解除屏蔽成功')
          await this.getList()
        } else {
          Message.error(response.Data || '解除屏蔽失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('解除屏蔽失败:', error)
          Message.error('解除屏蔽失败')
        }
      }
    },
    getRankType(rank) {
      if (rank === 1) return 'danger'
      if (rank === 2) return 'warning'
      if (rank === 3) return 'success'
      return 'info'
    }
  }
}
</script>

<style scoped>
.block {
  margin-top: 20px;
  text-align: right;
}

.el-avatar {
  background-color: #f0f0f0;
  color: #999;
}
</style>
