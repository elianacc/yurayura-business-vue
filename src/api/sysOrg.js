import request from '@api/baseRequest'

// 查询所有系统组织
function getSysOrgAll (success) {
  request.get('/api/sys/org/getAll', null, success)
}

//分页查询系统组织
function getSysOrgPage (params, success, warn) {
  request.post('/api/sys/org/getPage', JSON.stringify(params), success, warn)
}

// 添加系统组织
function insertSysOrg (params, success, warn) {
  request.post('/api/sys/org/insert', JSON.stringify(params), success, warn)
}

// 修改系统组织
function updateSysOrg (params, success, warn) {
  request.put('/api/sys/org/update', JSON.stringify(params), success, warn)
}


export {
  getSysOrgAll,
  getSysOrgPage,
  insertSysOrg,
  updateSysOrg
}