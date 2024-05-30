import request from '@api/baseRequest'

// 分页查询系统角色
function getSysRolePage (params, success, warn) {
  request.post('/api/sys/role/getPage', JSON.stringify(params), success, warn)
}

// 添加系统角色
function insertSysRole (params, success, warn) {
  request.post('/api/sys/role/insert', JSON.stringify(params), success, warn)
}

// 修改系统角色
function updateSysRole (params, success, warn) {
  request.put('/api/sys/role/update', JSON.stringify(params), success, warn)
}

// 查询系统角色（根据组织）
function getRoleByOrg (params, success) {
  request.get(`/api/sys/role/getByOrg/${params}`, null, success)
}

export {
  getSysRolePage,
  insertSysRole,
  updateSysRole,
  getRoleByOrg
}