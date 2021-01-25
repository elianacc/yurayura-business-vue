<template>
  <div>
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
                 class="float-right">
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
            <div class="btn-group">
              <button class="btn btn-primary btn-twitter font-size-14"
                      type="submit">
                <i class="fa fa-filter mr-2"></i>查询
              </button>
              <button class="btn btn-danger btn-twitter font-size-14"
                      type="button">
                <i class="fa fa-eraser mr-2"></i>清空
              </button>
            </div>
          </el-form-item>
        </el-form>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessComicInfo',
  data () {
    return {
      selectForm: {
        comicName: '',
        comicStatus: '',
        comicShelfStatus: '',
        comicTag: []
      },
      comicLabelDict: '',
      comicStatusDict: '',
      comicUpdtTimeDict: '',
      comicUpdtStatusDict: '',
      comicShelfStatusDict: ''
    }
  },
  methods: {
    async getSysDict () {
      this.comicStatusDict = await this.$sysDictUtil.get('comicStatus')
      this.comicShelfStatusDict = await this.$sysDictUtil.get('comicShelfStatus')
      this.comicLabelDict = await this.$sysDictUtil.get('comicLabel')
    }
  },
  mounted () {
    this.getSysDict()
  }
}
</script>

<style scoped>
.r1 .c2 /deep/ .el-form-item__label {
  color: #fff;
}
</style>
