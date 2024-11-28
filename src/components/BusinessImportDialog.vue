<template>
  <div class="import-dialog">
    <el-dialog :title="importDialogTitle"
               :visible.sync="importDialogVisible"
               @close="importDialogClose"
               v-dialogDrag>

      <div class="d-flex justify-content-center">
        <el-upload action=""
                   :auto-upload="false"
                   :limit="1"
                   accept=".xlsx"
                   :file-list="importFileList"
                   :on-exceed="importUplLimitTip"
                   :on-change="importUplChange"
                   :on-remove="importUplDel"
                   drag>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip"
               slot="tip">只能上传xlsx文件，且不超过10M</div>
        </el-upload>
      </div>

      <div slot="footer"
           class="dialog-footer">
        <el-button type="danger"
                   icon="el-icon-close"
                   @click="importDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   icon="el-icon-check"
                   @click="importContent">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BusinessImportDialog',
  props: {
    visible: { type: Boolean, default: false }
  },
  data () {
    return {
      importDialogVisible: this.visible,
      importDialogTitle: '『导入窗口』',
      importFileList: []
    }
  },
  watch: {
    visible (newVal) {
      this.importDialogVisible = newVal
    },
    importDialogVisible (newVal) {
      this.$emit("update:visible", newVal)
    }
  },
  methods: {
    importUplLimitTip () {
      this.$message.warning('只能上传一个excel文件')
    },
    importUplChange (file) {
      this.importFileList.push(file.raw)
    },
    importUplDel () {
      this.importFileList.splice(0, 1)
    },
    importDialogClose () {
      this.$emit('getPage')
      this.importFileList.splice(0, 1)
      this.importDialogVisible = false
    },
    importContent () {
      if (this.importFileList.length === 0) {
        this.$message.warning("请上传excel文件")
      } else {
        this.$emit('importContent', this.importFileList[0])
      }
    }
  }
}
</script>

<style scoped>
/* el对话框重写 */
.import-dialog /deep/ .el-dialog,
.import-dialog /deep/ .el-pager li {
  border-radius: 0.5rem;
}
</style>