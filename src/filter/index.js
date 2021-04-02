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
  }
}