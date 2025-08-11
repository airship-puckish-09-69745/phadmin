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
                        <el-popover placement="bottom-start" width="460" trigger="click"
                            @show="$refs['iconSelect'].reset()">
                            <IconSelect ref="iconSelect" @selected="selected" :active-icon="edit.item.icon" />
                            <el-input slot="reference" v-model="edit.item.icon" placeholder="点击选择图标" readonly>
                                <i v-if="edit.item.icon" slot="prefix" :class="edit.item.icon" style="width: 25px;" />
                                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                            </el-input>
                        </el-popover>
                    </el-col>
                </el-form-item>
                <el-form-item label="路由参数(Json格式 eg:{gid: 1})：">
                    <el-col :span="18">
                        <el-input v-model="edit.item.metaExt" />
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
</style>
<script>
import { $libDate, $libShow, ClientTableData, DataRule } from '@/utils/common'
import ElSelectTree from 'el-select-tree'
import store from '@/store'
import request from '@/utils/request'
import { Message } from 'element-ui'
import IconSelect from '@/components/IconSelect'

function newItem() {
    return { name: '', path: '', component: '', remark: '', sort: 0, pid: 0, redirect: 'noRedirect', icon: '', title: '', operator: '', metaExt: '{}', type: 1 }
}

export default {
    components: {
        ElSelectTree,
        IconSelect,
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

            permission: {
                visible: false,
                userPers: [{ Name: '测试', View: true, Create: true, Update: false, Delete: true }]
            }
        }
    },
    created() {
        this.env = store.getters.env || this.env
        this.getTree()
    },
    methods: {
        formatNumber(n) {
            return n.toLocaleString()
        },
        selected(name) {
            this.edit.item.icon = name
        },
        jsonVerify(jsonStr) {
            try {
                JSON.parse(jsonStr);
                return true;
            } catch (e) {
                return false;
            }
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
            if (!this.jsonVerify(this.edit.item.metaExt)) {
                this.$message.error('路由参数格式错误！')
                return
            }
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
