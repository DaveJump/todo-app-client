import * as types from './type-defs'

export default {
  changeEditState ({ commit }, val) {
    commit(types.CHANGE_EDIT_STATE, val)
  },
  changeSelected ({ commit }, val) {
    commit(types.CHANGE_SELECTED, val)
  }
}
