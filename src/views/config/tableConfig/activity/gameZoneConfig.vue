<template>
  <el-col class="app-container">
    <el-row>
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" :on-compare="onCompare" />
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
                      v-model="filterTextZone"
                      placeholder="输入关键字进行过滤"
                    />
                    <el-tree
                      ref="treeGameZone"
                      :data="treeDataZone"
                      show-checkbox
                      node-key="id"
                      highlight-current
                      :props="defaultPropsZone"
                      :filter-node-method="filterNodeZone"
                      @check-change="handleCheckChangeZone"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="支持的APPID：" :required="true">
                    <el-select v-model="item.AppIds" multiple placeholder="请选择" style="width: 300px">
                      <el-option
                        v-for="item in appidInfoCfgs"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="11">
                  <el-form-item label="支持的SiteId：" :required="true">
                    <SiteSelect v-model="item.SiteIdList" multiple placeholder="请选择" style="width: 400px" />
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
                      v-model="mayLikeFilterText"
                      placeholder="输入关键字进行过滤"
                    />
                    <el-tree
                      ref="treeWinMore"
                      :data="mayLikeTreeData"
                      show-checkbox
                      node-key="id"
                      highlight-current
                      :props="mayLikeDefaultProps"
                      :filter-node-method="mayLikeFilterNode"
                      @check-change="handleCheckChangeWinMore"
                    />
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
                  label="游戏名称"
                  width="200"
                >
                  <template slot-scope="scope">
                    {{ showGameName(1,scope.row.Gid) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="IsOpen"
                  label="开关"
                  width="200"
                >
                  <template v-slot:default="scope">
                    <el-switch v-model="scope.row.IsOpen" :active-value="true" :inactive-value="false" :disabled="true" />
                  </template>

                </el-table-column>
                <!--                <el-table-column-->
                <!--                  prop="GameIconLink"-->
                <!--                  label="游戏icon"-->
                <!--                  width="200"-->
                <!--                >-->
                <!--                  <template v-slot:default="scope">-->
                <!--                    <ImagePicker v-model="scope.row.GameIconLink" />-->
                <!--                  </template>-->
                <!--                </el-table-column>-->
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
                  label="活动名称"
                  width="200"
                >
                  <template slot-scope="scope">
                    {{ showGameName(2,scope.row.Id) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="IsOpen"
                  label="开关"
                  width="200"
                >
                  <template v-slot:default="scope">
                    <el-switch v-model="scope.row.IsOpen" :active-value="true" :inactive-value="false" :disabled="true" />
                  </template>

                </el-table-column>
                <el-table-column
                  prop="IconLink"
                  label="活动icon"
                  width="200"
                >
                  <template v-slot:default="scope">
                    <!--                    <el-image src="scope.row.IconLink"></el-image>-->
                    <ImagePicker v-model="scope.row.IconLink" />
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

        <el-tab-pane v-if="item.GameEvent != null" label="游戏内活动入口配置">
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
                <el-col :span="24">
                  <el-form-item label="支持的APPID：" :required="true">
                    <el-select v-model="item.GameEvent.AppIds" multiple placeholder="请选择" style="width: 300px">
                      <el-option
                        v-for="item in appidInfoCfgs"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="支持的SiteId：" :required="true">
                    <SiteSelect v-model="item.GameEvent.SiteIdList" multiple placeholder="请选择" style="width: 400px" />
                  </el-form-item>
                </el-col>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!--///////////////////////////////////-->

        <!--        <el-tab-pane label="大厅选场配置">-->
        <!--          <el-row :gutter="5">-->
        <!--            <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreateHallGames()">-->
        <!--              添加配置-->
        <!--            </el-button>-->
        <!--            <el-form ref="hallGame" v-model="hallGame" label-width="150px" style="margin-top: 10px">-->
        <!--              <el-table-->
        <!--                :data="hallGame"-->
        <!--                border-->
        <!--                style="width: 100%"-->
        <!--                :cell-style="libShow.DefaultTableCell"-->
        <!--                @row-click="clickDataHallGame"-->
        <!--              >-->
        <!--                <el-table-column-->
        <!--                  prop="Gid"-->
        <!--                  label="游戏名称"-->
        <!--                  width="200"-->
        <!--                >-->
        <!--                  <template slot-scope="scope">-->
        <!--                    {{ showGameName(1,scope.row.Gid) }}-->
        <!--                  </template>-->
        <!--                </el-table-column>-->
        <!--                <el-table-column-->
        <!--                  prop="IsOpen"-->
        <!--                  label="开关"-->
        <!--                  width="200"-->
        <!--                >-->
        <!--                  <template v-slot:default="scope">-->
        <!--                    <el-switch v-model="scope.row.IsOpen" :active-value="true" :inactive-value="false" :disabled="true" />-->
        <!--                  </template>-->

        <!--                </el-table-column>-->
        <!--                <el-table-column-->
        <!--                  prop="IconLink"-->
        <!--                  label="游戏icon"-->
        <!--                  width="200"-->
        <!--                >-->
        <!--                  <template v-slot:default="scope">-->
        <!--                    <ImagePicker v-model="scope.row.IconLink" />-->
        <!--                  </template>-->
        <!--                </el-table-column>-->
        <!--                <el-table-column-->
        <!--                  prop="GameSort"-->
        <!--                  label="排序"-->
        <!--                  width="200"-->
        <!--                />-->
        <!--                <el-table-column-->
        <!--                  label="操作"-->
        <!--                  column-key="op"-->
        <!--                  width="250"-->
        <!--                >-->
        <!--                  <template slot-scope="scope">-->
        <!--                    <el-button-->
        <!--                      type="primary"-->
        <!--                      size="mini"-->
        <!--                      @click="handleEditHallGame(scope.row)"-->
        <!--                    >编辑-->
        <!--                    </el-button>-->
        <!--                    <el-button-->
        <!--                      size="mini"-->
        <!--                      type="warning"-->
        <!--                      @click="handleDeleteHallGame(scope.row)"-->
        <!--                    >删除-->
        <!--                    </el-button>-->
        <!--                  </template>-->
        <!--                </el-table-column>-->
        <!--              </el-table>-->
        <!--            </el-form>-->

        <!--          </el-row>-->
        <!--        </el-tab-pane>-->
        <!--        ///////////////////////////////-->
        <el-tab-pane label="侧拉栏游戏推荐">
          <el-row :gutter="5">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreateZoneGame()">
              添加配置
            </el-button>
            <el-form ref="zoneGame" v-model="zoneGame" label-width="150px" style="margin-top: 10px">
              <el-table
                :data="zoneGame"
                border
                style="width: 100%"
                :cell-style="libShow.DefaultTableCell"
                @row-click="clickDataZoneGame"
              >
                <el-table-column
                  prop="Desc"
                  label="描述"
                  width="200"
                />
                <el-table-column
                  prop="Gid"
                  label="游戏"
                  width="200"
                >
                  <template v-slot:default="scope">
                    <el-checkbox-group v-model="scope.row.Gids" size="medium" disabled>
                      <el-checkbox-button v-for="game in scope.row.Gids" :key="game" :label="game">{{ showGameName(1,game) }}</el-checkbox-button>
                    </el-checkbox-group>
                  </template>
                </el-table-column>
                <el-table-column
                  label="推荐游戏"
                  width="500"
                >
                  <template v-slot:default="scope">
                    <el-checkbox-group v-model="scope.row.Games" size="medium" disabled>
                      <el-checkbox-button v-for="game in scope.row.Games" :key="game.Gid" :label="game.Gid">{{ showGameName(1,game.Gid) }}</el-checkbox-button>
                    </el-checkbox-group>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="IsOpen"
                  label="开关"
                  width="200"
                >
                  <template v-slot:default="scope">
                    <el-switch v-model="scope.row.IsOpen" :active-value="true" :inactive-value="false" :disabled="true" />
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
                      @click="handleEditZoneGame(scope.row)"
                    >编辑
                    </el-button>
                    <el-button
                      size="mini"
                      type="warning"
                      @click="handleDeleteZoneGame(scope.row)"
                    >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>

          </el-row>
        </el-tab-pane>
        <!--
        <el-tab-pane v-if="whitelistCfg != null" label="白名单配置">
          <el-form ref="item" label-width="220px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="AppId白名单：" :required="true">
                <el-select v-model="whitelistCfg.AppIdList" multiple placeholder="请选择" style="width: 400px">
                  <el-option
                    v-for="item in appidInfoCfgs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="SiteId白名单：" :required="true">
                <el-select v-model="whitelistCfg.SiteIdList" multiple placeholder="请选择" style="width: 400px">
                  <el-option
                    v-for="item in channelIdCfgs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          </el-form>
        </el-tab-pane>
        -->
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
            <!--            <el-input v-model.number="edit.item.Gid" />-->
            <template>
              <el-select v-model.number="edit.item.Gid" placeholder="请选择">
                <el-option
                  v-for="item in gameSelect"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

            </template>
          </el-col>
        </el-form-item>

        <!--        <el-form-item label="游戏icon：" :required="true" prop="GameIconLink">-->
        <!--          <el-col :span="15">-->
        <!--            <ImagePicker v-model="edit.item.GameIconLink" />-->
        <!--          </el-col>-->
        <!--        </el-form-item>-->
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
            <!--            <el-input v-model.number="editOtherGameZone.item.Id" />-->
            <el-select v-model.number="editOtherGameZone.item.Id" placeholder="请选择">
              <el-option
                v-for="item in activitySelect"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
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
              ref="treeGameOtherZone"
              :data="treeDataOtherZone"
              show-checkbox
              node-key="id"
              highlight-current
              :props="defaultPropsOtherZone"
              :filter-node-method="filterNodeOtherZone"
              @check-change="handleCheckChangeOtherZone"
            />
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

    <el-dialog
      :title="getEditTitleHallGame()"
      :visible.sync="editHallGame.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="editHallGame.item" :model="editHallGame.item" label-width="250px" size="small">
        <el-form-item label="大厅选择游戏：" :required="true" prop="Gid">
          <el-col :span="15">
            <el-select ref="editHallGameSelect" v-model.number="editHallGame.item.Gid" placeholder="请选择">
              <el-option
                v-for="itemHallGame in gameSelect"
                :key="itemHallGame.id"
                :label="itemHallGame.name"
                :value="itemHallGame.id"
              />
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="游戏icon：" :required="true" prop="IconLink">
          <el-col :span="15">
            <ImagePicker v-model="editHallGame.item.IconLink" />
          </el-col>
        </el-form-item>
        <el-form-item label="开关：" :required="true" prop="IsOpen">
          <el-col :span="15">
            <el-switch v-model="editHallGame.item.IsOpen" :active-value="true" :inactive-value="false" />
          </el-col>
        </el-form-item>
        <el-form-item label="排序：" :required="true" prop="GameSort">
          <el-col :span="15">
            <el-input v-model.number="editHallGame.item.GameSort" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="10" :offset="6">
              <el-button type="primary" size="medium" @click="saveHallGame">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="getEditTitleHallGame()"
      :visible.sync="editZoneGame.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="editZoneGame.item" :model="editZoneGame.item" label-width="250px" size="small">

        <el-form-item label="appID：" :required="true" prop="AppId">
          <el-radio-group v-model="editZoneGame.item.AppId">
            <el-radio v-for="appInfo in appidInfoCfgs" :key="appInfo.value" :label="appInfo.value">{{ appInfo.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="channelID：" :required="true" prop="ChannelId">
          <el-checkbox-group v-model="editZoneGame.item.ChannelId">
            <el-checkbox v-for="channelInfo in channelIdCfgs" :key="channelInfo.value" :label="channelInfo.value">{{ channelInfo.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          prop="Desc"
          label="描述"
          width="100"
        >
          <el-input v-model="editZoneGame.item.Desc" />
        </el-form-item>
        <el-form-item label="游戏：" :required="true" prop="Gids">
          <el-col :span="15">
            <el-select v-model="editZoneGame.item.Gids" style="width: 500px;" popper-class="custom-dropdown1" multiple placeholder="请选择" @change="changeZoneGameGids">
              <el-option
                v-for="itemZoneGame in gameSelect"
                :key="itemZoneGame.id"
                :label="itemZoneGame.name"
                :value="itemZoneGame.id"
              />
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="开关：" :required="true" prop="IsOpen">
          <el-switch v-model="editZoneGame.item.IsOpen" :active-value="true" :inactive-value="false" />
        </el-form-item>
        <el-form-item>
          <el-button @click="addZoneGame">新增推荐游戏</el-button>
        </el-form-item>
        <el-form-item label="推荐游戏列表：">
          <el-table
            :data="editZoneGame.item.Games"
            :row-style="rowStyle"
            border
            max-height="600"
            style="width: 100%"
            :cell-style="libShow.DefaultTableCell"
          >
            <el-table-column
              prop="Gid"
              label="推荐游戏"
              width="330"
            >
              <template v-slot:default="scope">
                <el-select v-model="scope.row.Gid" style="width: 270px;" popper-class="custom-dropdown" placeholder="请选择推荐游戏" @change="changeZoneGame">
                  <el-option
                    v-for="item in gameSelect"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ showZoneGameLabel(item.id) }}</span>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="IsOpen"
              label="开关"
              width="100"
            >
              <template v-slot:default="scope">
                <el-switch v-model="scope.row.IsOpen" :active-value="true" :inactive-value="false" />
              </template>

            </el-table-column>
            <!--            <el-table-column-->
            <!--              prop="IconLink"-->
            <!--              label="推荐游戏icon"-->
            <!--              width="200"-->
            <!--            >-->
            <!--              <template v-slot:default="scope">-->
            <!--                <ImagePicker v-model="scope.row.IconLink" />-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <el-table-column
              prop="GameSort"
              label="排序"
              width="100"
            >
              <template v-slot:default="scope">
                <el-input v-model.number="scope.row.GameSort" />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              column-key="op"
              width="150"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="warning"
                  @click="handleDeleteZoneGameD(scope.row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="10" :offset="6">
              <el-button type="primary" size="medium" @click="saveZoneGameD">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--对比组件-->
    <compare ref="compare" compare-type="Object" />
  </el-col>
</template>

<script>

import Publish from '@/components/Publish/index.vue'
import { $libShow, DataRule } from '@/utils/common'
import ImagePicker from '@/components/ImagePicker/ImagePicker.vue'
import { Message } from 'element-ui'
import request from '@/utils/request'
import Compare from '@/components/Compare/index.vue'
import { getCustomize, updateCustomize } from '@/api/custome_configV2'
import SiteSelect from '@/components/SiteSelect/index.vue'

function newItem() {
  return { Gid: 1, GameIconLink: '', GameSort: 1, IsOpen: true }
}
function newItemOtherGameZone() {
  return { Id: 1, IconLink: '', IsOpen: true, GameList: [] }
}
function newItemHallGame() {
  return { Gid: 1, IconLink: '', GameSort: 1, IsOpen: true }
}
function newItemZoneGame() {
  return { Desc: '', Index: -1, Gids: [], IsOpen: false, Games: [{ Gid: 1, IconLink: '', GameSort: 1, IsOpen: true }], AppId: 1000002, ChannelId: [] }
}
export default {
  components: { Compare, ImagePicker, Publish, SiteSelect },
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
      appidInfoCfgs: [
        { 'value': 1000002, 'label': 'dayusenlin' },
        { 'value': 1000003, 'label': 'testaccount' },
        { 'value': 1000004, 'label': 'testkey' },
        { 'value': 1000005, 'label': 'BingoPlusTongits' },
        { 'value': 1000006, 'label': 'BingoPlusTest' },
        { 'value': 1000007, 'label': 'br' },
        { 'value': 1100000, 'label': 'xworld' }
      ],
      channelIdCfgs: [
        { 'value': 'BP', 'label': 'BP' },
        { 'value': 'AP', 'label': 'AP' },
        { 'value': 'GP', 'label': 'GP' },
        // { 'value': 'PG', 'label': 'PG' }, 2025-12-22去除PG
        { 'value': 'Dev', 'label': 'Dev' }
      ],
      editOtherGameZone: {
        visible: false,
        item: newItemOtherGameZone(),
        isEdit: false
      },
      editHallGame: {
        visible: false,
        item: newItemHallGame(),
        isEdit: false
      },
      editZoneGame: {
        visible: false,
        item: newItemZoneGame(),
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
        GameZoneItem: [
          {
            Id: 2,
            IconLink: '',
            IsOpen: true,
            GameList: []
          }
        ],
        WinMoreItem: [
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
        AppIds: [], // appids
        SiteIdList: [], // SiteIdList
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
          ActivityIds: [],
          AppIds: [], // appids
          SiteIdList: []
        },
        ZoneGame: [],
        HallGame: []
        /*
        WhitelistCfg: { //白名单配置
          AppIdList:[],
          SiteIdList:[]
        },
        */
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
      gameZoneOther: [],
      gameZoneOtherGameList: [],
      activityOptions: [
        { label: '摇钱树活动-[7]', value: 7 },
        { label: 'Poker乐园-[8]', value: 8 },
        { label: 'Banargay-[9]', value: 9 },
        { label: '圣诞节活动-[10]', value: 10 },
        { label: '新手任务活动-[11]', value: 11 },
        { label: '空投活动-[12]', value: 12 },
        { label: '红包雨活动-[13]', value: 13 },
        { label: 'free spins-[14]', value: 14 },
        { label: 'TongitsHunter-[15]', value: 15 },
        { label: 'KingOfPot-[16]', value: 16 },
        { label: '万圣节活动-[18]', value: 18 },
        { label: '竖版游戏排行榜活动-[19]', value: 19 },
        { label: 'Poker类排行榜活动-[20]', value: 20 },
        { label: '聚宝盆活动-[22]', value: 22 },
        { label: '花节阶段一活动-[24]', value: 24 },
        { label: '花节阶段二活动-[25]', value: 25 },
        { label: 'PokerPlus 红包活动-[26]', value: 26 },
        { label: '周年庆-[27]', value: 27 },
        { label: '固定反水活动-[28]', value: 28 },
        { label: '阶梯反水活动-[29]', value: 29 },
        { label: 'slots free buy活动-[30]', value: 30 },
        { label: 'PokerPlus海岛寻宝活动-[31]', value: 31 },
        { label: 'TongitsPlus 宝箱活动-[32]', value: 32 },
        { label: '空投casino活动-[33]', value: 33 }

      ],
      gameSelect: [],
      activitySelect: [
        { name: 'slot背包-[5]', id: 5 },
        { name: 'slot任务-[6]', id: 6 },
        { name: '摇钱树活动-[7]', id: 7 },
        { name: 'Poker乐园-[8]', id: 8 },
        { name: 'Banargay-[9]', id: 9 },
        { name: '圣诞节活动-[10]', id: 10 },
        { name: '新手任务活动-[11]', id: 11 },
        { name: '红包雨活动-[13]', id: 13 },
        { name: 'free spins-[14]', id: 14 },
        { name: 'TongitsHunter-[15]', id: 15 },
        { name: 'KingOfPot-[16]', id: 16 },
        { name: '万圣节活动-[18]', id: 18 },
        { name: '竖版游戏排行榜活动-[19]', id: 19 },
        { name: 'Poker类排行榜活动-[20]', id: 20 },
        { name: '活动地图-[21]', id: 21 },
        { label: '聚宝盆活动-[22]', value: 22 }
      ],
      blockGames: [36, 38, 39, 43, 44],
      hallGame: [],
      zoneGame: []
      /*
      whitelistCfg: { //白名单配置
          AppIdList:[],
          SiteIdList:[]
        }
      */
    }
  },
  watch: {
    filterTextZone(val) {
      this.$refs.treeGameZone.filter(val)
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    gameIdCfg(val) {

    }
  },
  created() {
    // 先获取配置数据，再获取游戏列表
    this.getData().then(() => {
      this.getGameAll().then(() => {
        // 确保 getGameAll 的 $nextTick 执行后再执行其他方法
        setTimeout(() => {
          this.getMaylikeGameAll()
          this.getOtherGameZoneAll()
        }, 100)
      })
    })
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    filterNodeZone(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    filterNodeOtherZone(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    mayLikeFilterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getGameAll() {
      return request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {},
        params: { status: 2 }
      }).then(response => {
        if (response.RetCode === 0) {
          const objsZone = response.Data || []
          const dataZone = {}
          for (let i = 0; i < objsZone.length; i++) {
            const objZone = objsZone[i]

            const gameZone = { Gid: objZone.Gid, Name: objZone.Name, Description: objZone.Description }
            // eslint-disable-next-line no-prototype-builtins
            if (dataZone.hasOwnProperty(objZone.CategoryID)) {
              dataZone[objZone.CategoryID].push(gameZone)
            } else {
              dataZone[objZone.CategoryID] = [gameZone]
            }
            const gameSelectInfo = { id: objZone.Gid, name: objZone.Name }
            this.gameSelect.push(gameSelectInfo)
          }

          this.treeDataZone = []
          const categoriesZone = { 1: 'Slot', 2: 'Poker', 3: 'Casino' }

          for (const keyZone in dataZone) {
            const gamesZone = dataZone[keyZone]
            const ctyZone = { id: 'p-' + keyZone, label: categoriesZone[keyZone], children: [] }

            for (let i = 0; i < gamesZone.length; i++) {
              const gameZone = gamesZone[i]
              ctyZone.children.push({ id: gameZone.Gid, label: gameZone.Name })
            }
            this.treeDataZone.push(ctyZone)
          }

          // 使用 $nextTick 确保 DOM 更新后再设置选中状态
          // 增加重试机制，确保组件完全渲染，最多重试20次
          let retryCount = 0
          const setCheckedKeys = () => {
            retryCount++
            const treeGameZone = this.$refs.treeGameZone
            console.log(`[setCheckedKeys] 第${retryCount}次尝试: treeGameZone=${!!treeGameZone}, GameList=`, this.item.GameList)
            if (treeGameZone && this.item.GameList && this.item.GameList.length > 0) {
              console.log('[setCheckedKeys] 成功设置选中状态:', this.item.GameList)
              treeGameZone.setCheckedKeys(this.item.GameList)
            } else if (retryCount < 20 && (!treeGameZone || !this.item.GameList)) {
              // 如果组件还未创建或数据未准备好，稍后重试
              setTimeout(setCheckedKeys, 50)
            } else if (retryCount >= 20) {
              console.warn('[setCheckedKeys] 达到最大重试次数，设置失败')
            }
          }
          this.$nextTick(() => {
            setCheckedKeys()
          })
        }
      })
    },
    getOtherGameZoneAll() {
      request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {},
        params: { status: 2 }
      }).then(response => {
        if (response.RetCode === 0) {
          const objsOtherZone = response.Data || []
          const dataOtherZone = {}
          for (let i = 0; i < objsOtherZone.length; i++) {
            const objOtherZone = objsOtherZone[i]
            if (objOtherZone.ShowDatacenter !== 1) {
              continue
            }

            const gameZoneOther = { Gid: objOtherZone.Gid, Name: objOtherZone.Name, Description: objOtherZone.Description }
            // eslint-disable-next-line no-prototype-builtins
            if (dataOtherZone.hasOwnProperty(objOtherZone.CategoryID)) {
              dataOtherZone[objOtherZone.CategoryID].push(gameZoneOther)
            } else {
              dataOtherZone[objOtherZone.CategoryID] = [gameZoneOther]
            }
          }

          this.treeDataOtherZone = []
          const categoriesZoneOther = { 1: 'Slot', 2: 'Poker', 3: 'Casino' }

          for (const keyZoneOther in dataOtherZone) {
            const gamesZoneOther = dataOtherZone[keyZoneOther]
            const ctyZoneOther = { id: 'p-' + keyZoneOther, label: categoriesZoneOther[keyZoneOther], children: [] }

            for (let i = 0; i < gamesZoneOther.length; i++) {
              const gameZoneOther = gamesZoneOther[i]
              ctyZoneOther.children.push({ id: gameZoneOther.Gid, label: gameZoneOther.Name })
            }
            this.treeDataOtherZone.push(ctyZoneOther)
          }
        }
      })
    },
    getMaylikeGameAll() {
      return request({
        url: '/thirdpartygames/all',
        method: 'get',
        data: {},
        params: { status: 2 }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          const data = {}
          for (let i = 0; i < objs.length; i++) {
            const obj = objs[i]
            if (obj.ShowDatacenter !== 1) {
              continue
            }

            const game = { Gid: obj.Gid, Name: obj.Name, Description: obj.Description }
            // eslint-disable-next-line no-prototype-builtins
            if (data.hasOwnProperty(obj.CategoryID)) {
              data[obj.CategoryID].push(game)
            } else {
              data[obj.CategoryID] = [game]
            }
          }

          this.mayLikeTreeData = []
          const categories = { 1: 'Slot', 2: 'Poker', 3: 'Casino' }

          for (const key in data) {
            const games = data[key]
            const cty = { id: 'p-' + key, label: categories[key], children: [] }

            for (let i = 0; i < games.length; i++) {
              const game = games[i]
              cty.children.push({ id: game.Gid, label: game.Name })
            }
            this.mayLikeTreeData.push(cty)
          }

          // 使用 $nextTick 确保 DOM 更新后再设置选中状态
          // 增加重试机制，确保组件完全渲染，最多重试20次
          let retryCount = 0
          const setCheckedKeys = () => {
            retryCount++
            const treeWinMore = this.$refs.treeWinMore
            console.log(`[setCheckedKeys-WinMore] 第${retryCount}次尝试: treeWinMore=${!!treeWinMore}, GameList=`, this.WinMoreItem.GameList)
            if (treeWinMore && this.WinMoreItem.GameList && this.WinMoreItem.GameList.length > 0) {
              console.log('[setCheckedKeys-WinMore] 成功设置选中状态:', this.WinMoreItem.GameList)
              treeWinMore.setCheckedKeys(this.WinMoreItem.GameList)
            } else if (retryCount < 20 && (!treeWinMore || !this.WinMoreItem.GameList)) {
              // 如果组件还未创建或数据未准备好，稍后重试
              setTimeout(setCheckedKeys, 50)
            } else if (retryCount >= 20) {
              console.warn('[setCheckedKeys-WinMore] 达到最大重试次数，设置失败')
            }
          }
          this.$nextTick(() => {
            setCheckedKeys()
          })
        }
      })
    },
    handleCheckChangeZone(data, checked, indeterminate) {
      if (checked) {
        if (this.blockGames.indexOf(data.id) !== -1) {
          this.$refs.treeGameZone.getNode(data).checked = false
          const message = data.label + '游戏不可添加配置，目前不支持'
          this.$message.warning(message)
          return
        }
      }
      const nodesZone = this.$refs.treeGameZone.getCheckedNodes()

      this.item.GameList = []

      for (let i = 0; i < nodesZone.length; i++) {
        const nodeZone = nodesZone[i]
        if (nodeZone.label === 'Slot' || nodeZone.label === 'Poker' || nodeZone.label === 'Casino' || this.blockGames.indexOf(nodeZone.id) !== -1) {
          continue
        }
        this.item.GameList.push(nodeZone.id)
      }
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
      if (checked) {
        if (this.blockGames.indexOf(data.id) !== -1) {
          this.$refs.treeWinMore.getNode(data).checked = false
          const message = data.label + '游戏不可添加配置，目前不支持'
          this.$message.warning(message)
          return
        }
      }
      const nodes = this.$refs.treeWinMore.getCheckedNodes()

      this.WinMoreItem.GameList = []

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (node.label === 'Slot' || node.label === 'Poker' || node.label === 'Casino' || this.blockGames.indexOf(node.id) !== -1) {
          continue
        }
        this.WinMoreItem.GameList.push(node.id)
      }
    },
    getData() {
      const $this = this
      return getCustomize(this.subKey).then(response => {
        if (response.RetCode === 0) {
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            const parsedData = JSON.parse(response.Data.Data)
            // 确保数据完整性
            if (!parsedData.GameList) {
              parsedData.GameList = []
            }
            if (!parsedData.WinMoreItem) {
              parsedData.WinMoreItem = []
            }
            $this.item = parsedData
            console.log('[getData] 解析后的item.GameList:', $this.item.GameList)
            console.log('[getData] 解析后的WinMoreItem:', $this.item.WinMoreItem)
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
            if (this.item.ZoneGame == null) {
              this.zoneGame = []
            } else {
              this.zoneGame = this.item.ZoneGame
              for (let i = 0; i < this.zoneGame.length; i++) {
                if (this.zoneGame[i].Desc == null) {
                  this.zoneGame[i].Desc = ''
                }
              }
            }
            if (this.item.HallGame == null) {
              this.hallGame = []
            } else {
              this.hallGame = this.item.HallGame
            }
            /*
            if (this.item.WhitelistCfg == null){
              this.whitelistCfg = {
                AppIdList:[],
                SiteIdList:[]
              }
            }else{
              this.whitelistCfg = this.item.WhitelistCfg
            }
            */
            this.$refs.compare.SetOldVal(response.Data.Data)
          }
        }
        return response
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
    handleCreateHallGames() {
      this.editHallGame.item = newItemHallGame()
      this.editHallGame.isEdit = false
      this.editHallGame.visible = true
    },
    handleCreateZoneGame() {
      this.editZoneGame.item = newItemZoneGame()
      this.editZoneGame.isEdit = false
      this.editZoneGame.visible = true
    },
    getEditTitle() {
      this.isDisabled = this.edit.isEdit
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    getEditTitleOtherGameZone() {
      this.isDisabled = this.edit.isEdit
      return this.edit.isEdit ? '修改活动配置' : '新增活动配置'
    },
    getEditTitleHallGame() {
      this.isDisabled = this.editHallGame.isEdit
      return this.editHallGame.isEdit ? '修改侧拉栏游戏推荐' : '新增侧拉栏游戏推荐'
    },
    // 操作类函数
    clickData(row, column, event) {
      this.edit.visible = true
      this.edit.isEdit = true
      this.handleEdit(row)
    },
    clickDataOtherGameZone(row, column, event) {
      if (column.columnKey === 'op') {
        return
      }
      this.editOtherGameZone.visible = true
      this.editOtherGameZone.isEdit = true
      this.handleEditOtherGameZone(row)
    },
    clickDataHallGame(row, column, event) {
      if (column.columnKey === 'op') {
        return
      }
      this.editHallGame.visible = true
      this.editHallGame.isEdit = true
      this.handleEditHallGame(row)
    },
    clickDataZoneGame(row, column, event) {
      if (column.columnKey === 'op') {
        return
      }
      this.editZoneGame.visible = true
      this.editZoneGame.isEdit = true
      this.handleEditZoneGame(row)
    },
    handleEdit(ob) {
      this.initFormData(true, ob.Gid)
      this.edit.visible = true
    },
    handleEditOtherGameZone(ob) {
      this.initFormDataOtherGameZone(true, ob.Id)
      this.editOtherGameZone.visible = true
    },
    handleEditHallGame(ob) {
      this.initFormDataHallGame(true, ob.Gid)
      this.editHallGame.visible = true
    },
    handleEditZoneGame(ob) {
      this.initFormDataZoneGame(true, ob.Index)
      this.editZoneGame.visible = true
    },
    save() {
      const newData = JSON.parse(JSON.stringify(this.edit.item))
      const index = this.MayLikeGameList.findIndex(item => item.Gid === this.edit.item.Gid)
      if (this.edit.isEdit) {
        this.MayLikeGameList.splice(index, 1, newData)
      } else {
        // 如果是新增，检查是否有重复的档次
        if (index >= 0) {
          this.$alert(`[已存在，不能重复添加`, '提示', { type: 'warning' })
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
    onCompare(pre, pro) {
      const preVal = JSON.parse(pre.Data)
      const proVal = JSON.parse(pro.Data)
      console.log('JSON.stringify(preVal.zoneGame', preVal)
      console.log('JSON.stringify(proVal.zoneGame', proVal)
      // 编辑
      let change = ''
      if ((JSON.stringify(preVal.IsOpen) !== JSON.stringify(proVal.IsOpen)) ||
      (JSON.stringify(preVal.ImgUrl) !== JSON.stringify(proVal.ImgUrl)) ||
        (JSON.stringify(preVal.GameList) !== JSON.stringify(proVal.GameList)) ||
        (JSON.stringify(preVal.AppIds) !== JSON.stringify(proVal.AppIds)) ||
        (JSON.stringify(preVal.SiteIdList) !== JSON.stringify(proVal.SiteIdList))
      ) {
        change += 'gameZone活动配置/'
      }
      let mayLike = false
      if ((JSON.stringify(preVal.WinMoreItem) !== JSON.stringify(proVal.WinMoreItem))
      ) {
        for (const i in preVal.WinMoreItem) {
          for (const j in proVal.WinMoreItem) {
            if (preVal.WinMoreItem[i].Id === proVal.WinMoreItem[j].Id) {
              if ((JSON.stringify(preVal.WinMoreItem[i]) !== JSON.stringify(proVal.WinMoreItem[j]))
              ) {
                if (preVal.WinMoreItem[i].Id === 3) {
                  change += 'mayLike活动配置/'
                  mayLike = true
                }
                if (preVal.WinMoreItem[i].Id === 4) {
                  change += 'Favorites活动配置/'
                }
              }
            }
          }
        }
      }
      if ((JSON.stringify(preVal.MayLikeItem) !== JSON.stringify(proVal.MayLikeItem))) {
        if (!mayLike) {
          change += 'mayLike活动配置/'
          mayLike = true
        }
      }
      let hasgameZoneOther = false
      if ((JSON.stringify(preVal.GameZoneItem) !== JSON.stringify(proVal.GameZoneItem))
      ) {
        for (const i in preVal.GameZoneItem) {
          for (const j in proVal.GameZoneItem) {
            if (preVal.GameZoneItem[i].Id === proVal.GameZoneItem[j].Id) {
              if ((JSON.stringify(preVal.GameZoneItem[i]) !== JSON.stringify(proVal.GameZoneItem[j]))
              ) {
                if (preVal.GameZoneItem[i].Id === 2) {
                  change += 'winMore配置/'
                }
                if (preVal.GameZoneItem[i].Id !== 2 && !hasgameZoneOther) {
                  change += 'gameZone其他活动配置/'
                  hasgameZoneOther = true
                }
              }
            }
          }
        }
      }
      if ((JSON.stringify(preVal.GameEvent) !== JSON.stringify(proVal.GameEvent))
      ) {
        change += '游戏内活动入口配置/'
      }
      if ((JSON.stringify(preVal.ZoneGame) !== JSON.stringify(proVal.ZoneGame))
      ) {
        change += '侧拉栏游戏推荐/'
      }
      /*
      if ((JSON.stringify(preVal.WhitelistCfg) !== JSON.stringify(proVal.WhitelistCfg))
      ) {
        change += '白名单配置/'
      }*/
      let str = ''
      if (change !== '') {
        str = `修改了:【${change}】的配置`
      }
      // console.log(str,JSON.stringify(preVal),JSON.stringify(proVal))
      return str
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
          this.$alert(`[已存在，不能重复添加`, '提示', { type: 'warning' })
          return
        }
        // 新增到
        this.gameZoneOther.push(newData)
      }
      this.gameZoneOtherGameList = []
      this.$nextTick(() => {
        const treeGameOtherZone = this.$refs.treeGameOtherZone
        if (treeGameOtherZone) {
          // 现在可以安全地使用childComponent
          treeGameOtherZone.setCheckedKeys([])
        }
      })
      // this.$refs.treeGameOtherZone.setCheckedKeys([])
      this.editOtherGameZone.visible = false
      this.editOtherGameZone.isEdit = false
    },
    saveHallGame() {
      const newData = JSON.parse(JSON.stringify(this.editHallGame.item))
      if (!this.checkGames(this.editHallGame.item.Gid)) {
        this.$alert(`添加选场游戏错误，游戏不存在`, '提示', { type: 'warning' })
        return
      }
      const index = this.hallGame.findIndex(item => item.Gid === this.editHallGame.item.Gid)
      if (this.editHallGame.isEdit) {
        this.hallGame.splice(index, 1, newData)
      } else {
        // 如果是新增，检查是否有重复的档次
        if (index >= 0) {
          this.$alert(`[已存在，不能重复添加`, '提示', { type: 'warning' })
          return
        }
        // 新增到
        this.hallGame.push(newData)
      }
      this.editHallGame.visible = false
      this.editHallGame.isEdit = false
    },
    checkGames(gid) {
      for (let i = 0; i < this.gameSelect.length; i++) {
        // eslint-disable-next-line no-empty
        if (this.gameSelect[i].id === gid) {
          return true
        }
      }
      return false
    },
    checkZoneGames(newData, index) {
      const gids = newData.Gids
      if (gids.length <= 0) {
        return false
      }
      let gameSelArray = []
      for (let i = 0; i < this.gameSelect.length; i++) {
        gameSelArray.push(this.gameSelect[i].id)
      }
      const allIn = gids.every(value => gameSelArray.includes(value))
      if (!allIn) {
        return false
      }
      gameSelArray = []
      const nowGameSelArray = []

      for (let m = 0; m < newData.ChannelId.length; m++) {
        for (let n = 0; n < newData.Gids.length; n++) {
          nowGameSelArray.push({ AppId: newData.AppId, ChannelId: newData.ChannelId[m], Gid: newData.Gids[n] })
        }
      }

      for (let i = 0; i < this.zoneGame.length; i++) {
        if (this.zoneGame[i].Index === index) {
          // for (let m = 0; m < this.zoneGame[i].ChannelId.length; m++) {
          //   for (let n = 0; n < this.zoneGame[i].Gids.length; n++) {
          //     nowGameSelArray.push({ AppId: this.zoneGame[i].AppId, ChannelId: this.zoneGame[i].ChannelId[m], Gid: this.zoneGame[i].Gids[n] })
          //   }
          // }
        } else {
          for (let m = 0; m < this.zoneGame[i].ChannelId.length; m++) {
            for (let n = 0; n < this.zoneGame[i].Gids.length; n++) {
              gameSelArray.push({ AppId: this.zoneGame[i].AppId, ChannelId: this.zoneGame[i].ChannelId[m], Gid: this.zoneGame[i].Gids[n] })
            }
          }
        }
      }
      const tmp = false
      for (let i = 0; i < gameSelArray.length; i++) {
        const obj = gameSelArray[i]
        for (let j = 0; j < nowGameSelArray.length; j++) {
          const obj1 = nowGameSelArray[j]
          if (obj.AppId === obj1.AppId && obj.ChannelId === obj1.ChannelId && obj.Gid === obj1.Gid) {
            console.log(index, obj.AppId, obj.ChannelId, obj.Gid)
          }
        }
      }
      const exists = gameSelArray.some(obj => nowGameSelArray.some(obj1 => obj1.AppId === obj.AppId && obj1.ChannelId === obj.ChannelId && obj1.Gid === obj.Gid))
      console.log(exists)
      return exists
    },
    saveZoneGameD() {
      const newData = JSON.parse(JSON.stringify(this.editZoneGame.item))

      if (this.checkZoneGames(newData, this.editZoneGame.item.Index)) {
        this.$alert(`添加错误，游戏不存在或重复配置`, '提示', { type: 'warning' })
        return
      }

      const index = this.zoneGame.findIndex(item => item.Index === this.editZoneGame.item.Index)
      if (this.editZoneGame.isEdit) {
        this.zoneGame.splice(index, 1, newData)
      } else {
        const length = this.zoneGame.length
        let indexNew = 1
        if (length > 0) {
          indexNew = this.zoneGame[length - 1].Index + 1
        }
        newData.Index = indexNew
        // 新增到
        this.zoneGame.push(newData)
      }
      this.editZoneGame.visible = false
      this.editZoneGame.isEdit = false
      console.log(this.zoneGame)
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
          this.$nextTick(() => {
            const treeGameOtherZone = this.$refs.treeGameOtherZone
            if (treeGameOtherZone && this.editOtherGameZone.item.GameList && this.editOtherGameZone.item.GameList.length > 0) {
              // 现在可以安全地使用childComponent
              treeGameOtherZone.setCheckedKeys(this.editOtherGameZone.item.GameList)
            }
          })
        }
      }
    },
    initFormDataHallGame(bEdit, id) {
      this.editHallGame.isEdit = bEdit
      if (id) {
        const _data = this.getHallGameDataByGid(id)
        if (_data) {
          Object.assign(this.editHallGame.item, _data)
        }
      }
    },
    initFormDataZoneGame(bEdit, id) {
      this.editZoneGame.isEdit = bEdit
      if (id) {
        const _data = this.getZoneGameDataByGid(id)
        if (_data) {
          Object.assign(this.editZoneGame.item, _data)
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
    getHallGameDataByGid(id) {
      for (let i = 0; i < this.hallGame.length; i++) {
        const data = this.hallGame[i]
        if (data.Gid === id) {
          return data
        }
      }
      return null
    },
    getZoneGameDataByGid(id) {
      for (let i = 0; i < this.zoneGame.length; i++) {
        const data = this.zoneGame[i]
        if (data.Index === id) {
          if (data.AppId == null) {
            data.AppId = 1000002
            data.ChannelId = ['BP', 'AP', 'GP', 'Dev']
          }
          if (Array.isArray(data.AppId)) {
            data.AppId = 1000002
          }
          return data
        }
      }
      return null
    },
    handleDelete(ob) {
      const $this = this
      this.$confirm('是否确认删除?', '提示', { type: 'warning' }).then(() => {
        const delIndex = $this.MayLikeGameList.findIndex(item => item.Gid === ob.Gid)
        this.MayLikeGameList.splice(delIndex, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    handleDeleteOtherGameZone(ob) {
      const $this = this
      this.$confirm('是否确认删除?', '提示', { type: 'warning' }).then(() => {
        const delIndex = $this.gameZoneOther.findIndex(item => item.Id === ob.Id)
        this.gameZoneOther.splice(delIndex, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    handleDeleteHallGame(ob) {
      const $this = this
      this.$confirm('是否确认删除?', '提示', { type: 'warning' }).then(() => {
        const delIndex = $this.hallGame.findIndex(item => item.Gid === ob.Gid)
        this.hallGame.splice(delIndex, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    handleDeleteZoneGame(ob) {
      const $this = this
      this.$confirm('是否确认删除?', '提示', { type: 'warning' }).then(() => {
        const delIndex = $this.zoneGame.findIndex(item => item.Index === ob.Index)
        this.zoneGame.splice(delIndex, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    handleDeleteZoneGameD(ob) {
      const $this = this
      this.$confirm('是否确认删除?', '提示', { type: 'warning' }).then(() => {
        const delIndex = $this.editZoneGame.item.Games.findIndex(item => item.Gid === ob.Gid)
        this.editZoneGame.item.Games.splice(delIndex, 1)
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
      cpy.HallGame = this.hallGame
      cpy.ZoneGame = this.zoneGame
      // cpy.WhitelistCfg = this.whitelistCfg
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
        updateCustomize($this.form).then(response => {
          if (response.RetCode === 0) {
            console.log('save', response)
            Message.success('保存成功')
          }
        })
      })
    },
    showGameName(type, id) {
      let temp = this.gameSelect
      if (type === 2) {
        temp = this.activitySelect
      }
      for (let i = 0; i < temp.length; i++) {
        const data = temp[i]
        if (data.id === id) {
          return data.name
        }
      }
      return ''
    },
    addZoneGame() {
      this.editZoneGame.item.Games.push({ Gid: 1, IconLink: '', GameSort: 1, IsOpen: true })
    },
    rowStyle({ row, rowIndex }) {
      return 'height: 50px;'
    },
    changeZoneGame(id) {
      console.log('changeHallGame===>', id)
      // if (!this.checkGames(id)) {
      //   this.$alert(`[添加错误，游戏不存在`, '提示', { type: 'warning' })
      //   return
      // }
      const length = this.editZoneGame.item.Games.length
      for (let i = 0; i < length - 1; i++) {
        if (id === this.editZoneGame.item.Games[i].Gid) {
          console.log('changeHallGame', id)
          Message.error('重复添加推荐游戏')
          this.editZoneGame.item.Games[length - 1].Gid = 1
        }
      }
    },
    showZoneGameLabel(id) {
      const length = this.editZoneGame.item.Games.length
      for (let i = 0; i < length - 1; i++) {
        if (id === this.editZoneGame.item.Games[i].Gid) {
          return '(已添加)'
        }
      }
      return ''
    },
    changeZoneGameGids(id) {
      console.log('changeHallGame===>', id)
      // if (!this.checkGames(id)) {
      //   this.$alert(`[添加错误，游戏不存在`, '提示', { type: 'warning' })
      //   return
      // }
      if (this.editZoneGame.item.Gids.length > id.length) {
        const gid = id[id.length - 1]
        const lengthZoneGame = this.zoneGame.length
        for (let i = 0; i < lengthZoneGame - 1; i++) {
          if (this.editZoneGame.item.AppId !== this.zoneGame[i].AppId) {
            continue
          }
          const gids = this.zoneGame[i].Gids
          if (gids.includes(gid)) {
            console.log('changeHallGame', gid)
            Message.error('重复添加游戏,其他项目存在')
            this.editZoneGame.item.Gids.splice(length - 1, 1)
            return
          }
        }
        const length = this.editZoneGame.item.Gids.length
        for (let i = 0; i < length - 1; i++) {
          if (gid === this.editZoneGame.item.Gids[i]) {
            console.log('changeHallGame', gid)
            Message.error('重复添加游戏，本项目存在')
            this.editZoneGame.item.Gids.splice(length - 1, 1)
            return
          }
        }
      }
    }
  }
}
</script>
<style>
.custom-dropdown .el-select-dropdown__wrap {
  max-height: 900px; /* 设置下拉框的最大高度 */
  max-width: 270px; /* 设置下拉框的最大宽度 */
  width: 270px; /* 设置下拉框的宽度 */
}
.custom-dropdown .el-select-dropdown__list {
  max-height: calc(900px - 40px); /* 根据需要减去可能的滚动条高度 */
}
.custom-dropdown1 .el-select-dropdown__wrap {
  max-height: 900px; /* 设置下拉框的最大高度 */
  max-width: 500px; /* 设置下拉框的最大宽度 */
}
.custom-dropdown1 .el-select-dropdown__list {
  max-height: calc(900px - 40px); /* 根据需要减去可能的滚动条高度 */
}
</style>
