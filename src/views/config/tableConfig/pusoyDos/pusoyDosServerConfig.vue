<template>
  <div class="app-container">
    <el-row>
      <el-col :span="22" style="color:#BB0000;">
        <p><strong>注意事项：</strong></p>
        <p>1，底注不可直接修改，需要新添加新的场次配置，再去掉旧的场次配置；</p>
        <p>2，新加的场次需要保持在预上状态，重启游戏服务后才能上架；要去掉的场次需要先改为预下状态，延迟半天之后再下架；</p>
        <p>3，配置项【最大人数、桌子数量】修改后，需要重启游戏服务才能生效。</p>
        <p>4，是否启用班车要和排队入桌配置菜单保持一致。</p>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :span="24">
        <el-tabs type="border-card" value="common" @tab-click="handleTabClick">
          <el-tab-pane label="基座配置" name="common">
            <h3 style="text-align:center;color: red;">基座配置-游戏服启动时读取必要参数</h3>
            <pusoy-dos-table />
          </el-tab-pane>
          <el-tab-pane label="应用差异配置" name="different">
            <h3 style="text-align:center;color: red;">应用差异化配置，此配置会重写通用配置</h3>
            <pusoy-dos-table  ref="dosTableRef"/>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <!--对比组件-->
    <compare ref="compare" />

  </div>
</template>
<script>
    import PusoyDosTable from './pusoyDosTable.vue'
    export default {
        components: { PusoyDosTable },
        methods: {
          handleTabClick(tab) {
            if (tab.name === 'different') {
              console.log("aaa.....")
              // 或者传递参数
              this.$refs.dosTableRef.handleTabActivated({
                tabName: 'different',
                timestamp: new Date()
              })
            }
          }
        }
    }
</script>