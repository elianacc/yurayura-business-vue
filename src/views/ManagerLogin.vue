<template>
  <div class="container">

    <!-- 标图row -->
    <div class="row mt-5">
      <div class="col-2 offset-5">
        <img src="~@assets/github.png"
             class="mx-auto d-block"
             width="50"
             height="50" />
      </div>
    </div>

    <!-- 标题row -->
    <div class="row mt-4">
      <div class="col-4 offset-4">
        <h4 class="lead text-center text-white">Yura~yura后台登入</h4>
      </div>
    </div>

    <!-- 管理员登入表单row -->
    <div class="row mt-3">
      <div class="col-4 offset-4">
        <div class="card shadow">
          <div class="card-body">
            <el-form :model="loginForm"
                     :rules="loginRules"
                     ref="loginForm"
                     label-position="top"
                     hide-required-asterisk
                     inline-message
                     @submit.native.prevent="loginBusiness">
              <el-form-item label="用户名"
                            prop="managerName">
                <el-input v-model.trim="loginForm.managerName"></el-input>
              </el-form-item>
              <el-form-item label="密码"
                            prop="managerPassword">
                <el-input v-model.trim="loginForm.managerPassword"
                          show-password></el-input>
              </el-form-item>
              <el-form-item label="验证码"
                            prop="verifyCode">
                <el-col :span="15">
                  <el-input v-model.trim="loginForm.verifyCode"></el-input>
                </el-col>

                <el-col :span="8"
                        :offset="1">
                  <img ref="verifyImage"
                       src="/api/sys/manager/getVerifyCode"
                       @click="loadVerifyImage" />
                </el-col>

              </el-form-item>

              <el-form-item>
                <button type="submit"
                        class="btn btn-primary btn-block mt-3 pr-4">
                  <i class="fa fa-sign-in fa-lg mr-2"></i>登入
                </button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Base64 } from 'js-base64'

export default {
  name: 'ManagerLogin',
  data () {
    return {
      loginForm: {
        managerName: '',
        managerPassword: '',
        verifyCode: ''
      },
      loginRules: {
        managerName: [
          { required: true, message: '用户名不能为空', trigger: 'change' }
        ],
        managerPassword: [
          { required: true, message: '密码不能为空', trigger: 'change' }
        ],
        verifyCode: [
          { required: true, message: '验证码不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    loginBusiness () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginForm.managerPassword = Base64.encode(this.loginForm.managerPassword)
          this.$axios({
            method: 'post',
            url: '/api/sys/manager/login',
            data: JSON.stringify(this.loginForm),
            responseType: 'json'
          }).then(res => {
            if (res.data.code === 200) {
              this.$storageUtil.setManagerMsg(res.data.data)
              this.$storageUtil.deleteSideMenuActive()
              this.$storageUtil.deleteEditableTabs()
              this.$storageUtil.deleteEditableTabsValue()
              this.$router.push('/business')
            } else if (res.data.code === 102) {
              this.loadVerifyImage()
              this.$refs.loginForm.resetFields()
              this.$message.error(res.data.msg)
            } else if (res.data.code === 103) {
              console.log(res.data.msg)
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
    loadVerifyImage () {
      this.$refs.verifyImage.src = `/api/sys/manager/getVerifyCode?randomId=${Math.random()}`
    }
  }
}
</script>

<style scoped>
.container {
  width: 992px;
}

/* el垂直表单标签重写（padding-bottom置为0） */
.card-body /deep/ .el-form--label-top .el-form-item__label {
  padding: 0rem;
}
/* el表单项重写（margin-bottom置为0） */
.card-body /deep/ .el-form-item {
  margin-bottom: 0rem;
}

/* bs4标签重写（margin-bottom置为0） */
.card-body /deep/ label {
  margin-bottom: 0rem;
}
</style>
