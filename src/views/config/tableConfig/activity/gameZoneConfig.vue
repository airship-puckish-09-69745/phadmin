<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="Object" />
    </el-row>

    <el-row>
      <br>
      <el-tabs type="border-card">
        <el-tab-pane label="gameZone活动配置">
          <el-row :gutter="5">
            <el-col :span="16">
              <el-form ref="item" label-width="220px">
                <el-col :span="12">
                  <el-form-item label="gameZone活动开关" :rules="dataRule(true,{type:'n',range:'0'})">
                    <el-switch v-model="item.IsOpen" :active-value="true" :inactive-value="false" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="gameZone活动图片URL：" :required="true">
                    <ImagePicker v-model="item.ImgUrl" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="gameZone支持的游戏ID：" :required="true">
                    <el-input
                      placeholder="输入关键字进行过滤"
                      v-model="filterTextZone">
                    </el-input>
                    <el-tree
                      :data="treeDataZone"
                      show-checkbox
                      node-key="id"
                      ref="treeGameZone"
                      highlight-current
                      :props="defaultPropsZone"
                      :filter-node-method="filterNodeZone"
                      @check-change="handleCheckChangeZone"
                    >
                    </el-tree>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
<!--        ///////////////////////////-->
        <el-tab-pane label="winMore配置">
          <el-row :gutter="5">
            <el-col :span="16">
              <el-form ref="item" label-width="220px">
                <el-col :span="12">
                  <el-form-item label="winMore开关" :rules="dataRule(true,{type:'n',range:'0'})">
                    <el-switch v-model="WinMoreItem.IsOpen" :active-value="true" :inactive-value="false" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="winMore图片URL：" :required="true">
                    <ImagePicker v-model="WinMoreItem.IconLink" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="winMore支持的游戏ID：" :required="true">
                    <el-input
                      placeholder="输入关键字进行过滤"
                      v-model="mayLikeFilterText">
                    </el-input>
                    <el-tree
                      :data="mayLikeTreeData"
                      show-checkbox
                      node-key="id"
                      ref="treeWinMore"
                      highlight-current
                      :props="mayLikeDefaultProps"
                      :filter-node-method="mayLikeFilterNode"
                      @check-change="handleCheckChangeWinMore"
                    >
                    </el-tree>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
<!--        /////////////////////////-->
        <el-tab-pane label="mayLike活动配置">
          <el-row :gutter="5">
            <el-col :span="16">
              <el-form ref="item" label-width="220px">
                <el-col :span="12">
                  <el-form-item label="mayLike活动开关" :rules="dataRule(true,{type:'n',range:'0'})">
                    <el-switch v-model="MayLikeItem.IsOpen" :active-value="true" :inactive-value="false" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="mayLike活动图片URL：" :required="true">
                    <ImagePicker v-model="MayLikeItem.IconLink" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate()">
              添加配置
            </el-button>
            <el-form ref="ProtectCfg" v-model="MayLikeGameList" label-width="150px" style="margin-top: 10px">
              <el-table
                :data="MayLikeGameList"
                border
                style="width: 100%"
                :cell-style="libShow.DefaultTableCell"
                @row-click="clickData"
              >
                <el-table-column
                  prop="Gid"
                  label="游戏id"
                  width="200"
                />
                <el-table-column
                  prop="IsOpen"
                  label="开关"
                  width="200"
                >
                  <template v-slot:default="scope">
                    <el-switch v-model="scope.row.IsOpen" :active-value="true" :inactive-value="false" :disabled=true />
                  </template>

                </el-table-column>
                <el-table-column
                  prop="GameIconLink"
                  label="游戏icon"
                  width="200"
                >
                  <template v-slot:default="scope">
                    <el-image src="scope.row.GameIconLink"></el-image>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="GameSort"
                  label="排序"
                  width="200"
                />
                <el-table-column
                  label="操作"
                  column-key="op"
                  width="250"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleEdit(scope.row)"
                    >编辑
                    </el-button>
                    <el-button
                      size="mini"
                      type="warning"
                      @click="handleDelete(scope.row)"
                    >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>

          </el-row>
        </el-tab-pane>
<!--        /////////////////////-->
        <el-tab-pane label="Favorites活动配置">
          <el-row :gutter="5">
            <el-col :span="16">
              <el-form ref="item" label-width="220px">
                <el-col :span="12">
                  <el-form-item label="Favorites活动开关" :rules="dataRule(true,{type:'n',range:'0'})">
                    <el-switch v-model="FavoritesItem.IsOpen" :active-value="true" :inactive-value="false" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="Favorites活动图片URL：" :required="true">
                    <ImagePicker v-model="FavoritesItem.IconLink" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
<!--        /////////////////////////-->
        <!--        /////////////////////////-->
        <el-tab-pane label="gameZone其他活动配置">
          <el-row :gutter="5">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreateOtherGameZone()">
              添加配置
            </el-button>
            <el-form ref="gameZoneOther" v-model="gameZoneOther" label-width="150px" style="margin-top: 10px">
              <el-table
                :data="gameZoneOther"
                border
                style="width: 100%"
                :cell-style="libShow.DefaultTableCell"
                @row-click="clickDataOtherGameZone"
              >
                <el-table-column
                  prop="Id"
                  label="活动id"
                  width="200"
                />
                <el-table-column
                  prop="IsOpen"
                  label="开关"
                  width="200"
                >
                  <template v-slot:default="scope">
                    <el-switch v-model="scope.row.IsOpen" :active-value="true" :inactive-value="false" :disabled=true />
                  </template>

                </el-table-column>
                <el-table-column
                  prop="IconLink"
                  label="活动icon"
                  width="200"
                >
                  <template v-slot:default="scope">
                    <el-image src="scope.row.IconLink"></el-image>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  column-key="op"
                  width="250"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleEditOtherGameZone(scope.row)"
                    >编辑
                    </el-button>
                    <el-button
                      size="mini"
                      type="warning"
                      @click="handleDeleteOtherGameZone(scope.row)"
                    >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>

          </el-row>
        </el-tab-pane>

        <el-tab-pane label="游戏内活动入口配置">
          <el-row :gutter="5">
            <el-col :span="16">
              <el-form ref="item" label-width="220px">
                <el-col :span="24">
                  <el-form-item label="活动入口开关：" :rules="dataRule(true,{type:'n',range:'0'})">
                    <el-switch v-model="item.GameEvent.IsOpen" :active-value="true" :inactive-value="false" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="活动入口图标：" :required="true">
                    <ImagePicker v-model="item.GameEvent.IconLink" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="支持的活动ID：" :required="true">
                    <el-select v-model="item.GameEvent.ActivityIds" multiple placeholder="请选择" style="width: 300px">
                      <el-option
                        v-for="item in activityOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <el-row>
        <br>
        <el-button type="primary" @click="setData">保存</el-button>
      </el-row>
    </el-row>

    <el-dialog
      :title="getEditTitle()"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit.item" :model="edit.item" label-width="250px" size="small">
        <el-form-item label="游戏id：" :required="true" prop="Gid">
          <el-col :span="15">
            <el-input v-model.number="edit.item.Gid" />
          </el-col>
        </el-form-item>

        <el-form-item label="游戏icon：" :required="true" prop="GameIconLink">
          <el-col :span="15">
            <ImagePicker v-model="edit.item.GameIconLink" />
          </el-col>
        </el-form-item>
        <el-form-item label="游戏排序：" :required="true" prop="GameSort">
          <el-col :span="15">
            <el-input v-model.number="edit.item.GameSort" />
          </el-col>
        </el-form-item>
        <el-form-item label="开关：" :required="true" prop="IsOpen">
          <el-col :span="15">
            <el-switch v-model="edit.item.IsOpen" :active-value="true" :inactive-value="false" />
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-row>
            <el-col :span="10" :offset="6">
              <el-button type="primary" size="medium" @click="save">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="getEditTitleOtherGameZone()"
      :visible.sync="editOtherGameZone.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="editOtherGameZone.item" :model="editOtherGameZone.item" label-width="250px" size="small">
        <el-form-item label="活动id：" :required="true" prop="Id">
          <el-col :span="15">
            <el-input v-model.number="editOtherGameZone.item.Id" />
          </el-col>
        </el-form-item>

        <el-form-item label="游戏icon：" :required="true" prop="IconLink">
          <el-col :span="15">
            <ImagePicker v-model="editOtherGameZone.item.IconLink" />
          </el-col>
        </el-form-item>
        <el-form-item label="开关：" :required="true" prop="IsOpen">
          <el-col :span="15">
            <el-switch v-model="editOtherGameZone.item.IsOpen" :active-value="true" :inactive-value="false" />
          </el-col>
        </el-form-item>
        <el-form-item label="支持游戏：" prop="GameList">
          <el-col :span="15">
<!--            TODO 此处设置tree-->
            <el-tree
              :data="treeDataOtherZone"
              show-checkbox
              node-key="id"
              ref="treeGameOtherZone"
              highlight-current
              :props="defaultPropsOtherZone"
              :filter-node-method="filterNodeOtherZone"
              @check-change="handleCheckChangeOtherZone"
            >
            </el-tree>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="10" :offset="6">
              <el-button type="primary" size="medium" @click="saveOtherGameZone">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>


    <!--对比组件-->
    <compare ref="compare" />
  </el-col>
</template>

<script>

import Publish from "@/components/Publish/index.vue";
import {$libShow, DataRule} from "@/utils/common";
import ImagePicker from "@/components/ImagePicker/ImagePicker.vue";
import {Message} from "element-ui";
import request from "@/utils/request";
import Compare from "@/components/Compare/index.vue";

function newItem() {
  return { Gid: 1, GameIconLink: '', GameSort: 1, IsOpen: true }
}
function newItemOtherGameZone() {
  return { Id: 1, IconLink: '', IsOpen: true, GameList: [] }
}
export default {
  components: {Compare, ImagePicker, Publish},
  watch: {
    filterTextZone(val) {
      this.$refs.treeGameZone.filter(val);
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    gameIdCfg(val) {

    }
  },
  data() {
    return {
      subKey: 'gameZone_cfg',
      libShow: $libShow,
      form: {
        Data: {}
      },
      edit: {
        visible: false,
        item: newItem(),
        isEdit: false
      },
      editOtherGameZone: {
        visible: false,
        item: newItemOtherGameZone(),
        isEdit: false
      },
      WinMoreItem: {
        Id: 2,
        IconLink: '',
        IsOpen: true,
        GameList: []
      },
      MayLikeItem: {
        Id: 3,
        IconLink: '',
        IsOpen: true,
        GameList: []
      },
      FavoritesItem: {
        Id: 4,
        IconLink: '',
        IsOpen: true,
        GameList: []
      },
      MayLikeGameList: [],
      item: {
        IsOpen: true,
        ImgUrl: '',
        GameList: [],
        GameZoneItem:[
          {
            Id: 2,
            IconLink: '',
            IsOpen: true,
            GameList: []
          }
        ],
        WinMoreItem:[
          {
            Id: 3,
            IconLink: '',
            IsOpen: true,
            GameList: []
          },
          {
            Id: 4,
            IconLink: '',
            IsOpen: true,
            GameList: []
          }
        ],
        MayLikeItem: [
          {
            Gid: 1,
            GameName: '',
            GameIconLink: '',
            GameSort: 1,
            IsOpen: true
          },
          {
            Gid: 2,
            GameName: '',
            GameIconLink: '',
            GameSort: 1,
            IsOpen: true
          }
        ],
        GameEvent: {
          IsOpen: true,
          IconLink: '',
          ActivityIds: []
        },
      },
      treeDataZone: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }],
      treeDataOtherZone: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }],
      mayLikeTreeData: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }],
      filterTextZone: '',
      mayLikeFilterText: '',
      defaultPropsZone: {
        label: 'label',
        children: 'children',
        disabled: 'disabled'
      },
      defaultPropsOtherZone: {
        label: 'label',
        children: 'children',
        disabled: 'disabled'
      },
      mayLikeDefaultProps: {
        label: 'label',
        children: 'children',
        disabled: 'disabled'
      },
      gameZoneOther:[],
      gameZoneOtherGameList:[],
      activityOptions: [
        { label: '圣诞摇钱树-[7]', value: 7 },
        { label: 'Poker乐园-[8]', value: 8 },
      ]
    }
  },
  created() {
    this.getData()
    this.getGameAll()
    this.getMaylikeGameAll()
    this.getOtherGameZoneAll()
    console.log(1)
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    filterNodeZone(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    filterNodeOtherZone(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    mayLikeFilterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getGameAll() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objsZone = response.Data || []
          const dataZone = {}
          for (let i = 0; i < objsZone.length; i++) {
            const objZone = objsZone[i]
            if (objZone.ShowDatacenter !== 1) {
              continue
            }

            const gameZone = {Gid: objZone.Gid, Name: objZone.Name, Description: objZone.Description}
            if (dataZone.hasOwnProperty(objZone.CategoryID)) {
              dataZone[objZone.CategoryID].push(gameZone)
            } else {
              dataZone[objZone.CategoryID] = [gameZone]
            }
          }

          this.treeDataZone = []
          const categoriesZone = {1: 'Slot', 2: 'Poker', 3: 'Casino'}

          for (const keyZone in dataZone) {
            const gamesZone = dataZone[keyZone]
            const ctyZone = {id: 'p-' + keyZone, label: categoriesZone[keyZone], children: []}

            for (let i = 0; i < gamesZone.length; i++) {
              const gameZone = gamesZone[i]
              ctyZone.children.push({id: gameZone.Gid, label: gameZone.Name})
            }
            this.treeDataZone.push(ctyZone)
          }

          console.log('getGameAll ', this.item.GameList)
          this.$refs.treeGameZone.setCheckedKeys(this.item.GameList)
          console.log('getGameAll ', this.treeDataZone)
        }
      })
    },
    getOtherGameZoneAll() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objsOtherZone = response.Data || []
          const dataOtherZone = {}
          for (let i = 0; i < objsOtherZone.length; i++) {
            const objOtherZone = objsOtherZone[i]
            if (objOtherZone.ShowDatacenter !== 1) {
              continue
            }

            const gameZoneOther = {Gid: objOtherZone.Gid, Name: objOtherZone.Name, Description: objOtherZone.Description}
            if (dataOtherZone.hasOwnProperty(objOtherZone.CategoryID)) {
              dataOtherZone[objOtherZone.CategoryID].push(gameZoneOther)
            } else {
              dataOtherZone[objOtherZone.CategoryID] = [gameZoneOther]
            }
          }

          this.treeDataOtherZone = []
          const categoriesZoneOther = {1: 'Slot', 2: 'Poker', 3: 'Casino'}

          for (const keyZoneOther in dataOtherZone) {
            const gamesZoneOther = dataOtherZone[keyZoneOther]
            const ctyZoneOther = {id: 'p-' + keyZoneOther, label: categoriesZoneOther[keyZoneOther], children: []}

            for (let i = 0; i < gamesZoneOther.length; i++) {
              const gameZoneOther = gamesZoneOther[i]
              ctyZoneOther.children.push({id: gameZoneOther.Gid, label: gameZoneOther.Name})
            }
            this.treeDataOtherZone.push(ctyZoneOther)
          }

          // console.log('getGameAll ', this.item.GameList)
          // this.$refs.treeGameZone.setCheckedKeys(this.item.GameList)
          // console.log('getGameAll ', this.treeDataZone)
        }
      })
    },
    getMaylikeGameAll() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          const data = {}
          for (let i = 0; i < objs.length; i++) {
            const obj = objs[i]
            if (obj.ShowDatacenter !== 1) {
              continue
            }

            const game = {Gid: obj.Gid, Name: obj.Name, Description: obj.Description}
            if (data.hasOwnProperty(obj.CategoryID)) {
              data[obj.CategoryID].push(game)
            } else {
              data[obj.CategoryID] = [game]
            }
          }

          this.mayLikeTreeData = []
          const categories = {1: 'Slot', 2: 'Poker', 3: 'Casino'}

          for (const key in data) {
            const games = data[key]
            const cty = {id: 'p-' + key, label: categories[key], children: []}

            for (let i = 0; i < games.length; i++) {
              const game = games[i]
              cty.children.push({id: game.Gid, label: game.Name})
            }
            this.mayLikeTreeData.push(cty)
          }
          console.log("=================")
          console.log(this.WinMoreItem.GameList)
          this.$refs.treeWinMore.setCheckedKeys(this.WinMoreItem.GameList)
          console.log(this.mayLikeTreeData)
          console.log("=================")
        }
      })
    },
    handleCheckChangeZone(data, checked, indeterminate) {
      const nodesZone = this.$refs.treeGameZone.getCheckedNodes()

      this.item.GameList = []

      for (let i = 0; i < nodesZone.length; i++) {
        const nodeZone = nodesZone[i]
        if (nodeZone.label === 'Slot' || nodeZone.label === 'Poker' || nodeZone.label === 'Casino') {
          continue
        }
        this.item.GameList.push(nodeZone.id)
      }

      console.log(this.item.GameList)
    },
    handleCheckChangeOtherZone(data, checked, indeterminate) {
      const nodesZone = this.$refs.treeGameOtherZone.getCheckedNodes()

      this.gameZoneOtherGameList = []

      for (let i = 0; i < nodesZone.length; i++) {
        const nodeZone = nodesZone[i]
        if (nodeZone.label === 'Slot' || nodeZone.label === 'Poker' || nodeZone.label === 'Casino') {
          continue
        }
        this.gameZoneOtherGameList.push(nodeZone.id)
      }
    },
    handleCheckChangeWinMore(data, checked, indeterminate) {
      const nodes = this.$refs.treeWinMore.getCheckedNodes()

      this.WinMoreItem.GameList = []

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (node.label === 'Slot' || node.label === 'Poker' || node.label === 'Casino') {
          continue
        }
        this.WinMoreItem.GameList.push(node.id)
      }

      console.log(this.WinMoreItem.GameList)
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
          console.log('gameZone', response.Data)
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            $this.item = JSON.parse(response.Data.Data)
            const old = JSON.parse(response.Data.Data)
            this.item.GameZoneItem.forEach(value => {
              if (value.Id === 2) {
                this.WinMoreItem = value
              } else {
                this.gameZoneOther.push(value)
              }
            })
            this.item.WinMoreItem.forEach(value => {
              if (value.Id === 3) {
                this.MayLikeItem = value
              }
              if (value.Id === 4) {
                this.FavoritesItem = value
              }
            })
            this.MayLikeGameList = this.item.MayLikeItem
            this.$refs.compare.SetOldVal(old)
          }
        }
      })
    },
    handleCreate() {
      this.edit.item = newItem()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    handleCreateOtherGameZone() {
      this.editOtherGameZone.item = newItemOtherGameZone()
      this.editOtherGameZone.isEdit = false
      this.editOtherGameZone.visible = true
    },
    getEditTitle() {
      this.isDisabled = this.edit.isEdit
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    getEditTitleOtherGameZone() {
      this.isDisabled = this.edit.isEdit
      return this.edit.isEdit ? '修改活动配置' : '新增活动配置'
    },
    // 操作类函数
    clickData(row, column, event) {
      this.edit.visible = true
      this.edit.isEdit = true
    },
    clickDataOtherGameZone(row, column, event) {
      this.editOtherGameZone.visible = true
      this.editOtherGameZone.isEdit = true
    },
    handleEdit(ob) {
      this.initFormData(true, ob.Gid)
      this.edit.visible = true
    },
    handleEditOtherGameZone(ob) {
      this.initFormDataOtherGameZone(true, ob.Id)
      this.editOtherGameZone.visible = true
    },
    save() {
      const newData = JSON.parse(JSON.stringify(this.edit.item))
      const index = this.MayLikeGameList.findIndex(item => item.Gid === this.edit.item.Gid)
      if (this.edit.isEdit) {
        this.MayLikeGameList.splice(index, 1, newData)
      } else {
        // 如果是新增，检查是否有重复的档次
        if (index >= 0) {
          this.$alert(`[已存在，不能重复添加`, '提示', {type:'warning'})
          return
        }
        // 新增到
        this.MayLikeGameList.push(newData)
        // 按档次金额排序
        this.MayLikeGameList.sort((a, b) => {
          return a.GameSort - b.GameSort
        })
      }

      this.edit.visible = false
      this.edit.isEdit = false
    },
    saveOtherGameZone() {
      this.editOtherGameZone.item.GameList = this.gameZoneOtherGameList
      const newData = JSON.parse(JSON.stringify(this.editOtherGameZone.item))
      const index = this.gameZoneOther.findIndex(item => item.Id === this.editOtherGameZone.item.Id)
      if (this.editOtherGameZone.isEdit) {
        this.gameZoneOther.splice(index, 1, newData)
      } else {
        // 如果是新增，检查是否有重复的档次
        if (index >= 0) {
          this.$alert(`[已存在，不能重复添加`, '提示', {type:'warning'})
          return
        }
        // 新增到
        this.gameZoneOther.push(newData)
      }
      this.gameZoneOtherGameList = []
      this.$refs.treeGameOtherZone.setCheckedKeys([])
      this.editOtherGameZone.visible = false
      this.editOtherGameZone.isEdit = false
    },
    initFormData(bEdit, gid) {
      this.edit.isEdit = bEdit
      if (gid) {
        const _data = this.getDataByGid(gid)
        if (_data) {
          Object.assign(this.edit.item, _data)
        }
      }
    },
    initFormDataOtherGameZone(bEdit, id) {
      this.editOtherGameZone.isEdit = bEdit
      if (id) {
        const _data = this.getOtherGameZoneDataByGid(id)
        if (_data) {
          Object.assign(this.editOtherGameZone.item, _data)
          this.gameZoneOtherGameList = this.editOtherGameZone.item.GameList
          this.$refs.treeGameOtherZone.setCheckedKeys(this.editOtherGameZone.item.GameList)
        }
      }
    },
    getDataByGid(gid) {
      for (let i = 0; i < this.MayLikeGameList.length; i++) {
        const data = this.MayLikeGameList[i]
        if (data.Gid === gid) {
          return data
        }
      }
      return null
    },
    getOtherGameZoneDataByGid(id) {
      for (let i = 0; i < this.gameZoneOther.length; i++) {
        const data = this.gameZoneOther[i]
        if (data.Id === id) {
          return data
        }
      }
      return null
    },
    handleDelete(ob) {
      let $this = this
      this.$confirm('是否确认删除?', '提示', {type:'warning'}).then(() => {
        const delIndex = $this.MayLikeGameList.findIndex(item => item.Gid === ob.Gid)
        this.MayLikeGameList.splice(delIndex, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    handleDeleteOtherGameZone(ob) {
      let $this = this
      this.$confirm('是否确认删除?', '提示', {type:'warning'}).then(() => {
        const delIndex = $this.gameZoneOther.findIndex(item => item.Id === ob.Id)
        this.gameZoneOther.splice(delIndex, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    encodeData() {
      const cpy = {}
      Object.assign(cpy, this.item)
      // const index = this.item.GameZoneItem.findIndex(item => item.Id === 2)
      // cpy.GameZoneItem.splice(index, 1, this.WinMoreItem)
      const MayLikeIndex = this.item.WinMoreItem.findIndex(item => item.Id === 3)
      cpy.WinMoreItem.splice(MayLikeIndex, 1, this.MayLikeItem)
      const FavoritesIndex = this.item.WinMoreItem.findIndex(item => item.Id === 4)
      cpy.WinMoreItem.splice(FavoritesIndex, 1, this.FavoritesItem)
      cpy.MayLikeItem = this.MayLikeGameList
      cpy.GameZoneItem = []
      cpy.GameZoneItem.push(this.WinMoreItem)
      for (const o in this.gameZoneOther) {
        cpy.GameZoneItem.push(this.gameZoneOther[o])
      }
      return JSON.stringify(cpy)
    },
    setData() {
      this.form.Data = this.encodeData()
      console.log('setData', this.form.Data)
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
            console.log('save', response)
            Message.success('保存成功')
          }
        })
      })
    }
  }
}
</script>

<style>

</style>
