import BusinessPagination from '@components/BusinessPagination.vue'
import BusinessImportDialog from '@components/BusinessImportDialog.vue'
import { getMenuSubAll } from '@api/sysMenu'
import { getRoleByOrg } from '@api/sysRole'

export default {
  components: {
    BusinessPagination,
    BusinessImportDialog
  },
  data () {
    return {
      searchContent: {},
      multipleSelection: [],
      pageInfo: {},
      dataTableLoading: false,
      currentPageNum: 1,
      dataDialogTitle: '',
      dataDialogVisible: false,
      dataDialogFormInit: {},
      importDialogVisible: false,
      allMenuSub: [],
      allRole: []
    }
  },
  methods: {
    tbSelectionChange (val) {
      this.multipleSelection = val
    },
    getPage () {
      this.dataTableLoading = true
      let sendData = { ...this.searchContent }
      sendData.pageNum = this.currentPageNum
      sendData.pageSize = 10
      let successCallback = success => {
        this.pageInfo = success.data
        this.dataTableLoading = false
      }
      let warnCallback = warn => {
        this.$message.error(warn.msg)
        this.dataTableLoading = false
      }
      this.getPageImpl(sendData, successCallback, warnCallback)
    },
    getPageImpl (sendData, successCallback, warnCallback) {
      typeof sendData
      typeof successCallback
      typeof warnCallback
    },
    selectContent () {
      this.searchContent = { ...this.selectForm }
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
    exportContent () {
      const loading = this.$loading({
        lock: true,
        text: '导出中...',
        background: 'rgba(0, 0, 0, 0.8)',  // 背景色透明度调低
      })
      let sendData = { ...this.searchContent }
      this.exportContentImpl(sendData, loading)
    },
    exportContentImpl (sendData, loading) {
      typeof sendData
      typeof loading
    },
    insertDialogOpen () {
      this.dataDialogTitle = '『添加窗口』'
      this.dataDialogVisible = true
    },
    updateDialogOpen (id) {
      this.dataDialogTitle = '『修改窗口』'
      this.dataDialogSetRowData(id)
      this.dataDialogVisible = true
    },
    dataDialogSetRowData (id) {
      let current = this.pageInfo.list.find(row => row.id === id)
      Object.keys(this.dataDialogForm).forEach(key => this.dataDialogForm[key] = current[key])
      this.dataDialogSetRowDataCustom(current)
    },
    dataDialogSetRowDataCustom (current) { typeof current },
    async deleteBatch () {
      let successCallback = success => {
        this.$message.success(success.msg)
        this.multipleSelection = []
        this.getPage()
      }
      let warnCallback = warn => {
        this.$message.error(warn.msg)
      }
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请至少选择一项删除')
      } else {
        try {
          await this.$confirm('确定要删除选中项吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          await this.deleteBatchImpl(this.multipleSelection.map(selt => selt.id), successCallback, warnCallback)
        } catch { }
      }
    },
    deleteBatchImpl (ids, successCallback, warnCallback) {
      typeof ids
      typeof successCallback
      typeof warnCallback
    },
    submitContent () {
      const loading = this.$loading({
        lock: true,
        text: '提交中...',
        background: 'rgba(0, 0, 0, 0.8)',  // 背景色透明度调低
      })
      this.$refs.dataDialogForm.validate(valid => {
        if (valid) {
          let sendData = { ...this.dataDialogForm }
          this.setSubmitDataCustom(sendData)
          let successCallback = success => {
            this.$message.success(success.msg)
            if (this.dataDialogForm.id === 0) {
              this.$refs.selectForm.resetFields()
              this.searchContent = { ...this.selectForm }
              this.currentPageNum = 1
            }
            loading.close()
            this.dataDialogVisible = false
            this.getPage()
          }
          let warnCallback = warn => {
            this.$message.error(warn.msg)
            loading.close()
          }
          if (this.dataDialogForm.id === 0) {
            this.insertContent(sendData, successCallback, warnCallback)
          } else {
            this.updateContent(sendData, successCallback, warnCallback)
          }
        }
      })
    },
    setSubmitDataCustom (sendData) { typeof sendData },
    insertContent (sendData, successCallback, warnCallback) {
      typeof sendData
      typeof successCallback
      typeof warnCallback
    },
    updateContent (sendData, successCallback, warnCallback) {
      typeof sendData
      typeof successCallback
      typeof warnCallback
    },
    dataDialogClose () {
      this.dataDialogForm = { ...this.dataDialogFormInit }
      this.$refs.dataDialogForm.clearValidate()
      this.dataDialogCloseExtend()
    },
    dataDialogCloseExtend () { },
    updateImportDialogVisible (val) {
      this.importDialogVisible = val
    },
    importDialogOpen () {
      this.importDialogVisible = true
    },
    importContent (file) {
      const loading = this.$loading({
        lock: true,
        text: '导入中...',
        background: 'rgba(0, 0, 0, 0.8)',  // 背景色透明度调低
      })
      let successCallback = success => {
        this.$message.success(success.msg)
        loading.close()
        this.importDialogVisible = false
        this.getPage()
      }
      let warnCallback = warn => {
        this.$message.error(warn.msg)
        loading.close()
      }
      this.importContentImpl(file, successCallback, warnCallback)
    },
    importContentImpl (file, successCallback, warnCallback) {
      typeof file
      typeof successCallback
      typeof warnCallback
    },
    downloadImportTplt () {
      const loading = this.$loading({
        lock: true,
        text: '下载中...',
        background: 'rgba(0, 0, 0, 0.8)',  // 背景色透明度调低
      })
      this.downloadImportTpltImpl(loading)
    },
    downloadImportTpltImpl (loading) {
      typeof loading
    },
    getAllMenuSub () {
      getMenuSubAll(success => {
        this.allMenuSub = success.data
      })
    },
    getRoleByOrgId (orgId) {
      getRoleByOrg(orgId, success => {
        this.allRole = success.data
      })
    }
  },
  mounted () {
    this.dataDialogFormInit = { ...this.dataDialogForm }
    this.getPage()
  }
}