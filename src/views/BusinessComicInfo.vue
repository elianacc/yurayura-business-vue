<template>
  <div>
    <!-- 操作按钮及数据筛选表单row -->
    <div class="row mt-4 r1">

      <div class="col-2">
        <div class="btn-group float-left">
          <button type="button"
                  class="btn btn-info btn-twitter font-size-14"
                  v-if="$storageUtil.getManagerMsg().managerPermission.includes('insert')">
            <i class="fa fa-plus-circle mr-2"></i>添加
          </button>
          <button type="button"
                  class="btn btn-danger btn-twitter font-size-14"
                  @click="deleteBatch"
                  v-if="$storageUtil.getManagerMsg().managerPermission.includes('delete')">
            <i class="fa fa-trash mr-2"></i>删除
          </button>
        </div>
      </div>

      <div class="col-10 c2">
        <el-form inline
                 :model="selectForm"
                 label-suffix=":"
                 size="small"
                 class="float-right"
                 @submit.native.prevent="selectContent">
          <el-form-item label="番剧名"
                        prop="comicName"
                        label-width="4rem">
            <el-input v-model="selectForm.comicName"></el-input>
          </el-form-item>
          <el-form-item label="状态"
                        prop="comicStatus"
                        label-width="3rem">
            <el-select v-model="selectForm.comicStatus"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in comicStatusDict"
                         :key="item.id"
                         :value="item.dictVal"
                         :label="item.dictName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态"
                        prop="comicShelfStatus"
                        label-width="5rem">
            <el-select v-model="selectForm.comicShelfStatus"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in comicShelfStatusDict"
                         :key="item.id"
                         :value="item.dictVal"
                         :label="item.dictName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签"
                        prop="comicTag"
                        label-width="3rem">
            <el-select v-model="selectForm.comicTag"
                       clearable
                       multiple
                       filterable
                       allow-create
                       default-first-option
                       collapse-tags
                       placeholder="请选择或输入标签">
              <el-option v-for="item in comicLabelDict"
                         :key="item.id"
                         :value="item.dictVal"
                         :label="item.dictName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <button class="btn btn-primary btn-twitter font-size-14"
                    type="submit">
              <i class="fa fa-filter mr-2"></i>查询
            </button>
          </el-form-item>
        </el-form>
      </div>

    </div>

    <!-- 数据表格row -->
    <div class="row r2">
      <div class="col-12 c1">
        <template>
          <el-table :data="pageInfo.list"
                    @selection-change="tbCheckChange">
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
                <span>{{scope.row.comicName}}<span v-show="scope.row.comicShelfStatus == 0">(已下架)</span></span>
              </template>
            </el-table-column>
            <el-table-column label="简介"
                             width="350"
                             prop="comicContent">
            </el-table-column>
            <el-table-column label="状态"
                             width="200">
              <template slot-scope="scope">
                <span>{{scope.row.comicStatus | cmStatusFilter(scope.row.comicCurrentEpisodes, comicStatusDict)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="标签"
                             width="300">
              <template slot-scope="scope">
                <span>{{scope.row.comicLabel | cmLabelFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column label="时间"
                             width="200"
                             prop="comicTime">
            </el-table-column>
            <el-table-column label="操作"
                             width="180">
              <template>
                <button type="button"
                        class="btn btn-warning btn-twitter text-white font-size-14"
                        v-if="$storageUtil.getManagerMsg().managerPermission.includes('update')">
                  <i class="fa fa-pencil-square-o mr-2"></i>修改
                </button>
                <button type="button"
                        class="btn btn-warning btn-twitter text-white font-size-14"
                        v-if="!$storageUtil.getManagerMsg().managerPermission.includes('update')">
                  <i class="fa fa-file-text-o mr-2"></i>详情
                </button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </div>

    <!-- 数据表格信息及分页component -->
    <business-pagination :pageInfo="pageInfo"
                         @currentPageChangeImpl="currentPageChangeImpl"></business-pagination>

  </div>
</template>

<script>
import BusinessPagination from '@components/BusinessPagination.vue'

export default {
  name: 'BusinessComicInfo',
  components: {
    BusinessPagination
  },
  data () {
    return {
      selectForm: {
        comicName: '',
        comicStatus: '',
        comicShelfStatus: '',
        comicTag: []
      },
      pageInfo: {},
      currentPageNum: 1,
      multipleSelection: [],
      comicLabelDict: [],
      comicStatusDict: [],
      comicUpdtTimeDict: [],
      comicUpdtStatusDict: [],
      comicShelfStatusDict: []
    }
  },
  methods: {
    async getSysDict () {
      this.comicStatusDict = await this.$sysDictUtil.get('comicStatus')
      this.comicShelfStatusDict = await this.$sysDictUtil.get('comicShelfStatus')
      this.comicLabelDict = await this.$sysDictUtil.get('comicLabel')
    },
    getPage () {
      let sendData = this.selectForm
      sendData.pageNum = this.currentPageNum
      sendData.pageSize = 10
      this.$axios({
        method: 'post',
        url: '/api/comic/getPage',
        data: JSON.stringify(sendData),
        responseType: 'json'
      }).then(res => {
        if (res.data.code === 200) {
          this.pageInfo = res.data.data
        } else if (res.data.code === 100) {
          this.pageInfo = []
        } else if (res.data.code === 500) {
          this.$notify.error({
            title: '错误',
            message: res.data.msg,
            duration: 0
          })
        }
      })
    },
    selectContent () {
      this.currentPageNum = 1
      this.getPage()
    },
    currentPageChangeImpl (val) {
      this.currentPageNum = val
      this.getPage()
    },
    tbCheckChange (val) {
      this.multipleSelection = val
    },
    deleteBatch () {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请至少选择一项删除')
      } else {
        this.$confirm('确定要删除选中项吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let sendData = new FormData()
          sendData.append('ids', this.multipleSelection.map(selt => selt.id))
          this.$axios({
            method: 'post',
            url: '/api/comic/deleteBatchByIds',
            data: sendData,
            responseType: 'json'
          }).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg)
              this.multipleSelection = []
              this.getPage()
            } else if (res.data.code === 100) {
              this.$message.success(res.data.msg)
            } else if (res.data.code === 500) {
              this.$notify.error({
                title: '错误',
                message: res.data.msg,
                duration: 0
              })
            }
          })
        }).catch(() => { })
      }

    }
  },
  mounted () {
    this.getSysDict()
    this.getPage()
  }
}
</script>

<style scoped>
/* el表单标签重写（颜色修改） */
.r1 .c2 /deep/ .el-form-item__label {
  color: #f8f9fa;
}

/* el表格重写 */
.r2 .c1 /deep/ .el-table,
.r2 .c1 /deep/ .el-table__expanded-cell {
  background-color: #15202b;
}
.r2 .c1 /deep/ .el-table th,
.r2 .c1 /deep/ .el-table tr {
  background-color: #15202b;
}
.r2 .c1 /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #111a22;
}
.r2 .c1 /deep/ .el-table td,
.r2 .c1 /deep/ .el-table th.is-leaf {
  border-bottom: 1px solid #15202b;
}
.r2 .c1 /deep/ .el-table::before {
  background: #15202b;
}
.r2 .c1 /deep/ .el-table {
  color: #f8f9fa;
}
.r2 .c1 /deep/ .el-table td,
.r2 .c1 /deep/ .el-table th {
  text-align: center;
}
.r2 .c1 /deep/ .el-table thead {
  color: #f8f9fa;
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
</style>
