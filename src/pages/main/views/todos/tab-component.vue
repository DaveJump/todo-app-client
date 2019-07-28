<template>
  <div class="list-wrap">
    <van-list
      v-model="loadingBottom"
      :finished="editing || loadMoreFinished"
      @load="handleLoadMore">
      <van-search placeholder="输入待办名称搜索" background="none" v-model="searchText"></van-search>
      <van-pull-refresh v-model="loadingTop" @refresh="fetch(true)" :disabled="editing">
        <empty-data v-if="!list.length && !this.loadingBottom">空空如也</empty-data>
        <div class="list-content" v-if="list.length">
          <van-swipe-cell
            v-for="(item, index) in list" :key="item._id"
            :right-width="item.todoStatus === 1 ? 58 : 116"
            :disabled="editing"
            :on-close="handleSwipeClose">
            <van-checkbox-group v-model="selected">
              <van-cell-group>
                <van-cell
                  class="todo-item"
                  :title="item.todoName"
                  @click="handleClickCell(index, item)"
                  clickable>
                  <div slot="title">
                    <div :class="{'done': +item.todoStatus === 1}">{{item.todoName}}</div>
                    <div class="van-cell__label" :class="{'done': +item.todoStatus === 1}">{{item.desc}}</div>
                  </div>
                  <van-checkbox class="checkbox" v-if="editing" :name="item._id" :ref="`${item._id}_checkbox`" />
                  <div class="value">
                    <div class="date">{{getTodoDate(item)}}</div>
                    <div class="done-icon"><van-icon name="completed" v-if="+item.todoStatus === 1" /></div>
                  </div>
                </van-cell>
              </van-cell-group>
            </van-checkbox-group>
            <div slot="right" class="slide-buttons__right">
              <span
                style="background: #38f;color: #fff;"
                v-if="item.todoStatus !== 1"
                @click="handleCompleteTodo(item)"
              >
                完成
              </span>
              <!-- <span>编辑</span> -->
              <span style="background: #f44;color: #fff;" @click="handleDelTodo(item)">删除</span>
            </div>
          </van-swipe-cell>
          <div class="no-more" v-if="loadMoreFinished">没有更多啦</div>
        </div>
      </van-pull-refresh>
    </van-list>
  </div>
</template>

<script>
import moment from 'moment'
import { debounce } from 'lodash'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'TabComponent',
  props: {
    fetchMethod: {
      type: Function,
      default: () => () => {}
    }
  },
  data () {
    return {
      list: [],
      total: 0,
      page: 0,
      pageSize: 25,
      loadingTop: false,
      loadingBottom: false,
      loadMoreFinished: false,
      selected: [],
      searchText: ''
    }
  },
  computed: {
    ...mapState({
      editing: state => state.todos.editing
    })
  },
  watch: {
    editing (val) {
      if (!val) {
        this.selected = []
      }
    },
    selected (val) {
      this.changeSelected(val)
    },
    searchText (val) {
      this.handleSearch(val)
    }
  },
  methods: {
    ...mapActions([
      'changeSelected'
    ]),
    handleCompleteTodo (item) {
      this.$emit('complete-todo', item)
    },
    handleDelTodo (item) {
      this.$emit('delete-todo', item)
    },
    async fetch (refresh = false) {
      if (refresh) {
        this.page = 1
      }
      try {
        let results = await this.fetchMethod({
          page: this.page,
          page_size: this.pageSize,
          todo_name: this.searchText
        })

        this.loadMoreFinished = false

        let { list = [], total = 0 } = results || {}

        this.total = total
        this.list = this.loadMoreFinished || refresh ? list : [...this.list, ...list]
        this.loadMoreFinished = (this.list.length >= this.total) || !this.list.length
      } catch (e) {
        console.error(e)
        this.loadMoreFinished = true
      } finally {
        this.loadingTop = false
        this.loadingBottom = false
      }
    },
    handleLoadMore () {
      !this.loadMoreFinished && this.page++
      this.fetch()
    },
    getTodoDate (item) {
      return moment(new Date(item.createTime)).format('YYYY-MM-DD')
    },
    handleClickCell (index, item) {
      let key = item._id

      if (!this.editing) {
        let query = this.$route.query
        this.$router.push({ path: '/todo', name: 'todoDetail', params: { todoId: key }, query })
      } else {
        let ckb = this.$refs[`${key}_checkbox`]
        if (ckb && ckb.length) {
          ckb[0].toggle()
          this.$nextTick(() => {
            this.changeSelected(this.selected)
          })
        }
      }
    },
    handleSwipeClose (clickPosition, instance) {
      if (['outside', 'cell'].includes(clickPosition)) {
        instance.close()
      }
    },
    handleSearch: debounce(function (val) {
      this.fetch(true)
    }, 600)
  }
}
</script>
