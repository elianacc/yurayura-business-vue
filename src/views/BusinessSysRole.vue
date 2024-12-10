<template>
  <div>

    <!-- 操作按钮及数据筛选表单row -->
    <div class="row mt-2 r1">

      <div class="col-2">
        <button type="button"
                class="btn btn-primary font-size-14 me-2"
                v-if="$store.getters['manager/managerPermission'].includes(`${$store.getters['menutab/editableTabsValue']}_insert`)"
                @click="insertDialogOpen">
          <i class="fa fa-plus-circle me-2"></i>添加
        </button>
      </div>

      <div class="col-10 c2">
        <el-form inline
                 :model="selectForm"
                 ref="selectForm"
                 label-suffix=":"
                 size="small"
                 class="float-end"
                 @submit.native.prevent="selectContent">
          <el-form-item label="角色名"
                        prop="roleName"
                        label-width="4.5rem">
            <el-input v-model.trim="selectForm.roleName"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="状态"
                        prop="roleStatus"
                        label-width="3rem">
            <sys-dict-select v-model="selectForm.roleStatus"
                             dictCode="enableStatus">
            </sys-dict-select>
          </el-form-item>
          <el-form-item label="角色组织"
                        prop="roleOrg"
                        label-width="4.5rem">
            <sys-all-org-select v-model="selectForm.roleOrg"
                                placeholder="----请选择角色组织----"></sys-all-org-select>
          </el-form-item>
          <el-form-item>
            <div class="btn-group">
              <button class="btn btn-primary font-size-14"
                      type="submit">
                <i class="fa fa-filter me-2"></i>查询
              </button>
              <button class="btn btn-primary font-size-14"
                      type="button"
                      @click="clearSelectContent">
                <i class="fa fa-refresh me-2"></i>刷新
              </button>
            </div>
          </el-form-item>
        </el-form>
      </div>

    </div>

    <!-- 数据表格row -->
    <div class="row r2">
      <div class="col-12 c1">
        <el-table :data="pageInfo.list">
          <el-table-column label="角色名"
                           width="200"
                           prop="roleName">
          </el-table-column>
          <el-table-column label="角色组织"
                           width="200"
                           prop="roleOrgName">
          </el-table-column>
          <el-table-column label="权限"
                           width="400"
                           prop="permissionNamesStr">
          </el-table-column>
          <el-table-column label="创建时间"
                           width="200"
                           prop="roleCreateTime">
          </el-table-column>
          <el-table-column label="更新时间"
                           width="200"
                           prop="roleUpdateTime">
          </el-table-column>
          <el-table-column label="状态"
                           width="200">
            <template slot-scope="scope">
              {{scope.row.roleStatus | sysDictFormatFilter('enableStatus')}}
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="180">
            <template slot-scope="scope">
              <button type="button"
                      class="btn btn-warning btn-twitter font-size-14 text-white shadow"
                      v-if="$store.getters['manager/managerPermission'].includes(`${$store.getters['menutab/editableTabsValue']}_update`) && scope.row.id !== 1"
                      @click="updateDialogOpen(scope.row.id)">
                <i class="fa fa-pencil-square-o me-2"></i>修改
              </button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 数据表格信息及分页component -->
    <business-pagination :pageInfo="pageInfo"
                         @currentPageChangeImpl="currentPageChangeImpl"></business-pagination>

    <!-- 数据对话框 -->
    <div class="data-dialog">
      <el-dialog :title="dataDialogTitle"
                 :visible.sync="dataDialogVisible"
                 @close="dataDialogClose"
                 v-dialogDrag>
        <el-form :model="dataDialogForm"
                 ref="dataDialogForm"
                 :rules="dataDialogFormRule"
                 hide-required-asterisk
                 inline-message
                 label-suffix=":"
                 size="small">
          <el-form-item label="角色名"
                        prop="roleName"
                        label-width="10rem">
            <el-input v-model.trim="dataDialogForm.roleName"
                      class="w-75"
                      maxlength="20"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="角色组织"
                        label-width="10rem"
                        prop="roleOrg">
            <sys-all-org-select v-model="dataDialogForm.roleOrg"
                                :disabled="dataDialogForm.id !== 0"></sys-all-org-select>
          </el-form-item>
          <el-form-item label="权限"
                        label-width="10rem">
            <el-tree :data="permissionAuthorTreeList"
                     show-checkbox
                     default-expand-all
                     node-key="id"
                     ref="permissionAuthorTree"
                     highlight-current
                     :props="permissionAuthorTreeProps">
            </el-tree>
          </el-form-item>
          <el-form-item label="状态"
                        prop="roleStatus"
                        label-width="10rem">
            <sys-dict-radio-group v-model="dataDialogForm.roleStatus"
                                  dictCode="enableStatus">
            </sys-dict-radio-group>
          </el-form-item>
          <el-form-item label="tip"
                        label-width="10rem"
                        v-if="dataDialogForm.id !== 0">
            <span>角色禁用后，拥有此角色管理员将失去此角色</span>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button type="danger"
                     icon="el-icon-close"
                     @click="dataDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     icon="el-icon-check"
                     @click="submitContent">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { getSysRolePage, insertSysRole, updateSysRole } from '@api/sysRole'
import { getSysPermissionAuthorTree } from '@api/sysPermission'
import BusinessPage from '@mixins/BusinessPage'

export default {
  name: 'BusinessSysRole',
  mixins: [BusinessPage],
  data () {
    return {
      selectForm: {
        roleName: '',
        roleStatus: '',
        roleOrg: ''
      },
      dataDialogForm: {
        id: 0,
        roleName: '',
        roleOrg: 1,
        roleStatus: 1
      },
      dataDialogFormRule: {
        roleName: [{ required: true, message: '角色名不能为空', trigger: 'blur' }]
      },
      permissionAuthorTreeList: [],
      permissionAuthorTreeProps: {
        children: 'permissionList',
        label: 'title'
      }
    }
  },
  methods: {
    getPageImpl (sendData) {
      getSysRolePage(sendData, success => {
        this.pageInfo = success.data
      }, () => {
        this.pageInfo = {}
      })
    },
    insertDialogOpen () {
      this.getPermissionAuthorTree()
      this.dataDialogTitle = '『添加窗口』'
      this.dataDialogVisible = true
    },
    updateDialogOpen (id) {
      this.getPermissionAuthorTree()
      this.dataDialogTitle = '『修改窗口』'
      this.dataDialogSetRowData(id)
      this.dataDialogVisible = true
    },
    dataDialogSetRowDataCustom (current) {
      this.$nextTick(() => {
        if (current.permissionIdsStr) {
          this.$refs.permissionAuthorTree.setCheckedKeys(current.permissionIdsStr.split(','))
        }
      })
    },
    setSubmitDataCustom (sendData) {
      let checkPermIdArr = this.$refs.permissionAuthorTree.getCheckedKeys().filter(permId => permId % 1 === 0)
      sendData.permissionIdArr = checkPermIdArr
    },
    insertContent (sendData, successCallback, warnCallback) {
      insertSysRole(sendData, successCallback, warnCallback)
    },
    updateContent (sendData, successCallback, warnCallback) {
      updateSysRole(sendData, successCallback, warnCallback)
    },
    dataDialogCloseExtend () {
      this.$refs.permissionAuthorTree.setCheckedKeys([])
    },
    getPermissionAuthorTree () {
      getSysPermissionAuthorTree(success => {
        this.permissionAuthorTreeList = success.data
      })
    }
  }
}
</script>

<style scoped>
/* el表格重写 */
.r2 .c1 /deep/ .el-table td,
.r2 .c1 /deep/ .el-table th {
  text-align: center;
}
.r2 .c1 /deep/ .el-table {
  width: 99.3%;
  border-radius: 1rem;
  padding-bottom: 1px;
}
.r2 .c1 /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #ffffff;
}

/* el对话框重写 */
.data-dialog /deep/ .el-dialog,
.data-dialog /deep/ .el-pager li {
  border-radius: 0.5rem;
}

/* data-dialog表单 */
/* el表单树形控件重写 */
.data-dialog /deep/ .el-tree {
  padding-top: 10px;
  padding-bottom: 10px;
}
.data-dialog /deep/ .el-tree,
.data-dialog /deep/ .el-tree-node__content:hover,
.data-dialog
  /deep/
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  border-radius: 0.25rem;
}
</style>