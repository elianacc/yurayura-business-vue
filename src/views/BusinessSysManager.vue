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
          <el-form-item label="管理员名"
                        prop="managerName"
                        label-width="4.5rem">
            <el-input v-model.trim="selectForm.managerName"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="状态"
                        prop="managerStatus"
                        label-width="3rem">
            <sys-dict-select v-model="selectForm.managerStatus"
                             dictCode="enableStatus">
            </sys-dict-select>
          </el-form-item>
          <el-form-item label="管理员组织"
                        prop="managerOrg"
                        label-width="5.5rem"
                        v-if="$store.getters['manager/managerOrg'] === 0">
            <sys-all-org-select v-model="selectForm.managerOrg"
                                placeholder="----请选择管理员组织----"></sys-all-org-select>
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
          <el-table-column label="管理员名"
                           width="200"
                           prop="managerName">
          </el-table-column>
          <el-table-column label="管理员组织"
                           width="200"
                           prop="managerOrgName">
          </el-table-column>
          <el-table-column label="角色"
                           width="400"
                           prop="roleNamesStr">
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
              {{scope.row.managerStatus | sysDictFormatFilter('enableStatus')}}
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="180">
            <template slot-scope="scope">
              <button type="button"
                      class="btn btn-warning btn-twitter font-size-14 text-white shadow"
                      v-if="$store.getters['manager/managerPermission'].includes(`${$store.getters['menutab/editableTabsValue']}_update`) && scope.row.managerName !== 'admin'"
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
          <el-form-item label="管理员名"
                        prop="managerName"
                        label-width="10rem">
            <el-input v-model.trim="dataDialogForm.managerName"
                      class="w-75"
                      maxlength="20"
                      show-word-limit
                      :disabled="dataDialogForm.id !== 0"></el-input>
          </el-form-item>
          <el-form-item label="密码"
                        label-width="10rem"
                        prop="managerPassword">
            <el-input v-model.trim="dataDialogForm.managerPassword"
                      show-password
                      class="w-75"
                      :placeholder="dataDialogForm.id !== 0? '修改密码为空则使用此管理员旧密码': ''">
            </el-input>
          </el-form-item>
          <el-form-item label="管理员组织"
                        label-width="10rem"
                        prop="managerOrg">
            <sys-all-org-select v-model="dataDialogForm.managerOrg"
                                :disabled="$store.getters['manager/managerOrg'] !== 0"></sys-all-org-select>
          </el-form-item>
          <el-form-item label="角色"
                        label-width="10rem"
                        prop="roleIdArr">
            <el-checkbox-group v-model="dataDialogForm.roleIdArr">
              <el-checkbox v-for="item in allRole"
                           :key="item.id"
                           :label="item.id">{{item.roleName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="状态"
                        prop="managerStatus"
                        label-width="10rem">
            <sys-dict-radio-group v-model="dataDialogForm.managerStatus"
                                  dictCode="enableStatus">
            </sys-dict-radio-group>
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
import { getSysManagerPage, insertSysManager, updateSysManager } from '@api/sysManager'
import BusinessPage from '@mixins/BusinessPage'
import { sendMqttMsg, encryptAes, generate16UUID } from '@utils/common'

export default {
  name: 'BusinessSysManager',
  mixins: [BusinessPage],
  data () {
    let checkPassword = (rule, value, callback) => {
      if (this.dataDialogForm.id === 0 && !value) {
        return callback(new Error('密码不能为空'))
      }
      callback()
    }
    return {
      selectForm: {
        managerName: '',
        managerStatus: '',
        managerOrg: ''
      },
      dataDialogForm: {
        id: 0,
        managerName: '',
        managerPassword: '',
        managerOrg: 1,
        roleIdArr: [],
        managerStatus: 1
      },
      submitReady: false,
      sendData: {
        id: 0,
        managerName: '',
        managerPassword: '',
        managerPassSalt: '',
        managerOrg: 1,
        roleIdArr: [],
        managerStatus: 1
      },
      successCallback: () => { },
      warnCallback: () => { },
      dataDialogFormRule: {
        managerName: [{ required: true, message: '管理员名不能为空', trigger: 'blur' }],
        managerPassword: [{ validator: checkPassword, trigger: 'blur' }]
      }
    }
  },
  methods: {
    getPageImpl (sendData, successCallback, warnCallback) {
      if (this.$store.getters['manager/managerOrg'] !== 0) {
        sendData.managerOrg = this.$store.getters['manager/managerOrg']
      }
      getSysManagerPage(sendData, successCallback, warnCallback)
    },
    dataDialogSetRowDataCustom (current) {
      this.$nextTick(() => {
        this.dataDialogForm.roleIdArr = current.roleIdsStr ? current.roleIdsStr.split(',').map(Number) : []
      })
    },
    insertContent (sendData, successCallback, warnCallback) {
      this.sendData = { ...sendData }
      this.sendData.managerPassSalt = generate16UUID()
      this.successCallback = successCallback
      this.warnCallback = warnCallback
      sendMqttMsg('yura-cloud-sys/sendFrontPassKey', null, () => { })
    },
    updateContent (sendData, successCallback, warnCallback) {
      if (sendData.managerPassword) {
        this.sendData = { ...sendData }
        this.successCallback = successCallback
        this.warnCallback = warnCallback
        sendMqttMsg('yura-cloud-sys/sendFrontPassKeySalt', this.dataDialogForm.managerName, () => { })
      } else {
        updateSysManager(sendData, successCallback, warnCallback)
      }
    }
  },
  watch: {
    'dataDialogForm.managerOrg': {
      handler (val) {
        if (this.$store.getters['manager/managerOrg'] === 0) {
          this.dataDialogForm.roleIdArr = []
          this.getRoleByOrgId(val)
        }
      },
      immediate: true
    },
    submitReady (val) {
      if (val) {
        if (this.dataDialogForm.id === 0) {
          insertSysManager(this.sendData, this.successCallback, this.warnCallback)
          this.submitReady = false
        } else {
          updateSysManager(this.sendData, this.successCallback, this.warnCallback)
          this.submitReady = false
        }
      }
    }
  },
  mounted () {
    if (this.$store.getters['manager/managerOrg'] !== 0) {
      this.getRoleByOrgId(this.$store.getters['manager/managerOrg'])
      this.dataDialogForm.managerOrg = this.$store.getters['manager/managerOrg']
      this.dataDialogFormInit = { ...this.dataDialogForm }
    }
    // 监听mqtt接收消息
    this.$mqttSubClient.on('message', (topic, message) => {
      if (message) {

        let res = JSON.parse(message.toString())

        if (topic === 'yura-business-vue/getPassKey') {
          let passSecretKey = res.passSecretKey
          this.sendData.managerPassword = encryptAes(this.dataDialogForm.managerPassword, passSecretKey, this.sendData.managerPassSalt)
          this.submitReady = true
        }

        if (topic === 'yura-business-vue/getPassKeySalt') {
          if (!res.passSecretKey) {
            this.$message.error(res.result)
          } else {
            let passSecretKey = res.passSecretKey
            let passSalt = res.passSalt
            this.sendData.managerPassword = encryptAes(this.dataDialogForm.managerPassword, passSecretKey, passSalt)
            this.submitReady = true
          }
        }

      }
    })
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
</style>
