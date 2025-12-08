/**
 * 比赛操作 Mixin
 * 负责增删改查等业务操作
 */
import { Message, MessageBox } from 'element-ui'
import request from '@/utils/request'

export const matchActionMixin = {
  methods: {
    /**
     * 编辑比赛
     */
    handleEdit(row) {
      this.showEditDialog(row.id)
    },

    /**
     * 删除比赛
     */
    async handleDelete(id) {
      try {
        await MessageBox.confirm(
          '确定要删除这条记录吗?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )

        await this.deleteMatch(id)
      } catch (error) {
        if (error === 'cancel') {
          return false
        }
        // 删除确认错误
        return false
      }
    },

    /**
     * 删除比赛API调用
     */
    async deleteMatch(id) {
      try {

        const response = await request({
          url: '/matchconfig/match/config/delete',
          method: 'POST',
          data: {
            Env: this.$store.getters.env,
            Id: id
          }
        })

        if (response.RetCode === 0) {
          Message.success('删除比赛配置成功！')
          const env = this.$store.getters.env
          await this.getMatchList(env)
          return true
        } else {
          Message.error('删除比赛配置失败：' + response.Data)
          return false
        }
      } catch (error) {
        Message.error('删除比赛时发生错误: ' + error.message)
        return false
      }
    },

    /**
     * 复制比赛
     */
    async handleCopy(id) {
      try {
        await MessageBox.confirm(
          '确定要复制吗？',
          '提醒',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }
        )

        const response = await request({
          url: '/matchconfig/match/config/copy',
          method: 'POST',
          data: {
            Env: this.$store.getters.env,
            Id: id
          }
        })

        if (response.RetCode === 0) {
          Message.success('复制比赛配置成功！')
          const env = this.$store.getters.env
          await this.getMatchList(env)
          this.handleSetCopyExtr(id)
          return true
        } else {
          Message.error('复制比赛配置失败：' + response.Data)
          return false
        }
      } catch (error) {
        if (error !== 'cancel') {
          Message.error('复制比赛时发生错误: ' + error.message)
        }
        return false
      }
    },

    /**
     * 更新比赛状态
     */
    async handleUpdateStatus(id, status) {
      try {
        // 如果传入的是对象，提取id和status
        if (typeof id === 'object') {
          const row = id
          id = row.id || row.Id
          status = row.openShow === 0 ? 1 : 0
        }

        if (status === 1) {
          // 上架
          await MessageBox.confirm(
            '您确定要将该比赛配置上架吗？<span style="color: red;">会立即创建比赛</span>',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              type: 'warning'
            }
          )
        } else {
          // 下架
          await MessageBox.confirm(
            '您确定要将该比赛配置下架吗？<span style="color: red;">会对已显示的比赛下架，并且该配置不会再创建新比赛</span>',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              type: 'warning'
            }
          )
        }

        await this.updateMatchStatus(id, status)
      } catch (error) {
        if (error !== 'cancel') {
          Message.error('更新状态时发生错误: ' + error.message)
        }
        return false
      }
    },

    /**
     * 更新比赛状态API调用
     */
    async updateMatchStatus(id, status) {
      try {

        const response = await request({
          url: '/matchconfig/match/config/status',
          method: 'POST',
          data: {
            Env: this.$store.getters.env,
            Id: id,
            Status: status ? 0 : 1
          }
        })

        if (response.RetCode === 0) {
          const showMsg = status ? '上架赛事配置成功！' : '下架赛事配置成功！'
          Message.success(showMsg)

          // 更新本地数据
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].id == id) {
              this.tableData[i].openShow = status
              this.tableData[i].status = status ? 0 : 1
              break
            }
          }

          // 刷新列表
          const env = this.$store.getters.env
          await this.getMatchList(env)
          return true
        } else {
          Message.error('更新状态失败：' + response.Data)
          return false
        }
      } catch (error) {
        Message.error('更新状态时发生错误: ' + error.message)
        return false
      }
    },

    /**
     * 添加比赛
     */
    handleAddMatch() {
      this.showEditDialog()
    },

    /**
     * 显示/隐藏开发工具
     */
    handleShowDevTools() {
      this.showDevTool = !this.showDevTool
    },

    /**
     * 复制所有比赛
     */
    handleCopyAll() {
      Message.success('复制成功')
    },

    /**
     * 过期所有比赛
     */
    handleExpireAll() {
      this.$confirm('您确定要将今天之前的比赛下架吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: '/matchconfig/match/config/status/all',
          method: 'post',
          data: {}
        }).then(response => {
          if (response.RetCode === 0) {
            Message.success('下架今天之前比赛配置成功！')
            const env = this.$store.getters.env
            this.getMatchList(env)
          } else {
            Message.error('下架今天之前比赛配置失败！')
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },

    /**
     * 删除所有离线比赛
     */
    async handleDeleteAllOff() {
      try {
        await MessageBox.confirm(
          '您确定要清理所有已下架的比赛配置吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )

        const response = await request({
          url: '/matchconfig/match/config/delete/alloff',
          method: 'POST',
          data: {
            Gid:2033,
          }
        })

        if (response.RetCode === 0) {
          Message.success('清理已下架的比赛配置成功！')
          const env = this.$store.getters.env
          await this.getMatchList(env)
          return true
        } else {
          Message.error('清理已下架的比赛配置失败！' + response.Data)
          return false
        }
      } catch (error) {
        if (error !== 'cancel') {
          Message.error('清理下架时发生错误: ' + error.message)
        }
        return false
      }
    },

    /**
     * 搜索处理
     */
    async handleSearch() {
      this.page = 1
      const env = this.$store.getters.env
      await this.getMatchList(env)
    },

    /**
     * 重置搜索
     */
    async handleResetSearch() {
      this.searchForm = {
        gameId: this.$options.data().searchForm.gameId,
        status: -1,
        csId: -1,
        repeatType: -1,
        appId: -1
      }
      this.page = 1
      const env = this.$store.getters.env
      await this.getMatchList(env)
    },

    /**
     * 分页变化
     */
    async handlePageChange(page) {
      this.page = page
      const env = this.$store.getters.env
      await this.getMatchList(env)
    },

    /**
     * 每页条数变化
     */
    async handleSizeChange(size) {
      this.limit = size
      this.page = 1
      const env = this.$store.getters.env
      await this.getMatchList(env)
    },

    /**
     * 保存处理
     */
    async handleSave() {
      const env = this.$store.getters.env
      const success = await this.saveMatch(env)
      if (success) {
        await this.getMatchList(env)
      }
    },

    /**
     * 关闭编辑
     */
    handleCloseEdit() {
      this.closeEditDialog()
    }
  }
}
