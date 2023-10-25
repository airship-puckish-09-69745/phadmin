<template>
  <div style="padding-bottom: 20px">
    <el-col :span="2" :offset="10">
      <el-button type="primary" size="mini" icon="el-icon-refresh" @click="sortData()">排序</el-button>
    </el-col>

    <el-dialog
      title="数据排序"
      width="30%"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <table class="itxst">
        <draggable v-model="dItems" animation="500" force-fallback="true" handle=".move" @start="onStart" @end="onEnd">
          <tr v-for="item in dItems" :key="item.ID">
            <template v-if="item.ID=='ID'">
              <td style="width:50px">排序</td>
              <td style="width:50px">ID</td>
              <td style="width:250px">名称</td>
            </template>
            <template v-else>
              <td style="width:50px">{{ item.Sort }}</td>
              <td style="width:50px" class="move">{{ item.ID }}</td>
              <td style="width:250px" class="move">{{ item.Name }}</td>
            </template>
          </tr>
        </draggable>
      </table>
      <el-col :span="12" :offset="10">
        <el-button type="primary" size="medium" @click="saveSort">确定</el-button>
      </el-col>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import request from '@/utils/request'
import { Message } from 'element-ui'

export default {
  name: 'TableSort',
  components: { draggable },
  props: {
    items: {
      type: Array
    },
    onSuccess: {
      Type: Function
    },
    postData: {
      Type: Object,
      default: function() {
        return {}
      }
    },
    postUrl: {
      Type: String
    }
  },
  data() {
    return {
      visible: false,
      dItems: []
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    sortData() {
      this.dItems = [{ ID: 'ID' }].concat(this.items)
      this.visible = true
    },

    getPostData() {
      const obj = {}
      for (let i = 0; i < this.dItems.length; i++) {
        const ob = this.dItems[i]
        obj[ob.ID] = i
        this.dItems[i].Sort = i
      }

      this.postData['data'] = JSON.stringify(obj)
      return this.postData
    },

    saveSort() {
      const postData = this.getPostData()
      request({
        url: this.postUrl,
        method: 'post',
        data: postData
      }).then(response => {
        Message.success('修改排序成功！')
        this.onSuccess(this.dItems)
        this.visible = false
      })
    },
    onStart() {
      console.log(1)
    },
    // 拖拽结束事件
    onEnd() {
    }
  }
}
</script>
<style scoped>
/*定义要拖拽元素的样式*/
table.itxst {
  color: #333333;
  border: #ddd solid 1px;
  border-collapse: collapse;
}

table.itxst th {
  border: #ddd solid 1px;
  padding: 8px;
  background-color: #dedede;
}

table.itxst td {
  border: #ddd solid 1px;
  padding: 8px;
  background-color: #ffffff;
}

table.itxst tr {
  cursor: pointer;
}

table.itxst td.move:hover {
  cursor: move;
}
</style>
