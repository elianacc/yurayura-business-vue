export default {
  cmStatusFilter (status, currentEpisodes, arrCmStatus) {
    let res = ''
    if (parseInt(status) === 0) {
      res = '已完结：全' + currentEpisodes + '话'
    } else {
      arrCmStatus.forEach(cmStatus => {
        if (parseInt(status) === parseInt(cmStatus.dictVal)) {
          res = cmStatus.dictName + '：更新至第' + currentEpisodes + '话'
        }
      })
    }
    return res
  },
  cmLabelFilter (value) {
    let arrCmLabel = value.split(',')
    arrCmLabel = arrCmLabel.filter(label => label !== '')
    return arrCmLabel.toString()
  },
  managerPermissionFilter (value) {
    let permArr = value.split(',')
    let permNewArr = []
    permArr.forEach(perm => {
      switch (perm) {
        case 'sys':
          permNewArr.push('系统管理')
          break;
        case 'insert':
          permNewArr.push('添加')
          break;
        case 'delete':
          permNewArr.push('删除')
          break;
        case 'update':
          permNewArr.push('修改')
          break;
        case 'select':
          permNewArr.push('查询')
          break;
      }
    })
    return permNewArr.toString()
  }
}