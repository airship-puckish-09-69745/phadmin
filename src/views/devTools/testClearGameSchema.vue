<template>
  <div class="app-container">
    <el-form :model="searchForm" label-width="110px" :inline="true" size="small">
      <el-row>
        <el-form-item v-model="searchForm.gameId" label="游戏：" :required="true" label-width="80px">
          <el-select v-model="searchForm.gameId" filterable default-first-option placeholder="游戏筛选" size="large">
            <el-option
              v-for="row in games2"
              :label="row.name"
              :value="row.id"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label=" ">
          <el-button type="danger" size="mini" @click="clearGameSchema">清除</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import request from '@/utils/request'
import store from '@/store'
export default {
  name: 'TestClearGameSchema',
  data() {
    return {
      searchForm: {
        gameId: 22
      },
      games: {},
      games2: [
        { id: 0, name: 'All games' }
      ]
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.getSubGames()
  },
  methods: {
    formatNumber(n) {
      return n.toLocaleString()
    },
    getSubGames() {
      const $this = this
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          console.log('objs>>>>>', objs)
          for (let i = 0; i < response.Data.length; i++) {
            if (objs[i].ID === 13) {
              continue
            }
            $this.games[objs[i].Gid] = objs[i].Name
            const oneGame = {
              id: objs[i].Gid,
              name: objs[i].Name
            }
            $this.games2.push(oneGame)
          }
        }
      })
    },
    clearGameSchema() {
      if (this.searchForm.gameId <= 0) {
        this.$message.error('请选择要清除的游戏')
        return
      }
      const gameName = this.games[this.searchForm.gameId]
      const confirmMsg = '确定要清除 [' + gameName + '] 的监控数据吗？'
      this.$confirm(confirmMsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '数据拉取中，请稍候...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        request({
          url: '/dataProxy/info',
          method: 'post',
          data: {
            Env: this.env,
            gameId: this.searchForm.gameId,
            Path: '/other/test/clear/game/schema'
          }
        }).then(response => {
          loading.close()
          // console.log(response)
          if (response.RetCode === 0) {
            this.$message.success('清除成功')
          } else {
            this.$message.error(response.Data)
          }
        }).catch(function() {
          loading.close()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消【清除】操作'
        })
      })
    }
  }
}
</script>
