<template>
  <div id="app" class="page-container" style="padding: 10px">
    <div style="margin-bottom: 20px;">
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" />
    </div>
    <el-row style="padding-top: 5px">
      <h3 style="text-align:center;">EGame游戏控制配置</h3>
      <el-row style="margin: 10px 0;">
        应用 <el-select v-model="editAppId" filterable placeholder="请选择应用id" size="small" style="margin-right: 12px; width: 300px" @change="handleUpdateAppid">
          <el-option
            v-for="item in APPID_OPTIONS"
            :key="item.value"
            :label="`${item.label}-${item.value}`"
            :value="item.value"
          />
        </el-select>
        <el-button size="mini" type="primary" icon="el-icon-search" @click="onSearch" />
        <el-button size="mini" type="primary" @click="handleShowCopyDialog">同步应用配置</el-button>
        <p style="color: red; font-weight: bold;">⚠️配置更新说明：</p>
        <p style="color: red; ">dayusenlin或者1000002 代表内部正式环境</p>
        <p style="color: red; ">BingoPlusTongits或者1000005 代表生产正式环境</p>
        <p style="color: red; ">如需内部验证配置只需改内部正式环境配置即可，验证完后需同步到生产正式环境配置</p>
        <p style="color: red; ">备注：先内部正式环境验证逻辑，如无问题则同步配置到生产正式环境</p>
        <p style="color: red; ">同步步骤：</p>
        <p style="color: red; ">1. 点击“同步应用配置”按键</p>
        <p style="color: red; ">2. 下拉框选择原应用</p>
        <p style="color: red; ">3. 下拉框选择目标应用（如：1000005）</p>
        <p style="color: red; ">4. 点击“确认同步”按键</p>
        <p style="color: red; ">5. 关闭弹窗</p>
        <p style="color: red; ">6. 选择“保存信息”按键</p>
        <p style="color: red; ">7. 对比配置</p>
        <p style="color: red; ">8. 发布配置</p>
        <!-- <el-button size="mini" type="success" @click="handleShowModifyDialog">修改</el-button> -->
      </el-row>
    </el-row>


      <el-tabs type="border-card" @tab-click="handleTabClick">
          <el-tab-pane label="个⼈控制配置">
            <h2 style="text-align:center;">个⼈控制通⽤配置</h2>
            <h4 style="text-align:left;">个⼈控制临界点配置<span style="color: red;">(底分倍数)</span></h4>
            <p style="color: red; font-weight: bold;">⚠️ 正数：玩家输给系统， 负数：系统输给玩家！</p>
            <el-descriptions :column="4" :colon="false" direction="vertical" border>
              <el-descriptions-item label="强杀" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center' }">
                  <el-input
                  v-model.number="editGameControl.PlayerControl.CriticalPoint[0]"
                  type="number"
                  placeholder="请输入整数"
                  />
              </el-descriptions-item>
              <el-descriptions-item label="弱杀" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input
                v-model.number="editGameControl.PlayerControl.CriticalPoint[1]"
                type="number"
                placeholder="请输入整数"
                />
              </el-descriptions-item>
              <el-descriptions-item label="弱放" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input
                v-model.number="editGameControl.PlayerControl.CriticalPoint[2]"
                type="number"
                placeholder="请输入整数"
                />
              </el-descriptions-item>
              <el-descriptions-item label="强放" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input
                v-model.number="editGameControl.PlayerControl.CriticalPoint[3]"
                type="number"
                placeholder="请输入整数"
                />
              </el-descriptions-item>
            </el-descriptions>
            <h4 style="text-align:left;">个⼈控制周期局数</h4>
            <el-descriptions :column="1" :colon="false" direction="vertical" border>
              <el-descriptions-item label="个⼈控制周期局数" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input
                v-model.number="editGameControl.PlayerControl.PlayerControlRound"
                type="number"
                placeholder="请输入整数"
                />
              </el-descriptions-item>
            </el-descriptions>
            <el-divider />
            <h2 style="text-align:center;">个⼈控制区间配置</h2>
            <el-row>
              <el-form :label-position="labelPosition" label-width="100px">
                <el-form-item label="同周期机器⼈类型是否与⾸局⼀致" required>
                  <el-col :span="2">
                    <el-switch v-model.number="editGameControl.PlayerControl.IsSameFirst" :active-value="true" :inactive-value="false" />
                  </el-col>
                </el-form-item>
                <el-form-item label="区间匹配机器⼈权重" required>
                  <el-table
                    :data="editGameControl.PlayerControl.RobotWeight"
                    stripe
                    border
                    style="width: 100%"
                  >
                    <el-table-column
                      prop="AiConfigLevel"
                      label="级别"
                      width="250"
                      :formatter="(row) => getRobotName(row.AiConfigLevel)"
                    />
                    <el-table-column
                      label="强杀区间"
                      column-key="op"
                      width="250"
                    >
                      <template slot-scope="scope">
                        <el-input
                        v-model.number="scope.row.AiWeight[0]"
                        type="number"
                        placeholder="请输入整数"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="弱杀区间"
                      column-key="op"
                      width="250"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.AiWeight[1]"
                        type="number"
                        placeholder="请输入整数"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="正常区间"
                      column-key="op"
                      width="250"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.AiWeight[2]"
                        type="number"
                        placeholder="请输入整数"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="弱放区间"
                      column-key="op"
                      width="250"
                    >
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.AiWeight[3]"
                        type="number"
                        placeholder="请输入整数"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="强放区间"
                      column-key="op"
                      width="250"
                    >
                      <template slot-scope="scope">
                        <el-input
                          v-model.number="scope.row.AiWeight[4]"
                          type="number"
                          placeholder="请输入整数"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-form>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="玩家库存查询与修改" name="playerInfoQuery">
            <el-row style="padding-top: 5px">
              <el-form label-width="150px">
                <el-form-item label="玩家ID" required>
                  <el-col :span="4">
                    <el-input v-model.number="Uid"  type="number"/>
                  </el-col>
                  <el-col :span="2">
                    <el-button @click="handleGetPlayerAllLevelMoney">查询</el-button>
                  </el-col>
                </el-form-item>
                <el-form-item label="刷新" required>
                  <el-col :span="2">
                    <el-button @click="handleGetPlayerAllLevelMoney">刷新</el-button>
                  </el-col>
                </el-form-item>
                <el-form-item label="玩家场次库存"  :error="'⚠️ 正数：玩家输给系统， 负数：系统输给玩家！'" required>
                  <el-table
                    :data="PlayerTableMoneyInfo"
                    stripe
                    border
                    style="width: 100%"
                    show-summary
                  >
                    <el-table-column
                      prop="TableMoney"
                      label="游戏底注"
                      width="250"
                      :formatter="(row) => (row.TableMoney / 1000)"
                    ></el-table-column>
                    <el-table-column
                      prop="Money"
                      label="库存"
                      width="250"
                    />
                    <el-table-column
                      label="操作"
                      width="250"
                    >
                      <template slot-scope="scope">
                        <el-button
                          type="primary"
                          size="mini"
                          icon="el-icon-document-copy"
                          @click="handleUpdatePlayerLevelMoney(scope.row)"
                        >修改
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-form>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="群体控制配置">
            <h3 style="text-align:center;">群体控制临界点配置</h3>
            <el-descriptions label="群体控制临界点配置" :column="7" :colon="false" direction="vertical" border>
              <el-descriptions-item label="强杀匹配全⽣效" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input
                  v-model="editGameControl.GameControl.ControlRange[0].Ratio"
                  @input="handlePercentInput(editGameControl.GameControl.ControlRange[0], 'Ratio', 0, 100)"
                  placeholder="0-100"
                  type="number"
                >
                  <template #append>%</template>
                </el-input>
              </el-descriptions-item>
              <el-descriptions-item label="强杀" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input
                  v-model="editGameControl.GameControl.ControlRange[1].Ratio"
                  @input="handlePercentInput(editGameControl.GameControl.ControlRange[1], 'Ratio')"
                  placeholder="0-100"
                  type="number"
                  >
                  <template #append>%</template>
                </el-input>
              </el-descriptions-item>
              <el-descriptions-item label="弱杀" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input
                  v-model="editGameControl.GameControl.ControlRange[2].Ratio"
                  @input="handlePercentInput(editGameControl.GameControl.ControlRange[2], 'Ratio')"
                  placeholder="0-100"
                  type="number"
                  ><template #append>%</template>
                </el-input>
              </el-descriptions-item>
              <el-descriptions-item label="原点" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center', 'color': 'green', 'font-weight': 'bold'}">
                <el-input
                  v-model="editGameControl.GameControl.ControlRange[3].Ratio"
                  @input="handlePercentInput(editGameControl.GameControl.ControlRange[3], 'Ratio')"
                  placeholder="0-100"
                  type="number"
                  ><template #append>%</template>
                </el-input>
              </el-descriptions-item>
              <el-descriptions-item label="弱放" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input
                  v-model="editGameControl.GameControl.ControlRange[4].Ratio"
                  @input="handlePercentInput(editGameControl.GameControl.ControlRange[4], 'Ratio')"
                  placeholder="0-100"
                  type="number"
                  ><template #append>%</template>
                </el-input>
              </el-descriptions-item>
              <el-descriptions-item label="强放" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input
                  v-model="editGameControl.GameControl.ControlRange[5].Ratio"
                  @input="handlePercentInput(editGameControl.GameControl.ControlRange[5], 'Ratio')"
                  placeholder="0-100"
                  type="number"
                  ><template #append>%</template>
                </el-input>
              </el-descriptions-item>
              <el-descriptions-item label="强放匹配全⽣效" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input
                  v-model="editGameControl.GameControl.ControlRange[6].Ratio"
                  @input="handlePercentInput(editGameControl.GameControl.ControlRange[6], 'Ratio')"
                  placeholder="0-100"
                  type="number"
                >
                  <template #append>%</template>
                </el-input>
              </el-descriptions-item>
            </el-descriptions>
            <h3 style="text-align:center;">群控区间对个⼈区间的移动格数</h3>
            <el-alert
              title="⚠️  负数往左偏移， 正数往右偏移"
              type="error"
              :closable="false"
              style="margin-bottom: 16px;"
            />
            <el-descriptions label="群控区间对个⼈区间的移动格数" :column="6" :colon="false" direction="vertical" border>

              <el-descriptions-item label="区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <span>移动区间数</span>
              </el-descriptions-item>
              <el-descriptions-item label="强杀区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="editGameControl.GameControl.ControlRange[1].MoveRange"  type="number" />
              </el-descriptions-item>
              <el-descriptions-item label="弱杀区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="editGameControl.GameControl.ControlRange[2].MoveRange"  type="number" />
              </el-descriptions-item>
              <el-descriptions-item label="正常区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="editGameControl.GameControl.ControlRange[4].MoveRange"  type="number" />
              </el-descriptions-item>
              <el-descriptions-item label="弱放区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="editGameControl.GameControl.ControlRange[5].MoveRange"  type="number" />
              </el-descriptions-item>
              <el-descriptions-item label="强放区间" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
                <el-input v-model.number="editGameControl.GameControl.ControlRange[6].MoveRange"  type="number" />
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="游戏库存查询与修改"  name="gameMoneyQuery">
            <el-row>
              <el-descriptions :column="3" :colon="false">
                <el-descriptions-item label="当前游戏待调整⾦额:">
                  {{ pendingMoney }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <el-button type="primary" @click="handleRefreshGameMoney">刷新</el-button>
                  <el-button type="primary" @click="handleShowModifyGameDialog">修改</el-button>
                </el-descriptions-item>
              </el-descriptions>
            </el-row>
            <el-row>
              <el-descriptions :column="3" :colon="false">
                <el-descriptions-item label="当前游戏库存所在群控区间:">
                  {{ GameRangeName }}
                </el-descriptions-item>
              </el-descriptions>
            </el-row>
            <!-- <el-row>
              <el-descriptions :column="3" :colon="false">
                <el-descriptions-item label="今日净胜、抽水:">
                  {{ todaySysWinMoney }}
                </el-descriptions-item>
              </el-descriptions>
            </el-row> -->
            <el-row>
              <el-descriptions :column="3" :colon="false">
                <el-descriptions-item label="今日有效下注:">
                  {{ todayGameBet }}
                </el-descriptions-item>
              </el-descriptions>
            </el-row>
            <el-row>
              <el-descriptions :column="3" :colon="false">
                <el-descriptions-item label="前7天平均有效下注:">
                  {{ sevenDayMoneyBet }}
                </el-descriptions-item>
              </el-descriptions>
            </el-row>

            <el-row>
              <el-descriptions :column="3" :colon="false">
                <el-descriptions-item label="原点">
                  {{ editGameControl.GameControl.ControlRange[3].Ratio}} %
                </el-descriptions-item>
              </el-descriptions>
            </el-row>
            <el-row>
              <el-descriptions :column="3" :colon="false">
                <el-descriptions-item label="系统游戏库存:">
                  {{ gameRatio /100}} %
                </el-descriptions-item>

              </el-descriptions>
              <el-alert
              title="⚠️ 系统游戏库存= （前7日每日平均有效下注*2.5%+最新累积待调整金额）/（前7日每日平局有效下注+今日有效下注）"
              type="error"
              :closable="false"
              style="margin-bottom: 16px;"
            />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="场次采信比例配置" name="gameInfoQuery">
            <el-row style="padding-top: 5px">
              <el-form label-width="150px">
                <el-form-item>
                  <el-table
                    :data="editGameControl.GameControl.GameAcceptance"
                    stripe
                    border
                    style="width: 100%"
                  >
                    <el-table-column
                      prop="TableMoney"
                      label="游戏底注"
                      width="250"
                      :formatter="(row) => (row.TableMoney / 1000)"
                    />
                    <el-table-column
                      prop="rate"
                      label="场次采信比例"
                      width="250"
                      required="true"
                    >
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.Ratio"
                          placeholder="0-100"
                          type="number"
                          @input="handleDecimalInput(scope.row, 'Ratio')" >
                          <template #append>%</template>
                        </el-input>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-form>
            </el-row>
          </el-tab-pane>
    </el-tabs>
    <div style="margin-bottom: 20px;">
      <el-button type="primary" @click="setData">保存信息</el-button>
    </div>

    <el-dialog
      title="修改场次库存"
      :visible.sync="editPlayerInventoryVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="editPlayerInventory" :model="editPlayerInventory" width="70%">
        <el-row>
          <el-form label-width="150px">
            <el-form-item label="Uid：">
              <template>
                <span>{{ Uid }}</span>
              </template>
            </el-form-item>
            <el-form-item label="游戏底注：">
              <template>
                <span>{{ editPlayerInventory.TableMoney/1000 }}</span>
              </template>
            </el-form-item>
            <el-form-item label="当前场次库存：">
              <template>
                <span>{{ editPlayerInventory.Money }}</span>
              </template>
            </el-form-item>
            <el-form-item label="修改⾄：" required>
              <template>
                <el-input v-model.number="editPlayerInventory.Money" />
              </template>
            </el-form-item>
          </el-form>
        </el-row>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-tooltip content="点击保存<立即生效>" placement="top">
                <el-button type="primary" size="medium" @click="savePlayerLevelMoney">保存</el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="同步应用配置"
      :visible.sync="copyDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="copyForm" :model="copyDialog.form" label-width="200px" size="small" inline>
        <el-tabs type="card">
          <el-row>
          <el-form-item label="原应用" :required="true">
            <el-select v-model="copyDialog.form.srcAppId" style="width: 210px" placeholder="请选择" size="mini">
              <el-option v-for="item in APPID_OPTIONS" :key="item.value" :label="`${item.label}-${item.value}`" :value="item.value" />
            </el-select>
          </el-form-item>
          </el-row>

          <el-row style="padding-top: 20px">
            <el-form-item label="目标应用" :required="true">
              <el-select v-model="copyDialog.form.targetAppId" style="width: 210px" placeholder="请选择" size="mini">
                <el-option v-for="item in APPID_OPTIONS" :key="item.value" :label="`${item.label}-${item.value}`" :value="item.value" />
              </el-select>
            </el-form-item>


          </el-row>
          <el-row style="padding-top: 20px">
            <el-col>
              <span style="color: red; padding: 15px 20px 15px 0; border: 1px #0a76a4;">注意：确认同步后，需要点击下面的保存信息，则会生效</span>
            </el-col>
          </el-row>
          <el-row style="padding-top: 50px;">
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="handleCopy">确认同步</el-button>
            </el-col>
          </el-row>
        </el-tabs>
      </el-form>
    </el-dialog>


    <el-dialog
      title="修改配置"
      :visible.sync="modifyGameDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="updateForm" :model="modifyGameDialog.form" label-width="200px" size="small" inline>
        <el-tabs type="card">
          <el-form-item label="当前游戏待调整⾦额:" :required="true">
            <template>
              <el-input v-model.number="pendingMoney"  placeholder="请输入" disabled=""/>
            </template>
          </el-form-item>

          <el-form-item label="修改⾄" :required="true">
            <template>
              <el-input v-model.number="modifyGameDialog.form.pendingMoney"  placeholder="请输入" />
            </template>
          </el-form-item>
          <el-row>
            <el-col>
              <span style="padding: 15px 20px 15px 0; border: 1px #0a76a4;">注意：修改后立即生效</span>
            </el-col>
          </el-row>
          <el-row style="padding-top: 20px;">
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="handleUpdateGameMoney">修改</el-button>
            </el-col>
          </el-row>
        </el-tabs>
      </el-form>
    </el-dialog>


    <compare ref="compare" />
  </div>
</template>

<style scoped>
</style>
<script>
import { Message } from 'element-ui'
import Publish from '@/components/Publish'
import Compare from '@/components/Compare'
import request from '@/utils/request'
import {DataRule } from '@/utils/common'
import robotAiSettingBuildCard from './tongits/robotAiSettingBuildCard'
import { APPID_OPTIONS } from '@/utils/options'

export default {
  components: {
    Publish,
    Compare,
    robotAiSettingBuildCard
  },
  data() {
    return {
      APPID_OPTIONS,
      gameId: 134,
      playMode: 4, // 经典玩法

      edit: {},
      tableData: [],
      egameData: {},
      editAppId: 1000005,
      copyDialog: {
        visible: false,
        form: {
          srcAppId: '',
          targetAppId: 0,
          targetAppName: ''
        }
      },
      modifyDialog: {
        visible: false,
        form: {
          srcAppId: '',
          targetAppId: 0,
          targetAppName: ''
        }
      },
      modifyGameDialog: {
        visible: false,
        form: {
         pendingMoney: 0,
        }
      },
      form: {},
      gameAreaName: [
        '强杀全生效',
        '强杀',
        '弱杀',
        '正常',
        '正常',
        '弱放',
        '强放',
        '强放全生效'
      ],
      robotlvl: [
        {
          value: 1,
          label: 'A机器人(强放)'
        },
        {
          value: 2,
          label: 'B机器人(弱放)'
        },
        {
          value: 3,
          label: 'C机器人(陪玩)'
        },
        {
          value: 4,
          label: 'D机器人(弱杀)'
        },
        {
          value: 5,
          label: 'E机器人(强杀)'
        }
      ],
      goodCardName: [
        '强放',
        '弱放',
        '陪玩',
        '弱杀',
        '强杀'
      ],
      labelPosition: 'top',
      subKey: 'pusoy_jackpot_egame_control',

      Uid: 0,
      VisibleUid: false,
      PlayerTableMoneyInfo: [
        {
          TableMoney: 0,
          Money: 0
        },
        {
          TableMoney: 0,
          Money: 0
        }
      ],
      editPlayerInventoryVisible: false,
      editPlayerInventory: {},
      GameRangeName: 0,
      GameMoney: 0,
      pendingMoney: 0, //最新累积待调整金额
      gameAreaId: 0,  //当前游戏库存所在群控区间
      todaySysWinMoney: 0,  //今天系统赢钱
      todayGameBet: 0,  //今天有效下注
      sevenDayMoneyBet: 0,  //7天平均有效下注
      gameRatio: 0,  //系统游戏库存
      moveRange: 0,  //群体控制移动区间
      addWeightRatio: 0,  //群体控制增加的权重值
      editVisible: false,


      editGameControl: {
        appid: 1000002,
        name: 'dayusenlin' ,
        PlayerControl:
        {
          CriticalPoint: [100, 200, 300, 400],
          PlayerControlRound: 0,
          IsSameFirst: false,
          RobotWeight: [
            {
              AiConfigLevel: 5,
              AiConfigName: 'E机器人(强杀)',
              AiWeight: [1, 1, 1, 1, 1]
            },
            {
              AiConfigLevel: 4,
              AiConfigName: 'D机器人(弱杀)',
              AiWeight: [1, 1, 1, 1, 1]
            },
            {
              AiConfigLevel: 3,
              AiConfigName: 'C机器人(陪玩)',
              AiWeight: [1, 1, 1, 1, 1]
            },
            {
              AiConfigLevel: 2,
              AiConfigName: 'B机器人(弱放)',
              AiWeight: [1, 1, 1, 1, 1]
            },
            {
              AiConfigLevel: 1,
              AiConfigName: 'A机器人(强放)',
              AiWeight: [1, 1, 1, 1, 1]
            }
          ],
        },
        GameControl: {
          ControlRange: [
            {
              MoveRange: -2, // 强杀全生效
              Ratio: 110
            },
            {
              MoveRange: -2, // 强杀移动区间
              Ratio: 120
            },
            {
              MoveRange: -1, // 弱杀移动区间
              Ratio: 130
            },
            {
              MoveRange: 0, // 正常移动区间
              Ratio:250
            },
            {
              MoveRange: 0, // 正常移动区间
              Ratio: 260
            },
            {
              MoveRange: 1, // 弱放移动区间
              Ratio: 300
            },
            {
              MoveRange: 2, // 强放移动区间
              Ratio: 350
            }
          ],
          GameAcceptance: [
            {
              TableMoney: 1000,
              Ratio: 0
            }
          ]
        },
      },
    }
  },
  created() {
    this.getData()
    this.getGameConfig()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    convertToFloat(value) {
      const num = Math.round(parseFloat(value) * 100) || 0
      return Math.floor(num)
    },
    checkControlRangeSave() {
   //   console.log(" this.editGameControl",  this.editGameControl)

      this.editGameControl.GameControl.ControlRange[3].MoveRange = this.editGameControl.GameControl.ControlRange[4].MoveRange
      const ControlRange = []
      for (let i = 0; i < this.editGameControl.GameControl.ControlRange.length; i++) {
        const tmp = this.editGameControl.GameControl.ControlRange[i]
        ControlRange.push({ MoveRange: tmp.MoveRange, Ratio: this.convertToFloat(tmp.Ratio) })
      }
    //  console.log("ControlRange", ControlRange)
      for (let i = 1; i < ControlRange.length; i++) {
        if (ControlRange[i - 1].Ratio >= ControlRange[i].Ratio) {
         //  console.log("ControlRange",ControlRange[i - 1].Ratio,  ControlRange[i].Ratio, )
          return false
        }
      }
      return true
    },
    checkPlayerCanSave() {
      if (this.editGameControl.PlayerControl.CriticalPoint.length < 1) {
        return false
      }
      for (let i = 1; i < this.editGameControl.PlayerControl.CriticalPoint.length; i++) {
        if (this.editGameControl.PlayerControl.CriticalPoint[i - 1] >= this.editGameControl.PlayerControl.CriticalPoint[i]) {
          return false
        }
      }
      return true
    },
    checkRobotWeigth() {
      for (let i = 0; i < this.editGameControl.PlayerControl.RobotWeight[0].AiWeight.length; i++) {
        let sum = 0
        for (let j = 0; j < this.editGameControl.PlayerControl.RobotWeight.length; j++) {
          const tmp = this.editGameControl.PlayerControl.RobotWeight[j]
          sum = sum + tmp.AiWeight[i]
        }
        if (sum === 0) {
          Message.error('区间匹配机器⼈权重之和为0')
          return false
        }
      }
      return true
    },
    setData() {
      if (!this.checkControlRangeSave()) {
        Message.error('群体控制临界点配置左边大于或等于右边，区间配置错误')
        return
      }

      if (!this.checkRobotWeigth()) {
        return
      }
      if (!this.checkPlayerCanSave()) {
        Message.error('个人控制临界点配置左边大于或等于右边，区间配置错误')
        return
      }

      for (let j = 0; j < this.egameData.AppControlConfig.length; j++) {
        const tmpData = this.egameData.AppControlConfig[j]
        if (this.editAppId == tmpData.AppId) {
          let saveData = structuredClone(this.editGameControl)

          saveData.PlayerControl.CriticalPoint = []
          for (let i = 0; i < this.editGameControl.PlayerControl.CriticalPoint.length; i++) {
            saveData.PlayerControl.CriticalPoint.push(this.editGameControl.PlayerControl.CriticalPoint[i] * 100)
          }

          saveData.GameControl.ControlRange = []
          for (let i = 0; i < this.editGameControl.GameControl.ControlRange.length; i++) {
            const tmp = this.editGameControl.GameControl.ControlRange[i]
            saveData.GameControl.ControlRange.push({ MoveRange: tmp.MoveRange, Ratio: this.convertToFloat(tmp.Ratio) })
          }


          saveData.GameControl.GameAcceptance = []
          for (let i = 0; i < this.editGameControl.GameControl.GameAcceptance.length; i++) {
            const tmp = this.editGameControl.GameControl.GameAcceptance[i]
            saveData.GameControl.GameAcceptance.push({ TableMoney: tmp.TableMoney, Ratio: this.convertToFloat(tmp.Ratio) })
          }
          if (saveData.PlayerControl.CriticalPoint.length == 0) {
            Message.error('场次采信库存配置为空')
            return
          }
          this.egameData.AppControlConfig[j] = structuredClone(saveData)

        }
      }


      // console.log("save", this.egameData)
      this.form.Data = JSON.stringify(this.egameData)
      const $this = this

      // console.log("this.form.Data",  this.form.Data)
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form)
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
            Message.success('保存成功')
          }
        })
      })
    },
    getData() {
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.form = response.Data || {}
          //console.log("this.form ",response.Data.Data)
          // eslint-disable-next-line no-empty
          if (response.Data && response.Data.Data !== '') {
            let dataList = JSON.parse(response.Data.Data)
            this.egameData =  structuredClone(dataList)
            this.egameData.AppControlConfig = []

            for (let i = 0; i < dataList.AppControlConfig.length; i++) {
              let isSame = false;
              for (let j = i+1; j < dataList.AppControlConfig.length; j++) {
                if (dataList.AppControlConfig[i].AppId == dataList.AppControlConfig[j].AppId) {
                  isSame = true;
                  break;
                }
              }
              if (isSame) {
                continue;
              }
              this.egameData.AppControlConfig.push(dataList.AppControlConfig[i])

            }
          //  console.log("egameDataa", this.egameData)

            let appidIndex = 0
            for (let i = 0; i < this.egameData.AppControlConfig.length; i++) {
              if (this.egameData.AppControlConfig[i].AppId == this.editAppId) {
                 appidIndex = i;
              }
            }
            this.copyDataToEidt(this.egameData.AppControlConfig[appidIndex])
            // 设置修改之前数据
            this.$refs.compare.SetOldVal(response.Data)

            console.log("editAppId", this.editAppId)

          } else {
            Message.error('保存失败')
          }
        }
      })
    },

    copyDataToEidt(appControlConfig) {
        this.editAppId = appControlConfig.AppId
        this.editGameControl = structuredClone(appControlConfig)
        const tmpData = appControlConfig

        this.editGameControl.GameControl.ControlRange = []
        for (let i = 0; i < tmpData.GameControl.ControlRange.length; i++) {
          const tmp = tmpData.GameControl.ControlRange[i]
          this.editGameControl.GameControl.ControlRange.push({ MoveRange: tmp.MoveRange, Ratio: (tmp.Ratio / 100).toString() })
        }

        this.editGameControl.GameControl.GameAcceptance = []
        for (let i = 0; i < tmpData.GameControl.GameAcceptance.length; i++) {
          const tmp = tmpData.GameControl.GameAcceptance[i]
          this.editGameControl.GameControl.GameAcceptance.push({ TableMoney: tmp.TableMoney, Ratio: (tmp.Ratio / 100).toString() })
        }

        this.editGameControl.PlayerControl.CriticalPoint = []
        for (let i = 0; i < tmpData.PlayerControl.CriticalPoint.length; i++) {
          this.editGameControl.PlayerControl.CriticalPoint.push(tmpData.PlayerControl.CriticalPoint[i] / 100)
        }

    },

    handleFilter() {
      this.getData()
    },

    handleTabClick(tab) {
      if (tab.name === 'gameMoneyQuery') {
        this.handleRefreshGameMoney()
      } else if (tab.name === 'gameInfoQuery') {
        this.showGameMoney()
      } else if (tab.name === 'playerInfoQuery') {
        this.handleRefreshPlayerLevels()
      }
    },
    showGameMoney() {
      const gameAcceptance = []
      for (let j = 0; j < this.tableData.length; j++) {
        const tableMoney = this.tableData[j].TableMoney
        let f = false
        for (let i = 0; i < this.editGameControl.GameControl.GameAcceptance.length; i++) {
          const levelTableMoney = this.editGameControl.GameControl.GameAcceptance[i].TableMoney
          if (tableMoney === levelTableMoney) {
            f = true
            gameAcceptance.push(this.editGameControl.GameControl.GameAcceptance[i])
            break
          }
        }
        if (!f) {
          gameAcceptance.push({ TableMoney: tableMoney, Ratio: 0 })
        }
      }
      gameAcceptance.sort((a, b) => a.TableMoney - b.TableMoney)
      this.editGameControl.GameControl.GameAcceptance = []
      for (let i = 0; i < gameAcceptance.length; i++) {
        const tmp = gameAcceptance[i]
        this.editGameControl.GameControl.GameAcceptance.push({ TableMoney: tmp.TableMoney, Ratio: (tmp.Ratio / 100).toString() })
      }
      this.editGameControl.GameControl.GameAcceptance = gameAcceptance
    },

    handleRefreshPlayerLevels() {
      this.PlayerTableMoneyInfo = []
      for (let i = 0; i < this.tableData.length; i++) {
        this.PlayerTableMoneyInfo.push({ TableMoney: this.tableData[i].TableMoney, Money: 0 })
      }
      this.PlayerTableMoneyInfo.sort((a, b) => a.TableMoney - b.TableMoney)
    },
    handleGetPlayerAllLevelMoney() {
      if (this.Uid === 0) {
        Message.warning('用户不存在')
        return
      }
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          gid: this.gameId,
          uid: this.Uid,
          appid: this.editAppId,
          Path: '/egamecontorl/player/table/money/info'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          console.log("objs", objs)
          this.handleRefreshPlayerLevels()
          if (objs.isFind === 0) {
            Message.warning('该用户在Tongits JP数据为空')
            this.VisibleUid = false
            return
          }
          this.VisibleUid = true
          Message.success('刷新成功！')

          if (objs.list === undefined) {
            objs.list = []
          }
          for (let j = 0; j < objs.list.length; j++) {
            for (let i = 0; i < this.PlayerTableMoneyInfo.length; i++) {
              if (objs.list[j].tableMoney === this.PlayerTableMoneyInfo[i].TableMoney) {
                this.PlayerTableMoneyInfo[i].Money = objs.list[j].money / 1000
                break
              }
            }
          }
         // this.getPlayerRobotInfo()
        } else {
          Message.warning('该用户在Tongits JP数据为空')
          this.VisibleUid = false
        }
      })
    },

    handleUpdatePlayerLevelMoney(row) {
      if (this.Uid === 0 || !this.VisibleUid) {
        Message.warning('请输入正确的uid')
        return
      }

      this.editPlayerInventoryVisible = true
      this.editPlayerInventory = row
    },

    savePlayerLevelMoney() {
      if (!this.editPlayerInventoryVisible) {
        return
      }
      // console.log("savePlayerLevelMoney:", this.editPlayerInventory )
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          gid: this.gameId,
          uid: this.Uid,
          appid: this.editAppId,
          tableMoney: this.editPlayerInventory.TableMoney,
          value: this.editPlayerInventory.Money * 1000,
          Path: '/egamecontorl/set/player/table/money/info'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功')
          this.editPlayerInventoryVisible = false
        }
      })
    },
    handleUpdateGameMoney() {
      this.modifyGameDialog.visible = false
      this.pendingMoney = this.modifyGameDialog.form.pendingMoney

      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          gid: this.gameId,
          appid: this.editAppId,
          value: this.pendingMoney*1000,
          Path: '/egamecontorl/set/game/pending/money'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          Message.success('保存成功')
        }
      })
    },
    handleRefreshGameMoney() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          gid: this.gameId,
          appid: this.editAppId,
          Path: '/egamecontorl/game/pending/money'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          Message.success('刷新成功！')
          this.pendingMoney = objs.pendingMoney/1000

          this.gameAreaId = objs.gameAreaId
          this.todaySysWinMoney = objs.todaySysWinMoney  /= 1000
          this.todayGameBet = objs.todayGameBet  /= 1000
          this.sevenDayMoneyBet = objs.sevenDayMoneyBet  /= 1000
          this.gameRatio = objs.gameRatio
          this.moveRange = objs.moveRange
          this.addWeightRatio = objs.addWeightRatio


          if (objs.gameAreaId < 0) {
            this.GameRangeName = this.gameAreaName[0]
          } else if (objs.gameAreaId >= this.gameAreaName.length) {
            this.GameRangeName = this.gameAreaName[7]
          } else {
            this.GameRangeName = this.gameAreaName[objs.gameAreaId]
          }
        }
      })
    },
    getPlayerRobotInfo() {
      request({
        url: '/dataProxy/info',
        method: 'get',
        data: {
          Env: this.env,
          gid: this.gameId,
          uid: 11246954,
          appid: this.editAppId,
          tableMoney: 10000,
          Path: '/egamecontorl/player/robot/level'
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          console.log("objs", objs)
        }
      })
    },
    getGameConfig() {
      request({
        url: '/pusoyjptable/all',
        method: 'get',
        data: {}
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || []
          const data = objs
          this.tableData = []
          for (let j = 0; j < data.length; j++) {
            let hasLevel = false
            const tableMoney = data[j].TableMoney
            for (let j = 0; j < this.tableData.length; j++) {
              if (this.tableData[j].TableMoney === tableMoney) {
                hasLevel = true
              }
            }
            if (hasLevel) {
              continue
            }
            this.tableData.push(data[j])
          }
        }
      })
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    handleDecimalInput(row, key) {
      // 1. 过滤非法字符（只保留数字和小数点）
      let value = row[key] ? row[key].toString() : '0'
      value = value.replace(/[^\d.]/g, '').replace(/^0+(\d)/, '$1').replace(/^\./, '0.').replace(/(\..*)\./g, '$1')
      // 2. 禁止以小数点开头（如 ".5" → "0.5"）
      if (value.startsWith('.')) {
        value = '0' + value
      }

      // 3. 确保最多一个小数点
      const parts = value.split('.')
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('')
      }

      // 4. 限制小数点后最多两位（百分比通常只需两位小数）
      if (parts.length === 2 && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].slice(0, 2)
      }
      const numValue = parseFloat(value) || 0
      if (numValue < 0) {
        value = '0'
      } else if (numValue > 100) {
        value = '100'
      } else if (isNaN(numValue)) {
        value = '0' // 异常值重置为 0
      }
      // 5. 更新绑定的值（保留字符串类型，避免自动转换问题）
      row[key] = value === '' ? null : value
    },

    // 处理百分比输入（0-100%）
    handlePercentInput(obj, key, min = 0, max = 100) {
      let value = obj[key]?.toString() || '0'
      value = value.replace(/[^\d.]/g, '').replace(/^0+(\d)/, '$1').replace(/^\./, '0.').replace(/(\..*)\./g, '$1')
      const parts = value.split('.')
      if (parts.length > 1) {
        value = `${parts[0]}.${parts[1].slice(0, 2)}`
      }

      // 实时范围限制
      const numValue = parseFloat(value) || 0
      if (numValue > max) value = max.toString()
      if (numValue < min) value = min.toString()
      obj[key] = value
    },
    onSearch() {
      for (let i = 0; i < this.egameData.AppControlConfig.length; i++) {
        const tmp = this.egameData.AppControlConfig[i]
        if (tmp.AppId == this.editAppId) {
          this.copyDataToEidt(tmp)
          break
        }
      }
    },
    handleUpdateAppid(appid) {
        this.onSearch()
    },
    handleShowCopyDialog() {
      this.copyDialog.visible = true
      this.copyDialog.form.srcAppId = this.editAppId
      this.copyDialog.form.targetAppId = ''
    },

    handleShowModifyDialog() {
      this.modifyDialog.visible = true
      this.modifyDialog.form.srcAppId = this.editAppId
      this.modifyDialog.form.targetAppId = ''
    },

    handleShowModifyGameDialog() {
      this.modifyGameDialog.visible = true
    },

    handleCopy() {
      if (this.copyDialog.form.targetAppId == 0) {
        Message.error('请输入目标AppId')
        return
      }

      if (this.copyDialog.form.targetAppId == this.copyDialog.form.srcAppId) {
        Message.error('源渠道和目标渠道相同')
        return
      }

      let isFind = false
      for (let i = 0; i < this.egameData.AppControlConfig.length; i++) {
        const tmp = this.egameData.AppControlConfig[i]
        if (tmp.AppId == this.copyDialog.form.srcAppId) {
          let copyData = structuredClone(this.egameData.AppControlConfig[i])
          copyData.AppId = this.copyDialog.form.targetAppId

          let name = ""
          for (let k = 0; k < APPID_OPTIONS.length; k++) {
            if (this.copyDialog.form.targetAppId == APPID_OPTIONS[k].value) {
              name = APPID_OPTIONS[k].label
            }
          }

          copyData.AppName = name

          for (let j = 0; j < this.egameData.AppControlConfig.length; j++) {
            const target = this.egameData.AppControlConfig[j];
            if (target.AppId  == this.copyDialog.form.targetAppId) {
                isFind = true;
                this.egameData.AppControlConfig[j] = copyData
                break
            }
          }
          if (!isFind) {
            this.egameData.AppControlConfig.push(copyData)
            this.copyDataToEidt(copyData)
            isFind = true
          }
          break
        }
      }
      if (!isFind) {
        Message.error('同步失败')
        return
      } else {
        Message.info('同步成功')
      }
      this.copyDialog.visible = false
    },

    getRobotName(aiLevel) {
      let name = ""
      for (let i = 0; i < this.robotlvl.length; i++) {
        if (aiLevel === this.robotlvl[i].value) {
          name =  this.robotlvl[i].label
          break
        }
      }
      return name
    },
  },

}
</script>

