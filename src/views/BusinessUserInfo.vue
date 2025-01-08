<template>
  <div>
    <!-- 数据筛选表单row -->
    <div class="row mt-2 r1">

      <div class="col-2">
        <button type="button"
                class="btn btn-warning font-size-14 text-white"
                @click="exportContent"
                v-if="$store.getters['manager/managerPermission'].includes(`${$store.getters['menutab/editableTabsValue']}_export`)">
          <i class="fa fa-upload me-2"></i>导出
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
          <el-form-item label="用户名昵称"
                        prop="userNameKeyword"
                        label-width="5.5rem">
            <el-input v-model.trim="selectForm.userNameKeyword"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="性别"
                        prop="userSex"
                        label-width="3rem">
            <sys-dict-select v-model="selectForm.userSex"
                             dictCode="userSex">
            </sys-dict-select>
          </el-form-item>
          <el-form-item label="手机号"
                        prop="userPhoneNumber"
                        label-width="4rem">
            <el-input v-model.trim="selectForm.userPhoneNumber"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="状态"
                        prop="userStatus"
                        label-width="3rem">
            <sys-dict-select v-model="selectForm.userStatus"
                             dictCode="userStatus">
            </sys-dict-select>
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
        <el-table :data="pageInfo.list"
                  v-loading="dataTableLoading">
          <el-table-column label="头像"
                           width="100">
            <template slot-scope="scope">
              <img :src="scope.row.userAvatarUrl"
                   class="rounded"
                   width="100"
                   height="100" />
            </template>
          </el-table-column>
          <el-table-column label="用户名"
                           width="120"
                           prop="userName">
          </el-table-column>
          <el-table-column label="昵称"
                           width="120"
                           prop="userNickname">
          </el-table-column>
          <el-table-column label="性别"
                           width="100">
            <template slot-scope="scope">
              {{scope.row.userSex | sysDictFormatFilter('userSex')}}
            </template>
          </el-table-column>
          <el-table-column label="生日"
                           width="150"
                           prop="userBirthday">
          </el-table-column>
          <el-table-column label="所在省市"
                           width="150">
            <template slot-scope="scope">
              {{scope.row.userProvince}} {{scope.row.userCity}}
            </template>
          </el-table-column>
          <el-table-column label="邮箱"
                           width="150"
                           prop="userEmail">
          </el-table-column>
          <el-table-column label="手机号"
                           width="200"
                           prop="userPhoneNumber">
          </el-table-column>
          <el-table-column label="状态"
                           width="150">
            <template slot-scope="scope">
              {{scope.row.userStatus | sysDictFormatFilter('userStatus')}}
            </template>
          </el-table-column>
          <el-table-column label="注册时间"
                           width="200"
                           prop="userRegTime">
          </el-table-column>
          <el-table-column label="操作"
                           width="250">
            <template slot-scope="scope">
              <div class="btn-group shadow">
                <button type="button"
                        class="btn btn-info btn-twitter font-size-14 text-white"
                        v-if="$store.getters['manager/managerPermission'].includes(`${$store.getters['menutab/editableTabsValue']}_update`)"
                        @click="updateStatusDialogOpen(scope.row.id)">
                  <i class="fa fa-pencil-square-o me-2"></i>调整状态
                </button>
                <button type="button"
                        class="btn btn-warning btn-twitter font-size-14 text-white"
                        v-if="$store.getters['manager/managerPermission'].includes(`${$store.getters['menutab/editableTabsValue']}_update`)"
                        @click="resetAvatar(scope.row.id)">
                  <i class="fa fa-retweet me-2"></i>重置头像
                </button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 数据表格信息及分页component -->
    <business-pagination :pageInfo="pageInfo"
                         @currentPageChangeImpl="currentPageChangeImpl"></business-pagination>

    <!-- 调整状态对话框 -->
    <div class="up-status-dialog">
      <el-dialog :title="updateStatusDialogTitle"
                 :visible.sync="updateStatusDialogVisible"
                 @close="updateStatusDialogClose"
                 v-dialogDrag>
        <el-form :model="updateStatusDialogForm"
                 label-suffix=":"
                 size="small">
          <el-form-item label="状态"
                        label-width="10rem">
            <sys-dict-select v-model="updateStatusDialogForm.userStatus"
                             dictCode="userStatus"
                             customClass="w-75">
            </sys-dict-select>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button type="danger"
                     icon="el-icon-close"
                     @click="updateStatusDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     icon="el-icon-check"
                     @click="updateStatus">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { getUserPage, updateUserStatus, updateUserAvatarDefault, exportUser } from '@api/user'
import { downloadStream } from '@utils/common'
import BusinessPage from '@mixins/BusinessPage'

export default {
  name: 'BusinessUserInfo',
  mixins: [BusinessPage],
  data () {
    return {
      selectForm: {
        userNameKeyword: '',
        userSex: '',
        userPhoneNumber: '',
        userStatus: ''
      },
      updateStatusDialogTitle: '',
      updateStatusDialogVisible: false,
      updateStatusDialogForm: {
        id: 0,
        userStatus: '0'
      }
    }
  },
  methods: {
    getPageImpl (sendData, successCallback, warnCallback) {
      getUserPage(sendData, successCallback, warnCallback)
    },
    exportContentImpl (sendData) {
      exportUser(sendData, success => {
        downloadStream(success, 'application/vnd.ms-excel', '用户信息.xlsx')
      })
    },
    updateStatusDialogOpen (id) {
      this.updateStatusDialogTitle = '『调整状态窗口』'
      this.updateStatusDataDialogSetRowData(id)
      this.updateStatusDialogVisible = true
    },
    updateStatusDataDialogSetRowData (id) {
      let currentUser = this.pageInfo.list.find(user => user.id === id)
      this.updateStatusDialogForm.id = currentUser.id
      this.updateStatusDialogForm.userStatus = currentUser.userStatus.toString()
    },
    updateStatus () {
      const loading = this.$loading({
        lock: true,
        text: '提交中...',
        background: 'rgba(0, 0, 0, 0.6)',  // 背景色透明度调低
      })
      updateUserStatus(this.updateStatusDialogForm, success => {
        this.$message.success(success.msg)
        loading.close()
        this.updateStatusDialogVisible = false
        this.getPage()
      }, warn => {
        this.$message.error(warn.msg)
        loading.close()
      })
    },
    async resetAvatar (id) {
      try {
        await this.$confirm('确定要重置头像吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await updateUserAvatarDefault(id, success => {
          this.$message.success(success.msg)
          this.getPage()
        }, warn => {
          this.$message.error(warn.msg)
        })
      } catch { }
    },
    updateStatusDialogClose () {
      this.updateStatusDialogForm = {
        id: 0,
        userStatus: '0'
      }
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
.up-status-dialog /deep/ .el-dialog,
.up-status-dialog /deep/ .el-pager li {
  border-radius: 0.5rem;
}
</style>
