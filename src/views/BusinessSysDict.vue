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
          <el-form-item label="字典编码"
                        prop="dictCode"
                        label-width="4.5rem">
            <el-input v-model.trim="selectForm.dictCode"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="状态"
                        prop="dictStatus"
                        label-width="3rem">
            <sys-dict-select v-model="selectForm.dictStatus"
                             dictCode="enableStatus">
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
              {{scope.row.dictStatus | sysDictFormatFilter('enableStatus')}}
            </template>
          </el-table-column>
          <el-table-column label="序号"
                           width="200"
                           prop="dictSeq">
          </el-table-column>
          <el-table-column label="操作"
                           width="180">
            <template slot-scope="scope">
              <button type="button"
                      class="btn btn-warning btn-twitter font-size-14 text-white shadow"
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
          <el-form-item label="字典编码"
                        prop="dictCode"
                        label-width="10rem">
            <el-input v-model.trim="dataDialogForm.dictCode"
                      class="w-75"
                      maxlength="20"
                      show-word-limit
                      :disabled="dataDialogForm.id !== 0"></el-input>
          </el-form-item>
          <el-form-item label="字典名"
                        prop="dictName"
                        label-width="10rem">
            <el-input v-model.trim="dataDialogForm.dictName"
                      class="w-75"
                      maxlength="20"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="字典值"
                        prop="dictVal"
                        label-width="10rem">
            <el-input v-model.trim="dataDialogForm.dictVal"
                      class="w-75"
                      maxlength="20"
                      show-word-limit
                      :disabled="dataDialogForm.id !== 0"></el-input>
          </el-form-item>
          <el-form-item label="状态"
                        prop="dictStatus"
                        label-width="10rem">
            <sys-dict-radio-group v-model="dataDialogForm.dictStatus"
                                  dictCode="enableStatus">
            </sys-dict-radio-group>
          </el-form-item>
          <el-form-item label="序号"
                        prop="dictSeq"
                        label-width="10rem">
            <el-input-number :min="1"
                             :max="10000"
                             @blur="dataDialogForm.dictSeq = dataDialogForm.dictSeq || 1"
                             v-model="dataDialogForm.dictSeq"
                             class="w-50"></el-input-number>
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
import { getSysDictPage, insertSysDict, updateSysDict } from '@api/sysDict'
import BusinessPage from '@mixins/BusinessPage'

export default {
  name: 'BusinessSysDict',
  mixins: [BusinessPage],
  data () {
    let checkDictCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('字典编码不能为空'))
      }
      if (!/^[a-z][A-Za-z]*$/.test(value)) {
        return callback(new Error('字典编码只能包含字母，以小写字母开头'))
      }
      callback()
    }
    return {
      selectForm: {
        dictCode: '',
        dictStatus: ''
      },
      dataDialogForm: {
        id: 0,
        dictCode: '',
        dictName: '',
        dictVal: '',
        dictStatus: 1,
        dictSeq: 1
      },
      dataDialogFormRule: {
        dictCode: [{ validator: checkDictCode, trigger: 'blur' }],
        dictName: [{ required: true, message: '字典名不能为空', trigger: 'blur' }],
        dictVal: [{ required: true, message: '字典值不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    getPageImpl (sendData, successCallback, warnCallback) {
      getSysDictPage(sendData, successCallback, warnCallback)
    },
    insertContent (sendData, successCallback, warnCallback) {
      insertSysDict(sendData, successCallback, warnCallback)
    },
    updateContent (sendData, successCallback, warnCallback) {
      updateSysDict(sendData, successCallback, warnCallback)
    },
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
