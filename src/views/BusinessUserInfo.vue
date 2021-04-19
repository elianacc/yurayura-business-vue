<template>
  <div>
    <!-- 数据筛选表单row -->
    <div class="row mt-4 r1">

      <div class="col-2">
      </div>

      <div class="col-10 c2">
        <el-form inline
                 :model="selectForm"
                 ref="selectForm"
                 label-suffix=":"
                 size="small"
                 class="float-right"
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
            <el-select v-model="selectForm.userSex"
                       clearable
                       placeholder="请选择">
              <el-option value="1"
                         label="男">
              </el-option>
              <el-option value="0"
                         label="女">
              </el-option>
            </el-select>
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
            <el-select v-model="selectForm.userStatus"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in userStatusDict"
                         :key="item.id"
                         :value="item.dictVal"
                         :label="item.dictName">
              </el-option>
            </el-select>
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
          <el-table-column label="头像"
                           width="100">
            <template slot-scope="scope">
              <img :src="scope.row.userAvatarUrl"
                   class="rounded"
                   width="100"
                   height="100" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'BusinessUserInfo',
  data () {
    return {
      selectForm: {
        userNameKeyword: '',
        userSex: '',
        userPhoneNumber: '',
        userStatus: ''
      },
      searchContent: {},
      pageInfo: {},
      currentPageNum: 1,
      userStatusDict: []
    }
  },
  methods: {
    async getSysDict () {
      this.userStatusDict = await this.$sysDictUtil.get('userStatus')
    },
    getPage () {
      let sendData = Object.assign({}, this.searchContent)
      sendData.pageNum = this.currentPageNum
      sendData.pageSize = 10
      this.$axios({
        method: 'post',
        url: '/api/user/getPage',
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
    },
    clearSelectContent () {

    }
  },
  mounted () {
    this.getSysDict()
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
</style>
