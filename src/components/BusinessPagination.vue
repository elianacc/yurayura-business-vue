<template>
  <div class="row mt-5 custom-pagination">
    <div class="col-4">
      <span class="badge badge-dark bg-twitter-content font-size-16"
            v-show="pageInfo.pages">
        共{{pageInfo.pages}}页/{{pageInfo.total}}个
      </span>
    </div>
    <div class="col-4 offset-4 ps-5">
      <el-pagination @current-change="currentPageChange"
                     :current-page.sync="pageInfo.pageNum"
                     :page-size="pageInfo.pageSize"
                     :pager-count="pageInfo.navigatePages"
                     layout="prev, pager, next, jumper"
                     :total="pageInfo.total"
                     background
                     hide-on-single-page>
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessPagination',
  props: {
    pageInfo: Object
  },
  methods: {
    currentPageChange (val) {
      this.$emit('currentPageChangeImpl', val)
    }
  }
}
</script>

<style scoped>
/* el分页重写 */
.custom-pagination /deep/ .el-pagination.is-background .btn-next,
.custom-pagination /deep/ .el-pagination.is-background .btn-prev,
.custom-pagination /deep/ .el-pagination.is-background .el-pager li {
  background-color: #192734;
}
.custom-pagination /deep/ .el-pagination.is-background .btn-next.disabled,
.custom-pagination /deep/ .el-pagination.is-background .btn-next:disabled,
.custom-pagination /deep/ .el-pagination.is-background .btn-prev.disabled,
.custom-pagination /deep/ .el-pagination.is-background .btn-prev:disabled,
.custom-pagination /deep/ .el-pagination.is-background .el-pager li.disabled {
  color: #606266;
}
.custom-pagination /deep/ .el-pagination.is-background .btn-next,
.custom-pagination /deep/ .el-pagination.is-background .btn-prev,
.custom-pagination /deep/ .el-pagination.is-background .el-pager li {
  color: #f8f9fa;
}
.custom-pagination
  /deep/
  .el-pagination.is-background
  .el-pager
  li:not(.disabled).active {
  background-color: #007bff;
}
.custom-pagination /deep/ .el-pagination__jump {
  color: #f8f9fa;
}
</style>