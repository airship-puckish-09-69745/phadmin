<template>
  <div id="app" class="page-container" style="padding: 10px">
    <el-row>
      <publish primary-key="ID" :key-id="getConfigKey()" :check="configCheck" :env-empty="true" />
    </el-row>
    <el-row style="padding-top: 5px">
      <el-col :span="20">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate()"
        >添加配置项
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
      </el-col>
    </el-row>
    <div style="padding-top: 10px">
      <el-table
        ref="filterTable"
        :data="tableData"
        stripe
        border
        :header-cell-style="libShow.DefaultTableHeadClass"
        :row-style="{height:'10px'}"
        :cell-style="libShow.DefaultTableCell"
        style="width: 100%"
        @sort-change="sortChange"
      >
        <el-table-column
          prop="ID"
          label="ID"
          sortable
          width="150"
        />
        <el-table-column
          prop="Level"
          label="智慧"
          sortable
          width="100"
        />
        <el-table-column
          prop="Name"
          label="名称"
          sortable
          width="150"
        />
        <el-table-column
          prop="Rate"
          label="分配比例"
          column-key="Rate"
          sortable
          width="150"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.Rate" size="mini" @blur="updateRate(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="LastModify"
          label="最近修改"
          width="100"
        />
        <el-table-column
          prop="ModifyTime"
          label="修改时间"
          width="150"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.ModifyTime) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          column-key="op"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑/查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="getEditTitle()"
      width="90%"
      :visible.sync="edit.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="edit" label-width="100px" size="small">
        <el-form-item label="AI名称：">
          <el-col :span="10">
            <el-input v-model="edit.item.Name" size="mini" />
          </el-col>
          <el-col :span="4" :offset="6">

            <el-upload
              class="upload-demo"
              :action="actionURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :with-credentials="true"
              :before-remove="beforeRemove"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="edit.fileList"
            >
              <el-button size="small" type="primary">导入数据</el-button>
            </el-upload>
          </el-col>
        </el-form-item>
        <el-tabs type="border-card">
          <el-tab-pane key="tab1" label="不看牌">
            <el-col :span="8">
              <el-form-item label="大底池倍数:">
                <el-input v-model.number="edit.men.BigBet" size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="首轮看牌率">
                <el-input v-model.number="edit.men.SeeRate" size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="危险看牌率">
                <el-input v-model.number="edit.men.FollowSeeRate" size="mini" />
              </el-form-item>
            </el-col>
            <div style="font-weight: bold;size:16px;padding: 10px;"> 闷牌时策略：</div>
            <table class="table table-border table-bordered table-bg table-striped" cellspacing="0" cellpadding="0">
              <thead>
                <tr class="text-c">
                  <th width="80" rowspan="2">最终输赢</th>
                  <th width="120" colspan="3">小于等于{{ edit.men.BigBet }}底注</th>
                  <th width="120" colspan="3">大于{{ edit.men.BigBet }}底注</th>
                </tr>
                <tr>
                  <th>跟注率(%)</th>
                  <th>加注率(%)</th>
                  <th>弃牌率(%)</th>
                  <th>跟注率(%)</th>
                  <th>加注率(%)</th>
                  <th>弃牌率(%)</th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-c">
                  <td>
                    赢
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.men.Win.Small.Call"
                      size="mini"
                      @blur="checkInt(edit.men.Win.Small.Call,0,100)"
                    />
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.men.Win.Small.Raise"
                      size="mini"
                      @blur="checkInt(edit.men.Win.Small.Raise,0,100)"
                    />
                  </td>
                  <td>
                    {{ 100 - edit.men.Win.Small.Raise - edit.men.Win.Small.Call }}%
                  </td>

                  <td>
                    <el-input
                      v-model.number="edit.men.Win.Big.Call"
                      size="mini"
                      @blur="checkInt(edit.men.Win.Big.Call,0,100)"
                    />
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.men.Win.Big.Raise"
                      size="mini"
                      @blur="checkInt(edit.men.Win.Big.Raise,0,100)"
                    />
                  </td>
                  <td>
                    {{ 100 - edit.men.Win.Big.Raise - edit.men.Win.Big.Call }}%
                  </td>

                </tr>
                <tr class="text-c">
                  <td>
                    输
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.men.Lose.Small.Call"
                      size="mini"
                      @blur="checkInt(edit.men.Lose.Small.Call,0,100)"
                    />
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.men.Lose.Small.Raise"
                      size="mini"
                      @blur="checkInt(edit.men.Lose.Small.Raise,0,100)"
                    />
                  </td>
                  <td>
                    {{ 100 - edit.men.Lose.Small.Raise - edit.men.Lose.Small.Call }}%
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.men.Lose.Big.Call"
                      size="mini"
                      @blur="checkInt(edit.men.Lose.Big.Call,0,100)"
                    />
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.men.Lose.Big.Raise"
                      size="mini"
                      @blur="checkInt(edit.men.Lose.Big.Raise,0,100)"
                    />
                  </td>
                  <td>
                    {{ 100 - edit.men.Lose.Big.Raise - edit.men.Lose.Big.Call }}%
                  </td>
                </tr>
              </tbody>
            </table>
            <div style="font-weight: bold;size:16px;padding: 10px;"> 非危险，每轮看牌率：(千分之N)</div>
            <table class="table table-border table-bordered table-bg table-striped" cellspacing="0" cellpadding="0">
              <thead>
                <tr class="text-c">
                  <th width="120">轮数</th>
                  <th width="120">概率</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(o,idx) in edit.men.FirstSeeRate" :key="idx" class="text-c">
                  <td>
                    {{ idx+1 }}
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.men.FirstSeeRate[idx]"
                      size="mini"
                      @blur="checkInt(o,0,100)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <el-tab-pane v-if="edit.see!=null" key="tab2" label="看牌">
            <el-tabs type="border-card">
              <el-tab-pane key="tab1" label="底池0-80倍">
                <table class="table table-border table-bordered table-bg table-striped" cellspacing="0" cellpadding="0">
                  <thead>
                    <tr class="text-c">
                      <th width="70" rowspan="2">序号
                      </th>
                      <th rowspan="2" width="100">牌型</th>
                      <th width="25" rowspan="2">输赢</th>
                      <th colspan="4">0-10</th>
                      <th colspan="4">11-20</th>
                      <th colspan="4">21-40</th>
                      <th colspan="4">41-80</th>
                    </tr>
                    <tr>
                      <template v-for="i in 4">
                        <th>跟(%)</th>
                        <th>加(%)</th>
                        <th>比(%)</th>
                        <th>弃(%)</th>
                      </template>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(obj,index) in edit.see.Rules" :key="index" class="text-c">
                      <td>
                        <el-col :span="8">{{ index }}</el-col>
                      </td>
                      <td style="padding: 0px">
                        {{ cardTypeNames[obj.Type] }}
                      </td>
                      <td>
                        <span v-if="obj.Win" style="color:green">赢</span>
                        <span v-else style="color: red">输</span>
                      </td>
                      <template v-for="i in 4">
                        <td>
                          <el-input
                            v-model.number="obj.Configs[i-1].Call"
                            size="mini"
                            @blur="checkInt(obj.Configs[i-1].Call,0,100)"
                          />
                        </td>
                        <td>
                          <el-input
                            v-model.number="obj.Configs[i-1].Raise"
                            size="mini"
                            @blur="checkInt(obj.Configs[i-1].Raise,0,100)"
                          />
                        </td>
                        <td>
                          <el-input
                            v-model.number="obj.Configs[i-1].Compare"
                            size="mini"
                            @blur="checkInt(obj.Configs[i-1].Compare,0,100)"
                          />
                        </td>
                        <td>
                          <span v-if="100 - obj.Configs[i-1].Call - obj.Configs[i-1].Raise-obj.Configs[i-1].Compare" style="color:red">{{ 100 - obj.Configs[i-1].Call - obj.Configs[i-1].Raise-obj.Configs[i-1].Compare }}%</span>
                          <span v-else>{{ 100 - obj.Configs[i-1].Call - obj.Configs[i-1].Raise-obj.Configs[i-1].Compare }}%</span>
                        </td>
                      </template>
                    </tr>
                  </tbody>
                </table>
              </el-tab-pane>
              <el-tab-pane key="tab1" label="底池81-450倍">
                <table class="table table-border table-bordered table-bg table-striped" cellspacing="0" cellpadding="0">
                  <thead>
                    <tr class="text-c">
                      <th width="70" rowspan="2">序号
                      </th>
                      <th rowspan="2" width="100">牌型</th>
                      <th width="25" rowspan="2">输赢</th>
                      <th colspan="4">81-120</th>
                      <th colspan="4">121-200</th>
                      <th colspan="4">201-300</th>
                      <th colspan="4">301-450</th>
                    </tr>
                    <tr>
                      <template v-for="i in 4">
                        <th>跟(%)</th>
                        <th>加(%)</th>
                        <th>比(%)</th>
                        <th>弃(%)</th>
                      </template>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(obj,index) in edit.see.Rules" :key="index" class="text-c">
                      <td>
                        <el-col :span="8">{{ index }}</el-col>
                      </td>
                      <td style="padding: 0px">
                        {{ cardTypeNames[obj.Type] }}
                      </td>
                      <td>
                        <span v-if="obj.Win" style="color:green">赢</span>
                        <span v-else style="color: red">输</span>
                      </td>
                      <template v-for="i in 4">
                        <td>
                          <el-input
                            v-model.number="obj.Configs[i+3].Call"
                            size="mini"
                            @blur="checkInt(obj.Configs[i+3].Call,0,100)"
                          />
                        </td>
                        <td>
                          <el-input
                            v-model.number="obj.Configs[i+3].Raise"
                            size="mini"
                            @blur="checkInt(obj.Configs[i+3].Raise,0,100)"
                          />
                        </td>
                        <td>
                          <el-input
                            v-model.number="obj.Configs[i+3].Compare"
                            size="mini"
                            @blur="checkInt(obj.Configs[i+3].Compare,0,100)"
                          />
                        </td>
                        <td>
                          <span v-if="100 - obj.Configs[i+3].Call - obj.Configs[i+3].Raise-obj.Configs[i+3].Compare" style="color:red">{{ 100 - obj.Configs[i+3].Call - obj.Configs[i+3].Raise-obj.Configs[i+3].Compare }}%</span>
                          <span v-else>{{ 100 - obj.Configs[i+3].Call - obj.Configs[i+3].Raise-obj.Configs[i+3].Compare }}%</span>
                        </td>
                      </template>
                    </tr>
                  </tbody>
                </table>
              </el-tab-pane>
              <el-tab-pane key="tab1" label="底池450以上">
                <table class="table table-border table-bordered table-bg table-striped" cellspacing="0" cellpadding="0">
                  <thead>
                    <tr class="text-c">
                      <th width="70" rowspan="2">序号
                      </th>
                      <th rowspan="2" width="100">牌型</th>
                      <th width="25" rowspan="2">输赢</th>
                      <th colspan="4">451-600</th>
                      <th colspan="4">601-800</th>
                      <th colspan="4">大于800</th>
                    </tr>
                    <tr>
                      <template v-for="i in 3">
                        <th>跟(%)</th>
                        <th>加(%)</th>
                        <th>比(%)</th>
                        <th>弃(%)</th>
                      </template>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(obj,index) in edit.see.Rules" :key="index" class="text-c">
                      <td>
                        <el-col :span="8">{{ index }}</el-col>
                      </td>
                      <td style="padding: 0px">
                        {{ cardTypeNames[obj.Type] }}
                      </td>
                      <td>
                        <span v-if="obj.Win" style="color:green">赢</span>
                        <span v-else style="color: red">输</span>
                      </td>
                      <template v-for="i in 3">
                        <td>
                          <el-input
                            v-model.number="obj.Configs[i+7].Call"
                            size="mini"
                            @blur="checkInt(obj.Configs[i+7].Call,0,100)"
                          />
                        </td>
                        <td>
                          <el-input
                            v-model.number="obj.Configs[i+7].Raise"
                            size="mini"
                            @blur="checkInt(obj.Configs[i+7].Raise,0,100)"
                          />
                        </td>
                        <td>
                          <el-input
                            v-model.number="obj.Configs[i+7].Compare"
                            size="mini"
                            @blur="checkInt(obj.Configs[i+7].Compare,0,100)"
                          />
                        </td>
                        <td>
                          <span v-if="100 - obj.Configs[i+7].Call - obj.Configs[i+7].Raise-obj.Configs[i+7].Compare" style="color:red">{{ 100 - obj.Configs[i+7].Call - obj.Configs[i+7].Raise-obj.Configs[i+7].Compare }}%</span>
                          <span v-else>{{ 100 - obj.Configs[i+7].Call - obj.Configs[i+7].Raise-obj.Configs[i+7].Compare }}%</span>
                        </td>
                      </template>
                    </tr>
                  </tbody>
                </table>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane key="tab3" label="接受比牌策略">
            <table class="table table-border table-bordered table-bg table-striped" cellspacing="0" cellpadding="0">
              <thead>
                <tr class="text-c">
                  <th width="100">序号
                  </th>
                  <th>牌型</th>
                  <th width="150">概率</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj,index) in edit.coms" :key="index" class="text-c">
                  <td>{{ index + 1 }}
                  </td>
                  <td style="padding: 0px">
                    {{ cardTypeNames[obj.Type] }}
                  </td>
                  <td>
                    <el-input
                      v-model.number="obj.Rate"
                      size="mini"
                      @blur="checkInt(obj.Rate,0,100)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <el-tab-pane v-if="edit.see!=null" key="tab4" label="操作限制">
            <table class="table table-border table-bordered table-bg table-striped" cellspacing="0" cellpadding="0">
              <thead>
                <tr class="text-c">
                  <th width="70" rowspan="2">序号
                  </th>
                  <th rowspan="2" width="100">牌型</th>
                  <th width="25" rowspan="2">输赢</th>
                  <th width="100">底池上限</th>
                  <th width="100">下注上限</th>
                  <th width="200">可赢上限打折(%)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj,index) in edit.see.Rules" :key="index" class="text-c">
                  <td>
                    <el-col :span="8">{{ index }}</el-col>
                  </td>
                  <td style="padding: 0px">
                    {{ cardTypeNames[obj.Type] }}
                  </td>
                  <td>
                    <span v-if="obj.Win" style="color:green">赢</span>
                    <span v-else style="color: red">输</span>
                  </td>
                  <td>
                    <el-input
                      v-if="!obj.Win"
                      v-model.number="obj.PoolMax"
                      size="mini"
                      @blur="checkInt(obj.PoolMax,0,100)"
                    />
                  </td>
                  <td>
                    <el-input
                      v-if="!obj.Win"
                      v-model.number="obj.BetMax"
                      size="mini"
                      @blur="checkInt(obj.BetMax,0,100)"
                    />
                  </td>
                  <td>
                    <el-input
                      v-if="!obj.Win"
                      v-model.number="obj.WinLimitDiscount"
                      size="mini"
                      @blur="checkInt(obj.WinLimitDiscount,0,100)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <el-tab-pane key="tab5" label="操作时长">
            <table v-if="edit.see" class="table table-border table-bordered table-bg table-striped" cellspacing="0" cellpadding="0">
              <thead>
                <tr class="text-c">
                  <th width="100" />
                  <th width="100">
                    操作
                  </th>
                  <th width="100">Min(秒）</th>
                  <th width="100">Max(秒）</th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-c">
                  <td rowspan="4">
                    大倍数(64倍)
                  </td>
                  <td style="padding: 0px">
                    跟：
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.see.MinOperateTime[0]"
                      size="mini"
                      @blur="checkInt(edit.see.MinOperateTime[0],0,100)"
                    />
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.see.MaxOperateTime[0]"
                      size="mini"
                      @blur="checkInt(edit.see.MaxOperateTime[0],0,100)"
                    />
                  </td>
                </tr>
                <tr class="text-c">
                  <td style="padding: 0px">
                    加：
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.see.MinOperateTime[1]"
                      size="mini"
                      @blur="checkInt(edit.see.MinOperateTime[1],0,100)"
                    />
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.see.MaxOperateTime[1]"
                      size="mini"
                      @blur="checkInt(edit.see.MaxOperateTime[1],0,100)"
                    />
                  </td>
                </tr>
                <tr class="text-c">
                  <td style="padding: 0px">
                    弃：
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.see.MinOperateTime[2]"
                      size="mini"
                      @blur="checkInt(edit.see.MinOperateTime[2],0,100)"
                    />
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.see.MaxOperateTime[2]"
                      size="mini"
                      @blur="checkInt(edit.see.MaxOperateTime[2],0,100)"
                    />
                  </td>
                </tr>
                <tr class="text-c">
                  <td style="padding: 0px">
                    比：
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.see.MinOperateTime[3]"
                      size="mini"
                      @blur="checkInt(edit.see.MinOperateTime[3],0,100)"
                    />
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.see.MaxOperateTime[3]"
                      size="mini"
                      @blur="checkInt(edit.see.MaxOperateTime[3],0,100)"
                    />
                  </td>
                </tr>
                <tr class="text-c">
                  <td rowspan="4">
                    小倍数
                  </td>
                  <td style="padding: 0px">
                    跟：
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.see.MinOperateTime[4]"
                      size="mini"
                      @blur="checkInt(edit.see.MinOperateTime[4],0,100)"
                    />
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.see.MaxOperateTime[4]"
                      size="mini"
                      @blur="checkInt(edit.see.MaxOperateTime[4],0,100)"
                    />
                  </td>
                </tr>
                <tr class="text-c">
                  <td style="padding: 0px">
                    加：
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.see.MinOperateTime[5]"
                      size="mini"
                      @blur="checkInt(edit.see.MinOperateTime[5],0,100)"
                    />
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.see.MaxOperateTime[5]"
                      size="mini"
                      @blur="checkInt(edit.see.MaxOperateTime[5],0,100)"
                    />
                  </td>
                </tr>
                <tr class="text-c">
                  <td style="padding: 0px">
                    弃：
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.see.MinOperateTime[6]"
                      size="mini"
                      @blur="checkInt(edit.see.MinOperateTime[6],0,100)"
                    />
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.see.MaxOperateTime[6]"
                      size="mini"
                      @blur="checkInt(edit.see.MaxOperateTime[6],0,100)"
                    />
                  </td>
                </tr>
                <tr class="text-c">
                  <td style="padding: 0px">
                    比：
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.see.MinOperateTime[7]"
                      size="mini"
                      @blur="checkInt(edit.see.MinOperateTime[7],0,100)"
                    />
                  </td>
                  <td>
                    <el-input
                      v-model.number="edit.see.MaxOperateTime[7]"
                      size="mini"
                      @blur="checkInt(edit.see.MaxOperateTime[7],0,100)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
        </el-tabs>
        <div>
          <el-col :span="2" :offset="16">
            <el-button type="primary" size="mini" @click="save(false)">保存</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="success" size="mini" @click="save(true)">保存并关闭</el-button>
          </el-col>
        </div>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>
<style>
.table .text-c th, .table .text-c td {
  text-align: center;
}
.table-bg thead th {
  background-color: #f5fafe;
}
.table-bordered th, .table-bordered td {
  border: 1px solid #ddd;
}
.table-border th, .table-border td {
  border-bottom: 1px solid #ddd;
}
.table th, .table td {
  padding: 8px;
  line-height: 20px;
  word-break: break-all;
  border-collapse: collapse;
}

.table th {
  font-weight: bold;
}
</style>

<script>
import { $libDate, $libShow, $libType, ClientTableData, DataRule } from '@/utils/common'
import store from '@/store'
import request from '@/utils/request'
import Compare from '@/components/Compare'
import { Message } from 'element-ui'
import Publish from '@/components/Publish'

const filterMap = {}

function newObject() {
  return {
    Win: true,
    Type: 1,
    Call: 0,
    Raise: 0,
    Compare: 0
  }
}

export default {
  components: { Compare, Publish },
  data() {
    return {
      tableData: [],
      libShow: $libShow,
      env: 'test',
      game: this.$route.meta.gid,
      configKey: 'teenPattiAIConfig',
      cardTypeNames: {
        601: '豹子10上',
        600: '豹子',
        501: '同花顺10上',
        500: '同花顺',
        301: '顺子10上',
        300: '顺子',
        401: '同花10上',
        400: '同花',
        201: 'AA',
        213: 'KK',
        212: 'QQ',
        211: 'JJ',
        210: 'TT',
        209: '99',
        208: '88',
        207: '77',
        206: '66',
        205: '55',
        204: '44',
        203: '33',
        202: '22',
        101: 'A',
        113: 'K',
        112: 'Q',
        100: '其他'
      },

      edit: {
        visible: false,
        fileName: '',
        fileList: [],
        editItem: '',
        isEdit: false,
        item: {
          Name: '',
          ID: 0,
          Game: this.$route.meta.gid
        },
        men: {
          BigBet: 30, // 大底池倍数
          SeeRate: 5, // 首轮看牌率
          FollowSeeRate: 50, // 跟随看牌率
          FirstSeeRate: [], // 全闷时分轮次看牌率
          Win: { Small: newObject(), Big: newObject() },
          Lose: { Small: newObject(), Big: newObject() }
        },
        see: null,
        coms: [{
          Type: 1,
          Rate: 1
        }]
      }

    }
  },
  computed: {
    actionURL() {
      return process.env.VUE_APP_BASE_API + '/other/upload'
    }
  },
  created() {
    this.env = store.getters.env || this.env
    this.getList()
    console.log(1)
  },
  methods: {
    getConfigKey() {
      if (this.game === 9) {
        this.configKey = 'teenPattiAIConfig2'
      } else if (this.game === 14) {
        this.configKey = 'teenPattiProAIConfig'
      } else {
        this.configKey = 'ak47AIConfig2'
      }
      return this.configKey
    },
    formatNumber(n) {
      return n.toLocaleString()
    },
    formatTime(ts) {
      return $libDate.FormateSecondStr(ts, 2)
    },
    clearFilter() {
      this.clientDB.ClearFilterMap()
      this.refreshShow()
    },
    handleFilter() {
      this.clientDB.FilterData()
      this.refreshShow()
    },
    // 分页处理
    refreshShow() {
      this.tableData = this.clientDB.GetCurrentPageData()
    },
    handleSizeChange(val) {
      this.clientDB.GetPage().SetPageNum(val)
      this.refreshShow()
    },
    handleCurrentChange(val) {
      this.clientDB.GetPage().SetPageNo(val)
      this.refreshShow()
    },

    sortChange(ob) {
      this.clientDB.SortByProp(ob.prop, ob.order)
      this.refreshShow()
    },
    // 操作类函数
    handleEdit(ob) {
      this.initFormData(true, ob.ID)
      this.edit.visible = true
    },

    handleCreate() {
      this.edit.item = newObject()
      this.edit.isEdit = false
      this.edit.visible = true
    },
    handleCopy(ob) {
      this.initFormData(false, ob.ID)
      this.edit.visible = true
    },
    getList() {
      request({
        url: '/aitype/all',
        method: 'get',
        data: {
          game: this.game
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const objs = response.Data || {}
          this.clientDB = new ClientTableData(objs, 10, filterMap, 'ID', -1)
          this.handleCurrentChange(1)
        }
      })
    },
    handlePrepare(ob) {
      this.changeStatus(ob.ID, 2, '您确定要将记录状态修改为"上架"吗？该记录将在发布后同步到外网。')
    },
    handleOffline(ob) {
      this.changeStatus(ob.ID, 6, '您确定要将记录下架吗？下架的记录将在发布后从线上消失。')
    },
    handleDelete(ob) {
      this.changeStatus(ob.ID, 3, '您确定要将记录状态修改为废弃吗？')
    },
    configCheck() {
      let rate = 0
      for (const i in this.clientDB.TotalData) {
        const ob = this.clientDB.TotalData[i]
        rate += ob.Rate
      }
      if (rate > 100) {
        this.$alert('所有AI配置的分配占比不能超过100%，当前为：' + rate)
        return false
      }
      return true
    },
    //* * ********************** 修改/添加弹框相关 *****************
    getEditTitle() {
      return this.edit.isEdit ? '修改配置' : '新增配置'
    },
    initFormData(bEdit, ID) {
      const $this = this
      this.edit.fileList = []
      this.edit.isEdit = bEdit
      if (ID) {
        request({
          url: '/aitype/one',
          method: 'get',
          data: {
            ID: ID
          }
        }).then(response => {
          if (response.RetCode === 0) {
            const ob = response.Data
            Object.assign($this.edit.item, ob)
            $this.$refs.compare.SetOldVal($this.edit.item)

            $this.edit.men = JSON.parse(ob.PreFlopStr)
            $this.edit.see = JSON.parse(ob.FlopStr)
            $this.edit.coms = JSON.parse(ob.TurnStr)
            console.log($this.edit.see)
          }
        })
      }
    },
    dataRule(required, config) {
      return DataRule(required, config)
    },
    createSave(postData) {
      request({
        url: '/aitype/create',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.AddData(response.Data)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    updateRate(ob) {
      request({
        url: 'aitype/update/rate',
        method: 'post',
        data: {
          ID: ob.ID,
          Rate: ob.Rate
        }
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.UpdateData({ ID: ob.ID, Rate: ob.Rate })
          this.refreshShow()
          Message.success('修改成功！')
        }
      })
    },
    editSave(postData) {
      request({
        url: 'aitype/update',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.RetCode === 0) {
          this.clientDB.UpdateData(this.edit.item)
          this.refreshShow()
          Message.success('保存成功！')
        }
      })
    },
    getPostData() {
      this.edit.item.PreFlop = JSON.stringify(this.edit.men)
      this.edit.item.Flop = JSON.stringify(this.edit.see)
      this.edit.item.Turn = JSON.stringify(this.edit.coms)
      return this.edit.item
    },
    save() {
      const $this = this
      if (this.edit.isEdit) {
        /* this.edit.item.PreFlopStr = JSON.stringify(this.edit.men)
        this.edit.item.FlopStr = JSON.stringify(this.edit.see)
        this.edit.item.TurnStr = JSON.stringify(this.edit.coms)
        // 设置修改后数据
        this.$refs.compare.SetNewVal(this.edit.item)

        this.$refs.compare.Compare(function(isEdit) {
          if (!isEdit) {
            Message.error('没有任何修改，不需要提交')
            return
          } else {
            $this.editSave($this.getPostData())
          }
        })*/
        $this.editSave($this.getPostData())
      } else {
        this.createSave(this.getPostData())
      }
      this.edit.visible = false
    },
    AddRule() {
      this.edit.see.Rules.push({ Small: newObject(), Big: newObject() })
    },
    delRule(idx) {
      const $this = this
      this.$confirm('确定要删除此条配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $this.edit.see.Rules.splice(idx, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    sortData(a, b) {
      if (a.Win !== b.Win) {
        return a.Win ? 1 : 0
      } else {
        return b.Type - a.Type
      }
    },
    // excel处理逻辑
    importData() {
      if (this.fileName === '') {
        Message.info('您需要先上传excel文件')
        return
      }

      request({
        url: '/aitype/import/excel',
        method: 'post',
        data: {
          Game: this.edit.item.Game,
          FileName: this.edit.fileName
        }
      }).then(response => {
        if (response.RetCode === 0) {
          const men = JSON.parse(response.Data.PreFlopStr)
          var see = JSON.parse(response.Data.FlopStr)
          var coms = JSON.parse(response.Data.TurnStr)
          see.Rules.sort(this.sortData)

          this.edit.see = see
          this.edit.men = men
          this.edit.coms = coms
          Message.success('导入数据成功！')
        }
      })
    },
    handleSuccess(rsp, file, fileList) {
      this.edit.fileName = rsp.Data
      this.importData()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },

    checkInt(value, min, max) {
      if (!$libType.IsInt(value) || value < min || value > max) {
        Message.error('请填写[' + min + ',' + max + ')之间的整数')
        return false
      }
    },

    checkFloat(value, min, max) {
      if (!$libType.IsFloat(value) || value < min || value > max) {
        Message.error('请填写[' + min + ',' + max + ')之间的数字')
        return false
      }
    },

    checkStep() {
      const types = [600, 500, 400, 300, 201, 213, 212, 211, 210, 209, 208, 207, 206, 205, 204, 203, 202, 101, 113, 112, 100]
      const winMap = {}
      var loseMap = {}
      for (const i in types) {
        winMap[types[i]] = false
        loseMap[types[i]] = false
      }

      const objs = this.edit.see.Rules
      for (let i = 0; i < objs.length; i++) {
        const obj = objs[i]

        // 检查各概率数字是否为整数
        const intNames = ['Call', 'Raise', 'Compare']
        for (let j = 0; j < intNames.length; j++) {
          var val = obj.Small[intNames[j]]
          if (!$libType.IsInt(val) || val < 0 || val > 100) {
            Message.error('概率数值必须为0-100之间的整数！')
            return false
          }
          val = obj.Big[intNames[j]]
          if (!$libType.IsInt(val) || val < 0 || val > 100) {
            Message.error('概率数值必须为0-100之间的整数！')
            return false
          }
        }

        // 概率小于100
        if (obj.Small.Call + obj.Small.Raise + obj.Small.Compare > 100) {
          Message.error('类型：' + objs.Type + '概率总和大于100！')
          return false
        }

        // 判断各牌型及输赢是否覆盖完整
        if (obj.Win) {
          if (winMap[obj.Type]) {
            Message.error('类型(赢）:' + obj.Type + '存在重复配置')
            return false
          }
          winMap[obj.Type] = true
        } else {
          if (loseMap[obj.Type]) {
            Message.error('类型（输）:' + obj.Type + '存在重复配置')
            return false
          }
          loseMap[obj.Type] = true
        }
      }
      for (var o in winMap) {
        if (!winMap[o]) {
          Message.error('类型（赢）:' + o + '没有对应配置')
          return false
        }
        if (!loseMap[o]) {
          Message.error('类型（输）:' + o + '没有对应配置')
          return false
        }
      }

      return true
    }
  }
}
</script>
