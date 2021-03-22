<template>
  <div>
    <!-- 操作按钮row -->
    <div class="row mt-4 r1">
      <div class="col-2">
        <div class="btn-group float-left">
          <button type="button"
                  class="btn btn-info btn-twitter font-size-14"
                  v-if="$storageUtil.getManagerMsg().managerPermission.includes('insert')"
                  @click="insertMainMenuOpen">
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
                        v-if="$storageUtil.getManagerMsg().managerPermission.includes('update')">
                  <i class="fa fa-pencil-square-o mr-2"></i>修改
                </button>
                <button type="button"
                        class="btn btn-danger btn-twitter font-size-14"
                        v-if="$storageUtil.getManagerMsg().managerPermission.includes('delete')">
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

        </el-form>
      </el-dialog>
    </div>

  </div>
</template>

<script>
export default {
  name: 'BusinessSysMenu',
  data () {
    return {
      dataList: [],
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
            }
          }).catch(() => { })
        } else if (res.data.code === 500) {
          this.$notify.error({
            title: '错误',
            message: res.data.msg,
            duration: 0
          })
        }
      })
    },
    insertMainMenuOpen () {

    },
    dataDialogClose () {
    },
    submitContent () {
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
</style>