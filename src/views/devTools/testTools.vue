<template>
  <div class="app-container">
    <el-row :gutter="5" style="margin-top: 30px">
      <fieldset style="margin-top:10px">
        <legend>添加身份</legend>
        <el-form :inline="true" ref="trustTestForm" :model="trustTestForm">
          <el-form-item label="Uid">
            <el-input placeholder="请输入内容" v-model.number="trustTestForm.Uid" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="Gid">
            <el-select placeholder="请输入内容" v-model.number="trustTestForm.Gid" size="mini">
              <el-option
                v-for="item in trustTestGame"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份">
            <el-select placeholder="请输入内容" v-model.number="trustTestForm.Identity" size="mini">
              <el-option
                v-for="item in trustTestIdentity"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="addTrustTest()">添加</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="filterTable"
          :data="trustTestData"
          stripe
          border
          :row-style="{height:'10px'}"
          style="width: 80%;"
        >
          <el-table-column prop="uid" label="Uid"/>
          <el-table-column prop="gid" label="游戏">
            <template slot-scope="scope">{{ getTrustGame(scope.row.gid) }}</template>
          </el-table-column>
          <el-table-column prop="identity" label="身份">
            <template slot-scope="scope">{{ getTrustIndentity(scope.row.identity) }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="delTrustTest(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </fieldset>
    </el-row>
    <el-row :gutter="5" style="margin-top: 30px">
      <fieldset style="margin-top:10px">
        <legend>对比身份</legend>
        <el-form :inline="true" ref="trustTestForm" :model="trustTestForm">
          <el-form-item label="Uid">
            <el-input placeholder="请输入内容" v-model.number="trustTestForm.Uid" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="Gid">
            <el-select placeholder="请输入内容" v-model.number="trustTestForm.Gid" size="mini">
              <el-option
                v-for="item in trustTestGame"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="疑似分加减">
            <el-input v-model.number="trustTestForm.CheatScore" size="mini" placeholder="正加负减"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="addCheatScore(trustTestForm.Uid,trustTestForm.Gid,trustTestForm.CheatScore)">提交</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="filterTable"
          :data="trustUserData"
          stripe
          border
          :row-style="{height:'10px'}"
          style="width: 80%;"
        >
          <el-table-column prop="uid" label="Uid"/>
          <el-table-column prop="gid" label="游戏">
            <template slot-scope="scope">{{ getTrustGame(scope.row.gid) }}</template>
          </el-table-column>
          <el-table-column prop="cheatType" label="防作弊系统身份">
            <template slot-scope="scope">{{ getCheatIndentity(scope.row.cheatType) }}</template>
          </el-table-column>
          <el-table-column prop="cheatScore" label="防作弊系统疑似分">
          </el-table-column>
          <el-table-column prop="trustType" label="信任分系统身份">
            <template slot-scope="scope">{{ getTrustIndentity(scope.row.trustType) }}</template>
          </el-table-column>
          <el-table-column prop="trustScore" label="信任分系统信任分">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="addCheatScore(scope.row.uid,scope.row.gid,0)">刷新</el-button>
            </template>
          </el-table-column>
        </el-table>
      </fieldset>
    </el-row>
  </div>
</template>
<script>
import request from '@/utils/request'
import store from '@/store'
export default {
  name: 'TestKyc',
  data() {
    return {
      item: {},
      trustTestData: [],
      trustUserData: [],
      trustTestForm: {
        Uid: 0,
        Gid: 22,
        Identity: 4,
        CheatScore: 0,
      },
      trustTestGame: [
        {value: 22, label: 'Tongits'},
        {value: 21, label: 'Pusoy'}
      ],
      trustTestIdentity: [
        {value: 1, label: '低危用户'},
        {value: 2, label: '疑似用户'},
        {value: 3, label: '黑子用户'},
        {value: 4, label: '低信用户'},
        {value: 5, label: '高信用户'},
      ],
      trustCheatIdentity: [
        {value: 0, label: '普通用户'},
        {value: 1, label: '疑似用户'},
        {value: 2, label: '黑子用户'},
      ]
    }
  },
  computed: {},
  created() {
    this.env = store.getters.env || this.env
    this.getTrustTest()
  },
  methods: {
    formatNumber(n) {
      return n.toLocaleString()
    },
    getTrustGame(gid) {
      for (const v of this.trustTestGame) {
        if (gid == v.value) {
          return v.label
        }
      }
      return "no"
    },
    getCheatIndentity(identity) {
      for (const v of this.trustCheatIdentity) {
        if (identity == v.value) {
          return v.label
        }
      }
      return "no"
    },
    getTrustIndentity(identity) {
      for (const v of this.trustTestIdentity) {
        if (identity == v.value) {
          return v.label
        }
      }
      return "no"
    },
    getTrustTest() {
      if (this.env != 'test') {
        return
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: $this.env,
          Path: '/tools/trust/test'
        }
      }).then(response => {
        console.log(JSON.stringify(response))
        if (response.RetCode === 0) {
          $this.trustTestData = response.Data
          for (const v of response.Data) {
            console.log(v)
            v.inc = 0
          }
        }
      })
    },
    addTrustTest() {
      if (this.env != 'test') {
        return
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: $this.env,
          Uid: $this.trustTestForm.Uid,
          Gid: $this.trustTestForm.Gid,
          Identity: $this.trustTestForm.Identity,
          Path: '/tools/trust/test/add'
        }
      }).then(response => {
        console.log(JSON.stringify(response))
        if (response.RetCode === 0) {
          console.log(response.Msg)
          $this.$message.success("添加成功")
          $this.getTrustTest()
        }
      })
    },
    delTrustTest(row) {
      if (this.env != 'test') {
        return
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: $this.env,
          Uid: row.uid,
          Gid: row.gid,
          Identity: row.identity,
          Path: '/tools/trust/test/del'
        }
      }).then(response => {
        console.log(JSON.stringify(response))
        if (response.RetCode === 0) {
          $this.$message.success("删除成功")
          $this.getTrustTest()
        }
      })
    },
    addCheatScore(uid,gid,cheatScore) {
      if (this.env != 'test') {
        return
      }
      const $this = this
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: $this.env,
          Path: '/user/cheat/score/add',
          Uid: uid,
          Gid: gid,
          Score: cheatScore,
        }
      }).then(response => {
        console.log('update tag ', response)
        if (response.RetCode === 0) {
          let update = false
          for (let i = 0; i < $this.trustUserData.length; i++) {
            if ($this.trustUserData[i].uid===response.Data.uid && $this.trustUserData[i].gid===response.Data.gid) {
              $this.trustUserData[i].cheatType = response.Data.cheatType
              $this.trustUserData[i].cheatScore = response.Data.cheatScore
              $this.trustUserData[i].trustType = response.Data.trustType
              $this.trustUserData[i].trustScore = response.Data.trustScore
              update = true
              break
            }
          }
          if (!update) {
            $this.trustUserData.push(response.Data)
          }
        } else {
          $this.$message.error('更新失败')
        }
      })
    }
  }
}
</script>
