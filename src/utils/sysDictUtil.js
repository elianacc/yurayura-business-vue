import axios from 'axios'
import qs from 'qs'

export default {
  // 字典获取方法
  async get (dictCode) {
    let dictData = ''
    await axios({
      method: 'post',
      url: '/api/sys/dict/getByDictCode',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: qs.stringify({ dictCode }),
      responseType: 'json'
    }).then(res => {
      if (res.data.code == 200) {
        dictData = res.data.data
      } else if (res.data.code == 100) {
        console.log(res.data.msg)
      } else if (res.data.code == 500) {
        console.log('字典编码：' + dictCode + '对应系统数据字典获取异常')
      }
    })
    return dictData
  }
}