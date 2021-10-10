<template>
  <div>
    <el-radio-group v-model="checkedVal">
      <el-radio v-for="item in dictListByCode"
                :label="item.dictVal"
                :key="item.id"
                border>
        {{item.dictName}}
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: 'SysDictRadioGroup',
  props: {
    value: String,
    dictCode: String,
    disabled: { type: Boolean, default: false }
  },
  data () {
    return {
      checkedVal: this.value
    }
  },
  watch: {
    value (val) {
      this.checkedVal = val
    },
    checkedVal (val) {
      this.$emit('input', val)
    }
  },
  computed: {
    dictListByCode () {
      let dictListByCode = this.$store.getters['dict/dictList'].filter(dict => dict.dictCode === this.dictCode)
      return dictListByCode
    }
  }
}
</script>

<style scoped>
</style>