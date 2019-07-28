<template>
  <div class="settings">
    <van-nav-bar title="设置" fixed left-arrow @click-left="handleBack"></van-nav-bar>

    <div class="block">
      <span class="block__title">账户</span>
      <van-cell-group>
        <van-cell title="修改密码" is-link @click="redirectTo('change-pwd')" />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    handleBack () {
      this.$router.back()
    },
    redirectTo (path) {
      let query = this.$route.query
      this.$router.push({ path: `/settings/${path}`, query })
    }
  }
}
</script>

<style scoped lang="scss">
.settings{
  @extend %single-page-common;
}
</style>
