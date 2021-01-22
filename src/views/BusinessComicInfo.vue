<template>
  <div>
    <div class="row mt-4 r1">

      <div class="col-2">
        <div class="btn-group float-left">
          <button type="button"
                  class="btn btn-info btn-twitter font-size-14">
            <i class="fa fa-plus-circle mr-2"></i>添加
          </button>
          <button type="button"
                  class="btn btn-danger btn-twitter font-size-14">
            <i class="fa fa-trash mr-2"></i>删除
          </button>
        </div>
      </div>

      <div class="col-10 c2">
        <el-form inline
                 :model="selectForm"
                 label-width="4rem"
                 label-suffix=":"
                 size="small"
                 class="float-right">
          <el-form-item label="番剧名"
                        prop="comicName">
            <el-input v-model="selectForm.comicName"></el-input>
          </el-form-item>
          <el-form-item label="状态"
                        prop="comicStatus">
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
