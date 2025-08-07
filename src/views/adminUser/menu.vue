<template>
    <div id="app" class="page-container" style="padding: 10px">
        <el-row style="padding-top: 5px">
            <el-col :span="4">
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate()">添加菜单
                </el-button>
            </el-col>
            <el-col :span="7">
                <el-input v-model="search" size="mini" placeholder="输入关键字搜索" @input="searchChange" />
            </el-col>
            <el-col :span="10">
                <el-button type="success" size="mini" style="float: right" icon="el-icon-refresh"
                    @click="getTree()">刷新</el-button>
            </el-col>
        </el-row>
        <div style="padding-top: 10px">
            <el-table ref="filterTable" :data="tableData" stripe max-height="700" border row-key="id"
                :header-cell-style="libShow.DefaultTableHeadClass" :row-style="{ height: '10px' }"
                :cell-style="libShow.DefaultTableCell" style="width: 100%" @row-click="clickData"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                <el-table-column prop="id" label="ID" />
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="path" label="路径" />
                <el-table-column prop="sort" label="排序" />
                <el-table-column prop="type" label="类型">
                    <template slot-scope="scope">
                        {{ scope.row.type == 1 ? '目录' : '菜单' }}
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" />
                <el-table-column prop="operator" label="最后修改人" />
                <el-table-column prop="updateTime" label="最后修改时间">
                    <template slot-scope="scope">
                        {{ formatTime(scope.row.updateTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" column-key="op">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-edit" @click="menuEdit(scope.row.id)" />
                        <el-button size="mini" icon="el-icon-delete"
                            @click="menuDelete(scope.row.id, scope.row.title)" />
                    </template>
                </el-table-column>
            </el-table>
            <el-col :offset="16" :span="8">
                <div class="block">
                    <el-pagination :current-page="clientDB.GetPage().GetCurrentPage()" :page-sizes="[40, 80, 120, 160]"
                        :page-size="clientDB.GetPage().GetPageNum()" layout="total, sizes, prev, pager, next, jumper"
                        :total="clientDB.GetPage().GetTotalCount()" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
            </el-col>
        </div>
        <el-dialog :title="getEditTitle()" :visible.sync="edit.visible" :close-on-click-modal="false"
            :close-on-press-escape="false" width="50%">
            <el-form ref="edit.item" label-width="300px" size="small">
                <el-form-item label="标题：" :required="true">
                    <el-col :span="18">
                        <el-input v-model="edit.item.title" />
                    </el-col>
                </el-form-item>
                <el-form-item label="名称：" :required="true">
                    <el-col :span="18">
                        <el-input v-model="edit.item.name" />
                    </el-col>
                </el-form-item>
                <el-form-item label="路径：" :required="true">
                    <el-col :span="18">
                        <el-input v-model="edit.item.path" />
                    </el-col>
                </el-form-item>
                <el-form-item label="父级菜单：">
                    <el-col :span="18">
                        <el-select-tree width="120px" placeholder="请选择内容" :data="treeData" v-model="edit.item.pid"
                            check-strictly :props="{
                                label: (data) => data.title,
                                value: 'id',
                                children: 'children',
                            }"></el-select-tree>
                    </el-col>
                </el-form-item>
                <el-form-item label="类型：" :required="true">
                    <el-col :span="18">
                        <el-select v-model="edit.item.type" placeholder="请选择">
                            <el-option label="目录" :value=1></el-option>
                            <el-option label="菜单" :value=2></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item v-if="edit.item.type == 2" label="页面：" :required="true">
                    <el-col :span="18">
                        <el-input v-model="edit.item.component" />
                    </el-col>
                </el-form-item>
                <el-form-item v-if="edit.item.type == 1" label="重定向：" :required="true">
                    <el-col :span="18">
                        <el-input v-model="edit.item.redirect" />
                    </el-col>
                </el-form-item>
                <el-form-item label="图标：">
                    <el-col :span="18">
                        <el-input v-model="edit.item.icon" readonly>
                            <el-button slot="append" icon="el-icon-more" @click="edit.showIconPicker = true">
                            </el-button>
                        </el-input>
                        <el-popover v-model="edit.showIconPicker" placement="bottom" width="450" trigger="manual">
                            <div class="iconList">
                                <i v-for="item in iconList" :key="item" :class="item" @click="setIcon(item)"
                                    style="font-size:20px"></i>
                            </div>
                        </el-popover>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-col :span="18">
                        <el-input v-model="edit.item.remark" />
                    </el-col>
                </el-form-item>
                <el-form-item label="排序：">
                    <el-col :span="18">
                        <el-input v-model="edit.item.sort" />
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :span="12" :offset="10">
                            <el-button type="primary" size="medium" @click="save">保存</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<style>
.table .text-c th,
.table .text-c td {
    text-align: center;
}

.iconList {
    width: 400px;
    height: 300px;
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    i {
        display: inline-block;
        width: 60px;
        height: 45px;
        color: #000000;
        font-size: 20px;
        border: 1px solid #E6E6E6;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        line-height: 45px;
        margin: 5px;

        &:hover {
            color: $ft;
            border-color: $ft;
        }
    }
}

.table-bg thead th {
    background-color: #f5fafe;
}

.table-bordered th,
.table-bordered td {
    border: 1px solid #ddd;
}

.table-border th,
.table-border td {
    border-bottom: 1px solid #ddd;
}

.table th,
.table td {
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
import { $libDate, $libShow, ClientTableData, DataRule } from '@/utils/common'
import ElSelectTree from 'el-select-tree'
import store from '@/store'
import request from '@/utils/request'
import { Message } from 'element-ui'
import { elementIcons } from '@/utils/icon'

function newItem() {
    return { name: '', path: '', component: '', remark: '', sort: 0, pid: 0, redirect: 'noRedirect', icon: '', title: '', operator: '' }
}

export default {
    components: {
        ElSelectTree
    },
    data() {
        return {
            tableData: [],
            clientDB: new ClientTableData([], 1),
            search: '',
            libShow: $libShow,

            edit: {
                visible: false,
                item: newItem(),
                isEdit: false,
                showIconPicker: false,
            },

            type: '',
            treeData: [],

            role: {
                visible: false,
                userRoles: [],
                roles: [],
                name: '',
                id: 0
            },

            iconList: [],

            permission: {
                visible: false,
                userPers: [{ Name: '测试', View: true, Create: true, Update: false, Delete: true }]
            }
        }
    },
    created() {
        this.env = store.getters.env || this.env
        this.iconList = elementIcons
        this.getTree()
    },
    methods: {
        formatNumber(n) {
            return n.toLocaleString()
        },
        formatTime(ts) {
            return $libDate.FormateSecondStr(ts, 2)
        },

        searchChange() {
            this.clientDB.Search(this.search, ['name', 'title', 'path'])
            this.refreshShow()
        },

        menuEdit(id) {
            this.initFormData(true, id)
            this.edit.visible = true
        },

        formatTime(ts) {
            return $libDate.FormateSecondStr(ts, 2)
        },

        setIcon(icon) {
            console.log(icon)
            this.edit.item.icon = icon;
            this.edit.showIconPicker = false;
        },

        initFormData(bEdit, ID) {
            this.edit.isEdit = bEdit
            if (ID) {
                const _data = this.clientDB.GetTreeDataById(ID)
                if (_data) {
                    Object.assign(this.edit.item, _data)
                }
            }
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
        clickData(row, column, event) {
            if (column.columnKey !== 'op') {
                console.log(row.pid)
                console.log(this.treeData)
                this.initFormData(true, row.id)
                this.edit.visible = true
            }
        },
        handlePidChange(value) {
            console.log('Selected value:', value); // 调试用

            // 处理根目录的特殊情况
            if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
                this.edit.item.pid = 0; // 根目录的id是0
                return;
            }

            // 处理普通选择情况
            if (Array.isArray(value)) {
                this.edit.item.pid = value[value.length - 1];
            } else {
                this.edit.item.pid = value;
            }
            console.log(this.edit.item.pid)
        },
        handleCreate() {
            this.edit.isEdit = false
            this.edit.item = newItem()
            this.edit.visible = true
        },

        getTree() {
            const $this = this
            request({
                url: '/adminuser/menu/tree',
                method: 'get',
            }).then(response => {
                if (response.RetCode === 0) {
                    const tree = response.Data
                    $this.clientDB = new ClientTableData(tree.children, 40, {}, '', -1, 'id')
                    $this.handleCurrentChange(1)
                    this.treeData = []
                    this.treeData.push(response.Data)
                }
            })
        },

        getEditTitle() {
            return this.edit.isEdit ? '修改菜单' : '新增菜单'
        },

        dataRule(required, config) {
            return DataRule(required, config)
        },

        menuDelete(id, title) {
            this.$confirm('确定删除[' + title + ']吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                request({
                    url: '/adminuser/del/menu',
                    method: 'get',
                    params: { id: id }
                }).then(response => {
                    if (response.RetCode === 0) {
                        this.getTree()
                        Message.success('删除成功！')
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        createSave(postData) {
            request({
                url: '/adminuser/add/menu',
                method: 'post',
                data: postData
            }).then(response => {
                if (response.RetCode === 0) {
                    this.getTree()
                    Message.success('保存成功！')
                }
            })
        },
        editSave(postData) {
            request({
                url: '/adminuser/update/menu',
                method: 'post',
                data: postData
            }).then(response => {
                if (response.RetCode === 0) {
                    this.getTree()
                    Message.success('保存成功！')
                }
            })
        },
        getPostData() {
            return this.edit.item
        },
        checkData() {
            return true
        },
        save() {
            if (!this.checkData()) return
            if (this.edit.isEdit) {
                this.editSave(this.getPostData())
            } else {
                this.createSave(this.getPostData())
            }
            this.edit.visible = false
        },
    }
}
</script>
