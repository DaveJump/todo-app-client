import _fetch from 'api/handlers'

const todosAPI = {
  // 获取todos
  getTodos ({ data, params, options }) {
    let { category } = params
    return _fetch('GET', `/categories/${category}/todos`, data, options)
  },
  // 获取单个todo信息
  getTodoById ({ data, options }) {
    return _fetch('GET', `/todo`, data, options)
  },
  // 新增todo
  addTodo ({ data, params, options }) {
    let { category } = params
    return _fetch('POST', `/categories/${category}/todo`, data, options)
  },
  // 批量修改todos
  updateTodos ({ data, options }) {
    return _fetch('PUT', `/todos`, data, options)
  },
  // 批量删除todos
  deleteTodos ({ data, options }) {
    return _fetch('DELETE', `/todos`, data, options)
  }
}

export default todosAPI
