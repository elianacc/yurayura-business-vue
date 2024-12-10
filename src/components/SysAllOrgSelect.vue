<template>
  <div>
    <el-select v-model="selectedVal"
               clearable
               :placeholder="placeholder"
               :disabled="disabled">
      <el-option v-for="item in allOrg"
                 :key="item.id"
                 :value="item.id"
                 :label="item.orgName">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { getSysOrgAll } from '@api/sysOrg'

export default {
  name: 'SysAllOrgSelect',
  props: {
    value: { type: [String, Number] },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  data () {
    return {
      selectedVal: this.value,
      allOrg: []
    }
  },
  watch: {
    value (val) {
      this.selectedVal = val
    },
    selectedVal (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    getAllOrg () {
      getSysOrgAll(success => {
        this.allOrg = success.data
      })
    }
  },
  mounted () {
    this.getAllOrg()
  }
}
</script>

<style scoped>
</style>
