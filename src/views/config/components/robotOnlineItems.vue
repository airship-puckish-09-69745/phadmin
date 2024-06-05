
<template>
<div>
    <el-descriptions class="margin-top" border>
      <el-descriptions-item>
        <span style="color:red;">以下配置,在两个时段机器人数目标替换时,缺补:[50,∞)[2,5]; [30,50)[1,3]; [10,30)[1,2]; (0,10)[0.5,1]  多退:[50,∞)[2,3]; [20,50)[1,2]; (0,20)[0.5,1]</span>
      </el-descriptions-item>
    </el-descriptions>
  <el-button type="primary" icon="el-icon-edit" size="mini" @click="addRobotNumForm()">添加</el-button>
    <el-table
        ref="filterTable"
        :data="items"
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
    >
      <el-table-column type="index" />
      <el-table-column label="时间段" prop="TimeTitle">
        <template slot-scope="scope">
          [{{ scope.row.StartHour }},{{ scope.row.EndHour }}]
        </template>
      </el-table-column>
      <el-table-column label="机器人数下限" prop="MinRobotNum">
        <template slot-scope="scope">
          {{ scope.row.MinRobotNum }}
        </template>
      </el-table-column>
      <el-table-column label="机器人数上限" prop="MaxRobotNum">
        <template slot-scope="scope">
          {{ scope.row.MaxRobotNum }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="normal" icon="el-icon-edit" size="mini" @click="showRobotNumForm(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

  <!-- 【dialog】编辑机器人人数 -->
  <el-dialog
    title="编辑机器人人数"
    :modal="false"
    :visible.sync="robotDialogForm.visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="robotForm" :model="robotDialogForm.data" label-width="200px">
      <el-form-item label="序号：">
        {{ robotDialogForm.data.Index }}
      </el-form-item>
      <el-form-item label="开始时段：">
        <el-input v-model.number="robotDialogForm.data.StartHour" disable style="width: 100px;" size="mini" :required="true" />
      </el-form-item>
      <el-form-item label="结束时段：">
        <el-input v-model.number="robotDialogForm.data.EndHour" disable style="width: 100px;" size="mini" :required="true" />
      </el-form-item>
      <el-form-item label="机器人最小人数：">
        <el-input v-model.number="robotDialogForm.data.MinRobotNum" style="width: 100px;" size="mini" :required="true" />
      </el-form-item>
      <el-form-item label="机器人最大人数：">
        <el-input v-model.number="robotDialogForm.data.MaxRobotNum" style="width: 100px;" size="mini" :required="true" />
      </el-form-item>
      <el-form-item>
        <el-button style="margin-bottom:10px;" type="primary" size="mini" @click="saveRobotDialog()">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</div>
</template>


<script>

import { $libShow } from '@/utils/common'
import { Message } from 'element-ui'

export default {
  // eslint-disable-next-line vue/no-unused-components
  name: 'RobotOnlineItems',
  components: {},
  props: {
    items: {
      type: Array,
      default: function() {
        return []
      }
    }
  },

  data() {
    return {
      libShow: $libShow,
      robotDialogForm: {
        visible: false,
        data: {}
      },
    }
  },

  watch: {
    'items': {
      deep: true,
      handler: function(val) {
        this.initData(val)
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
    },
    saveRobotDialog() {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].Index == this.robotDialogForm.data.Index) {
          this.items[i] = this.robotDialogForm.data
          break
        }
      }
      this.robotDialogForm.visible = false
    },
    showRobotNumForm(data) {
      this.robotDialogForm.data = data
      this.robotDialogForm.visible = true
    },
    addRobotNumForm() {
      let maxId = 0
      for (const o of this.items) {
        if (o.Index > maxId) {
          maxId = o.Index
        }
      }
      this.items.push({
        Index: maxId + 1,
        StartHour: 0,
        EndHour: 0,
        MinRobotNum: 0,
        MaxRobotNum: 0
      })
    },
  }
}
</script>
