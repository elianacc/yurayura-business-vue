<template>
  <div class="row mt-5 r3">
    <div class="col-4">
      <span class="badge badge-dark bg-twitter font-size-16"
            v-show="pageInfo">
        共{{pageInfo.pages}}页/{{pageInfo.total}}个
      </span>
    </div>
    <div class="col-4 offset-4 pl-5 c2">
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
</style>