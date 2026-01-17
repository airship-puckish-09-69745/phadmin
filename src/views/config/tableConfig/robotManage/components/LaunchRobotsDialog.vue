<!-- 确定投放机器人的弹窗 -->
<template>
  <el-dialog title="投放至" :visible.sync="dialogVisible" width="380px" center>
    <el-form ref="formRef" :model="form" label-width="70px">
      <el-form-item label="游戏" required>
        <el-select v-model="form.game" placeholder="请选择游戏" @change="handleGameChange">
          <el-option v-for="item in gameOptions" :key="item.gid" :label="item.gameName" :value="item.gid" />
        </el-select>
      </el-form-item>
      <el-form-item label="场次" required>
        <el-select v-model="form.session" placeholder="请选择场次" :options="sessionOptions" @focus="handleSessionFocus">
          <el-option v-for="item in sessionOptions" :key="item" :label="item / 1000" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <span style="color: red">已选择机器人数量：{{ selectedRobots.length }}</span>
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    gameOptions: {
      type: Array,
      default: () => []
    },
    selectedRobots: {
      type: Array,
      default: () => []
    },
    appID: {
      type: Number,
      default: () => 0
    },
  },
  data() {
    return {
      form: {
        game: '',
        session: ''
      },
      // 从gameOptions中获取
      sessionOptions: []
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('close', val)
      }
    }
  },
  methods: {
    /**
     * 选择场次之前必须先选择游戏
     */
    handleSessionFocus() {
      if (!this.form.game) {
        this.$message({
          message: '请先选择游戏',
          type: 'warning'
        })
        return
      }
    },
    checkoutForm() {
      if (!this.form.game) {
        this.$message({
          message: '请选择游戏',
          type: 'warning'
        })
        return false
      }
      if (!this.form.session) {
        this.$message({
          message: '请选择场次',
          type: 'warning'
        })
        return false
      }
      return true
    },
    handleGameChange(gid) {
      this.sessionOptions = []
      this.form.session = ''
      const seletedGame = this.gameOptions.find(game => game.gid === gid)
      if (seletedGame) {
        this.sessionOptions = seletedGame.sessions
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
    /**
     * 投放机器人
     */
    onSubmit() {
      if (!this.checkoutForm()) {
        return
      }

      const uids = this.selectedRobots.map(robot => robot.uid).join(',')
      request({
        url: '/dataProxy/info',
        method: 'POST',
        data: {
          Env: this.env,
          Path: '/usercommonrobot/issue',
          uids,
          gid: this.form.game,
          session: this.form.session,
          appId: this.appID
        }
      }).then(response => {
        if (response.RetCode === 0) {
          // console.log(response.Data)
          this.$message({
            message: '投放成功',
            type: 'success'
          })
          this.handleClose()
          this.$emit('reload-list')
        }
      })
    }
  }
}
</script>
