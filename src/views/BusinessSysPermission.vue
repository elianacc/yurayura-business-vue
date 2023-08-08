<template>
  <div>
    <!-- 操作按钮及数据筛选表单row -->
    <div class="row mt-4 r1">

      <div class="col-2">
        <button type="button"
                class="btn btn-primary font-size-14 me-2"
                v-if="$store.getters['manager/managerPermission'].includes(`${$store.getters['menutab/editableTabsValue']}_insert`)"
                @click="insertDialogOpen">
          <i class="fa fa-plus-circle me-2"></i>添加按钮权限
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
          <el-form-item label="权限编码"
                        prop="permissionCode"
                        label-width="4.5rem">
            <el-input v-model.trim="selectForm.permissionCode"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="权限类型"
                        prop="permissionType"
                        label-width="4.5rem">
            <sys-dict-select v-model="selectForm.permissionType"
                             dictCode="permissionType">
            </sys-dict-select>
          </el-form-item>
          <el-form-item label="状态"
                        prop="permissionStatus"
                        label-width="3rem">
            <sys-dict-select v-model="selectForm.permissionStatus"
                             dictCode="enableStatus">
            </sys-dict-select>
          </el-form-item>
          <el-form-item label="所属子菜单"
                        prop="permissionBelongSubmenuName"
                        label-width="5.5rem">
            <el-select v-model="selectForm.permissionBelongSubmenuName"
                       clearable
                       placeholder="----请选择所属子菜单----">
              <el-option v-for="item in allMenuSub"
                         :key="item.id"
                         :value="item.menuName"
                         :label="item.menuTitle">
              </el-option>
            </el-select>
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
    <div class="row r2 ps-5">
      <div class="col-12 c1">
        <el-table :data="pageInfo.list">
          <el-table-column label="权限编码"
                           width="200"
                           prop="permissionCode">
          </el-table-column>
          <el-table-column label="权限名称"
                           width="200"
                           prop="permissionName">
          </el-table-column>
          <el-table-column label="所属子菜单"
                           width="200">
            <template slot-scope="scope">
              {{scope.row.permissionBelongSubmenuName | permissionBelongFilter(allMenuSub)}}
            </template>
          </el-table-column>
          <el-table-column label="权限类型"
                           width="200">
            <template slot-scope="scope">
              {{scope.row.permissionType | sysDictFormatFilter('permissionType')}}
            </template>
          </el-table-column>
          <el-table-column label="状态"
                           width="200">
            <template slot-scope="scope">
              {{scope.row.permissionStatus | sysDictFormatFilter('enableStatus')}}
            </template>
          </el-table-column>
          <el-table-column label="序号"
                           width="200"
                           prop="permissionSeq">
          </el-table-column>
          <el-table-column label="操作"
                           width="180">
            <template slot-scope="scope">
              <button type="button"
                      class="btn btn-info btn-twitter font-size-14 text-white shadow"
                      v-if="$store.getters['manager/managerPermission'].includes(`${$store.getters['menutab/editableTabsValue']}_update`)"
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
          <el-form-item label="权限名称"
                        prop="permissionName"
                        label-width="10rem">
            <el-input v-model.trim="dataDialogForm.permissionName"
                      class="w-75"
                      maxlength="20"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="所属子菜单"
                        prop="permissionBelongSubmenuName"
                        label-width="10rem">
            <el-select v-model="dataDialogForm.permissionBelongSubmenuName"
                       clearable
                       placeholder="----请选择所属子菜单----"
                       class="w-50"
                       :disabled="dataDialogForm.id !== 0">
              <el-option v-for="item in allMenuSub"
                         :key="item.id"
                         :value="item.menuName"
                         :label="item.menuTitle">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权限类型"
                        prop="permissionType"
                        label-width="10rem"
                        v-if="dataDialogForm.id !== 0">
            <sys-dict-radio-group v-model="dataDialogForm.permissionType"
                                  dictCode="permissionType"
                                  disabled>
            </sys-dict-radio-group>
          </el-form-item>
          <el-form-item label="权限按钮"
                        prop="permissionBtnVal"
                        label-width="10rem"
                        v-show="dataDialogForm.permBtnGrpShow">
            <sys-dict-select v-model="dataDialogForm.permissionBtnVal"
                             dictCode="permissionBtn"
                             placeholder="----请选择权限按钮----"
                             customClass="w-50"
                             :disabled="dataDialogForm.id !== 0">
            </sys-dict-select>
          </el-form-item>
          <el-form-item label="状态"
                        prop="permissionStatus"
                        label-width="10rem">
            <sys-dict-radio-group v-model="dataDialogForm.permissionStatus"
                                  dictCode="enableStatus">
            </sys-dict-radio-group>
          </el-form-item>
          <el-form-item label="序号"
                        prop="permissionSeq"
                        label-width="10rem">
            <el-input-number :min="1"
                             :max="10000"
                             @blur="dataDialogForm.permissionSeq = dataDialogForm.permissionSeq || 1"
                             v-model="dataDialogForm.permissionSeq"
                             class="w-50"></el-input-number>
          </el-form-item>
          <el-form-item label="tip"
                        label-width="10rem"
                        v-if="dataDialogForm.id !== 0">
            <span>权限禁用后，拥有此权限的角色将失去此权限，需要时需启用此权限，重新给角色授权！</span>
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
import BusinessPagination from '@components/BusinessPagination.vue'
import { getMenuSubAll } from '@api/sysMenu'
import { getSysPermissionPage, insertSysPermission, updateSysPermission } from '@api/sysPermission'

export default {
  name: 'BusinessSysPermission',
  components: {
    BusinessPagination
  },
  data () {
    let checkPermissionBtnVal = (rule, value, callback) => {
      if (this.dataDialogForm.permissionType === 2 && !value) {
        return callback(new Error('权限按钮不能为空'))
      }
      callback()
    }
    return {
      selectForm: {
        permissionCode: '',
        permissionType: '',
        permissionStatus: '',
        permissionBelongSubmenuName: ''
      },
      searchContent: {},
      pageInfo: {},
      currentPageNum: 1,
      dataDialogTitle: '',
      dataDialogVisible: false,
      dataDialogForm: {
        id: 0,
        permissionName: '',
        permissionBelongSubmenuName: '',
        permissionType: 1,
        permissionBtnVal: '',
        permissionStatus: 1,
        permissionSeq: 1,
        permBtnGrpShow: false
      },
      dataDialogFormRule: {
        permissionName: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        permissionBelongSubmenuName: [{ required: true, message: '所属子菜单不能为空', trigger: 'blur' }],
        permissionBtnVal: [{ validator: checkPermissionBtnVal, trigger: 'blur' }]
      },
      allMenuSub: []
    }
  },
  methods: {
    getPage () {
      let sendData = { ...this.searchContent }
      sendData.pageNum = this.currentPageNum
      sendData.pageSize = 10
      getSysPermissionPage(sendData, success => {
        this.pageInfo = success.data
      }, () => {
        this.pageInfo = {}
      })
    },
    selectContent () {
      this.searchContent = { ...this.selectForm }
      this.currentPageNum = 1
      this.getPage()
    },
    clearSelectContent () {
      this.$refs.selectForm.resetFields()
      this.selectContent()
    },
    currentPageChangeImpl (val) {
      this.currentPageNum = val
      this.getPage()
    },
    insertDialogOpen () {
      this.dataDialogTitle = '『添加按钮权限窗口』'
      this.dataDialogVisible = true
      this.dataDialogForm.permissionType = 2
    },
    updateDialogOpen (id) {
      this.dataDialogTitle = '『修改窗口』'
      this.dataDialogOpenAndSetVal(id)
    },
    dataDialogOpenAndSetVal (id) {
      let currentPerm = this.pageInfo.list.find(perm => perm.id === id)
      Object.keys(this.dataDialogForm).forEach(key => this.dataDialogForm[key] = currentPerm[key])
      if (currentPerm.permissionType === 2) {
        let permCode = currentPerm.permissionCode
        this.dataDialogForm.permissionBtnVal = permCode.substring(permCode.lastIndexOf('_') + 1, permCode.length)
      }
      this.dataDialogVisible = true
    },
    submitContent () {
      this.$refs.dataDialogForm.validate(valid => {
        if (valid) {
          let successCallback = success => {
            this.$message.success(success.msg)
            if (this.dataDialogForm.id === 0) {
              this.$refs.selectForm.resetFields()
              this.searchContent = { ...this.selectForm }
              this.currentPageNum = 1
            }
            this.dataDialogVisible = false
          }
          let warnCallback = warn => { this.$message.error(warn.msg) }
          if (this.dataDialogForm.id === 0) {
            insertSysPermission(this.dataDialogForm, successCallback, warnCallback)
          } else {
            updateSysPermission(this.dataDialogForm, successCallback, warnCallback)
          }
        }
      })
    },
    dataDialogClose () {
      this.getPage()
      this.dataDialogForm = {
        id: 0,
        permissionName: '',
        permissionBelongSubmenuName: '',
        permissionType: 1,
        permissionBtnVal: '',
        permissionStatus: 1,
        permissionSeq: 1,
        permBtnGrpShow: false
      }
      this.$refs.dataDialogForm.clearValidate()
    },
    getAllMenuSub () {
      getMenuSubAll(success => {
        this.allMenuSub = success.data
      })
    }
  },
  watch: {
    'dataDialogForm.permissionType' (val) {
      this.dataDialogForm.permBtnGrpShow = val === 2
    }
  },
  mounted () {
    this.getPage()
    this.getAllMenuSub()
  }
}
</script>

<style scoped>
/* el表格重写 */
.r2 .c1 /deep/ .el-table td,
.r2 .c1 /deep/ .el-table th {
  text-align: center;
}

/* el对话框重写 */
.data-dialog /deep/ .el-dialog,
.data-dialog /deep/ .el-pager li {
  border-radius: 0.5rem;
}
</style>
