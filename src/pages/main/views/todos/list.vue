<template>
  <div class="todo-list">
    <van-tabs v-model="tabActive" sticky>
      <van-tab
        v-for="tab in categories"
        :key="tab.id"
        :disabled="editing">
        <div slot="title" class="tab-title">
          <span class="category-spot" :class="`${tab.value}`"></span>
          <span>{{tab.label}}</span>
        </div>
        <tab-component
          ref="tabComponent"
          :fetch-method="getTodoList"
          @complete-todo="todo => { batchOperate('update', todo) }"
          @delete-todo="todo => { batchOperate('delete', todo) }"
        />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import API from 'api/main'
import { categories } from './vars'
import { cloneDeep } from 'lodash'
import tabComponent from './tab-component'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'TodoList',
  components: {
    tabComponent
  },
  data () {
    return {
      categories: cloneDeep(categories),
      tabActive: 0
    }
  },
  computed: {
    ...mapState({
      editing: state => state.todos.editing,
      selectedTodos: state => state.todos.selectedTodos
    })
  },
  methods: {
    ...mapActions([
      'changeEditState'
    ]),
    async getTodoList (data) {
      try {
        let results = await API.todosAPI.getTodos({
          data,
          params: {
            category: this.tabActive
          }
        })
        return results
      } catch (e) {
        console.error(e)
      }
    },
    batchOperate (type, todo) {
      this.$dialog.confirm({
        title: '提示',
        message: `确认${type === 'update' ? '完成' : '删除'}待办?`
      })
        .then(async () => {
          let method = type === 'update' ? 'updateTodos' : 'deleteTodos'

          try {
            this.$toast({
              type: 'loading',
              forbidClick: true,
              duration: 0
            })
            await API.todosAPI[method]({
              data: Object.assign(
                {
                  todos: todo ? [todo._id] : this.selectedTodos
                },
                type === 'update' ? { set: { todoStatus: 1 } } : {}
              )
            })
            this.changeEditState(false)
            this.handleRefreshList()
          } catch (e) {
            console.error(e)
          } finally {
            this.$toast.clear()
          }
        })
        .catch(() => {})
    },
    handleRefreshList () {
      let tab = this.$refs.tabComponent[+this.tabActive]
      tab && tab.fetch(true)
    }
  }
}
</script>

<style lang="scss">
.todo-list{
  padding-top: 52px;
  height: calc(100vh - 52px);
  overflow: hidden;
  .tab-title{
    > span{
      display: inline-block;
      &:first-of-type{
        margin-right: 3px;
      }
    }
    .category-spot{
      width: 7px;
      height: 7px;
      border-radius: 50%;
      border: 1px solid transparent;
      &.unclassified{
        border-color: #d8d8d8;
        background: transparent;
      }
      &.normal{
        background: #d8d8d8;
      }
      &.delay{
        background: #ff976a;
      }
      &.urgent{
        background: #f44;
      }
    }
  }
  .list-wrap{
    height: calc(100vh - 99px);
    padding-top: 2px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    .list-content{
      min-height: calc(100vh - 145px);
      .no-more{
        text-align: center;
        color: $placeholderColor;
        padding: 15px 0;
        font-size: 12px;
      }
    }
    .todo-item{
      .checkbox{
        float: right;
        margin-left: 10px;
      }
      .date{
        font-size: 12px;
        color: $subTitleColor;
      }
      .done-icon{
        height: 19px;
        margin-top: 2px;
        color: #1989fa;
        font-size: 16px;
      }
      .done{
        color: $placeholderColor;
        text-decoration: line-through;
      }
      .van-checkbox{
        height: 100%;
        @extend %display-flex;
        @extend %flex-end;
        @extend %flex-item-center;
      }
    }
    .slide-buttons__right{
      height: 100%;
      > span{
        height: 61px;
        line-height: 41px;
        display: inline-block;
        padding: 10px 15px;
        background: #eee;
        box-sizing: border-box;
      }
    }
    .item-right-icon{
      margin-top: 10px;
      font-size: 16px;
      color: $subTitleColor;
    }
  }
}
</style>
