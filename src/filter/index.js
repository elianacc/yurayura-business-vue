export default {
  cmStatusFilter (status, currentEpisodes, arrCmStatus) {
    let res = ''
    if (parseInt(status) === 0) {
      res = '已完结：全' + currentEpisodes + '话'
    } else {
      arrCmStatus.forEach((cmStatus, index) => {
        if (parseInt(status) === index) {
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