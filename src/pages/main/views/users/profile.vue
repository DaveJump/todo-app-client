<template>
  <div class="profile">
    <div class="profile__user-info van-hairline--bottom">
      <van-icon name="user-circle-o user-info__portrait"></van-icon>
      <p>{{userName}}</p>
    </div>
    <div class="profile__nav-list">
      <van-cell title="设置" icon="setting-o" is-link @click="redirectTo('settings')"></van-cell>
    </div>
  </div>
</template>

<script>
import { getStorage } from 'utils'

export default {
  name: 'Profile',
  data () {
    return {
      reserveUserName: '未登录',
      userName: ''
    }
  },
  methods: {
    getUsernameFromCookie () {
      let info = getStorage('todoAppUserInfo')
      let userInfo = info ? JSON.parse(info) : {}
      let { username = this.reserveUserName } = userInfo
      return username
    },
    redirectTo (pageName) {
      let query = this.$route.query
      this.$router.push({ path: `/${pageName}`, query })
    }
  },
  mounted () {
    this.userName = this.getUsernameFromCookie()
  }
}
</script>

<style lang="scss" scoped>
.profile{
  &__user-info{
    text-align: center;
    color: $subTitleColor;
    padding: 15px 0;
    margin-bottom: 10px;
    background-color: #fff;
    p {
      margin: 0;
      margin-top: 5px;
    }
  }
  .user-info{
    &__portrait{
      font-size: 50px;
    }
  }
}
</style>
