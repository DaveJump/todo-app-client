import * as types from './type-defs'

export default {
  [types.CHANGE_EDIT_STATE] (state, val) {
    state.editing = val
  },
  [types.CHANGE_SELECTED] (state, val) {
    state.selectedTodos = val
  }
}
