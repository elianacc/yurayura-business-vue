<template>
  <div>
    <!-- 操作按钮及数据筛选表单row -->
    <div class="row mt-2 r1">

      <div class="col-4">
        <div class="d-flex align-content-between flex-wrap gap-3">
          <button type="button"
                  class="btn btn-primary font-size-14"
                  v-if="$store.getters['manager/managerPermission'].includes(`${$store.getters['menutab/editableTabsValue']}_insert`)"
                  @click="insertDialogOpen">
            <i class="fa fa-plus-circle me-2"></i>添加
          </button>
          <button type="button"
                  class="btn btn-danger font-size-14"
                  @click="deleteBatch"
                  v-if="$store.getters['manager/managerPermission'].includes(`${$store.getters['menutab/editableTabsValue']}_deleteBatch`)">
            <i class="fa fa-trash me-2"></i>删除
          </button>
          <button type="button"
                  class="btn btn-warning font-size-14 text-white"
                  @click="exportContent"
                  v-if="$store.getters['manager/managerPermission'].includes(`${$store.getters['menutab/editableTabsValue']}_export`)">
            <i class="fa fa-upload me-2"></i>导出
          </button>
          <button type="button"
                  class="btn btn-info font-size-14 text-white"
                  @click="importDialogOpen"
                  v-if="$store.getters['manager/managerPermission'].includes(`${$store.getters['menutab/editableTabsValue']}_import`)">
            <i class="fa fa-download me-2"></i>导入
          </button>
          <button type="button"
                  class="btn btn-secondary font-size-14"
                  @click="downloadImportTplt"
                  v-if="$store.getters['manager/managerPermission'].includes(`${$store.getters['menutab/editableTabsValue']}_import`)">
            <i class="fa fa-file-excel-o me-2"></i>下载导入模板
          </button>
        </div>
      </div>

      <div class="col-8 c2">
        <el-form inline
                 :model="selectForm"
                 ref="selectForm"
                 label-suffix=":"
                 size="small"
                 class="float-end"
                 @submit.native.prevent="selectContent">
          <el-form-item label="番剧名"
                        prop="comicName"
                        label-width="4rem">
            <el-input v-model.trim="selectForm.comicName"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="状态"
                        prop="comicStatus"
                        label-width="3rem">
            <sys-dict-select v-model="selectForm.comicStatus"
                             dictCode="comicStatus">
            </sys-dict-select>
          </el-form-item>
          <el-form-item label="上架状态"
                        prop="comicShelfStatus"
                        label-width="5rem">
            <sys-dict-select v-model="selectForm.comicShelfStatus"
                             dictCode="comicShelfStatus">
            </sys-dict-select>
          </el-form-item>
          <el-form-item label="标签"
                        prop="comicTag"
                        label-width="3rem">
            <sys-dict-select v-model="selectForm.comicTag"
                             dictCode="comicLabel"
                             placeholder="请选择或输入标签"
                             isMultiple
                             allowCreate>
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
                  v-loading="dataTableLoading"
                  @selection-change="tbSelectionChange">
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column label="图片"
                           width="200">
            <template slot-scope="scope">
              <div class="cmImg-mask">
                <img :src="scope.row.comicImageUrl"
                     class="rounded"
                     width="165"
                     height="217" />
                <a :href="scope.row.comicLink"
                   target="_blank">
                  <div class="cmImg-mask-content"><i class="fa fa-play-circle-o fa-5x"></i><br /><br /><br /></div>
                </a>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="番剧名"
                           width="200">
            <template slot-scope="scope">
              <span>{{scope.row.comicName}}<span v-show="scope.row.comicShelfStatus === 0">(已下架)</span></span>
            </template>
          </el-table-column>
          <el-table-column label="评分"
                           width="100"
                           prop="comicScore">
          </el-table-column>
          <el-table-column label="简介"
                           width="350"
                           prop="comicContent">
          </el-table-column>
          <el-table-column label="当前状态"
                           width="200">
            <template slot-scope="scope">
              {{scope.row.comicStatus | comicCurrentStatusFilter(scope.row.comicCurrentEpisodes)}}
            </template>
          </el-table-column>
          <el-table-column label="标签"
                           width="200">
            <template slot-scope="scope">
              {{scope.row.comicLabel | comicLabelShowFilter}}
            </template>
          </el-table-column>
          <el-table-column label="放送时间"
                           width="200"
                           prop="comicTime">
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
          <el-form-item label="番剧名"
                        prop="comicName"
                        label-width="10rem">
            <el-input v-model.trim="dataDialogForm.comicName"
                      class="w-75"
                      maxlength="30"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="放送时间"
                        prop="comicTime"
                        label-width="10rem">
            <el-date-picker type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择日期"
                            v-model="dataDialogForm.comicTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="评分"
                        prop="comicScore"
                        label-width="10rem">
            <el-input-number :min="1.0"
                             :precision="1"
                             :step="0.1"
                             :max="10"
                             @blur="dataDialogForm.comicScore = dataDialogForm.comicScore || 1.0"
                             v-model="dataDialogForm.comicScore"
                             class="w-50">
            </el-input-number>
          </el-form-item>
          <el-form-item label="简介"
                        prop="comicContent"
                        label-width="10rem">
            <el-input type="textarea"
                      v-model.trim="dataDialogForm.comicContent"
                      class="w-75"
                      rows="3"
                      maxlength="500"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="状态"
                        prop="comicStatus"
                        label-width="10rem">
            <sys-dict-radio-group v-model="dataDialogForm.comicStatus"
                                  dictCode="comicUpdtStatus">
            </sys-dict-radio-group>
          </el-form-item>
          <el-form-item label="更新时间"
                        prop="comicUdTime"
                        label-width="10rem"
                        v-show="dataDialogForm.cmUdTimeShow">
            <sys-dict-select v-model="dataDialogForm.comicUdTime"
                             dictCode="comicUpdtTime"
                             placeholder="----请选择更新时间----"
                             customClass="w-50">
            </sys-dict-select>
          </el-form-item>
          <el-form-item label="当前话数"
                        prop="comicCurrentEpisodes"
                        label-width="10rem">
            <el-input-number :min="1"
                             :max="10000"
                             @blur="dataDialogForm.comicCurrentEpisodes = dataDialogForm.comicCurrentEpisodes || 1"
                             v-model="dataDialogForm.comicCurrentEpisodes"
                             class="w-50"></el-input-number>
          </el-form-item>
          <el-form-item label="标签"
                        prop="cmTag"
                        label-width="10rem">
            <sys-dict-checkbox-btn-group v-model="dataDialogForm.cmTag"
                                         dictCode="comicLabel"
                                         fill="#007bff"
                                         iconClass="fa fa-paperclip me-2">
            </sys-dict-checkbox-btn-group>
          </el-form-item>
          <el-form-item label="自定义标签"
                        label-width="10rem">
            <el-tag v-for="tag in dataDialogForm.customTag"
                    :key="tag"
                    effect="dark"
                    color="#007bff"
                    closable
                    @close="customTagClose(tag)">
              {{tag}}
            </el-tag>
            <el-input class="input-new-tag"
                      v-focusInput
                      v-if="dataDialogForm.customTagInputVisible"
                      v-model.trim="dataDialogForm.customTagInput"
                      ref="customTagInput"
                      @keyup.enter.native="customTagInputConfirm"
                      @blur="customTagInputConfirm">
            </el-input>
            <el-button v-else
                       class="button-new-tag"
                       @click="showCustomTagInput">+ 新标签</el-button>
          </el-form-item>
          <el-form-item label="图片"
                        label-width="10rem">
            <el-upload action=""
                       ref="dialogComicImgUpl"
                       list-type="picture-card"
                       :auto-upload="false"
                       :limit="1"
                       :on-exceed="cmImgUplLimitTip"
                       :on-change="cmImgUplChange"
                       :on-remove="cmImgUplDel"
                       class="mb-2">
              <div class="cmImg-mask"
                   v-if="dataDialogForm.cmImgUplUrl"><img :src="dataDialogForm.cmImgUplUrl"
                     width="132"
                     height="174"
                     class="rounded">
                <div class="cmImg-mask-content"><i class="el-icon-upload2 text-light"></i></div>
              </div>
              <i class="el-icon-plus"
                 v-else></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="观看地址"
                        prop="comicLink"
                        label-width="10rem">
            <el-input v-model.trim="dataDialogForm.comicLink"
                      class="w-75"></el-input>
          </el-form-item>
          <el-form-item label="上架状态"
                        prop="comicShelfStatus"
                        label-width="10rem"
                        v-if="dataDialogForm.id !== 0">
            <sys-dict-radio-group v-model="dataDialogForm.comicShelfStatus"
                                  dictCode="comicShelfStatus">
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

    <!-- 导入对话框 -->
    <business-import-dialog :visible="importDialogVisible"
                            @update:visible="updateImportDialogVisible"
                            @importContent="importContent"></business-import-dialog>

  </div>
</template>

<script>
import { getComicPage, insertComic, updateComic, deleteComicBatchByIds, exportComic, importComic, downloadComicImportTplt } from '@api/comic'
import { uploadImgIsCorrect, downloadStream } from '@utils/common'
import BusinessPage from '@mixins/BusinessPage'

export default {
  name: 'BusinessComicInfo',
  mixins: [BusinessPage],
  data () {
    return {
      selectForm: {
        comicName: '',
        comicStatus: '',
        comicShelfStatus: '',
        comicTag: []
      },
      dataDialogForm: {
        id: 0,
        comicName: '',
        comicScore: 1.0,
        comicTime: '',
        comicContent: '',
        comicStatus: 0,
        comicUdTime: '',
        cmUdTimeShow: false,
        comicCurrentEpisodes: 1,
        cmTag: [],
        customTag: [],
        customTagInputVisible: false,
        customTagInput: '',
        cmImgUplUrl: '',
        cmImgUplUrlTmp: '',
        comicImgFile: null,
        comicLink: '',
        comicShelfStatus: 1
      },
      dataDialogFormRule: {
        comicName: [{ required: true, message: '番剧名不能为空', trigger: 'blur' }],
        comicTime: [{ required: true, message: '放送时间不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    getPageImpl (sendData, successCallback, warnCallback) {
      getComicPage(sendData, successCallback, warnCallback)
    },
    exportContentImpl (sendData, loading) {
      exportComic(sendData, success => {
        downloadStream(success, 'application/octet-stream', '番剧信息.xlsx')
        loading.close()
      })
    },
    importContentImpl (file, successCallback, warnCallback) {
      importComic(file, successCallback, warnCallback)
    },
    downloadImportTpltImpl (loading) {
      downloadComicImportTplt(success => {
        downloadStream(success, 'application/octet-stream', '番剧导入模板.xlsx')
        loading.close()
      })
    },
    deleteBatchImpl (ids, successCallback, warnCallback) {
      deleteComicBatchByIds(ids, successCallback, warnCallback)
    },
    dataDialogSetRowDataCustom (current) {
      this.dataDialogForm.cmImgUplUrl = current.comicImageUrl
      this.dataDialogForm.cmImgUplUrlTmp = current.comicImageUrl
      this.dataDialogForm.comicStatus = current.comicStatus !== 0 ? 8 : 0
      this.dataDialogForm.cmUdTimeShow = current.comicStatus !== 0
      this.dataDialogForm.comicUdTime = current.comicStatus !== 0 && current.comicStatus !== 8 ? current.comicStatus.toString() : ''
      this.diaLogComicLabel = current.comicLabel
    },
    customTagClose (tag) {
      this.dataDialogForm.customTag.splice(this.dataDialogForm.customTag.indexOf(tag), 1)
    },
    customTagInputConfirm () {
      let inputValue = this.dataDialogForm.customTagInput
      if (inputValue && this.dataDialogForm.customTag.indexOf(inputValue) === -1 && this.dataDialogForm.cmTag.indexOf(inputValue) === -1) {
        this.dataDialogForm.customTag.push(inputValue)
      } else {
        if (inputValue) {
          this.$message.warning('当前标签已存在')
        }
      }
      this.dataDialogForm.customTagInputVisible = false
      this.dataDialogForm.customTagInput = ''
    },
    showCustomTagInput () {
      if (this.dataDialogForm.customTag.length === 4) {
        this.$message.warning('最多添加4个自定义标签')
      } else {
        this.dataDialogForm.customTagInputVisible = true
      }
    },
    cmImgUplLimitTip () {
      this.$message.warning('只能上传一张图片')
    },
    cmImgUplChange (file) {
      let isCorrect = uploadImgIsCorrect(file.raw, 102400)
      if (isCorrect) {
        this.dataDialogForm.cmImgUplUrl = ''
        this.dataDialogForm.comicImgFile = file.raw
      } else {
        this.$refs.dialogComicImgUpl.clearFiles()
      }
    },
    cmImgUplDel () {
      this.dataDialogForm.cmImgUplUrl = this.dataDialogForm.cmImgUplUrlTmp
      this.dataDialogForm.comicImgFile = null
    },
    setSubmitDataCustom (sendData) {
      let comicLabelArr = [...this.diaLogComicLabel]
      for (let index = 0; index < 4 - this.dataDialogForm.customTag.length; index++) {
        comicLabelArr.push('')
      }
      sendData.comicLabel = comicLabelArr
      if (!this.dataDialogForm.comicImgFile) {
        delete sendData.comicImgFile
      }
    },
    insertContent (sendData, successCallback, warnCallback) {
      insertComic(sendData, successCallback, warnCallback)
    },
    updateContent (sendData, successCallback, warnCallback) {
      updateComic(sendData, successCallback, warnCallback)
    },
    dataDialogCloseExtend () {
      this.$set(this.dataDialogForm.customTag, 'length', 0)
      this.$refs.dialogComicImgUpl.clearFiles()
    }
  },
  watch: {
    'dataDialogForm.comicStatus' (val) {
      this.dataDialogForm.cmUdTimeShow = val === 8
      if (val === 0) {
        this.dataDialogForm.comicUdTime = ''
      }
    }
  },
  computed: {
    diaLogComicLabel: {
      get () {
        return this.dataDialogForm.cmTag.concat(this.dataDialogForm.customTag)
      },
      set (value) {
        let labelArr = value.split(',')
        this.dataDialogForm.cmTag = labelArr.slice(0, labelArr.length - 4)
        let customTagArr = labelArr.slice(labelArr.length - 4, labelArr.length)
        this.dataDialogForm.customTag = customTagArr.filter(tag => tag !== '')
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

/* 番剧图片遮罩 */
.r2 .c1 .cmImg-mask {
  width: 165px;
  height: 217px;
  position: relative;
  cursor: pointer;
}
.r2 .c1 .cmImg-mask .cmImg-mask-content {
  width: 165px;
  height: 217px;
  background: black;
  position: absolute;
  bottom: 0px;
  left: 0px;
  display: none;
  font-size: 16px;
  color: white;
  text-align: center;
  padding-top: 68px;
  border-radius: 0.25rem;
}
.r2 .c1 .cmImg-mask:hover .cmImg-mask-content {
  width: 165px;
  height: 217px;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  bottom: 0px;
  left: 0px;
  display: block;
  font-size: 16px;
  color: white;
  text-align: center;
  padding-top: 68px;
  border-radius: 0.25rem;
}

/* el对话框重写 */
.data-dialog /deep/ .el-dialog,
.data-dialog /deep/ .el-pager li {
  border-radius: 0.5rem;
}

/* el表单自定义标签重写 */
.data-dialog .el-tag + .el-tag {
  margin-left: 0.5rem;
}
.data-dialog .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.data-dialog .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

/* data-dialog表单 */
/* el表单上传重写 */
.data-dialog /deep/ .el-upload--picture-card {
  width: 132px;
  height: 174px;
  line-height: 174px;
}
.data-dialog /deep/ .el-upload-list--picture-card .el-upload-list__item {
  width: 132px;
  height: 174px;
}
.data-dialog /deep/ .el-upload--picture-card i {
  font-size: 30px;
}

/* 番剧上传图片遮罩 */
.data-dialog .cmImg-mask {
  width: 134px;
  height: 176px;
  position: relative;
  cursor: pointer;
  bottom: 2px;
  right: 2px;
}
.data-dialog .cmImg-mask .cmImg-mask-content {
  width: 134px;
  height: 176px;
  background: black;
  position: absolute;
  bottom: 1px;
  left: -1px;
  display: none;
  font-size: 16px;
  color: white;
  text-align: center;
  padding-top: 7px;
  border-radius: 0.25rem;
}
.data-dialog .cmImg-mask:hover .cmImg-mask-content {
  width: 134px;
  height: 176px;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  bottom: 1px;
  left: -1px;
  display: block;
  font-size: 16px;
  color: white;
  text-align: center;
  padding-top: 7px;
  border-radius: 0.25rem;
}
</style>
