<template>
  <div class="container pt-4">

    <!-- 标图row -->
    <div class="row mt-5">
      <div class="col-2 offset-5">
        <img src="~@assets/github.png"
             class="mx-auto d-block"
             width="80"
             height="80" />
      </div>
    </div>

    <!-- 标题row -->
    <div class="row mt-4">
      <div class="col-4 offset-4">
        <h4 class="lead text-center">Yura~yura后台登入</h4>
      </div>
    </div>

    <!-- 管理员登入表单row -->
    <div class="row mt-3">
      <div class="col-4 offset-4">
        <div class="col-10 offset-1">
          <div class="card shadow-lg">
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
                    <img :src="loginForm.verifyImage"
                         @click="loadVerifyImage" />
                  </el-col>

                </el-form-item>

                <el-form-item>
                  <div class="d-grid">
                    <button type="submit"
                            class="btn btn-primary mt-3">
                      <i class="fa fa-sign-in fa-lg me-2"></i>登入
                    </button>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { sysManagerLogin } from '@api/sysManager'
import { sendMqttMsg, encryptAes } from '@utils/common'

export default {
  name: 'ManagerLogin',
  data () {
    return {
      loginForm: {
        managerName: '',
        managerPassword: '',
        verifyCode: '',
        verifyImage: ''
      },
      loginLoading: null,
      loginReady: false,
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
          this.loginLoading = this.$loading({
            lock: true,
            text: '登入中...',
            spinner: 'el-icon-loading',
            background: '#f7f9f9'
          })
          sendMqttMsg('yura-cloud-sys/sendFrontPassKeySalt', this.loginForm.managerName, () => { })
        }
      })
    },
    loadVerifyImage () {
      this.loginForm.verifyImage = `/api/sys/manager/getVerifyCode?randomId=${Math.random()}`
    }
  },
  watch: {
    loginReady (val) {
      if (val) {
        sysManagerLogin(this.loginForm, success => {
          this.$store.dispatch('menutab/resetMenuAndTab')
          this.$store.dispatch('notice/resetNoticeNum')
          this.$store.commit('token/SET_TOKEN', success.data)
          setTimeout(() => {
            this.loginLoading.close()
            this.$router.replace('/business/index')
          }, 1000)
        }, warn => {
          this.$message.error(warn.msg)
          this.loginReady = false
          this.loadVerifyImage()
          this.$refs.loginForm.resetFields()
          this.loginLoading.close()
        })
      }
    }
  },
  mounted () {
    this.loginForm.verifyImage = `/api/sys/manager/getVerifyCode?randomId=${Math.random()}`
    // 监听mqtt接收消息
    this.$mqttSubClient.on('message', (topic, message) => {
      if (message) {
        if (topic === 'yura-business-vue/getPassKeySalt') {
          let res = JSON.parse(message.toString())
          if (!res.passSecretKey) {
            this.$message.error(res.result)
            this.loadVerifyImage()
            this.$refs.loginForm.resetFields()
            this.loginLoading.close()
          } else {
            let passSecretKey = res.passSecretKey
            let passSalt = res.passSalt
            this.loginForm.managerPassword = encryptAes(this.loginForm.managerPassword, passSecretKey, passSalt)
            this.loginReady = true
          }
        }
      }
    })
  }
}
</script>

<style scoped>
/* el垂直表单标签重写（padding-bottom置为0） */
.card-body /deep/ .el-form--label-top .el-form-item__label {
  padding: 0rem;
}
/* el表单项重写（margin-bottom置为0） */
.card-body /deep/ .el-form-item {
  margin-bottom: 0rem;
}

/* bs5 label重写（margin-bottom置为0） */
.card-body /deep/ label {
  margin-bottom: 0rem;
}
</style>
