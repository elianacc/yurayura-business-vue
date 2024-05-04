import BusinessPagination from '@components/BusinessPagination.vue'

export default {
  components: {
    BusinessPagination
  },
  data () {
    return {
      searchContent: {},
      multipleSelection: [],
      pageInfo: {},
      currentPageNum: 1,
      dataDialogTitle: '',
      dataDialogVisible: false,
      dataDialogFormInit: null,
    }
  },
  methods: {
    tbSelectionChange (val) {
      this.multipleSelection = val
    },
    getPage () {
      let sendData = { ...this.searchContent }
      sendData.pageNum = this.currentPageNum
      sendData.pageSize = 10
      this.getPageImpl(sendData)
    },
    getPageImpl () { },
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
    deleteBatch () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请至少选择一项删除')
      } else {
        this.$confirm('确定要删除选中项吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteBatchImpl()
        })
      }
    },
    deleteBatchImpl () { },
    submitContent () {
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
            this.dataDialogVisible = false
          }
          let warnCallback = warn => { this.$message.error(warn.msg) }
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
      this.getPage()
      this.dataDialogForm = { ...this.dataDialogFormInit }
      this.$refs.dataDialogForm.clearValidate()
      this.dataDialogCloseExtend()
    },
    dataDialogCloseExtend () { }
  },
  mounted () {
    this.dataDialogFormInit = { ...this.dataDialogForm }
    this.getPage()
  }
}