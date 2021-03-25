<template>
  <div v-if="containerShow">
    <!-- 操作按钮row -->
    <div class="row mt-4 r1">
      <div class="col-2">
        <div class="btn-group float-left">
          <button type="button"
                  class="btn btn-info btn-twitter font-size-14"
                  v-if="$storageUtil.getManagerMsg().managerPermission.includes('insert')"
                  @click="insertMainMenuDialogOpen">
            <i class="fa fa-plus-circle mr-2"></i>添加主菜单
          </button>
        </div>
      </div>
    </div>

    <!-- 数据表格row -->
    <div class="row r2 mt-3">
      <div class="col-12 c1">
        <el-table :data="dataList"
                  row-key="menuName"
                  default-expand-all
                  :tree-props="{children: 'menuSubList'}">
          <el-table-column label="标题"
                           width="200"
                           prop="menuTitle">
          </el-table-column>
          <el-table-column label="标识"
                           width="200"
                           prop="menuName">
          </el-table-column>
          <el-table-column label="路径"
                           width="200"
                           prop="menuIndex">
          </el-table-column>
          <el-table-column label="图标样式"
                           width="200"
                           prop="menuIconClass">
          </el-table-column>
          <el-table-column label="类型"
                           width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.menuType === 1">一级菜单</span>
              <span v-else>二级菜单</span>
            </template>
          </el-table-column>
          <el-table-column label="序号"
                           width="200"
                           prop="menuSeq">
          </el-table-column>
          <el-table-column label="操作"
                           width="400">
            <template slot-scope="scope">
              <div class="btn-group">
                <button type="button"
                        class="btn btn-success btn-twitter text-white font-size-14"
                        v-if="$storageUtil.getManagerMsg().managerPermission.includes('insert') && scope.row.menuType === 1">
                  <i class="fa fa-plus mr-2"></i>添加子菜单
                </button>
                <button type="button"
                        class="btn btn-warning btn-twitter text-white font-size-14"
                        v-if="$storageUtil.getManagerMsg().managerPermission.includes('update')"
                        @click="updateDialogOpen(scope.row.menuType, scope.row.menuName, scope.row.menuPid)">
                  <i class="fa fa-pencil-square-o mr-2"></i>修改
                </button>
                <button type="button"
                        class="btn btn-danger btn-twitter font-size-14"
                        v-if="$storageUtil.getManagerMsg().managerPermission.includes('delete')"
                        @click="delete(scope.row.id, scope.row.menuType)">
                  <i class="fa fa-trash mr-2"></i>删除
                </button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 数据对话框 -->
    <div class="data-dialog">
      <el-dialog :title="dataDialogTitle"
                 :visible.sync="dataDialogVisible"
                 @close="dataDialogClose">
        <el-form :model="dataDialogForm"
                 ref="dataDialogForm"
                 :rules="dataDialogFormRule"
                 hide-required-asterisk
                 inline-message
                 label-suffix=":"
                 size="small">
          <el-form-item label="标题"
                        prop="menuTitle"
                        label-width="10rem">
            <el-input v-model.trim="dataDialogForm.menuTitle"
                      class="w-75"></el-input>
          </el-form-item>
          <el-form-item label="标识"
                        prop="menuName"
                        label-width="10rem">
            <el-input v-model.trim="dataDialogForm.menuName"
                      class="w-75"></el-input>
          </el-form-item>
          <el-form-item label="图标样式"
                        prop="menuIconClass"
                        label-width="10rem">
            <el-input v-model="dataDialogForm.menuIconClass"
                      class="w-75"></el-input>
          </el-form-item>
          <el-form-item label="序号"
                        prop="menuSeq"
                        label-width="10rem">
            <el-input-number :min="1"
                             v-model="dataDialogForm.menuSeq"
                             class="w-50"></el-input-number>
          </el-form-item>
          <el-form-item label="路径"
                        prop="menuIndex"
                        label-width="10rem"
                        v-if="!isMainMenuDialog">
            <el-input v-model.trim="dataDialogForm.menuIndex"
                      class="w-75"></el-input>
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
export default {
  name: 'BusinessSysMenu',
  data () {
    return {
      containerShow: true,
      dataList: [],
      dataDialogTitle: '',
      dataDialogVisible: false,
      isMainMenuDialog: true,
      dataDialogForm: {
        id: 0,
        menuTitle: '',
        menuName: '',
        menuIconClass: '',
        menuSeq: '',
        menuIndex: ''
      },
      dataDialogFormRule: {
        menuTitle: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        menuName: [{ required: true, message: '标识不能为空', trigger: 'blur' }],
        menuIconClass: [{ required: true, message: '图标样式不能为空', trigger: 'blur' }],
        menuSeq: [{ required: true, message: '序号不能为空', trigger: 'blur' }],
        menuIndex: [{ required: true, message: '路径不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    getList () {
      this.$axios({
        method: 'post',
        url: '/api/sys/menu/getList',
        responseType: 'json'
      }).then(res => {
        if (res.data.code === 200) {
          this.dataList = res.data.data
        } else if (res.data.code === 401 || res.data.code === 405) {
          this.$alert(res.data.msg, '提示', {
            confirmButtonText: '确定'
          }).then(() => {
            if (res.data.code === 401) {
              this.$router.push('/manager_login')
            } else {
              this.containerShow = false
            }
          })
        } else if (res.data.code === 500) {
          this.$notify.error({
            title: '错误',
            message: res.data.msg,
            duration: 0
          })
        }
      })
    },
    delete (id, menuType) {
      let sendUrl = menuType === 1 ? '/api/sys/menu/delete' : '/api/sys/menuSub/delete'
      console.log(sendUrl)

    },
    insertMainMenuDialogOpen () {
      this.dataDialogTitle = '『添加主菜单窗口』'
      this.isMainMenuDialog = true
      this.dataDialogVisible = true
    },
    updateDialogOpen (menuType, menuName, menuPid) {
      this.dataDialogTitle = menuType === 1 ? '『修改主菜单窗口』' : '『修改子菜单窗口』'
      this.isMainMenuDialog = menuType === 1 ? true : false
      this.dialogOpenAndSetVal(menuType, menuName, menuPid)
    },
    dialogOpenAndSetVal (menuType, menuName, menuPid) {
      let currentMenu;
      if (menuType === 1) {
        currentMenu = this.dataList.find(menu => menu.menuName === menuName)
      } else {
        currentMenu = this.dataList.find(menu => menu.id === menuPid).menuSubList.find(subMenu => subMenu.menuName === menuName)
      }
      this.dataDialogForm.id = currentMenu.id
      Object.keys(this.dataDialogForm).forEach(key => this.dataDialogForm[key] = currentMenu[key])
      this.dataDialogVisible = true
    },
    dataDialogClose () {
      this.dataDialogForm = {
        id: 0,
        menuTitle: '',
        menuName: '',
        menuIconClass: '',
        menuSeq: '',
        menuIndex: ''
      }
      this.$refs.dataDialogForm.clearValidate()
    },
    submitContent () {
      this.$refs.dataDialogForm.validate(valid => {
        if (valid) {
          let sendUrl = ''
          if (this.isMainMenuDialog) {
            sendUrl = this.dataDialogForm.id === 0 ? '/api/sys/menu/insert' : '/api/sys/menu/update'
          } else {
            sendUrl = this.dataDialogForm.id === 0 ? '/api/sys/menuSub/insert' : '/api/sys/menuSub/update'
          }
          this.$axios({
            method: 'post',
            url: sendUrl,
            data: JSON.stringify(this.dataDialogForm),
            responseType: 'json'
          }).then(res => {
            if (res.data.code === 200) {
              this.$alert(res.data.msg, '提示:确定后刷新侧边菜单', {
                confirmButtonText: '确定'
              }).then(() => {
                location.reload()
              })
              this.dataDialogVisible = false
            } else if (res.data.code === 102) {
              this.$message.error(res.data.msg)
            } else if (res.data.code === 103) {
              console.log(res.data.msg)
            } else if (res.data.code === 401 || res.data.code === 405) {
              this.$alert(res.data.msg, '提示', {
                confirmButtonText: '确定'
              }).then(() => {
                if (res.data.code === 401) {
                  this.$router.push('/manager_login')
                }
              })
            } else if (res.data.code === 500) {
              this.$notify.error({
                title: '错误',
                message: res.data.msg,
                duration: 0
              })
            }
          })
        }
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style scoped>
/* el表格重写 */
.r2 .c1 /deep/ .el-table,
.r2 .c1 /deep/ .el-table__expanded-cell {
  background-color: #15202b;
}
.r2 .c1 /deep/ .el-table th,
.r2 .c1 /deep/ .el-table tr {
  background-color: #15202b;
}
.r2 .c1 /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #111a22;
}
.r2 .c1 /deep/ .el-table td,
.r2 .c1 /deep/ .el-table th.is-leaf {
  border-bottom: 1px solid #15202b;
}
.r2 .c1 /deep/ .el-table::before {
  background: #15202b;
}
.r2 .c1 /deep/ .el-table {
  color: #f8f9fa;
}
.r2 .c1 /deep/ .el-table td,
.r2 .c1 /deep/ .el-table th {
  text-align: center;
}
.r2 .c1 /deep/ .el-table thead {
  color: #f8f9fa;
}
.r2 .c1 /deep/ .el-icon-arrow-right {
  color: #f8f9fa;
}

/* el对话框重写 */
.data-dialog /deep/ .el-dialog,
.data-dialog /deep/ .el-pager li {
  background: #15202b;
}

.data-dialog /deep/ .el-dialog__title {
  color: #f8f9fa;
}

/* data-dialog表单 */
/* el表单标签重写（颜色修改） */
.data-dialog /deep/ .el-form-item__label {
  color: #f8f9fa;
}
.data-dialog /deep/ .el-date-editor.el-input,
.data-dialog /deep/ .el-date-editor.el-input__inner {
  width: 75%;
}
</style>