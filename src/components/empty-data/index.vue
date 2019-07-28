<template>
  <div class="empty-data">
    <p><i class="iconfont icon-no-data"></i></p>
    <p><slot>暂无数据</slot></p>
  </div>
</template>

<script>
export default {
  name: 'empty-data'
}
</script>

<style lang="scss" scoped>
  .empty-data{
    text-align: center;
    color: $placeholderColor;
    font-size: 14px;
    height: calc(100vh - 200px);
    @extend %display-flex;
    @extend %flex-item-center;
    @extend %flex-dir-col;
    @extend %flex-center;
    i {
      color: inherit;
      font-size: 68px;
    }
    p{
      margin: 2px 0;
    }
  }
</style>
