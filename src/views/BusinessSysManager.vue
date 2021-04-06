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
          <el-form-item label="管理员名"
                        prop="managerName"
                        label-width="4.5rem">
            <el-input v-model.trim="selectForm.managerName"
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
          <el-table-column label="管理员名"
                           width="200"
                           prop="managerName">
          </el-table-column>
          <el-table-column label="权限"
                           width="200">
            <template slot-scope="scope">
              <span>{{scope.row.managerPermission | managerPermissionFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间"
                           width="200"
                           prop="managerCreateTime">
          </el-table-column>
          <el-table-column label="更新时间"
                           width="200"
                           prop="managerUpdateTime">
          </el-table-column>
          <el-table-column label="状态"
                           width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.managerStatus === 1">启用</span>
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

  </div>
</template>

<script>
import BusinessPagination from '@components/BusinessPagination.vue'

export default {
  name: 'BusinessSysManager',
  components: {
    BusinessPagination
  },
  data () {
    return {
      containerShow: true,
      selectForm: {
        managerName: ''
      },
      searchContent: {},
      pageInfo: {},
      currentPageNum: 1,
      dataDialogTitle: '',
      dataDialogVisible: false,
      dataDialogForm: {
        id: 0,
      },
      dataDialogFormRule: {
      }
    }
  },
  methods: {
    getPage () {
      let sendData = JSON.parse(JSON.stringify(this.searchContent))
      sendData.pageNum = this.currentPageNum
      sendData.pageSize = 10
      this.$axios({
        method: 'post',
        url: '/api/sys/manager/getPage',
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
      this.searchContent = JSON.parse(JSON.stringify(this.selectForm))
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

    },
    updateDialogOpen (id) {
      console.log(id)
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
</style>
