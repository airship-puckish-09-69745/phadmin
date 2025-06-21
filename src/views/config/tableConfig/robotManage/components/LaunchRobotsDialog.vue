<!-- 确定投放机器人的弹窗 -->
<template>
  <el-dialog title="投放至" :visible.sync="visible" width="380px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="游戏" :label-position="labelPosition">
        <el-select v-model="form.games" multiple placeholder="请选择游戏" :options="gameOptions" />
      </el-form-item>
      <el-form-item label="场次" :label-position="labelPosition">
        <el-select v-model="form.sessions" multiple placeholder="请选择场次" :options="sessionOptions" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        games: [],
        sessions: []
      },
      gameOptions: [
        {
          Label: '游戏1',
          Value: '1'
        }
      ],
      sessionOptions: [
        {
          Label: '场次1',
          Value: '1'
        }
      ]
    }
  }
}
</script>
