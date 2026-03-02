<template>
    <div class="app-container">
        <!-- 发布组件 -->
        <el-row>
            <publish primary-key="ID" key-id="CornerMarkerConfig" :env-empty="false" :attr-names="AttrNames" :head-attrs="['ID','GameIdList']" />
        </el-row>
        <!-- 顶部操作栏 -->
        <el-row :gutter="10" style="margin-top: 30px">
            <el-col :span="24">
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleCreate()">添加角标配置</el-button>
                <el-button type="success" size="mini" icon="el-icon-refresh" @click="getList()">刷新</el-button>
            </el-col>
        </el-row>

        <!-- 数据表格 -->
        <el-row style="padding-top: 10px">
            <el-table ref="filterTable" :data="tableData" stripe border
                :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{ height: '10px' }"
                :cell-style="libShow.DefaultTableCell" style="width: 100%" @row-click="clickData"
                @sort-change="sortChange">
                <el-table-column prop="ID" label="ID" sortable="custom" width="80" />
                <el-table-column prop="GameName" label="游戏名称" min-width="150">
                    <template slot-scope="scope">
                        {{ formatGameNames(scope.row.GameIdList) }}
                    </template>
                </el-table-column>
                <el-table-column prop="SiteList" label="生效站点" width="150">
                    <template slot-scope="scope">
                        {{ formatSiteList(scope.row.SiteList) }}
                    </template>
                </el-table-column>
                <el-table-column prop="StartTime" label="生效开始时间" width="160">
                    <template slot-scope="scope">
                        {{ formatTime(scope.row.StartTime) }}
                    </template>
                </el-table-column>
                <el-table-column prop="EndTime" label="生效结束时间" width="160">
                    <template slot-scope="scope">
                        {{ formatTime(scope.row.EndTime) }}
                    </template>
                </el-table-column>
                <el-table-column prop="ImgUrl" label="角标图片" width="100">
                    <template slot-scope="scope">
                        <img v-if="scope.row.ImgUrl" :src="getFullPath(scope.row.ImgUrl)" height="60px">
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Status" label="状态" width="100">
                    <template slot-scope="scope">
                        {{ getStatus(scope.row.StartTime, scope.row.EndTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" column-key="op" width="250">
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" icon="el-icon-delete"
                            @click="handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-col :offset="16" :span="8">
                <div class="block">
                    <el-pagination :current-page="clientDB.GetPage().GetCurrentPage()"
                        :page-sizes="[150, 300, 450, 600]" :page-size="clientDB.GetPage().GetPageNum()"
                        layout="total, sizes, prev, pager, next, jumper" :total="clientDB.GetPage().GetTotalCount()"
                        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </div>
            </el-col>
        </el-row>

        <!-- 编辑/新增弹框 -->
        <el-dialog :title="getEditTitle()" :visible.sync="edit.visible" :close-on-click-modal="false"
            :close-on-press-escape="false" width="800px">
            <el-form ref="edit" :model="edit" label-width="150px" size="small">
                <el-tabs type="card">
                    <el-tab-pane label="基础信息">
                        <!-- 游戏选择 -->
                        <el-alert style="margin-bottom: 15px" title="当前APPID：" :description="String(currentAppId)" type="info" show-icon></el-alert>
                        <el-form-item label="勾选支持的游戏：" :required="true">
                            <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="width: 300px" />
                            <el-tree ref="tree" :data="treeData" show-checkbox node-key="id" highlight-current
                                :props="defaultProps" :filter-node-method="filterNode" @check-change="handleCheckChange"
                                style="margin-top: 10px" />
                        </el-form-item>

                        <!-- 生效站点多选 -->
                        <el-form-item label="生效站点：">
                            <SiteSelect v-model="edit.item.SiteList" multiple placeholder="请选择站点" style="width: 300px" />
                        </el-form-item>

                        <!-- 生效时间范围选择 -->
                        <el-form-item label="生效开始时间：" :required="true">
                            <el-date-picker v-model="edit.item.StartTime" type="datetime" placeholder="选择开始时间"
                                value-format="timestamp" format="yyyy-MM-dd HH:mm:ss" style="width: 230px" />
                        </el-form-item>
                        <el-form-item label="生效结束时间：" :required="true">
                            <el-date-picker v-model="edit.item.EndTime" type="datetime" placeholder="选择结束时间"
                                value-format="timestamp" format="yyyy-MM-dd HH:mm:ss" style="width: 230px" />
                        </el-form-item>

                        <!-- 图片选择 -->
                        <el-form-item label="角标图片：" :required="true" style="position: relative">
                            <ImagePicker v-model="edit.item.ImgUrl" category="cornerMarker" />
                            <el-button type="danger" size="mini" style="position: absolute; left: 138px; top: 60px"
                                @click="edit.item.ImgUrl = ''">清除图片</el-button>
                        </el-form-item>

                    </el-tab-pane>
                </el-tabs>

                <el-form-item>
                    <el-row>
                        <el-col :span="12" :offset="10">
                            <el-button type="primary" size="medium" @click="save">保存</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 删除确认对话框 -->
        <el-dialog
            title="确认删除"
            :visible.sync="deleteDialog.visible"
            width="400px"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <div style="text-align: center; padding: 20px 0;">
                <i class="el-icon-warning" style="color: #e6a23c; font-size: 24px; margin-right: 10px;"></i>
                <span style="font-size: 16px;">确定要删除这条记录吗？</span>
                <div v-if="deleteDialog.item" style="margin-top: 15px; padding: 10px; background-color: #f5f5f5; border-radius: 4px;">
                    <p><strong>记录状态：</strong>{{ getStatus(deleteDialog.item.StartTime, deleteDialog.item.EndTime) }}</p>
                    <p><strong>游戏名称：</strong>{{ formatGameNames(deleteDialog.item.GameIdList) }}</p>
                    <p><strong>生效时间：</strong>{{ formatTime(deleteDialog.item.StartTime) }} 至 {{ formatTime(deleteDialog.item.EndTime) }}</p>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteDialog.visible = false" size="small">取 消</el-button>
                <el-button type="danger" @click="confirmDelete" size="small" icon="el-icon-delete">确 定 删 除</el-button>
            </div>
        </el-dialog>

        <!--对比组件-->
        <compare ref="compare" :attr-names="AttrNames" />

    </div>
</template>

<script>
import { $libDate, $libShow, ClientTableData } from '@/utils/common'
import store from '@/store'
import Compare from '@/components/Compare'
import request from '@/utils/request'
import { Message } from 'element-ui'
import ImagePicker from '@/components/ImagePicker/ImagePicker'
import SiteSelect from '@/components/SiteSelect/index.vue'
import Publish from '@/components/Publish'

const filterMap = {}

function newItem() {
    return {
        ID: '',
        GameIdList: [],
        SiteList: [],
        StartTime: '',
        EndTime: '',
        ImgUrl: ''
    }
}

export default {
    components: { Compare, ImagePicker, SiteSelect, Publish },
    data() {
        return {
            tableData: [],
            clientDB: new ClientTableData([], 1, filterMap),
            libShow: $libShow,

            // 游戏树相关数据
            filterText: '',
            allTreeData: [],
            treeData: [],
            defaultProps: {
                label: 'label',
                children: 'children',
                disabled: 'disabled'
            },

            edit: {
                visible: false,
                item: newItem(),
                isEdit: false,
                isCopy: false
            },

            // 删除确认对话框
            deleteDialog: {
                visible: false,
                item: null
            },

            AttrNames: {
                GameIdList: '游戏Key',
                GameName: '游戏名称',
                SiteList: '生效站点',
                StartTime: '生效开始时间',
                EndTime: '生效结束时间',
                ImgUrl: '角标图片',
            }
        }
    },
    computed: {
        actionURL() {
            return process.env.VUE_APP_BASE_API + '/other/upload/image'
        },
        currentAppId() {
            return store.getters.appId
        }
    },
    created() {
        this.platform = this.$route.meta.platform
        this.getList()
        this.getAllGames()
    },
    methods: {
        // 获取所有游戏信息（用于游戏树）
        async getAllGames() {
            try {
                const response = await request({
                    url: '/thirdpartygames/all',
                    method: 'get',
                    data: {},
                    params: { status: 2 }
                })
                
                if (response.RetCode === 0) {
                    const objs = response.Data || []
                    const data = {}
                    for (let i = 0; i < objs.length; i++) {
                        const obj = objs[i]
                        if (obj.ShowDatacenter !== 1) {
                            continue
                        }

                        const game = { Gid: obj.Gid, Name: obj.Name, Description: obj.Description }
                        if (Object.prototype.hasOwnProperty.call(data, obj.CategoryID)) {
                            data[obj.CategoryID].push(game)
                        } else {
                            data[obj.CategoryID] = [game]
                        }
                    }

                    this.treeData = []
                    const categories = { 1: 'Slot', 2: 'Poker', 3: 'Casino' }

                    const builtTree = []
                    for (const key in data) {
                        const games = data[key]
                        const cty = { id: 'p-' + key, label: categories[key], children: [] }

                        for (let i = 0; i < games.length; i++) {
                            const game = games[i]
                            cty.children.push({ id: game.Gid, label: game.Name })
                        }
                        builtTree.push(cty)
                    }

                    this.allTreeData = builtTree
                    this.treeData = builtTree
                }
                
                return response
            } catch (error) {
                console.error('getAllGames error:', error)
                throw error
            }
        },

        // 游戏树筛选方法
        filterNode(value, data) {
            if (!value) return true
            return data.label.indexOf(value) !== -1
        },

        // 游戏树选中变化
        handleCheckChange(data, checked) {
            if (data.label === 'Slot' || data.label === 'Poker' || data.label === 'Casino') {
                return
            }

            // 确保 GameIdList 存在
            if (!this.edit.item.GameIdList) {
                this.edit.item.GameIdList = []
            }
            const gameIdList = this.edit.item.GameIdList
            const index = gameIdList.indexOf(data.id)
            if (checked) {
                if (index < 0) {
                    gameIdList.push(data.id)
                }
            } else {
                if (index >= 0) {
                    gameIdList.splice(index, 1)
                }
            }

            this.edit.item.GameIdList = gameIdList
        },

        // 格式化游戏名称
        formatGameNames(gameIdList) {
            if (!gameIdList) {
                return ''
            }
            // 将游戏ID转换为数字数组，确保类型匹配
            const keys = Array.isArray(gameIdList)
                ? gameIdList.map(k => Number(k))
                : (typeof gameIdList === 'string' ? gameIdList.split(',').map(k => Number(k)) : [])
            const names = []
            // 检查 allTreeData 是否已加载
            if (!this.allTreeData || this.allTreeData.length === 0) {
                return ''
            }
            // 从 allTreeData 中查找游戏名称
            this.allTreeData.forEach(category => {
                if (category.children) {
                    category.children.forEach(game => {
                        if (keys.includes(game.id)) {
                            names.push(game.label)
                        }
                    })
                }
            })
            return names.join(', ')
        },

        // 格式化站点列表
        formatSiteList(siteList) {
            if (!siteList) return ''
            if (Array.isArray(siteList)) {
                return siteList.join(', ')
            }
            if (typeof siteList === 'string') {
                return siteList.split(',').join(', ')
            }
            return ''
        },

        // 格式化时间
        formatTime(ts) {
            if (!ts) return ''
            return $libDate.FormateSecondStr(ts, 2)
        },

        // 根据开始时间和结束时间计算状态
        getStatus(startTime, endTime) {
            const now = Math.floor(Date.now() / 1000) // 转换为秒级时间戳
            if (!startTime || !endTime) return ''

            // 确保时间戳是秒级
            const start = startTime < 10000000000 ? startTime : Math.floor(startTime / 1000)
            const end = endTime < 10000000000 ? endTime : Math.floor(endTime / 1000)

            if (now < start) {
                return '未上线'
            } else if (now >= start && now <= end) {
                return '已上线'
            } else {
                return '已过期'
            }
        },

        // 获取完整路径
        getFullPath(url) {
            return $libShow.GetFullPath(url.replace('/static/', '/'))
        },

        // 获取列表数据
        getList() {
            request({
                url: '/cornermarker/all',
                method: 'get',
                data: {
                    AppId: this.currentAppId
                }
            }).then(response => {
                if (response.RetCode === 0) {
                    const objs = response.Data || []
                    // 统一处理游戏ID格式为数组
                    objs.forEach(item => {
                        if (item.GameIdList) {
                            if (typeof item.GameIdList === 'string') {
                                item.GameIdList = item.GameIdList.split(',').filter(k => k).map(k => Number(k))
                            } else if (Array.isArray(item.GameIdList)) {
                                item.GameIdList = item.GameIdList.map(k => Number(k))
                            } else {
                                item.GameIdList = []
                            }
                        } else {
                            item.GameIdList = []
                        }
                    })
                    this.clientDB = new ClientTableData(objs, 150, filterMap, 'ID', -1)
                    this.handleCurrentChange(1)
                }
            })
        },

        // 过滤处理
        handleFilter() {
            this.clientDB.FilterData()
            this.refreshShow()
        },

        // 刷新显示
        refreshShow() {
            this.tableData = this.clientDB.GetCurrentPageData()
        },

        // 分页处理
        handleSizeChange(val) {
            this.clientDB.GetPage().SetPageNum(val)
            this.refreshShow()
        },

        handleCurrentChange(val) {
            this.clientDB.GetPage().SetPageNo(val)
            this.refreshShow()
        },

        // 排序处理
        sortChange(ob) {
            this.clientDB.SortByProp(ob.prop, ob.order)
            this.refreshShow()
        },

        // 点击数据行
        clickData(row, column, event) {
            if (column.columnKey !== 'op') {
                this.edit.item = { ...row }
                // 使用当前appId覆盖row中的AppId
                this.edit.item.AppId = this.currentAppId
                // 处理 GameIdList：确保为数字数组
                if (Array.isArray(row.GameIdList)) {
                    this.edit.item.GameIdList = row.GameIdList.map(k => Number(k))
                } else {
                    this.edit.item.GameIdList = []
                }
                // 处理 SiteList：如果是字符串，转换为数组
                if (typeof row.SiteList === 'string' && row.SiteList) {
                    this.edit.item.SiteList = row.SiteList.split(',').filter(k => k)
                } else if (Array.isArray(row.SiteList)) {
                    this.edit.item.SiteList = row.SiteList
                } else {
                    this.edit.item.SiteList = []
                }
                
                // 处理时间戳：确保是毫秒级时间戳（Element UI日期选择器需要）
                if (row.StartTime) {
                    // 如果StartTime是秒级时间戳，转换为毫秒级
                    this.edit.item.StartTime = row.StartTime < 10000000000 ? row.StartTime * 1000 : row.StartTime
                }
                if (row.EndTime) {
                    // 如果EndTime是秒级时间戳，转换为毫秒级
                    this.edit.item.EndTime = row.EndTime < 10000000000 ? row.EndTime * 1000 : row.EndTime
                }
                this.edit.isEdit = true
                this.edit.isCopy = false
                this.edit.visible = true
                // 设置修改之前数据
                this.$refs.compare.SetOldVal(row)
                // 初始化游戏树 - 等待游戏数据加载完成
                this.initGameTreeForEdit()
            }
        },

        // 初始化游戏树用于编辑
        async initGameTreeForEdit() {
            // 等待游戏数据加载完成
            if (!this.allTreeData || this.allTreeData.length === 0) {
                // 如果游戏数据还未加载，重新获取
                await this.getAllGames()
            }
            
            // 等待DOM更新并设置游戏树选中状态
            this.$nextTick(() => {
                if (this.$refs.tree && this.edit.item.GameIdList) {
                    // 确保GameIdList中的ID是数字类型
                    const gameIds = this.edit.item.GameIdList.map(id => Number(id))
                    this.$refs.tree.setCheckedKeys(gameIds)
                }
            })
        },

        // 创建新配置
        handleCreate() {
            this.edit.item = newItem()
            this.edit.item.AppId = this.currentAppId
            this.edit.isEdit = false
            this.edit.isCopy = false
            this.edit.visible = true
            // 初始化游戏树 - 显示所有游戏
            this.initGameTreeForCreate()
        },

        // 初始化游戏树用于创建
        async initGameTreeForCreate() {
            // 等待游戏数据加载完成
            if (!this.allTreeData || this.allTreeData.length === 0) {
                // 如果游戏数据还未加载，重新获取
                await this.getAllGames()
            }
            
            // 等待DOM更新并清空游戏树选中状态
            this.$nextTick(() => {
                if (this.$refs.tree) {
                    this.$refs.tree.setCheckedKeys([])
                }
            })
        },

        // 获取编辑标题
        getEditTitle() {
            return this.edit.isEdit ? '修改角标配置' : '新增角标配置'
        },

        // 处理删除按钮点击
        handleDelete(row) {
            this.deleteDialog.item = row
            this.deleteDialog.visible = true
        },

        // 确认删除
        confirmDelete() {
            if (!this.deleteDialog.item) {
                return
            }

            const deleteData = {
                ID: this.deleteDialog.item.ID
            }

            request({
                url: '/cornermarker/delete',
                method: 'post',
                data: deleteData
            }).then(response => {
                if (response.RetCode === 0) {
                    Message.success('删除成功！')
                    this.deleteDialog.visible = false
                    this.deleteDialog.item = null
                    // 重新加载列表
                    this.getList()
                } else {
                    Message.error('删除失败：' + (response.Message || '未知错误'))
                }
            }).catch(error => {
                console.error('删除失败:', error)
                Message.error('删除失败：网络错误')
            })
        },

        // 保存数据
        save() {
            if (!this.edit.item.GameIdList || this.edit.item.GameIdList.length === 0) {
                Message.error('请选择游戏！')
                return
            }
            if (!this.edit.item.StartTime) {
                Message.error('请选择生效开始时间！')
                return
            }
            if (!this.edit.item.EndTime) {
                Message.error('请选择生效结束时间！')
                return
            }
            if (!this.edit.item.ImgUrl) {
                Message.error('请选择角标图片！')
                return
            }

            // 格式化数据
            const postData = {
                ID: this.edit.item.ID,
                GameIdList: Array.isArray(this.edit.item.GameIdList) ? this.edit.item.GameIdList.map(id => Number(id)) : (typeof this.edit.item.GameIdList === 'string' ? this.edit.item.GameIdList.split(',').filter(k => k).map(k => Number(k)) : []),
                SiteList: Array.isArray(this.edit.item.SiteList) ? this.edit.item.SiteList : (typeof this.edit.item.SiteList === 'string' ? this.edit.item.SiteList.split(',').filter(k => k) : []),
                StartTime: this.edit.item.StartTime < 10000000000 ? this.edit.item.StartTime : Math.floor(this.edit.item.StartTime / 1000),
                EndTime: this.edit.item.EndTime < 10000000000 ? this.edit.item.EndTime : Math.floor(this.edit.item.EndTime / 1000),
                ImgUrl: this.edit.item.ImgUrl
            }

            if (this.edit.isEdit) {
                // 修改
                this.$refs.compare.SetNewVal(postData)
                const $this = this
                this.$refs.compare.Compare(function (isEdit) {
                    if (!isEdit) {
                        Message.error('没有任何修改，不需要提交')
                        return
                    } else {
                        $this.editSave(postData)
                    }
                })
            } else {
                // 新增
                this.createSave(postData)
            }
        },

        // 新增保存
        createSave(postData) {
            request({
                url: '/cornermarker/create',
                method: 'post',
                data: postData
            }).then(response => {
                if (response.RetCode === 0) {
                    this.clientDB.AddData(response.Data)
                    this.refreshShow()
                    Message.success('保存成功！')
                    this.edit.visible = false
                }
            })
        },

        // 修改保存
        editSave(postData) {
            request({
                url: '/cornermarker/update',
                method: 'post',
                data: postData
            }).then(response => {
                if (response.RetCode === 0) {
                    this.getList()
                    Message.success('保存成功！')
                    this.edit.visible = false
                }
            })
        },

    },

    // 监听 filterText 变化，过滤游戏树
    watch: {
        filterText(val) {
            this.$refs.tree && this.$refs.tree.filter(val)
        }
    }
}
</script>

<style scoped>
.app-container {
    padding: 10px;
}
</style>
