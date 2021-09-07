import axios from 'axios'

// 解决和后端session不同步的问题，让axios请求带上cookie
axios.defaults.withCredentials = true
// axios默认添加ajax请求头标识
axios.defaults.headers = { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json;charset=utf-8' }

function apiAxios (method, url, params, success, header) {
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    headers: header,
  }).then(res => {
    success(res.data)
  }).catch(err => {
    console.log(`axios请求错误:${err.message}`)
  })
}

export default {
  get (url, params, success, header) {
    return apiAxios('GET', url, params, success, header)
  },
  post (url, params, success, header) {
    return apiAxios('POST', url, params, success, header)
  },
  put (url, params, success, header) {
    return apiAxios('PUT', url, params, success, header)
  },
  delete (url, params, success, header) {
    return apiAxios('DELETE', url, params, success, header)
  }
}