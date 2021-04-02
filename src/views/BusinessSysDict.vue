<template>
  <div v-if="containerShow">
    <!-- 操作按钮及数据筛选表单row -->
    <div class="row mt-4 r1">

      <div class="col-2">
        <button type="button"
                class="btn btn-primary font-size-14 mr-2"
                v-if="$storageUtil.getManagerMsg().managerPermission.includes('insert')"
                @click="insertDialogOpen">
          <i class="fa fa-plus-circle mr-2"></i>添加
        </button>
      </div>

      <div class="col-10 c2">
        <el-form inline
                 :model="selectForm"
                 ref="selectForm"
                 label-suffix=":"
                 size="small"
                 class="float-right"
                 @submit.native.prevent="selectContent">
          <el-form-item label="字典编码"
                        prop="dictCode"
                        label-width="4.5rem">
            <el-input v-model.trim="selectForm.dictCode"
                      clearable></el-input>
          </el-form-item>
          <el-form-item>
            <div class="btn-group">
              <button class="btn btn-primary font-size-14"
                      type="submit">
                <i class="fa fa-filter mr-2"></i>查询
              </button>
              <button class="btn btn-primary font-size-14"
                      type="button"
                      @click="clearSelectContent">
                <i class="fa fa-refresh mr-2"></i>刷新
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
          <el-table-column label="字典编码"
                           width="200"
                           prop="dictCode">
          </el-table-column>
          <el-table-column label="字典名"
                           width="200"
                           prop="dictName">
          </el-table-column>
          <el-table-column label="字典值"
                           width="200"
                           prop="dictVal">
          </el-table-column>
          <el-table-column label="状态"
                           width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.dictStatus === 1">启用</span>
              <span v-else>禁用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="180">
            <template slot-scope="scope">
              <button type="button"
                      class="btn btn-info btn-twitter font-size-14"
                      v-if="$storageUtil.getManagerMsg().managerPermission.includes('update')"
                      @click="updateDialogOpen(scope.row.id)">
                <i class="fa fa-pencil-square-o mr-2"></i>修改
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
                 @close="dataDialogClose">
        <el-form :model="dataDialogForm"
                 ref="dataDialogForm"
                 :rules="dataDialogFormRule"
                 hide-required-asterisk
                 inline-message
                 label-suffix=":"
                 size="small">
          <el-form-item label="字典编码"
                        prop="dictCode"
                        label-width="10rem">
            <el-input v-model.trim="dataDialogForm.dictCode"
                      class="w-75"
                      :disabled="dataDialogForm.id !== 0"></el-input>
          </el-form-item>
          <el-form-item label="字典名"
                        prop="dictName"
                        label-width="10rem">
            <el-input v-model.trim="dataDialogForm.dictName"
                      class="w-75"></el-input>
          </el-form-item>
          <el-form-item label="字典值"
                        prop="dictVal"
                        label-width="10rem">
            <el-input v-model.trim="dataDialogForm.dictVal"
                      class="w-75"
                      :disabled="dataDialogForm.id !== 0"></el-input>
          </el-form-item>
          <el-form-item label="状态"
                        prop="dictStatus"
                        label-width="10rem">
            <el-radio-group v-model="dataDialogForm.dictStatus">
              <el-radio :label="1"
                        border>
                启用
              </el-radio>
              <el-radio :label="0"
                        border>
                禁用
              </el-radio>
            </el-radio-group>
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

export default {
  name: 'BusinessSysDict',
  components: {
    BusinessPagination
  },
  data () {
    return {
      containerShow: true,
      selectForm: {
        dictCode: ''
      },
      pageInfo: {},
      currentPageNum: 1,
      isSelectPage: false,
      multipleSelection: [],
      dataDialogTitle: '',
      dataDialogVisible: false,
      dataDialogForm: {
        id: 0,
        dictCode: '',
        dictName: '',
        dictVal: '',
        dictStatus: 1
      },
      dataDialogFormRule: {
        dictCode: [{ required: true, message: '字典编码不能为空', trigger: 'blur' }],
        dictName: [{ required: true, message: '字典名不能为空', trigger: 'blur' }],
        dictVal: [{ required: true, message: '字典值不能为空', trigger: 'blur' }],
      }
    }
  },
  methods: {
    getPage () {
      let sendData = this.selectForm
      sendData.pageNum = this.currentPageNum
      sendData.pageSize = 10
      this.$axios({
        method: 'post',
        url: '/api/sys/dict/getPage',
        data: JSON.stringify(sendData),
        responseType: 'json'
      }).then(res => {
        if (res.data.code === 200) {
          this.pageInfo = res.data.data
        } else if (res.data.code === 102) {
          this.pageInfo = {}
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
    selectContent () {
      if (this.selectForm.dictCode) {
        this.isSelectPage = true
      } else {
        this.isSelectPage = false
      }
      this.currentPageNum = 1
      this.getPage()
    },
    clearSelectContent () {
      this.$refs.selectForm.resetFields()
      this.selectContent()
    },
    currentPageChangeImpl (val) {
      if (!this.isSelectPage) {
        this.$refs.selectForm.resetFields()
      }
      this.currentPageNum = val
      this.getPage()
    },
    insertDialogOpen () {
      this.dataDialogTitle = '『添加窗口』'
      this.dataDialogVisible = true
    },
    updateDialogOpen (id) {
      this.dataDialogTitle = '『修改窗口』'
      this.dataDialogOpenAndSetVal(id)
    },
    dataDialogOpenAndSetVal (id) {
      let pageInfoList = this.pageInfo.list
      let currentDict = pageInfoList.find(dict => dict.id === id)
      Object.keys(this.dataDialogForm).forEach(key => this.dataDialogForm[key] = currentDict[key])
      this.dataDialogVisible = true
    },
    submitContent () {
      this.$refs.dataDialogForm.validate(valid => {
        if (valid) {
          console.log(valid)
          let sendUrl = this.dataDialogForm.id === 0 ? '/api/sys/dict/insert' : '/api/sys/dict/update'
          this.$axios({
            method: 'post',
            url: sendUrl,
            data: JSON.stringify(this.dataDialogForm),
            responseType: 'json'
          }).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg)
              if (this.dataDialogForm.id === 0) {
                this.clearSelectContent()
              } else {
                this.getPage()
              }
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
    },
    dataDialogClose () {
      this.dataDialogForm = {
        id: 0,
        dictCode: '',
        dictName: '',
        dictVal: '',
        dictStatus: 1
      }
      this.$refs.dataDialogForm.clearValidate()
    }
  },
  mounted () {
    this.getPage()
  }
}
</script>

<style scoped>
/* 查询表单 */
/* el表单标签重写（颜色修改） */
.r1 .c2 /deep/ .el-form-item__label {
  color: #f8f9fa;
}

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
/* el表单单选重写 */
.data-dialog /deep/ .el-radio {
  color: #ffffff;
}
</style>
