import axios from 'axios'

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
    console.log('错误:' + err.response)
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