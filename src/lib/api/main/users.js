import _fetch from 'api/handlers'

const usersAPI = {
  // 修改密码
  changePassword ({ data, options }) {
    return _fetch('PUT', `/user/password`, data, options)
  },
  login ({ data, options }) {
    return _fetch('PUT', '/auth', data, options)
  },
  register ({ data, options }) {
    return _fetch('POST', '/auth', data, options)
  }
}

export default usersAPI
